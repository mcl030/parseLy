const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { json } = require('express');

const puppeteer = require('puppeteer');
const models = require('../models/recipeModel');

const recipeController = {};

recipeController.checkDB = async (req, res, next) => {
  const url = req.headers.url;
  res.recipe = {};
  try {
    const results = await models.Recipe.find({url: url})
    if (results.length > 0) {
      res.recipe.foundRecipe = true;
      return next();
    } else {
      return next();
    }
  }
  catch(e) {
    return next({
      log: 'Error occurred checking database',
      message: { err: e }
    })
  }
}



recipeController.jsonld = async (req, res, next) => {
  if (res.recipe.foundRecipe === true) {
    return next();
  }

  const url = req.headers.url;
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--window-size=300,300'],
    ignoreHTTPSErrors: true
  });
  let script;
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('script[type="application/ld+json"]');
    script = await page.$eval('script[type="application/ld+json"]', node => node.textContent);
    await browser.close();
  }
  catch(e) {
    await browser.close();
    return next({
      log: 'Error occurred while using puppeteer',
      message: { err: e }
    })
  }
  finally {
    await browser.close();
  }

  script = JSON.parse(script);
  if (Array.isArray(script)) {
    script = script[0];
  }
  if (Array.isArray(script.author) && script.author) {
    script.author = script.author[0];
  }

  const recipeInstructions = [];
  if (script.recipeInstructions){
    for (let i = 0; i < script.recipeInstructions.length; i += 1) {
      recipeInstructions.push(script.recipeInstructions[i].text);
    }
  }
  

  function parseISO8601Duration (duration) {
    const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
    const matches = duration.match(iso8601DurationRegex);

    return {
      sign: matches[1] === undefined ? '+' : '-',
      years: matches[2] === undefined ? 0 : matches[2],
      months: matches[3] === undefined ? 0 : matches[3],
      weeks: matches[4] === undefined ? 0 : matches[4],
      days: matches[5] === undefined ? 0 : matches[5],
      hours: matches[6] === undefined ? 0 : matches[6],
      minutes: matches[7] === undefined ? 0 : matches[7],
      seconds: matches[8] === undefined ? 0 : matches[8]
    };
  };

  if (script.url) {res.recipe.url = url};
  if (script.name) {res.recipe.name = script.name};
  if (script.author) {res.recipe.author = script.author};
  if (script.image) {res.recipe.image = script.image};
  if (script.recipeIngredient) {res.recipe.recipeIngredient = script.recipeIngredient};
  if (script.recipeInstructions) {res.recipe.recipeInstructions = recipeInstructions};
  if (script.cookTime) {res.recipe.cookTime = parseISO8601Duration(script.cookTime).hours + " hours and " + parseISO8601Duration(script.cookTime).minutes + " minutes"};
  if (script.cookTime) {res.recipe.totalTime = parseISO8601Duration(script.totalTime).hours + " hours and " + parseISO8601Duration(script.totalTime).minutes + " minutes"};

  models.Recipe.create(res.recipe);

  return next();
}

recipeController.getRecipes = async (req, res, next) => {
  try {
    const results = await models.Recipe.find({});
    res.locals = results;
    return next();
  }
  catch(e) {
    return next({
      log: 'Error occurred while getting recipes',
      message: { err: e }
    })
  }
}



module.exports = recipeController;
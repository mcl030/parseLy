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

  res.recipe.createdRecipe = false;

  const url = req.headers.url;
  
  let script;
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--single-process', '--no-zygote', '--window-size=300,300'],
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('script[type="application/ld+json"]');
    script = await page.$eval('script[type="application/ld+json"]', node => node.textContent);
    await page.close();
    await browser.close();
  } catch(e) {
    await page.close();
    await browser.close();
    return next({
      log: 'Error occurred while using puppeteer',
      message: { err: e }
    })
  } 

  script = JSON.parse(script);

  if (script['@graph']) {
    let foundRecipe = false;
    const graph = script['@graph'];
    for (let i = 0; i < graph.length; i += 1) {
      if (graph[i]['@type'] === 'Recipe') {
        foundRecipe = true;
        script = graph[i];
      }
    }
    if (foundRecipe === false) {
      return next({
        log: 'Error: no recipe found in application/ld+json',
      })
    }
  }

  if (Array.isArray(script)) { script = script[0] };
  if (Array.isArray(script.author) && script.author) { script.author = script.author[0] };
  if (typeof script.author === 'object') { script.author = script.author.name };
  if (Array.isArray(script.image)) { script.image = script.image[0] };
  if (!Array.isArray(script.image) && typeof script.image === 'object') { script.image = script.image.url };

  let recipeInstructions = [];
  if (Array.isArray(script.recipeInstructions) && script.recipeInstructions){
    for (let i = 0; i < script.recipeInstructions.length; i += 1) {
      if (script.recipeInstructions[i].itemListElement) {
        for (let j = 0; j < script.recipeInstructions[i].itemListElement.length; j += 1) {
          recipeInstructions.push(script.recipeInstructions[i].itemListElement[j].text);
        }
      } else {
        recipeInstructions.push(script.recipeInstructions[i].text);
      }
      
    }
  }
  if (typeof script.recipeInstructions === 'string') { recipeInstructions = script.recipeInstructions.split(/\n/) };


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

  res.recipe.url = url;
  res.recipe.name = script.name;
  res.recipe.author = script.author;
  if (script.image) {res.recipe.image = script.image};
  res.recipe.recipeIngredient = script.recipeIngredient;
  res.recipe.recipeInstructions = recipeInstructions;
  if (script.cookTime) {res.recipe.cookTime = parseISO8601Duration(script.cookTime).hours + " hours and " + parseISO8601Duration(script.cookTime).minutes + " minutes"};
  if (script.cookTime) {res.recipe.totalTime = parseISO8601Duration(script.totalTime).hours + " hours and " + parseISO8601Duration(script.totalTime).minutes + " minutes"};

  models.Recipe.create(res.recipe);

  res.recipe.createdRecipe = true;

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
const express = require('express');
const fetch = require('node-fetch');
const recipeController = require('../controllers/recipeController');

const router = express.Router();



router.post('/', recipeController.checkDB, recipeController.jsonld, (req, res) => {
  return res.status(200).json(res.recipe);
})

router.get('/', recipeController.getRecipes, (req, res) => {
  return res.status(200).json(res.locals);
})

router.delete('/', recipeController.deleteRecipe, (req, res) => {
  console.log('deleted?: ', res.recipe.deletedRecipe)
  return res.status(200).json(res.recipe);
})

router.get('/oauth', recipeController.loginGoogle, (req, res) => {
  console.log('made it through google login method')
})

router.get('/id', async (req, res) => {
  const access_token = req.headers.access_code;
  res.recipe = {};
  // https://openidconnect.googleapis.com/v1/userinfo
  // https://www.googleapis.com/oauth2/v2/userinfo

  const fetchResult = await fetch(`https://openidconnect.googleapis.com/v1/userinfo?access_token=${access_token}`, {
    method: 'get', 
  })
  const fetchJson = await fetchResult.json();
  res.recipe.id = fetchJson.sub;

  return res.status(200).send(JSON.stringify(res.recipe));
})


module.exports = router;
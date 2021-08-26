const express = require('express');

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


module.exports = router;
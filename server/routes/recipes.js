const express = require('express');

const recipeController = require('../controllers/recipeController');

const router = express.Router();



router.post('/', recipeController.checkDB, recipeController.jsonld, (req, res) => {
  return res.status(200).json(res.recipe);
})

router.get('/', recipeController.getRecipes, (req, res) => {
  return res.status(200).json(res.locals);
})


module.exports = router;
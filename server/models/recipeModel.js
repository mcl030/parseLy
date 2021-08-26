const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://matt:fS9B8cP4K48wbJYe@cluster0.axfol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'parseLy'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  url: {type: String, required: true},
  name: {type: String, required: true},
  author: {type: String, required: true},
  image: String,
  cookTime: String,
  totalTime: String,
  recipeIngredient: {type: Array, items: {type: String}, required: true},
  recipeInstructions: {type: Array, items: {type: String}, required: true},
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = {
  Recipe
};
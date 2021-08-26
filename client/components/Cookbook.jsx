import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fetch from 'node-fetch';

class Cookbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    }


    this.parseRecipe = this.parseRecipe.bind(this);
  }

  componentDidMount() {
    fetch('/recipe', {
      method: 'get'
    })
    .then(res => res.json())
    .then(recipes => {
      if (!Array.isArray(recipes)) recipes = [];
      return this.setState({
        recipes
      });
    })
    .catch(e => console.log('Recipes did not mount correctly: ', e))
  }

  parseRecipe(e) {
    const url = e.target.previousSibling.value;
    fetch('/recipe', {
      method: 'POST', 
      headers: {url: url}
    })
    .then(res => res.json())
    .then(res => {
      if (res.foundRecipe === true) {
        alert('Recipe already exists!');
      } 
      if (res.createdRecipe === true) {
        alert('Recipe created!')
      }
      if (res.createdRecipe === false) {
        alert('Failed to create recipe')
      }
    })
  }

  render() {

    const { recipes } = this.state;

    if (!recipes) return null;

    if (!recipes.length) return (
      <div>Loading recipes...</div>
    );

    const recipeLinks = recipes.map((recipe, i) => {
      return (
        <div key={i} className="recipeContainer">
          <button className="deleteButton" type="button">DELETE</button>
          <Link to={{pathname: '/recipeCard', state: { recipe: recipes[i]}}}>
            <div>{recipe.name} by {recipe.author}</div>
          </Link>
        </div>
      );
    });

    return (
      <div id="mainPage">
        <form id="urlConverterForm">
          <input id="urlInput" placeholder="Enter recipe URL here!"></input>
          <button id="urlSubmit" type="button" onClick={e => this.parseRecipe(e)}>Parse!</button>
        </form>
        <div id="recipes">
          {recipeLinks}
        </div>
      </div>
    )
  }
}


export default Cookbook;
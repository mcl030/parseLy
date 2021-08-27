import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fetch from 'node-fetch';

class Cookbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      hashStatus: false, 
      currentUser: "",
      currentlyLoggedIn: false,
    }

    this.googleLogin = this.googleLogin.bind(this);
    this.parseRecipe = this.parseRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.googleCheck = this.googleCheck.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.getRecipes();
  }

  logout() {
    this.setState({
      recipes: [],
      hashStatus: false, 
      currentUser: "",
      currentlyLoggedIn: false,
    })
    window.location.hash = "";
    console.log('After logging out, currentUser: ', err)
    this.getRecipes();
  }

  async googleCheck() {
    const hash = (new URL(document.location)).hash;
    const access_code = hash.match(/(?<=#access_token=)(.*)(?=&token_type)/)[0]
    await fetch('/recipe/id', {
      method: 'get', 
      headers: {access_code: access_code}
    })
    .then(res => res.json())
    .then(res => {
      return this.setState({
        currentUser: res.id,
        currentlyLoggedIn: true,
      })
    });


    await this.getRecipes();
  }

  getRecipes() {
    fetch('/recipe', {
      method: 'get', 
      headers: {user: this.state.currentUser}
    })
    .then(res => res.json())
    .then(recipes => {
      if (!Array.isArray(recipes)) recipes = [];
      return this.setState({
        recipes
      });
    })
    .catch(e => console.log('Recipes did not mount correctly: ', e))
    
    this.setState({
      hashStatus: true
    })
  }

  googleLogin() {
    console.log('trying to login w/ google');
    fetch('/recipe/oauth', {
      method: 'get'
    })
  }

  parseRecipe(e) {
    if (this.state.currentlyLoggedIn === false) {
      alert('Must be logged in!')
      return;
    }
    const url = e.target.previousSibling.value;
    const currentUser = this.state.currentUser;
    fetch('/recipe', {
      method: 'POST', 
      headers: {
        url: url, 
        user: currentUser}
    })
    .then(res => res.json())
    .then(res => {
      if (res.foundRecipe === true) {
        alert('Recipe already exists!');
      } 
      if (res.createdRecipe === true) {
        alert('Recipe created!');
        this.getRecipes();
      }
      if (res.createdRecipe === false) {
        alert('Failed to create recipe')
      }
    })
  }

  deleteRecipe(id) {
    console.log(id);
    fetch('/recipe', {
      method: 'DELETE', 
      headers: {id: id}
    })
    .then(res => res.json())
    .then(res => {
      if (res.deletedRecipe === true) {
        alert('Recipe deleted!');
        location.reload();
      }
      if (res.deletedRecipe === false) {
        alert('Failed to delete recipe')
      }
    })
  }

  render() {

    const { recipes } = this.state;

    const recipeLinks = recipes.map((recipe, i) => {
      return (
        <div key={i} className="recipeContainer">
          <button className="deleteButton" type="button" onClick={e => this.deleteRecipe(recipe._id)}>DELETE</button>
          <Link to={{pathname: '/recipeCard', state: { recipe: recipes[i], state: this.state}}}>
            <div>{recipe.name} by {recipe.author}</div>
          </Link>
        </div>
      );
    });

    if (window.location.hash) {
      if (this.state.hashStatus === false) {
        console.log('currentUser: ', this.state.currentUser)
        this.googleCheck();
      } 
    }

    return (
      <div id="mainPage">
        <div id="mainTitle">parseLy</div>
        <form id="googleLogin" action='/recipe/oauth' method='GET'>
          <input id="googleAuthButton" type="submit" value="Login with Google for your recipes!"></input>
        </form>
        <button onClick={e => this.logout()}>Logout!</button>
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
import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import RecipeCard from './RecipeCard.jsx';
import fetch from 'node-fetch';

class App extends Component {
  constructor(props) {
    super(props);

    this.parseRecipe = this.parseRecipe.bind(this);
  }

  parseRecipe(e) {
    const url = e.target.previousSibling.value;
    console.log('App.jsx RECIPE URL: ', url);
    fetch('/recipe', {
      method: 'POST', 
      headers: {url: url}
    })
    .then(res => res.json())
    .then(res => console.log(res))
  }

  render() {
    return (
      <div id="mainPage">
        <form id="urlConverterForm">
          <input id="urlInput" placeholder="Enter recipe URL here!"></input>
          <button id="urlSubmit" type="button" onClick={e => this.parseRecipe(e)}>Parse!</button>
        </form>
        <RecipeCard />
      </div>
    )
  }
}


export default App;
import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import RecipeCard from './RecipeCard.jsx';


class App extends Component {
  constructor(props) {
    super(props);

    this.parseRecipe = this.parseRecipe.bind(this);
  }

  parseRecipe(e) {
    console.log('Event from App.jsx', e);
  }

  render() {
    return (
      <div id="mainPage">
        <form id="urlConverterForm">
          <input id="urlInput" placeholder="Enter recipe URL here!"></input>
          <button id="urlSubmit" type="submit" onClick={e => parseRecipe(e)}>Parse!</button>
        </form>
        <RecipeCard />
      </div>
    )
  }
}


export default hot(App);
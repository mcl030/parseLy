import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import RecipeCard from './RecipeCard.jsx';


class App extends Component {
  render() {
    return (
      <div id="mainPage">
        <form id="urlConverterForm">
          <input placeholder="Enter recipe URL here!"></input>
          <button type="submit">Parse!</button>
        </form>
        <RecipeCard />
      </div>
    )
  }
}


export default hot(App);
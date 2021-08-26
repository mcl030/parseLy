import React, { Component } from 'react';
import IngredientSection from './IngredientSection.jsx';
import PictureSection from './PictureSection.jsx';
import DirectionSection from './DirectionSection.jsx'


class RecipeCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const state = this.props.location.state;

    return (
    <div>
      <title className="recipeTitle">Lasagna Bolognese</title>
      <div>
        <IngredientSection ingredients={state.recipe.recipeIngredient}/>
        <PictureSection />
        <DirectionSection directions={state.recipe.recipeInstructions}/>
      </div>
    </div>
    )
  }
}


export default RecipeCard;
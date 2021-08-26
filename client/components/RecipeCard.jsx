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
    <div className="recipe">
      <div className="recipeName">{state.recipe.name}</div>
      <div className="recipeDetails">
        <IngredientSection ingredients={state.recipe.recipeIngredient}/>
        <PictureSection />
        <DirectionSection directions={state.recipe.recipeInstructions}/>
      </div>
    </div>
    )
  }
}


export default RecipeCard;
import React, { Component } from 'react';
import IngredientSection from './IngredientSection.jsx';
import PictureSection from './PictureSection.jsx';
import DirectionSection from './DirectionSection.jsx'

class RecipeCard extends Component {
  render() {
    return (
    <div>
      <title className="recipeTitle">Lasagna Bolognese</title>
      <div>
        <IngredientSection />
        <PictureSection />
        <DirectionSection />
      </div>
    </div>
    )
  }
}


export default RecipeCard;
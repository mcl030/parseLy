import React, { Component } from 'react';

class IngredientSection extends Component {
  constructor(props) {
    super(props);
  }
  
  
  render() {
    const ingredients = this.props.ingredients;

    const ingredientList = ingredients.map((ingredient, i) => {
      return (
          <li key={i}>{ingredient}</li>
      );
    });
    
    return (
    <div>
      INGREDIENTS: 
      <ul>
        { ingredientList }
      </ul>
    </div>
    )
  }
}


export default IngredientSection;
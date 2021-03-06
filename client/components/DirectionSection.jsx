import React, { Component } from 'react';

class DirectionSection extends Component {
  constructor(props) {
    super(props);
  }
  
  
  render() {
    const directions = this.props.directions;

    const directionsList = directions.map((direction, i) => {
      return (
          <li key={i}>{direction}</li>
      );
    });
    
    return (
    <div className="vertContainer">
      DIRECTIONS: 
      <ol className="list">
        { directionsList }
      </ol>
    </div>
    )
  }
}


export default DirectionSection;
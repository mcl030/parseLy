import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Cookbook from './components/Cookbook'
import RecipeCard from './components/RecipeCard';

const App = props => {
  return (
    <div className="router">
      <main>
        <Switch>
          <Route
            exact
            path="/"
            component={Cookbook}
          />
          <Route
            exact
            path="/recipeCard"
            component={RecipeCard}
          />
        </Switch>
      </main>
    </div>
  );
};

export default App;

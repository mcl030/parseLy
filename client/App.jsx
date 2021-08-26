import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Cookbook from './components/Cookbook'
import RecipeCard from './components/RecipeCard';


const App = props => {
  return (
    <div className="router">
      <main>
        {/*
            NOTE: The syntax below is for React-Router
              - A helpful library for routing with a React app.
              You can learn more about this at:
              https://reacttraining.com/react-router/web/guides/quick-start
        */}
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

const express = require('express');
const path = require('path'); 
const fs = require('fs');
const recipeRouter = require('./routes/recipes');

const app = express();
const PORT = 3000;


app.use(express.json());
// app.use('/recipe/add', editRouter);
// app.use('/recipe/edit', editRouter);
// app.use('/recipe/delete', editRouter);
app.use('/recipe', recipeRouter);

app.use((req, res) => {
  res.sendStatus(404)
})

app.use((err, req, res, next) => {
  defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }
  };
  errObj = Object.assign(defaultErr, err);
  // maybe needs to be turned into json
  return res.status(errObj.status).send(errObj.message)
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
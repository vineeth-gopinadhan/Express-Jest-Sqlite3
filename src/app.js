const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database');
const routes = require('./router');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.use(routes);

module.exports = app;

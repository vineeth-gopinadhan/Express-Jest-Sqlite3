'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./src/database');
const routes = require('./src/router');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.use(routes);

module.exports = app;

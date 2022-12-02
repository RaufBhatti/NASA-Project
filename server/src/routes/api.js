const api = require('express').Router();

api.use('/planets', require('./planets.router'));
api.use('/launches', require('./launches.router'));

module.exports = api;

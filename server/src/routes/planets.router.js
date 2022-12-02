const router = require('express').Router();

const { httpGetAllPlanets } = require('../controllers/planets.controller');

router.route('/').get(httpGetAllPlanets);

module.exports = router;

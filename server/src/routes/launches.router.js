const router = require('express').Router();

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require('../controllers/launches.controller');

router.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);
router.route('/:id').delete(httpAbortLaunch);

module.exports = router;

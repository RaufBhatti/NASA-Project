const {
  getAllLaunches,
  scheduleNewLaunch,
  getLunchById,
  abortLaunchById,
} = require('../models/launches.model');
const { getPagination } = require('../services/query');

const httpGetAllLaunches = async (req, res) => {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};

const httpAddNewLaunch = async (req, res) => {
  let launch = req.body;
  let { mission, rocket, target, launchDate } = launch;
  if (!mission || !rocket || !target || !launchDate) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  launchDate = new Date(launchDate);
  if (isNaN(launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date!',
    });
  }
  try {
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const httpAbortLaunch = async (req, res) => {
  const launchId = +req.params.id;
  try {
    const launchExists = await getLunchById(launchId);
    if (!launchExists) {
      return res.status(404).json({ error: 'Launch not found!' });
    }
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(200).json({ error: 'Launch not aborted' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };

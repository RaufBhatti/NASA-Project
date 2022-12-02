const axios = require('axios');

const Launch = require('./Launch');
const Planet = require('./Planet');

const DEAFULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const populateLaunchesData = async () => {
  console.log('Downloading Launches Data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: 'name',
        },
        {
          path: 'payloads',
          select: 'customers',
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem in downloading launch data!'.red);
    throw new Error('Launch data download failed!');
  }

  console.log({ response: response.data });
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDate['upcoming'],
      success: launchDate['success'],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
  await saveLaunch();
};

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!'.green);
  } else {
    await populateLaunchesData();
  }
};

const findLaunch = async (filter) => {
  return await Launch.findOne(filter);
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await Launch.findOne().sort('-flightNumber');
  if (!latestLaunch) return DEAFULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
};

const getAllLaunches = async (skip, limit) => {
  return await Launch.find({}, '-_id -__v')
    .sort('flightNumber')
    .skip(skip)
    .limit(limit);
};

const getLunchById = async (launchId) => {
  return await findLaunch({ flightNumber: launchId });
};

const saveLaunch = async (launch) => {
  try {
    await Launch.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    );
  } catch (err) {
    console.error(`Save launch failed: ${err}`);
  }
};

const scheduleNewLaunch = async (launch) => {
  const planet = await Planet.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error('No matching planet found');
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
  const aborted = await Launch.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.acknowledged && aborted.modifiedCount === 1;
};

module.exports = {
  loadLaunchesData,
  getLunchById,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};

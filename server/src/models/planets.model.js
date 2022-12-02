const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const Planet = require('./Planet');

const isHabitablePlanet = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
};

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(
          `${countPlanetsFound} Habitable Planets Found!`.brightYellow
        );
        resolve();
      });
  });
};

const getAllPlanets = async () => {
  return await Planet.find({}, '-_id -__v');
};

const savePlanet = async (planet) => {
  try {
    await Planet.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet data: ${err}`);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

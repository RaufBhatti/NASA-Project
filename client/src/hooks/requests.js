import axios from 'axios';
const URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  try {
    const response = await axios.get(`${URL}/planets`);
    return response?.data;
  } catch (err) {
    console.log({ error: err.message });
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  try {
    const response = await axios.get(`${URL}/launches`);
    console.log({ response });
    return response.data?.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (err) {
    console.log({ error: err.message });
  }
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await axios.post(`${URL}/launches`, launch);
  } catch (error) {
    console.log({ error });
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await axios.delete(`${URL}/launches/${id}`);
  } catch (err) {
    console.log({ error: err.message });
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

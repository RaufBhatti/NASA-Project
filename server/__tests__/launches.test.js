const request = require('supertest');

const app = require('../src/app');
const { loadPlanetsData } = require('../src/models/planets.model');
const { mongoConnect, mongoDisconnect } = require('../src/services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /v1/launches', () => {
    test('It should response with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Test POST /v1/launches', () => {
    const completeLaunchData = {
      mission: 'Find Planet',
      rocket: 'SpecX 23',
      target: 'Kepler-442 b',
      launchDate: 'Januray 1, 2030',
    };
    const launchDataWithoutDate = {
      mission: 'Find Planet',
      rocket: 'SpecX 23',
      target: 'Kepler-442 b',
    };

    const launchDataWithInvalidDate = {
      mission: 'Find Planet',
      rocket: 'SpecX 23',
      target: 'Kepler 442b',
      launchDate: 'testing',
    };

    test('It should response with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect(201)
        .expect('Content-Type', /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);
    });
    test('It should catch All fields are required!', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        error: 'All fields are required!',
      });
    });
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date!',
      });
    });
  });
});

const request = require('supertest');
const app = require('../../src/app');

describe('GET /contracts', () => {
  test('returns 404 on no contract', async () => {
    const response = await request(app)
        .get('/contracts')
        .set('profile_id', 5);
    expect(response.status).toBe(404);
  });

  test('returns 401 on invalid profile', async () => {
    const response = await request(app)
        .get('/contracts')
        .set('profile_id', 0);
    expect(response.status).toBe(401);
  });

  test('returns the user contracts', async () => {
    const response = await request(app)
        .get('/contracts')
        .set('profile_id', 6);
    expect(response.status).toBe(200);
    expect(response.body.result.contracts.length).toBe(3);
  });
});

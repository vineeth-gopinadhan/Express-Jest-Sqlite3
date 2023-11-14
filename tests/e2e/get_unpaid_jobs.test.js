const request = require('supertest');
const app = require('../../src/app');

describe('GET /jobs/unpaid', () => {
  test('returns 404 on no unpaid jobs', async () => {
    const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 8);
    expect(response.status).toBe(404);
  });

  test('returns 401 on invalid profile', async () => {
    const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 0);
    expect(response.status).toBe(401);
  });

  test('returns the user unpaid jobs', async () => {
    const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 7);
    expect(response.status).toBe(200);
    expect(response.body.result.jobs.length).toBe(2);
  });
});
const request = require('supertest');
const app = require('../../src/app');

describe('POST /jobs/:job_id/pay', () => {
  test('returns 404 on invalid jobs', async () => {
    const response = await request(app)
        .post('/jobs/15/pay')
        .set('profile_id', 1);
    expect(response.status).toBe(404);
  });

  test('returns 400 if job is already paid', async () => {
    const response = await request(app)
        .post('/jobs/8/pay')
        .set('profile_id', 2);
    expect(response.status).toBe(400);
  });

  test('returns 400 if insufficient balance', async () => {
    const response = await request(app)
        .post('/jobs/5/pay')
        .set('profile_id', 4);
    expect(response.status).toBe(400);
  });

  test('returns 200 if payment success', async () => {
    const response = await request(app)
        .post('/jobs/1/pay')
        .set('profile_id', 1);
    expect(response.status).toBe(200);
  });
});

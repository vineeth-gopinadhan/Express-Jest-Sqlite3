'use strict';

const request = require('supertest');
const app = require('../../../app');

describe('GET /admin/best-profession', () => {
  it('returns 404 on no Job data found', async () => {
    const response = await request(app)
        .get('/admin/best-profession?start=1697389661&end=1700071661')
        .set('profile_id', 5);
    expect(response.status).toBe(404);
  });

  it('returns 401 on invalid profile', async () => {
    const response = await request(app)
        .get('/admin/best-profession?start=1697389661&end=1700071661')
        .set('profile_id', 0);
    expect(response.status).toBe(401);
  });

  it('returns 400 on invalid date', async () => {
    const response = await request(app)
        .get('/admin/best-profession?start=1700071661&end=123123')
        .set('profile_id', 1);
    expect(response.status).toBe(400);
  });

  it('returns the best profession within start and end date', async () => {
    const response = await request(app)
        .get('/admin/best-profession')
        .query({
          start: Math.round(+new Date()/1000) - 10000,
          end: Math.round(+new Date()/1000)
        })
        .set('profile_id', 6);
    expect(response.status).toBe(200);
    expect(response.body.result.best_profession).toBe('Programmer');
  });
});

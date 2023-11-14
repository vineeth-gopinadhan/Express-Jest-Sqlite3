const request = require('supertest');
const app = require('../../src/app');

describe('Profile Routes', () => {
  test('GET /profile/:id returns the correct profile', async () => {
    const response = await request(app).get('/contracts/1');
    expect(response.status).toBe(200);
    expect(response.body.result.contract.id).toBe(1);
  });
});

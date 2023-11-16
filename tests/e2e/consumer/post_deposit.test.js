'use strict';

const request = require('supertest');
const app = require('../../../app');

describe('POST /balances/deposit/:userId', () => {
  it('returns 401 on invalid user', async () => {
    const response = await request(app)
        .post('/balances/deposit/2');
    expect(response.status).toBe(401);
  });

  it('returns 403 if user not authorized to make deposit', async () => {
    const response = await request(app)
        .post('/balances/deposit/2')
        .set('profile_id', 1);
    expect(response.status).toBe(403);
  });

  it('returns 400 if deposit amount is invalid', async () => {
    const response = await request(app)
        .post('/balances/deposit/2')
        .set('profile_id', 2)
        .send({
          deposit_amount: '2'
        });
    expect(response.status).toBe(400);
  });

  it('returns 400 if deposit amount is more than 25% his total of jobs to pay',
      async () => {
        const response = await request(app)
            .post('/balances/deposit/2')
            .set('profile_id', 2)
            .send({
              deposit_amount: 200
            });
        expect(response.status).toBe(400);
      });

  it('returns 200 if deposit is success', async () => {
    const response = await request(app)
        .post('/balances/deposit/2')
        .set('profile_id', 2)
        .send({
          deposit_amount: 2
        });
    expect(response.status).toBe(200);
  });
});

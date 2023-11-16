'use strict';

const { getAdminBesClients } = require('../service');
module.exports = async (req, res, next) => {
  try {
    const { start, end, limit } = req.query;
    const {
      statusCode,
      bestClients
    } = await getAdminBesClients({
      start,
      end,
      limit
    });

    switch (statusCode) {
      case 404:
        res.status(404).send({
          message: 'No Jobs available for the specified time range' });
        break;
      case 400:
        res.status(400).send({
          status: 'nok',
          message: 'Invalid start or end date'
        });
        break;
      case 200:
        res.status(200).send({
          status: 'ok',
          result: {
            best_clients: bestClients
          }
        });
        break;
      default:
        res.status(500).send({
          status: 'nok',
          message: 'Internal Server Error'
        });
    }
  } catch (err) {
    console.error('GET Admin Best Clients, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

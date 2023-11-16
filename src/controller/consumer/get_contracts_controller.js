'use strict';

const { getContracts } = require('../../service');

module.exports = async (req, res, next) => {
  try {
    const { id: profileId, type: profileType } = req.profile;
    const contracts = await getContracts({ profileId, profileType });
    // Check for empty response
    if (!contracts || contracts.length == 0) {
      console.log(
          'GET Contracts, completed with status code ', 404);
      return res.status(404).send({
        message: 'No contract found' });
    }
    console.log(
        'GET Contracts, completed with status code ', 200);
    res.status(200).send({
      status: 'ok',
      result: { contracts }
    });
  } catch (err) {
    console.error('GET Contracts, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

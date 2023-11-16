'use strict';

const { getUnpaidJobs } = require('../../service');

module.exports = async (req, res, next) => {
  try {
    const { id: profileId, type: profileType } = req.profile;
    const jobs = await getUnpaidJobs({ profileId, profileType });
    // Check for empty response
    if (!jobs || jobs.length == 0) {
      console.log(
          'GET Unpaid Jobs, completed with status code ', 404);
      return res.status(404).send({
        message: 'Job not found' });
    }
    console.log(
        'GET Unpaid Jobs, completed with status code ', 200);
    res.status(200).send({
      status: 'ok',
      result: { jobs }
    });
  } catch (err) {
    console.error('GET Unpaid Jobs, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

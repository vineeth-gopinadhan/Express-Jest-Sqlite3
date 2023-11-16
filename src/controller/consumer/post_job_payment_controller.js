'use strict';

const { postJobPayment } = require('../../service');

module.exports = async (req, res, next) => {
  try {
    const {
      id: profileId,
      type: profileType,
      balance
    } = req.profile;
    const { job_id: jobId } = req.params;
    const statusCode = await postJobPayment({
      profileId,
      profileType,
      balance,
      jobId
    });
    console.log(
        'POST Job Pay, completed with status code ', statusCode);

    switch (statusCode) {
      case 404:
        res.status(404).send({
          message: 'Job not found' });
        break;
      case 400:
        res.status(400).send({
          status: 'nok',
          message: 'Insufficient balance or job already paid'
        });
        break;
      case 403:
        res.status(403).send({
          status: 'nok',
          message: 'Forbidden request'
        });
        break;
      case 200:
        res.status(200).send({
          status: 'ok',
          message: 'Payment successful'
        });
        break;
      default:
        res.status(500).send({
          status: 'nok',
          message: 'Internal Server Error'
        });
    }
  } catch (err) {
    console.error('POST Job Pay, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

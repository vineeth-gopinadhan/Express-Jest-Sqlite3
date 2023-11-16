'use strict';

const { postDeposit } = require('../../service');

module.exports = async (req, res, next) => {
  try {
    const {
      id: profileId,
      type: profileType,
      balance
    } = req.profile;
    const { deposit_amount: depositAmount } = req.body;
    const { userId } = req.params;
    const statusCode = await postDeposit({
      profileId,
      profileType,
      balance,
      userId,
      depositAmount
    });
    console.log(
        'POST Deposit, completed with status code ', statusCode);
    switch (statusCode) {
      case 400:
        res.status(400).send({
          status: 'nok',
          message: 'Invalid Deposit Amount'
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
          message: 'Deposit successful'
        });
        break;
      default:
        res.status(500).send({
          status: 'nok',
          message: 'Internal Server Error'
        });
    }
  } catch (err) {
    console.error('POST Deposit, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

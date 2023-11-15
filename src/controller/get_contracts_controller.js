
const { getContracts } = require('../service');
module.exports = async (req, res, next) => {
  try {
    const { id: profileId, type: profileType } = req.profile;
    const contracts = await getContracts({ profileId, profileType });
    if (!contracts || contracts.length == 0) {
      return res.status(404).end();
    }
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

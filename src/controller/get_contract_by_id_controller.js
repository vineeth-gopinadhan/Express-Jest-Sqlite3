
const { getContractById } = require('../service');
module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: profileId, type: profileType } = req.profile;
    const contract = await getContractById({ id, profileId, profileType });
    if (!contract) return res.status(404).end();
    res.status(200).send({
      status: 'ok',
      result: { contract }
    });
  } catch (err) {
    console.error('GET Contract By ID, Error: ', err);
    res.status(500).send({
      status: 'nok',
      message: 'Internal Server Error'
    });
  }
};

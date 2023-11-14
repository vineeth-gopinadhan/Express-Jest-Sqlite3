
const { getContractorById } = require('./../service');
module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await getContractorById({ id });
    if (!contract) return res.status(404).end();
    res.status(200).send({
      status: 'ok',
      result: { contract }
    });
  } catch (err) {
    console.error('GET Contractor By ID, Error: ', err);
  }
};

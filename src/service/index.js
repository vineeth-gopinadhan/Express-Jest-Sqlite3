`use strict`;

const { Contract } = require('./../model');

async function getContractorById({ id }) {
  try {
    console.log('Get ContractorBy ID, Params: ', { id });
    return await Contract.findOne({ where: { id } });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getContractorById
};

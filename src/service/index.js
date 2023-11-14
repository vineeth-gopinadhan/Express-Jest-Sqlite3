`use strict`;

const { Contract, Profile, Job } = require('./../model');
const { Sequelize } = require('sequelize');

async function getContractById({ id, profileId, profileType }) {
  try {
    console.log('GET Contract By ID, Args: ',
        { id, profileId, profileType });
    const includeArray = [{
      model: Job
    },
    {
      model: Profile,
      as: profileType.charAt(0).toUpperCase() + profileType.slice(1),
      where: { id: profileId, type: profileType }
    }];
    const contract = await Contract.findOne({
      where: {
        id
      },
      include: includeArray
    });

    return contract;
  } catch (error) {
    throw error;
  }
}

async function getContracts({ profileId, profileType }) {
  try {
    console.log('GET Contracts, Args: ',
        { profileId, profileType });
    const profileKey = profileType === 'contractor' ?
    'ContractorId' : 'ClientId';
    const filter = {
      [Sequelize.Op.or]: [
        {
          [profileKey]: profileId,
          status: {
            [Sequelize.Op.not]: 'terminated'
          }
        }
      ]
    };
    const contracts = await Contract.findAll({
      where: filter,
      include: [
        {
          model: Job
        }
      ]
    });
    return contracts;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getContractById,
  getContracts
};

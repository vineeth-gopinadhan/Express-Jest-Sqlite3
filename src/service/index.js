`use strict`;

const { Contract, Profile, Job } = require('./../model');
const { Sequelize } = require('sequelize');

async function getContractById({ id, profileId, profileType }) {
  try {
    console.log('GET Contract By ID, Args: ',
        { id, profileId, profileType });
    const profileKey = profileType === 'contractor' ?
        'ContractorId' : 'ClientId';
    const includeArray = [{
      model: Job
    },
    {
      model: Profile,
      attributes: {
        exclude: ['balance']
      },
      as: 'Contractor'
    },
    {
      model: Profile,
      attributes: {
        exclude: ['balance']
      },
      as: 'Client'
    }];
    const contract = await Contract.findOne({
      where: {
        id,
        [profileKey]: profileId
      },
      attributes: {
        exclude: ['ContractorId', 'ClientId']
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
      [profileKey]: profileId,
      status: {
        [Sequelize.Op.not]: 'terminated'
      }
    };
    const contracts = await Contract.findAll({
      where: filter,
      attributes: {
        exclude: ['ContractorId', 'ClientId']
      },
      include: [
        {
          model: Job
        },
        {
          model: Profile,
          attributes: {
            exclude: ['balance']
          },
          as: 'Contractor'
        },
        {
          model: Profile,
          attributes: {
            exclude: ['balance']
          },
          as: 'Client'
        }
      ]
    });
    return contracts;
  } catch (error) {
    throw error;
  }
}

async function getUnpaidJobs({ profileId, profileType }) {
  try {
    console.log('GET Unpaid Jobs, Args: ',
        { profileId, profileType });
    const profileKey = profileType === 'contractor' ?
        'ContractorId' : 'ClientId';
    const unpaidJobs = await Job.findAll({
      include: [
        {
          model: Contract,
          where: {
            status: 'in_progress',
            [profileKey]: profileId
          },
          attributes: {
            exclude: ['ContractorId', 'ClientId']
          },
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ['balance']
              },
              as: 'Contractor'
            },
            {
              model: Profile,
              attributes: {
                exclude: ['balance']
              },
              as: 'Client'
            }
          ]
        }
      ],
      attributes: {
        exclude: ['ContractId']
      },
      where: {
        paid: null
      }
    });
    return unpaidJobs;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getContractById,
  getContracts,
  getUnpaidJobs
};

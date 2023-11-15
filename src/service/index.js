`use strict`;

const { Contract, Profile, Job } = require('./../model');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./../database');

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

async function postJobPayment({
  profileId,
  profileType,
  balance,
  jobId
}) {
  console.log('POST Job Pay, Args: ',
      { profileId, profileType, balance, jobId });
  try {
    if (profileType != 'client') {
      return 403;
    }
    // Find the job with the specified ID
    const job = await Job.findByPk(jobId, {
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Client',
              where: { id: profileId, type: 'client' }
            },
            {
              model: Profile,
              as: 'Contractor'
            }
          ]
        }
      ]
    });

    if (!job) {
      return 404;
    }

    // Check if the client has enough balance to pay for the job
    if (balance < job.price || job.paid) {
      return 400;
    }

    // Update the client's balance and contractor's balance
    const updatedClientBalance = balance - job.price;
    const updatedContractorBalance =
    job.Contract.Contractor.balance + job.price;

    // Transaction to ensure atomicity
    await sequelize.transaction(async (t) => {
      await Profile.update(
          { balance: updatedClientBalance },
          { where: { id: profileId }, transaction: t }
      );

      await Profile.update(
          { balance: updatedContractorBalance },
          { where: { id: job.Contract.Contractor.id }, transaction: t }
      );

      // Mark the job as paid
      await Job.update(
          { paid: true, paymentDate: new Date() },
          { where: { id: jobId }, transaction: t }
      );
    });

    return 200;
  } catch (error) {
    throw error;
  }
}

async function postDeposit({
  profileId,
  profileType,
  balance,
  userId,
  depositAmount
}) {
  console.log('POST Deposit, Args: ',
      {
        profileId,
        profileType,
        balance,
        userId,
        depositAmount
      });

  try {
    // Check if profile belongs to client
    if (profileType != 'client') {
      return 403;
    }
    // Check if the authenticated user is the same as the
    // user specified in the request
    if (profileId !== parseInt(userId)) {
      return 403;
    }

    // Check if deposit amount is a number
    if (!depositAmount || typeof depositAmount != 'number') {
      return 400;
    }

    // Find all active contracts for the client
    const contracts = await Contract.findAll({
      where: {
        ClientId: profileId,
        status: 'in_progress'
      },
      include: [
        {
          model: Job
        }
      ]
    });

    // Calculate the total amount of jobs to pay for the client
    const totalJobsToPay = contracts.reduce((total, contract) => {
      const unpaidJobs = contract.Jobs.filter((job) => !job.paid);
      return total + unpaidJobs.reduce(
          (jobTotal, job) => jobTotal + job.price, 0
      );
    }, 0);

    // Calculate the maximum deposit amount (25% of total jobs to pay)
    const maxDepositAmount = 0.25 * totalJobsToPay;
    // Check if the deposit amount exceeds the maximum allowed
    if (depositAmount > maxDepositAmount) {
      return 400;
    }

    // Update the client's balance
    const updatedBalance = balance + depositAmount;

    await Profile.update({
      balance: updatedBalance
    }, {
      where: {
        id: profileId
      }
    });
    return 200;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getContractById,
  getContracts,
  getUnpaidJobs,
  postJobPayment,
  postDeposit
};

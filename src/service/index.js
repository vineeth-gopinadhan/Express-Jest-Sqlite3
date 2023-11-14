`use strict`;

const { Contract, Profile, Job } = require('./../model');

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
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
}

module.exports = {
  getContractById
};

'use strict';

const {
  getContractByIdController,
  getContracts,
  getUnpaidJobsController
} = require('./../controller');
const { getProfile } = require('./../middleware');
const express = require('express');
const router = express.Router({
  mergeParams: true
});

router.get(
    '/contracts/:id',
    getProfile,
    getContractByIdController
);

router.get(
    '/contracts',
    getProfile,
    getContracts
);

router.get(
    '/jobs/unpaid',
    getProfile,
    getUnpaidJobsController
);


module.exports = router;

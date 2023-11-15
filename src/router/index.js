'use strict';

const {
  getContractByIdController,
  getContracts,
  getUnpaidJobsController,
  postJobPaymentController
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

router.post(
    '/jobs/:job_id/pay',
    getProfile,
    postJobPaymentController
);


module.exports = router;

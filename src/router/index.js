'use strict';

const {
  getContractByIdController,
  getContracts,
  getUnpaidJobsController,
  postJobPaymentController,
  postDepositController,
  getAdminBestProfessionController,
  getAdminBestClientsController
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

router.post(
    '/balances/deposit/:userId',
    getProfile,
    postDepositController
);

// Admin routes
router.get(
    '/admin/best-profession',
    getProfile,
    getAdminBestProfessionController
);

router.get(
    '/admin/best-clients',
    getProfile,
    getAdminBestClientsController
);

module.exports = router;

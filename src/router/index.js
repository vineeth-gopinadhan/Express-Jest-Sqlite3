'use strict';

const {
  getContractByIdController,
  getContracts
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


module.exports = router;

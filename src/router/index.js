'use strict';
const { getContractorByIdController } = require('./../controller');
const { getProfile } = require('./../middleware');
const express = require('express');
const router = express.Router({
  mergeParams: true
});

router.get(
    '/contracts/:id',
    getProfile,
    getContractorByIdController
);

module.exports = router;

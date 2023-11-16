'use strict';

module.exports = {
  getContractByIdController:
    require('./consumer/get_contract_by_id_controller'),
  getContracts: require('./consumer/get_contracts_controller'),
  getUnpaidJobsController: require('./consumer/get_unpdaid_jobs_controller'),
  postJobPaymentController: require('./consumer/post_job_payment_controller'),
  postDepositController: require('./consumer/post_deposit_controller'),
  getAdminBestProfessionController:
    require('./admin/get_admin_best_profession_controller'),
  getAdminBestClientsController:
    require('./admin/get_admin_best_clients_controller')
};

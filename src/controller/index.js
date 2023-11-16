
module.exports = {
  getContractByIdController: require('./get_contract_by_id_controller'),
  getContracts: require('./get_contracts_controller'),
  getUnpaidJobsController: require('./get_unpdaid_jobs_controller'),
  postJobPaymentController: require('./post_job_payment_controller'),
  postDepositController: require('./post_deposit_controller'),
  getAdminBestProfessionController:
    require('./get_admin_best_profession_controller'),
  getAdminBestClientsController: require('./get_admin_best_clients_controller')
};

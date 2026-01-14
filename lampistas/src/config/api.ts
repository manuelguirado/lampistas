// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  // Auth endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/adminLogin`,
  COMPANY_LOGIN: `${API_BASE_URL}/company/companyLogin`,
  COMPANY_VALIDATE_CODE: `${API_BASE_URL}/company/validateCode`,
  WORKER_LOGIN: `${API_BASE_URL}/worker/workerLogin`,
  USER_LOGIN: `${API_BASE_URL}/user/userLogin`,
  //ADMIN endpoints
  ADMIN_REGISTER_COMPANY: `${API_BASE_URL}/admin/registerCompany`,
  ADMIN_lIST_COMPANIES: `${API_BASE_URL}/admin/listCompany`,
  ADMIN_DELETE_COMPANY: `${API_BASE_URL}/admin/eliminateCompany`,
  ADMIN_EDIT_COMPANY: `${API_BASE_URL}/admin/editCompany`,
  ADMIN_ASSIGN_CODE: `${API_BASE_URL}/admin/assignCode`,
  ADMIN_REGISTER: `${API_BASE_URL}/admin/adminRegister`,
ADMIN_CONSULT_STATUS_COMPANY: `${API_BASE_URL}/admin/consultStatus`,
ADMIN_ACTIVATE_COMPANY: `${API_BASE_URL}/admin/activateCompany`,
ADMIN_SUSPEND_COMPANY: `${API_BASE_URL}/admin/suspendCompany`,

  
  // Company endpoints
  COMPANY_REGISTER_WORKER: `${API_BASE_URL}/company/RegisterWorker`,
  COMPANY_LIST_WORKERS: `${API_BASE_URL}/company/listWorkers`,
  COMPANY_EDIT_WORKER: `${API_BASE_URL}/company/editWorker`,
  COMPANY_DELETE_WORKER: `${API_BASE_URL}/company/deleteWorker`,
  COMPANY_ASSIGN_WORKER_CODE: `${API_BASE_URL}/company/assignWorkerCode`,
  COMPANY_ASSIGN_SHIFT_WORKER: `${API_BASE_URL}/company/assignShiftWorker`,
  COMPANY_LIST_INCIDENTS: `${API_BASE_URL}/company/listIncidents`,
  COMPANY_ASSIGN_INCIDENT: `${API_BASE_URL}/company/assignIncident`,
  COMPANY_CREATE_USER: `${API_BASE_URL}/company/companyCreateUser`,
  COMPANY_CREATE_CONTRACT: `${API_BASE_URL}/company/createContract`,
  COMPANY_LIST_CLIENTS: `${API_BASE_URL}/company/listClients`,
  COMPANY_EDIT_MACHINERY: `${API_BASE_URL}/company/editMachinery`,
  COMPANY_ELIMINATE_MACHINERY: `${API_BASE_URL}/company/eliminateMachinery`,
  COMPANY_LIST_MACHINERY: `${API_BASE_URL}/company/listMachinery`,
  COMPANY_CREATE_MACHINERY: `${API_BASE_URL}/company/createMachinery`,
  COMPANY_UPDATE_MAINTENCE_DATE: `${API_BASE_URL}/company/updateMaintenceDate`,
  COMPANY_CREATE_BUDGET: `${API_BASE_URL}/company/createBudget`,
  COMPANY_GET_CLIENT_CONTRACTS: `${API_BASE_URL}/company/getClientContracts`,
  COMPANY_GET_INCIDENT_HISTORY: `${API_BASE_URL}/company/getIncidentHistory`,
  
  // User endpoints
  USER_MY_INCIDENTS: `${API_BASE_URL}/user/myIncidents`,
  USER_RECEIVED_BUDGETS: `${API_BASE_URL}/user/receivedBudgets`,
  USER_CREATE_INCIDENT: `${API_BASE_URL}/user/createIncident`,
  USER_MACHINERY: `${API_BASE_URL}/user/userMachinery`,
  USER_CLOSE_INCIDENT: `${API_BASE_URL}/user/closeIncident`,
  USER_MY_CONTRACTS: `${API_BASE_URL}/user/myContracts`,
  USER_UPLOAD_FILE: `${API_BASE_URL}/user/uploadFile`,
  USER_lISTfILES: `${API_BASE_URL}/user/listFiles`,
  // Worker endpoints
  WORKER_ASSIGNED_INCIDENT : `${API_BASE_URL}/worker/assignedIncidents`,
  WORKER_UPDATE_INCIDENT_STATUS : `${API_BASE_URL}/worker/updateIncidentStatus`,
  WORKER_UPLOAD_FILE : `${API_BASE_URL}/worker/uploadFile`,
  WORKER_VALIDATE_CODE : `${API_BASE_URL}/worker/validateWorkerCode`,
  WORKER_MY_SHIFTS : `${API_BASE_URL}/worker/myShifts`,
  WORER_GET_INCIDENT_HISTORY : `${API_BASE_URL}/worker/getIncidentHistory`,
  WORKER_INCIDENT_HISTORY : `${API_BASE_URL}/worker/incidentHistory`,
  
};

export default API_ENDPOINTS;
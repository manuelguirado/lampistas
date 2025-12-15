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
  
  // User endpoints
  USER_MY_INCIDENTS: `${API_BASE_URL}/user/myIncidents`,
  USER_RECEIVED_BUDGETS: `${API_BASE_URL}/user/recievedBudgets`,
  USER_CREATE_INCIDENT: `${API_BASE_URL}/user/createIncident`,
  USER_MACHINERY: `${API_BASE_URL}/user/userMachinery`,
};

export default API_ENDPOINTS;
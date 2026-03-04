import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import loginCompanyEs from "./pages/companies/locale/loginCompany.es.json";
import loginCompanyEn from "./pages/companies/locale/loginCompany.en.json";
import loginCompanyCa from "./pages/companies/locale/loginCompany.ca.json";

import headerEs from "./pages/companies/locale/header.es.json";
import headerEn from "./pages/companies/locale/header.en.json";
import headerCa from "./pages/companies/locale/header.ca.json";

import companyHomeEs from "./pages/companies/locale/companyHome.es.json";
import companyHomeEn from "./pages/companies/locale/companyHome.en.json";
import companyHomeCa from "./pages/companies/locale/companyHome.ca.json";

import dashboardCompanyEs from "./pages/companies/locale/dashboardCompany.es.json";
import dashboardCompanyEn from "./pages/companies/locale/dashboardCompany.en.json";
import dashboardCompanyCa from "./pages/companies/locale/dashboardCompany.ca.json";
import incidentIndexEs from "./pages/companies/locale/incidentIndex.es.json";
import incidentIndexEn from "./pages/companies/locale/incidentIndex.en.json";
import incidentIndexCa from "./pages/companies/locale/incidentIndex.ca.json";
import myIncidentsEs from "./pages/companies/locale/myIncidents.es.json";
import myIncidentsEn from "./pages/companies/locale/myIncidents.en.json";
import myIncidentsCa from "./pages/companies/locale/myIncidents.ca.json";
import companyHistoryEs from "./pages/companies/locale/companyHistory.es.json";
import companyHistoryEn from "./pages/companies/locale/companyHistory.en.json";
import companyHistoryCa from "./pages/companies/locale/companyHistory.ca.json";
import clientsIndexEs from "./pages/companies/locale/clientsIndex.es.json";
import clientsIndexEn from "./pages/companies/locale/clientsIndex.en.json";
import clientsIndexCa from "./pages/companies/locale/clientsIndex.ca.json";
import listClientsPageEs from "./pages/companies/locale/listClientsPage.es.json";
import listClientsPageEn from "./pages/companies/locale/listClientsPage.en.json";
import listClientsPageCa from "./pages/companies/locale/listClientsPage.ca.json";
import registerUserPageEs from "./pages/companies/locale/registerUserPage.es.json";
import registerUserPageEn from "./pages/companies/locale/registerUserPage.en.json";
import registerUserPageCa from "./pages/companies/locale/registerUserPage.ca.json";
import workerIndexEs from "./pages/companies/locale/workerIndex.es.json";
import workerIndexEn from "./pages/companies/locale/workerIndex.en.json";
import workerIndexCa from "./pages/companies/locale/workerIndex.ca.json";
import listWorkersPageEs from "./pages/companies/locale/listWorkersPage.es.json";
import listWorkersPageEn from "./pages/companies/locale/listWorkersPage.en.json";
import listWorkersPageCa from "./pages/companies/locale/listWorkersPage.ca.json";
import registerWorkerPageEs from "./pages/companies/locale/registerWorkerPage.es.json";
import registerWorkerPageEn from "./pages/companies/locale/registerWorkerPage.en.json";
import registerWorkerPageCa from "./pages/companies/locale/registerWorkerPage.ca.json";
import editWorkersPageEs from "./pages/companies/locale/editWorkersPage.es.json";
import editWorkersPageEn from "./pages/companies/locale/editWorkersPage.en.json";
import editWorkersPageCa from "./pages/companies/locale/editWorkersPage.ca.json";
import machineryIndexEs from "./pages/companies/locale/machineryIndex.es.json";
import machineryIndexEn from "./pages/companies/locale/machineryIndex.en.json";
import machineryIndexCa from "./pages/companies/locale/machineryIndex.ca.json";
import listMachineryPageEs from "./pages/companies/locale/listMachineryPage.es.json";
import listMachineryPageEn from "./pages/companies/locale/listMachineryPage.en.json";
import listMachineryPageCa from "./pages/companies/locale/listMachineryPage.ca.json";
import createMachineryPageEs from "./pages/companies/locale/createMachineryPage.es.json";
import createMachineryPageEn from "./pages/companies/locale/createMachineryPage.en.json";
import createMachineryPageCa from "./pages/companies/locale/createMachineryPage.ca.json";
import editMachineryPageEs from "./pages/companies/locale/editMachineryPage.es.json";
import editMachineryPageEn from "./pages/companies/locale/editMachineryPage.en.json";
import editMachineryPageCa from "./pages/companies/locale/editMachineryPage.ca.json";
import updateMaintencePageEs from "./pages/companies/locale/updateMaintencePage.es.json";
import updateMaintencePageEn from "./pages/companies/locale/updateMaintencePage.en.json";
import updateMaintencePageCa from "./pages/companies/locale/updateMaintencePage.ca.json";
import createAccountsPageEs from "./pages/companies/locale/createAccountsPage.es.json";
import createAccountsPageEn from "./pages/companies/locale/createAccountsPage.en.json";
import createAccountsPageCa from "./pages/companies/locale/createAccountsPage.ca.json";
import accountCreatedPageEs from "./pages/companies/locale/accountCreatedPage.es.json";
import accountCreatedPageEn from "./pages/companies/locale/accountCreatedPage.en.json";
import accountCreatedPageCa from "./pages/companies/locale/accountCreatedPage.ca.json";
import createBudgetPageEs from "./pages/companies/locale/createBudgetPage.es.json";
import createBudgetPageEn from "./pages/companies/locale/createBudgetPage.en.json";
import createBudgetPageCa from "./pages/companies/locale/createBudgetPage.ca.json";
import adminHeaderEs from "./pages/admin/locale/adminHeader.es.json";
import adminHeaderEn from "./pages/admin/locale/adminHeader.en.json";
import adminHeaderCa from "./pages/admin/locale/adminHeader.ca.json";
import adminDashboardPageEs from "./pages/admin/locale/adminDashboardPage.es.json";
import adminDashboardPageEn from "./pages/admin/locale/adminDashboardPage.en.json";
import adminDashboardPageCa from "./pages/admin/locale/adminDashboardPage.ca.json";
import listCompanyPageEs from "./pages/admin/locale/listCompanyPage.es.json";
import listCompanyPageEn from "./pages/admin/locale/listCompanyPage.en.json";
import listCompanyPageCa from "./pages/admin/locale/listCompanyPage.ca.json";
import adminAuthPageEs from "./pages/admin/locale/adminAuthPage.es.json";
import adminAuthPageEn from "./pages/admin/locale/adminAuthPage.en.json";
import adminAuthPageCa from "./pages/admin/locale/adminAuthPage.ca.json";
import adminHomePageEs from "./pages/admin/locale/adminHomePage.es.json";
import adminHomePageEn from "./pages/admin/locale/adminHomePage.en.json";
import adminHomePageCa from "./pages/admin/locale/adminHomePage.ca.json";
import createNewsLetterPageEs from "./pages/admin/locale/createNewsLetterPage.es.json";
import createNewsLetterPageEn from "./pages/admin/locale/createNewsLetterPage.en.json";
import createNewsLetterPageCa from "./pages/admin/locale/createNewsLetterPage.ca.json";
import registerCompanyPageEs from "./pages/admin/locale/registerCompanyPage.es.json";
import registerCompanyPageEn from "./pages/admin/locale/registerCompanyPage.en.json";
import registerCompanyPageCa from "./pages/admin/locale/registerCompanyPage.ca.json";
import editCompanyPageEs from "./pages/admin/locale/editCompanyPage.es.json";
import editCompanyPageEn from "./pages/admin/locale/editCompanyPage.en.json";
import editCompanyPageCa from "./pages/admin/locale/editCompanyPage.ca.json";
import suspendCompanyPageEs from "./pages/admin/locale/suspendCompanyPage.es.json";
import suspendCompanyPageEn from "./pages/admin/locale/suspendCompanyPage.en.json";
import suspendCompanyPageCa from "./pages/admin/locale/suspendCompanyPage.ca.json";
import userLoginPageEs from "./pages/users/locale/userLoginPage.es.json";
import userLoginPageEn from "./pages/users/locale/userLoginPage.en.json";
import userLoginPageCa from "./pages/users/locale/userLoginPage.ca.json";
import userRegisterPageEs from "./pages/users/locale/userRegisterPage.es.json";
import userRegisterPageEn from "./pages/users/locale/userRegisterPage.en.json";
import userRegisterPageCa from "./pages/users/locale/userRegisterPage.ca.json";
import userSearchCompaniesPageEs from "./pages/users/locale/userSearchCompaniesPage.es.json";
import userSearchCompaniesPageEn from "./pages/users/locale/userSearchCompaniesPage.en.json";
import userSearchCompaniesPageCa from "./pages/users/locale/userSearchCompaniesPage.ca.json";
import userHeaderEs from "./pages/users/locale/userHeader.es.json";
import userHeaderEn from "./pages/users/locale/userHeader.en.json";
import userHeaderCa from "./pages/users/locale/userHeader.ca.json";
import userHomePageEs from "./pages/users/locale/userHomePage.es.json";
import userHomePageEn from "./pages/users/locale/userHomePage.en.json";
import userHomePageCa from "./pages/users/locale/userHomePage.ca.json";
import incidentIndexPageEs from "./pages/users/locale/incidentIndexPage.es.json";
import incidentIndexPageEn from "./pages/users/locale/incidentIndexPage.en.json";
import incidentIndexPageCa from "./pages/users/locale/incidentIndexPage.ca.json";
import createIncidentPageEs from "./pages/users/locale/createIncidentPage.es.json";
import createIncidentPageEn from "./pages/users/locale/createIncidentPage.en.json";
import createIncidentPageCa from "./pages/users/locale/createIncidentPage.ca.json";
import incidentHistoryPageEs from "./pages/users/locale/incidentHistoryPage.es.json";
import incidentHistoryPageEn from "./pages/users/locale/incidentHistoryPage.en.json";
import incidentHistoryPageCa from "./pages/users/locale/incidentHistoryPage.ca.json";
import userBudgetsPageEs from "./pages/users/locale/userBudgetsPage.es.json";
import userBudgetsPageEn from "./pages/users/locale/userBudgetsPage.en.json";
import userBudgetsPageCa from "./pages/users/locale/userBudgetsPage.ca.json";
import myMachineryPageEs from "./pages/users/locale/myMachineryPage.es.json";
import myMachineryPageEn from "./pages/users/locale/myMachineryPage.en.json";
import myMachineryPageCa from "./pages/users/locale/myMachineryPage.ca.json";
import userPaymentsPageEs from "./pages/users/locale/userPaymentsPage.es.json";
import userPaymentsPageEn from "./pages/users/locale/userPaymentsPage.en.json";
import userPaymentsPageCa from "./pages/users/locale/userPaymentsPage.ca.json";
import userCheckoutPageEs from "./pages/users/locale/userCheckoutPage.es.json";
import userCheckoutPageEn from "./pages/users/locale/userCheckoutPage.en.json";
import userCheckoutPageCa from "./pages/users/locale/userCheckoutPage.ca.json";
import paymentSuccessPageEs from "./pages/users/locale/paymentSuccessPage.es.json";
import paymentSuccessPageEn from "./pages/users/locale/paymentSuccessPage.en.json";
import paymentSuccessPageCa from "./pages/users/locale/paymentSuccessPage.ca.json";
import workerLoginPageEs from "./pages/worker/locale/workerLoginPage.es.json";
import workerLoginPageEn from "./pages/worker/locale/workerLoginPage.en.json";
import workerLoginPageCa from "./pages/worker/locale/workerLoginPage.ca.json";
import workerDashboardPageEs from "./pages/worker/locale/workerDashboardPage.es.json";
import workerDashboardPageEn from "./pages/worker/locale/workerDashboardPage.en.json";
import workerDashboardPageCa from "./pages/worker/locale/workerDashboardPage.ca.json";
import workerHeaderEs from "./pages/worker/locale/workerHeader.es.json";
import workerHeaderEn from "./pages/worker/locale/workerHeader.en.json";
import workerHeaderCa from "./pages/worker/locale/workerHeader.ca.json";
import workerHistoryPageEs from "./pages/worker/locale/workerHistoryPage.es.json";
import workerHistoryPageEn from "./pages/worker/locale/workerHistoryPage.en.json";
import workerHistoryPageCa from "./pages/worker/locale/workerHistoryPage.ca.json";
import workerShiftsPageEs from "./pages/worker/locale/workerShiftsPage.es.json";
import workerShiftsPageEn from "./pages/worker/locale/workerShiftsPage.en.json";
import workerShiftsPageCa from "./pages/worker/locale/workerShiftsPage.ca.json";
import workerHomePageEs from "./pages/worker/locale/workerHomePage.es.json";
import workerHomePageEn from "./pages/worker/locale/workerHomePage.en.json";
import workerHomePageCa from "./pages/worker/locale/workerHomePage.ca.json";
import homeEs from "./pages/locale/home.es.json";
import homeEn from "./pages/locale/home.en.json";
import homeCa from "./pages/locale/home.ca.json";

const resources = {
  es: {
    "companies.loginCompany": loginCompanyEs,
    "companies.header": headerEs,
    "companies.companyHome": companyHomeEs,
    "companies.dashboardCompany": dashboardCompanyEs,
    "companies.incidentIndex": incidentIndexEs,
    "companies.myIncidents": myIncidentsEs,
    "companies.companyHistory": companyHistoryEs,
    "companies.clientsIndex": clientsIndexEs,
    "companies.listClientsPage": listClientsPageEs,
    "companies.registerUserPage": registerUserPageEs,
    "companies.workerIndex": workerIndexEs,
    "companies.listWorkersPage": listWorkersPageEs,
    "companies.registerWorkerPage": registerWorkerPageEs,
    "companies.editWorkersPage": editWorkersPageEs,
    "companies.machineryIndex": machineryIndexEs,
    "companies.listMachineryPage": listMachineryPageEs,
    "companies.createMachineryPage": createMachineryPageEs,
    "companies.editMachineryPage": editMachineryPageEs,
    "companies.updateMaintencePage": updateMaintencePageEs,
    "companies.createAccountsPage": createAccountsPageEs,
    "companies.accountCreatedPage": accountCreatedPageEs,
    "companies.createBudgetPage": createBudgetPageEs,
    "admin.header": adminHeaderEs,
    "admin.dashboardPage": adminDashboardPageEs,
    "admin.homePage": adminHomePageEs,
    "admin.listCompanyPage": listCompanyPageEs,
    "admin.authPage": adminAuthPageEs,
    "admin.createNewsLetterPage": createNewsLetterPageEs,
    "admin.registerCompanyPage": registerCompanyPageEs,
    "admin.editCompanyPage": editCompanyPageEs,
    "admin.suspendCompanyPage": suspendCompanyPageEs,
    "users.loginPage": userLoginPageEs,
    "users.registerPage": userRegisterPageEs,
    "users.searchCompaniesPage": userSearchCompaniesPageEs,
    "users.header": userHeaderEs,
    "users.homePage": userHomePageEs,
    "users.incidentIndexPage": incidentIndexPageEs,
    "users.createIncidentPage": createIncidentPageEs,
    "users.incidentHistoryPage": incidentHistoryPageEs,
    "users.userBudgetsPage": userBudgetsPageEs,
    "users.myMachineryPage": myMachineryPageEs,
    "users.paymentsPage": userPaymentsPageEs,
    "users.checkoutPage": userCheckoutPageEs,
    "users.paymentSuccessPage": paymentSuccessPageEs,
    "worker.loginPage": workerLoginPageEs,
    "worker.dashboardPage": workerDashboardPageEs,
    "worker.header": workerHeaderEs,
    "worker.historyPage": workerHistoryPageEs,
    "worker.shiftsPage": workerShiftsPageEs,
    "worker.homePage": workerHomePageEs,
    home: homeEs,
  },
  en: {
    "companies.loginCompany": loginCompanyEn,
    "companies.header": headerEn,
    "companies.companyHome": companyHomeEn,
    "companies.dashboardCompany": dashboardCompanyEn,
    "companies.incidentIndex": incidentIndexEn,
    "companies.myIncidents": myIncidentsEn,
    "companies.companyHistory": companyHistoryEn,
    "companies.clientsIndex": clientsIndexEn,
    "companies.listClientsPage": listClientsPageEn,
    "companies.registerUserPage": registerUserPageEn,
    "companies.workerIndex": workerIndexEn,
    "companies.listWorkersPage": listWorkersPageEn,
    "companies.registerWorkerPage": registerWorkerPageEn,
    "companies.editWorkersPage": editWorkersPageEn,
    "companies.machineryIndex": machineryIndexEn,
    "companies.listMachineryPage": listMachineryPageEn,
    "companies.createMachineryPage": createMachineryPageEn,
    "companies.editMachineryPage": editMachineryPageEn,
    "companies.updateMaintencePage": updateMaintencePageEn,
    "companies.createAccountsPage": createAccountsPageEn,
    "companies.accountCreatedPage": accountCreatedPageEn,
    "companies.createBudgetPage": createBudgetPageEn,
    "admin.header": adminHeaderEn,
    "admin.dashboardPage": adminDashboardPageEn,
    "admin.homePage": adminHomePageEn,
    "admin.listCompanyPage": listCompanyPageEn,
    "admin.authPage": adminAuthPageEn,
    "admin.createNewsLetterPage": createNewsLetterPageEn,
    "admin.registerCompanyPage": registerCompanyPageEn,
    "admin.editCompanyPage": editCompanyPageEn,
    "admin.suspendCompanyPage": suspendCompanyPageEn,
    "users.loginPage": userLoginPageEn,
    "users.registerPage": userRegisterPageEn,
    "users.searchCompaniesPage": userSearchCompaniesPageEn,
    "users.header": userHeaderEn,
    "users.homePage": userHomePageEn,
    "users.incidentIndexPage": incidentIndexPageEn,
    "users.createIncidentPage": createIncidentPageEn,
    "users.incidentHistoryPage": incidentHistoryPageEn,
    "users.userBudgetsPage": userBudgetsPageEn,
    "users.myMachineryPage": myMachineryPageEn,
    "users.paymentsPage": userPaymentsPageEn,
    "users.checkoutPage": userCheckoutPageEn,
    "users.paymentSuccessPage": paymentSuccessPageEn,
    "worker.loginPage": workerLoginPageEn,
    "worker.dashboardPage": workerDashboardPageEn,
    "worker.header": workerHeaderEn,
    "worker.historyPage": workerHistoryPageEn,
    "worker.shiftsPage": workerShiftsPageEn,
    "worker.homePage": workerHomePageEn,
    home: homeEn,
  },
  ca: {
    "companies.loginCompany": loginCompanyCa,
    "companies.header": headerCa,
    "companies.companyHome": companyHomeCa,
    "companies.dashboardCompany": dashboardCompanyCa,
    "companies.incidentIndex": incidentIndexCa,
    "companies.myIncidents": myIncidentsCa,
    "companies.companyHistory": companyHistoryCa,
    "companies.clientsIndex": clientsIndexCa,
    "companies.listClientsPage": listClientsPageCa,
    "companies.registerUserPage": registerUserPageCa,
    "companies.workerIndex": workerIndexCa,
    "companies.listWorkersPage": listWorkersPageCa,
    "companies.registerWorkerPage": registerWorkerPageCa,
    "companies.editWorkersPage": editWorkersPageCa,
    "companies.machineryIndex": machineryIndexCa,
    "companies.listMachineryPage": listMachineryPageCa,
    "companies.createMachineryPage": createMachineryPageCa,
    "companies.editMachineryPage": editMachineryPageCa,
    "companies.updateMaintencePage": updateMaintencePageCa,
    "companies.createAccountsPage": createAccountsPageCa,
    "companies.accountCreatedPage": accountCreatedPageCa,
    "companies.createBudgetPage": createBudgetPageCa,
    "admin.header": adminHeaderCa,
    "admin.dashboardPage": adminDashboardPageCa,
    "admin.homePage": adminHomePageCa,
    "admin.listCompanyPage": listCompanyPageCa,
    "admin.authPage": adminAuthPageCa,
    "admin.createNewsLetterPage": createNewsLetterPageCa,
    "admin.registerCompanyPage": registerCompanyPageCa,
    "admin.editCompanyPage": editCompanyPageCa,
    "admin.suspendCompanyPage": suspendCompanyPageCa,
    "users.loginPage": userLoginPageCa,
    "users.registerPage": userRegisterPageCa,
    "users.searchCompaniesPage": userSearchCompaniesPageCa,
    "users.header": userHeaderCa,
    "users.homePage": userHomePageCa,
    "users.incidentIndexPage": incidentIndexPageCa,
    "users.createIncidentPage": createIncidentPageCa,
    "users.incidentHistoryPage": incidentHistoryPageCa,
    "users.userBudgetsPage": userBudgetsPageCa,
    "users.myMachineryPage": myMachineryPageCa,
    "users.paymentsPage": userPaymentsPageCa,
    "users.checkoutPage": userCheckoutPageCa,
    "users.paymentSuccessPage": paymentSuccessPageCa,
    "worker.loginPage": workerLoginPageCa,
    "worker.dashboardPage": workerDashboardPageCa,
    "worker.header": workerHeaderCa,
    "worker.historyPage": workerHistoryPageCa,
    "worker.shiftsPage": workerShiftsPageCa,
    "worker.homePage": workerHomePageCa,
    home: homeCa,
  }
} as const;

const savedLanguage =
  localStorage.getItem("i18nLang") ;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;

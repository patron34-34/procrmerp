import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';

// Portal Components
import { useApp } from './context/AppContext';
import PortalSidebar from './components/layout/PortalSidebar';
import PortalDashboard from './components/pages/portal/PortalDashboard';
import MyPayslips from './components/pages/portal/MyPayslips';
import MyLeaveRequests from './components/pages/portal/MyLeaveRequests';

import Dashboard from './components/pages/Dashboard';
import Customers from './components/pages/Customers';
import SalesPipeline from './components/pages/SalesPipeline';
import Projects from './components/pages/Projects';
import CustomerDetail from './components/pages/CustomerDetail';
import Invoices from './components/pages/Invoices';
import Products from './components/pages/inventory/Products';
import Suppliers from './components/pages/inventory/Suppliers';
import PurchaseOrders from './components/pages/inventory/PurchaseOrders';
import PurchaseOrderForm from './components/pages/inventory/PurchaseOrderForm';
import Employees from './components/pages/hr/Employees';
import LeaveManagement from './components/pages/hr/LeaveManagement';
import HRDashboard from './components/pages/hr/HRDashboard';
import EmployeeDetail from './components/pages/hr/EmployeeDetail';
import PerformanceReviews from './components/pages/hr/PerformanceReviews';
import JobOpenings from './components/pages/hr/recruitment/JobOpenings';
import Candidates from './components/pages/hr/recruitment/Candidates';
import ReportsHub from './components/pages/reports/ReportsHub';
import SalesSummaryReport from './components/pages/reports/SalesSummaryReport';
import InvoiceSummaryReport from './components/pages/reports/InvoiceSummaryReport';
import ExpenseSummaryReport from './components/pages/reports/ExpenseSummaryReport';
import Tickets from './components/pages/support/Tickets';
import AccessDenied from './components/pages/AccessDenied';
import ActivityLog from './components/pages/ActivityLog';
import Tasks from './components/pages/Tasks';
import Documents from './components/pages/Documents';
import ProjectDetail from './components/pages/ProjectDetail';
import DealDetail from './components/pages/DealDetail';
import OnboardingTemplates from './components/pages/hr/onboarding/OnboardingTemplates';
import OnboardingWorkflows from './components/pages/hr/onboarding/OnboardingWorkflows';
import WorkflowDetail from './components/pages/hr/onboarding/WorkflowDetail';
import MyProfile from './components/pages/MyProfile';
import OrganizationChart from './components/pages/hr/OrganizationChart';
import GeneralSettings from './components/pages/settings/GeneralSettings';
import AppearanceSettings from './components/pages/settings/AppearanceSettings';
import UsersSettings from './components/pages/settings/UsersSettings';
import RolesSettings from './components/pages/settings/RolesSettings';
import SecuritySettings from './components/pages/settings/SecuritySettings';
import CustomFieldsSettings from './components/pages/settings/CustomFieldsSettings';
import IntegrationsSettings from './components/pages/settings/IntegrationsSettings';
import DataSettings from './components/pages/settings/DataSettings';
import Settings from './components/pages/Settings';
import DynamicStyles from './DynamicStyles';
import InventoryDashboard from './components/pages/inventory/InventoryDashboard';
import StockMovements from './components/pages/inventory/StockMovements';
import Warehouses from './components/pages/inventory/Warehouses';
import SalesOrders from './components/pages/inventory/SalesOrders';
import Shipments from './components/pages/inventory/Shipments';
import PickLists from './components/pages/inventory/PickLists';
import ProductDetail from './components/pages/inventory/ProductDetail';
import PickListDetail from './components/pages/inventory/PickListDetail';
import Payroll from './components/pages/hr/Payroll';
import PayrollAndTimesheet from './components/pages/hr/PayrollAndTimesheet';
import TerminationCalculator from './components/pages/hr/TerminationCalculator';
import PayrollSimulation from './components/pages/hr/PayrollSimulation';
import ChartOfAccounts from './components/pages/accounting/ChartOfAccounts';
import JournalEntries from './components/pages/accounting/JournalEntries';
import JournalEntryForm from './components/pages/accounting/JournalEntryForm';
import JournalEntryDetail from './components/pages/accounting/JournalEntryDetail';
import AccountingReportsHub from './components/pages/accounting/AccountingReportsHub';
import TrialBalance from './components/pages/accounting/TrialBalance';
import GeneralLedgerHub from './components/pages/accounting/GeneralLedgerHub';
import GeneralLedger from './components/pages/accounting/GeneralLedger';
import Bills from './components/pages/accounting/Bills';
import BankReconciliation from './components/pages/accounting/BankReconciliation';
import RecurringJournalEntries from './components/pages/accounting/RecurringJournalEntries';
import Budgets from './components/pages/accounting/Budgets';
import BudgetDetail from './components/pages/accounting/BudgetDetail';
import BalanceSheet from './components/pages/accounting/BalanceSheet';
import IncomeStatement from './components/pages/accounting/IncomeStatement';
import CashFlowStatement from './components/pages/accounting/CashFlowStatement';
import AccountingSettings from './components/pages/settings/AccountingSettings';
import TaxSettings from './components/pages/settings/TaxSettings';
import CostCentersSettings from './components/pages/settings/CostCentersSettings';
import PriceListsSettings from './components/pages/settings/PriceListsSettings';
import PriceListDetail from './components/pages/settings/PriceListDetail';
import Automations from './components/pages/Automations';
import AutomationDetail from './components/pages/AutomationDetail';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import BankAccounts from './components/pages/accounting/BankAccounts';
import Transactions from './components/pages/accounting/Transactions';
import TaskTemplatesSettings from './components/pages/settings/TaskTemplatesSettings';
import ScheduledTasks from './components/pages/ScheduledTasks';
import AccountingDashboard from './components/pages/accounting/AccountingDashboard';


const App: React.FC = () => {
    const { currentUser } = useApp();

    const isPortalUser = currentUser.role === 'Çalışan';

    if (isPortalUser) {
        return (
            <div className="flex h-screen bg-background dark:bg-dark-background text-text-main dark:text-dark-text-main">
                <PortalSidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="/portal/dashboard" />} />
                            <Route path="/portal/dashboard" element={<PortalDashboard />} />
                            <Route path="/portal/payslips" element={<MyPayslips />} />
                            <Route path="/portal/leaves" element={<MyLeaveRequests />} />
                            <Route path="/profile" element={<MyProfile />} />
                             <Route path="*" element={<Navigate to="/portal/dashboard" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        );
    }
    
  return (
    <>
    <DynamicStyles />
    <div className="flex h-screen bg-background dark:bg-dark-background text-text-main dark:text-dark-text-main">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto p-6">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* Customers & Support */}
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/:id" element={<CustomerDetail />} />
                    <Route path="/support/tickets" element={<ProtectedRoute permission="destek:goruntule"><Tickets /></ProtectedRoute>} />

                    {/* Sales */}
                    <Route path="/sales" element={<ProtectedRoute permission="anlasma:goruntule"><SalesPipeline /></ProtectedRoute>} />
                    <Route path="/deals/:id" element={<ProtectedRoute permission="anlasma:goruntule"><DealDetail /></ProtectedRoute>} />
                    
                    {/* Operations */}
                    <Route path="/projects" element={<ProtectedRoute permission="proje:goruntule"><Projects /></ProtectedRoute>} />
                    <Route path="/projects/:id" element={<ProtectedRoute permission="proje:goruntule"><ProjectDetail /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute permission="dokuman:goruntule"><Documents /></ProtectedRoute>} />
                    <Route path="/automations" element={<ProtectedRoute permission="otomasyon:goruntule"><Automations /></ProtectedRoute>} />
                    <Route path="/automations/:id" element={<ProtectedRoute permission="otomasyon:goruntule"><AutomationDetail /></ProtectedRoute>} />
                    <Route path="/automations/scheduled-tasks" element={<ProtectedRoute permission="otomasyon:yonet"><ScheduledTasks /></ProtectedRoute>} />

                    {/* Core */}
                    <Route path="/planner" element={<ProtectedRoute permission="gorev:goruntule"><Tasks /></ProtectedRoute>} />
                    <Route path="/profile" element={<MyProfile />} />

                    {/* Inventory */}
                    <Route path="/inventory/dashboard" element={<ProtectedRoute permission="envanter:goruntule"><InventoryDashboard /></ProtectedRoute>} />
                    <Route path="/inventory/products" element={<ProtectedRoute permission="envanter:goruntule"><Products /></ProtectedRoute>} />
                    <Route path="/inventory/products/:id" element={<ProtectedRoute permission="envanter:goruntule"><ProductDetail /></ProtectedRoute>} />
                    <Route path="/inventory/suppliers" element={<ProtectedRoute permission="envanter:goruntule"><Suppliers /></ProtectedRoute>} />
                    <Route path="/inventory/purchase-orders" element={<ProtectedRoute permission="envanter:goruntule"><PurchaseOrders /></ProtectedRoute>} />
                    <Route path="/inventory/purchase-orders/new" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                    <Route path="/inventory/purchase-orders/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                    <Route path="/inventory/sales-orders" element={<ProtectedRoute permission="satis-siparis:goruntule"><SalesOrders /></ProtectedRoute>} />
                    <Route path="/inventory/shipments" element={<ProtectedRoute permission="sevkiyat:goruntule"><Shipments /></ProtectedRoute>} />
                    <Route path="/inventory/pick-lists" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickLists /></ProtectedRoute>} />
                    <Route path="/inventory/pick-lists/:id" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickListDetail /></ProtectedRoute>} />
                    <Route path="/inventory/warehouses" element={<ProtectedRoute permission="depo:yonet"><Warehouses /></ProtectedRoute>} />
                    <Route path="/inventory/stock-movements" element={<ProtectedRoute permission="stok-hareketi:goruntule"><StockMovements /></ProtectedRoute>} />

                    {/* Accounting */}
                    <Route path="/accounting/dashboard" element={<ProtectedRoute permission="muhasebe:goruntule"><AccountingDashboard /></ProtectedRoute>} />
                    <Route path="/invoices" element={<ProtectedRoute permission="fatura:goruntule"><Invoices /></ProtectedRoute>} />
                    <Route path="/accounting/bills" element={<ProtectedRoute permission="muhasebe:goruntule"><Bills /></ProtectedRoute>} />
                    <Route path="/accounting/bank-accounts" element={<ProtectedRoute permission="finans:goruntule"><BankAccounts /></ProtectedRoute>} />
                    <Route path="/accounting/transactions" element={<ProtectedRoute permission="finans:goruntule"><Transactions /></ProtectedRoute>} />
                    <Route path="/accounting/chart-of-accounts" element={<ProtectedRoute permission="muhasebe:goruntule"><ChartOfAccounts /></ProtectedRoute>} />
                    <Route path="/accounting/journal-entries" element={<ProtectedRoute permission="muhasebe:goruntule"><JournalEntries /></ProtectedRoute>} />
                    <Route path="/accounting/journal-entries/new" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                    <Route path="/accounting/journal-entries/:id/edit" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                    <Route path="/accounting/journal-entries/:id" element={<ProtectedRoute permission="muhasebe:goruntule"><JournalEntryDetail /></ProtectedRoute>} />
                    <Route path="/accounting/recurring-journal-entries" element={<ProtectedRoute permission="muhasebe:tekrarlanan-yonet"><RecurringJournalEntries /></ProtectedRoute>} />
                    <Route path="/accounting/budgets" element={<ProtectedRoute permission="muhasebe:butce-yonet"><Budgets /></ProtectedRoute>} />
                    <Route path="/accounting/budgets/:id" element={<ProtectedRoute permission="muhasebe:butce-yonet"><BudgetDetail /></ProtectedRoute>} />
                    <Route path="/accounting/bank-reconciliation" element={<ProtectedRoute permission="muhasebe:mutabakat-yap"><BankReconciliation /></ProtectedRoute>} />

                    {/* HR */}
                    <Route path="/hr" element={<ProtectedRoute permission="ik:goruntule"><HRDashboard /></ProtectedRoute>} />
                    <Route path="/hr/employees" element={<ProtectedRoute permission="ik:goruntule"><Employees /></ProtectedRoute>} />
                    <Route path="/hr/employees/:id" element={<ProtectedRoute permission="ik:goruntule"><EmployeeDetail /></ProtectedRoute>} />
                    <Route path="/hr/leaves" element={<ProtectedRoute permission="ik:goruntule"><LeaveManagement /></ProtectedRoute>} />
                    <Route path="/hr/performance-reviews" element={<ProtectedRoute permission="ik:performans-yonet"><PerformanceReviews /></ProtectedRoute>} />
                    <Route path="/hr/organization-chart" element={<ProtectedRoute permission="ik:goruntule"><OrganizationChart /></ProtectedRoute>} />
                    <Route path="/hr/payroll" element={<ProtectedRoute permission="ik:bordro-yonet"><Payroll /></ProtectedRoute>} />
                    <Route path="/hr/payroll/:runId" element={<ProtectedRoute permission="ik:bordro-yonet"><PayrollAndTimesheet /></ProtectedRoute>} />
                    <Route path="/hr/termination" element={<ProtectedRoute permission="ik:bordro-yonet"><TerminationCalculator /></ProtectedRoute>} />
                    <Route path="/hr/cost-simulation" element={<ProtectedRoute permission="ik:bordro-yonet"><PayrollSimulation /></ProtectedRoute>} />
                    <Route path="/hr/recruitment/jobs" element={<ProtectedRoute permission="ik:ise-alim-goruntule"><JobOpenings /></ProtectedRoute>} />
                    <Route path="/hr/recruitment/candidates" element={<ProtectedRoute permission="ik:ise-alim-goruntule"><Candidates /></ProtectedRoute>} />
                    <Route path="/hr/onboarding/templates" element={<ProtectedRoute permission="ik:oryantasyon-yonet"><OnboardingTemplates /></ProtectedRoute>} />
                    <Route path="/hr/onboarding/workflows" element={<ProtectedRoute permission="ik:oryantasyon-goruntule"><OnboardingWorkflows /></ProtectedRoute>} />
                    <Route path="/hr/onboarding/workflows/:id" element={<ProtectedRoute permission="ik:oryantasyon-goruntule"><WorkflowDetail /></ProtectedRoute>} />
                    
                    {/* Reports */}
                    <Route path="/reports" element={<ProtectedRoute permission="rapor:goruntule"><ReportsHub /></ProtectedRoute>} />
                    <Route path="/reports/sales" element={<ProtectedRoute permission="rapor:goruntule"><SalesSummaryReport /></ProtectedRoute>} />
                    <Route path="/reports/invoices" element={<ProtectedRoute permission="rapor:goruntule"><InvoiceSummaryReport /></ProtectedRoute>} />
                    <Route path="/reports/expenses" element={<ProtectedRoute permission="rapor:goruntule"><ExpenseSummaryReport /></ProtectedRoute>} />

                     {/* Accounting Reports */}
                    <Route path="/accounting/reports" element={<ProtectedRoute permission="rapor:goruntule"><AccountingReportsHub /></ProtectedRoute>} />
                    <Route path="/accounting/reports/trial-balance" element={<ProtectedRoute permission="muhasebe:goruntule"><TrialBalance /></ProtectedRoute>} />
                    <Route path="/accounting/reports/balance-sheet" element={<ProtectedRoute permission="muhasebe:bilanco-goruntule"><BalanceSheet /></ProtectedRoute>} />
                    <Route path="/accounting/reports/income-statement" element={<ProtectedRoute permission="muhasebe:gelir-tablosu-goruntule"><IncomeStatement /></ProtectedRoute>} />
                    <Route path="/accounting/reports/cash-flow" element={<ProtectedRoute permission="muhasebe:nakit-akis-goruntule"><CashFlowStatement /></ProtectedRoute>} />
                    <Route path="/accounting/reports/general-ledger" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedgerHub /></ProtectedRoute>} />
                    <Route path="/accounting/reports/general-ledger/:accountId" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedger /></ProtectedRoute>} />

                    {/* Admin & Settings */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute permission="ayarlar:goruntule"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/activity-log" element={<ProtectedRoute permission="aktivite:goruntule"><ActivityLog /></ProtectedRoute>} />
                    <Route path="/admin/settings" element={<ProtectedRoute permission="ayarlar:goruntule"><Settings /></ProtectedRoute>}>
                        <Route index element={<Navigate to="general" replace />} />
                        <Route path="general" element={<ProtectedRoute permission="ayarlar:genel-yonet"><GeneralSettings /></ProtectedRoute>} />
                        <Route path="appearance" element={<ProtectedRoute permission="ayarlar:genel-yonet"><AppearanceSettings /></ProtectedRoute>} />
                        <Route path="users" element={<ProtectedRoute permission="kullanici:yonet"><UsersSettings /></ProtectedRoute>} />
                        <Route path="roles" element={<ProtectedRoute permission="ayarlar:roller-yonet"><RolesSettings /></ProtectedRoute>} />
                        <Route path="security" element={<ProtectedRoute permission="ayarlar:guvenlik-yonet"><SecuritySettings /></ProtectedRoute>} />
                        <Route path="custom-fields" element={<ProtectedRoute permission="ayarlar:genel-yonet"><CustomFieldsSettings /></ProtectedRoute>} />
                        <Route path="integrations" element={<ProtectedRoute permission="ayarlar:genel-yonet"><IntegrationsSettings /></ProtectedRoute>} />
                        <Route path="data" element={<ProtectedRoute permission="ayarlar:genel-yonet"><DataSettings /></ProtectedRoute>} />
                        <Route path="accounting" element={<ProtectedRoute permission="ayarlar:muhasebe-yonet"><AccountingSettings /></ProtectedRoute>} />
                        <Route path="taxes" element={<ProtectedRoute permission="ayarlar:vergi-yonet"><TaxSettings /></ProtectedRoute>} />
                        <Route path="cost-centers" element={<ProtectedRoute permission="ayarlar:maliyet-merkezi-yonet"><CostCentersSettings /></ProtectedRoute>} />
                        <Route path="price-lists" element={<ProtectedRoute permission="ayarlar:genel-yonet"><PriceListsSettings /></ProtectedRoute>} />
                        <Route path="price-lists/:id" element={<ProtectedRoute permission="ayarlar:genel-yonet"><PriceListDetail /></ProtectedRoute>} />
                        <Route path="task-templates" element={<ProtectedRoute permission="ayarlar:genel-yonet"><TaskTemplatesSettings /></ProtectedRoute>} />
                    </Route>
                    
                    {/* General */}
                    <Route path="/access-denied" element={<AccessDenied />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </main>
    </div>
    <ToastContainer />
    </>
  );
};

export default App;
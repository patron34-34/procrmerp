import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { useApp } from './context/AppContext';
import ToastContainer from './components/ui/ToastContainer';
import CommandPalette from './components/layout/CommandPalette';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManagerRoute from './components/auth/ManagerRoute';

// Layouts
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import PortalSidebar from './components/layout/PortalSidebar';
import CustomerPortalSidebar from './components/layout/CustomerPortalSidebar';

// General Pages
import Dashboard from './components/pages/Dashboard';
import Customers from './components/pages/Customers';
import CustomerDetail from './components/pages/CustomerDetail';
import Projects from './components/pages/Projects';
import ProjectDetail from './components/pages/ProjectDetail';
import Tasks from './components/pages/Tasks';
import Calendar from './components/pages/calendar/Calendar';
import Documents from './components/pages/Documents';
import Automations from './components/pages/Automations';
import ScheduledTasks from './components/pages/ScheduledTasks';
import AutomationDetail from './components/pages/AutomationDetail';
import AccessDenied from './components/pages/AccessDenied';
import MyProfile from './components/pages/MyProfile';

// Sales Pages
import SalesPipeline from './components/pages/SalesPipeline';
import DealDetail from './components/pages/DealDetail';
import LeadsPage from './components/pages/sales/Leads';
import Quotations from './components/pages/Quotations';
import QuotationForm from './components/sales/QuotationForm';
import SalesAnalyticsPage from './components/pages/sales/SalesAnalytics';
import MyCommissionsPage from './components/pages/sales/MyCommissions';

// Invoicing Pages
import InvoicingDashboard from './components/pages/invoicing/InvoicingDashboard';
import InvoiceForm from './components/invoicing/InvoiceForm';
import DraftInvoices from './components/pages/invoicing/DraftInvoices';
import OutgoingInvoices from './components/pages/invoicing/OutgoingInvoices';
import SalesReturns from './components/pages/invoicing/SalesReturns';
import OutgoingInvoiceArchive from './components/pages/invoicing/OutgoingInvoiceArchive';
import Bills from './components/pages/accounting/Bills';
import IncomingInvoiceArchive from './components/pages/invoicing/IncomingInvoiceArchive';

// Inventory Pages
import InventoryDashboard from './components/pages/inventory/InventoryDashboard';
import Products from './components/pages/inventory/Products';
import ProductDetail from './components/pages/inventory/ProductDetail';
import Suppliers from './components/pages/inventory/Suppliers';
import SupplierDetail from './components/pages/inventory/SupplierDetail';
import PurchaseOrders from './components/pages/inventory/PurchaseOrders';
import PurchaseOrderForm from './components/pages/inventory/PurchaseOrderForm';
import SalesOrders from './components/pages/inventory/SalesOrders';
import SalesOrderDetail from './components/pages/inventory/SalesOrderDetail';
import Warehouses from './components/pages/inventory/Warehouses';
import StockMovements from './components/pages/inventory/StockMovements';
import Shipments from './components/pages/inventory/Shipments';
import PickLists from './components/pages/inventory/PickLists';
import PickListDetail from './components/pages/inventory/PickListDetail';

// Manufacturing Pages
import BillOfMaterials from './components/pages/manufacturing/BillOfMaterials';
import BomForm from './components/pages/manufacturing/BomForm';
import WorkOrders from './components/pages/manufacturing/WorkOrders';
import WorkOrderForm from './components/pages/manufacturing/WorkOrderForm';


// HR Pages
import HRDashboard from './components/pages/hr/HRDashboard';
import Employees from './components/pages/hr/Employees';
import EmployeeDetail from './components/pages/hr/EmployeeDetail';
import LeaveManagement from './components/pages/hr/LeaveManagement';
import Payroll from './components/pages/hr/Payroll';
import PayrollRunDetail from './components/pages/hr/PayrollAndTimesheet';
import OrganizationChart from './components/pages/hr/OrganizationChart';
import PerformanceReviews from './components/pages/hr/PerformanceReviews';
import JobOpenings from './components/pages/hr/recruitment/JobOpenings';
import Candidates from './components/pages/hr/recruitment/Candidates';
import OnboardingTemplates from './components/pages/hr/onboarding/OnboardingTemplates';
import OnboardingWorkflows from './components/pages/hr/onboarding/OnboardingWorkflows';
import WorkflowDetail from './components/pages/hr/onboarding/WorkflowDetail';
import ExpenseManagement from './components/pages/hr/ExpenseManagement';
import AssetManagement from './components/pages/hr/AssetManagement';
import TerminationCalculator from './components/pages/hr/TerminationCalculator';
import PayrollSimulation from './components/pages/hr/PayrollSimulation';

// Finance Pages
import BankAccounts from './components/pages/finance/BankAccounts';
import Transactions from './components/pages/finance/Transactions';

// Accounting Pages
import AccountingDashboard from './components/pages/accounting/AccountingDashboard';
import ChartOfAccounts from './components/pages/accounting/ChartOfAccounts';
import JournalEntries from './components/pages/accounting/JournalEntries';
import JournalEntryForm from './components/pages/accounting/JournalEntryForm';
import JournalEntryDetail from './components/pages/accounting/JournalEntryDetail';
import BankReconciliation from './components/pages/accounting/BankReconciliation';
import RecurringJournalEntries from './components/pages/accounting/RecurringJournalEntries';
import Budgets from './components/pages/accounting/Budgets';
import BudgetDetail from './components/pages/accounting/BudgetDetail';

// Reports
import ReportsHub from './components/pages/reports/ReportsHub';
import SalesSummaryReport from './components/pages/reports/SalesSummaryReport';
import InvoiceSummaryReport from './components/pages/reports/InvoiceSummaryReport';
import ExpenseSummaryReport from './components/pages/reports/ExpenseSummaryReport';
import AccountingReportsHub from './components/pages/accounting/AccountingReportsHub';
import TrialBalance from './components/pages/accounting/TrialBalance';
import BalanceSheet from './components/pages/accounting/BalanceSheet';
import IncomeStatement from './components/pages/accounting/IncomeStatement';
import CashFlowStatement from './components/pages/accounting/CashFlowStatement';
import GeneralLedgerHub from './components/pages/accounting/GeneralLedgerHub';
import GeneralLedger from './components/pages/accounting/GeneralLedger';
import HRReportsHub from './components/pages/hr/HRReportsHub';
import TurnoverReport from './components/pages/hr/TurnoverReport';
import DemographicsReport from './components/pages/hr/DemographicsReport';
import LeaveStatisticsReport from './components/pages/hr/LeaveStatisticsReport';
import PerformanceSummaryReport from './components/pages/hr/PerformanceSummaryReport';

// Support
import Tickets from './components/pages/support/Tickets';
import TicketDetail from './components/pages/support/TicketDetail';

// Settings
import Settings from './components/pages/Settings';
import GeneralSettings from './components/pages/settings/GeneralSettings';
import AppearanceSettings from './components/pages/settings/AppearanceSettings';
import UsersSettings from './components/pages/settings/UsersSettings';
import RolesSettings from './components/pages/settings/RolesSettings';
import SecuritySettings from './components/pages/settings/SecuritySettings';
import CustomFieldsSettings from './components/pages/settings/CustomFieldsSettings';
import TaxSettings from './components/pages/settings/TaxSettings';
import PriceListsSettings from './components/pages/settings/PriceListsSettings';
import PriceListDetail from './components/pages/settings/PriceListDetail';
import CostCentersSettings from './components/pages/settings/CostCentersSettings';
import CountersSettings from './components/pages/settings/CountersSettings';
import IntegrationsSettings from './components/pages/settings/IntegrationsSettings';
import DataSettings from './components/pages/settings/DataSettings';
import AccountingSettings from './components/pages/settings/AccountingSettings';
import PayrollSettings from './components/pages/settings/PayrollSettings';
import TaskTemplatesSettings from './components/pages/settings/TaskTemplatesSettings';

// Admin
import ActivityLogPage from './components/pages/ActivityLog';

// Manager Self-Service (MSS)
import MyTeam from './components/pages/mss/MyTeam';
import TeamPerformance from './components/pages/mss/TeamPerformance';

// Employee Self-Service (ESS) - Portal
import PortalDashboard from './components/pages/portal/PortalDashboard';
import MyPayslips from './components/pages/portal/MyPayslips';
import MyLeaveRequests from './components/pages/portal/MyLeaveRequests';
import MyExpenses from './components/pages/portal/MyExpenses';
import MyAssets from './components/pages/portal/MyAssets';

// Customer Portal
import CustomerDashboard from './components/pages/portal/customer/CustomerDashboard';
import CustomerInvoices from './components/pages/portal/customer/CustomerInvoices';
import CustomerProjects from './components/pages/portal/customer/CustomerProjects';
import CustomerTickets from './components/pages/portal/customer/CustomerTickets';
import CustomerProfile from './components/pages/portal/customer/CustomerProfile';

// Modal Forms
import CustomerFormModal from './components/customers/CustomerFormModal';
import DealFormModal from './components/sales/DealFormModal';
import TaskFormModal from './components/tasks/TaskFormModal';
import ProjectFormModal from './components/projects/ProjectFormModal';
import TicketFormModal from './components/support/TicketFormModal';
import SalesOrderFormModal from './components/inventory/SalesOrderFormModal';
import LogActivityModal from './components/customers/LogActivityModal';


const MainLayout = () => (
    <div className="flex h-screen bg-background text-text-main">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
                <Outlet />
            </main>
        </div>
    </div>
);

const PortalLayout = () => (
    <div className="flex h-screen bg-background text-text-main">
        <PortalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
                <Outlet />
            </main>
        </div>
    </div>
);

const CustomerPortalLayout = () => (
     <div className="flex h-screen bg-background text-text-main">
        <CustomerPortalSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
                <Outlet />
            </main>
        </div>
    </div>
);

const App: React.FC = () => {
    const { 
        isCommandPaletteOpen,
        isTaskFormOpen, setIsTaskFormOpen, editingTask, prefilledTaskData, addTask, updateTask,
        isDealFormOpen, setIsDealFormOpen, editingDeal, prefilledDealData,
        isProjectFormOpen, setIsProjectFormOpen, editingProject, prefilledProjectData,
        isTicketFormOpen, setIsTicketFormOpen, editingTicket, prefilledTicketData,
        isSalesOrderFormOpen, setIsSalesOrderFormOpen, editingSalesOrder, prefilledSalesOrderData,
    } = useApp();

    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<ProtectedRoute permission="dashboard:goruntule"><Dashboard /></ProtectedRoute>} />
                    <Route path="customers" element={<ProtectedRoute permission="musteri:goruntule"><Customers /></ProtectedRoute>} />
                    <Route path="customers/:id" element={<ProtectedRoute permission="musteri:goruntule"><CustomerDetail /></ProtectedRoute>} />
                    <Route path="sales" element={<ProtectedRoute permission="anlasma:goruntule"><SalesPipeline /></ProtectedRoute>} />
                    <Route path="sales/leads" element={<ProtectedRoute permission="anlasma:goruntule"><LeadsPage /></ProtectedRoute>} />
                    <Route path="sales/quotations" element={<ProtectedRoute permission="anlasma:goruntule"><Quotations /></ProtectedRoute>} />
                    <Route path="sales/quotations/new" element={<ProtectedRoute permission="anlasma:yonet"><QuotationForm /></ProtectedRoute>} />
                    <Route path="sales/quotations/edit/:id" element={<ProtectedRoute permission="anlasma:yonet"><QuotationForm /></ProtectedRoute>} />
                    <Route path="sales/my-commissions" element={<ProtectedRoute permission="anlasma:goruntule"><MyCommissionsPage /></ProtectedRoute>} />
                    <Route path="sales/analytics" element={<ProtectedRoute permission="rapor:goruntule"><SalesAnalyticsPage /></ProtectedRoute>} />

                    <Route path="deals/:id" element={<ProtectedRoute permission="anlasma:goruntule"><DealDetail /></ProtectedRoute>} />
                    <Route path="projects" element={<ProtectedRoute permission="proje:goruntule"><Projects /></ProtectedRoute>} />
                    <Route path="projects/:id" element={<ProtectedRoute permission="proje:goruntule"><ProjectDetail /></ProtectedRoute>} />
                    <Route path="planner" element={<ProtectedRoute permission="gorev:goruntule"><Tasks /></ProtectedRoute>} />
                    <Route path="calendar" element={<ProtectedRoute permission="takvim:goruntule"><Calendar /></ProtectedRoute>} />
                    
                    <Route path="invoicing/dashboard" element={<ProtectedRoute permission="fatura:goruntule"><InvoicingDashboard /></ProtectedRoute>} />
                    <Route path="invoicing/new" element={<ProtectedRoute permission="fatura:yonet"><InvoiceForm /></ProtectedRoute>} />
                    <Route path="invoicing/edit/:id" element={<ProtectedRoute permission="fatura:yonet"><InvoiceForm /></ProtectedRoute>} />
                    <Route path="invoicing/drafts" element={<ProtectedRoute permission="fatura:goruntule"><DraftInvoices /></ProtectedRoute>} />
                    <Route path="invoicing/outgoing" element={<ProtectedRoute permission="fatura:goruntule"><OutgoingInvoices /></ProtectedRoute>} />
                    <Route path="invoicing/returns" element={<ProtectedRoute permission="fatura:yonet"><SalesReturns /></ProtectedRoute>} />
                    <Route path="invoicing/archive/outgoing" element={<ProtectedRoute permission="fatura:goruntule"><OutgoingInvoiceArchive /></ProtectedRoute>} />
                    <Route path="invoicing/incoming" element={<ProtectedRoute permission="muhasebe:yonet"><Bills /></ProtectedRoute>} />
                    <Route path="invoicing/archive/incoming" element={<ProtectedRoute permission="muhasebe:goruntule"><IncomingInvoiceArchive /></ProtectedRoute>} />

                    <Route path="inventory/dashboard" element={<ProtectedRoute permission="envanter:goruntule"><InventoryDashboard /></ProtectedRoute>} />
                    <Route path="inventory/products" element={<ProtectedRoute permission="envanter:goruntule"><Products /></ProtectedRoute>} />
                    <Route path="inventory/products/:id" element={<ProtectedRoute permission="envanter:goruntule"><ProductDetail /></ProtectedRoute>} />
                    <Route path="inventory/suppliers" element={<ProtectedRoute permission="envanter:goruntule"><Suppliers /></ProtectedRoute>} />
                    <Route path="inventory/suppliers/:id" element={<ProtectedRoute permission="envanter:goruntule"><SupplierDetail /></ProtectedRoute>} />
                    <Route path="inventory/purchase-orders" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrders /></ProtectedRoute>} />
                    <Route path="inventory/purchase-orders/new" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                    <Route path="inventory/purchase-orders/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                    <Route path="inventory/sales-orders" element={<ProtectedRoute permission="satis-siparis:goruntule"><SalesOrders /></ProtectedRoute>} />
                    <Route path="inventory/sales-orders/:id" element={<ProtectedRoute permission="satis-siparis:goruntule"><SalesOrderDetail /></ProtectedRoute>} />
                    <Route path="inventory/warehouses" element={<ProtectedRoute permission="depo:yonet"><Warehouses /></ProtectedRoute>} />
                    <Route path="inventory/movements" element={<ProtectedRoute permission="stok-hareketi:goruntule"><StockMovements /></ProtectedRoute>} />
                    <Route path="inventory/shipments" element={<ProtectedRoute permission="sevkiyat:goruntule"><Shipments /></ProtectedRoute>} />
                    <Route path="inventory/pick-lists" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickLists /></ProtectedRoute>} />
                    <Route path="inventory/pick-lists/:id" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickListDetail /></ProtectedRoute>} />

                    <Route path="manufacturing/boms" element={<ProtectedRoute permission="envanter:yonet"><BillOfMaterials /></ProtectedRoute>} />
                    <Route path="manufacturing/boms/new" element={<ProtectedRoute permission="envanter:yonet"><BomForm /></ProtectedRoute>} />
                    <Route path="manufacturing/boms/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><BomForm /></ProtectedRoute>} />
                    <Route path="manufacturing/work-orders" element={<ProtectedRoute permission="envanter:yonet"><WorkOrders /></ProtectedRoute>} />
                    <Route path="manufacturing/work-orders/new" element={<ProtectedRoute permission="envanter:yonet"><WorkOrderForm /></ProtectedRoute>} />
                    <Route path="manufacturing/work-orders/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><WorkOrderForm /></ProtectedRoute>} />

                    <Route path="hr" element={<ProtectedRoute permission="ik:goruntule"><HRDashboard /></ProtectedRoute>} />
                    <Route path="hr/employees" element={<ProtectedRoute permission="ik:goruntule"><Employees /></ProtectedRoute>} />
                    <Route path="hr/employees/:id" element={<ProtectedRoute permission="ik:goruntule"><EmployeeDetail /></ProtectedRoute>} />
                    <Route path="hr/leaves" element={<ProtectedRoute permission="ik:izin-yonet"><LeaveManagement /></ProtectedRoute>} />
                    <Route path="hr/payroll" element={<ProtectedRoute permission="ik:bordro-yonet"><Payroll /></ProtectedRoute>} />
                    <Route path="hr/payroll/:runId" element={<ProtectedRoute permission="ik:bordro-yonet"><PayrollRunDetail /></ProtectedRoute>} />
                    <Route path="hr/organization-chart" element={<ProtectedRoute permission="ik:goruntule"><OrganizationChart /></ProtectedRoute>} />
                    <Route path="hr/performance-reviews" element={<ProtectedRoute permission="ik:performans-yonet"><PerformanceReviews /></ProtectedRoute>} />
                    <Route path="hr/recruitment/jobs" element={<ProtectedRoute permission="ik:ise-alim-goruntule"><JobOpenings /></ProtectedRoute>} />
                    <Route path="hr/recruitment/candidates" element={<ProtectedRoute permission="ik:ise-alim-goruntule"><Candidates /></ProtectedRoute>} />
                    <Route path="hr/onboarding/templates" element={<ProtectedRoute permission="ik:oryantasyon-goruntule"><OnboardingTemplates /></ProtectedRoute>} />
                    <Route path="hr/onboarding/workflows" element={<ProtectedRoute permission="ik:oryantasyon-goruntule"><OnboardingWorkflows /></ProtectedRoute>} />
                    <Route path="hr/onboarding/workflows/:id" element={<ProtectedRoute permission="ik:oryantasyon-goruntule"><WorkflowDetail /></ProtectedRoute>} />
                    <Route path="hr/expenses" element={<ProtectedRoute permission="ik:masraf-yonet"><ExpenseManagement /></ProtectedRoute>} />
                    <Route path="hr/assets" element={<ProtectedRoute permission="ik:varlik-yonet"><AssetManagement /></ProtectedRoute>} />
                    <Route path="hr/reports/termination-calculator" element={<ProtectedRoute permission="ik:rapor-goruntule"><TerminationCalculator /></ProtectedRoute>} />
                    <Route path="hr/reports/payroll-simulation" element={<ProtectedRoute permission="ik:rapor-goruntule"><PayrollSimulation /></ProtectedRoute>} />
                    <Route path="hr/reports" element={<ProtectedRoute permission="ik:rapor-goruntule"><HRReportsHub /></ProtectedRoute>} />
                    <Route path="hr/reports/turnover" element={<ProtectedRoute permission="ik:rapor-goruntule"><TurnoverReport /></ProtectedRoute>} />
                    <Route path="hr/reports/demographics" element={<ProtectedRoute permission="ik:rapor-goruntule"><DemographicsReport /></ProtectedRoute>} />
                    <Route path="hr/reports/leave-statistics" element={<ProtectedRoute permission="ik:rapor-goruntule"><LeaveStatisticsReport /></ProtectedRoute>} />
                    <Route path="hr/reports/performance-summary" element={<ProtectedRoute permission="ik:rapor-goruntule"><PerformanceSummaryReport /></ProtectedRoute>} />

                    <Route path="my-team" element={<ManagerRoute><MyTeam /></ManagerRoute>} />
                    <Route path="my-team/performance" element={<ManagerRoute><TeamPerformance /></ManagerRoute>} />

                    <Route path="finance/bank-accounts" element={<ProtectedRoute permission="finans:goruntule"><BankAccounts /></ProtectedRoute>} />
                    <Route path="finance/transactions" element={<ProtectedRoute permission="finans:goruntule"><Transactions /></ProtectedRoute>} />
                    
                    <Route path="accounting/dashboard" element={<ProtectedRoute permission="muhasebe:goruntule"><AccountingDashboard /></ProtectedRoute>} />
                    <Route path="accounting/chart-of-accounts" element={<ProtectedRoute permission="muhasebe:goruntule"><ChartOfAccounts /></ProtectedRoute>} />
                    <Route path="accounting/journal-entries" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntries /></ProtectedRoute>} />
                    <Route path="accounting/journal-entries/new" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                    <Route path="accounting/journal-entries/:id" element={<ProtectedRoute permission="muhasebe:goruntule"><JournalEntryDetail /></ProtectedRoute>} />
                    <Route path="accounting/journal-entries/:id/edit" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                    <Route path="accounting/reconciliation" element={<ProtectedRoute permission="muhasebe:mutabakat-yap"><BankReconciliation /></ProtectedRoute>} />
                    <Route path="accounting/recurring-entries" element={<ProtectedRoute permission="muhasebe:tekrarlanan-yonet"><RecurringJournalEntries /></ProtectedRoute>} />
                    <Route path="accounting/budgets" element={<ProtectedRoute permission="muhasebe:butce-yonet"><Budgets /></ProtectedRoute>} />
                    <Route path="accounting/budgets/:id" element={<ProtectedRoute permission="muhasebe:butce-yonet"><BudgetDetail /></ProtectedRoute>} />
                    <Route path="accounting/reports" element={<ProtectedRoute permission="rapor:goruntule"><AccountingReportsHub /></ProtectedRoute>} />
                    <Route path="accounting/reports/trial-balance" element={<ProtectedRoute permission="muhasebe:goruntule"><TrialBalance /></ProtectedRoute>} />
                    <Route path="accounting/reports/balance-sheet" element={<ProtectedRoute permission="muhasebe:bilanco-goruntule"><BalanceSheet /></ProtectedRoute>} />
                    <Route path="accounting/reports/income-statement" element={<ProtectedRoute permission="muhasebe:gelir-tablosu-goruntule"><IncomeStatement /></ProtectedRoute>} />
                    <Route path="accounting/reports/cash-flow" element={<ProtectedRoute permission="muhasebe:nakit-akis-goruntule"><CashFlowStatement /></ProtectedRoute>} />
                    <Route path="accounting/reports/general-ledger" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedgerHub /></ProtectedRoute>} />
                    <Route path="accounting/reports/general-ledger/:accountId" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedger /></ProtectedRoute>} />
                    
                    <Route path="reports" element={<ProtectedRoute permission="rapor:goruntule"><ReportsHub /></ProtectedRoute>} />
                    <Route path="reports/sales" element={<ProtectedRoute permission="rapor:goruntule"><SalesSummaryReport /></ProtectedRoute>} />
                    <Route path="reports/invoices" element={<ProtectedRoute permission="rapor:goruntule"><InvoiceSummaryReport /></ProtectedRoute>} />
                    <Route path="reports/expenses" element={<ProtectedRoute permission="rapor:goruntule"><ExpenseSummaryReport /></ProtectedRoute>} />
                    
                    <Route path="support/tickets" element={<ProtectedRoute permission="destek:goruntule"><Tickets /></ProtectedRoute>} />
                    <Route path="support/tickets/:id" element={<ProtectedRoute permission="destek:goruntule"><TicketDetail /></ProtectedRoute>} />

                    <Route path="documents" element={<ProtectedRoute permission="dokuman:goruntule"><Documents /></ProtectedRoute>} />
                    <Route path="automations" element={<ProtectedRoute permission="otomasyon:goruntule"><Automations /></ProtectedRoute>} />
                    <Route path="automations/scheduled-tasks" element={<ProtectedRoute permission="otomasyon:yonet"><ScheduledTasks /></ProtectedRoute>} />
                    <Route path="automations/rules/:id" element={<ProtectedRoute permission="otomasyon:goruntule"><AutomationDetail /></ProtectedRoute>} />

                    <Route path="admin/settings" element={<ProtectedRoute permission="ayarlar:goruntule"><Settings /></ProtectedRoute>}>
                        <Route index element={<GeneralSettings />} />
                        <Route path="general" element={<GeneralSettings />} />
                        <Route path="appearance" element={<AppearanceSettings />} />
                        <Route path="users" element={<UsersSettings />} />
                        <Route path="roles" element={<RolesSettings />} />
                        <Route path="security" element={<SecuritySettings />} />
                        <Route path="custom-fields" element={<CustomFieldsSettings />} />
                        <Route path="taxes" element={<TaxSettings />} />
                        <Route path="price-lists" element={<PriceListsSettings />} />
                        <Route path="price-lists/:id" element={<PriceListDetail />} />
                        <Route path="cost-centers" element={<CostCentersSettings />} />
                        <Route path="counters" element={<CountersSettings />} />
                        <Route path="integrations" element={<IntegrationsSettings />} />
                        <Route path="data" element={<DataSettings />} />
                        <Route path="accounting" element={<AccountingSettings />} />
                        <Route path="payroll" element={<PayrollSettings />} />
                        <Route path="task-templates" element={<TaskTemplatesSettings />} />
                    </Route>
                    <Route path="admin/activity-log" element={<ProtectedRoute permission="aktivite:goruntule"><ActivityLogPage /></ProtectedRoute>} />
                    
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="access-denied" element={<AccessDenied />} />
                </Route>

                <Route path="/portal" element={<PortalLayout />}>
                    <Route path="dashboard" element={<PortalDashboard />} />
                    <Route path="payslips" element={<MyPayslips />} />
                    <Route path="leaves" element={<MyLeaveRequests />} />
                    <Route path="expenses" element={<MyExpenses />} />
                    <Route path="assets" element={<MyAssets />} />
                </Route>
                
                 <Route path="/portal/customer" element={<CustomerPortalLayout />}>
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="invoices" element={<CustomerInvoices />} />
                    <Route path="projects" element={<CustomerProjects />} />
                    <Route path="tickets" element={<CustomerTickets />} />
                    <Route path="profile" element={<CustomerProfile />} />
                </Route>
            </Routes>

            {isCommandPaletteOpen && <CommandPalette />}
            <ToastContainer />

            {/* Centralized Modals */}
            <CustomerFormModal />
            <LogActivityModal />
            
            {isDealFormOpen && (
                <DealFormModal
                    isOpen={isDealFormOpen}
                    onClose={() => setIsDealFormOpen(false)}
                    deal={editingDeal}
                    prefilledData={prefilledDealData}
                />
            )}
            
            {isTaskFormOpen && (
                <TaskFormModal
                    isOpen={isTaskFormOpen}
                    onClose={() => setIsTaskFormOpen(false)}
                    task={editingTask}
                    prefilledData={prefilledTaskData}
                    onSubmit={(data, subtasks) => {
                        if (editingTask) {
                            updateTask({ ...editingTask, ...data });
                        } else {
                            addTask(data, subtasks);
                        }
                        setIsTaskFormOpen(false);
                    }}
                />
            )}
            
            {isProjectFormOpen && (
                <ProjectFormModal
                    isOpen={isProjectFormOpen}
                    onClose={() => setIsProjectFormOpen(false)}
                    project={editingProject}
                    prefilledData={prefilledProjectData}
                />
            )}

            {isTicketFormOpen && (
                <TicketFormModal
                    isOpen={isTicketFormOpen}
                    onClose={() => setIsTicketFormOpen(false)}
                    ticket={editingTicket}
                    prefilledData={prefilledTicketData}
                />
            )}

            {isSalesOrderFormOpen && (
                <SalesOrderFormModal
                    isOpen={isSalesOrderFormOpen}
                    onClose={() => setIsSalesOrderFormOpen(false)}
                    order={editingSalesOrder}
                    prefilledData={prefilledSalesOrderData}
                />
            )}
        </>
    );
};

export default App;
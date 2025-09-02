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
import MyExpenses from './components/pages/portal/MyExpenses';
import MyAssets from './components/pages/portal/MyAssets';

// Manager Self-Service (MSS) Components
import ManagerRoute from './components/auth/ManagerRoute';
import MyTeam from './components/pages/mss/MyTeam';
import TeamPerformance from './components/pages/mss/TeamPerformance';

import Dashboard from './components/pages/Dashboard';
import Customers from './components/pages/Customers';
import SalesPipeline from './components/pages/SalesPipeline';
import Projects from './components/pages/Projects';
import CustomerDetail from './components/pages/CustomerDetail';
import Products from './components/pages/inventory/Products';
import Suppliers from './components/pages/inventory/Suppliers';
import SupplierDetail from './components/pages/inventory/SupplierDetail';
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
import TicketDetail from './components/pages/support/TicketDetail';
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
import Settings from './components/pages/Settings';
import DynamicStyles from './DynamicStyles';
import InventoryDashboard from './components/pages/inventory/InventoryDashboard';
import StockMovements from './components/pages/inventory/StockMovements';
import Warehouses from './components/pages/inventory/Warehouses';
import SalesOrders from './components/pages/inventory/SalesOrders';
import SalesOrderDetail from './components/pages/inventory/SalesOrderDetail';
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
import AccountingDashboard from './components/pages/accounting/AccountingDashboard';
import AccountingReportsHub from './components/pages/accounting/AccountingReportsHub';
import TrialBalance from './components/pages/accounting/TrialBalance';
import BalanceSheet from './components/pages/accounting/BalanceSheet';
import IncomeStatement from './components/pages/accounting/IncomeStatement';
import CashFlowStatement from './components/pages/accounting/CashFlowStatement';
import Bills from './components/pages/accounting/Bills';
import GeneralLedger from './components/pages/accounting/GeneralLedger';
import GeneralLedgerHub from './components/pages/accounting/GeneralLedgerHub';
import RecurringJournalEntries from './components/pages/accounting/RecurringJournalEntries';
import Budgets from './components/pages/accounting/Budgets';
import BudgetDetail from './components/pages/accounting/BudgetDetail';
import BankAccounts from './components/pages/finance/BankAccounts';

import OutgoingInvoices from './components/pages/invoicing/OutgoingInvoices';
import DraftInvoices from './components/pages/invoicing/DraftInvoices';
import InvoiceForm from './components/invoicing/InvoiceForm';
import OutgoingInvoiceArchive from './components/pages/invoicing/OutgoingInvoiceArchive';
import IncomingInvoiceArchive from './components/pages/invoicing/IncomingInvoiceArchive';

import BillOfMaterials from './components/pages/manufacturing/BillOfMaterials';
import BomForm from './components/pages/manufacturing/BomForm';
import WorkOrders from './components/pages/manufacturing/WorkOrders';
import WorkOrderForm from './components/pages/manufacturing/WorkOrderForm';

import Automations from './components/pages/Automations';
import AutomationDetail from './components/pages/AutomationDetail';
import ScheduledTasks from './components/pages/ScheduledTasks';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import DataSettings from './components/pages/settings/DataSettings';
import PriceListsSettings from './components/pages/settings/PriceListsSettings';
import PriceListDetail from './components/pages/settings/PriceListDetail';
import TaxSettings from './components/pages/settings/TaxSettings';
import CostCentersSettings from './components/pages/settings/CostCentersSettings';
import AccountingSettings from './components/pages/settings/AccountingSettings';
import CountersSettings from './components/pages/settings/CountersSettings';
import TaskTemplatesSettings from './components/pages/settings/TaskTemplatesSettings';
import AssetManagement from './components/pages/hr/AssetManagement';
import ExpenseManagement from './components/pages/hr/ExpenseManagement';
import PayrollSettings from './components/pages/settings/PayrollSettings';
import HRReportsHub from './components/pages/hr/HRReportsHub';
import TurnoverReport from './components/pages/hr/TurnoverReport';
import Calendar from './components/pages/Calendar';

const App: React.FC = () => {
    const { currentUser } = useApp();

    const isPortal = currentUser.role === 'calisan';

    if (isPortal) {
        return (
            <div className="flex h-screen bg-background text-text-main dark:bg-dark-background dark:text-dark-text-main">
                <PortalSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
                        <Routes>
                            <Route path="/portal/dashboard" element={<PortalDashboard />} />
                            <Route path="/portal/payslips" element={<MyPayslips />} />
                            <Route path="/portal/leaves" element={<MyLeaveRequests />} />
                            <Route path="/portal/expenses" element={<MyExpenses />} />
                            <Route path="/portal/assets" element={<MyAssets />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/*" element={<Navigate to="/portal/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
                <ToastContainer />
                <DynamicStyles />
            </div>
        );
    }
    
    return (
        <div className="flex h-screen bg-background text-text-main dark:bg-dark-background dark:text-dark-text-main">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<ProtectedRoute permission="dashboard:goruntule"><Dashboard /></ProtectedRoute>} />
                        <Route path="/customers" element={<ProtectedRoute permission="musteri:goruntule"><Customers /></ProtectedRoute>} />
                        <Route path="/customers/:id" element={<ProtectedRoute permission="musteri:goruntule"><CustomerDetail /></ProtectedRoute>} />
                        <Route path="/sales" element={<ProtectedRoute permission="anlasma:goruntule"><SalesPipeline /></ProtectedRoute>} />
                        <Route path="/deals/:id" element={<ProtectedRoute permission="anlasma:goruntule"><DealDetail /></ProtectedRoute>} />
                        <Route path="/projects" element={<ProtectedRoute permission="proje:goruntule"><Projects /></ProtectedRoute>} />
                        <Route path="/projects/:id" element={<ProtectedRoute permission="proje:goruntule"><ProjectDetail /></ProtectedRoute>} />
                        <Route path="/planner" element={<ProtectedRoute permission="gorev:goruntule"><Tasks /></ProtectedRoute>} />
                        <Route path="/calendar" element={<ProtectedRoute permission="takvim:goruntule"><Calendar /></ProtectedRoute>} />
                        
                        {/* Invoicing Routes */}
                        <Route path="/invoicing/drafts" element={<ProtectedRoute permission="fatura:goruntule"><DraftInvoices /></ProtectedRoute>} />
                        <Route path="/invoicing/outgoing" element={<ProtectedRoute permission="fatura:goruntule"><OutgoingInvoices /></ProtectedRoute>} />
                        <Route path="/invoicing/new" element={<ProtectedRoute permission="fatura:yonet"><InvoiceForm /></ProtectedRoute>} />
                        <Route path="/invoicing/edit/:id" element={<ProtectedRoute permission="fatura:yonet"><InvoiceForm /></ProtectedRoute>} />
                        <Route path="/invoicing/incoming" element={<ProtectedRoute permission="muhasebe:yonet"><Bills /></ProtectedRoute>} />
                        <Route path="/invoicing/archive/outgoing" element={<ProtectedRoute permission="fatura:goruntule"><OutgoingInvoiceArchive /></ProtectedRoute>} />
                        <Route path="/invoicing/archive/incoming" element={<ProtectedRoute permission="muhasebe:yonet"><IncomingInvoiceArchive /></ProtectedRoute>} />

                        {/* Inventory Routes */}
                        <Route path="/inventory/dashboard" element={<ProtectedRoute permission="envanter:goruntule"><InventoryDashboard /></ProtectedRoute>} />
                        <Route path="/inventory/products" element={<ProtectedRoute permission="envanter:goruntule"><Products /></ProtectedRoute>} />
                        <Route path="/inventory/products/:id" element={<ProtectedRoute permission="envanter:goruntule"><ProductDetail /></ProtectedRoute>} />
                        <Route path="/inventory/suppliers" element={<ProtectedRoute permission="envanter:goruntule"><Suppliers /></ProtectedRoute>} />
                        <Route path="/inventory/suppliers/:id" element={<ProtectedRoute permission="envanter:goruntule"><SupplierDetail /></ProtectedRoute>} />
                        <Route path="/inventory/purchase-orders" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrders /></ProtectedRoute>} />
                        <Route path="/inventory/purchase-orders/new" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                        <Route path="/inventory/purchase-orders/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><PurchaseOrderForm /></ProtectedRoute>} />
                        <Route path="/inventory/stock-movements" element={<ProtectedRoute permission="stok-hareketi:goruntule"><StockMovements /></ProtectedRoute>} />
                        <Route path="/inventory/warehouses" element={<ProtectedRoute permission="depo:yonet"><Warehouses /></ProtectedRoute>} />
                        <Route path="/inventory/sales-orders" element={<ProtectedRoute permission="satis-siparis:goruntule"><SalesOrders /></ProtectedRoute>} />
                        <Route path="/inventory/sales-orders/:id" element={<ProtectedRoute permission="satis-siparis:goruntule"><SalesOrderDetail /></ProtectedRoute>} />
                        
                        {/* Sales Routes connected to Inventory */}
                        <Route path="/sales/shipments" element={<ProtectedRoute permission="sevkiyat:goruntule"><Shipments /></ProtectedRoute>} />
                        <Route path="/sales/pick-lists" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickLists /></ProtectedRoute>} />
                        <Route path="/inventory/pick-lists/:id" element={<ProtectedRoute permission="toplama-listesi:goruntule"><PickListDetail /></ProtectedRoute>} />

                        {/* Manufacturing Routes */}
                        <Route path="/manufacturing/boms" element={<ProtectedRoute permission="envanter:yonet"><BillOfMaterials /></ProtectedRoute>} />
                        <Route path="/manufacturing/boms/new" element={<ProtectedRoute permission="envanter:yonet"><BomForm /></ProtectedRoute>} />
                        <Route path="/manufacturing/boms/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><BomForm /></ProtectedRoute>} />
                        <Route path="/manufacturing/work-orders" element={<ProtectedRoute permission="envanter:yonet"><WorkOrders /></ProtectedRoute>} />
                        <Route path="/manufacturing/work-orders/new" element={<ProtectedRoute permission="envanter:yonet"><WorkOrderForm /></ProtectedRoute>} />
                        <Route path="/manufacturing/work-orders/:id/edit" element={<ProtectedRoute permission="envanter:yonet"><WorkOrderForm /></ProtectedRoute>} />

                        {/* HR Routes */}
                        <Route path="/hr" element={<ProtectedRoute permission="ik:goruntule"><HRDashboard /></ProtectedRoute>} />
                        <Route path="/hr/employees" element={<ProtectedRoute permission="ik:goruntule"><Employees /></ProtectedRoute>} />
                        <Route path="/hr/employees/:id" element={<ProtectedRoute permission="ik:goruntule"><EmployeeDetail /></ProtectedRoute>} />
                        <Route path="/hr/leaves" element={<ProtectedRoute permission="ik:izin-yonet"><LeaveManagement /></ProtectedRoute>} />
                        <Route path="/hr/payroll" element={<ProtectedRoute permission="ik:bordro-yonet"><Payroll /></ProtectedRoute>} />
                        <Route path="/hr/payroll/:runId" element={<ProtectedRoute permission="ik:bordro-yonet"><PayrollAndTimesheet /></ProtectedRoute>} />
                        <Route path="/hr/performance" element={<ProtectedRoute permission="ik:performans-yonet"><PerformanceReviews /></ProtectedRoute>} />
                        <Route path="/hr/recruitment/jobs" element={<ProtectedRoute permission="ik:ise-alim-yonet"><JobOpenings /></ProtectedRoute>} />
                        <Route path="/hr/recruitment/candidates" element={<ProtectedRoute permission="ik:ise-alim-yonet"><Candidates /></ProtectedRoute>} />
                        <Route path="/hr/onboarding/templates" element={<ProtectedRoute permission="ik:oryantasyon-yonet"><OnboardingTemplates /></ProtectedRoute>} />
                        <Route path="/hr/onboarding/workflows" element={<ProtectedRoute permission="ik:oryantasyon-yonet"><OnboardingWorkflows /></ProtectedRoute>} />
                        <Route path="/hr/onboarding/workflows/:id" element={<ProtectedRoute permission="ik:oryantasyon-yonet"><WorkflowDetail /></ProtectedRoute>} />
                        <Route path="/hr/organization-chart" element={<ProtectedRoute permission="ik:goruntule"><OrganizationChart /></ProtectedRoute>} />
                        <Route path="/hr/tools/termination-calculator" element={<ProtectedRoute permission="ik:maas-goruntule"><TerminationCalculator /></ProtectedRoute>} />
                        <Route path="/hr/tools/payroll-simulation" element={<ProtectedRoute permission="ik:maas-goruntule"><PayrollSimulation /></ProtectedRoute>} />
                        <Route path="/hr/expense-management" element={<ProtectedRoute permission="ik:masraf-yonet"><ExpenseManagement /></ProtectedRoute>} />
                        <Route path="/hr/asset-management" element={<ProtectedRoute permission="ik:varlik-yonet"><AssetManagement /></ProtectedRoute>} />
                        <Route path="/hr/reports" element={<ProtectedRoute permission="ik:rapor-goruntule"><HRReportsHub /></ProtectedRoute>} />
                        <Route path="/hr/reports/turnover" element={<ProtectedRoute permission="ik:rapor-goruntule"><TurnoverReport /></ProtectedRoute>} />

                        {/* Manager Self-Service (MSS) Routes */}
                        <Route path="/my-team" element={<ManagerRoute><MyTeam /></ManagerRoute>} />
                        <Route path="/my-team/performance" element={<ManagerRoute><TeamPerformance /></ManagerRoute>} />

                        {/* Finance Routes */}
                        <Route path="/finance/bank-accounts" element={<ProtectedRoute permission="finans:yonet"><BankAccounts /></ProtectedRoute>} />
                        <Route path="/finance/transactions" element={<ProtectedRoute permission="finans:yonet"><Bills /></ProtectedRoute>} />
                        <Route path="/finance/budgets" element={<ProtectedRoute permission="muhasebe:butce-yonet"><Budgets /></ProtectedRoute>} />
                        <Route path="/finance/budgets/:id" element={<ProtectedRoute permission="muhasebe:butce-yonet"><BudgetDetail /></ProtectedRoute>} />
                        <Route path="/finance/bank-reconciliation" element={<ProtectedRoute permission="muhasebe:mutabakat-yap"><RecurringJournalEntries /></ProtectedRoute>} />

                        {/* Accounting Routes */}
                        <Route path="/accounting/dashboard" element={<ProtectedRoute permission="muhasebe:goruntule"><AccountingDashboard /></ProtectedRoute>} />
                        <Route path="/accounting/chart-of-accounts" element={<ProtectedRoute permission="muhasebe:goruntule"><ChartOfAccounts /></ProtectedRoute>} />
                        <Route path="/accounting/journal-entries" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntries /></ProtectedRoute>} />
                        <Route path="/accounting/journal-entries/new" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                        <Route path="/accounting/journal-entries/:id/edit" element={<ProtectedRoute permission="muhasebe:yonet"><JournalEntryForm /></ProtectedRoute>} />
                        <Route path="/accounting/journal-entries/:id" element={<ProtectedRoute permission="muhasebe:goruntule"><JournalEntryDetail /></ProtectedRoute>} />
                        <Route path="/accounting/recurring-journal-entries" element={<ProtectedRoute permission="muhasebe:tekrarlanan-yonet"><RecurringJournalEntries /></ProtectedRoute>} />
                        <Route path="/accounting/reports" element={<ProtectedRoute permission="rapor:goruntule"><AccountingReportsHub /></ProtectedRoute>} />
                        <Route path="/accounting/reports/trial-balance" element={<ProtectedRoute permission="muhasebe:goruntule"><TrialBalance /></ProtectedRoute>} />
                        <Route path="/accounting/reports/balance-sheet" element={<ProtectedRoute permission="muhasebe:bilanco-goruntule"><BalanceSheet /></ProtectedRoute>} />
                        <Route path="/accounting/reports/income-statement" element={<ProtectedRoute permission="muhasebe:gelir-tablosu-goruntule"><IncomeStatement /></ProtectedRoute>} />
                        <Route path="/accounting/reports/cash-flow" element={<ProtectedRoute permission="muhasebe:nakit-akis-goruntule"><CashFlowStatement /></ProtectedRoute>} />
                        <Route path="/accounting/reports/general-ledger" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedgerHub /></ProtectedRoute>} />
                        <Route path="/accounting/reports/general-ledger/:accountId" element={<ProtectedRoute permission="muhasebe:defteri-kebir-goruntule"><GeneralLedger /></ProtectedRoute>} />

                        {/* Reports */}
                        <Route path="/reports" element={<ProtectedRoute permission="rapor:goruntule"><ReportsHub /></ProtectedRoute>} />
                        <Route path="/reports/sales" element={<ProtectedRoute permission="rapor:goruntule"><SalesSummaryReport /></ProtectedRoute>} />
                        <Route path="/reports/invoices" element={<ProtectedRoute permission="rapor:goruntule"><InvoiceSummaryReport /></ProtectedRoute>} />
                        <Route path="/reports/expenses" element={<ProtectedRoute permission="rapor:goruntule"><ExpenseSummaryReport /></ProtectedRoute>} />

                        {/* Support */}
                        <Route path="/support/tickets" element={<ProtectedRoute permission="destek:goruntule"><Tickets /></ProtectedRoute>} />
                        <Route path="/support/tickets/:id" element={<ProtectedRoute permission="destek:goruntule"><TicketDetail /></ProtectedRoute>} />

                        {/* Operations */}
                        <Route path="/documents" element={<ProtectedRoute permission="dokuman:goruntule"><Documents /></ProtectedRoute>} />
                        <Route path="/automations" element={<ProtectedRoute permission="otomasyon:goruntule"><Automations /></ProtectedRoute>} />
                        <Route path="/automations/rules/:id" element={<ProtectedRoute permission="otomasyon:goruntule"><AutomationDetail /></ProtectedRoute>} />
                        <Route path="/automations/scheduled-tasks" element={<ProtectedRoute permission="otomasyon:yonet"><ScheduledTasks /></ProtectedRoute>} />

                        {/* Admin */}
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
                            <Route path="price-lists" element={<ProtectedRoute permission="ayarlar:genel-yonet"><PriceListsSettings /></ProtectedRoute>} />
                            <Route path="price-lists/:id" element={<ProtectedRoute permission="ayarlar:genel-yonet"><PriceListDetail /></ProtectedRoute>} />
                            <Route path="taxes" element={<ProtectedRoute permission="ayarlar:vergi-yonet"><TaxSettings /></ProtectedRoute>} />
                            <Route path="cost-centers" element={<ProtectedRoute permission="ayarlar:maliyet-merkezi-yonet"><CostCentersSettings /></ProtectedRoute>} />
                            <Route path="accounting" element={<ProtectedRoute permission="ayarlar:muhasebe-yonet"><AccountingSettings /></ProtectedRoute>} />
                             <Route path="counters" element={<ProtectedRoute permission="ayarlar:muhasebe-yonet"><CountersSettings /></ProtectedRoute>} />
                            <Route path="task-templates" element={<ProtectedRoute permission="ayarlar:genel-yonet"><TaskTemplatesSettings /></ProtectedRoute>} />
                            <Route path="payroll" element={<ProtectedRoute permission="ayarlar:ik-bordro-yonet"><PayrollSettings /></ProtectedRoute>} />
                        </Route>

                        {/* User Profile */}
                        <Route path="/profile" element={<MyProfile />} />
                        <Route path="/access-denied" element={<AccessDenied />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
            <ToastContainer />
            <DynamicStyles />
        </div>
    );
};

export default App;
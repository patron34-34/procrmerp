import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useCustomers } from '../hooks/useCustomers';
import * as T from '../types';
import * as C from '../constants';
import { ApiService } from '../services/api';
import { summarizeText } from '../services/geminiService';
import { numberToWords } from '../utils/numberToWords';

const AppContext = createContext<T.AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Customer State (Moved from CustomerContext)
    const { 
        customers, 
        setCustomers,
        addCustomer: originalAddCustomer,
        updateCustomer: originalUpdateCustomer,
        updateCustomerStatus: originalUpdateCustomerStatus,
        deleteCustomer: originalDeleteCustomer,
        deleteMultipleCustomers: originalDeleteMultipleCustomers,
        importCustomers: originalImportCustomers,
     } = useCustomers(C.MOCK_CUSTOMERS);
    const [contacts, setContacts] = useLocalStorageState<T.Contact[]>('contacts', C.MOCK_CONTACTS);
    const [communicationLogs, setCommunicationLogs] = useLocalStorageState<T.CommunicationLog[]>('communicationLogs', C.MOCK_COMMUNICATION_LOGS);
    const [savedViews, setSavedViews] = useLocalStorageState<T.SavedView[]>('savedViews', C.MOCK_SAVED_VIEWS);

    // Existing App State
    const [deals, setDeals] = useLocalStorageState<T.Deal[]>('deals', C.MOCK_DEALS);
    const [projects, setProjects] = useLocalStorageState<T.Project[]>('projects', C.MOCK_PROJECTS);
    const [tasks, setTasks] = useLocalStorageState<T.Task[]>('tasks', C.MOCK_TASKS);
    const [notifications, setNotifications] = useLocalStorageState<T.Notification[]>('notifications', C.MOCK_NOTIFICATIONS);
    const [invoices, setInvoices] = useLocalStorageState<T.Invoice[]>('invoices', C.MOCK_INVOICES);
    const [bills, setBills] = useLocalStorageState<T.Bill[]>('bills', C.MOCK_BILLS);
    const [products, setProducts] = useLocalStorageState<T.Product[]>('products', C.MOCK_PRODUCTS);
    const [suppliers, setSuppliers] = useLocalStorageState<T.Supplier[]>('suppliers', C.MOCK_SUPPLIERS);
    const [purchaseOrders, setPurchaseOrders] = useLocalStorageState<T.PurchaseOrder[]>('purchaseOrders', C.MOCK_PURCHASE_ORDERS);
    const [employees, setEmployees] = useLocalStorageState<T.Employee[]>('employees', C.MOCK_EMPLOYEES);
    const [leaveRequests, setLeaveRequests] = useLocalStorageState<T.LeaveRequest[]>('leaveRequests', C.MOCK_LEAVE_REQUESTS);
    const [performanceReviews, setPerformanceReviews] = useLocalStorageState<T.PerformanceReview[]>('performanceReviews', C.MOCK_PERFORMANCE_REVIEWS);
    const [jobOpenings, setJobOpenings] = useLocalStorageState<T.JobOpening[]>('jobOpenings', C.MOCK_JOB_OPENINGS);
    const [candidates, setCandidates] = useLocalStorageState<T.Candidate[]>('candidates', C.MOCK_CANDIDATES);
    const [onboardingTemplates, setOnboardingTemplates] = useLocalStorageState<T.OnboardingTemplate[]>('onboardingTemplates', C.MOCK_ONBOARDING_TEMPLATES);
    const [onboardingWorkflows, setOnboardingWorkflows] = useLocalStorageState<T.OnboardingWorkflow[]>('onboardingWorkflows', C.MOCK_ONBOARDING_WORKFLOWS);
    const [payrollRuns, setPayrollRuns] = useLocalStorageState<T.PayrollRun[]>('payrollRuns', C.MOCK_PAYROLL_RUNS);
    const [payslips, setPayslips] = useLocalStorageState<T.Payslip[]>('payslips', C.MOCK_PAYSLIPS);
    const [bankAccounts, setBankAccounts] = useLocalStorageState<T.BankAccount[]>('bankAccounts', C.MOCK_BANK_ACCOUNTS);
    const [transactions, setTransactions] = useLocalStorageState<T.Transaction[]>('transactions', C.MOCK_TRANSACTIONS);
    const [tickets, setTickets] = useLocalStorageState<T.SupportTicket[]>('tickets', C.MOCK_TICKETS);
    const [documents, setDocuments] = useLocalStorageState<T.Document[]>('documents', C.MOCK_DOCUMENTS);
    const [comments, setComments] = useLocalStorageState<T.Comment[]>('comments', C.MOCK_COMMENTS);
    const [salesActivities, setSalesActivities] = useLocalStorageState<T.SalesActivity[]>('salesActivities', C.MOCK_SALES_ACTIVITIES);
    const [activityLogs, setActivityLogs] = useLocalStorageState<T.ActivityLog[]>('activityLogs', []);
    const [customFieldDefinitions, setCustomFieldDefinitions] = useLocalStorageState<T.CustomFieldDefinition[]>('customFieldDefinitions', C.MOCK_CUSTOM_FIELD_DEFINITIONS);
    const [dashboardLayout, setDashboardLayout] = useLocalStorageState<T.DashboardWidget[]>('dashboardLayout', C.INITIAL_DASHBOARD_LAYOUT);
    const [companyInfo, setCompanyInfo] = useLocalStorageState<T.CompanyInfo>('companyInfo', C.MOCK_COMPANY_INFO);
    const [brandingSettings, setBrandingSettings] = useLocalStorageState<T.BrandingSettings>('brandingSettings', C.MOCK_BRANDING_SETTINGS);
    const [securitySettings, setSecuritySettings] = useLocalStorageState<T.SecuritySettings>('securitySettings', C.MOCK_SECURITY_SETTINGS);
    const [roles, setRoles] = useLocalStorageState<T.Role[]>('roles', C.INITIAL_ROLES);
    const [rolesPermissions, setRolesPermissions] = useLocalStorageState<Record<string, T.Permission[]>>('rolesPermissions', C.INITIAL_ROLES_PERMISSIONS);
    const [taxRates, setTaxRates] = useLocalStorageState<T.TaxRate[]>('taxRates', C.MOCK_TAX_RATES);
    const [systemLists, setSystemLists] = useLocalStorageState<T.SystemLists>('systemLists', C.INITIAL_SYSTEM_LISTS);
    const [emailTemplates, setEmailTemplates] = useLocalStorageState<T.EmailTemplate[]>('emailTemplates', C.INITIAL_EMAIL_TEMPLATES);
    const [priceLists, setPriceLists] = useLocalStorageState<T.PriceList[]>('priceLists', C.MOCK_PRICE_LISTS);
    const [priceListItems, setPriceListItems] = useLocalStorageState<T.PriceListItem[]>('priceListItems', C.MOCK_PRICE_LIST_ITEMS);
    const [automations, setAutomations] = useLocalStorageState<T.Automation[]>('automations', C.MOCK_AUTOMATIONS);
    const [automationLogs, setAutomationLogs] = useLocalStorageState<T.AutomationLog[]>('automationLogs', C.MOCK_AUTOMATION_LOGS);
    const [taskTemplates, setTaskTemplates] = useLocalStorageState<T.TaskTemplate[]>('taskTemplates', C.MOCK_TASK_TEMPLATES);
    const [scheduledTasks, setScheduledTasks] = useLocalStorageState<T.ScheduledTask[]>('scheduledTasks', C.MOCK_SCHEDULED_TASKS);
    const [counters, setCounters] = useLocalStorageState<T.CountersSettings>('counters', C.MOCK_COUNTERS_SETTINGS);
    const [cartItems, setCartItems] = useState<T.CartItem[]>([]);
    const [warehouses, setWarehouses] = useLocalStorageState<T.Warehouse[]>('warehouses', C.MOCK_WAREHOUSES);
    const [stockMovements, setStockMovements] = useLocalStorageState<T.StockMovement[]>('stockMovements', C.MOCK_STOCK_MOVEMENTS);
    const [inventoryTransfers, setInventoryTransfers] = useLocalStorageState<T.InventoryTransfer[]>('inventoryTransfers', C.MOCK_INVENTORY_TRANSFERS);
    const [inventoryAdjustments, setInventoryAdjustments] = useLocalStorageState<T.InventoryAdjustment[]>('inventoryAdjustments', C.MOCK_INVENTORY_ADJUSTMENTS);
    const [salesOrders, setSalesOrders] = useLocalStorageState<T.SalesOrder[]>('salesOrders', C.MOCK_SALES_ORDERS);
    const [shipments, setShipments] = useLocalStorageState<T.Shipment[]>('shipments', C.MOCK_SHIPMENTS);
    const [stockItems, setStockItems] = useLocalStorageState<T.StockItem[]>('stockItems', C.MOCK_STOCK_ITEMS);
    const [pickLists, setPickLists] = useLocalStorageState<T.PickList[]>('pickLists', C.MOCK_PICK_LISTS);
    const [boms, setBoms] = useLocalStorageState<T.BillOfMaterials[]>('boms', C.MOCK_BOMS);
    const [workOrders, setWorkOrders] = useLocalStorageState<T.WorkOrder[]>('workOrders', C.MOCK_WORK_ORDERS);
    const [accounts, setAccounts] = useLocalStorageState<T.Account[]>('accounts', C.MOCK_ACCOUNTS);
    const [journalEntries, setJournalEntries] = useLocalStorageState<T.JournalEntry[]>('journalEntries', C.MOCK_JOURNAL_ENTRIES);
    const [recurringJournalEntries, setRecurringJournalEntries] = useLocalStorageState<T.RecurringJournalEntry[]>('recurringJournalEntries', C.MOCK_RECURRING_JOURNAL_ENTRIES);
    const [budgets, setBudgets] = useLocalStorageState<T.Budget[]>('budgets', C.MOCK_BUDGETS);
    const [costCenters, setCostCenters] = useLocalStorageState<T.CostCenter[]>('costCenters', C.MOCK_COST_CENTERS);
    const [accountingLockDate, setAccountingLockDate] = useLocalStorageState<string | null>('accountingLockDate', null);
    const [currentUser, setCurrentUser] = useLocalStorageState<T.Employee>('currentUser', C.MOCK_EMPLOYEES[1]); // Default to admin
    const [expenses, setExpenses] = useLocalStorageState<T.Expense[]>('expenses', C.MOCK_EXPENSES);
    const [assets, setAssets] = useLocalStorageState<T.Asset[]>('assets', C.MOCK_ASSETS);
    const [hrParameters, setHrParameters] = useLocalStorageState<T.HrParameters>('hrParameters', C.DEFAULT_TURKISH_PAYROLL_PARAMS_2025);
    const [salesReturns, setSalesReturns] = useLocalStorageState<T.SalesReturn[]>('salesReturns', C.MOCK_SALES_RETURNS);
    const [quotations, setQuotations] = useLocalStorageState<T.Quotation[]>('quotations', C.MOCK_QUOTATIONS);
    const [leads, setLeads] = useLocalStorageState<T.Lead[]>('leads', C.MOCK_LEADS);
    const [commissionRecords, setCommissionRecords] = useLocalStorageState<T.CommissionRecord[]>('commissionRecords', C.MOCK_COMMISSION_RECORDS);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    const stateSetters: Record<string, (value: any) => void> = {
        customers: setCustomers,
        contacts: setContacts,
        deals: setDeals,
        activityLogs: setActivityLogs,
        commissionRecords: setCommissionRecords,
        salesOrders: setSalesOrders,
        projects: setProjects,
        tasks: setTasks,
        // Add other setters here as needed by the ApiService
    };
    
    const api = useMemo(() => {
        const fullState = {
            customers, contacts, deals, employees, currentUser, taskTemplates, roles
            // Add other state slices here as needed by the ApiService
        };
        const setState = (key: string, value: any) => {
            if(stateSetters[key]) {
                if (typeof value === 'function') {
                    // @ts-ignore
                    stateSetters[key](prev => value(prev));
                } else {
                    stateSetters[key](value);
                }
            } else {
                console.warn(`No setter found for state key: ${key}`);
            }
        };
        return new ApiService(fullState, setState);
    }, [customers, contacts, deals, employees, currentUser, taskTemplates, roles]);
    
    const dummy = (...args: any[]) => console.warn('Function not implemented', ...args);
    const dummyWithReturn = (...args: any[]) => { console.warn('Function not implemented', ...args); return undefined as any; };

    const value: T.AppContextType = {
        // State
        customers: useMemo(() => customers.map(c => ({...c, assignedToName: employees.find(e => e.id === c.assignedToId)?.name || 'Atanmamış'})), [customers, employees]),
        contacts, communicationLogs, savedViews, deals, projects, tasks, notifications, invoices, bills, products, suppliers, purchaseOrders, employees, leaveRequests, performanceReviews, jobOpenings, candidates, onboardingTemplates, onboardingWorkflows, payrollRuns, payslips, bankAccounts, transactions, tickets, documents, comments, salesActivities, activityLogs, customFieldDefinitions, dashboardLayout, companyInfo, brandingSettings, securitySettings, roles, rolesPermissions, taxRates, systemLists, emailTemplates, priceLists, priceListItems, automations, automationLogs, taskTemplates, scheduledTasks, counters, cartItems, warehouses, stockMovements, inventoryTransfers, inventoryAdjustments, salesOrders, shipments, stockItems, pickLists, boms, workOrders, accounts, journalEntries, recurringJournalEntries, budgets, costCenters, accountingLockDate, currentUser, expenses, assets, hrParameters, salesReturns, quotations, leads, commissionRecords,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        api,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),

        // Methods - many of these were missing and are now implemented to satisfy the type
        addCustomer: originalAddCustomer,
        updateCustomer: originalUpdateCustomer,
        updateCustomerStatus: originalUpdateCustomerStatus,
        deleteCustomer: originalDeleteCustomer,
        deleteMultipleCustomers: originalDeleteMultipleCustomers,
        importCustomers: originalImportCustomers,
        bulkUpdateCustomerStatus: (ids, status) => setCustomers(prev => prev.map(c => ids.includes(c.id) ? {...c, status} : c)),
        assignCustomersToEmployee: (ids, employeeId) => setCustomers(prev => prev.map(c => ids.includes(c.id) ? {...c, assignedToId: employeeId} : c)),
        addTagsToCustomers: (ids, tags) => setCustomers(prev => prev.map(c => ids.includes(c.id) ? {...c, tags: [...new Set([...c.tags, ...tags])]} : c)),
        addContact: (data) => { const newContact = {...data, id: Date.now()}; setContacts(p => [newContact, ...p]); return newContact; },
        updateContact: (data) => setContacts(p => p.map(c => c.id === data.id ? data : c)),
        deleteContact: (id) => setContacts(p => p.filter(c => c.id !== id)),
        addCommunicationLog: (customerId, type, content) => {
            const newLog: T.CommunicationLog = { id: Date.now(), customerId, type, content, timestamp: new Date().toISOString(), userId: currentUser.id, userName: currentUser.name };
            setCommunicationLogs(p => [newLog, ...p]);
        },
        updateCommunicationLog: (log) => setCommunicationLogs(p => p.map(l => l.id === log.id ? log : l)),
        deleteCommunicationLog: (id) => setCommunicationLogs(p => p.filter(l => l.id !== id)),
        addSavedView: (name, filters, sortConfig) => { const newView = {id: Date.now(), name, filters, sortConfig}; setSavedViews(p => [...p, newView]); },
        deleteSavedView: (id) => setSavedViews(p => p.filter(v => v.id !== id)),
        loadSavedView: (id) => savedViews.find(v => v.id === id),
        hasPermission: (permission) => {
            if (currentUser.role === 'admin') return true;
            return rolesPermissions[currentUser.role]?.includes(permission) ?? false;
        },
        setCurrentUser,
        isManager: (employeeId: number) => employees.some(e => e.managerId === employeeId),

        // Cart
        addToCart: (product, quantity) => {
            setCartItems(prev => {
                const existing = prev.find(i => i.productId === product.id);
                if (existing) {
                    return prev.map(i => i.productId === product.id ? {...i, quantity: i.quantity + quantity} : i);
                }
                return [...prev, { productId: product.id, productName: product.name, quantity, price: product.price, sku: product.sku }];
            });
        },
        removeFromCart: (productId) => setCartItems(p => p.filter(i => i.productId !== productId)),
        updateCartQuantity: (productId, quantity) => setCartItems(p => p.map(i => i.productId === productId ? {...i, quantity: Math.max(0, quantity)} : i).filter(i => i.quantity > 0)),
        clearCart: () => setCartItems([]),
        createSalesOrderFromCart: dummy,

        // Simple CRUD stubs for remaining functions
        addDeal: dummyWithReturn,
        updateDeal: dummy,
        updateDealStage: dummy,
        updateDealWinLossReason: dummy,
        deleteDeal: dummy,
        addProject: dummy,
        updateProject: dummy,
        deleteProject: dummy,
        addTask: dummyWithReturn,
        updateTask: dummy,
        updateRecurringTask: dummy,
        deleteTask: dummy,
        updateTaskStatus: dummy,
        addSubtask: dummy,
        addTaskDependency: dummy,
        removeTaskDependency: dummy,
        deleteMultipleTasks: dummy,
        logTimeOnTask: dummy,
        toggleTaskStar: dummy,
        createTasksFromTemplate: dummy,
        addAttachmentToTask: dummy,
        deleteAttachmentFromTask: dummy,
        addInvoice: (invoiceData) => { const newInvoice = { ...invoiceData, id: Date.now(), invoiceNumber: `FAT-${Date.now()}`, customerName: customers.find(c => c.id === invoiceData.customerId)?.name || ''}; setInvoices(p => [newInvoice, ...p]); return newInvoice; },
        updateInvoice: (invoice) => setInvoices(p => p.map(i => i.id === invoice.id ? invoice : i)),
        bulkUpdateInvoiceStatus: (ids, status) => setInvoices(p => p.map(i => ids.includes(i.id) ? {...i, status} : i)),
        deleteInvoice: (id) => setInvoices(p => p.filter(i => i.id !== id)),
        addBill: dummyWithReturn,
        updateBill: dummy,
        bulkUpdateBillStatus: (ids, status) => setBills(p => p.map(b => ids.includes(b.id) ? {...b, status} : b)),
        addSupplier: (data) => { const newSupplier = {...data, id: Date.now(), avatar: `https://i.pravatar.cc/150?u=s${Date.now()}`}; setSuppliers(p => [newSupplier, ...p]); },
        updateSupplier: (supplier) => setSuppliers(p => p.map(s => s.id === supplier.id ? supplier : s)),
        deleteSupplier: (id) => setSuppliers(p => p.filter(s => s.id !== id)),
        deletePurchaseOrder: dummy,
        addEmployee: (data) => { const newEmployee = {...data, id: Date.now(), avatar: `https://i.pravatar.cc/150?u=e${Date.now()}`, employeeId: `EMP${Date.now()}`}; setEmployees(p => [newEmployee, ...p]); },
        updateEmployee: (employee) => setEmployees(p => p.map(e => e.id === employee.id ? employee : e)),
        deleteEmployee: (id) => setEmployees(p => p.filter(e => e.id !== id)),
        addLeaveRequest: (data) => { const newReq = {...data, id: Date.now(), employeeName: employees.find(e => e.id === data.employeeId)?.name || '', status: T.LeaveStatus.Pending}; setLeaveRequests(p => [newReq, ...p]);},
        updateLeaveRequestStatus: (id, status) => setLeaveRequests(p => p.map(lr => lr.id === id ? {...lr, status} : lr)),
        addBankAccount: (data) => { const newAcc = {...data, id: Date.now()}; setBankAccounts(p => [newAcc, ...p]); },
        updateBankAccount: (acc) => setBankAccounts(p => p.map(a => a.id === acc.id ? acc : a)),
        deleteBankAccount: (id) => setBankAccounts(p => p.filter(a => a.id !== id)),
        addTransaction: (data) => { const newTrans = {...data, id: Date.now()}; setTransactions(p => [newTrans, ...p]);},
        updateTransaction: (trans) => setTransactions(p => p.map(t => t.id === trans.id ? trans : t)),
        deleteTransaction: (id) => setTransactions(p => p.filter(t => t.id !== id)),
        addTicket: dummy, updateTicket: dummy, deleteTicket: dummy, addDocument: dummy, renameDocument: dummy, deleteDocument: dummy, deleteMultipleDocuments: dummy, addFolder: dummy, moveDocuments: dummy, toggleDocumentStar: dummy, shareDocument: dummy, addComment: dummy, updateComment: dummy, deleteComment: dummy, addSalesActivity: dummy, addPerformanceReview: dummy, updatePerformanceReview: dummy, addJobOpening: dummy, updateJobOpening: dummy, addCandidate: dummy, updateCandidate: dummy, updateCandidateStage: dummy, addOnboardingTemplate: dummy, updateOnboardingTemplate: dummy, startOnboardingWorkflow: dummy, updateOnboardingWorkflowStatus: dummy, addPayrollRun: dummyWithReturn, updatePayrollRunStatus: dummy, postPayrollRunToJournal: dummy, exportPayrollRunToAphbXml: dummy, updatePayslip: dummy, calculateTerminationPayments: dummyWithReturn, calculateAnnualLeaveBalance: dummyWithReturn, calculatePayrollCost: dummyWithReturn, updateCompanyInfo: dummy, updateBrandingSettings: dummy, updateSecuritySettings: dummy, updateCounters: dummy, addRole: dummy, updateRolePermissions: dummy, deleteRole: dummy, addCustomField: dummy, updateCustomField: dummy, deleteCustomField: dummy, markNotificationAsRead: dummy, clearAllNotifications: dummy, logActivity: dummy, updateAccountingLockDate: dummy, addStockMovement: dummy, addExpense: dummy, updateExpenseStatus: dummy, addAsset: dummy, updateAsset: dummy, updateHrParameters: dummy,
        addSalesReturn: dummyWithReturn, updateSalesReturn: dummy, deleteSalesReturn: dummy,
        addQuotation: (data) => { const newQuotation = {...data, id: Date.now(), quotationNumber: `TEK-${Date.now()}`, customerName: customers.find(c => c.id === data.customerId)?.name || ''}; setQuotations(p => [newQuotation, ...p]); return newQuotation; },
        updateQuotation: (q) => setQuotations(p => p.map(i => i.id === q.id ? q : i)),
        deleteQuotation: (id) => setQuotations(p => p.filter(i => i.id !== id)),
        convertQuotationToSalesOrder: dummyWithReturn,
        // FIX: Removed duplicate 'leads' property on line 237
        addLead: dummyWithReturn, convertLead: dummyWithReturn,
        addScheduledTask: dummy, updateScheduledTask: dummy, deleteScheduledTask: dummy, runScheduledTasksCheck: dummy,
        addTaskTemplate: dummy, updateTaskTemplate: dummy, deleteTaskTemplate: dummy,
        addBom: dummy, updateBom: dummy, addWorkOrder: dummyWithReturn, updateWorkOrderStatus: dummy,
        getProductStockInfo: dummyWithReturn, getProductStockByWarehouse: dummyWithReturn,
        addSalesOrder: dummy, updateSalesOrder: dummy, deleteSalesOrder: dummy, updateSalesOrderStatus: dummy,
        convertOrderToInvoice: dummy, confirmPickList: dummy, addProduct: dummy, updateProduct: dummy, deleteProduct: dummy,
        addWarehouse: dummy, updateWarehouse: dummy, deleteWarehouse: dummy, addInventoryTransfer: dummy, addInventoryAdjustment: dummy,
        receivePurchaseOrderItems: dummy, addPurchaseOrder: dummy, updatePurchaseOrder: dummy, updatePurchaseOrderStatus: dummy,
        createBillFromPO: dummy, allocateStockToSalesOrder: dummy, createShipmentFromSalesOrder: dummy, createPickList: dummy,
        addAutomation: dummy, updateAutomation: dummy, deleteAutomation: dummy,
        updateSystemList: dummy, updateEmailTemplate: dummy, addPriceList: dummy, updatePriceList: dummy, deletePriceList: dummy,
        updatePriceListItems: dummy, addTaxRate: dummy, updateTaxRate: dummy, deleteTaxRate: dummy,
        addAccount: dummy, updateAccount: dummy,
        addJournalEntry: (entryData) => { const newEntry = {...entryData, id: Date.now(), entryNumber: `JE-${Date.now()}`}; setJournalEntries(p => [newEntry, ...p]); return newEntry; },
        updateJournalEntry: dummy, deleteJournalEntry: dummy, reverseJournalEntry: dummyWithReturn,
        addRecurringJournalEntry: dummy, updateRecurringJournalEntry: dummy, deleteRecurringJournalEntry: dummy,
        generateEntryFromRecurringTemplate: dummyWithReturn, addBudget: dummy, updateBudget: dummy, deleteBudget: dummy,
        addCostCenter: dummy, updateCostCenter: dummy, deleteCostCenter: dummy, setDashboardLayout: dummy,
        addWidgetToDashboard: dummy, removeWidgetFromDashboard: dummy,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): T.AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

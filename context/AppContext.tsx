import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useCustomers } from '../hooks/useCustomers';
import * as T from '../types';
import * as C from '../constants';

const AppContext = createContext<T.AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const customerHookData = useCustomers(C.MOCK_CUSTOMERS);
    const [contacts, setContacts] = useLocalStorageState<T.Contact[]>('contacts', C.MOCK_CONTACTS);
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
    const [communicationLogs, setCommunicationLogs] = useLocalStorageState<T.CommunicationLog[]>('communicationLogs', C.MOCK_COMMUNICATION_LOGS);
    const [activityLogs, setActivityLogs] = useLocalStorageState<T.ActivityLog[]>('activityLogs', []);
    const [savedViews, setSavedViews] = useLocalStorageState<T.SavedView[]>('savedViews', C.MOCK_SAVED_VIEWS);
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


    const logActivity = useCallback((actionType: T.ActionType, details: string, entityType?: T.EntityType, entityId?: number) => {
        const newLog: T.ActivityLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            actionType,
            details,
            entityType,
            entityId,
        };
        setActivityLogs(prev => [newLog, ...prev].slice(0, 200)); // Keep last 200 logs
    }, [setActivityLogs, currentUser]);

    const addSavedView = useCallback((name: string, filters: T.SavedView['filters'], sortConfig: T.SortConfig) => {
        const newView: T.SavedView = {
            id: Date.now(),
            name,
            filters,
            sortConfig,
        };
        setSavedViews(prev => [...prev, newView]);
    }, [setSavedViews]);

    const deleteSavedView = useCallback((id: number) => {
        setSavedViews(prev => prev.filter(v => v.id !== id));
    }, [setSavedViews]);

    const loadSavedView = useCallback((id: number): T.SavedView | undefined => {
        return savedViews.find(v => v.id === id);
    }, [savedViews]);

    const addCommunicationLog = useCallback((customerId: number, type: T.CommunicationLogType, content: string) => {
        const newLog: T.CommunicationLog = {
            id: Date.now(),
            customerId,
            type,
            content,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
        };
        setCommunicationLogs(prev => [newLog, ...prev]);
        logActivity(T.ActionType.COMMENT_ADDED, `Communication logged for customer #${customerId}.`, 'customer', customerId);
    }, [setCommunicationLogs, currentUser, logActivity]);

    const addContact = useCallback((contactData: Omit<T.Contact, 'id'>) => {
        const newContact: T.Contact = {
            id: Date.now(),
            ...contactData,
        };
        setContacts(prev => [newContact, ...prev]);
        logActivity(T.ActionType.CREATED, `Contact '${newContact.name}' created for customer #${contactData.customerId}.`, 'customer', contactData.customerId);
    }, [setContacts, logActivity]);

    const updateContact = useCallback((contactToUpdate: T.Contact) => {
        setContacts(prev => prev.map(c => c.id === contactToUpdate.id ? contactToUpdate : c));
        logActivity(T.ActionType.UPDATED, `Contact '${contactToUpdate.name}' updated.`, 'customer', contactToUpdate.customerId);
    }, [setContacts, logActivity]);

    const deleteContact = useCallback((contactId: number) => {
        const contactToDelete = contacts.find(c => c.id === contactId);
        if (contactToDelete) {
            setContacts(prev => prev.filter(c => c.id !== contactId));
            logActivity(T.ActionType.DELETED, `Contact '${contactToDelete.name}' deleted.`, 'customer', contactToDelete.customerId);
        }
    }, [setContacts, contacts, logActivity]);
    
    // START: Dummy implementations for all functions from AppContextType.
    // In a real app, these would contain business logic.
    
    // SalesReturns
    const addSalesReturn = useCallback((returnData: Omit<T.SalesReturn, 'id' | 'returnNumber' | 'customerName'>) => {
        const customer = customerHookData.customers.find(c => c.id === returnData.customerId);
        if (!customer) return undefined;
        const newReturn: T.SalesReturn = {
            id: Date.now(),
            returnNumber: `RT-${Date.now()}`,
            customerName: customer.name,
            ...returnData
        };
        setSalesReturns(prev => [...prev, newReturn]);
        logActivity(T.ActionType.CREATED, `Sales return ${newReturn.returnNumber} created.`, 'sales_return', newReturn.id);
        return newReturn;
    }, [setSalesReturns, customerHookData.customers, logActivity]);
    
    const updateSalesReturn = useCallback((salesReturn: T.SalesReturn) => {
        setSalesReturns(prev => prev.map(sr => sr.id === salesReturn.id ? salesReturn : sr));
        logActivity(T.ActionType.UPDATED, `Sales return ${salesReturn.returnNumber} updated.`, 'sales_return', salesReturn.id);
    }, [setSalesReturns, logActivity]);

    const deleteSalesReturn = useCallback((id: number) => {
        setSalesReturns(prev => prev.filter(sr => sr.id !== id));
        logActivity(T.ActionType.DELETED, `Sales return #${id} deleted.`, 'sales_return', id);
    }, [setSalesReturns, logActivity]);


    const isManager = useCallback((employeeId: number): boolean => {
        return employees.some(e => e.managerId === employeeId);
    }, [employees]);

    const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const addToCart = (product: T.Product, quantity: number) => {/* not implemented */};
    const removeFromCart = (productId: number) => {/* not implemented */};
    const updateCartQuantity = (productId: number, quantity: number) => {/* not implemented */};
    const clearCart = () => {/* not implemented */};
    const createSalesOrderFromCart = (customerId: number) => {/* not implemented */};
    const addScheduledTask = (schedule: Omit<T.ScheduledTask, "id">) => {/* not implemented */};
    const updateScheduledTask = (schedule: T.ScheduledTask) => {/* not implemented */};
    const deleteScheduledTask = (scheduleId: number) => {/* not implemented */};
    const runScheduledTasksCheck = () => {/* not implemented */};
    const addTaskTemplate = (templateData: Omit<T.TaskTemplate, "id">) => {/* not implemented */};
    const updateTaskTemplate = (template: T.TaskTemplate) => {/* not implemented */};
    const deleteTaskTemplate = (templateId: number) => {/* not implemented */};
    const addBom = (bomData: Omit<T.BillOfMaterials, "id" | "productName">) => {/* not implemented */};
    const updateBom = (bom: T.BillOfMaterials) => {/* not implemented */};
    const addWorkOrder = (woData: Omit<T.WorkOrder, "id" | "workOrderNumber" | "productName">) => { return undefined; };
    const updateWorkOrderStatus = (workOrderId: number, newStatus: T.WorkOrderStatus) => {/* not implemented */};
    const getProductStockInfo = (productId: number) => { return { physical: 0, committed: 0, available: 0 }; };
    const getProductStockByWarehouse = (productId: number, warehouseId: number) => { return { physical: 0, committed: 0, available: 0 }; };
    const addSalesOrder = (orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName">) => {/* not implemented */};
    const updateSalesOrder = (order: T.SalesOrder) => {/* not implemented */};
    const deleteSalesOrder = (orderId: number) => {/* not implemented */};
    const updateSalesOrderStatus = (orderId: number, newStatus: T.SalesOrderStatus) => {/* not implemented */};
    const convertOrderToInvoice = (orderId: number) => {/* not implemented */};
    const confirmPickList = (pickListId: number) => {/* not implemented */};
    const addProduct = (productData: Omit<T.Product, "id">, initialStock?: { warehouseId: number, quantity: number }) => {/* not implemented */};
    const updateProduct = (product: T.Product) => {/* not implemented */};
    const deleteProduct = (id: number) => {/* not implemented */};
    const addWarehouse = (warehouseData: Omit<T.Warehouse, "id">) => {/* not implemented */};
    const updateWarehouse = (warehouse: T.Warehouse) => {/* not implemented */};
    const deleteWarehouse = (id: number) => {/* not implemented */};
    const addInventoryTransfer = (transferData: Omit<T.InventoryTransfer, "id" | "transferNumber" | "status">) => {/* not implemented */};
    const addInventoryAdjustment = (adjustmentData: Omit<T.InventoryAdjustment, "id" | "adjustmentNumber" | "status">) => {/* not implemented */};
    const receivePurchaseOrderItems = (poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string, expiry: string })[] }[], warehouseId: number) => {/* not implemented */};
    const addPurchaseOrder = (poData: Omit<T.PurchaseOrder, "id" | "poNumber" | "supplierName">) => {/* not implemented */};
    const updatePurchaseOrder = (po: T.PurchaseOrder) => {/* not implemented */};
    const updatePurchaseOrderStatus = (poId: number, status: T.PurchaseOrderStatus) => {/* not implemented */};
    const createBillFromPO = (poId: number) => {/* not implemented */};
    const convertDealToSalesOrder = (deal: T.Deal) => {/* not implemented */};
    const allocateStockToSalesOrder = (soId: number, allocations: { [productId: string]: number[] }) => {/* not implemented */};
    const createShipmentFromSalesOrder = (soId: number, itemsToShip: T.ShipmentItem[]) => {/* not implemented */};
    const createPickList = (shipmentIds: number[]) => {/* not implemented */};
    const addAutomation = (auto: Omit<T.Automation, "id" | "lastRun">) => {/* not implemented */};
    const updateAutomation = (auto: T.Automation) => {/* not implemented */};
    const deleteAutomation = (autoId: number) => {/* not implemented */};
    const updateSystemList = (key: T.SystemListKey, items: T.SystemListItem[]) => {/* not implemented */};
    const updateEmailTemplate = (template: T.EmailTemplate) => {/* not implemented */};
    const addPriceList = (list: Omit<T.PriceList, "id">) => {/* not implemented */};
    const updatePriceList = (list: T.PriceList) => {/* not implemented */};
    const deletePriceList = (listId: number) => {/* not implemented */};
    const updatePriceListItems = (listId: number, items: T.PriceListItem[]) => {/* not implemented */};
    const addTaxRate = (rate: Omit<T.TaxRate, "id">) => {/* not implemented */};
    const updateTaxRate = (rate: T.TaxRate) => {/* not implemented */};
    const deleteTaxRate = (rateId: number) => {/* not implemented */};
    const addAccount = (account: Omit<T.Account, "id">) => {/* not implemented */};
    const updateAccount = (account: T.Account) => {/* not implemented */};
    const addJournalEntry = (entryData: Omit<T.JournalEntry, 'id' | 'entryNumber'>) => { return {} as T.JournalEntry; };
    const updateJournalEntry = (entry: T.JournalEntry) => {/* not implemented */};
    const deleteJournalEntry = (entryId: number) => {/* not implemented */};
    const reverseJournalEntry = (entryId: number) => { return undefined; };
    const addRecurringJournalEntry = (template: Omit<T.RecurringJournalEntry, 'id'>) => {/* not implemented */};
    const updateRecurringJournalEntry = (template: T.RecurringJournalEntry) => {/* not implemented */};
    const deleteRecurringJournalEntry = (templateId: number) => {/* not implemented */};
    const generateEntryFromRecurringTemplate = async (templateId: number) => { return undefined; };
    const addBudget = (budget: Omit<T.Budget, 'id'>) => {/* not implemented */};
    const updateBudget = (budget: T.Budget) => {/* not implemented */};
    const deleteBudget = (budgetId: number) => {/* not implemented */};
    const addCostCenter = (costCenter: Omit<T.CostCenter, 'id'>) => {/* not implemented */};
    const updateCostCenter = (costCenter: T.CostCenter) => {/* not implemented */};
    const deleteCostCenter = (costCenterId: number) => {/* not implemented */};
    const addWidgetToDashboard = (widgetId: string) => {/* not implemented */};
    const removeWidgetFromDashboard = (id: string) => {/* not implemented */};
    const hasPermission = (permission: T.Permission) => { return true; };
    const addDeal = (dealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'>) => {/* not implemented */};
    const updateDeal = (deal: T.Deal) => {/* not implemented */};
    const updateDealStage = (dealId: number, newStage: T.DealStage) => {/* not implemented */};
    const updateDealWinLossReason = (dealId: number, stage: T.DealStage.Won | T.DealStage.Lost, reason: string) => {/* not implemented */};
    const deleteDeal = (id: number) => {/* not implemented */};
    const addProject = (projectData: Omit<T.Project, 'id' | 'client'>) => {/* not implemented */};
    const updateProject = (project: T.Project) => {/* not implemented */};
    const deleteProject = (id: number) => {/* not implemented */};
    const addTask = (taskData: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles?: string[]) => { return undefined; };
    const updateTask = (task: T.Task, options?: { silent?: boolean }) => {/* not implemented */};
    const updateRecurringTask = (task: T.Task, updateData: Partial<T.Task>, scope: 'this' | 'all', options?: { silent?: boolean }) => {/* not implemented */};
    const deleteTask = (id: number) => {/* not implemented */};
    const updateTaskStatus = (taskId: number, newStatus: T.TaskStatus) => {/* not implemented */};
    const addSubtask = (parentId: number, title: string) => {/* not implemented */};
    const addTaskDependency = (taskId: number, dependsOnId: number) => {/* not implemented */};
    const removeTaskDependency = (taskId: number, dependsOnId: number) => {/* not implemented */};
    const deleteMultipleTasks = (taskIds: number[]) => {/* not implemented */};
    const logTimeOnTask = (taskId: number, minutes: number) => {/* not implemented */};
    const toggleTaskStar = (taskId: number) => {/* not implemented */};
    const createTasksFromTemplate = (templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => {/* not implemented */};
    const addAttachmentToTask = (taskId: number, attachment: T.Attachment) => {/* not implemented */};
    const deleteAttachmentFromTask = (taskId: number, attachmentId: number) => {/* not implemented */};
    const addInvoice = (invoiceData: Omit<T.Invoice, 'id' | 'invoiceNumber' | 'customerName'>) => { return {} as T.Invoice; };
    const updateInvoice = (invoice: T.Invoice) => {/* not implemented */};
    const bulkUpdateInvoiceStatus = (invoiceIds: number[], newStatus: T.InvoiceStatus) => {/* not implemented */};
    const deleteInvoice = (id: number) => {/* not implemented */};
    const addBill = (bill: Omit<T.Bill, 'id'>) => { return undefined; };
    const updateBill = (bill: T.Bill) => {/* not implemented */};
    const bulkUpdateBillStatus = (billIds: number[], newStatus: T.BillStatus) => {/* not implemented */};
    const addSupplier = (supplierData: Omit<T.Supplier, "id" | "avatar">) => {/* not implemented */};
    const updateSupplier = (supplier: T.Supplier) => {/* not implemented */};
    const deleteSupplier = (id: number) => {/* not implemented */};
    const deletePurchaseOrder = (id: number) => {/* not implemented */};
    const addEmployee = (employeeData: Omit<T.Employee, "id" | "avatar" | "employeeId">) => {/* not implemented */};
    const updateEmployee = (employee: T.Employee) => {/* not implemented */};
    const deleteEmployee = (id: number) => {/* not implemented */};
    const addLeaveRequest = (requestData: Omit<T.LeaveRequest, "id" | "employeeName" | "status">) => {/* not implemented */};
    const updateLeaveRequestStatus = (requestId: number, newStatus: T.LeaveStatus) => {/* not implemented */};
    const addBankAccount = (accountData: Omit<T.BankAccount, "id">) => {/* not implemented */};
    const updateBankAccount = (account: T.BankAccount) => {/* not implemented */};
    const deleteBankAccount = (id: number) => {/* not implemented */};
    const addTransaction = (transactionData: Omit<T.Transaction, "id">) => {/* not implemented */};
    const updateTransaction = (transaction: T.Transaction) => {/* not implemented */};
    const deleteTransaction = (id: number) => {/* not implemented */};
    const addTicket = (ticketData: Omit<T.SupportTicket, "id" | "ticketNumber" | "customerName" | "assignedToName" | "createdDate">) => {/* not implemented */};
    const updateTicket = (ticket: T.SupportTicket) => {/* not implemented */};
    const deleteTicket = (id: number) => {/* not implemented */};
    const addDocument = (docData: Omit<T.Document, "id" | "uploadedByName">) => {/* not implemented */};
    const renameDocument = (docId: number, newName: string) => {/* not implemented */};
    const deleteDocument = (id: number) => {/* not implemented */};
    const deleteMultipleDocuments = (ids: number[]) => {/* not implemented */};
    const addFolder = (folderName: string, parentId: number | null) => {/* not implemented */};
    const moveDocuments = (docIds: number[], targetFolderId: number | null) => {/* not implemented */};
    const toggleDocumentStar = (docId: number) => {/* not implemented */};
    const shareDocument = (docId: number, shares: T.DocumentShare[]) => {/* not implemented */};
    const addComment = (text: string, entityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order', entityId: number) => {/* not implemented */};
    const updateComment = (comment: T.Comment) => {/* not implemented */};
    const deleteComment = (commentId: number) => {/* not implemented */};
    const updateCommunicationLog = (log: T.CommunicationLog) => {/* not implemented */};
    const deleteCommunicationLog = (logId: number) => {/* not implemented */};
    const addSalesActivity = (activityData: Omit<T.SalesActivity, "id" | "userName" | "userAvatar" | "timestamp">) => {/* not implemented */};
    const addPerformanceReview = (reviewData: Omit<T.PerformanceReview, "id" | "employeeName" | "reviewerName">) => {/* not implemented */};
    const updatePerformanceReview = (review: T.PerformanceReview) => {/* not implemented */};
    const addJobOpening = (jobData: Omit<T.JobOpening, "id">) => {/* not implemented */};
    const updateJobOpening = (job: T.JobOpening) => {/* not implemented */};
    const addCandidate = (candidateData: Omit<T.Candidate, "id">) => {/* not implemented */};
    const updateCandidate = (candidate: T.Candidate) => {/* not implemented */};
    const updateCandidateStage = (candidateId: number, newStage: T.CandidateStage) => {/* not implemented */};
    const addOnboardingTemplate = (templateData: Omit<T.OnboardingTemplate, "id">) => {/* not implemented */};
    const updateOnboardingTemplate = (template: T.OnboardingTemplate) => {/* not implemented */};
    const startOnboardingWorkflow = (data: { employeeId: number, templateId: number }) => {/* not implemented */};
    const updateOnboardingWorkflowStatus = (workflowId: number, itemIndex: number, isCompleted: boolean) => {/* not implemented */};
    const addPayrollRun = (payPeriod: string) => { return undefined; };
    const updatePayrollRunStatus = (runId: number, status: T.PayrollRun['status'], journalEntryId?: number) => {/* not implemented */};
    const postPayrollRunToJournal = (runId: number) => {/* not implemented */};
    const exportPayrollRunToAphbXml = (runId: number) => {/* not implemented */};
    const updatePayslip = (payslip: Partial<T.Payslip> & { id: number; }) => {/* not implemented */};
    const calculateTerminationPayments = (employeeId: number, terminationDate: string, additionalGrossPay: number, additionalBonuses: number, usedAnnualLeave: number) => { return null; };
    const calculateAnnualLeaveBalance = (employeeId: number) => { return { entitled: 0, used: 0, balance: 0 }; };
    const calculatePayrollCost = (grossSalary: number) => { return {} as T.PayrollSimulationResult; };
    const updateCompanyInfo = (info: T.CompanyInfo) => {/* not implemented */};
    const updateBrandingSettings = (settings: T.BrandingSettings) => {/* not implemented */};
    const updateSecuritySettings = (settings: T.SecuritySettings) => {/* not implemented */};
    const updateCounters = (settings: T.CountersSettings) => {/* not implemented */};
    const addRole = (roleData: Omit<T.Role, "id" | "isSystemRole">, cloneFromRoleId?: string) => {/* not implemented */};
    const updateRolePermissions = (roleId: string, permissions: T.Permission[]) => {/* not implemented */};
    const deleteRole = (roleId: string) => {/* not implemented */};
    const addCustomField = (fieldData: Omit<T.CustomFieldDefinition, "id">) => {/* not implemented */};
    const updateCustomField = (field: T.CustomFieldDefinition) => {/* not implemented */};
    const deleteCustomField = (id: number) => {/* not implemented */};
    const markNotificationAsRead = (id: number) => {/* not implemented */};
    const clearAllNotifications = () => {/* not implemented */};
    const createProjectFromDeal = (deal: T.Deal) => {/* not implemented */};
    const createTasksFromDeal = (deal: T.Deal) => {/* not implemented */};
    const updateAccountingLockDate = (date: string | null) => {/* not implemented */};
    const addStockMovement = (productId: number, warehouseId: number, type: T.StockMovementType, quantityChange: number, notes?: string, relatedDocumentId?: number) => {/* not implemented */};
    const addExpense = (expenseData: Omit<T.Expense, 'id' | 'employeeName' | 'status'>) => {/* not implemented */};
    const updateExpenseStatus = (expenseId: number, status: T.ExpenseStatus) => {/* not implemented */};
    const addAsset = (assetData: Omit<T.Asset, 'id'>) => {/* not implemented */};
    const updateAsset = (asset: T.Asset) => {/* not implemented */};
    const updateHrParameters = (params: T.HrParameters) => {/* not implemented */};

    // END: Dummy implementations

    const value: T.AppContextType = {
        ...customerHookData,
        contacts,
        deals,
        projects,
        tasks,
        notifications,
        invoices,
        bills,
        products,
        suppliers,
        purchaseOrders,
        employees,
        leaveRequests,
        performanceReviews,
        jobOpenings,
        candidates,
        onboardingTemplates,
        onboardingWorkflows,
        payrollRuns,
        payslips,
        bankAccounts,
        transactions,
        tickets,
        documents,
        comments,
        salesActivities,
        communicationLogs,
        activityLogs,
        savedViews,
        customFieldDefinitions,
        dashboardLayout, setDashboardLayout,
        companyInfo,
        brandingSettings,
        securitySettings,
        roles,
        rolesPermissions,
        taxRates,
        systemLists,
        emailTemplates,
        priceLists,
        priceListItems,
        automations,
        automationLogs,
        taskTemplates,
        scheduledTasks,
        counters,
        cartItems,
        warehouses,
        stockMovements,
        inventoryTransfers,
        inventoryAdjustments,
        salesOrders,
        shipments,
        stockItems,
        pickLists,
        boms,
        workOrders,
        accounts,
        journalEntries,
        recurringJournalEntries,
        budgets,
        costCenters,
        accountingLockDate,
        currentUser, setCurrentUser,
        expenses,
        assets,
        hrParameters,
        salesReturns, addSalesReturn, updateSalesReturn, deleteSalesReturn,
        isManager,
        itemCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createSalesOrderFromCart,
        addScheduledTask,
        updateScheduledTask,
        deleteScheduledTask,
        runScheduledTasksCheck,
        addTaskTemplate,
        updateTaskTemplate,
        deleteTaskTemplate,
        addBom,
        updateBom,
        addWorkOrder,
        updateWorkOrderStatus,
        getProductStockInfo,
        getProductStockByWarehouse,
        addSalesOrder,
        updateSalesOrder,
        deleteSalesOrder,
        updateSalesOrderStatus,
        convertOrderToInvoice,
        confirmPickList,
        addProduct,
        updateProduct,
        deleteProduct,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        addInventoryTransfer,
        addInventoryAdjustment,
        receivePurchaseOrderItems,
        addPurchaseOrder,
        updatePurchaseOrder,
        updatePurchaseOrderStatus,
        createBillFromPO,
        convertDealToSalesOrder,
        allocateStockToSalesOrder,
        createShipmentFromSalesOrder,
        createPickList,
        addAutomation,
        updateAutomation,
        deleteAutomation,
        updateSystemList,
        updateEmailTemplate,
        addPriceList,
        updatePriceList,
        deletePriceList,
        updatePriceListItems,
        addTaxRate,
        updateTaxRate,
        deleteTaxRate,
        addAccount,
        updateAccount,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        reverseJournalEntry,
        addRecurringJournalEntry,
        updateRecurringJournalEntry,
        deleteRecurringJournalEntry,
        generateEntryFromRecurringTemplate,
        addBudget,
        updateBudget,
        deleteBudget,
        addCostCenter,
        updateCostCenter,
        deleteCostCenter,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        hasPermission,
        addSavedView,
        deleteSavedView,
        loadSavedView,
        addContact,
        updateContact,
        deleteContact,
        addDeal,
        updateDeal,
        updateDealStage,
        updateDealWinLossReason,
        deleteDeal,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        updateRecurringTask,
        deleteTask,
        updateTaskStatus,
        addSubtask,
        addTaskDependency,
        removeTaskDependency,
        deleteMultipleTasks,
        logTimeOnTask,
        toggleTaskStar,
        createTasksFromTemplate,
        addAttachmentToTask,
        deleteAttachmentFromTask,
        addInvoice,
        updateInvoice,
        bulkUpdateInvoiceStatus,
        deleteInvoice,
        addBill,
        updateBill,
        bulkUpdateBillStatus,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        deletePurchaseOrder,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addLeaveRequest,
        updateLeaveRequestStatus,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addTicket,
        updateTicket,
        deleteTicket,
        addDocument,
        renameDocument,
        deleteDocument,
        deleteMultipleDocuments,
        addFolder,
        moveDocuments,
        toggleDocumentStar,
        shareDocument,
        addComment,
        updateComment,
        deleteComment,
        addCommunicationLog,
        updateCommunicationLog,
        deleteCommunicationLog,
        addSalesActivity,
        addPerformanceReview,
        updatePerformanceReview,
        addJobOpening,
        updateJobOpening,
        addCandidate,
        updateCandidate,
        updateCandidateStage,
        addOnboardingTemplate,
        updateOnboardingTemplate,
        startOnboardingWorkflow,
        updateOnboardingWorkflowStatus,
        addPayrollRun,
        updatePayrollRunStatus,
        postPayrollRunToJournal,
        exportPayrollRunToAphbXml,
        updatePayslip,
        calculateTerminationPayments,
        calculateAnnualLeaveBalance,
        calculatePayrollCost,
        updateCompanyInfo,
        updateBrandingSettings,
        updateSecuritySettings,
        updateCounters,
        addRole,
        updateRolePermissions,
        deleteRole,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        markNotificationAsRead,
        clearAllNotifications,
        createProjectFromDeal,
        createTasksFromDeal,
        logActivity,
        updateAccountingLockDate,
        addStockMovement,
        addExpense,
        updateExpenseStatus,
        addAsset,
        updateAsset,
        updateHrParameters,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): T.AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within a AppProvider');
    }
    return context;
};
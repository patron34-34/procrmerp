import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { Customer, Deal, Project, Task, Notification, Invoice, Product, Supplier, PurchaseOrder, Employee, LeaveRequest, BankAccount, Transaction, TransactionType, SupportTicket, Permission, ActivityLog, ActionType, EntityType, Document, DashboardWidget, Comment, CommunicationLog, CommunicationLogType, SavedView, SortConfig, Contact, DealLineItem, CustomFieldDefinition, SalesActivity, SalesActivityType, DocumentShare, DocumentType, SharePermission, PurchaseOrderItem, PerformanceReview, JobOpening, Candidate, OnboardingTemplate, OnboardingWorkflow, OnboardingWorkflowStatus, OnboardingType, CompanyInfo, CustomFieldType, BrandingSettings, SecuritySettings, Role, Account, JournalEntry, JournalEntryItem, JournalEntryType, JournalEntryStatus, AccountType, RecurringJournalEntry, RecurringFrequency, Budget, CostCenter, Bill, BillStatus, TaxRate, TransactionCategory, SystemLists, SystemListKey, SystemListItem, EmailTemplate, PriceList, PriceListItem, InvoiceStatus, DealStage, PurchaseOrderStatus, LeaveType, LeaveStatus, TaskStatus, TicketStatus, TicketPriority, TaskPriority, CandidateStage, Automation, AutomationLog, AutomationTriggerType, AutomationActionType, Warehouse, StockMovement, InventoryTransfer, InventoryAdjustment, StockMovementType, AdjustmentReason, InventoryAdjustmentStatus, InventoryTransferStatus, SalesOrder, SalesOrderStatus, Shipment, ShipmentStatus, WidgetConfig, StockItem, StockItemStatus, SalesOrderItem, PickList, PickListItem, InvoiceLineItem, ShipmentItem, PayrollRun, Payslip, PayslipEarning, PayslipDeduction, SeveranceCalculationResult, PayrollSimulationResult, TaskTemplate, ScheduledTask, Attachment, Address } from '../types';
import { AVAILABLE_WIDGETS, MOCK_CUSTOMERS, MOCK_DEALS, MOCK_PROJECTS, MOCK_TASKS, MOCK_NOTIFICATIONS, MOCK_INVOICES, MOCK_PRODUCTS, MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_EMPLOYEES, MOCK_LEAVE_REQUESTS, MOCK_BANK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_TICKETS, INITIAL_ROLES_PERMISSIONS, MOCK_DOCUMENTS, INITIAL_DASHBOARD_LAYOUT, MOCK_COMMENTS, MOCK_COMMUNICATION_LOGS, MOCK_SAVED_VIEWS, MOCK_CONTACTS, MOCK_CUSTOM_FIELD_DEFINITIONS, MOCK_SALES_ACTIVITIES, MOCK_PERFORMANCE_REVIEWS, MOCK_JOB_OPENINGS, MOCK_CANDIDATES, MOCK_ONBOARDING_TEMPLATES, MOCK_ONBOARDING_WORKFLOWS, MOCK_COMPANY_INFO, MOCK_BRANDING_SETTINGS, MOCK_SECURITY_SETTINGS, INITIAL_ROLES, MOCK_ACCOUNTS, MOCK_JOURNAL_ENTRIES, MOCK_RECURRING_JOURNAL_ENTRIES, MOCK_BUDGETS, MOCK_COST_CENTERS, MOCK_BILLS, MOCK_TAX_RATES, INITIAL_SYSTEM_LISTS, INITIAL_EMAIL_TEMPLATES, MOCK_PRICE_LISTS, MOCK_PRICE_LIST_ITEMS, MOCK_AUTOMATIONS, MOCK_AUTOMATION_LOGS, MOCK_WAREHOUSES, MOCK_STOCK_MOVEMENTS, MOCK_INVENTORY_TRANSFERS, MOCK_INVENTORY_ADJUSTMENTS, MOCK_SALES_ORDERS, MOCK_SHIPMENTS, MOCK_STOCK_ITEMS, MOCK_PICK_LISTS, MOCK_PAYROLL_RUNS, MOCK_PAYSLIPS, TURKISH_PAYROLL_PARAMS_2025, MOCK_TASK_TEMPLATES, MOCK_SCHEDULED_TASKS } from '../constants';
import { useNotification } from './NotificationContext';
import { ToastType } from '../types';

interface AppContextType {
    // ... (All existing types)
    customers: Customer[];
    contacts: Contact[];
    deals: Deal[];
    projects: Project[];
    tasks: Task[];
    notifications: Notification[];
    invoices: Invoice[];
    bills: Bill[];
    products: Product[];
    suppliers: Supplier[];
    purchaseOrders: PurchaseOrder[];
    employees: Employee[];
    leaveRequests: LeaveRequest[];
    performanceReviews: PerformanceReview[];
    jobOpenings: JobOpening[];
    candidates: Candidate[];
    onboardingTemplates: OnboardingTemplate[];
    onboardingWorkflows: OnboardingWorkflow[];
    payrollRuns: PayrollRun[];
    payslips: Payslip[];
    bankAccounts: BankAccount[];
    transactions: Transaction[];
    tickets: SupportTicket[];
    documents: Document[];
    comments: Comment[];
    salesActivities: SalesActivity[];
    communicationLogs: CommunicationLog[];
    activityLogs: ActivityLog[];
    savedViews: SavedView[];
    customFieldDefinitions: CustomFieldDefinition[];
    dashboardLayout: DashboardWidget[];
    companyInfo: CompanyInfo;
    brandingSettings: BrandingSettings;
    securitySettings: SecuritySettings;
    roles: Role[];
    rolesPermissions: Record<string, Permission[]>;
    taxRates: TaxRate[];
    systemLists: SystemLists;
    emailTemplates: EmailTemplate[];
    priceLists: PriceList[];
    priceListItems: PriceListItem[];
    automations: Automation[];
    automationLogs: AutomationLog[];
    taskTemplates: TaskTemplate[];
    scheduledTasks: ScheduledTask[];
    addScheduledTask: (schedule: Omit<ScheduledTask, 'id'>) => void;
    updateScheduledTask: (schedule: ScheduledTask) => void;
    deleteScheduledTask: (scheduleId: number) => void;
    runScheduledTasksCheck: () => void;
    addTaskTemplate: (templateData: Omit<TaskTemplate, 'id'>) => void;
    updateTaskTemplate: (template: TaskTemplate) => void;
    deleteTaskTemplate: (templateId: number) => void;
    // New Inventory State
    warehouses: Warehouse[];
    stockMovements: StockMovement[];
    inventoryTransfers: InventoryTransfer[];
    inventoryAdjustments: InventoryAdjustment[];
    salesOrders: SalesOrder[];
    shipments: Shipment[];
    stockItems: StockItem[];
    pickLists: PickList[];

    // NEW FUNCTIONS
    getProductStockInfo: (productId: number) => { physical: number, committed: number, available: number };
    getProductStockByWarehouse: (productId: number, warehouseId: number) => { physical: number, committed: number, available: number };
    getCustomerHealthScore: (customerId: number) => { score: number; factors: string[] };
    
    // New/Updated Functions
    addProduct: (productData: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;
    addWarehouse: (warehouseData: Omit<Warehouse, 'id'>) => void;
    updateWarehouse: (warehouse: Warehouse) => void;
    deleteWarehouse: (id: number) => void;
    addInventoryTransfer: (transferData: Omit<InventoryTransfer, 'id' | 'transferNumber' | 'status'>) => void;
    addInventoryAdjustment: (adjustmentData: Omit<InventoryAdjustment, 'id' | 'adjustmentNumber' | 'status'>) => void;
    receivePurchaseOrderItems: (poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string, expiry: string })[] }[], warehouseId: number) => void;
    addPurchaseOrder: (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'supplierName' | 'totalAmount'>) => void;
    updatePurchaseOrder: (po: PurchaseOrder) => void;
    convertDealToSalesOrder: (deal: Deal) => void;
    allocateStockToSalesOrder: (soId: number, allocations: { [productId: string]: number[] }) => void;
    createShipmentFromSalesOrder: (soId: number, itemsToShip: { productId: number; stockItemIds: number[]; quantity: number }[]) => void;
    createPickList: (shipmentIds: number[]) => void;

    // ... (All other function types)
    addAutomation: (auto: Omit<Automation, 'id' | 'lastRun'>) => void;
    updateAutomation: (auto: Automation) => void;
    deleteAutomation: (autoId: number) => void;
    updateSystemList: (key: SystemListKey, items: SystemListItem[]) => void;
    updateEmailTemplate: (template: EmailTemplate) => void;
    addPriceList: (list: Omit<PriceList, 'id'>) => void;
    updatePriceList: (list: PriceList) => void;
    deletePriceList: (listId: number) => void;
    updatePriceListItems: (listId: number, items: PriceListItem[]) => void;
    addTaxRate: (rate: Omit<TaxRate, 'id'>) => void;
    updateTaxRate: (rate: TaxRate) => void;
    deleteTaxRate: (rateId: number) => void;
    accounts: Account[];
    journalEntries: JournalEntry[];
    recurringJournalEntries: RecurringJournalEntry[];
    budgets: Budget[];
    costCenters: CostCenter[];
    accountingLockDate: string | null;
    updateAccountingLockDate: (date: string | null) => void;
    addAccount: (account: Omit<Account, 'id'>) => void;
    updateAccount: (account: Account) => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber'>) => JournalEntry;
    updateJournalEntry: (entry: JournalEntry) => void;
    deleteJournalEntry: (entryId: number) => void;
    reverseJournalEntry: (entryId: number) => number | undefined;
    addRecurringJournalEntry: (template: Omit<RecurringJournalEntry, 'id'>) => void;
    updateRecurringJournalEntry: (template: RecurringJournalEntry) => void;
    deleteRecurringJournalEntry: (templateId: number) => void;
    generateEntryFromRecurringTemplate: (templateId: number) => Promise<number | undefined>;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (budget: Budget) => void;
    deleteBudget: (budgetId: number) => void;
    addCostCenter: (costCenter: Omit<CostCenter, 'id'>) => void;
    updateCostCenter: (costCenter: CostCenter) => void;
    deleteCostCenter: (costCenterId: number) => void;
    setDashboardLayout: (layout: DashboardWidget[]) => void;
    addWidgetToDashboard: (widgetId: string) => void;
    removeWidgetFromDashboard: (id: string) => void;
    currentUser: Employee;
    setCurrentUser: (user: Employee) => void;
    hasPermission: (permission: Permission) => boolean;
    addSavedView: (name: string, filters: SavedView['filters'], sortConfig: SortConfig) => void;
    deleteSavedView: (id: number) => void;
    loadSavedView: (id: number) => SavedView | undefined;
    addCustomer: (customerData: Omit<Customer, 'id' | 'avatar'>) => void;
    updateCustomer: (customer: Customer) => void;
    updateCustomerStatus: (customerId: number, newStatus: Customer['status']) => void;
    assignCustomersToEmployee: (customerIds: number[], employeeId: number) => void;
    addTagsToCustomers: (customerIds: number[], tags: string[]) => void;
    deleteCustomer: (id: number) => void;
    deleteMultipleCustomers: (ids: number[]) => void;
    importCustomers: (customersData: Omit<Customer, 'id' | 'avatar'>[]) => void;
    addContact: (contactData: Omit<Contact, 'id'>) => void;
    updateContact: (contact: Contact) => void;
    deleteContact: (contactId: number) => void;
    addDeal: (dealData: Omit<Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'>) => void;
    updateDeal: (deal: Deal) => void;
    updateDealStage: (dealId: number, newStage: DealStage) => void;
    updateDealWinLossReason: (dealId: number, stage: DealStage.Won | DealStage.Lost, reason: string) => void;
    deleteDeal: (id: number) => void;
    addProject: (projectData: Omit<Project, 'id' | 'client'>) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: number) => void;
    addTask: (taskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles?: string[]) => void;
    updateTask: (task: Task, options?: { silent?: boolean }) => void;
    updateRecurringTask: (task: Task, updateData: Partial<Task>, scope: 'this' | 'all', options?: { silent?: boolean }) => void;
    deleteTask: (id: number) => void;
    updateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
    addSubtask: (parentId: number, title: string) => void;
    addTaskDependency: (taskId: number, dependsOnId: number) => void;
    removeTaskDependency: (taskId: number, dependsOnId: number) => void;
    deleteMultipleTasks: (taskIds: number[]) => void;
    logTimeOnTask: (taskId: number, minutes: number) => void;
    toggleTaskStar: (taskId: number) => void;
    createTasksFromTemplate: (templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => void;
    addAttachmentToTask: (taskId: number, attachment: Attachment) => void;
    deleteAttachmentFromTask: (taskId: number, attachmentId: number) => void;
    addInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: number) => void;
    addBill: (bill: Omit<Bill, 'id'>) => void;
    updateBill: (bill: Bill) => void;
    addSupplier: (supplierData: Omit<Supplier, 'id'>) => void;
    updateSupplier: (supplier: Supplier) => void;
    deleteSupplier: (id: number) => void;
    deletePurchaseOrder: (id: number) => void;
    addEmployee: (employeeData: Omit<Employee, 'id' | 'avatar' | 'employeeId'>) => void;
    updateEmployee: (employee: Employee) => void;
    deleteEmployee: (id: number) => void;
    addLeaveRequest: (requestData: Omit<LeaveRequest, 'id' | 'employeeName' | 'status'>) => void;
    updateLeaveRequestStatus: (requestId: number, newStatus: LeaveStatus) => void;
    addBankAccount: (accountData: Omit<BankAccount, 'id'>) => void;
    updateBankAccount: (account: BankAccount) => void;
    deleteBankAccount: (id: number) => void;
    addTransaction: (transactionData: Omit<Transaction, 'id'>) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: number) => void;
    addTicket: (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'>) => void;
    updateTicket: (ticket: SupportTicket) => void;
    deleteTicket: (id: number) => void;
    addDocument: (docData: Omit<Document, 'id' | 'uploadedByName'>) => void;
    renameDocument: (docId: number, newName: string) => void;
    deleteDocument: (id: number) => void;
    deleteMultipleDocuments: (ids: number[]) => void;
    addFolder: (folderName: string, parentId: number | null) => void;
    moveDocuments: (docIds: number[], targetFolderId: number | null) => void;
    toggleDocumentStar: (docId: number) => void;
    shareDocument: (docId: number, shares: DocumentShare[]) => void;
    addComment: (text: string, entityType: 'customer' | 'project' | 'deal' | 'task', entityId: number) => void;
    updateComment: (comment: Comment) => void;
    deleteComment: (commentId: number) => void;
    addCommunicationLog: (customerId: number, type: CommunicationLogType, content: string) => void;
    updateCommunicationLog: (log: CommunicationLog) => void;
    deleteCommunicationLog: (logId: number) => void;
    addSalesActivity: (activityData: Omit<SalesActivity, 'id' | 'userName' | 'userAvatar' | 'timestamp'>) => void;
    addPerformanceReview: (reviewData: Omit<PerformanceReview, 'id' | 'employeeName' | 'reviewerName'>) => void;
    updatePerformanceReview: (review: PerformanceReview) => void;
    addJobOpening: (jobData: Omit<JobOpening, 'id'>) => void;
    updateJobOpening: (job: JobOpening) => void;
    addCandidate: (candidateData: Omit<Candidate, 'id'>) => void;
    updateCandidate: (candidate: Candidate) => void;
    updateCandidateStage: (candidateId: number, newStage: CandidateStage) => void;
    addOnboardingTemplate: (templateData: Omit<OnboardingTemplate, 'id'>) => void;
    updateOnboardingTemplate: (template: OnboardingTemplate) => void;
    startOnboardingWorkflow: (data: { employeeId: number, templateId: number }) => void;
    updateOnboardingWorkflowStatus: (workflowId: number, itemIndex: number, isCompleted: boolean) => void;
    addPayrollRun: (payPeriod: string) => void;
    updatePayrollRunStatus: (runId: number, status: PayrollRun['status'], journalEntryId?: number) => void;
    postPayrollRunToJournal: (runId: number) => void;
    updatePayslip: (payslip: Partial<Payslip> & { id: number }) => void;
    calculateTerminationPayments: (employeeId: number, terminationDate: string, additionalGrossPay: number, additionalBonuses: number, usedAnnualLeave: number) => SeveranceCalculationResult | null;
    calculatePayrollCost: (grossSalary: number) => PayrollSimulationResult;
    updateCompanyInfo: (info: CompanyInfo) => void;
    updateBrandingSettings: (settings: BrandingSettings) => void;
    updateSecuritySettings: (settings: SecuritySettings) => void;
    addRole: (roleData: Omit<Role, 'id' | 'isSystemRole'>, cloneFromRoleId?: string) => void;
    updateRolePermissions: (roleId: string, permissions: Permission[]) => void;
    deleteRole: (roleId: string) => void;
    addCustomField: (fieldData: Omit<CustomFieldDefinition, 'id'>) => void;
    updateCustomField: (field: CustomFieldDefinition) => void;
    deleteCustomField: (id: number) => void;
    markNotificationAsRead: (id: number) => void;
    clearAllNotifications: () => void;
    createProjectFromDeal: (deal: Deal) => void;
    createTasksFromDeal: (deal: Deal) => void;
    logActivity: (actionType: ActionType, details: string, entityType?: EntityType, entityId?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to calculate income tax based on brackets
const calculateIncomeTax = (taxableAmount: number, cumulativeBase: number = 0): number => {
    const brackets = TURKISH_PAYROLL_PARAMS_2025.INCOME_TAX_BRACKETS;
    let totalTax = 0;
    let remainingAmount = taxableAmount;
    let currentBase = cumulativeBase;

    for (const bracket of brackets) {
        if (remainingAmount <= 0) break;

        const bracketLimit = bracket.limit;
        const availableInBracket = bracketLimit - currentBase;

        if (availableInBracket > 0) {
            const amountInBracket = Math.min(remainingAmount, availableInBracket);
            totalTax += amountInBracket * bracket.rate;
            remainingAmount -= amountInBracket;
        }
        currentBase = bracketLimit;
    }

    // This handles amounts exceeding the last bracket limit.
    if (remainingAmount > 0 && brackets.length > 0) {
        // Find the rate of the last bracket to apply to the rest of the amount.
        const lastBracketRate = brackets[brackets.length - 1].rate;
        totalTax += remainingAmount * lastBracketRate;
    }


    return totalTax;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addToast } = useNotification();
    
    // State
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
    const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(MOCK_PERFORMANCE_REVIEWS);
    const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(MOCK_JOB_OPENINGS);
    const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
    const [onboardingTemplates, setOnboardingTemplates] = useState<OnboardingTemplate[]>(MOCK_ONBOARDING_TEMPLATES);
    const [onboardingWorkflows, setOnboardingWorkflows] = useState<OnboardingWorkflow[]>(MOCK_ONBOARDING_WORKFLOWS);
    const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(MOCK_PAYROLL_RUNS);
    const [payslips, setPayslips] = useState<Payslip[]>(MOCK_PAYSLIPS);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [salesActivities, setSalesActivities] = useState<SalesActivity[]>(MOCK_SALES_ACTIVITIES);
    const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>(MOCK_COMMUNICATION_LOGS);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [savedViews, setSavedViews] = useState<SavedView[]>(MOCK_SAVED_VIEWS);
    const [customFieldDefinitions, setCustomFieldDefinitions] = useState<CustomFieldDefinition[]>(MOCK_CUSTOM_FIELD_DEFINITIONS);
    const [dashboardLayout, setDashboardLayout] = useState<DashboardWidget[]>(INITIAL_DASHBOARD_LAYOUT);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(MOCK_COMPANY_INFO);
    const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(MOCK_BRANDING_SETTINGS);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(MOCK_SECURITY_SETTINGS);
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [rolesPermissions, setRolesPermissions] = useState<Record<string, Permission[]>>(INITIAL_ROLES_PERMISSIONS);
    const [taxRates, setTaxRates] = useState<TaxRate[]>(MOCK_TAX_RATES);
    const [systemLists, setSystemLists] = useState<SystemLists>(INITIAL_SYSTEM_LISTS);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(INITIAL_EMAIL_TEMPLATES);
    const [priceLists, setPriceLists] = useState<PriceList[]>(MOCK_PRICE_LISTS);
    const [priceListItems, setPriceListItems] = useState<PriceListItem[]>(MOCK_PRICE_LIST_ITEMS);
    const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
    const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(MOCK_AUTOMATION_LOGS);
    const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(MOCK_TASK_TEMPLATES);
    const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(MOCK_SCHEDULED_TASKS);
    const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);
    const [inventoryTransfers, setInventoryTransfers] = useState<InventoryTransfer[]>(MOCK_INVENTORY_TRANSFERS);
    const [inventoryAdjustments, setInventoryAdjustments] = useState<InventoryAdjustment[]>(MOCK_INVENTORY_ADJUSTMENTS);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(MOCK_SALES_ORDERS);
    const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
    const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK_ITEMS);
    const [pickLists, setPickLists] = useState<PickList[]>(MOCK_PICK_LISTS);
    const [currentUser, setCurrentUser] = useState<Employee>(MOCK_EMPLOYEES[0]);
    const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
    const [recurringJournalEntries, setRecurringJournalEntries] = useState<RecurringJournalEntry[]>(MOCK_RECURRING_JOURNAL_ENTRIES);
    const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
    const [costCenters, setCostCenters] = useState<CostCenter[]>(MOCK_COST_CENTERS);
    const [accountingLockDate, setAccountingLockDate] = useState<string | null>(null);

    const logActivity = useCallback((actionType: ActionType, details: string, entityType?: EntityType, entityId?: number) => {
        setActivityLogs(prev => {
            const newLog: ActivityLog = {
                id: prev.length + 1,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
                actionType,
                details,
                entityType,
                entityId,
            };
            return [newLog, ...prev];
        });
    }, [currentUser]);
    
     const calculateSinglePayslip = useCallback((employee: Employee, payPeriod: string, existingPuantaj?: Partial<Payslip>): Payslip => {
        const params = TURKISH_PAYROLL_PARAMS_2025;
        const grossSalary = employee.salary;

        const puantaj: Partial<Payslip> = {
            normalCalismaGunu: 22,
            haftaTatili: 8,
            fazlaMesaiSaati: 0,
            ekOdemeler: [],
            digerKesintiler: [],
            ...existingPuantaj,
        };
        
        const overtimePay = (grossSalary / 225) * 1.5 * (puantaj.fazlaMesaiSaati || 0);
        const ekOdemelerTotal = (puantaj.ekOdemeler || []).reduce((sum, p) => sum + p.amount, 0);
        const grossPay = grossSalary + overtimePay + ekOdemelerTotal;

        const earnings: PayslipEarning[] = [{ name: 'Normal Maaş', amount: grossSalary }];
        if (overtimePay > 0) earnings.push({ name: 'Fazla Mesai', amount: overtimePay });
        (puantaj.ekOdemeler || []).forEach(p => earnings.push({ name: p.name, amount: p.amount }));

        const sgkBase = Math.min(grossPay, params.SGK_CEILING);
        const employeeSgkContribution = sgkBase * params.EMPLOYEE_SGK_RATE;
        const employeeUnemploymentContribution = sgkBase * params.EMPLOYEE_UNEMPLOYMENT_RATE;
        const totalSgkDeduction = employeeSgkContribution + employeeUnemploymentContribution;
        
        const currentYear = new Date(payPeriod.split(' ')[1]).getFullYear();
        const previousPayslips = payslips.filter(p => p.employeeId === employee.id && new Date(p.runDate).getFullYear() === currentYear && p.id !== existingPuantaj?.id);
        const cumulativeIncomeTaxBase = previousPayslips.reduce((sum, p) => sum + p.incomeTaxBase, 0);
        
        const incomeTaxBase = grossPay - totalSgkDeduction;
        const calculatedIncomeTax = calculateIncomeTax(incomeTaxBase, cumulativeIncomeTaxBase);
        
        const incomeTaxExemption = calculateIncomeTax(params.INCOME_TAX_EXEMPTION_BASE);
        const stampDutyExemption = params.STAMP_DUTY_EXEMPTION_BASE * params.STAMP_DUTY_RATE;

        const incomeTaxAmount = Math.max(0, calculatedIncomeTax - incomeTaxExemption);
        const stampDutyAmount = Math.max(0, (grossPay * params.STAMP_DUTY_RATE) - stampDutyExemption);

        const besDeduction = (employee.besKesintisiVarMi || puantaj.besKesintisiVarMi) ? grossPay * params.BES_RATE : 0;
        const digerKesintilerTotal = (puantaj.digerKesintiler || []).reduce((sum, p) => sum + p.amount, 0);

        const totalDeductionsValue = totalSgkDeduction + incomeTaxAmount + stampDutyAmount + besDeduction + digerKesintilerTotal;
        const netPay = grossPay - totalDeductionsValue;
        
        const employerSgkContribution = sgkBase * params.EMPLOYER_SGK_RATE;
        const employerUnemploymentContribution = sgkBase * params.EMPLOYER_UNEMPLOYMENT_RATE;
        const employerTotalSgk = employerSgkContribution + employerUnemploymentContribution;

        const deductions: PayslipDeduction[] = [
            { name: 'SGK Primi', amount: totalSgkDeduction },
            { name: 'Gelir Vergisi', amount: incomeTaxAmount },
            { name: 'Damga Vergisi', amount: stampDutyAmount },
        ];
        if (besDeduction > 0) deductions.push({ name: 'BES Kesintisi', amount: besDeduction });
        (puantaj.digerKesintiler || []).forEach(p => deductions.push({ name: p.name, amount: p.amount }));

        return {
            id: existingPuantaj?.id || Date.now() + Math.random(),
            payrollRunId: existingPuantaj?.payrollRunId || 0,
            employeeId: employee.id,
            employeeName: employee.name,
            payPeriod: payPeriod,
            runDate: new Date().toISOString().split('T')[0],
            grossPay, earnings, deductions, netPay,
            sgkPremium: totalSgkDeduction, unemploymentPremium: employeeUnemploymentContribution,
            incomeTaxBase, cumulativeIncomeTaxBase: cumulativeIncomeTaxBase + incomeTaxBase, incomeTaxAmount,
            stampDutyAmount, employerSgkPremium: employerTotalSgk, incomeTaxExemption, stampDutyExemption,
            besKesintisi: besDeduction, agiTutari: 0,
            normalCalismaGunu: puantaj.normalCalismaGunu!, haftaTatili: puantaj.haftaTatili!,
            genelTatil: puantaj.genelTatil || 0, ucretliIzin: puantaj.ucretliIzin || 0,
            ucretsizIzin: puantaj.ucretsizIzin || 0, raporluGun: puantaj.raporluGun || 0,
            fazlaMesaiSaati: puantaj.fazlaMesaiSaati || 0, resmiTatilMesaisi: puantaj.resmiTatilMesaisi || 0,
            geceVardiyasiSaati: puantaj.geceVardiyasiSaati || 0, eksikGun: puantaj.eksikGun || 0,
            eksikGunNedeni: puantaj.eksikGunNedeni, ekOdemeler: puantaj.ekOdemeler || [],
            digerKesintiler: puantaj.digerKesintiler || [],
        };
    }, [payslips]);


    const addPayrollRun = useCallback((payPeriod: string) => {
        const newRunId = Date.now();
        const activeEmployees = employees.filter(e => !e.istenCikisTarihi || new Date(e.istenCikisTarihi) > new Date(payPeriod));
        
        const newPayslips: Payslip[] = activeEmployees.map(employee => {
            const payslip = calculateSinglePayslip(employee, payPeriod);
            return { ...payslip, payrollRunId: newRunId };
        });

        const newRunTotals = newPayslips.reduce((totals, p) => {
            totals.totalGrossPay += p.grossPay;
            totals.totalDeductions += (p.grossPay - p.netPay);
            totals.totalNetPay += p.netPay;
            totals.totalEmployerSgk += p.employerSgkPremium;
            return totals;
        }, { totalGrossPay: 0, totalDeductions: 0, totalNetPay: 0, totalEmployerSgk: 0 });

        const newRun: PayrollRun = {
            id: newRunId,
            payPeriod,
            runDate: new Date().toISOString().split('T')[0],
            status: 'Taslak',
            employeeCount: activeEmployees.length,
            ...newRunTotals,
        };
        
        setPayrollRuns(prev => [...prev, newRun]);
        setPayslips(prev => [...prev, ...newPayslips]);
        logActivity(ActionType.PAYROLL_RUN_CREATED, `${payPeriod} bordrosu oluşturuldu.`);
        addToast(`${payPeriod} bordrosu başarıyla oluşturuldu.`, 'success');
    }, [employees, calculateSinglePayslip, addToast, logActivity]);


    const updatePayslip = useCallback((updatedPayslipData: Partial<Payslip> & { id: number }) => {
        let finalPayslips: Payslip[] = [];
        let runIdToUpdate: number | null = null;

        setPayslips(currentPayslips => {
            let recalculatedPayslip: Payslip | null = null;
            finalPayslips = currentPayslips.map(p => {
                if (p.id === updatedPayslipData.id) {
                    const mergedPuantaj = { ...p, ...updatedPayslipData };
                    const employee = employees.find(e => e.id === p.employeeId);
                    if (!employee) return p;
                    recalculatedPayslip = calculateSinglePayslip(employee, p.payPeriod, mergedPuantaj);
                    runIdToUpdate = p.payrollRunId;
                    return recalculatedPayslip;
                }
                return p;
            });

            if (runIdToUpdate) {
                setPayrollRuns(currentRuns => currentRuns.map(run => {
                    if (run.id === runIdToUpdate) {
                        const runPayslips = finalPayslips.filter(p => p.payrollRunId === runIdToUpdate);
                        const newRunTotals = runPayslips.reduce((totals, p) => {
                            totals.totalGrossPay += p.grossPay;
                            totals.totalDeductions += (p.grossPay - p.netPay);
                            totals.totalNetPay += p.netPay;
                            totals.totalEmployerSgk += p.employerSgkPremium;
                            return totals;
                        }, { totalGrossPay: 0, totalDeductions: 0, totalNetPay: 0, totalEmployerSgk: 0 });
                        
                        return { ...run, ...newRunTotals };
                    }
                    return run;
                }));
            }
            
            return finalPayslips;
        });
        logActivity(ActionType.PAYSLIP_UPDATED, `Maaş pusulası güncellendi.`);
    }, [employees, calculateSinglePayslip, logActivity]);

    const addTask = useCallback((taskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles?: string[]) => {
        const assignedTo = employees.find(e => e.id === taskData.assignedToId);
        let relatedEntityName = '';
        if (taskData.relatedEntityType === 'customer') {
            relatedEntityName = customers.find(c => c.id === taskData.relatedEntityId)?.name || '';
        } else if (taskData.relatedEntityType === 'project') {
            relatedEntityName = projects.find(p => p.id === taskData.relatedEntityId)?.name || '';
        } else if (taskData.relatedEntityType === 'deal') {
            relatedEntityName = deals.find(d => d.id === taskData.relatedEntityId)?.title || '';
        }

        const newParentTask: Task = {
            ...taskData,
            id: Date.now(),
            assignedToName: assignedTo?.name || 'Atanmamış',
            relatedEntityName,
        };

        const newSubtasks: Task[] = (subtaskTitles || []).map(title => ({
            id: Date.now() + Math.random(),
            title,
            description: '',
            status: TaskStatus.Todo,
            priority: newParentTask.priority,
            dueDate: newParentTask.dueDate,
            assignedToId: newParentTask.assignedToId,
            assignedToName: newParentTask.assignedToName,
            parentId: newParentTask.id,
        }));
        
        setTasks(prev => [...prev, newParentTask, ...newSubtasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
        logActivity(ActionType.TASK_CREATED, `Görev oluşturuldu: ${newParentTask.title}`, 'task', newParentTask.id);
        addToast("Görev ve alt görevleri başarıyla oluşturuldu.", "success");
    }, [employees, customers, projects, deals, logActivity, addToast]);

    const createTasksFromTemplate = useCallback((templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => {
        const template = taskTemplates.find(t => t.id === templateId);
        if (!template) {
            addToast("Şablon bulunamadı.", "error");
            return;
        }
    
        const start = new Date(startDate);
        const newTasks: Task[] = [];
        const idMap = new Map<string, number>();
    
        const processItem = (item: any, parentTaskId: number | undefined) => {
            const newTaskId = Date.now() + Math.random();
            idMap.set(item.id, newTaskId);
    
            const dueDate = new Date(start);
            dueDate.setDate(start.getDate() + item.dueDaysAfterStart);
            
            const role = roles.find(r => r.id === item.defaultAssigneeRoleId);
            // Employee roles are names, role IDs are keys. Match them.
            const employeeWithRole = employees.find(e => e.role === role?.name);
            const assignedToId = employeeWithRole ? employeeWithRole.id : currentUser.id; // Fallback to current user
            const finalAssignee = employees.find(e => e.id === assignedToId);

            const taskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'> = {
                title: item.taskName,
                description: item.description || '',
                status: TaskStatus.Todo,
                priority: item.priority,
                dueDate: dueDate.toISOString().split('T')[0],
                startDate: start.toISOString().split('T')[0],
                assignedToId: assignedToId,
                relatedEntityType,
                relatedEntityId,
                estimatedTime: item.estimatedTime,
                timeSpent: 0,
                parentId: parentTaskId
            };
            const newTask: Task = {
                ...taskData,
                id: newTaskId,
                assignedToName: finalAssignee?.name || 'Atanmamış',
            };
            newTasks.push(newTask);
            
            const children = template.items.filter(child => child.parentId === item.id);
            children.forEach(child => processItem(child, newTaskId));
        };
        
        // Process only top-level items initially
        template.items.filter(item => !item.parentId).forEach(item => processItem(item, undefined));
    
        setTasks(prev => [...prev, ...newTasks]);
        addToast(`'${template.name}' şablonundan ${template.items.length} görev oluşturuldu.`, "success");
    }, [taskTemplates, currentUser, employees, addToast, logActivity, roles]);

    const runScheduledTasksCheck = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let tasksCreatedCount = 0;
        let schedulesRunCount = 0;

        setScheduledTasks(prev => {
            const newSchedules = prev.map(schedule => {
                if (!schedule.enabled) return schedule;
                
                const nextRun = new Date(schedule.nextRunDate);
                nextRun.setHours(0, 0, 0, 0);

                let updatedSchedule = { ...schedule };

                if (nextRun <= today) {
                    console.log(`Running schedule: ${schedule.name}`);
                    const template = taskTemplates.find(t => t.id === schedule.taskTemplateId);
                    if (template) {
                        createTasksFromTemplate(schedule.taskTemplateId, schedule.nextRunDate);
                        tasksCreatedCount += template.items.length;
                        schedulesRunCount++;
                    }

                    const newNextRun = new Date(schedule.nextRunDate);
                    const ruleParts = schedule.rrule.split(';');
                    const freqPart = ruleParts.find(p => p.startsWith('FREQ='));
                    if (freqPart) {
                        const freq = freqPart.split('=')[1];
                        if (freq === 'MONTHLY') {
                            newNextRun.setMonth(newNextRun.getMonth() + 1);
                            const dayPart = ruleParts.find(p => p.startsWith('BYMONTHDAY='));
                            if (dayPart) {
                                const day = parseInt(dayPart.split('=')[1]);
                                newNextRun.setDate(day);
                            }
                        }
                    }

                    updatedSchedule = {
                        ...schedule,
                        lastRunDate: new Date().toISOString().split('T')[0],
                        nextRunDate: newNextRun.toISOString().split('T')[0]
                    };

                    if (updatedSchedule.endDate && new Date(updatedSchedule.nextRunDate) > new Date(updatedSchedule.endDate)) {
                        updatedSchedule.enabled = false;
                    }
                }
                return updatedSchedule;
            });
            return newSchedules;
        });
        
        if (schedulesRunCount > 0) {
            addToast(`${schedulesRunCount} plan çalıştırıldı, toplam ${tasksCreatedCount} görev oluşturuldu.`, 'success');
        }

    }, [createTasksFromTemplate, addToast, taskTemplates]);
    
    useEffect(() => {
        if (!sessionStorage.getItem('scheduledTasksChecked')) {
            console.log("Running scheduled tasks check on app start...");
            runScheduledTasksCheck();
            sessionStorage.setItem('scheduledTasksChecked', 'true');
        }
    }, [runScheduledTasksCheck]);
    
    const addScheduledTask = (schedule: Omit<ScheduledTask, 'id'>) => {
        const newSchedule = { ...schedule, id: Date.now() };
        setScheduledTasks(prev => [...prev, newSchedule]);
        logActivity(ActionType.SCHEDULED_TASK_CREATED, `Planlanmış görev oluşturuldu: ${newSchedule.name}`, 'scheduled_task', newSchedule.id);
        addToast("Planlanmış görev başarıyla oluşturuldu.", "success");
    };

    const updateScheduledTask = (schedule: ScheduledTask) => {
        setScheduledTasks(prev => prev.map(s => s.id === schedule.id ? schedule : s));
        logActivity(ActionType.SCHEDULED_TASK_UPDATED, `Planlanmış görev güncellendi: ${schedule.name}`, 'scheduled_task', schedule.id);
        addToast("Planlanmış görev başarıyla güncellendi.", "success");
    };

    const deleteScheduledTask = (scheduleId: number) => {
        const toDelete = scheduledTasks.find(s => s.id === scheduleId);
        if (toDelete) {
            setScheduledTasks(prev => prev.filter(s => s.id !== scheduleId));
            logActivity(ActionType.SCHEDULED_TASK_DELETED, `Planlanmış görev silindi: ${toDelete.name}`, 'scheduled_task', scheduleId);
            addToast("Planlanmış görev başarıyla silindi.", "success");
        }
    };

    const logTimeOnTask = useCallback((taskId: number, minutes: number) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId 
                ? { ...task, timeSpent: (task.timeSpent || 0) + minutes } 
                : task
        ));
        addToast("Süre başarıyla eklendi.", "success");
        logActivity(ActionType.TASK_UPDATED, `Göreve süre eklendi: ${minutes / 60} saat`, 'task', taskId);
    }, [addToast, logActivity]);
    
    const addTaskDependency = useCallback((taskId: number, dependsOnId: number) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                const newDependsOn = [...(task.dependsOn || [])];
                if (!newDependsOn.includes(dependsOnId)) {
                    newDependsOn.push(dependsOnId);
                }
                return { ...task, dependsOn: newDependsOn };
            }
            return task;
        }));
        addToast("Görev bağımlılığı eklendi.", "success");
    }, [addToast]);

    const removeTaskDependency = useCallback((taskId: number, dependsOnId: number) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, dependsOn: (task.dependsOn || []).filter(id => id !== dependsOnId) };
            }
            return task;
        }));
        addToast("Görev bağımlılığı kaldırıldı.", "success");
    }, [addToast]);

    const toggleTaskStar = useCallback((taskId: number) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskId ? { ...task, isStarred: !task.isStarred } : task
        ));
    }, []);
    
    const addAttachmentToTask = useCallback((taskId: number, attachment: Attachment) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                const newAttachments = [...(task.attachments || []), attachment];
                return { ...task, attachments: newAttachments };
            }
            return task;
        }));
        addToast("Dosya başarıyla eklendi.", "success");
        logActivity(ActionType.FILE_UPLOADED, `Dosya eklendi: ${attachment.fileName}`, 'task', taskId);
    }, [addToast, logActivity]);
    
    const deleteAttachmentFromTask = useCallback((taskId: number, attachmentId: number) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                const newAttachments = (task.attachments || []).filter(att => att.id !== attachmentId);
                return { ...task, attachments: newAttachments };
            }
            return task;
        }));
        addToast("Ek silindi.", "success");
        logActivity(ActionType.UPDATED, `Bir ek silindi`, 'task', taskId);
    }, [addToast, logActivity]);

    const addTaskTemplate = useCallback((templateData: Omit<TaskTemplate, 'id'>) => {
        const newTemplate: TaskTemplate = {
            ...templateData,
            id: Date.now(),
        };
        setTaskTemplates(prev => [...prev, newTemplate]);
        logActivity(ActionType.TASK_TEMPLATE_CREATED, `Görev şablonu oluşturuldu: ${newTemplate.name}`, 'task_template', newTemplate.id);
        addToast("Görev şablonu başarıyla oluşturuldu.", "success");
    }, [logActivity, addToast]);

    const updateTaskTemplate = useCallback((template: TaskTemplate) => {
        setTaskTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        logActivity(ActionType.TASK_TEMPLATE_UPDATED, `Görev şablonu güncellendi: ${template.name}`, 'task_template', template.id);
        addToast("Görev şablonu başarıyla güncellendi.", "success");
    }, [logActivity, addToast]);

    const deleteTaskTemplate = useCallback((templateId: number) => {
        const templateToDelete = taskTemplates.find(t => t.id === templateId);
        if (templateToDelete) {
            setTaskTemplates(prev => prev.filter(t => t.id !== templateId));
            logActivity(ActionType.TASK_TEMPLATE_DELETED, `Görev şablonu silindi: ${templateToDelete.name}`, 'task_template', templateId);
            addToast("Görev şablonu başarıyla silindi.", "success");
        }
    }, [taskTemplates, logActivity, addToast]);

    const getProductStockInfo = useCallback((productId: number) => {
        const physical = stockItems
            .filter(i => i.productId === productId && i.status !== StockItemStatus.Shipped)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
        const committed = stockItems
            .filter(i => i.productId === productId && i.status === StockItemStatus.Committed)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
        return { physical, committed, available: physical - committed };
    }, [stockItems]);

    const getCustomerHealthScore = useCallback((customerId: number): { score: number; factors: string[] } => {
        const factors: string[] = [];
        let score = 100;
    
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return { score: 0, factors: ["Müşteri bulunamadı"] };
    
        const customerDeals = deals.filter(d => d.customerId === customerId);
        const customerInvoices = invoices.filter(i => i.customerId === customerId);
        const customerTickets = tickets.filter(t => t.customerId === customerId);
        
        const lastContactDate = new Date(customer.lastContact);
        const daysSinceContact = (new Date().getTime() - lastContactDate.getTime()) / (1000 * 3600 * 24);
        if (daysSinceContact > 90) {
            score -= 20;
            factors.push(`- 90+ gündür iletişim yok`);
        } else if (daysSinceContact > 30) {
            score -= 10;
            factors.push(`- 30+ gündür iletişim yok`);
        }
        
        const overdueInvoices = customerInvoices.filter(i => i.status === InvoiceStatus.Overdue).length;
        if (overdueInvoices > 0) {
            score -= overdueInvoices * 15;
            factors.push(`- ${overdueInvoices} gecikmiş fatura`);
        }
    
        const lostDeals = customerDeals.filter(d => d.stage === DealStage.Lost).length;
        if (lostDeals > 0) {
            score -= lostDeals * 10;
            factors.push(`- ${lostDeals} kaybedilmiş anlaşma`);
        }
        
        const openTickets = tickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.Pending).length;
        if (openTickets > 0) {
            score -= openTickets * 5;
            factors.push(`- ${openTickets} açık destek talebi`);
        }
        
        const wonDeals = customerDeals.filter(d => d.stage === DealStage.Won).length;
        if (wonDeals > 0) {
            score += wonDeals * 5;
            factors.push(`+ ${wonDeals} kazanılmış anlaşma`);
        }
    
        return { score: Math.max(0, Math.min(100, score)), factors };
    }, [deals, invoices, tickets, customers]);

    const getProductStockByWarehouse = useCallback((productId: number, warehouseId: number) => {
        const physical = stockItems
            .filter(i => i.productId === productId && i.warehouseId === warehouseId && i.status !== StockItemStatus.Shipped)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
        const committed = stockItems
            .filter(i => i.productId === productId && i.warehouseId === warehouseId && i.status === StockItemStatus.Committed)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
        return { physical, committed, available: physical - committed };
    }, [stockItems]);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
        addToast("Product added successfully", "success");
    };
    const updateProduct = (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        addToast("Product updated successfully", "success");
    };
    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        addToast("Product deleted successfully", "success");
    };
    const addWarehouse = (warehouseData: Omit<Warehouse, 'id'>) => {
        setWarehouses(prev => [...prev, { ...warehouseData, id: Date.now() }]);
        addToast("Warehouse added successfully", "success");
    };
    const updateWarehouse = (warehouse: Warehouse) => {
        setWarehouses(prev => prev.map(w => w.id === warehouse.id ? warehouse : w));
        addToast("Warehouse updated successfully", "success");
    };
    const deleteWarehouse = (id: number) => {
        setWarehouses(prev => prev.filter(w => w.id !== id));
        addToast("Warehouse deleted successfully", "success");
    };
    const addInventoryTransfer = (transferData: Omit<InventoryTransfer, 'id' | 'transferNumber' | 'status'>) => {
        addToast("Not implemented", "info");
    };
    const addInventoryAdjustment = (adjustmentData: Omit<InventoryAdjustment, 'id' | 'adjustmentNumber' | 'status'>) => {
        addToast("Not implemented", "info");
    };
    const receivePurchaseOrderItems = (poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string; expiry: string })[] }[], warehouseId: number) => {
        addToast("Not implemented", "info");
    };
    const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'supplierName' | 'totalAmount'>) => {
        addToast("Not implemented", "info");
    };
    const updatePurchaseOrder = (po: PurchaseOrder) => {
        addToast("Not implemented", "info");
    };
    const convertDealToSalesOrder = useCallback((deal: Deal) => {
        const newOrderItems: SalesOrderItem[] = deal.lineItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            committedStockItemIds: [],
            shippedQuantity: 0,
        }));

        const isStockAvailable = newOrderItems.every(item => {
            const stockInfo = getProductStockInfo(item.productId);
            return stockInfo.available >= item.quantity;
        });

        const newSalesOrder: SalesOrder = {
            id: Date.now(),
            orderNumber: `SO-${Date.now().toString().slice(-6)}`,
            customerId: deal.customerId,
            customerName: deal.customerName,
            orderDate: new Date().toISOString().split('T')[0],
            items: newOrderItems,
            totalAmount: deal.value,
            status: isStockAvailable ? SalesOrderStatus.ReadyToShip : SalesOrderStatus.AwaitingStock
        };

        setSalesOrders(prev => [...prev, newSalesOrder]);
        logActivity(ActionType.CREATED, `Satış siparişi #${newSalesOrder.orderNumber} oluşturuldu`, 'customer', deal.customerId);
        addToast(`'${deal.title}' anlaşması için satış siparişi oluşturuldu.`, 'success');
    }, [getProductStockInfo, logActivity, addToast]);
    
    const allocateStockToSalesOrder = (soId: number, allocations: { [productId: string]: number[] }) => {
        addToast("Not implemented", "info");
    };
    const createShipmentFromSalesOrder = (soId: number, itemsToShip: { productId: number; stockItemIds: number[]; quantity: number }[]) => {
        addToast("Not implemented", "info");
    };
    const createPickList = (shipmentIds: number[]) => {
        addToast("Not implemented", "info");
    };
    const addAutomation = (auto: Omit<Automation, 'id' | 'lastRun'>) => {
        addToast("Not implemented", "info");
    };
    const updateAutomation = (auto: Automation) => {
        addToast("Not implemented", "info");
    };
    const deleteAutomation = (autoId: number) => {
        addToast("Not implemented", "info");
    };
    const updateSystemList = (key: SystemListKey, items: SystemListItem[]) => {
        addToast("Not implemented", "info");
    };
    const updateEmailTemplate = (template: EmailTemplate) => {
        addToast("Not implemented", "info");
    };
    const addPriceList = (list: Omit<PriceList, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updatePriceList = (list: PriceList) => {
        addToast("Not implemented", "info");
    };
    const deletePriceList = (listId: number) => {
        addToast("Not implemented", "info");
    };
    const updatePriceListItems = (listId: number, items: PriceListItem[]) => {
        addToast("Not implemented", "info");
    };
    const addTaxRate = (rate: Omit<TaxRate, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateTaxRate = (rate: TaxRate) => {
        addToast("Not implemented", "info");
    };
    const deleteTaxRate = (rateId: number) => {
        addToast("Not implemented", "info");
    };
    const updateAccountingLockDate = (date: string | null) => {
        setAccountingLockDate(date);
        addToast("Accounting lock date updated", "success");
    };
    const addAccount = (account: Omit<Account, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateAccount = (account: Account) => {
        addToast("Not implemented", "info");
    };
    const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'entryNumber'>): JournalEntry => {
        const newEntry: JournalEntry = {
            ...entry,
            id: Date.now(),
            entryNumber: `YE-${Date.now().toString().slice(-6)}`
        };
        setJournalEntries(prev => [newEntry, ...prev]);
        logActivity(ActionType.JOURNAL_ENTRY_CREATED, `Yevmiye fişi #${newEntry.entryNumber} oluşturuldu.`);
        return newEntry;
    };
    const updateJournalEntry = (entry: JournalEntry) => {
        addToast("Not implemented", "info");
    };
    const deleteJournalEntry = (entryId: number) => {
        setJournalEntries(prev => prev.filter(e => e.id !== entryId));
        logActivity(ActionType.JOURNAL_ENTRY_DELETED, `Yevmiye kaydı #${entryId} silindi.`);
        addToast("Yevmiye kaydı başarıyla silindi.", "success");
    };
    const reverseJournalEntry = (entryId: number) => {
        const originalEntry = journalEntries.find(e => e.id === entryId);
        if (originalEntry && originalEntry.status === JournalEntryStatus.Posted) {
            const newEntryData: Omit<JournalEntry, 'id' | 'entryNumber'> = {
                date: new Date().toISOString().split('T')[0],
                memo: `Ters Kayıt: ${originalEntry.memo} (Orijinal: ${originalEntry.entryNumber})`,
                type: originalEntry.type,
                status: JournalEntryStatus.Posted,
                documentNumber: originalEntry.documentNumber,
                items: originalEntry.items.map(item => ({
                    ...item,
                    debit: item.credit,
                    credit: item.debit,
                })),
            };
            const newEntry = addJournalEntry(newEntryData);
            logActivity(ActionType.JOURNAL_ENTRY_REVERSED, `Yevmiye fişi #${originalEntry.entryNumber} için ters kayıt oluşturuldu: #${newEntry.entryNumber}`);
            addToast("Ters kayıt başarıyla oluşturuldu.", "success");
            return newEntry.id;
        }
        addToast("Sadece 'Kaydedildi' durumundaki fişler için ters kayıt oluşturulabilir.", "warning");
        return undefined;
    };
    const addRecurringJournalEntry = (template: Omit<RecurringJournalEntry, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateRecurringJournalEntry = (template: RecurringJournalEntry) => {
        addToast("Not implemented", "info");
    };
    const deleteRecurringJournalEntry = (templateId: number) => {
        addToast("Not implemented", "info");
    };
    const generateEntryFromRecurringTemplate = async (templateId: number) => {
        addToast("Not implemented", "info");
        return undefined;
    };
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateBudget = (budget: Budget) => {
        addToast("Not implemented", "info");
    };
    const deleteBudget = (budgetId: number) => {
        addToast("Not implemented", "info");
    };
    const addCostCenter = (costCenter: Omit<CostCenter, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateCostCenter = (costCenter: CostCenter) => {
        addToast("Not implemented", "info");
    };
    const deleteCostCenter = (costCenterId: number) => {
        addToast("Not implemented", "info");
    };
    const addWidgetToDashboard = (widgetId: string) => {
        const config = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
        if (config) {
            const newWidget: DashboardWidget = {
                id: `widget-${Date.now()}`,
                widgetId: config.id,
                w: config.defaultW,
                h: config.defaultH,
            };
            setDashboardLayout(prev => [...prev, newWidget]);
        }
    };
    const removeWidgetFromDashboard = (id: string) => {
        setDashboardLayout(prev => prev.filter(widget => widget.id !== id));
    };
    const hasPermission = (permission: Permission) => {
        const userRole = currentUser?.role;
        if (!userRole) return false;
        if (userRole === 'Admin') return true;
        const permissions = rolesPermissions[userRole];
        return permissions?.includes(permission) || false;
    };
    const addSavedView = useCallback((name: string, filters: SavedView['filters'], sortConfig: SortConfig) => {
        const newView: SavedView = {
            id: Date.now(),
            name,
            filters,
            sortConfig,
        };
        setSavedViews(prev => [...prev, newView]);
        addToast(`'${name}' görünümü kaydedildi.`, 'success');
    }, [addToast]);

    const deleteSavedView = useCallback((id: number) => {
        setSavedViews(prev => prev.filter(v => v.id !== id));
        addToast('Görünüm silindi.', 'success');
    }, [addToast]);

    const loadSavedView = useCallback((id: number) => {
        const view = savedViews.find(v => v.id === id);
        if (view) {
            addToast(`'${view.name}' görünümü yüklendi.`, 'info');
        }
        return view;
    }, [savedViews, addToast]);

    const addCustomer = (customerData: Omit<Customer, 'id' | 'avatar'>) => {
        const newCustomer: Customer = {
            ...customerData,
            id: Date.now(),
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        setCustomers(prev => [...prev, newCustomer]);
        logActivity(ActionType.CREATED, `Müşteri oluşturuldu: ${newCustomer.name}`, 'customer', newCustomer.id);
        addToast("Müşteri başarıyla eklendi.", "success");
    };
    const updateCustomer = (customer: Customer) => {
        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
        logActivity(ActionType.UPDATED, `Müşteri güncellendi: ${customer.name}`, 'customer', customer.id);
        addToast("Müşteri başarıyla güncellendi.", "success");
    };
    const updateCustomerStatus = (customerId: number, newStatus: Customer['status']) => {
        setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status: newStatus } : c));
    };
    const assignCustomersToEmployee = (customerIds: number[], employeeId: number) => {
        setCustomers(prev =>
            prev.map(c =>
                customerIds.includes(c.id) ? { ...c, assignedToId: employeeId } : c
            )
        );
        const employee = employees.find(e => e.id === employeeId);
        logActivity(ActionType.UPDATED, `${customerIds.length} müşteri ${employee?.name || ''} adlı kullanıcıya atandı.`);
        addToast(`${customerIds.length} müşteri başarıyla atandı.`, 'success');
    };
    const addTagsToCustomers = (customerIds: number[], tags: string[]) => {
         setCustomers(prev =>
            prev.map(c => {
                if (customerIds.includes(c.id)) {
                    const newTags = [...new Set([...c.tags, ...tags])];
                    return { ...c, tags: newTags };
                }
                return c;
            })
        );
        logActivity(ActionType.UPDATED, `${customerIds.length} müşteriye etiket eklendi: ${tags.join(', ')}`);
        addToast(`${customerIds.length} müşteriye etiket eklendi.`, 'success');
    };
    const deleteCustomer = (id: number) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        addToast("Customer deleted", "success");
    };
    const deleteMultipleCustomers = (ids: number[]) => {
        setCustomers(prev => prev.filter(c => !ids.includes(c.id)));
        logActivity(ActionType.DELETED, `${ids.length} müşteri silindi.`);
        addToast(`${ids.length} müşteri başarıyla silindi.`, "success");
    };
    const importCustomers = (customersData: Omit<Customer, 'id' | 'avatar'>[]) => {
        const newCustomersWithIds: Customer[] = customersData.map((cust, index) => ({
            ...cust,
            id: Date.now() + index,
            avatar: `https://i.pravatar.cc/150?u=${Date.now() + index}`,
        }));
        setCustomers(prev => [...prev, ...newCustomersWithIds]);
        logActivity(ActionType.CREATED, `${customersData.length} müşteri içeri aktarıldı.`);
        addToast(`${customersData.length} müşteri başarıyla içeri aktarıldı.`, 'success');
    };
    const addContact = (contactData: Omit<Contact, 'id'>) => {
        const newContact: Contact = {
            ...contactData,
            id: Date.now(),
        };
        setContacts(prev => [...prev, newContact]);
        logActivity(ActionType.CREATED, `Yeni kişi eklendi: ${newContact.name}`, 'customer', newContact.customerId);
        addToast("Kişi başarıyla eklendi.", "success");
    };

    const updateContact = (contact: Contact) => {
        setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
        logActivity(ActionType.UPDATED, `Kişi güncellendi: ${contact.name}`, 'customer', contact.customerId);
        addToast("Kişi başarıyla güncellendi.", "success");
    };

    const deleteContact = (contactId: number) => {
        const contactToDelete = contacts.find(c => c.id === contactId);
        if (contactToDelete) {
            setContacts(prev => prev.filter(c => c.id !== contactId));
            logActivity(ActionType.DELETED, `Kişi silindi: ${contactToDelete.name}`, 'customer', contactToDelete.customerId);
            addToast("Kişi başarıyla silindi.", "success");
        }
    };
    const addDeal = (dealData: Omit<Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'>) => {
        addToast("Not implemented", "info");
    };
    const updateDeal = (deal: Deal) => {
        setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
        addToast("Deal updated", "success");
    };
    const updateDealStage = (dealId: number, newStage: DealStage) => {
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
    };
    const updateDealWinLossReason = (dealId: number, stage: DealStage.Won | DealStage.Lost, reason: string) => {
        addToast("Not implemented", "info");
    };
    const deleteDeal = (id: number) => {
        addToast("Not implemented", "info");
    };
    const addProject = (projectData: Omit<Project, 'id' | 'client'>) => {
        const customer = customers.find(c => c.id === projectData.customerId);
        if (!customer) {
            addToast("Müşteri bulunamadı.", "error");
            return;
        }
        const newProject: Project = {
            ...projectData,
            id: Date.now(),
            client: customer.name,
        };
        setProjects(prev => [...prev, newProject]);
        logActivity(ActionType.PROJECT_CREATED, `Proje oluşturuldu: ${newProject.name}`, 'project', newProject.id);
        addToast("Proje başarıyla oluşturuldu.", "success");
    };
    const updateProject = (project: Project) => {
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        logActivity(ActionType.PROJECT_UPDATED, `Proje güncellendi: ${project.name}`, 'project', project.id);
        addToast("Proje başarıyla güncellendi.", "success");
    };
    const deleteProject = (id: number) => {
        const projectToDelete = projects.find(p => p.id === id);
        if (projectToDelete) {
            setProjects(prev => prev.filter(p => p.id !== id));
            logActivity(ActionType.PROJECT_DELETED, `Proje silindi: ${projectToDelete.name}`, 'project', id);
            addToast("Proje başarıyla silindi.", "success");
        }
    };
    
    const updateTask = useCallback((task: Task, options?: { silent?: boolean }) => {
        const assignedTo = employees.find(e => e.id === task.assignedToId);
        let relatedEntityName = '';
        if (task.relatedEntityType === 'customer') {
            relatedEntityName = customers.find(c => c.id === task.relatedEntityId)?.name || '';
        } else if (task.relatedEntityType === 'project') {
            relatedEntityName = projects.find(p => p.id === task.relatedEntityId)?.name || '';
        } else if (task.relatedEntityType === 'deal') {
            relatedEntityName = deals.find(d => d.id === task.relatedEntityId)?.title || '';
        }

        const updatedTask = {
            ...task,
            assignedToName: assignedTo?.name || 'Atanmamış',
            relatedEntityName: relatedEntityName || task.relatedEntityName,
        };

        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        if (options?.silent !== true) {
            logActivity(ActionType.TASK_UPDATED, `Görev güncellendi: ${updatedTask.title}`, 'task', updatedTask.id);
            addToast("Görev başarıyla güncellendi.", "success");
        }
    }, [employees, customers, projects, deals, logActivity, addToast]);
    
    const updateRecurringTask = useCallback((task: Task, updateData: Partial<Task>, scope: 'this' | 'all', options?: { silent?: boolean }) => {
        const parentId = task.seriesId || task.id;
        const parentTask = tasks.find(t => t.id === parentId);
        if (!parentTask || !parentTask.recurrenceRule) {
            updateTask({ ...task, ...updateData }, options);
            return;
        }

        if (scope === 'all') {
            const updatedParent = { ...parentTask, ...updateData, id: parentTask.id };
            delete (updatedParent as Partial<Task>).originalDate;
            delete (updatedParent as Partial<Task>).seriesId;
            setTasks(prev => prev.map(t => t.id === parentId ? updatedParent : t));
             if (options?.silent !== true) {
                addToast("Tüm tekrarlanan görev serisi güncellendi.", "success");
            }
        } else { // scope === 'this'
            const updatedParent = {
                ...parentTask,
                recurrenceExceptions: [...(parentTask.recurrenceExceptions || []), task.originalDate!],
            };
            
            const newDetachedTask: Task = {
                ...task,
                ...updateData,
                id: Date.now(),
                recurrenceRule: undefined,
                recurrenceExceptions: undefined,
                seriesId: undefined,
                originalDate: undefined,
            };

            setTasks(prev => [
                ...prev.map(t => t.id === parentId ? updatedParent : t),
                newDetachedTask
            ]);
            if (options?.silent !== true) {
                addToast("Tekrarlanan görevin bu örneği güncellendi ve seriden ayrıldı.", "success");
            }
        }
    }, [tasks, updateTask, addToast]);

    const deleteTask = useCallback((id: number) => {
        setTasks(currentTasks => {
            const taskToDelete = currentTasks.find(t => t.id === id);
            if (!taskToDelete) return currentTasks;

            const descendantIds = new Set<number>();
            const getDescendants = (parentId: number) => {
                const children = currentTasks.filter(t => t.parentId === parentId);
                for (const child of children) {
                    descendantIds.add(child.id);
                    getDescendants(child.id);
                }
            };

            descendantIds.add(id);
            getDescendants(id);

            // Remove the task and all its descendants
            let remainingTasks = currentTasks.filter(t => !descendantIds.has(t.id));
            
            // Remove dependencies on any deleted task
            remainingTasks = remainingTasks.map(t => {
                if (t.dependsOn && t.dependsOn.some(depId => descendantIds.has(depId))) {
                    return {
                        ...t,
                        dependsOn: t.dependsOn.filter(depId => !descendantIds.has(depId))
                    };
                }
                return t;
            });

            logActivity(ActionType.TASK_DELETED, `Görev silindi: ${taskToDelete.title}`, 'task', id);
            addToast("Görev ve alt görevleri başarıyla silindi.", "success");
            return remainingTasks;
        });
    }, [logActivity, addToast]);

    const deleteMultipleTasks = useCallback((taskIds: number[]) => {
        setTasks(currentTasks => {
            const tasksToDeleteWithDescendants = new Set<number>();
            const taskIdsQueue = [...taskIds];
            
            while(taskIdsQueue.length > 0) {
                const currentId = taskIdsQueue.shift()!;
                if (!tasksToDeleteWithDescendants.has(currentId)) {
                    tasksToDeleteWithDescendants.add(currentId);
                    const children = currentTasks.filter(t => t.parentId === currentId);
                    children.forEach(child => taskIdsQueue.push(child.id));
                }
            }
    
            let remainingTasks = currentTasks.filter(t => !tasksToDeleteWithDescendants.has(t.id));
    
            remainingTasks = remainingTasks.map(t => {
                if (t.dependsOn && t.dependsOn.some(depId => tasksToDeleteWithDescendants.has(depId))) {
                    return {
                        ...t,
                        dependsOn: t.dependsOn.filter(depId => !tasksToDeleteWithDescendants.has(depId))
                    };
                }
                return t;
            });
    
            logActivity(ActionType.TASK_DELETED_MULTIPLE, `${taskIds.length} görev silindi.`);
            addToast(`${taskIds.length} görev ve alt görevleri başarıyla silindi.`, "success");
            return remainingTasks;
        });
    }, [logActivity, addToast]);

    const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };
    
    const addSubtask = useCallback((parentId: number, title: string) => {
        const parentTask = tasks.find(t => t.id === parentId);
        if (!parentTask) {
            addToast("Ana görev bulunamadı.", "error");
            return;
        }

        const newSubtaskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'> = {
            title,
            description: '',
            status: TaskStatus.Todo,
            priority: parentTask.priority,
            dueDate: parentTask.dueDate,
            assignedToId: parentTask.assignedToId,
            parentId: parentTask.id,
        };
        
        const assignedTo = employees.find(e => e.id === newSubtaskData.assignedToId);

        const newSubtask: Task = {
            ...newSubtaskData,
            id: Date.now(),
            assignedToName: assignedTo?.name || 'Atanmamış',
        };

        setTasks(prev => [...prev, newSubtask]);
        logActivity(ActionType.TASK_CREATED, `Alt görev oluşturuldu: ${newSubtask.title}`, 'task', newSubtask.id);
        addToast("Alt görev eklendi.", "success");
    }, [tasks, employees, logActivity, addToast]);

    const addInvoice = useCallback((invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>) => {
        const customer = customers.find(c => c.id === invoiceData.customerId);
        if (!customer) {
            addToast("Müşteri bulunamadı.", "error");
            return;
        }

        const newInvoice: Invoice = {
            ...invoiceData,
            id: Date.now(),
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            customerName: customer.name,
        };

        setInvoices(prev => [newInvoice, ...prev]);
        logActivity(ActionType.CREATED, `Fatura oluşturuldu: ${newInvoice.invoiceNumber}`, 'invoice', newInvoice.id);
        addToast("Fatura başarıyla oluşturuldu.", "success");
    }, [customers, logActivity, addToast]);
    
    const updateInvoice = useCallback((invoice: Invoice) => {
        const customer = customers.find(c => c.id === invoice.customerId);
        if (!customer) {
            addToast("Müşteri bulunamadı.", "error");
            return;
        }
        
        const updatedInvoice = {
            ...invoice,
            customerName: customer.name,
        };

        setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
        logActivity(ActionType.UPDATED, `Fatura güncellendi: ${updatedInvoice.invoiceNumber}`, 'invoice', updatedInvoice.id);
        addToast("Fatura başarıyla güncellendi.", "success");
    }, [customers, logActivity, addToast]);
    
    const deleteInvoice = useCallback((id: number) => {
        const invoiceToDelete = invoices.find(inv => inv.id === id);
        if (invoiceToDelete) {
            setInvoices(prev => prev.filter(inv => inv.id !== id));
            logActivity(ActionType.DELETED, `Fatura silindi: ${invoiceToDelete.invoiceNumber}`, 'invoice', id);
            addToast("Fatura başarıyla silindi.", "success");
        }
    }, [invoices, logActivity, addToast]);

    const addBill = (bill: Omit<Bill, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateBill = (bill: Bill) => {
        addToast("Not implemented", "info");
    };
    const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateSupplier = (supplier: Supplier) => {
        addToast("Not implemented", "info");
    };
    const deleteSupplier = (id: number) => {
        addToast("Not implemented", "info");
    };
    const deletePurchaseOrder = (id: number) => {
        addToast("Not implemented", "info");
    };
    const addEmployee = (employeeData: Omit<Employee, 'id' | 'avatar' | 'employeeId'>) => {
        addToast("Not implemented", "info");
    };
    const updateEmployee = (employee: Employee) => {
        addToast("Not implemented", "info");
    };
    const deleteEmployee = (id: number) => {
        addToast("Not implemented", "info");
    };
    const addLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'employeeName' | 'status'>) => {
        addToast("Not implemented", "info");
    };
    const updateLeaveRequestStatus = (requestId: number, newStatus: LeaveStatus) => {
        addToast("Not implemented", "info");
    };
    const addBankAccount = (accountData: Omit<BankAccount, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateBankAccount = (account: BankAccount) => {
        addToast("Not implemented", "info");
    };
    const deleteBankAccount = (id: number) => {
        addToast("Not implemented", "info");
    };
    const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
        addToast("Not implemented", "info");
    };
    const updateTransaction = (transaction: Transaction) => {
        addToast("Not implemented", "info");
    };
    const deleteTransaction = (id: number) => {
        addToast("Not implemented", "info");
    };
    const addTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'>) => {
        addToast("Not implemented", "info");
    };
    const updateTicket = (ticket: SupportTicket) => { addToast("Not implemented", "info"); };
    const deleteTicket = (id: number) => { addToast("Not implemented", "info"); };
    const addDocument = (docData: Omit<Document, 'id' | 'uploadedByName'>) => { addToast("Not implemented", "info"); };
    const renameDocument = (docId: number, newName: string) => { addToast("Not implemented", "info"); };
    const deleteDocument = (id: number) => { addToast("Not implemented", "info"); };
    const deleteMultipleDocuments = (ids: number[]) => { addToast("Not implemented", "info"); };
    const addFolder = (folderName: string, parentId: number | null) => { addToast("Not implemented", "info"); };
    const moveDocuments = (docIds: number[], targetFolderId: number | null) => { addToast("Not implemented", "info"); };
    const toggleDocumentStar = (docId: number) => { addToast("Not implemented", "info"); };
    const shareDocument = (docId: number, shares: DocumentShare[]) => { addToast("Not implemented", "info"); };
    
    const addComment = useCallback((text: string, entityType: 'customer' | 'project' | 'deal' | 'task', entityId: number) => {
        const newComment: Comment = {
            id: Date.now(),
            text,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            relatedEntityType: entityType,
            relatedEntityId: entityId,
        };
        setComments(prev => [newComment, ...prev]);
        logActivity(ActionType.COMMENT_ADDED, `Yorum eklendi`, entityType, entityId);
        addToast("Yorum eklendi.", "success");
    }, [currentUser, logActivity, addToast]);

    const updateComment = useCallback((comment: Comment) => {
        setComments(prev => prev.map(c => c.id === comment.id ? { ...c, ...comment, timestamp: new Date().toISOString() } : c));
        logActivity(ActionType.UPDATED, `Yorum güncellendi`, comment.relatedEntityType, comment.relatedEntityId);
        addToast("Yorum güncellendi.", "success");
    }, [logActivity, addToast]);

    const deleteComment = useCallback((commentId: number) => {
        const commentToDelete = comments.find(c => c.id === commentId);
        if (commentToDelete) {
            setComments(prev => prev.filter(c => c.id !== commentId));
            logActivity(ActionType.DELETED, `Yorum silindi`, commentToDelete.relatedEntityType, commentToDelete.relatedEntityId);
            addToast("Yorum silindi.", "success");
        }
    }, [comments, logActivity, addToast]);
    
    const addCommunicationLog = useCallback((customerId: number, type: CommunicationLogType, content: string) => {
        const newLog: CommunicationLog = {
            id: Date.now(),
            customerId,
            type,
            content,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
        };
        setCommunicationLogs(prev => [newLog, ...prev]);
        logActivity(ActionType.COMMENT_ADDED, `İletişim kaydı eklendi: ${type}`, 'customer', customerId);
        addToast("İletişim kaydı eklendi.", "success");
    }, [currentUser, logActivity, addToast]);

    const updateCommunicationLog = useCallback((log: CommunicationLog) => {
        setCommunicationLogs(prev => prev.map(l => l.id === log.id ? log : l));
        logActivity(ActionType.UPDATED, `İletişim kaydı güncellendi`, 'customer', log.customerId);
        addToast("İletişim kaydı güncellendi.", "success");
    }, [logActivity, addToast]);

    const deleteCommunicationLog = useCallback((logId: number) => {
        const logToDelete = communicationLogs.find(l => l.id === logId);
        if (logToDelete) {
            setCommunicationLogs(prev => prev.filter(l => l.id !== logId));
            logActivity(ActionType.DELETED, `İletişim kaydı silindi`, 'customer', logToDelete.customerId);
            addToast("İletişim kaydı silindi.", "success");
        }
    }, [communicationLogs, logActivity, addToast]);

    const addSalesActivity = (activityData: Omit<SalesActivity, 'id' | 'userName' | 'userAvatar' | 'timestamp'>) => { addToast("Not implemented", "info"); };
    const addPerformanceReview = (reviewData: Omit<PerformanceReview, 'id' | 'employeeName' | 'reviewerName'>) => { addToast("Not implemented", "info"); };
    const updatePerformanceReview = (review: PerformanceReview) => { addToast("Not implemented", "info"); };
    const addJobOpening = (jobData: Omit<JobOpening, 'id'>) => { addToast("Not implemented", "info"); };
    const updateJobOpening = (job: JobOpening) => { addToast("Not implemented", "info"); };
    const addCandidate = (candidateData: Omit<Candidate, 'id'>) => { addToast("Not implemented", "info"); };
    const updateCandidate = (candidate: Candidate) => { addToast("Not implemented", "info"); };
    const updateCandidateStage = (candidateId: number, newStage: CandidateStage) => { addToast("Not implemented", "info"); };
    const addOnboardingTemplate = (templateData: Omit<OnboardingTemplate, 'id'>) => { addToast("Not implemented", "info"); };
    const updateOnboardingTemplate = (template: OnboardingTemplate) => { addToast("Not implemented", "info"); };
    const startOnboardingWorkflow = (data: { employeeId: number, templateId: number }) => { addToast("Not implemented", "info"); };
    const updateOnboardingWorkflowStatus = (workflowId: number, itemIndex: number, isCompleted: boolean) => { addToast("Not implemented", "info"); };
    const updatePayrollRunStatus = (runId: number, status: PayrollRun['status'], journalEntryId?: number) => { addToast("Not implemented", "info"); };
    const postPayrollRunToJournal = (runId: number) => { addToast("Not implemented", "info"); };
    const calculateTerminationPayments = (employeeId: number, terminationDate: string, additionalGrossPay: number, additionalBonuses: number, usedAnnualLeave: number) => { return null; };
    const calculatePayrollCost = (grossSalary: number) => { return {} as PayrollSimulationResult; };
    const updateCompanyInfo = (info: CompanyInfo) => { addToast("Not implemented", "info"); };
    const updateBrandingSettings = (settings: BrandingSettings) => { addToast("Not implemented", "info"); };
    const updateSecuritySettings = (settings: SecuritySettings) => { addToast("Not implemented", "info"); };
    const addRole = (roleData: Omit<Role, 'id' | 'isSystemRole'>, cloneFromRoleId?: string) => { addToast("Not implemented", "info"); };
    const updateRolePermissions = (roleId: string, permissions: Permission[]) => { addToast("Not implemented", "info"); };
    const deleteRole = (roleId: string) => { addToast("Not implemented", "info"); };
    const addCustomField = (fieldData: Omit<CustomFieldDefinition, 'id'>) => { addToast("Not implemented", "info"); };
    const updateCustomField = (field: CustomFieldDefinition) => { addToast("Not implemented", "info"); };
    const deleteCustomField = (id: number) => { addToast("Not implemented", "info"); };
    const markNotificationAsRead = (id: number) => { addToast("Not implemented", "info"); };
    const clearAllNotifications = () => { addToast("Not implemented", "info"); };
    
    const createProjectFromDeal = useCallback((deal: Deal) => {
        const customer = customers.find(c => c.id === deal.customerId);
        if (!customer) {
            addToast("Müşteri bulunamadı.", "error");
            return;
        }

        // Estimate a deadline 3 months from now
        const deadline = new Date();
        deadline.setMonth(deadline.getMonth() + 3);

        const newProject: Project = {
            id: Date.now(),
            name: `Proje: ${deal.title}`,
            customerId: deal.customerId,
            client: customer.name,
            startDate: new Date().toISOString().split('T')[0],
            deadline: deadline.toISOString().split('T')[0],
            status: 'beklemede',
            progress: 0,
            description: `Bu proje '${deal.title}' anlaşmasından oluşturuldu.`,
            teamMemberIds: [deal.assignedToId],
            budget: deal.value,
            spent: 0,
            tags: ['otomatik-oluşturuldu'],
        };

        setProjects(prev => [...prev, newProject]);
        logActivity(ActionType.PROJECT_CREATED, `Proje '${deal.title}' anlaşmasından oluşturuldu`, 'project', newProject.id);
        addToast(`'${newProject.name}' projesi başarıyla oluşturuldu.`, "success");
    }, [customers, logActivity, addToast]);

    const createTasksFromDeal = useCallback((deal: Deal) => {
        // Use the "New Customer Onboarding" template (ID: 1)
        createTasksFromTemplate(1, new Date().toISOString().split('T')[0], 'customer', deal.customerId);
        logActivity(ActionType.TASK_CREATED, `'${deal.title}' anlaşması için başlangıç görevleri oluşturuldu`, 'deal', deal.id);
    }, [createTasksFromTemplate, logActivity]);
    
    const value = {
        customers,
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
        dashboardLayout,
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
        addScheduledTask,
        updateScheduledTask,
        deleteScheduledTask,
        runScheduledTasksCheck,
        addTaskTemplate,
        updateTaskTemplate,
        deleteTaskTemplate,
        warehouses,
        stockMovements,
        inventoryTransfers,
        inventoryAdjustments,
        salesOrders,
        shipments,
        stockItems,
        pickLists,
        getProductStockInfo,
        getProductStockByWarehouse,
        getCustomerHealthScore,
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
        accounts,
        journalEntries,
        recurringJournalEntries,
        budgets,
        costCenters,
        accountingLockDate,
        updateAccountingLockDate,
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
        setDashboardLayout,
        addWidgetToDashboard,
        removeWidgetFromDashboard,
        currentUser,
        setCurrentUser,
        hasPermission,
        addSavedView,
        deleteSavedView,
        loadSavedView,
        addCustomer,
        updateCustomer,
        updateCustomerStatus,
        assignCustomersToEmployee,
        addTagsToCustomers,
        deleteCustomer,
        deleteMultipleCustomers,
        importCustomers,
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
        deleteInvoice,
        addBill,
        updateBill,
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
        updatePayslip,
        calculateTerminationPayments,
        calculatePayrollCost,
        updateCompanyInfo,
        updateBrandingSettings,
        updateSecuritySettings,
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
        logActivity
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

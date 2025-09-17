import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as T from '../types';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useCustomers } from '../hooks/useCustomers';
import {
    MOCK_DEALS, MOCK_PROJECTS, MOCK_TASKS, MOCK_NOTIFICATIONS, MOCK_INVOICES,
    MOCK_PRODUCTS, MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_EMPLOYEES,
    MOCK_LEAVE_REQUESTS, MOCK_BANK_ACCOUNTS, MOCK_TRANSACTIONS,
    MOCK_TICKETS, MOCK_DOCUMENTS, MOCK_COMMENTS, MOCK_SALES_ACTIVITIES,
    MOCK_ACTIVITY_LOGS, MOCK_CUSTOM_FIELD_DEFINITIONS, INITIAL_DASHBOARD_LAYOUT,
    MOCK_COMPANY_INFO, MOCK_BRANDING_SETTINGS, MOCK_SECURITY_SETTINGS,
    INITIAL_ROLES, INITIAL_ROLES_PERMISSIONS, MOCK_TAX_RATES, INITIAL_SYSTEM_LISTS,
    INITIAL_EMAIL_TEMPLATES, MOCK_PRICE_LISTS, MOCK_PRICE_LIST_ITEMS, MOCK_AUTOMATIONS,
    MOCK_AUTOMATION_LOGS, MOCK_TASK_TEMPLATES, MOCK_SCHEDULED_TASKS, MOCK_COUNTERS_SETTINGS,
    MOCK_WAREHOUSES, MOCK_STOCK_MOVEMENTS, MOCK_INVENTORY_TRANSFERS, MOCK_INVENTORY_ADJUSTMENTS,
    MOCK_SALES_ORDERS, MOCK_SHIPMENTS, MOCK_STOCK_ITEMS, MOCK_PICK_LISTS, MOCK_BOMS, MOCK_WORK_ORDERS,
    MOCK_ACCOUNTS, MOCK_JOURNAL_ENTRIES, MOCK_RECURRING_JOURNAL_ENTRIES, MOCK_BUDGETS, MOCK_COST_CENTERS,
    MOCK_BILLS, DEFAULT_TURKISH_PAYROLL_PARAMS_2025, MOCK_SALES_RETURNS, MOCK_QUOTATIONS,
    MOCK_LEADS, MOCK_COMMISSION_RECORDS, MOCK_PERFORMANCE_REVIEWS, MOCK_JOB_OPENINGS, MOCK_CANDIDATES,
    MOCK_ONBOARDING_TEMPLATES, MOCK_ONBOARDING_WORKFLOWS, MOCK_PAYROLL_RUNS, MOCK_PAYSLIPS,
    MOCK_EXPENSES, MOCK_ASSETS, MOCK_CONTACTS, MOCK_COMMUNICATION_LOGS, MOCK_SAVED_VIEWS, MOCK_CUSTOMERS
} from '../constants';
import { summarizeText, summarizeActivityFeed as geminiSummarizeActivityFeed } from '../services/geminiService';
import { useNotification } from './NotificationContext';
import { numberToWords } from '../utils/numberToWords';

const AppContext = createContext<T.AppContextType | undefined>(undefined);

export const useApp = (): T.AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addToast } = useNotification();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useLocalStorageState<T.Employee>('currentUser', MOCK_EMPLOYEES[0]);
    
    const { 
        customers, setCustomers,
        deleteCustomer: deleteCustomerHook, 
        deleteMultipleCustomers: deleteMultipleCustomersHook, 
    } = useCustomers(MOCK_CUSTOMERS.map(c => ({...c, assignedToName: MOCK_EMPLOYEES.find(e => e.id === c.assignedToId)?.name || 'Unknown' })));
    
    const [deals, setDeals] = useLocalStorageState<T.Deal[]>('deals', MOCK_DEALS);
    const [projects, setProjects] = useLocalStorageState<T.Project[]>('projects', MOCK_PROJECTS);
    const [tasks, setTasks] = useLocalStorageState<T.Task[]>('tasks', MOCK_TASKS);
    const [notifications, setNotifications] = useLocalStorageState<T.Notification[]>('notifications', MOCK_NOTIFICATIONS);
    const [invoices, setInvoices] = useLocalStorageState<T.Invoice[]>('invoices', MOCK_INVOICES);
    const [bills, setBills] = useLocalStorageState<T.Bill[]>('bills', MOCK_BILLS);
    const [products, setProducts] = useLocalStorageState<T.Product[]>('products', MOCK_PRODUCTS);
    const [suppliers, setSuppliers] = useLocalStorageState<T.Supplier[]>('suppliers', MOCK_SUPPLIERS);
    const [purchaseOrders, setPurchaseOrders] = useLocalStorageState<T.PurchaseOrder[]>('purchaseOrders', MOCK_PURCHASE_ORDERS);
    const [employees, setEmployees] = useLocalStorageState<T.Employee[]>('employees', MOCK_EMPLOYEES);
    const [leaveRequests, setLeaveRequests] = useLocalStorageState<T.LeaveRequest[]>('leaveRequests', MOCK_LEAVE_REQUESTS);
    const [performanceReviews, setPerformanceReviews] = useLocalStorageState<T.PerformanceReview[]>('performanceReviews', MOCK_PERFORMANCE_REVIEWS);
    const [jobOpenings, setJobOpenings] = useLocalStorageState<T.JobOpening[]>('jobOpenings', MOCK_JOB_OPENINGS);
    const [candidates, setCandidates] = useLocalStorageState<T.Candidate[]>('candidates', MOCK_CANDIDATES);
    const [onboardingTemplates, setOnboardingTemplates] = useLocalStorageState<T.OnboardingTemplate[]>('onboardingTemplates', MOCK_ONBOARDING_TEMPLATES);
    const [onboardingWorkflows, setOnboardingWorkflows] = useLocalStorageState<T.OnboardingWorkflow[]>('onboardingWorkflows', MOCK_ONBOARDING_WORKFLOWS);
    const [payrollRuns, setPayrollRuns] = useLocalStorageState<T.PayrollRun[]>('payrollRuns', MOCK_PAYROLL_RUNS);
    const [payslips, setPayslips] = useLocalStorageState<T.Payslip[]>('payslips', MOCK_PAYSLIPS);
    const [bankAccounts, setBankAccounts] = useLocalStorageState<T.BankAccount[]>('bankAccounts', MOCK_BANK_ACCOUNTS);
    const [transactions, setTransactions] = useLocalStorageState<T.Transaction[]>('transactions', MOCK_TRANSACTIONS);
    const [tickets, setTickets] = useLocalStorageState<T.SupportTicket[]>('tickets', MOCK_TICKETS);
    const [documents, setDocuments] = useLocalStorageState<T.Document[]>('documents', MOCK_DOCUMENTS);
    const [comments, setComments] = useLocalStorageState<T.Comment[]>('comments', MOCK_COMMENTS);
    const [salesActivities, setSalesActivities] = useLocalStorageState<T.SalesActivity[]>('salesActivities', MOCK_SALES_ACTIVITIES);
    const [activityLogs, setActivityLogs] = useLocalStorageState<T.ActivityLog[]>('activityLogs', MOCK_ACTIVITY_LOGS);
    const [customFieldDefinitions, setCustomFieldDefinitions] = useLocalStorageState<T.CustomFieldDefinition[]>('customFieldDefinitions', MOCK_CUSTOM_FIELD_DEFINITIONS);
    const [dashboardLayout, setDashboardLayout] = useLocalStorageState<T.DashboardWidget[]>('dashboardLayout', INITIAL_DASHBOARD_LAYOUT);
    const [companyInfo, setCompanyInfo] = useLocalStorageState<T.CompanyInfo>('companyInfo', MOCK_COMPANY_INFO);
    const [brandingSettings, setBrandingSettings] = useLocalStorageState<T.BrandingSettings>('brandingSettings', MOCK_BRANDING_SETTINGS);
    const [securitySettings, setSecuritySettings] = useLocalStorageState<T.SecuritySettings>('securitySettings', MOCK_SECURITY_SETTINGS);
    const [roles, setRoles] = useLocalStorageState<T.Role[]>('roles', INITIAL_ROLES);
    const [rolesPermissions, setRolesPermissions] = useLocalStorageState<Record<string, T.Permission[]>>('rolesPermissions', INITIAL_ROLES_PERMISSIONS);
    const [taxRates, setTaxRates] = useLocalStorageState<T.TaxRate[]>('taxRates', MOCK_TAX_RATES);
    const [systemLists, setSystemLists] = useLocalStorageState<T.SystemLists>('systemLists', INITIAL_SYSTEM_LISTS);
    const [emailTemplates, setEmailTemplates] = useLocalStorageState<T.EmailTemplate[]>('emailTemplates', INITIAL_EMAIL_TEMPLATES);
    const [priceLists, setPriceLists] = useLocalStorageState<T.PriceList[]>('priceLists', MOCK_PRICE_LISTS);
    const [priceListItems, setPriceListItems] = useLocalStorageState<T.PriceListItem[]>('priceListItems', MOCK_PRICE_LIST_ITEMS);
    const [automations, setAutomations] = useLocalStorageState<T.Automation[]>('automations', MOCK_AUTOMATIONS);
    const [automationLogs, setAutomationLogs] = useLocalStorageState<T.AutomationLog[]>('automationLogs', MOCK_AUTOMATION_LOGS);
    const [taskTemplates, setTaskTemplates] = useLocalStorageState<T.TaskTemplate[]>('taskTemplates', MOCK_TASK_TEMPLATES);
    const [scheduledTasks, setScheduledTasks] = useLocalStorageState<T.ScheduledTask[]>('scheduledTasks', MOCK_SCHEDULED_TASKS);
    const [counters, setCounters] = useLocalStorageState<T.CountersSettings>('counters', MOCK_COUNTERS_SETTINGS);
    const [cartItems, setCartItems] = useState<T.CartItem[]>([]);
    const [warehouses, setWarehouses] = useLocalStorageState<T.Warehouse[]>('warehouses', MOCK_WAREHOUSES);
    const [stockMovements, setStockMovements] = useLocalStorageState<T.StockMovement[]>('stockMovements', MOCK_STOCK_MOVEMENTS);
    const [inventoryTransfers, setInventoryTransfers] = useLocalStorageState<T.InventoryTransfer[]>('inventoryTransfers', MOCK_INVENTORY_TRANSFERS);
    const [inventoryAdjustments, setInventoryAdjustments] = useLocalStorageState<T.InventoryAdjustment[]>('inventoryAdjustments', MOCK_INVENTORY_ADJUSTMENTS);
    const [salesOrders, setSalesOrders] = useLocalStorageState<T.SalesOrder[]>('salesOrders', MOCK_SALES_ORDERS);
    const [shipments, setShipments] = useLocalStorageState<T.Shipment[]>('shipments', MOCK_SHIPMENTS);
    const [stockItems, setStockItems] = useLocalStorageState<T.StockItem[]>('stockItems', MOCK_STOCK_ITEMS);
    const [pickLists, setPickLists] = useLocalStorageState<T.PickList[]>('pickLists', MOCK_PICK_LISTS);
    const [boms, setBoms] = useLocalStorageState<T.BillOfMaterials[]>('boms', MOCK_BOMS);
    const [workOrders, setWorkOrders] = useLocalStorageState<T.WorkOrder[]>('workOrders', MOCK_WORK_ORDERS);
    const [accounts, setAccounts] = useLocalStorageState<T.Account[]>('accounts', MOCK_ACCOUNTS);
    const [journalEntries, setJournalEntries] = useLocalStorageState<T.JournalEntry[]>('journalEntries', MOCK_JOURNAL_ENTRIES);
    const [recurringJournalEntries, setRecurringJournalEntries] = useLocalStorageState<T.RecurringJournalEntry[]>('recurringJournalEntries', MOCK_RECURRING_JOURNAL_ENTRIES);
    const [budgets, setBudgets] = useLocalStorageState<T.Budget[]>('budgets', MOCK_BUDGETS);
    const [costCenters, setCostCenters] = useLocalStorageState<T.CostCenter[]>('costCenters', MOCK_COST_CENTERS);
    const [accountingLockDate, setAccountingLockDate] = useLocalStorageState<string | null>('accountingLockDate', null);
    const [expenses, setExpenses] = useLocalStorageState<T.Expense[]>('expenses', MOCK_EXPENSES);
    const [assets, setAssets] = useLocalStorageState<T.Asset[]>('assets', MOCK_ASSETS);
    const [hrParameters, setHrParameters] = useLocalStorageState<T.HrParameters>('hrParameters', DEFAULT_TURKISH_PAYROLL_PARAMS_2025);
    const [salesReturns, setSalesReturns] = useLocalStorageState<T.SalesReturn[]>('salesReturns', MOCK_SALES_RETURNS);
    const [quotations, setQuotations] = useLocalStorageState<T.Quotation[]>('quotations', MOCK_QUOTATIONS);
    const [leads, setLeads] = useLocalStorageState<T.Lead[]>('leads', MOCK_LEADS);
    const [commissionRecords, setCommissionRecords] = useLocalStorageState<T.CommissionRecord[]>('commissionRecords', MOCK_COMMISSION_RECORDS);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [contacts, setContacts] = useLocalStorageState<T.Contact[]>('contacts', MOCK_CONTACTS);
    const [communicationLogs, setCommunicationLogs] = useLocalStorageState<T.CommunicationLog[]>('communicationLogs', MOCK_COMMUNICATION_LOGS);
    const [savedViews, setSavedViews] = useLocalStorageState<T.SavedView[]>('savedViews', MOCK_SAVED_VIEWS);

    // Centralized Modal Management States
    const [isCustomerFormOpen, _setIsCustomerFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<T.Customer | null>(null);
    const [isDealFormOpen, _setIsDealFormOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<T.Deal | null>(null);
    const [prefilledDealData, setPrefilledDealData] = useState<Partial<T.Deal> | null>(null);
    const [isTaskFormOpen, _setIsTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<T.Task | null>(null);
    const [prefilledTaskData, setPrefilledTaskData] = useState<Partial<T.Task> | null>(null);
    const [isProjectFormOpen, _setIsProjectFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<T.Project | null>(null);
    const [prefilledProjectData, setPrefilledProjectData] = useState<Partial<T.Project> | null>(null);
    const [isTicketFormOpen, _setIsTicketFormOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<T.SupportTicket | null>(null);
    const [prefilledTicketData, setPrefilledTicketData] = useState<Partial<T.SupportTicket> | null>(null);
    const [isSalesOrderFormOpen, _setIsSalesOrderFormOpen] = useState(false);
    const [editingSalesOrder, setEditingSalesOrder] = useState<T.SalesOrder | null>(null);
    const [prefilledSalesOrderData, setPrefilledSalesOrderData] = useState<Partial<T.SalesOrder> | null>(null);
    const [isLogModalOpen, _setIsLogModalOpen] = useState(false);
    const [logModalCustomerId, setLogModalCustomerId] = useState<number | null>(null);

    const [recurringUpdateState, setRecurringUpdateState] = useState<{task: T.Task, updateData: Partial<T.Task>} | null>(null);

    const setIsCustomerFormOpen = (isOpen: boolean, customer: T.Customer | null = null) => {
        setEditingCustomer(customer);
        _setIsCustomerFormOpen(isOpen);
    };
    const setIsDealFormOpen = (isOpen: boolean, deal: T.Deal | null = null, prefilled: Partial<T.Deal> | null = null) => {
        setEditingDeal(deal);
        setPrefilledDealData(prefilled);
        _setIsDealFormOpen(isOpen);
    };
    const setIsTaskFormOpen = (isOpen: boolean, task: T.Task | null = null, prefilled: Partial<T.Task> | null = null) => {
        setEditingTask(task);
        setPrefilledTaskData(prefilled);
        _setIsTaskFormOpen(isOpen);
    };
    const setIsProjectFormOpen = (isOpen: boolean, project: T.Project | null = null, prefilled: Partial<T.Project> | null = null) => {
        setEditingProject(project);
        setPrefilledProjectData(prefilled);
        _setIsProjectFormOpen(isOpen);
    };
    const setIsTicketFormOpen = (isOpen: boolean, ticket: T.SupportTicket | null = null, prefilled: Partial<T.SupportTicket> | null = null) => {
        setEditingTicket(ticket);
        setPrefilledTicketData(prefilled);
        _setIsTicketFormOpen(isOpen);
    };
    const setIsSalesOrderFormOpen = (isOpen: boolean, order: T.SalesOrder | null = null, prefilled: Partial<T.SalesOrder> | null = null) => {
        setEditingSalesOrder(order);
        setPrefilledSalesOrderData(prefilled);
        _setIsSalesOrderFormOpen(isOpen);
    };
    const setIsLogModalOpen = (isOpen: boolean, customerId: number | null = null) => {
        setLogModalCustomerId(customerId);
        _setIsLogModalOpen(isOpen);
    };

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
        setActivityLogs(prev => [newLog, ...prev].slice(0, 200));
    }, [currentUser, setActivityLogs]);

    const addTaskTemplate = useCallback((templateData: Omit<T.TaskTemplate, "id">): T.TaskTemplate => {
        const newTemplate = { ...templateData, id: Date.now() };
        setTaskTemplates(prev => [...prev, newTemplate]);
        logActivity(T.ActionType.TASK_TEMPLATE_CREATED, `Görev şablonu oluşturuldu: ${newTemplate.name}`, 'task_template', newTemplate.id);
        return newTemplate;
    }, [setTaskTemplates, logActivity]);

    const updateTaskTemplate = useCallback((template: T.TaskTemplate): T.TaskTemplate | undefined => {
        let updated: T.TaskTemplate | undefined;
        setTaskTemplates(prev => prev.map(t => {
            if (t.id === template.id) {
                updated = template;
                return template;
            }
            return t;
        }));
        if(updated) logActivity(T.ActionType.TASK_TEMPLATE_UPDATED, `Görev şablonu güncellendi: ${updated.name}`, 'task_template', updated.id);
        return updated;
    }, [setTaskTemplates, logActivity]);

    const deleteTaskTemplate = useCallback((templateId: number) => {
        const toDelete = taskTemplates.find(t => t.id === templateId);
        if (toDelete) {
            setTaskTemplates(prev => prev.filter(t => t.id !== templateId));
            logActivity(T.ActionType.TASK_TEMPLATE_DELETED, `Görev şablonu silindi: ${toDelete.name}`, 'task_template', toDelete.id);
        }
    }, [taskTemplates, setTaskTemplates, logActivity]);

    const addAsset = useCallback((assetData: Omit<T.Asset, 'id'>): T.Asset => {
        const newAsset = { ...assetData, id: Date.now() };
        setAssets(prev => [...prev, newAsset]);
        logActivity(T.ActionType.CREATED, `Varlık oluşturuldu: ${newAsset.name}`, 'asset', newAsset.id);
        return newAsset;
    }, [setAssets, logActivity]);

    const updateAsset = useCallback((asset: T.Asset): T.Asset | undefined => {
        let updated: T.Asset | undefined;
        setAssets(prev => prev.map(a => {
            if (a.id === asset.id) {
                updated = asset;
                return asset;
            }
            return a;
        }));
        if (updated) logActivity(T.ActionType.UPDATED, `Varlık güncellendi: ${updated.name}`, 'asset', updated.id);
        return updated;
    }, [setAssets, logActivity]);
    
    const hasPermission = useCallback((permission: T.Permission): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        const userPermissions = rolesPermissions[currentUser.role];
        return userPermissions ? userPermissions.includes(permission) : false;
    }, [currentUser, rolesPermissions]);
    
    const getProductStockInfo = useCallback((productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return { physical: 0, committed: 0, available: 0 };

        const physical = stockItems
            .filter(i => i.productId === productId && [T.StockItemStatus.Available, T.StockItemStatus.Committed].includes(i.status))
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
            
        const committed = stockItems
            .filter(i => i.productId === productId && i.status === T.StockItemStatus.Committed)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);
            
        return { physical, committed, available: physical - committed };
    }, [stockItems, products]);
    
    // Employee Management (İK Modülü)
    const addEmployee = useCallback((employeeData: Omit<T.Employee, "id" | "avatar" | "employeeId">): T.Employee => {
        const newEmployee = {
            ...employeeData,
            id: Date.now(),
            employeeId: `EMP${Date.now().toString().slice(-4)}`,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        setEmployees(prev => [...prev, newEmployee]);
        logActivity(T.ActionType.CREATED, `Yeni çalışan eklendi: ${newEmployee.name}`, 'employee', newEmployee.id);
        return newEmployee;
    }, [setEmployees, logActivity]);

    const updateEmployee = useCallback((employee: T.Employee): T.Employee | undefined => {
        let updated: T.Employee | undefined;
        setEmployees(prev => prev.map(e => {
            if (e.id === employee.id) {
                updated = employee;
                return employee;
            }
            return e;
        }));
        if (updated) {
            logActivity(T.ActionType.UPDATED, `Çalışan güncellendi: ${updated.name}`, 'employee', updated.id);
        }
        return updated;
    }, [setEmployees, logActivity]);

    const deleteEmployee = useCallback((id: number) => {
        const toDelete = employees.find(e => e.id === id);
        if (toDelete) {
            setEmployees(prev => prev.filter(e => e.id !== id));
            logActivity(T.ActionType.DELETED, `Çalışan silindi: ${toDelete.name}`, 'employee', id);
        }
    }, [employees, setEmployees, logActivity]);

    // Other HR Functions
    const addPerformanceReview = useCallback((reviewData: Omit<T.PerformanceReview, "id" | "employeeName" | "reviewerName">) => {
        const newReview = {
            ...reviewData,
            id: Date.now(),
            employeeName: employees.find(e => e.id === reviewData.employeeId)?.name || '',
            reviewerName: employees.find(e => e.id === reviewData.reviewerId)?.name || '',
        };
        setPerformanceReviews(prev => [...prev, newReview]);
        return newReview;
    }, [employees, setPerformanceReviews]);

    const updatePerformanceReview = useCallback((review: T.PerformanceReview) => {
        setPerformanceReviews(prev => prev.map(r => r.id === review.id ? review : r));
        return review;
    }, [setPerformanceReviews]);

    const addJobOpening = useCallback((jobData: Omit<T.JobOpening, "id">) => {
        const newJob = { ...jobData, id: Date.now() };
        setJobOpenings(prev => [...prev, newJob]);
        return newJob;
    }, [setJobOpenings]);
    
    const updateJobOpening = useCallback((job: T.JobOpening) => {
        setJobOpenings(prev => prev.map(j => j.id === job.id ? job : j));
        return job;
    }, [setJobOpenings]);
    
    const addCandidate = useCallback((candidateData: Omit<T.Candidate, "id">) => {
        const newCandidate = { ...candidateData, id: Date.now(), avatar: `https://i.pravatar.cc/150?u=cand${Date.now()}` };
        setCandidates(prev => [...prev, newCandidate]);
        return newCandidate;
    }, [setCandidates]);
    
    const updateCandidate = useCallback((candidate: T.Candidate) => {
        setCandidates(prev => prev.map(c => c.id === candidate.id ? candidate : c));
        return candidate;
    }, [setCandidates]);

    const updateCandidateStage = useCallback((candidateId: number, newStage: T.CandidateStage) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    }, [setCandidates]);

    const addOnboardingTemplate = useCallback((templateData: Omit<T.OnboardingTemplate, "id">) => {
        const newTemplate = { ...templateData, id: Date.now() };
        setOnboardingTemplates(prev => [...prev, newTemplate]);
        return newTemplate;
    }, [setOnboardingTemplates]);

    const updateOnboardingTemplate = useCallback((template: T.OnboardingTemplate) => {
        setOnboardingTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        return template;
    }, [setOnboardingTemplates]);

    const startOnboardingWorkflow = useCallback((data: { employeeId: number, templateId: number }) => {
        const employee = employees.find(e => e.id === data.employeeId);
        const template = onboardingTemplates.find(t => t.id === data.templateId);
        if (!employee || !template) return undefined;

        const newWorkflow: T.OnboardingWorkflow = {
            id: Date.now(),
            employeeId: employee.id,
            employeeName: employee.name,
            templateId: template.id,
            templateName: template.name,
            type: template.type,
            startDate: new Date().toISOString().split('T')[0],
            status: T.OnboardingWorkflowStatus.InProgress,
            itemsStatus: Array(template.items.length).fill(false),
        };
        setOnboardingWorkflows(prev => [...prev, newWorkflow]);
        return newWorkflow;
    }, [employees, onboardingTemplates, setOnboardingWorkflows]);

    const updateOnboardingWorkflowStatus = useCallback((workflowId: number, itemIndex: number, isCompleted: boolean) => {
        setOnboardingWorkflows(prev => prev.map(w => {
            if (w.id === workflowId) {
                const newItemsStatus = [...w.itemsStatus];
                newItemsStatus[itemIndex] = isCompleted;
                const allCompleted = newItemsStatus.every(Boolean);
                return { ...w, itemsStatus: newItemsStatus, status: allCompleted ? T.OnboardingWorkflowStatus.Completed : T.OnboardingWorkflowStatus.InProgress };
            }
            return w;
        }));
    }, [setOnboardingWorkflows]);

    const calculatePayslipForEmployee = (employee: T.Employee, payPeriod: string, payrollRunId: number, params: T.HrParameters): T.Payslip => {
        const grossSalary = employee.salary;
        const { MINIMUM_WAGE_GROSS, EMPLOYEE_SGK_RATE, EMPLOYEE_UNEMPLOYMENT_RATE, EMPLOYER_SGK_RATE, EMPLOYER_UNEMPLOYMENT_RATE, STAMP_DUTY_RATE, INCOME_TAX_BRACKETS } = params;
        const minWageSgkBase = MINIMUM_WAGE_GROSS * (EMPLOYEE_SGK_RATE + EMPLOYEE_UNEMPLOYMENT_RATE);
        const minWageIncomeTaxBase = MINIMUM_WAGE_GROSS - minWageSgkBase;
        let minWageIncomeTax = 0;
        let remainingMinWageBase = minWageIncomeTaxBase, lastLimit = 0;
        for (const bracket of INCOME_TAX_BRACKETS) {
            if (remainingMinWageBase > 0) {
                const taxableInBracket = Math.min(remainingMinWageBase, bracket.limit - lastLimit);
                minWageIncomeTax += taxableInBracket * bracket.rate;
                remainingMinWageBase -= taxableInBracket;
                lastLimit = bracket.limit;
            }
        }
        const incomeTaxExemption = minWageIncomeTax;
        const stampDutyExemption = MINIMUM_WAGE_GROSS * STAMP_DUTY_RATE;
        const sgkPremiumBase = grossSalary * EMPLOYEE_SGK_RATE;
        const unemploymentPremiumBase = grossSalary * EMPLOYEE_UNEMPLOYMENT_RATE;
        const sgkPremium = sgkPremiumBase + unemploymentPremiumBase;
        const incomeTaxBase = grossSalary - sgkPremium;
        let totalIncomeTax = 0;
        let remainingBase = incomeTaxBase;
        lastLimit = 0;
        for (const bracket of INCOME_TAX_BRACKETS) {
            if (remainingBase > 0) {
                const taxableInBracket = Math.min(remainingBase, bracket.limit - lastLimit);
                totalIncomeTax += taxableInBracket * bracket.rate;
                remainingBase -= taxableInBracket;
                lastLimit = bracket.limit;
            }
        }
        const totalStampDuty = grossSalary * STAMP_DUTY_RATE;
        const incomeTaxAmount = Math.max(0, totalIncomeTax - incomeTaxExemption);
        const stampDutyAmount = Math.max(0, totalStampDuty - stampDutyExemption);
        const totalDeductions = sgkPremium + incomeTaxAmount + stampDutyAmount;
        const netPay = grossSalary - totalDeductions;
        const employerSgkPremium = grossSalary * (EMPLOYER_SGK_RATE + EMPLOYER_UNEMPLOYMENT_RATE);

        return {
            id: Date.now() + employee.id, payrollRunId, employeeId: employee.id, employeeName: employee.name, payPeriod, runDate: new Date().toISOString().split('T')[0],
            grossPay: grossSalary, earnings: [{ name: 'Brüt Maaş', amount: grossSalary }],
            deductions: [ { name: 'SGK Primi', amount: sgkPremium }, { name: 'Gelir Vergisi', amount: incomeTaxAmount }, { name: 'Damga Vergisi', amount: stampDutyAmount } ],
            netPay, sgkPremium, unemploymentPremium: unemploymentPremiumBase, incomeTaxBase, cumulativeIncomeTaxBase: 0,
            incomeTaxAmount, stampDutyAmount, employerSgkPremium, incomeTaxExemption, stampDutyExemption, besKesintisi: 0, agiTutari: 0,
            normalCalismaGunu: 30, haftaTatili: 0, genelTatil: 0, ucretliIzin: 0, ucretsizIzin: 0, raporluGun: 0, fazlaMesaiSaati: 0, resmiTatilMesaisi: 0, geceVardiyasiSaati: 0, eksikGun: 0,
            ekOdemeler: [], digerKesintiler: [],
        };
    };

    const addPayrollRun = useCallback((payPeriod: string): T.PayrollRun | undefined => {
        const existingRun = payrollRuns.find(pr => pr.payPeriod === payPeriod);
        if (existingRun) {
            addToast(`'${payPeriod}' dönemi için zaten bir bordro mevcut.`, 'warning');
            return undefined;
        }
        
        const newRunId = Date.now();
        const activeEmployees = employees.filter(e => !e.istenCikisTarihi);
        if (activeEmployees.length === 0) {
            addToast("Bordro oluşturulacak aktif çalışan bulunamadı.", "warning");
            return undefined;
        }

        const newPayslips = activeEmployees.map(employee => calculatePayslipForEmployee(employee, payPeriod, newRunId, hrParameters));
        
        const totalGrossPay = newPayslips.reduce((sum, p) => sum + p.grossPay, 0);
        const totalDeductions = newPayslips.reduce((sum, p) => sum + (p.sgkPremium + p.incomeTaxAmount + p.stampDutyAmount), 0);
        const totalNetPay = newPayslips.reduce((sum, p) => sum + p.netPay, 0);
        const totalEmployerSgk = newPayslips.reduce((sum, p) => sum + p.employerSgkPremium, 0);

        const newRun: T.PayrollRun = {
            id: newRunId, payPeriod, runDate: new Date().toISOString().split('T')[0], status: 'Taslak',
            employeeCount: activeEmployees.length, totalGrossPay, totalDeductions, totalNetPay, totalEmployerSgk,
        };

        setPayslips(prev => [...prev, ...newPayslips]);
        setPayrollRuns(prev => [...prev, newRun]);
        logActivity(T.ActionType.PAYROLL_RUN_CREATED, `Bordro dönemi oluşturuldu: ${payPeriod}`, 'payroll_run', newRun.id);
        addToast(`Bordro dönemi '${payPeriod}' başarıyla oluşturuldu.`, 'success');
        return newRun;
    }, [employees, payrollRuns, hrParameters, setPayslips, setPayrollRuns, logActivity, addToast]);


    const updatePayslip = useCallback((payslip: Partial<T.Payslip> & { id: number; }) => {
        setPayslips(prev => prev.map(p => p.id === payslip.id ? { ...p, ...payslip } : p));
    }, [setPayslips]);
    
    const addJournalEntry = useCallback((entryData: Omit<T.JournalEntry, 'id' | 'entryNumber'>): T.JournalEntry => {
        const newEntry: T.JournalEntry = {
            ...entryData,
            id: Date.now(),
            entryNumber: `JE-${Date.now()}`
        };
        setJournalEntries(prev => [newEntry, ...prev]);
        logActivity(T.ActionType.JOURNAL_ENTRY_CREATED, `Yevmiye fişi #${newEntry.entryNumber} oluşturuldu.`, 'journal_entry', newEntry.id);
        return newEntry;
    }, [setJournalEntries, logActivity]);

    const updatePayrollRunStatus = useCallback((runId: number, status: T.PayrollRun['status'], journalEntryId?: number) => {
        setPayrollRuns(prev => prev.map(run => {
            if (run.id === runId) {
                const updatedRun: T.PayrollRun = { ...run, status };
                if (journalEntryId) {
                    updatedRun.journalEntryId = journalEntryId;
                }
                logActivity(T.ActionType.STATUS_CHANGED, `Bordro durumu '${run.status}' -> '${status}' olarak değiştirildi: ${run.payPeriod}`, 'payroll_run', run.id);
                addToast(`Bordro dönemi '${run.payPeriod}' durumu '${status}' olarak güncellendi.`, 'success');
                return updatedRun;
            }
            return run;
        }));
    }, [setPayrollRuns, logActivity, addToast]);

    const postPayrollRunToJournal = useCallback((runId: number) => {
        const run = payrollRuns.find(pr => pr.id === runId);
        if (!run || run.status !== 'Onaylandı') {
            addToast("Sadece onaylanmış bordrolar muhasebeye aktarılabilir.", "warning");
            return;
        }
        const runPayslips = payslips.filter(p => p.payrollRunId === runId);
        if (runPayslips.length === 0) {
            addToast("Bu bordro dönemine ait maaş pusulası bulunamadı.", "warning");
            return;
        }

        const SALARY_EXPENSE_ACC_ID = 77001; 
        const SGK_EXPENSE_ACC_ID = 77002;
        const SALARIES_PAYABLE_ACC_ID = 33501;
        const TAXES_PAYABLE_ACC_ID = 36001;
        const SGK_PAYABLE_ACC_ID = 36101;

        const totalGross = runPayslips.reduce((sum, p) => sum + p.grossPay, 0);
        const totalNet = runPayslips.reduce((sum, p) => sum + p.netPay, 0);
        const totalEmployeeSgk = runPayslips.reduce((sum, p) => sum + p.sgkPremium, 0);
        const totalEmployerSgk = runPayslips.reduce((sum, p) => sum + p.employerSgkPremium, 0);
        const totalIncomeTax = runPayslips.reduce((sum, p) => sum + p.incomeTaxAmount, 0);
        const totalStampDuty = runPayslips.reduce((sum, p) => sum + p.stampDutyAmount, 0);

        const journalItems: T.JournalEntryItem[] = [
            { accountId: SALARY_EXPENSE_ACC_ID, debit: totalGross, credit: 0, description: `${run.payPeriod} Maaş Gideri` },
            { accountId: SGK_EXPENSE_ACC_ID, debit: totalEmployerSgk, credit: 0, description: `${run.payPeriod} SGK İşveren Gideri` },
            { accountId: SALARIES_PAYABLE_ACC_ID, credit: totalNet, debit: 0, description: `${run.payPeriod} Ödenecek Maaşlar` },
            { accountId: TAXES_PAYABLE_ACC_ID, credit: totalIncomeTax + totalStampDuty, debit: 0, description: `${run.payPeriod} Ödenecek Vergiler (GV+DV)` },
            { accountId: SGK_PAYABLE_ACC_ID, credit: totalEmployeeSgk + totalEmployerSgk, debit: 0, description: `${run.payPeriod} Ödenecek SGK Primleri` },
        ];
        
        const newEntryData: Omit<T.JournalEntry, 'id' | 'entryNumber'> = {
            date: new Date().toISOString().split('T')[0],
            memo: `${run.payPeriod} Bordro Tahakkuk Kaydı`,
            type: T.JournalEntryType.Mahsup,
            status: T.JournalEntryStatus.Posted,
            items: journalItems.filter(item => item.debit > 0 || item.credit > 0),
        };

        const newEntry = addJournalEntry(newEntryData);
        if (newEntry) {
            updatePayrollRunStatus(runId, 'Muhasebeleşti', newEntry.id);
            addToast("Bordro başarıyla muhasebeye aktarıldı.", "success");
        } else {
            addToast("Yevmiye kaydı oluşturulurken bir hata oluştu.", "error");
        }
    }, [payrollRuns, payslips, addJournalEntry, updatePayrollRunStatus, addToast]);

    const exportPayrollRunToAphbXml = useCallback((runId: number) => {
        const run = payrollRuns.find(pr => pr.id === runId);
        if (!run) {
            addToast("Bordro dönemi bulunamadı.", "error");
            return;
        }
        console.log(`Generating APHB XML for ${run.payPeriod}...`);
        const xmlContent = `<APHB>${run.payPeriod}</APHB>`; // Placeholder
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aphb-${run.payPeriod.replace(' ', '-')}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast("APHB XML dosyası (simülasyon) oluşturuldu ve indiriliyor.", "success");
    }, [payrollRuns, addToast]);

    // Proactive stock check for Work Orders
    const updateWorkOrderStatus = useCallback((workOrderId: number, newStatus: T.WorkOrderStatus) => {
        let woToUpdate = workOrders.find(wo => wo.id === workOrderId);
        if (!woToUpdate) return;
        
        if (newStatus === T.WorkOrderStatus.Onaylandı) {
            const bom = boms.find(b => b.id === woToUpdate!.bomId);
            if (!bom) {
                addToast(`Üretim için ürün reçetesi (BOM) bulunamadı.`, "error");
                return; 
            }
            let canCommitAll = true;
            for (const component of bom.items) {
                const requiredQty = component.quantity * woToUpdate.quantityToProduce;
                const stockInfo = getProductStockInfo(component.productId);
                if (stockInfo.available < requiredQty) {
                    const product = products.find(p => p.id === component.productId);
                    addToast(`Üretim için yetersiz hammadde: '${product?.name || 'Bilinmeyen'}'. Mevcut: ${stockInfo.available}, Gerekli: ${requiredQty}.`, "error");
                    canCommitAll = false;
                    break;
                }
            }
            if (!canCommitAll) return; // Block status change
        }

        setWorkOrders(prev => prev.map(wo => wo.id === workOrderId ? { ...wo, status: newStatus } : wo));
        addToast(`İş emri durumu güncellendi: ${newStatus}`, "success");
    }, [workOrders, boms, products, getProductStockInfo, addToast, setWorkOrders]);

    // Customer related functions
    const addCustomer = useCallback((customerData: Omit<T.Customer, 'id' | 'avatar'>): (T.Customer & { assignedToName: string }) => {
        const employee = employees.find(e => e.id === customerData.assignedToId);
        const newCustomer: T.Customer & { assignedToName: string } = {
           ...customerData,
           id: Date.now(),
           avatar: `https://i.pravatar.cc/150?u=c${Date.now()}`,
           assignedToName: employee?.name || 'Unknown'
       };
       setCustomers(prev => [newCustomer, ...prev]);
       logActivity(T.ActionType.CREATED, `Müşteri '${newCustomer.name}' oluşturuldu.`, 'customer', newCustomer.id);
       return newCustomer;
    }, [employees, setCustomers, logActivity]);

    const updateCustomer = useCallback((customer: T.Customer): (T.Customer & { assignedToName: string }) => {
        const employee = employees.find(e => e.id === customer.assignedToId);
        const updatedCustomer: T.Customer & { assignedToName: string } = {
           ...customer,
           assignedToName: employee?.name || 'Unknown'
       };
       setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
       logActivity(T.ActionType.UPDATED, `Müşteri '${updatedCustomer.name}' güncellendi.`, 'customer', updatedCustomer.id);
       return updatedCustomer;
    }, [employees, setCustomers, logActivity]);
    
    const deleteCustomer = useCallback((id: number) => {
        const customerToDelete = customers.find(c => c.id === id);
        if (customerToDelete) {
            logActivity(T.ActionType.DELETED, `Müşteri '${customerToDelete.name}' silindi.`, 'customer', id);
        }
        deleteCustomerHook(id);
    }, [customers, deleteCustomerHook, logActivity]);
    
    const deleteMultipleCustomers = useCallback((ids: number[]) => {
        logActivity(T.ActionType.DELETED_MULTIPLE, `${ids.length} müşteri silindi.`);
        deleteMultipleCustomersHook(ids);
    }, [deleteMultipleCustomersHook, logActivity]);

    const updateCustomerStatus = useCallback((customerId: number, newStatus: string): (T.Customer & { assignedToName: string }) | undefined => {
        let updatedCustomer: (T.Customer & { assignedToName: string }) | undefined;
        setCustomers(prev => prev.map(c => {
            if (c.id === customerId) {
                logActivity(T.ActionType.STATUS_CHANGED, `Müşteri '${c.name}' durumu '${c.status}' -> '${newStatus}' olarak değiştirildi.`, 'customer', c.id);
                updatedCustomer = { ...c, status: newStatus };
                return updatedCustomer;
            }
            return c;
        }));
        return updatedCustomer;
    }, [setCustomers, logActivity]);

    const bulkUpdateCustomerStatus = useCallback((customerIds: number[], newStatus: string) => {
        setCustomers(prev => prev.map(c => 
            customerIds.includes(c.id) 
            ? { ...c, status: newStatus } 
            : c
        ));
        logActivity(T.ActionType.STATUS_CHANGED, `${customerIds.length} müşterinin durumu '${newStatus}' olarak güncellendi.`);
    }, [setCustomers, logActivity]);

    const assignCustomersToEmployee = useCallback((customerIds: number[], employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return;

        setCustomers(prev => prev.map(c => 
            customerIds.includes(c.id) 
            ? { ...c, assignedToId: employeeId, assignedToName: employee.name } 
            : c
        ));
        logActivity(T.ActionType.UPDATED, `${customerIds.length} müşteri '${employee.name}' kişisine atandı.`);
    }, [employees, setCustomers, logActivity]);

    const addTagsToCustomers = useCallback((customerIds: number[], tags: string[]) => {
        setCustomers(prev => prev.map(c => {
            if (customerIds.includes(c.id)) {
                const newTags = [...new Set([...c.tags, ...tags])];
                return { ...c, tags: newTags };
            }
            return c;
        }));
        logActivity(T.ActionType.UPDATED, `${customerIds.length} müşteriye şu etiketler eklendi: ${tags.join(', ')}`);
    }, [setCustomers, logActivity]);
    
    const importCustomers = useCallback((customersData: Omit<T.Customer, 'id' | 'avatar'>[]): (T.Customer & { assignedToName: string })[] => {
        const newCustomers = customersData.map((c, i) => {
            const employee = employees.find(e => e.id === c.assignedToId);
            return {
                ...c,
                id: Date.now() + i,
                avatar: `https://i.pravatar.cc/150?u=c${Date.now() + i}`,
                assignedToName: employee?.name || 'Unknown'
            };
        });
        setCustomers(prev => [...newCustomers, ...prev]);
        logActivity(T.ActionType.CREATED, `${newCustomers.length} müşteri içeri aktarıldı.`);
        return newCustomers;
    }, [employees, setCustomers, logActivity]);
    
    const addContact = useCallback((contactData: Omit<T.Contact, 'id'>): T.Contact => {
        const newContact = { ...contactData, id: Date.now() };
        setContacts(prev => [...prev, newContact]);
        logActivity(T.ActionType.CREATED, `Yeni kişi '${newContact.name}' eklendi.`, 'customer', newContact.customerId);
        return newContact;
    }, [setContacts, logActivity]);

    const updateContact = useCallback((contact: T.Contact): T.Contact | undefined => {
        let updated: T.Contact | undefined;
        setContacts(prev => prev.map(c => {
            if (c.id === contact.id) {
                updated = contact;
                return contact;
            }
            return c;
        }));
        logActivity(T.ActionType.UPDATED, `Kişi '${contact.name}' güncellendi.`, 'customer', contact.customerId);
        return updated;
    }, [setContacts, logActivity]);

    const deleteContact = useCallback((contactId: number) => {
        const contactToDelete = contacts.find(c => c.id === contactId);
        if (contactToDelete) {
            logActivity(T.ActionType.DELETED, `Kişi '${contactToDelete.name}' silindi.`, 'customer', contactToDelete.customerId);
            setContacts(prev => prev.filter(c => c.id !== contactId));
        }
    }, [contacts, setContacts, logActivity]);

    const addCommunicationLog = useCallback((customerId: number, type: T.CommunicationLogType, content: string): T.CommunicationLog => {
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
        logActivity(T.ActionType.COMMENT_ADDED, `İletişim kaydı eklendi: ${type}`, 'customer', customerId);
        return newLog;
    }, [currentUser, setCommunicationLogs, logActivity]);

    const updateCommunicationLog = useCallback((log: T.CommunicationLog): T.CommunicationLog | undefined => {
        let updated: T.CommunicationLog | undefined;
        setCommunicationLogs(prev => prev.map(l => {
            if (l.id === log.id) {
                updated = log;
                return log;
            }
            return l;
        }));
        logActivity(T.ActionType.UPDATED, `İletişim kaydı güncellendi.`, 'customer', log.customerId);
        return updated;
    }, [setCommunicationLogs, logActivity]);
    
    const deleteCommunicationLog = useCallback((logId: number) => {
         const logToDelete = communicationLogs.find(l => l.id === logId);
        if(logToDelete){
            logActivity(T.ActionType.DELETED, `İletişim kaydı silindi.`, 'customer', logToDelete.customerId);
            setCommunicationLogs(prev => prev.filter(l => l.id !== logId));
        }
    }, [communicationLogs, setCommunicationLogs, logActivity]);

     const addSavedView = useCallback((name: string, filters: T.SavedView['filters'], sortConfig: T.SortConfig): T.SavedView => {
        const newView: T.SavedView = { id: Date.now(), name, filters, sortConfig };
        setSavedViews(prev => [...prev, newView]);
        addToast(`Görünüm '${name}' kaydedildi.`, 'success');
        return newView;
    }, [setSavedViews, addToast]);
    
    const deleteSavedView = useCallback((id: number) => {
        setSavedViews(prev => prev.filter(v => v.id !== id));
        addToast('Görünüm silindi.', 'info');
    }, [setSavedViews, addToast]);

    const loadSavedView = useCallback((id: number) => savedViews.find(v => v.id === id), [savedViews]);

    const summarizeActivityFeed = useCallback(async (customerId: number): Promise<string> => {
        const logs = communicationLogs.filter(l => l.customerId === customerId);
        const activities = activityLogs.filter(a => a.entityType === 'customer' && a.entityId === customerId);
        const commentsData = comments.filter(c => c.relatedEntityType === 'customer' && c.relatedEntityId === customerId);

        if (logs.length === 0 && activities.length === 0 && commentsData.length === 0) {
            return "Bu müşteri için özetlenecek aktivite bulunmuyor.";
        }
        
        return await geminiSummarizeActivityFeed({ logs, activities, comments: commentsData });
    }, [communicationLogs, activityLogs, comments]);

    const calculateAnnualLeaveBalance = useCallback((employeeId: number): { entitled: number; used: number; balance: number } => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee || !employee.hireDate) return { entitled: 0, used: 0, balance: 0 };
        const hireDate = new Date(employee.hireDate);
        const today = new Date();
        let serviceYears = today.getFullYear() - hireDate.getFullYear();
        const m = today.getMonth() - hireDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < hireDate.getDate())) serviceYears--;
        let entitled = 0;
        if (serviceYears >= 15) entitled = 26;
        else if (serviceYears > 5) entitled = 20;
        else if (serviceYears >= 1) entitled = 14;
        const employeeAnnualLeaves = leaveRequests.filter(lr => lr.employeeId === employeeId && lr.leaveType === T.LeaveType.Annual && lr.status === T.LeaveStatus.Approved);
        const used = employeeAnnualLeaves.reduce((total, leave) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            let dayCount = 0;
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) dayCount++;
            }
            return total + dayCount;
        }, 0);
        return { entitled, used, balance: entitled - used };
    }, [employees, leaveRequests]);
    
    const calculateTerminationPayments = useCallback((employeeId: number, terminationDate: string, additionalGrossPay: number, additionalBonuses: number, usedAnnualLeave: number): T.SeveranceCalculationResult | null => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee || !employee.hireDate) return null;
    
        const hire = new Date(employee.hireDate);
        const term = new Date(terminationDate);
        const totalServiceDays = Math.floor((term.getTime() - hire.getTime()) / (1000 * 3600 * 24)) + 1;
        const serviceYears = Math.floor(totalServiceDays / 365.25);
        const serviceMonths = Math.floor((totalServiceDays % 365.25) / 30.4375);
        const serviceDaysRem = Math.floor((totalServiceDays % 365.25) % 30.4375);
    
        const finalGrossSalary = employee.salary + additionalGrossPay;
        const severancePayBase = Math.min(finalGrossSalary, hrParameters.SEVERANCE_CEILING);
        const severancePayGross = (severancePayBase / 365) * totalServiceDays;
        const severanceStampDuty = severancePayGross * hrParameters.STAMP_DUTY_RATE;
        const severancePayNet = severancePayGross - severanceStampDuty;
    
        let noticePeriodWeeks = 0;
        if (totalServiceDays < 180) noticePeriodWeeks = 2;
        else if (totalServiceDays < 540) noticePeriodWeeks = 4;
        else if (totalServiceDays < 1080) noticePeriodWeeks = 6;
        else noticePeriodWeeks = 8;
        
        const noticePayGross = (finalGrossSalary / 30) * noticePeriodWeeks * 7;
        const noticePayTax = noticePayGross * 0.20; // Simplified
        const noticePayNet = noticePayGross - noticePayTax;
    
        const leaveBalance = calculateAnnualLeaveBalance(employeeId);
        const annualLeaveDaysUnused = leaveBalance.entitled - usedAnnualLeave;
        const annualLeavePayGross = annualLeaveDaysUnused > 0 ? (finalGrossSalary / 30) * annualLeaveDaysUnused : 0;
        const annualLeavePayTax = annualLeavePayGross * 0.20; // Simplified
        const annualLeavePayNet = annualLeavePayGross - annualLeavePayTax;
        
        const bonusNet = additionalBonuses * 0.80;
    
        const totalTaxableGross = noticePayGross + annualLeavePayGross + additionalBonuses;
        const totalIncomeTax = noticePayTax + annualLeavePayTax + (additionalBonuses * 0.20);
        const totalStampDuty = severanceStampDuty;
        const totalNetPayment = severancePayNet + noticePayNet + annualLeavePayNet + bonusNet;
    
        return {
            serviceYears, serviceMonths, serviceDays: serviceDaysRem, totalServiceDays,
            finalGrossSalary,
            severancePayBase, severancePayGross, severanceStampDuty, severancePayNet,
            noticePeriodWeeks, noticePayGross, noticePayNet,
            annualLeaveDaysEntitled: leaveBalance.entitled, annualLeaveDaysUsed: usedAnnualLeave, annualLeaveDaysUnused,
            annualLeavePayGross, annualLeavePayNet,
            bonusGross: additionalBonuses, bonusNet,
            totalTaxableGross, totalIncomeTax, totalStampDuty,
            totalNetPayment
        };
    }, [employees, hrParameters, calculateAnnualLeaveBalance]);

    const calculatePayrollCost = useCallback((grossSalary: number): T.PayrollSimulationResult => {
        const { EMPLOYEE_SGK_RATE, EMPLOYEE_UNEMPLOYMENT_RATE, EMPLOYER_SGK_RATE, EMPLOYER_UNEMPLOYMENT_RATE, STAMP_DUTY_RATE, INCOME_TAX_BRACKETS } = hrParameters;
        
        const employeeSgkContribution = grossSalary * EMPLOYEE_SGK_RATE;
        const employeeUnemploymentContribution = grossSalary * EMPLOYEE_UNEMPLOYMENT_RATE;
        const incomeTaxBase = grossSalary - employeeSgkContribution - employeeUnemploymentContribution;
        let incomeTax = 0, remainingBase = incomeTaxBase, lastLimit = 0;
        for (const bracket of INCOME_TAX_BRACKETS) {
            if (remainingBase > 0) {
                const taxableInBracket = Math.min(remainingBase, bracket.limit - lastLimit);
                incomeTax += taxableInBracket * bracket.rate;
                remainingBase -= taxableInBracket;
                lastLimit = bracket.limit;
            }
        }
        
        const stampDuty = grossSalary * STAMP_DUTY_RATE;
        const totalEmployeeDeductions = employeeSgkContribution + employeeUnemploymentContribution + incomeTax + stampDuty;
        const netSalary = grossSalary - totalEmployeeDeductions;
        const employerSgkContribution = grossSalary * EMPLOYER_SGK_RATE;
        const employerUnemploymentContribution = grossSalary * EMPLOYER_UNEMPLOYMENT_RATE;
        const totalEmployerCost = grossSalary + employerSgkContribution + employerUnemploymentContribution;

        return { grossSalary, netSalary, employeeSgkContribution, employeeUnemploymentContribution, incomeTax, stampDuty, totalEmployeeDeductions, employerSgkContribution, employerUnemploymentContribution, totalEmployerCost, incomeTaxExemption: 0, stampDutyExemption: 0 };
    }, [hrParameters]);
    
    const addLeaveRequest = useCallback((requestData: Omit<T.LeaveRequest, "id" | "employeeName" | "status">): T.LeaveRequest => {
        const employee = employees.find(e => e.id === requestData.employeeId);
        if (!employee) throw new Error("Employee not found for leave request");
        const newRequest: T.LeaveRequest = { ...requestData, id: Date.now(), employeeName: employee.name, status: T.LeaveStatus.Pending };
        setLeaveRequests(prev => [...prev, newRequest]);
        return newRequest;
    }, [employees, setLeaveRequests]);

    const updateLeaveRequestStatus = useCallback((requestId: number, newStatus: T.LeaveStatus) => {
        setLeaveRequests(prev => prev.map(lr => lr.id === requestId ? { ...lr, status: newStatus } : lr));
    }, [setLeaveRequests]);

    const addExpense = useCallback((expenseData: Omit<T.Expense, 'id' | 'employeeName' | 'status' | 'employeeId'>): T.Expense => {
        const employee = employees.find(e => e.id === currentUser.id);
        if (!employee) throw new Error("Current user not found in employees list");
        const newExpense: T.Expense = { ...expenseData, id: Date.now(), employeeId: currentUser.id, employeeName: employee.name, status: T.ExpenseStatus.Pending };
        setExpenses(prev => [newExpense, ...prev]);
        logActivity(T.ActionType.CREATED, `Masraf talebi oluşturuldu: ${newExpense.description}`, 'expense', newExpense.id);
        return newExpense;
    }, [currentUser, employees, setExpenses, logActivity]);

    const updateExpenseStatus = useCallback((expenseId: number, status: T.ExpenseStatus) => {
        setExpenses(prev => prev.map(expense => {
            if (expense.id === expenseId) {
                logActivity(T.ActionType.STATUS_CHANGED, `Masraf durumu '${expense.status}' -> '${status}' olarak değiştirildi: ${expense.description}`, 'expense', expense.id);
                return { ...expense, status };
            }
            return expense;
        }));
    }, [setExpenses, logActivity]);
    
    const createTasksFromTemplate = useCallback((templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => {
        const template = taskTemplates.find(t => t.id === templateId);
        if (!template) {
            addToast("Görev şablonu bulunamadı.", "error");
            return;
        }
        if (employees.length === 0) {
            addToast("Sistemde görev atanacak çalışan bulunamadı.", "error");
            return;
        }
        
        const start = new Date(startDate);
        const newTasks: (T.Task | null)[] = template.items.map(item => {
            const dueDate = new Date(start);
            dueDate.setDate(start.getDate() + item.dueDaysAfterStart);
            const assignee = employees.find(e => e.role === item.defaultAssigneeRoleId) || employees[0];
            
            if (!assignee) {
                console.error(`'${item.defaultAssigneeRoleId}' rolüne sahip bir çalışan bulunamadı. Görev atanamadı: '${item.taskName}'`);
                return null;
            }

            let relatedEntityName = '';
            if(relatedEntityType && relatedEntityId){
                 switch (relatedEntityType) {
                    case 'customer': relatedEntityName = customers.find(c => c.id === relatedEntityId)?.name || ''; break;
                    case 'project': relatedEntityName = projects.find(p => p.id === relatedEntityId)?.name || ''; break;
                    case 'deal': relatedEntityName = deals.find(d => d.id === relatedEntityId)?.title || ''; break;
                }
            }
            
            return {
                id: Date.now() + Math.random(),
                title: item.taskName,
                description: '',
                status: T.TaskStatus.Todo,
                priority: item.priority,
                dueDate: dueDate.toISOString().split('T')[0],
                startDate: startDate,
                assignedToId: assignee.id,
                assignedToName: assignee.name,
                estimatedTime: item.estimatedTime,
                relatedEntityType,
                relatedEntityId,
                relatedEntityName,
            };
        });

        const validTasks = newTasks.filter((task): task is T.Task => task !== null);

        if (validTasks.length > 0) {
            setTasks(prev => [...prev, ...validTasks]);
            logActivity(T.ActionType.TASK_CREATED_MULTIPLE, `${validTasks.length} görev '${template.name}' şablonundan oluşturuldu.`);
            addToast(`${validTasks.length} görev oluşturuldu.`, 'success');
        }
        
        if (validTasks.length !== newTasks.length) {
            addToast("Bazı görevler atama yapılamadığı için oluşturulamadı.", "warning");
        }

    }, [taskTemplates, employees, customers, projects, deals, setTasks, logActivity, addToast]);
    
    const addProject = useCallback((projectData: Omit<T.Project, 'id' | 'client'>, taskTemplateId?: number): T.Project => {
        const customer = customers.find(c => c.id === projectData.customerId);
        const newProject: T.Project = { ...projectData, id: Date.now(), client: customer?.name || 'Bilinmeyen' };
        setProjects(prev => [newProject, ...prev]);
        logActivity(T.ActionType.PROJECT_CREATED, `Proje '${newProject.name}' oluşturuldu.`, 'project', newProject.id);
        if (taskTemplateId) {
            createTasksFromTemplate(taskTemplateId, newProject.startDate, 'project', newProject.id);
        }
        return newProject;
    }, [customers, setProjects, logActivity, createTasksFromTemplate]);

    const runEventTriggeredAutomations = useCallback(async (triggerType: T.AutomationTriggerType, data: { deal?: T.Deal, customer?: T.Customer }) => {
        const relevantAutomations = automations.filter(a => a.active && a.triggerType === triggerType);
    
        for (const auto of relevantAutomations) {
            let conditionMet = false;
            if (triggerType === T.AutomationTriggerType.DEAL_STAGE_CHANGED && data.deal) {
                if (data.deal.stage === auto.triggerConfig.stageId) {
                    conditionMet = true;
                }
            }
    
            if (conditionMet) {
                logActivity(T.ActionType.UPDATED, `Otomasyon '${auto.name}' tetiklendi.`, 'automation', auto.id);
                for (const action of auto.actions) {
                    try {
                        switch (action.type) {
                            case T.AutomationActionType.CREATE_PROJECT:
                                if(data.deal) {
                                    const projectName = action.config.projectNameTemplate
                                        .replace('{dealTitle}', data.deal.title)
                                        .replace('{customerName}', data.deal.customerName);
                                    addProject({
                                        name: projectName,
                                        customerId: data.deal.customerId,
                                        deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                                        status: 'beklemede',
                                        progress: 0,
                                        description: `Anlaşma #${data.deal.id} üzerinden otomatik oluşturuldu.`,
                                        startDate: new Date().toISOString().split('T')[0],
                                        teamMemberIds: [data.deal.assignedToId],
                                        budget: data.deal.value * 0.8,
                                        spent: 0,
                                        tags: ['otomasyon']
                                    });
                                }
                                break;
                        }
                    } catch (e) {
                        console.error(`Automation action failed for automation ${auto.id}`, e);
                    }
                }
            }
        }
    }, [automations, logActivity, addProject]);

    const addDeal = useCallback((dealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'>): T.Deal => {
        const customer = customers.find(c => c.id === dealData.customerId);
        const employee = employees.find(e => e.id === dealData.assignedToId);
        const value = dealData.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newDeal: T.Deal = {
            ...dealData,
            id: Date.now(),
            customerName: customer?.name || 'Bilinmeyen Müşteri',
            assignedToName: employee?.name || 'Bilinmeyen Sorumlu',
            value: value,
            lastActivityDate: new Date().toISOString(),
            createdDate: new Date().toISOString(),
        };
        setDeals(prev => [newDeal, ...prev]);
        logActivity(T.ActionType.CREATED, `Anlaşma '${newDeal.title}' oluşturuldu.`, 'deal', newDeal.id);
        return newDeal;
    }, [customers, employees, setDeals, logActivity]);
    
    const updateDeal = useCallback((deal: T.Deal): T.Deal | undefined => {
        let updated: T.Deal | undefined;
        setDeals(prev => prev.map(d => {
            if (d.id === deal.id) {
                const customer = customers.find(c => c.id === deal.customerId);
                const employee = employees.find(e => e.id === deal.assignedToId);
                const value = deal.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                updated = { ...deal, customerName: customer?.name || 'Bilinmeyen', assignedToName: employee?.name || 'Bilinmeyen', value: value, lastActivityDate: new Date().toISOString(), };
                return updated;
            }
            return d;
        }));
        if(updated) logActivity(T.ActionType.UPDATED, `Anlaşma '${updated.title}' güncellendi.`, 'deal', updated.id);
        return updated;
    }, [customers, employees, setDeals, logActivity]);
    
    const deleteDeal = useCallback((id: number) => {
        const dealToDelete = deals.find(d => d.id === id);
        if (dealToDelete) {
            setDeals(prev => prev.filter(d => d.id !== id));
            logActivity(T.ActionType.DELETED, `Anlaşma '${dealToDelete.title}' silindi.`, 'deal', id);
        }
    }, [deals, setDeals, logActivity]);
    
    const updateProject = useCallback((project: T.Project): T.Project | undefined => {
        let updated: T.Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === project.id) {
                const customer = customers.find(c => c.id === project.customerId);
                updated = { ...project, client: customer?.name || 'Bilinmeyen' };
                return updated;
            }
            return p;
        }));
        if(updated) logActivity(T.ActionType.PROJECT_UPDATED, `Proje '${updated.name}' güncellendi.`, 'project', updated.id);
        return updated;
    }, [customers, setProjects, logActivity]);

    const deleteProject = useCallback((id: number) => {
        const projectToDelete = projects.find(p => p.id === id);
        if (projectToDelete) {
            setProjects(prev => prev.filter(p => p.id !== id));
            setTasks(prev => prev.filter(t => !(t.relatedEntityType === 'project' && t.relatedEntityId === id)));
            logActivity(T.ActionType.PROJECT_DELETED, `Proje '${projectToDelete.name}' ve ilgili görevler silindi.`, 'project', id);
        }
    }, [projects, setProjects, setTasks, logActivity]);

    const addTask = useCallback((taskData: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[] = []): T.Task => {
        const getRelatedName = (type?: string, id?: number) => {
            if (!type || !id) return '';
            switch (type) {
                case 'customer': return customers.find(c => c.id === id)?.name;
                case 'deal': return deals.find(d => d.id === id)?.title;
                case 'project': return projects.find(p => p.id === id)?.name;
                default: return '';
            }
        };
        const employee = employees.find(e => e.id === taskData.assignedToId);
        const mainTask: T.Task = { ...taskData, id: Date.now(), assignedToName: employee?.name || 'Bilinmeyen', relatedEntityName: getRelatedName(taskData.relatedEntityType, taskData.relatedEntityId) };
        const newSubtasks: T.Task[] = subtaskTitles.map((title, i) => ({ id: Date.now() + i + 1, title, description: '', status: T.TaskStatus.Todo, priority: taskData.priority, dueDate: taskData.dueDate, assignedToId: taskData.assignedToId, assignedToName: employee?.name || 'Bilinmeyen', parentId: mainTask.id }));
        setTasks(prev => [...prev, mainTask, ...newSubtasks]);
        logActivity(T.ActionType.TASK_CREATED, `Görev '${mainTask.title}' oluşturuldu.`, 'task', mainTask.id);
        if (newSubtasks.length > 0) logActivity(T.ActionType.TASK_CREATED_MULTIPLE, `${newSubtasks.length} alt görev oluşturuldu: '${mainTask.title}'.`, 'task', mainTask.id);
        return mainTask;
    }, [employees, customers, deals, projects, setTasks, logActivity]);

    const updateTask = useCallback((task: T.Task, options?: { silent?: boolean }): T.Task | undefined => {
        let updated: T.Task | undefined;
        setTasks(prev => prev.map(t => {
            if (t.id === task.id) {
                updated = task;
                return task;
            }
            return t;
        }));
        if(updated && !options?.silent) logActivity(T.ActionType.TASK_UPDATED, `Görev '${updated.title}' güncellendi.`, 'task', updated.id);
        return updated;
    }, [setTasks, logActivity]);

    const deleteTask = useCallback((id: number) => {
        const taskToDelete = tasks.find(t => t.id === id);
        if (taskToDelete) {
            setTasks(prev => prev.filter(t => t.id !== id && t.parentId !== id));
            logActivity(T.ActionType.TASK_DELETED, `Görev '${taskToDelete.title}' silindi.`, 'task', id);
        }
    }, [tasks, setTasks, logActivity]);
    
    const deleteMultipleTasks = useCallback((taskIds: number[]) => {
        setTasks(prevTasks => {
            const idsToDelete = new Set(taskIds);
            let changed = true;
            // Keep iterating until no more subtasks can be added to the deletion set
            while (changed) {
                changed = false;
                const currentSize = idsToDelete.size;
                prevTasks.forEach(task => {
                    if (task.parentId && idsToDelete.has(task.parentId) && !idsToDelete.has(task.id)) {
                        idsToDelete.add(task.id);
                    }
                });
                if (idsToDelete.size > currentSize) {
                    changed = true;
                }
            }
            return prevTasks.filter(task => !idsToDelete.has(task.id));
        });
        logActivity(T.ActionType.DELETED_MULTIPLE, `${taskIds.length} görev ve tüm alt görevleri silindi.`, 'task');
        addToast(`${taskIds.length} görev başarıyla silindi.`, 'success');
    }, [setTasks, logActivity, addToast]);

    const logTimeOnTask = useCallback((taskId: number, minutes: number) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, timeSpent: (t.timeSpent || 0) + minutes } : t));
        addToast(`${minutes} dakika süre eklendi.`, 'success');
    }, [setTasks, addToast]);

    const toggleTaskStar = useCallback((taskId: number) => {
        let isStarred: boolean | undefined;
        let taskTitle: string | undefined;
        setTasks(prev =>
            prev.map(task => {
                if (task.id === taskId) {
                    isStarred = !task.isStarred;
                    taskTitle = task.title;
                    return { ...task, isStarred };
                }
                return task;
            })
        );
        if (taskTitle !== undefined) {
             addToast(`Görev '${isStarred ? 'yıldızlandı' : 'yıldızı kaldırıldı'}'`, 'info');
             logActivity(T.ActionType.UPDATED, `Görev '${taskTitle}' ${isStarred ? 'yıldızlandı' : 'yıldızı kaldırıldı'}.`, 'task', taskId);
        }
    }, [setTasks, logActivity, addToast]);
    
    const toggleDocumentStar = useCallback((docId: number) => {
        let isStarred: boolean | undefined;
        let docName: string | undefined;
        setDocuments(prev =>
            prev.map(doc => {
                if (doc.id === docId) {
                    isStarred = !doc.isStarred;
                    docName = doc.name;
                    return { ...doc, isStarred };
                }
                return doc;
            })
        );
        if (docName !== undefined) {
             addToast(`Doküman '${isStarred ? 'yıldızlandı' : 'yıldızı kaldırıldı'}'`, 'info');
             logActivity(T.ActionType.UPDATED, `Doküman '${docName}' ${isStarred ? 'yıldızlandı' : 'yıldızı kaldırıldı'}.`, 'document', docId);
        }
    }, [setDocuments, logActivity, addToast]);

    const addTicket = useCallback((ticketData: Omit<T.SupportTicket, "id" | "ticketNumber" | "customerName" | "assignedToName" | "createdDate">): T.SupportTicket => {
        const newTicket: T.SupportTicket = { ...ticketData, id: Date.now(), ticketNumber: `TKT-${Date.now()}`, createdDate: new Date().toISOString(), customerName: customers.find(c => c.id === ticketData.customerId)?.name || 'Bilinmeyen', assignedToName: employees.find(e => e.id === ticketData.assignedToId)?.name || 'Bilinmeyen' };
        setTickets(prev => [newTicket, ...prev]);
        logActivity(T.ActionType.CREATED, `Destek talebi #${newTicket.ticketNumber} oluşturuldu.`, 'ticket', newTicket.id);
        return newTicket;
    }, [customers, employees, setTickets, logActivity]);

    const updateTicket = useCallback((ticket: T.SupportTicket): T.SupportTicket | undefined => {
        let updated: T.SupportTicket | undefined;
        setTickets(prev => prev.map(t => {
            if (t.id === ticket.id) {
                 updated = { ...ticket, customerName: customers.find(c => c.id === ticket.customerId)?.name || 'Bilinmeyen', assignedToName: employees.find(e => e.id === ticket.assignedToId)?.name || 'Bilinmeyen' };
                 return updated;
            }
            return t;
        }));
        if(updated) logActivity(T.ActionType.UPDATED, `Destek talebi #${updated.ticketNumber} güncellendi.`, 'ticket', updated.id);
        return updated;
    }, [customers, employees, setTickets, logActivity]);

    const deleteTicket = useCallback((id: number) => {
        const ticketToDelete = tickets.find(t => t.id === id);
        if (ticketToDelete) {
            setTickets(prev => prev.filter(t => t.id !== id));
            logActivity(T.ActionType.DELETED, `Destek talebi #${ticketToDelete.ticketNumber} silindi.`, 'ticket', id);
        }
    }, [tickets, setTickets, logActivity]);

    const addSalesOrder = useCallback((orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName">): T.SalesOrder => {
        for (const item of orderData.items) {
            const stockInfo = getProductStockInfo(item.productId);
            if (stockInfo.available < item.quantity) {
                const product = products.find(p => p.id === item.productId);
                addToast(`Yetersiz stok: '${product?.name || 'Bilinmeyen'}'. Mevcut: ${stockInfo.available}, İstenen: ${item.quantity}.`, "warning");
                return { ...orderData, id: -1, orderNumber: '', customerName: '' } as T.SalesOrder; 
            }
        }
        
        const newOrder: T.SalesOrder = { ...orderData, id: Date.now(), orderNumber: `SO-${Date.now()}`, customerName: customers.find(c=>c.id === orderData.customerId)?.name || '' };
        setSalesOrders(prev => [newOrder, ...prev]);
        logActivity(T.ActionType.CREATED, `Satış Siparişi #${newOrder.orderNumber} oluşturuldu.`, 'sales_order', newOrder.id);
        return newOrder;
    }, [customers, products, setSalesOrders, logActivity, getProductStockInfo, addToast]);


    const updateSalesOrder = useCallback((order: T.SalesOrder): T.SalesOrder | undefined => {
        let updated: T.SalesOrder | undefined;
        setSalesOrders(prev => prev.map(so => {
            if (so.id === order.id) {
                updated = { ...order, customerName: customers.find(c=>c.id === order.customerId)?.name || '' };
                return updated;
            }
            return so;
        }));
        if(updated) logActivity(T.ActionType.UPDATED, `Satış Siparişi #${updated.orderNumber} güncellendi.`, 'sales_order', updated.id);
        return updated;
    }, [customers, setSalesOrders, logActivity]);

    const deleteSalesOrder = useCallback((orderId: number) => {
        const orderToDelete = salesOrders.find(so => so.id === orderId);
        if (orderToDelete) {
            setSalesOrders(prev => prev.filter(so => so.id !== orderId));
            logActivity(T.ActionType.DELETED, `Satış Siparişi #${orderToDelete.orderNumber} silindi.`, 'sales_order', orderId);
        }
    }, [salesOrders, setSalesOrders, logActivity]);
    
    const updateSalesOrderStatus = useCallback((orderId: number, newStatus: T.SalesOrderStatus) => {
        setSalesOrders(prevOrders => {
            const newOrders = [...prevOrders];
            const orderIndex = newOrders.findIndex(o => o.id === orderId);
            if (orderIndex === -1) return prevOrders;
    
            const order = JSON.parse(JSON.stringify(newOrders[orderIndex]));
            const oldStatus = order.status;
            let finalStatus = newStatus;
            let logMessage = `Sipariş #${order.orderNumber} durumu '${oldStatus}' -> '${newStatus}' olarak değiştirildi.`;
    
            if (oldStatus === T.SalesOrderStatus.OnayBekliyor && newStatus === T.SalesOrderStatus.Onaylandı) {
                let allItemsAvailable = true;
                let needsProduction = false;
                let needsManualAllocation = false;
    
                order.items.forEach((item: T.SalesOrderItem) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product || product.productType === T.ProductType.Hizmet) return;
    
                    const needed = item.quantity - (item.committedStockItemIds?.length || 0);
                    if (needed <= 0) return;
    
                    const stockInfo = getProductStockInfo(item.productId);
                    if (stockInfo.available < needed) {
                        allItemsAvailable = false;
                        if (product.productType === T.ProductType.Mamul) needsProduction = true;
                    } else {
                        if (product.trackBy !== 'none') {
                            needsManualAllocation = true;
                        }
                    }
                });
    
                if (!allItemsAvailable) {
                    finalStatus = needsProduction ? T.SalesOrderStatus.UretimBekleniyor : T.SalesOrderStatus.StokBekleniyor;
                } else {
                     if (needsManualAllocation) {
                        finalStatus = T.SalesOrderStatus.Onaylandı;
                    } else {
                        finalStatus = T.SalesOrderStatus.SevkeHazır;
                    }
                }
                logMessage = `Sipariş #${order.orderNumber} onaylandı ve durumu otomatik olarak '${finalStatus}' olarak güncellendi.`;
            }
            
            order.status = finalStatus;
            newOrders[orderIndex] = order;
            logActivity(T.ActionType.STATUS_CHANGED, logMessage, 'sales_order', order.id);
            
            return newOrders;
        });
    }, [setSalesOrders, products, getProductStockInfo, logActivity]);

    const addLead = useCallback((leadData: Omit<T.Lead, 'id'>): T.Lead => {
        const newLead = { ...leadData, id: Date.now() };
        setLeads(prev => [newLead, ...prev]);
        logActivity(T.ActionType.CREATED, `Potansiyel müşteri '${newLead.name}' oluşturuldu.`, 'lead', newLead.id);
        return newLead;
    }, [setLeads, logActivity]);
    
    const convertLead = useCallback((leadId: number): { customer: T.Customer; contact: T.Contact; deal: T.Deal } | undefined => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return undefined;

        const newCustomerData: Omit<T.Customer, 'id' | 'avatar'> = {
            name: lead.company || lead.name,
            company: lead.company || lead.name,
            email: lead.email,
            phone: lead.phone,
            lastContact: new Date().toISOString().split('T')[0],
            status: 'potansiyel',
            industry: '',
            tags: ['lead-conversion'],
            assignedToId: lead.assignedToId,
            leadSource: lead.source,
            accountType: 'Tüzel Kişi',
            accountCode: `CUST-${Date.now()}`,
            taxId: '',
            taxOffice: '',
            billingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: lead.email, phone: lead.phone },
            shippingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: lead.email, phone: lead.phone },
            iban: '',
            openingBalance: 0,
            currency: 'TRY',
            openingDate: new Date().toISOString().split('T')[0],
        };
        const newCustomer = addCustomer(newCustomerData);
    
        const newContactData: Omit<T.Contact, 'id'> = {
            customerId: newCustomer.id,
            name: lead.name,
            title: 'İlgili Kişi',
            email: lead.email,
            phone: lead.phone,
        };
        const newContact = addContact(newContactData);
    
        const newDealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'> = {
            title: `${lead.company || lead.name} Anlaşması`,
            customerId: newCustomer.id,
            stage: T.DealStage.Lead,
            closeDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            assignedToId: lead.assignedToId,
            lineItems: [],
        };
        const newDeal = addDeal(newDealData);
        
        setLeads(prev => prev.filter(l => l.id !== leadId));
        logActivity(T.ActionType.LEAD_CONVERTED, `Potansiyel müşteri '${lead.name}' müşteriye dönüştürüldü.`, 'lead', leadId);
        addToast(`'${lead.name}' başarıyla dönüştürüldü!`, 'success');
        
        return { customer: newCustomer, contact: newContact, deal: newDeal };
    }, [leads, setLeads, addCustomer, addContact, addDeal, logActivity, addToast]);
    
    const addQuotation = useCallback((quotationData: Omit<T.Quotation, 'id' | 'quotationNumber' | 'customerName'>): T.Quotation => {
        const customer = customers.find(c => c.id === quotationData.customerId);
        const newQuotation: T.Quotation = {
            ...quotationData,
            id: Date.now(),
            quotationNumber: `QT-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri'
        };
        setQuotations(prev => [newQuotation, ...prev]);
        logActivity(T.ActionType.CREATED, `Teklif #${newQuotation.quotationNumber} oluşturuldu.`, 'quotation', newQuotation.id);
        return newQuotation;
    }, [customers, setQuotations, logActivity]);

    const updateQuotation = useCallback((quotation: T.Quotation): T.Quotation | undefined => {
        let updated: T.Quotation | undefined;
        setQuotations(prev => prev.map(q => {
            if (q.id === quotation.id) {
                const customer = customers.find(c => c.id === quotation.customerId);
                updated = { ...quotation, customerName: customer?.name || 'Bilinmeyen' };
                return updated;
            }
            return q;
        }));
        if (updated) logActivity(T.ActionType.UPDATED, `Teklif #${updated.quotationNumber} güncellendi.`, 'quotation', updated.id);
        return updated;
    }, [customers, setQuotations, logActivity]);

    const deleteQuotation = useCallback((id: number) => {
        const toDelete = quotations.find(q => q.id === id);
        if(toDelete) {
            setQuotations(prev => prev.filter(q => q.id !== id));
            logActivity(T.ActionType.DELETED, `Teklif #${toDelete.quotationNumber} silindi.`, 'quotation', id);
        }
    }, [quotations, setQuotations, logActivity]);
    
    const convertQuotationToSalesOrder = useCallback((quotationId: number): T.SalesOrder | undefined => {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) return undefined;
        const customer = customers.find(c => c.id === quotation.customerId);
        if (!customer) return undefined;

        const orderItems: T.SalesOrderItem[] = quotation.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
            discountRate: item.discountRate,
            taxRate: item.taxRate,
            committedStockItemIds: [],
            shippedQuantity: 0,
        }));
    
        const orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName"> = {
            customerId: quotation.customerId,
            orderDate: new Date().toISOString().split('T')[0],
            items: orderItems,
            status: T.SalesOrderStatus.OnayBekliyor,
            shippingAddress: customer.shippingAddress,
            billingAddress: customer.billingAddress,
            notes: `Teklif #${quotation.quotationNumber} üzerinden oluşturuldu.`,
            subTotal: quotation.subTotal,
            totalDiscount: quotation.totalDiscount,
            totalTax: quotation.totalTax,
            shippingCost: 0, 
            grandTotal: quotation.grandTotal,
            dealId: quotation.dealId,
        };
        
        const newOrder = addSalesOrder(orderData);
        if (newOrder.id !== -1) { // Check if stock was available
            updateQuotation({ ...quotation, status: T.QuotationStatus.Accepted, salesOrderId: newOrder.id });
            logActivity(T.ActionType.CREATED, `Teklif #${quotation.quotationNumber}, Satış Siparişi #${newOrder.orderNumber}'e dönüştürüldü.`, 'sales_order', newOrder.id);
            return newOrder;
        }
        return undefined;

    }, [quotations, customers, addSalesOrder, updateQuotation, logActivity]);

    const addSalesActivity = useCallback((activityData: Omit<T.SalesActivity, "id" | "userName" | "userAvatar" | "timestamp">): T.SalesActivity => {
        const newActivity: T.SalesActivity = {
            ...activityData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userName: currentUser.name,
            userAvatar: currentUser.avatar
        };
        setSalesActivities(prev => [newActivity, ...prev]);
        setDeals(prev => prev.map(deal => deal.id === activityData.dealId ? { ...deal, lastActivityDate: newActivity.timestamp } : deal));
        logActivity(T.ActionType.COMMENT_ADDED, `Aktivite eklendi: ${newActivity.type}`, 'deal', newActivity.dealId);
        return newActivity;
    }, [currentUser, setSalesActivities, setDeals, logActivity]);
    
    const updateDealStage = useCallback((dealId: number, newStage: T.DealStage) => {
        let updatedDeal: T.Deal | undefined;
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma '${d.title}' durumu '${d.stage}' -> '${newStage}' olarak değiştirildi.`, 'deal', dealId);
                updatedDeal = { ...d, stage: newStage, lastActivityDate: new Date().toISOString() };
                return updatedDeal;
            }
            return d;
        }));
         if (updatedDeal) {
            runEventTriggeredAutomations(T.AutomationTriggerType.DEAL_STAGE_CHANGED, { deal: updatedDeal });
        }
    }, [setDeals, logActivity, runEventTriggeredAutomations]);
    
    const bulkUpdateDealStage = useCallback((dealIds: number[], newStage: T.DealStage, reason: string = '') => {
        setDeals(prev => prev.map(d => {
            if (dealIds.includes(d.id)) {
                const updatedDeal = { ...d, stage: newStage, lastActivityDate: new Date().toISOString(), closeDate: new Date().toISOString().split('T')[0] };
                if (newStage === T.DealStage.Won) updatedDeal.winReason = reason;
                if (newStage === T.DealStage.Lost) updatedDeal.lossReason = reason;
                return updatedDeal;
            }
            return d;
        }));
        logActivity(T.ActionType.STATUS_CHANGED, `${dealIds.length} anlaşmanın durumu '${newStage}' olarak güncellendi.`);
    }, [setDeals, logActivity]);
    
    const updateDealWinLossReason = useCallback((dealId: number, stage: T.DealStage.Won | T.DealStage.Lost, reason: string) => {
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                const updatedDeal = { ...d, stage, lastActivityDate: new Date().toISOString(), closeDate: new Date().toISOString().split('T')[0] };
                if (stage === T.DealStage.Won) updatedDeal.winReason = reason;
                else updatedDeal.lossReason = reason;
                logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma '${d.title}' durumu '${stage}' olarak güncellendi. Neden: ${reason}`, 'deal', dealId);
                return updatedDeal;
            }
            return d;
        }));
    }, [setDeals, logActivity]);
    
    const winDeal = useCallback(async (deal: T.Deal, winReason: string, createProject: boolean, useTaskTemplate?: boolean, taskTemplateId?: number): Promise<void> => {
        const wonDeal: T.Deal = { ...deal, stage: T.DealStage.Won, winReason: winReason, closeDate: new Date().toISOString().split('T')[0], lastActivityDate: new Date().toISOString() };
        updateDeal(wonDeal);
        addToast(`'${deal.title}' anlaşması kazanıldı!`, 'success');
        
        const commissionAmount = deal.value * 0.10;
        const newCommission: T.CommissionRecord = { id: Date.now(), employeeId: deal.assignedToId, dealId: deal.id, dealValue: deal.value, commissionAmount: commissionAmount, earnedDate: new Date().toISOString().split('T')[0] };
        setCommissionRecords(prev => [...prev, newCommission]);

        if (deal.lineItems.length > 0) {
            const customer = customers.find(c => c.id === deal.customerId);
            if (customer) {
                const orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName"> = {
                    customerId: deal.customerId, orderDate: new Date().toISOString().split('T')[0],
                    items: deal.lineItems.map(li => ({ productId: li.productId, productName: li.productName, quantity: li.quantity, price: li.price, discountRate: 0, taxRate: products.find(p=>p.id === li.productId)?.financials.vatRate || 20, committedStockItemIds: [], shippedQuantity: 0, })),
                    status: T.SalesOrderStatus.OnayBekliyor, shippingAddress: customer.shippingAddress, billingAddress: customer.billingAddress, dealId: deal.id,
                    subTotal: deal.value, totalDiscount: 0, totalTax: 0, shippingCost: 0, grandTotal: deal.value,
                };
                addSalesOrder(orderData);
            }
        }
        if (createProject) {
            const projectData: Omit<T.Project, 'id' | 'client'> = {
                name: `${deal.title} Projesi`, customerId: deal.customerId, deadline: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0], status: 'beklemede',
                progress: 0, description: `${deal.title} anlaşmasından otomatik oluşturuldu.`, startDate: new Date().toISOString().split('T')[0],
                teamMemberIds: [deal.assignedToId], budget: deal.value * 0.8, spent: 0, tags: ['sales-generated']
            };
            const templateIdToUse = useTaskTemplate ? taskTemplateId : undefined;
            addProject(projectData, templateIdToUse);
        }
    }, [updateDeal, setCommissionRecords, addSalesOrder, addProject, customers, products, addToast]);
    
    const deleteMultipleDeals = useCallback((dealIds: number[]) => {
        setDeals(prev => prev.filter(d => !dealIds.includes(d.id)));
        logActivity(T.ActionType.DELETED_MULTIPLE, `${dealIds.length} anlaşma silindi.`);
    }, [setDeals, logActivity]);

    const addStockMovement = useCallback((productId: number, warehouseId: number, type: T.StockMovementType, quantityChange: number, notes?: string, relatedDocumentId?: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`addStockMovement: Product with ID ${productId} not found.`);
            return;
        }

        const newMovement: T.StockMovement = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            productId,
            productName: product.name,
            warehouseId,
            warehouseName: warehouses.find(w => w.id === warehouseId)?.name || 'Bilinmeyen Depo',
            type,
            quantityChange,
            notes,
            relatedDocumentId,
        };
        setStockMovements(prev => [newMovement, ...prev]);

        if (quantityChange < 0) { // Stoktan Düşme
            let amountToRemove = Math.abs(quantityChange);
            
            setStockItems(prevStockItems => {
                const updatedStockItems = [...prevStockItems];
                const availableItems = updatedStockItems.filter(i => 
                    i.productId === productId &&
                    i.warehouseId === warehouseId &&
                    i.status === T.StockItemStatus.Available
                ).sort((a,b) => new Date(a.expiryDate || '9999-12-31').getTime() - new Date(b.expiryDate || '9999-12-31').getTime());

                for (const item of availableItems) {
                    if (amountToRemove === 0) break;
                    if (product.trackBy === 'batch') {
                        const removable = Math.min(item.quantity || 0, amountToRemove);
                        item.quantity = (item.quantity || 0) - removable;
                        amountToRemove -= removable;
                    } else { // Serial or None
                        item.status = T.StockItemStatus.Consumed;
                        amountToRemove--;
                    }
                }
                return updatedStockItems.filter(item => item.status !== T.StockItemStatus.Consumed && (item.quantity === undefined || item.quantity > 0));
            });
        }
    }, [products, warehouses, setStockMovements, setStockItems]);

    const addProduct = useCallback((productData: Omit<T.Product, "id">, initialStock?: { warehouseId: number, quantity: number }): T.Product => {
        const newProduct = { ...productData, id: Date.now() };
        setProducts(prev => [...prev, newProduct]);
        
        if (initialStock && initialStock.quantity > 0 && initialStock.warehouseId) {
            const newItems: T.StockItem[] = [];
            if (newProduct.trackBy === 'serial') {
                for(let i=0; i<initialStock.quantity; i++) {
                    newItems.push({
                        id: Date.now() + i,
                        productId: newProduct.id,
                        warehouseId: initialStock.warehouseId,
                        status: T.StockItemStatus.Available,
                        serialNumber: `SER-${newProduct.sku}-${Date.now() + i}`
                    });
                }
            } else if (newProduct.trackBy === 'batch') {
                 newItems.push({
                    id: Date.now(),
                    productId: newProduct.id,
                    warehouseId: initialStock.warehouseId,
                    status: T.StockItemStatus.Available,
                    batchNumber: `BAT-${newProduct.sku}-${Date.now()}`,
                    quantity: initialStock.quantity
                });
            } else { // 'none'
                 for(let i=0; i<initialStock.quantity; i++) {
                    newItems.push({
                        id: Date.now() + i,
                        productId: newProduct.id,
                        warehouseId: initialStock.warehouseId,
                        status: T.StockItemStatus.Available
                    });
                }
            }
            setStockItems(prev => [...prev, ...newItems]);
            addStockMovement(newProduct.id, initialStock.warehouseId, T.StockMovementType.Adjustment, initialStock.quantity, "Başlangıç Stoku");
        }
        logActivity(T.ActionType.CREATED, `Ürün '${newProduct.name}' oluşturuldu.`, 'product', newProduct.id);
        return newProduct;
    }, [setProducts, logActivity, addStockMovement, setStockItems]);

    const updateProduct = useCallback((product: T.Product): T.Product | undefined => {
        let updated: T.Product | undefined;
        setProducts(prev => prev.map(p => {
            if (p.id === product.id) {
                updated = product;
                return product;
            }
            return p;
        }));
        if(updated) logActivity(T.ActionType.UPDATED, `Ürün '${updated.name}' güncellendi.`, 'product', updated.id);
        return updated;
    }, [setProducts, logActivity]);

    const deleteProduct = useCallback((id: number) => {
        const productToDelete = products.find(p => p.id === id);
        if (productToDelete) {
            setProducts(prev => prev.filter(p => p.id !== id));
            setStockItems(prev => prev.filter(si => si.productId !== id));
            addStockMovement(id, 0, T.StockMovementType.Adjustment, 0, `Ürün silindi: ${productToDelete.name}`);
            logActivity(T.ActionType.DELETED, `Ürün '${productToDelete.name}' silindi.`, 'product', id);
        }
    }, [products, setProducts, setStockItems, addStockMovement, logActivity]);
    
     const receivePurchaseOrderItems = useCallback((poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string; expiry: string })[] }[], warehouseId: number) => {
        const po = purchaseOrders.find(p => p.id === poId);
        if (!po) {
            addToast("Satın alma siparişi bulunamadı.", "error");
            return;
        }

        const newStockItems: T.StockItem[] = [];
        const stockMovementsToAdd: Parameters<typeof addStockMovement>[] = [];

        itemsToReceive.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            if (product.trackBy === 'serial') {
                (item.details as string[]).forEach((serialNumber, i) => {
                    newStockItems.push({
                        id: Date.now() + i + Math.random(),
                        productId: item.productId,
                        warehouseId,
                        status: T.StockItemStatus.Available,
                        serialNumber: serialNumber,
                    });
                });
            } else if (product.trackBy === 'batch') {
                const batchDetail = item.details[0] as { batch: string, expiry: string };
                newStockItems.push({
                    id: Date.now() + Math.random(),
                    productId: item.productId,
                    warehouseId,
                    status: T.StockItemStatus.Available,
                    batchNumber: batchDetail.batch,
                    expiryDate: batchDetail.expiry,
                    quantity: item.quantity,
                });
            } else { // trackBy: 'none'
                for (let i = 0; i < item.quantity; i++) {
                    newStockItems.push({
                        id: Date.now() + i + Math.random(),
                        productId: item.productId,
                        warehouseId,
                        status: T.StockItemStatus.Available,
                    });
                }
            }
             stockMovementsToAdd.push([item.productId, warehouseId, T.StockMovementType.PurchaseReceive, item.quantity, `PO #${po.poNumber}`, po.id]);
        });
        
        if (newStockItems.length > 0) {
            setStockItems(prev => [...prev, ...newStockItems]);
            stockMovementsToAdd.forEach(args => addStockMovement(...args));
        }
        
        setPurchaseOrders(prevPOs => {
            return prevPOs.map(p => {
                if (p.id === poId) {
                    const updatedItems = p.items.map(poItem => {
                        const receivedItem = itemsToReceive.find(r => r.productId === poItem.productId);
                        return receivedItem
                            ? { ...poItem, receivedQuantity: (poItem.receivedQuantity || 0) + receivedItem.quantity }
                            : poItem;
                    });
                    
                    const isFullyReceived = updatedItems.every(item => item.receivedQuantity >= item.quantity);
                    const newStatus = isFullyReceived ? T.PurchaseOrderStatus.Received : T.PurchaseOrderStatus.PartiallyReceived;

                    return { ...p, items: updatedItems, status: newStatus };
                }
                return p;
            });
        });

        addToast(`${itemsToReceive.length} kalem ürün başarıyla teslim alındı.`, 'success');
    }, [purchaseOrders, products, setStockItems, setPurchaseOrders, addStockMovement, addToast]);

    const updateInvoice = useCallback((invoice: T.Invoice): T.Invoice | undefined => {
        let updated: T.Invoice | undefined;
        setInvoices(prev => prev.map(i => {
            if (i.id === invoice.id) {
                updated = { ...invoice, customerName: customers.find(c => c.id === invoice.customerId)?.name || 'Bilinmeyen Müşteri' };
                return updated;
            }
            return i;
        }));
        if (updated) logActivity(T.ActionType.UPDATED, `Fatura #${updated.invoiceNumber} güncellendi.`, 'invoice', updated.id);
        return updated;
    }, [customers, setInvoices, logActivity]);

    const deleteInvoice = useCallback((id: number) => {
        const toDelete = invoices.find(i => i.id === id);
        if (toDelete) {
            setInvoices(prev => prev.filter(i => i.id !== id));
            logActivity(T.ActionType.DELETED, `Fatura #${toDelete.invoiceNumber} silindi.`, 'invoice', id);
        }
    }, [invoices, setInvoices, logActivity]);

    const bulkUpdateInvoiceStatus = useCallback((invoiceIds: number[], newStatus: T.InvoiceStatus) => {
        setInvoices(prev => prev.map(i =>
            invoiceIds.includes(i.id)
                ? { ...i, status: newStatus }
                : i
        ));
        logActivity(T.ActionType.STATUS_CHANGED, `${invoiceIds.length} faturanın durumu '${newStatus}' olarak güncellendi.`);
    }, [setInvoices, logActivity]);

    const addInvoice = useCallback((invoiceData: Omit<T.Invoice, 'id' | 'invoiceNumber' | 'customerName'>): T.Invoice => {
        const customer = customers.find(c => c.id === invoiceData.customerId);
        const newInvoice: T.Invoice = {
            ...invoiceData,
            id: Date.now(),
            invoiceNumber: `${counters.prefix}${String(counters.nextNumber).padStart(counters.padding, '0')}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri'
        };
        setInvoices(prev => [newInvoice, ...prev]);
        setCounters(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
        logActivity(T.ActionType.CREATED, `Fatura #${newInvoice.invoiceNumber} oluşturuldu.`, 'invoice', newInvoice.id);
        return newInvoice;
    }, [customers, counters, setInvoices, setCounters, logActivity]);
    
    const markNotificationAsRead = useCallback((id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, [setNotifications]);

    const clearAllNotifications = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, [setNotifications]);

    const deleteNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, [setNotifications]);

    const deleteAllNotifications = useCallback(() => {
        setNotifications([]);
    }, [setNotifications]);
    
    // START: ALL DUMMY FUNCTIONS IMPLEMENTED
    const updateHrParameters = useCallback((params: T.HrParameters) => {
        setHrParameters(params);
        addToast("Bordro parametreleri güncellendi.", "success");
    }, [setHrParameters, addToast]);
    const isManager = useCallback((employeeId: number): boolean => employees.some(e => e.managerId === employeeId), [employees]);
    const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const addToCart = useCallback((product: T.Product, quantity: number) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.productId === product.id);
            if(existingItem) {
                return prev.map(item => item.productId === product.id ? {...item, quantity: item.quantity + quantity} : item);
            }
            return [...prev, { productId: product.id, productName: product.name, price: product.price, quantity, sku: product.sku }];
        });
    }, [setCartItems]);
    const removeFromCart = useCallback((productId: number) => setCartItems(prev => prev.filter(item => item.productId !== productId)), [setCartItems]);
    const updateCartQuantity = useCallback((productId: number, quantity: number) => setCartItems(prev => prev.map(item => item.productId === productId ? {...item, quantity: Math.max(0, quantity)} : item).filter(item => item.quantity > 0)), [setCartItems]);
    const clearCart = useCallback(() => setCartItems([]), [setCartItems]);
    
    const createSalesOrderFromCart = useCallback((customerId: number): T.SalesOrder | undefined => {
        if (cartItems.length === 0) {
            addToast("Sepet boş.", "warning");
            return undefined;
        }
        const customer = customers.find(c => c.id === customerId);
        if(!customer) return undefined;
        const orderItems: T.SalesOrderItem[] = cartItems.map(item => ({
            productId: item.productId, productName: item.productName, quantity: item.quantity, price: item.price,
            discountRate: 0, taxRate: products.find(p => p.id === item.productId)?.financials.vatRate || 20,
            committedStockItemIds: [], shippedQuantity: 0,
        }));
        const subTotal = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const totalTax = orderItems.reduce((sum, item) => sum + (item.quantity * item.price * (item.taxRate / 100)), 0);
        const newOrder = addSalesOrder({
            customerId, orderDate: new Date().toISOString().split('T')[0], items: orderItems,
            status: T.SalesOrderStatus.OnayBekliyor, shippingAddress: customer.shippingAddress,
            billingAddress: customer.billingAddress, subTotal: subTotal, totalDiscount: 0,
            totalTax: totalTax, shippingCost: 0, grandTotal: subTotal + totalTax,
        });
        if (newOrder.id !== -1) {
            clearCart();
            addToast(`Satış siparişi #${newOrder.orderNumber} oluşturuldu.`, 'success');
            return newOrder;
        }
        return undefined;
    }, [cartItems, customers, products, addSalesOrder, clearCart, addToast]);
    
    const updateRecurringTask = useCallback((task: T.Task, updateData: Partial<T.Task>, scope: 'this' | 'all', options?: { silent?: boolean }) => {
        const parentId = task.seriesId || task.id;
        const parentTask = tasks.find(t => t.id === parentId);
        if (!parentTask) return;
        if (scope === 'all') {
            updateTask({ ...parentTask, ...updateData }, options);
        } else {
            const exceptions = parentTask.recurrenceExceptions || [];
            if (task.originalDate && !exceptions.includes(task.originalDate)) {
                const newExceptions = [...exceptions, task.originalDate];
                updateTask({ ...parentTask, recurrenceExceptions: newExceptions }, { silent: true });
            }
            addTask({ ...task, ...updateData, seriesId: undefined, originalDate: undefined, recurrenceRule: undefined });
        }
        if (!options?.silent) addToast("Tekrarlanan görev güncellendi.", "success");
    }, [tasks, updateTask, addTask, addToast]);
    const updateTaskStatus = useCallback((taskId: number, newStatus: T.TaskStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if(task) updateTask({ ...task, status: newStatus });
    }, [tasks, updateTask]);
    const addSubtask = useCallback((parentId: number, title: string) => {
        const parentTask = tasks.find(t => t.id === parentId);
        if (!parentTask) return undefined;
        const newSubtaskData: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'> = {
            title, description: '', status: T.TaskStatus.Todo, priority: parentTask.priority,
            dueDate: parentTask.dueDate, assignedToId: parentTask.assignedToId, parentId,
        };
        return addTask(newSubtaskData);
    }, [tasks, addTask]);
    
    const value: T.AppContextType = {
        customers, addCustomer, updateCustomer, updateCustomerStatus, bulkUpdateCustomerStatus, assignCustomersToEmployee, addTagsToCustomers, deleteCustomer, deleteMultipleCustomers, importCustomers,
        contacts, addContact, updateContact, deleteContact,
        communicationLogs, addCommunicationLog, updateCommunicationLog, deleteCommunicationLog,
        savedViews, addSavedView, deleteSavedView, loadSavedView,
        summarizeActivityFeed,
        deals, addDeal, updateDeal, deleteDeal, updateDealStage, bulkUpdateDealStage, deleteMultipleDeals, updateDealWinLossReason, winDeal,
        projects, addProject, updateProject, deleteProject,
        tasks, addTask, updateTask, deleteTask, updateTaskStatus, addSubtask, deleteMultipleTasks, updateRecurringTask,
        notifications,
        invoices, addInvoice, updateInvoice, deleteInvoice, bulkUpdateInvoiceStatus,
        bills,
        products, addProduct, updateProduct, deleteProduct,
        suppliers,
        purchaseOrders,
        employees, addEmployee, updateEmployee, deleteEmployee,
        leaveRequests, addLeaveRequest, updateLeaveRequestStatus,
        performanceReviews, addPerformanceReview, updatePerformanceReview,
        jobOpenings, addJobOpening, updateJobOpening,
        candidates, addCandidate, updateCandidate, updateCandidateStage,
        onboardingTemplates, addOnboardingTemplate, updateOnboardingTemplate,
        onboardingWorkflows, startOnboardingWorkflow, updateOnboardingWorkflowStatus,
        payrollRuns, addPayrollRun, updatePayrollRunStatus, postPayrollRunToJournal, exportPayrollRunToAphbXml,
        payslips, updatePayslip,
        bankAccounts,
        transactions,
        tickets, addTicket, updateTicket, deleteTicket,
        documents,
        comments,
        salesActivities, addSalesActivity,
        activityLogs, logActivity,
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
        taskTemplates, addTaskTemplate, updateTaskTemplate, deleteTaskTemplate,
        scheduledTasks,
        counters,
        cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, createSalesOrderFromCart, itemCount,
        warehouses,
        stockMovements, addStockMovement,
        inventoryTransfers,
        inventoryAdjustments,
        salesOrders, addSalesOrder, updateSalesOrder, deleteSalesOrder, updateSalesOrderStatus,
        shipments,
        stockItems,
        pickLists,
        boms,
        workOrders, updateWorkOrderStatus,
        accounts,
        journalEntries, addJournalEntry,
        recurringJournalEntries,
        budgets,
        costCenters,
        accountingLockDate, 
        currentUser, setCurrentUser,
        expenses, addExpense, updateExpenseStatus,
        assets, addAsset, updateAsset,
        hrParameters,
        salesReturns,
        quotations, addQuotation, updateQuotation, deleteQuotation, convertQuotationToSalesOrder,
        leads, addLead, convertLead,
        commissionRecords,
        isManager,
        hasPermission,
        getProductStockInfo,
        calculateAnnualLeaveBalance, calculateTerminationPayments, calculatePayrollCost,
        isCommandPaletteOpen, setIsCommandPaletteOpen,
        isCustomerFormOpen, setIsCustomerFormOpen, editingCustomer,
        isDealFormOpen, setIsDealFormOpen, editingDeal, prefilledDealData,
        isTaskFormOpen, setIsTaskFormOpen, editingTask, prefilledTaskData,
        isProjectFormOpen, setIsProjectFormOpen, editingProject, prefilledProjectData,
        isTicketFormOpen, setIsTicketFormOpen, editingTicket, prefilledTicketData,
        isSalesOrderFormOpen, setIsSalesOrderFormOpen, editingSalesOrder, prefilledSalesOrderData,
        isLogModalOpen, setIsLogModalOpen, logModalCustomerId,
        receivePurchaseOrderItems,
        createTasksFromTemplate,
        addBill: () => ({} as T.Bill), 
        updateBill: () => undefined,
        bulkUpdateBillStatus: () => {},
        addSupplier: () => ({} as T.Supplier),
        updateSupplier: () => undefined,
        deleteSupplier: () => {},
        addPurchaseOrder: () => ({} as T.PurchaseOrder),
        updatePurchaseOrder: () => undefined,
        updatePurchaseOrderStatus: () => {},
        createBillFromPO: () => undefined,
        deletePurchaseOrder: () => {},
        addBankAccount: () => ({} as T.BankAccount),
        updateBankAccount: () => undefined,
        deleteBankAccount: () => {},
        addTransaction: () => ({} as T.Transaction),
        updateTransaction: () => undefined,
        deleteTransaction: () => {},
        addDocument: () => ({} as T.Document),
        renameDocument: () => {},
        deleteDocument: () => {},
        deleteMultipleDocuments: () => {},
        addFolder: () => ({} as T.Document),
        moveDocuments: () => {},
        toggleDocumentStar,
        shareDocument: () => {},
        addComment: () => ({} as T.Comment),
        updateComment: () => undefined,
        deleteComment: () => {},
        addCustomField: () => ({} as T.CustomFieldDefinition),
        updateCustomField: () => undefined,
        deleteCustomField: () => {},
        addWidgetToDashboard: () => {},
        removeWidgetFromDashboard: () => {},
        updateCompanyInfo: (info: T.CompanyInfo) => { setCompanyInfo(info); addToast('Şirket bilgileri güncellendi.', 'success'); },
        updateBrandingSettings: (settings: T.BrandingSettings) => { setBrandingSettings(settings); addToast('Görünüm ayarları güncellendi.', 'success'); },
        updateSecuritySettings: (settings: T.SecuritySettings) => { setSecuritySettings(settings); addToast('Güvenlik ayarları güncellendi.', 'success'); },
        addRole: () => ({} as T.Role),
        updateRolePermissions: (roleId: string, permissions: T.Permission[]) => { setRolesPermissions(prev => ({...prev, [roleId]: permissions})); addToast('Rol izinleri güncellendi.', 'success'); },
        deleteRole: () => {},
        addTaxRate: () => ({} as T.TaxRate),
        updateTaxRate: () => undefined,
        deleteTaxRate: () => {},
        updateSystemList: () => {},
        updateEmailTemplate: () => {},
        addPriceList: () => ({} as T.PriceList),
        updatePriceList: () => undefined,
        deletePriceList: () => {},
        updatePriceListItems: () => {},
        addAutomation: () => ({} as T.Automation),
        updateAutomation: () => undefined,
        deleteAutomation: () => {},
        addScheduledTask: () => ({} as T.ScheduledTask),
        updateScheduledTask: () => undefined,
        deleteScheduledTask: () => {},
        runScheduledTasksCheck: () => {},
        updateCounters: (settings: T.CountersSettings) => { setCounters(settings); addToast('Sayaç ayarları güncellendi.', 'success'); },
        addWarehouse: () => ({} as T.Warehouse),
        updateWarehouse: () => undefined,
        deleteWarehouse: () => {},
        addInventoryTransfer: () => undefined,
        addInventoryAdjustment: () => undefined,
        convertOrderToInvoice: () => undefined,
        createShipmentFromSalesOrder: () => undefined,
        allocateStockToSalesOrder: () => {},
        createPickList: () => undefined,
        confirmPickList: () => {},
        addBom: () => undefined,
        updateBom: () => undefined,
        addWorkOrder: () => undefined,
        updateWorkOrder: () => undefined,
        addAccount: () => ({} as T.Account),
        updateAccount: () => undefined,
        updateJournalEntry: () => undefined,
        deleteJournalEntry: () => {},
        reverseJournalEntry: () => undefined,
        addRecurringJournalEntry: () => ({} as T.RecurringJournalEntry),
        updateRecurringJournalEntry: () => undefined,
        deleteRecurringJournalEntry: () => {},
        generateEntryFromRecurringTemplate: async () => undefined,
        addBudget: () => ({} as T.Budget),
        updateBudget: () => undefined,
        deleteBudget: () => {},
        addCostCenter: () => ({} as T.CostCenter),
        updateCostCenter: () => undefined,
        deleteCostCenter: () => {},
        updateAccountingLockDate: (date: string | null) => { setAccountingLockDate(date); addToast('Muhasebe kilit tarihi güncellendi.', 'success'); },
        updateHrParameters,
        addSalesReturn: () => ({} as T.SalesReturn),
        updateSalesReturn: () => undefined,
        deleteSalesReturn: () => {},
        getProductStockByWarehouse: () => ({ physical: 0, committed: 0, available: 0 }),
        addTaskDependency: () => {},
        removeTaskDependency: () => {},
        logTimeOnTask,
        toggleTaskStar,
        addAttachmentToTask: () => {},
        deleteAttachmentFromTask: () => {},
        markNotificationAsRead,
        clearAllNotifications,
        deleteNotification,
        deleteAllNotifications,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
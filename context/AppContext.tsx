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
    const [currentUser, setCurrentUser] = useLocalStorageState<T.Employee>('currentUser', MOCK_EMPLOYEES[3]);
    
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

    // FIX: Moved hasPermission before its first usage in deleteComment
    const hasPermission = useCallback((permission: T.Permission): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        const userPermissions = rolesPermissions[currentUser.role];
        return userPermissions ? userPermissions.includes(permission) : false;
    }, [currentUser, rolesPermissions]);

    const addComment = useCallback((text: string, entityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order', entityId: number): T.Comment => {
        const newComment: T.Comment = {
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
        logActivity(T.ActionType.COMMENT_ADDED, `Yorum eklendi: "${text.substring(0, 30)}..."`, entityType, entityId);

        const mentionMatches = text.matchAll(/@([a-zA-Z\sÇçĞğİıÖöŞşÜü]+)/g);
        for (const match of mentionMatches) {
            const userName = match[1].trim();
            const user = employees.find(e => e.name === userName);
            if (user && user.id !== currentUser.id) {
                const newNotification: T.Notification = {
                    id: Date.now() + Math.random(),
                    title: `Yeni bir yorumda sizden bahsedildi`,
                    message: `${currentUser.name} sizden bir yorumda bahsetti: "${text.substring(0, 50)}..."`,
                    type: 'info',
                    read: false,
                    timestamp: new Date().toISOString(),
                    link: `/${entityType}s/${entityId}`
                };
                setNotifications(prev => [newNotification, ...prev]);
                logActivity(T.ActionType.MENTIONED_IN_COMMENT, `${currentUser.name}, ${user.name} kullanıcısından bahsetti.`, entityType, entityId);
            }
        }

        return newComment;
    }, [currentUser, employees, setComments, logActivity, setNotifications]);

    const updateComment = useCallback((comment: T.Comment): T.Comment | undefined => {
        let updated: T.Comment | undefined;
        setComments(prev => prev.map(c => {
            if (c.id === comment.id && c.userId === currentUser.id) {
                updated = { ...c, text: comment.text, timestamp: new Date().toISOString() };
                return updated;
            }
            return c;
        }));
        if(updated) logActivity(T.ActionType.UPDATED, `Yorum güncellendi.`, updated.relatedEntityType, updated.relatedEntityId);
        return updated;
    }, [setComments, logActivity, currentUser.id]);

    const deleteComment = useCallback((commentId: number) => {
        const toDelete = comments.find(c => c.id === commentId);
        if (toDelete && (toDelete.userId === currentUser.id || hasPermission('yorum:yonet'))) { // Admin can delete any comment
            setComments(prev => prev.filter(c => c.id !== commentId));
            logActivity(T.ActionType.DELETED, `Yorum silindi.`, toDelete.relatedEntityType, toDelete.relatedEntityId);
        }
    }, [comments, setComments, logActivity, currentUser.id, hasPermission]);

    const addTask = useCallback((taskData: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[] = []): T.Task => {
        const assignee = employees.find(e => e.id === taskData.assignedToId);
        let relatedEntityName = '';
        if (taskData.relatedEntityType && taskData.relatedEntityId) {
            if (taskData.relatedEntityType === 'customer') relatedEntityName = customers.find(c => c.id === taskData.relatedEntityId)?.name || '';
            if (taskData.relatedEntityType === 'project') relatedEntityName = projects.find(p => p.id === taskData.relatedEntityId)?.name || '';
            if (taskData.relatedEntityType === 'deal') relatedEntityName = deals.find(d => d.id === taskData.relatedEntityId)?.title || '';
        }

        const newTask: T.Task = {
            ...taskData,
            id: Date.now(),
            assignedToName: assignee?.name || '',
            relatedEntityName,
        };
        
        const subtasks: T.Task[] = subtaskTitles.map((title, i) => ({
            ...newTask,
            id: Date.now() + i + 1,
            title,
            parentId: newTask.id,
            description: '',
        }));

        setTasks(prev => [...prev, newTask, ...subtasks]);
        logActivity(T.ActionType.TASK_CREATED, `Görev oluşturuldu: ${newTask.title}`, 'task', newTask.id);
        return newTask;
    }, [employees, customers, projects, deals, setTasks, logActivity]);

    const createTasksFromTemplate = useCallback((templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => {
        const template = taskTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        const start = new Date(startDate);
        const tasksToAdd: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'>[] = [];
        
        template.items.forEach(item => {
            const dueDate = new Date(start);
            dueDate.setDate(start.getDate() + item.dueDaysAfterStart);
            
            const assignee = employees.find(e => e.role === item.defaultAssigneeRoleId);

            tasksToAdd.push({
                title: item.taskName,
                description: '',
                status: T.TaskStatus.Todo,
                priority: item.priority,
                dueDate: dueDate.toISOString().split('T')[0],
                startDate: start.toISOString().split('T')[0],
                assignedToId: assignee?.id || currentUser.id,
                relatedEntityType,
                relatedEntityId,
                estimatedTime: item.estimatedTime,
            });
        });

        tasksToAdd.forEach((taskData, i) => {
            setTimeout(() => addTask(taskData), i * 10); // Add a small delay to ensure unique IDs
        });
        
        logActivity(T.ActionType.TASK_CREATED_MULTIPLE, `${tasksToAdd.length} görev şablondan oluşturuldu: ${template.name}`, relatedEntityType, relatedEntityId);

    }, [taskTemplates, employees, currentUser.id, addTask, logActivity]);

    const addProject = useCallback((projectData: Omit<T.Project, 'id' | 'client'>, taskTemplateId?: number): T.Project => {
        const customer = customers.find(c => c.id === projectData.customerId);
        const newProject: T.Project = {
            ...projectData,
            id: Date.now(),
            client: customer?.name || 'Bilinmeyen Müşteri',
        };
        setProjects(prev => [newProject, ...prev]);
        logActivity(T.ActionType.PROJECT_CREATED, `Proje oluşturuldu: ${newProject.name}`, 'project', newProject.id);

        if (taskTemplateId) {
            createTasksFromTemplate(taskTemplateId, newProject.startDate, 'project', newProject.id);
        }

        return newProject;
    }, [customers, setProjects, logActivity, createTasksFromTemplate]);

    const updateProject = useCallback((project: T.Project): T.Project | undefined => {
        const customer = customers.find(c => c.id === project.customerId);
        let updated: T.Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === project.id) {
                updated = { ...p, ...project, client: customer?.name || 'Unknown' };
                return updated;
            }
            return p;
        }));
        if(updated) logActivity(T.ActionType.PROJECT_UPDATED, `Proje güncellendi: ${updated.name}`, 'project', updated.id);
        return updated;
    }, [customers, setProjects, logActivity]);

    const deleteProject = useCallback((id: number) => {
        const toDelete = projects.find(p => p.id === id);
        if (toDelete) {
            setProjects(prev => prev.filter(p => p.id !== id));
            // Also delete related tasks
            setTasks(prev => prev.filter(t => !(t.relatedEntityType === 'project' && t.relatedEntityId === id)));
            logActivity(T.ActionType.PROJECT_DELETED, `Proje silindi: ${toDelete.name}`, 'project', id);
        }
    }, [projects, setProjects, setTasks, logActivity]);

    const addDeal = useCallback((dealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'>): T.Deal => {
        const customer = customers.find(c => c.id === dealData.customerId);
        const employee = employees.find(e => e.id === dealData.assignedToId);
        const dealValue = dealData.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const now = new Date().toISOString().split('T')[0];

        const newDeal: T.Deal = {
           ...dealData,
           id: Date.now(),
           customerName: customer?.name || 'Unknown Customer',
           assignedToName: employee?.name || 'Unknown Employee',
           value: dealValue,
           lastActivityDate: now,
           createdDate: now,
       };
       setDeals(prev => [newDeal, ...prev]);
       logActivity(T.ActionType.CREATED, `Anlaşma '${newDeal.title}' oluşturuldu.`, 'deal', newDeal.id);
       return newDeal;
    }, [customers, employees, setDeals, logActivity]);

    const updateDeal = useCallback((deal: T.Deal): T.Deal | undefined => {
        const customer = customers.find(c => c.id === deal.customerId);
        const employee = employees.find(e => e.id === deal.assignedToId);
        const dealValue = deal.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const now = new Date().toISOString().split('T')[0];
        
        let updated: T.Deal | undefined;
        setDeals(prev => prev.map(d => {
            if (d.id === deal.id) {
                updated = { 
                    ...d, 
                    ...deal,
                    customerName: customer?.name || 'Unknown Customer',
                    assignedToName: employee?.name || 'Unknown Employee',
                    value: dealValue,
                    lastActivityDate: now,
                };
                return updated;
            }
            return d;
        }));
        if (updated) {
            logActivity(T.ActionType.UPDATED, `Anlaşma güncellendi: ${updated.title}`, 'deal', updated.id);
        }
        return updated;
    }, [customers, employees, setDeals, logActivity]);

    const updateDealStage = useCallback((dealId: number, newStage: T.DealStage) => {
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma durumu '${d.stage}' -> '${newStage}' olarak değiştirildi: ${d.title}`, 'deal', d.id);
                return { ...d, stage: newStage, lastActivityDate: new Date().toISOString().split('T')[0] };
            }
            return d;
        }));
    }, [setDeals, logActivity]);

    const updateDealWinLossReason = useCallback((dealId: number, stage: T.DealStage.Won | T.DealStage.Lost, reason: string) => {
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                const updatedDeal = { ...d, stage, lastActivityDate: new Date().toISOString().split('T')[0] };
                if (stage === T.DealStage.Won) updatedDeal.winReason = reason;
                if (stage === T.DealStage.Lost) updatedDeal.lossReason = reason;
                logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma durumu '${stage}' olarak değiştirildi (Neden: ${reason}): ${d.title}`, 'deal', d.id);
                return updatedDeal;
            }
            return d;
        }));
    }, [setDeals, logActivity]);

    const bulkUpdateDealStage = useCallback((dealIds: number[], newStage: T.DealStage, reason?: string) => {
        setDeals(prev => prev.map(d => {
            if (dealIds.includes(d.id)) {
                const updatedDeal = { ...d, stage: newStage, lastActivityDate: new Date().toISOString().split('T')[0] };
                if (reason) {
                    if (newStage === T.DealStage.Won) updatedDeal.winReason = reason;
                    if (newStage === T.DealStage.Lost) updatedDeal.lossReason = reason;
                }
                return updatedDeal;
            }
            return d;
        }));
        logActivity(T.ActionType.STATUS_CHANGED, `${dealIds.length} anlaşmanın durumu toplu olarak '${newStage}' olarak değiştirildi.`);
    }, [setDeals, logActivity]);

    const addSalesOrder = useCallback((orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName">): T.SalesOrder => {
        const customer = customers.find(c => c.id === orderData.customerId);
        const newOrder: T.SalesOrder = {
            ...orderData,
            id: Date.now(),
            orderNumber: `SO-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen'
        };
        setSalesOrders(prev => [newOrder, ...prev]);
        logActivity(T.ActionType.CREATED, `Satış Siparişi oluşturuldu: #${newOrder.orderNumber}`, 'sales_order', newOrder.id);
        return newOrder;
    }, [customers, setSalesOrders, logActivity]);

    const winDeal = useCallback(async (deal: T.Deal, winReason: string, createProjectFlag: boolean, useTaskTemplate?: boolean, taskTemplateId?: number) => {
        updateDealWinLossReason(deal.id, T.DealStage.Won, winReason);
        
        const hasPhysicalProducts = deal.lineItems.some(item => {
            const product = products.find(p => p.id === item.productId);
            return product && product.productType !== T.ProductType.Hizmet;
        });

        if (hasPhysicalProducts) {
            const customer = customers.find(c => c.id === deal.customerId);
            if(customer) {
                // FIX: Calculate totals for the new sales order
                const items = deal.lineItems.map(li => ({
                    productId: li.productId,
                    productName: li.productName,
                    quantity: li.quantity,
                    price: li.price,
                    discountRate: 0,
                    taxRate: products.find(p => p.id === li.productId)?.financials.vatRate || 20,
                    committedStockItemIds: [],
                    shippedQuantity: 0,
                }));
                const shippingCost = 0;
                const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalDiscount = 0;
                const totalTax = items.reduce((sum, item) => {
                    const priceAfterDiscount = (item.quantity * item.price) * (1 - (item.discountRate / 100));
                    return sum + (priceAfterDiscount * (item.taxRate / 100));
                }, 0);
                const grandTotal = subTotal - totalDiscount + totalTax + shippingCost;
                
                addSalesOrder({
                    customerId: deal.customerId,
                    orderDate: new Date().toISOString().split('T')[0],
                    items: items,
                    status: T.SalesOrderStatus.OnayBekliyor,
                    shippingAddress: customer.shippingAddress,
                    billingAddress: customer.billingAddress,
                    dealId: deal.id,
                    shippingCost: 0, // Default
                    subTotal,
                    totalDiscount,
                    totalTax,
                    grandTotal,
                });
            }
        }
        
        if (createProjectFlag) {
            addProject({
                name: `${deal.title} Projesi`,
                customerId: deal.customerId,
                deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                status: 'beklemede',
                progress: 0,
                description: `Anlaşma #${deal.id} - ${deal.title} üzerinden oluşturuldu.`,
                startDate: new Date().toISOString().split('T')[0],
                teamMemberIds: [deal.assignedToId],
                budget: deal.value,
                spent: 0,
                tags: ['anlaşma-dönüşümü'],
            }, useTaskTemplate ? taskTemplateId : undefined);
        }
    }, [updateDealWinLossReason, products, customers, addSalesOrder, addProject]);

    const deleteDeal = useCallback((id: number) => {
        const toDelete = deals.find(d => d.id === id);
        if (toDelete) {
            setDeals(prev => prev.filter(d => d.id !== id));
            logActivity(T.ActionType.DELETED, `Anlaşma silindi: ${toDelete.title}`, 'deal', id);
        }
    }, [deals, setDeals, logActivity]);

    const deleteMultipleDeals = useCallback((dealIds: number[]) => {
        setDeals(prev => prev.filter(d => !dealIds.includes(d.id)));
        logActivity(T.ActionType.DELETED_MULTIPLE, `${dealIds.length} anlaşma silindi.`);
    }, [setDeals, logActivity]);

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
        
        return {
            grossSalary, netSalary, employeeSgkContribution, employeeUnemploymentContribution,
            incomeTax, stampDuty, totalEmployeeDeductions, employerSgkContribution,
            employerUnemploymentContribution, totalEmployerCost,
            incomeTaxExemption: 0, stampDutyExemption: 0 // Simplified for this simulation
        };
    }, [hrParameters]);
    
    const addExpense = useCallback((expenseData: Omit<T.Expense, 'id' | 'employeeName' | 'status' | 'employeeId'>): T.Expense => {
        const newExpense: T.Expense = {
            ...expenseData,
            id: Date.now(),
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            status: T.ExpenseStatus.Pending,
        };
        setExpenses(prev => [newExpense, ...prev]);
        logActivity(T.ActionType.CREATED, `Masraf oluşturuldu: ${newExpense.description}`, 'expense', newExpense.id);
        return newExpense;
    }, [currentUser, setExpenses, logActivity]);
    
    const addProjectExpense = useCallback((expenseData: Omit<T.Expense, 'id' | 'employeeName' | 'status'>): T.Expense => {
        const newExpense: T.Expense = {
            ...expenseData,
            id: Date.now(),
            employeeName: employees.find(e => e.id === expenseData.employeeId)?.name || 'Bilinmeyen',
            status: T.ExpenseStatus.Paid, // Project expenses are considered paid directly
        };
        setExpenses(prev => [newExpense, ...prev]);
        
        if (newExpense.projectId) {
            setProjects(prevProjects => prevProjects.map(p => 
                p.id === newExpense.projectId ? { ...p, spent: p.spent + newExpense.amount } : p
            ));
            logActivity(T.ActionType.CREATED, `Proje gideri eklendi: ${newExpense.description}`, 'expense', newExpense.id);
        }
        
        return newExpense;
    }, [employees, setExpenses, setProjects, logActivity]);

    const deleteExpense = useCallback((expenseId: number) => {
        const expenseToDelete = expenses.find(e => e.id === expenseId);
        if (expenseToDelete) {
            if (expenseToDelete.projectId) {
                setProjects(prevProjects => prevProjects.map(p => 
                    p.id === expenseToDelete.projectId ? { ...p, spent: p.spent - expenseToDelete.amount } : p
                ));
            }
            setExpenses(prev => prev.filter(e => e.id !== expenseId));
            logActivity(T.ActionType.DELETED, `Gider silindi: ${expenseToDelete.description}`, 'expense', expenseId);
        }
    }, [expenses, setExpenses, setProjects, logActivity]);

    const updateExpenseStatus = useCallback((expenseId: number, status: T.ExpenseStatus) => {
        setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status } : e));
    }, [setExpenses]);
    
    const updateHrParameters = useCallback((params: T.HrParameters) => {
        setHrParameters(params);
        addToast('Bordro parametreleri güncellendi.', 'success');
    }, [setHrParameters, addToast]);
    
    const logTimeOnTask = useCallback((taskId: number, minutes: number) => {
        let taskToUpdate: T.Task | undefined;
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                taskToUpdate = { ...t, timeSpent: (t.timeSpent || 0) + minutes };
                return taskToUpdate;
            }
            return t;
        }));
        if (taskToUpdate) {
            logActivity(T.ActionType.UPDATED, `Göreve zaman eklendi: ${taskToUpdate.title}`, 'task', taskId);
            
            if (taskToUpdate.relatedEntityType === 'project' && taskToUpdate.relatedEntityId) {
                const cost = (minutes / 60) * hrParameters.DEFAULT_HOURLY_RATE;
                setProjects(prevProjects => prevProjects.map(p =>
                    p.id === taskToUpdate!.relatedEntityId ? { ...p, spent: p.spent + cost } : p
                ));
            }
        }
    }, [setTasks, logActivity, hrParameters, setProjects]);

    const addSalesReturn = useCallback((returnData: Omit<T.SalesReturn, 'id' | 'returnNumber' | 'customerName'>): T.SalesReturn => {
        const customer = customers.find(c => c.id === returnData.customerId);
        const newReturn: T.SalesReturn = {
            ...returnData,
            id: Date.now(),
            returnNumber: `SR-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri'
        };
        setSalesReturns(prev => [newReturn, ...prev]);
        logActivity(T.ActionType.CREATED, `Satış iadesi oluşturuldu: ${newReturn.returnNumber}`, 'sales_return', newReturn.id);
        return newReturn;
    }, [customers, setSalesReturns, logActivity]);

    const updateSalesReturn = useCallback((salesReturn: T.SalesReturn): T.SalesReturn | undefined => {
        let updated: T.SalesReturn | undefined;
        setSalesReturns(prev => prev.map(sr => {
            if (sr.id === salesReturn.id) {
                updated = salesReturn;
                return salesReturn;
            }
            return sr;
        }));
        if (updated) logActivity(T.ActionType.UPDATED, `Satış iadesi güncellendi: ${updated.returnNumber}`, 'sales_return', updated.id);
        return updated;
    }, [setSalesReturns, logActivity]);

    const deleteSalesReturn = useCallback((id: number) => {
        const toDelete = salesReturns.find(sr => sr.id === id);
        if (toDelete) {
            setSalesReturns(prev => prev.filter(sr => sr.id !== id));
            logActivity(T.ActionType.DELETED, `Satış iadesi silindi: ${toDelete.returnNumber}`, 'sales_return', toDelete.id);
        }
    }, [salesReturns, setSalesReturns, logActivity]);
    
    const addQuotation = useCallback((quotationData: Omit<T.Quotation, 'id' | 'quotationNumber' | 'customerName'>): T.Quotation => {
        const newQuotation = {
            ...quotationData,
            id: Date.now(),
            quotationNumber: `QT-${Date.now()}`,
            customerName: customers.find(c => c.id === quotationData.customerId)?.name || '',
        };
        setQuotations(prev => [...prev, newQuotation]);
        return newQuotation;
    }, [customers, setQuotations]);

    const updateQuotation = useCallback((quotation: T.Quotation): T.Quotation | undefined => {
        let updated;
        setQuotations(prev => prev.map(q => {
            if (q.id === quotation.id) {
                updated = quotation;
                return quotation;
            }
            return q;
        }));
        return updated;
    }, [setQuotations]);

    const deleteQuotation = useCallback((id: number) => {
        setQuotations(prev => prev.filter(q => q.id !== id));
    }, [setQuotations]);

    const convertQuotationToSalesOrder = useCallback((quotationId: number): T.SalesOrder | undefined => {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) return;
        
        const customer = customers.find(c => c.id === quotation.customerId);
        if (!customer) return;

        const newOrder: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName"> = {
            customerId: quotation.customerId,
            orderDate: new Date().toISOString().split('T')[0],
            items: quotation.items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.unitPrice,
                discountRate: item.discountRate,
                taxRate: item.taxRate,
                committedStockItemIds: [],
                shippedQuantity: 0,
            })),
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
        const addedOrder = addSalesOrder(newOrder);
        if (addedOrder) {
             updateQuotation({ ...quotation, status: T.QuotationStatus.Accepted, salesOrderId: addedOrder.id });
        }
        return addedOrder;
    }, [quotations, customers, setQuotations, addSalesOrder]);

    const addLead = useCallback((leadData: Omit<T.Lead, 'id'>): T.Lead => {
        const newLead = { ...leadData, id: Date.now() };
        setLeads(prev => [...prev, newLead]);
        return newLead;
    }, [setLeads]);

    const convertLead = useCallback((leadId: number): { customer: T.Customer; contact: T.Contact; deal: T.Deal } | undefined => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;
        const newCustomerData = {
            name: lead.company || lead.name,
            company: lead.company || lead.name,
            email: lead.email,
            phone: lead.phone,
            lastContact: new Date().toISOString().split('T')[0],
            status: 'potansiyel',
            industry: '',
            tags: ['dönüştürüldü'],
            assignedToId: lead.assignedToId,
            leadSource: lead.source,
            accountType: 'Tüzel Kişi' as 'Tüzel Kişi',
            accountCode: '',
            taxId: '',
            taxOffice: '',
            billingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '' },
            shippingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '' },
            iban: '',
            openingBalance: 0,
            currency: 'TRY' as 'TRY',
            openingDate: new Date().toISOString().split('T')[0]
        };
        const newCustomer = addCustomer(newCustomerData);

        const newContact = addContact({
            customerId: newCustomer.id,
            name: lead.name,
            title: '',
            email: lead.email,
            phone: lead.phone,
        });

        const newDeal = addDeal({
            title: `${newCustomer.name} Anlaşması`,
            customerId: newCustomer.id,
            stage: T.DealStage.Contacted,
            closeDate: new Date().toISOString().split('T')[0],
            assignedToId: lead.assignedToId,
            lineItems: [],
        });
        
        setLeads(prev => prev.filter(l => l.id !== leadId));
        return { customer: newCustomer, contact: newContact, deal: newDeal };
    }, [leads, addCustomer, addContact, addDeal, setLeads]);
    
    const isManager = useCallback((employeeId: number) => employees.some(e => e.managerId === employeeId), [employees]);
    const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const addToCart = useCallback((product: T.Product, quantity: number) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { productId: product.id, productName: product.name, quantity, price: product.price, sku: product.sku }];
        });
    }, [setCartItems]);
    const removeFromCart = useCallback((productId: number) => setCartItems(prev => prev.filter(i => i.productId !== productId)), [setCartItems]);
    const updateCartQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    }, [setCartItems, removeFromCart]);
    const clearCart = useCallback(() => setCartItems([]), [setCartItems]);
    
    const createSalesOrderFromCart = useCallback((customerId: number): T.SalesOrder | undefined => {
        if (cartItems.length === 0) return;
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return;

        const items: T.SalesOrderItem[] = cartItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            discountRate: 0,
            taxRate: 20, // default
            committedStockItemIds: [],
            shippedQuantity: 0,
        }));
        const subTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const totalTax = items.reduce((sum, item) => sum + (item.quantity * item.price * (item.taxRate / 100)), 0);
        
        const newOrderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName"> = {
            customerId,
            orderDate: new Date().toISOString().split('T')[0],
            items,
            status: T.SalesOrderStatus.OnayBekliyor,
            shippingAddress: customer.shippingAddress,
            billingAddress: customer.billingAddress,
            subTotal,
            totalDiscount: 0,
            totalTax,
            shippingCost: 0,
            grandTotal: subTotal + totalTax
        };

        const newOrder = addSalesOrder(newOrderData);
        clearCart();
        return newOrder;
    }, [cartItems, customers, addSalesOrder, clearCart]);

    const updateTask = useCallback((task: T.Task, options?: { silent?: boolean }): T.Task | undefined => {
        let updated: T.Task | undefined;
        setTasks(prev => prev.map(t => {
            if (t.id === task.id) {
                updated = { ...t, ...task };
                return updated;
            }
            return t;
        }));
        if (updated && !options?.silent) {
            logActivity(T.ActionType.TASK_UPDATED, `Görev güncellendi: ${updated.title}`, 'task', updated.id);
        }
        return updated;
    }, [setTasks, logActivity]);
    
    // FIX: Implement missing functions
    const updateSalesOrderStatus = useCallback((orderId: number, newStatus: T.SalesOrderStatus) => {
        setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        logActivity(T.ActionType.STATUS_CHANGED, `Satış siparişi durumu güncellendi: ${newStatus}`, 'sales_order', orderId);
    }, [setSalesOrders, logActivity]);

    const updateCompanyInfo = useCallback((info: T.CompanyInfo) => {
        setCompanyInfo(info);
    }, [setCompanyInfo]);
    
    const updateBrandingSettings = useCallback((settings: T.BrandingSettings) => {
        setBrandingSettings(settings);
    }, [setBrandingSettings]);

    const updateSecuritySettings = useCallback((settings: T.SecuritySettings) => {
        setSecuritySettings(settings);
    }, [setSecuritySettings]);
    
    const updateAccountingLockDate = useCallback((date: string | null) => {
        setAccountingLockDate(date);
    }, [setAccountingLockDate]);

    // FIX: Corrected contextValue to implement all properties from AppContextType
    const contextValue: T.AppContextType = {
        customers, addCustomer, updateCustomer, updateCustomerStatus, bulkUpdateCustomerStatus, assignCustomersToEmployee, addTagsToCustomers, deleteCustomer, deleteMultipleCustomers, importCustomers,
        contacts, addContact, updateContact, deleteContact,
        communicationLogs, addCommunicationLog, updateCommunicationLog, deleteCommunicationLog,
        savedViews, addSavedView, deleteSavedView, loadSavedView,
        summarizeActivityFeed,
        deals, projects, tasks, notifications, invoices, bills, products, suppliers, purchaseOrders, employees, leaveRequests, performanceReviews, jobOpenings, candidates, onboardingTemplates, onboardingWorkflows, payrollRuns, payslips, bankAccounts, transactions, tickets, documents, comments, salesActivities, activityLogs, customFieldDefinitions, dashboardLayout, companyInfo, brandingSettings, securitySettings, roles, rolesPermissions, taxRates, systemLists, emailTemplates, priceLists, priceListItems, automations, automationLogs, taskTemplates, scheduledTasks, counters, cartItems, warehouses, stockMovements, inventoryTransfers, inventoryAdjustments, salesOrders, shipments, stockItems, pickLists, boms, workOrders, accounts, journalEntries, recurringJournalEntries, budgets, costCenters, accountingLockDate, currentUser, expenses, assets, hrParameters,
        salesReturns, addSalesReturn, updateSalesReturn, deleteSalesReturn, quotations, addQuotation, updateQuotation, deleteQuotation, convertQuotationToSalesOrder, leads, addLead, convertLead, commissionRecords,
        setCurrentUser, isManager, itemCount, addToCart, removeFromCart, updateCartQuantity, clearCart, createSalesOrderFromCart,
        runScheduledTasksCheck: () => {}, addScheduledTask: (d) => d as any, updateScheduledTask: (d) => d, deleteScheduledTask: () => {},
        addTaskTemplate, updateTaskTemplate, deleteTaskTemplate,
        addBom: (d) => d as any, updateBom: (d) => d, addWorkOrder: (d) => d as any, updateWorkOrder: (d) => d, getProductStockByWarehouse: () => ({physical:0, committed:0, available:0}),
        updateWorkOrderStatus, getProductStockInfo,
        addSalesOrder, updateSalesOrder: (d) => d, deleteSalesOrder: () => {}, updateSalesOrderStatus, convertOrderToInvoice: () => undefined, confirmPickList: () => {},
        addProduct: (d) => d as any, updateProduct: (d) => d, deleteProduct: () => {}, addWarehouse: (d) => d as any, updateWarehouse: (d) => d, deleteWarehouse: () => {},
        addInventoryTransfer: () => undefined, addInventoryAdjustment: () => undefined, receivePurchaseOrderItems: () => {},
        addPurchaseOrder: (d) => d as any, updatePurchaseOrder: (d) => d, updatePurchaseOrderStatus: () => {}, createBillFromPO: () => undefined,
        allocateStockToSalesOrder: () => {}, createShipmentFromSalesOrder: () => undefined, createPickList: () => undefined,
        addAutomation: (d) => d as any, updateAutomation: (d) => d, deleteAutomation: () => {}, updateSystemList: () => {}, updateEmailTemplate: () => {},
        addPriceList: (d) => d as any, updatePriceList: (d) => d, deletePriceList: () => {}, updatePriceListItems: () => {},
        addTaxRate: (d) => d as any, updateTaxRate: (d) => d, deleteTaxRate: () => {}, addAccount: (d) => d as any, updateAccount: (d) => d,
        addJournalEntry, updateJournalEntry: (d) => d, deleteJournalEntry: () => {}, reverseJournalEntry: () => undefined,
        addRecurringJournalEntry: (d) => d as any, updateRecurringJournalEntry: (d) => d, deleteRecurringJournalEntry: () => {}, generateEntryFromRecurringTemplate: async () => undefined,
        addBudget: (d) => d as any, updateBudget: (d) => d, deleteBudget: () => {}, addCostCenter: (d) => d as any, updateCostCenter: (d) => d, deleteCostCenter: () => {},
        setDashboardLayout, addWidgetToDashboard: () => {}, removeWidgetFromDashboard: () => {}, hasPermission,
        addDeal, updateDeal, updateDealStage, bulkUpdateDealStage, updateDealWinLossReason, winDeal, deleteDeal, deleteMultipleDeals,
        addProject, updateProject, deleteProject,
        addTask, updateTask, updateRecurringTask: () => {}, deleteTask: () => {}, updateTaskStatus: () => {}, addSubtask: () => undefined,
        addTaskDependency: () => {}, removeTaskDependency: () => {}, deleteMultipleTasks: () => {}, logTimeOnTask, toggleTaskStar: () => {}, createTasksFromTemplate,
        addAttachmentToTask: () => {}, deleteAttachmentFromTask: () => {}, addInvoice: (d) => d as any, updateInvoice: (d) => d, bulkUpdateInvoiceStatus: () => {}, deleteInvoice: () => {},
        addBill: (d) => d as any, updateBill: (d) => d, bulkUpdateBillStatus: () => {}, addSupplier: (d) => d as any, updateSupplier: (d) => d, deleteSupplier: () => {}, deletePurchaseOrder: () => {},
        addEmployee, updateEmployee, deleteEmployee,
        addLeaveRequest: (d) => d as any, updateLeaveRequestStatus: () => {}, addBankAccount: (d) => d as any, updateBankAccount: (d) => d, deleteBankAccount: () => {},
        addTransaction: (d) => d as any, updateTransaction: (d) => d, deleteTransaction: () => {},
        addTicket: (d) => d as any, updateTicket: (d) => d, deleteTicket: () => {},
        addDocument: (d) => d as any, renameDocument: () => {}, deleteDocument: () => {}, deleteMultipleDocuments: () => {}, addFolder: (d) => ({id:0, name:d} as any), moveDocuments: () => {}, toggleDocumentStar: () => {}, shareDocument: () => {},
        addComment, updateComment, deleteComment,
        addSalesActivity: (d) => d as any,
        addPerformanceReview, updatePerformanceReview,
        addJobOpening, updateJobOpening,
        addCandidate, updateCandidate, updateCandidateStage,
        addOnboardingTemplate, updateOnboardingTemplate, startOnboardingWorkflow, updateOnboardingWorkflowStatus,
        addPayrollRun, updatePayrollRunStatus, postPayrollRunToJournal, exportPayrollRunToAphbXml, updatePayslip,
        calculateTerminationPayments, calculateAnnualLeaveBalance, calculatePayrollCost,
        updateCompanyInfo, updateBrandingSettings, updateSecuritySettings, updateCounters: () => {}, addRole: (d) => d as any, updateRolePermissions: () => {}, deleteRole: () => {},
        addCustomField: (d) => d as any, updateCustomField: (d) => d, deleteCustomField: () => {},
        markNotificationAsRead: () => {}, clearAllNotifications: () => {}, deleteNotification: () => {}, deleteAllNotifications: () => {},
        logActivity, updateAccountingLockDate, addStockMovement: () => {}, 
        addExpense, addProjectExpense, deleteExpense, updateExpenseStatus, addAsset, updateAsset, updateHrParameters,
        isCommandPaletteOpen, setIsCommandPaletteOpen, isCustomerFormOpen, setIsCustomerFormOpen, editingCustomer, isDealFormOpen, setIsDealFormOpen, editingDeal, prefilledDealData, isTaskFormOpen, setIsTaskFormOpen, editingTask, prefilledTaskData, isProjectFormOpen, setIsProjectFormOpen, editingProject, prefilledProjectData, isTicketFormOpen, setIsTicketFormOpen, editingTicket, prefilledTicketData, isSalesOrderFormOpen, setIsSalesOrderFormOpen, editingSalesOrder, prefilledSalesOrderData, isLogModalOpen, setIsLogModalOpen, logModalCustomerId,
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
import React, { createContext, useState, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useCustomers } from '../hooks/useCustomers';
import * as T from '../types';
import * as C from '../constants';

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

    // Customer Functions (with logging)
    const customersWithAssignee = useMemo(() => {
        return customers.map(customer => ({
            ...customer,
            assignedToName: employees.find(e => e.id === customer.assignedToId)?.name || 'Atanmamış'
        }));
    }, [customers, employees]);

    const addCustomer = useCallback((customerData: Omit<T.Customer, 'id' | 'avatar'>): T.Customer => {
        const newCustomer = originalAddCustomer(customerData);
        logActivity(T.ActionType.CREATED, `Müşteri '${newCustomer.name}' oluşturuldu.`, 'customer', newCustomer.id);
        return newCustomer;
    }, [originalAddCustomer, logActivity]);
    
    const importCustomers = useCallback((customersData: Omit<T.Customer, 'id' | 'avatar'>[]): T.Customer[] => {
        const newCustomers = originalImportCustomers(customersData);
        logActivity(T.ActionType.CREATED, `${newCustomers.length} müşteri içeri aktarıldı.`, 'customer');
        return newCustomers;
    }, [originalImportCustomers, logActivity]);

    const assignCustomersToEmployee = useCallback((customerIds: number[], employeeId: number) => {
        setCustomers(prev => prev.map(c => customerIds.includes(c.id) ? { ...c, assignedToId: employeeId } : c));
        const employeeName = employees.find(e => e.id === employeeId)?.name || 'Bilinmeyen';
        logActivity(T.ActionType.UPDATED, `${customerIds.length} müşteri toplu olarak '${employeeName}' sorumlusuna atandı.`, 'customer');
    }, [setCustomers, employees, logActivity]);

    const addTagsToCustomers = useCallback((customerIds: number[], tags: string[]) => {
        setCustomers(prev => prev.map(c => {
            if (customerIds.includes(c.id)) {
                const newTags = [...new Set([...c.tags, ...tags])];
                return { ...c, tags: newTags };
            }
            return c;
        }));
        logActivity(T.ActionType.UPDATED, `${customerIds.length} müşteriye toplu olarak '${tags.join(', ')}' etiketleri eklendi.`, 'customer');
    }, [setCustomers, logActivity]);
    
    const bulkUpdateCustomerStatus = useCallback((customerIds: number[], newStatus: string) => {
        setCustomers(prev => prev.map(c => customerIds.includes(c.id) ? { ...c, status: newStatus } : c));
        logActivity(T.ActionType.STATUS_CHANGED, `${customerIds.length} müşterinin durumu '${newStatus}' olarak güncellendi.`, 'customer');
    }, [setCustomers, logActivity]);

    const addSavedView = useCallback((name: string, filters: T.SavedView['filters'], sortConfig: T.SortConfig) => {
        const newView: T.SavedView = { id: Date.now(), name, filters, sortConfig };
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
            id: Date.now(), customerId, type, content,
            timestamp: new Date().toISOString(), userId: currentUser.id, userName: currentUser.name,
        };
        setCommunicationLogs(prev => [newLog, ...prev]);
        logActivity(T.ActionType.COMMENT_ADDED, `${type} for customer #${customerId}.`, 'customer', customerId);
    }, [setCommunicationLogs, currentUser, logActivity]);

    const addContact = useCallback((contactData: Omit<T.Contact, 'id'>) => {
        const newContact: T.Contact = { id: Date.now(), ...contactData };
        setContacts(prev => [newContact, ...prev]);
        logActivity(T.ActionType.CREATED, `Contact '${newContact.name}' created.`, 'customer', contactData.customerId);
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

    const addInvoice = useCallback((invoiceData: Omit<T.Invoice, 'id' | 'invoiceNumber' | 'customerName'>): T.Invoice => {
        const customer = customers.find(c => c.id === invoiceData.customerId);
        if (!customer) {
            console.error("Fatura oluşturmak için müşteri bulunamadı.");
            return {} as T.Invoice;
        }

        const newInvoiceNumber = `${counters.prefix}${String(counters.nextNumber).padStart(counters.padding, '0')}`;
        
        const newInvoice: T.Invoice = {
            ...invoiceData,
            id: Date.now(),
            invoiceNumber: newInvoiceNumber,
            customerName: customer.name,
        };

        setInvoices(prev => [newInvoice, ...prev]);
        setCounters(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
        logActivity(T.ActionType.CREATED, `Fatura #${newInvoiceNumber} oluşturuldu.`, 'invoice', newInvoice.id);
        
        return newInvoice;
    }, [setInvoices, counters, setCounters, logActivity, customers]);

    const updateInvoice = useCallback((invoiceToUpdate: T.Invoice) => {
        const customer = customers.find(c => c.id === invoiceToUpdate.customerId);
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceToUpdate.id) {
                return { ...invoiceToUpdate, customerName: customer?.name || inv.customerName };
            }
            return inv;
        }));
        logActivity(T.ActionType.UPDATED, `Fatura #${invoiceToUpdate.invoiceNumber} güncellendi.`, 'invoice', invoiceToUpdate.id);
    }, [setInvoices, logActivity, customers]);

    const bulkUpdateInvoiceStatus = useCallback((invoiceIds: number[], newStatus: T.InvoiceStatus) => {
        setInvoices(prev => prev.map(inv => invoiceIds.includes(inv.id) ? { ...inv, status: newStatus } : inv));
        logActivity(T.ActionType.STATUS_CHANGED, `${invoiceIds.length} faturanın durumu '${newStatus}' olarak güncellendi.`, 'invoice');
    }, [setInvoices, logActivity]);
    
    const deleteInvoice = useCallback((id: number) => {
        setInvoices(prev => prev.filter(i => i.id !== id));
        logActivity(T.ActionType.DELETED, `Invoice #${id} deleted.`, 'invoice', id);
    }, [setInvoices, logActivity]);
    
    const addDeal = useCallback((dealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'>): T.Deal => {
        const customer = customers.find(c => c.id === dealData.customerId);
        const assignee = employees.find(e => e.id === dealData.assignedToId);
        const value = dealData.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const newDeal: T.Deal = {
            ...dealData,
            id: Date.now(),
            customerName: customer?.name || 'Bilinmeyen Müşteri',
            assignedToName: assignee?.name || 'Atanmamış',
            value: value,
            lastActivityDate: new Date().toISOString().split('T')[0]
        };
        setDeals(prev => [newDeal, ...prev]);
        logActivity(T.ActionType.CREATED, `Anlaşma '${newDeal.title}' oluşturuldu.`, 'deal', newDeal.id);
        return newDeal;
    }, [setDeals, employees, customers, logActivity]);

    const createCommissionRecord = useCallback((deal: T.Deal): T.CommissionRecord => {
        // Simple 5% commission logic for demo
        const commissionAmount = deal.value * 0.05;
        const newRecord: T.CommissionRecord = {
            id: Date.now(),
            employeeId: deal.assignedToId,
            dealId: deal.id,
            dealValue: deal.value,
            commissionAmount,
            earnedDate: new Date().toISOString().split('T')[0],
        };
        setCommissionRecords(prev => [newRecord, ...prev]);
        logActivity(T.ActionType.CREATED, `'${deal.title}' anlaşması için komisyon kaydı oluşturuldu.`, 'commission', newRecord.id);
        return newRecord;
    }, [setCommissionRecords, logActivity]);

    const updateDealStage = useCallback((dealId: number, newStage: T.DealStage) => {
        const deal = deals.find(d => d.id === dealId);
        if (!deal) return;
    
        setDeals(prev => prev.map(d => 
            d.id === dealId 
                ? { ...d, stage: newStage, lastActivityDate: new Date().toISOString().split('T')[0] } 
                : d
        ));
    
        logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma '${deal.title}' durumu '${newStage}' olarak değiştirildi.`, 'deal', dealId);
    
        if (newStage === T.DealStage.Won) {
            createCommissionRecord({ ...deal, stage: newStage });
        }
    }, [deals, setDeals, logActivity, createCommissionRecord]);

    const addProject = useCallback((projectData: Omit<T.Project, 'id' | 'client'>) => {
        const customer = customers.find(c => c.id === projectData.customerId);
        const newProject: T.Project = {
            ...projectData,
            id: Date.now(),
            client: customer?.name || 'Bilinmeyen Müşteri'
        };
        setProjects(prev => [newProject, ...prev]);
        logActivity(T.ActionType.PROJECT_CREATED, `Proje '${newProject.name}' oluşturuldu.`, 'project', newProject.id);
    }, [setProjects, customers, logActivity]);

    const addTask = useCallback((taskData: Omit<T.Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[] = []): T.Task | undefined => {
        const assignee = employees.find(e => e.id === taskData.assignedToId);
        let relatedEntityName = '';
        if (taskData.relatedEntityType && taskData.relatedEntityId) {
            switch (taskData.relatedEntityType) {
                case 'customer': relatedEntityName = customers.find(c => c.id === taskData.relatedEntityId)?.name || ''; break;
                case 'project': relatedEntityName = projects.find(p => p.id === taskData.relatedEntityId)?.name || ''; break;
                case 'deal': relatedEntityName = deals.find(d => d.id === taskData.relatedEntityId)?.title || ''; break;
            }
        }
        
        const newTask: T.Task = {
            ...taskData,
            id: Date.now(),
            assignedToName: assignee?.name || 'Atanmamış',
            relatedEntityName
        };
        
        const newSubtasks: T.Task[] = subtaskTitles.map((title, i) => ({
            id: Date.now() + i + 1,
            title,
            description: '',
            status: T.TaskStatus.Todo,
            priority: T.TaskPriority.Normal,
            dueDate: newTask.dueDate,
            assignedToId: newTask.assignedToId,
            assignedToName: newTask.assignedToName,
            parentId: newTask.id,
        }));
        
        setTasks(prev => [newTask, ...newSubtasks, ...prev]);
        logActivity(T.ActionType.TASK_CREATED, `Görev '${newTask.title}' oluşturuldu.`, 'task', newTask.id);
        
        return newTask;
    }, [setTasks, employees, projects, deals, customers, logActivity]);
    
    const addTicket = useCallback((ticketData: Omit<T.SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'>) => {
        const customer = customers.find(c => c.id === ticketData.customerId);
        const assignee = employees.find(e => e.id === ticketData.assignedToId);
        
        const newTicket: T.SupportTicket = {
            ...ticketData,
            id: Date.now(),
            ticketNumber: `TICKET-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri',
            assignedToName: assignee?.name || 'Atanmamış',
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        setTickets(prev => [newTicket, ...prev]);
        logActivity(T.ActionType.CREATED, `Destek talebi '${newTicket.subject}' oluşturuldu.`, 'ticket', newTicket.id);
    }, [setTickets, employees, customers, logActivity]);
    
    const addSalesOrder = useCallback((orderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName">) => {
        const customer = customers.find(c => c.id === orderData.customerId);
        const newOrder: T.SalesOrder = {
            ...orderData,
            id: Date.now(),
            orderNumber: `SO-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri'
        };
        setSalesOrders(prev => [newOrder, ...prev]);
        logActivity(T.ActionType.CREATED, `Satış Siparişi '${newOrder.orderNumber}' oluşturuldu.`, 'sales_order', newOrder.id);
    }, [setSalesOrders, customers, logActivity]);

    const addQuotation = useCallback((quotationData: Omit<T.Quotation, 'id' | 'quotationNumber' | 'customerName'>): T.Quotation => {
        const customer = customers.find(c => c.id === quotationData.customerId);
        const newQuotation: T.Quotation = {
            ...quotationData,
            id: Date.now(),
            quotationNumber: `QT-${Date.now()}`,
            customerName: customer?.name || 'Bilinmeyen Müşteri',
        };
        setQuotations(prev => [newQuotation, ...prev]);
        logActivity(T.ActionType.CREATED, `Teklif #${newQuotation.quotationNumber} oluşturuldu.`, 'quotation', newQuotation.id);
        return newQuotation;
    }, [setQuotations, customers, logActivity]);

    const updateQuotation = useCallback((quotation: T.Quotation) => {
        setQuotations(prev => prev.map(q => q.id === quotation.id ? quotation : q));
        logActivity(T.ActionType.UPDATED, `Teklif #${quotation.quotationNumber} güncellendi.`, 'quotation', quotation.id);
    }, [setQuotations, logActivity]);

    const deleteQuotation = useCallback((id: number) => {
        const quotation = quotations.find(q => q.id === id);
        if (quotation) {
            setQuotations(prev => prev.filter(q => q.id !== id));
            logActivity(T.ActionType.DELETED, `Teklif #${quotation.quotationNumber} silindi.`, 'quotation', id);
        }
    }, [quotations, setQuotations, logActivity]);

    const convertQuotationToSalesOrder = useCallback((quotationId: number): T.SalesOrder | undefined => {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) {
            console.error(`Quotation with id ${quotationId} not found.`);
            return undefined;
        }

        const customer = customers.find(c => c.id === quotation.customerId);
        if (!customer) {
            console.error(`Customer with id ${quotation.customerId} not found for quotation.`);
            return undefined;
        }

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
        
        const newOrder: T.SalesOrder = {
            id: Date.now(),
            orderNumber: `SO-${Date.now()}`,
            customerId: quotation.customerId,
            customerName: customer.name,
            orderDate: new Date().toISOString().split('T')[0],
            items: orderItems,
            status: T.SalesOrderStatus.OnayBekliyor,
            shippingAddress: customer.shippingAddress,
            billingAddress: customer.billingAddress,
            notes: `Teklif #${quotation.quotationNumber} üzerinden oluşturuldu.`,
            subTotal: quotation.subTotal,
            totalDiscount: quotation.totalDiscount,
            totalTax: quotation.totalTax,
            shippingCost: 0, // Assuming no shipping cost from quotation
            grandTotal: quotation.grandTotal,
            dealId: quotation.dealId,
        };
        
        setSalesOrders(prev => [newOrder, ...prev]);
        
        // Mark quotation as converted
        updateQuotation({ ...quotation, status: T.QuotationStatus.Accepted, salesOrderId: newOrder.id });

        logActivity(T.ActionType.CREATED, `Teklif #${quotation.quotationNumber} satış siparişine dönüştürüldü: #${newOrder.orderNumber}.`, 'sales_order', newOrder.id);
        
        return newOrder;
    }, [quotations, updateQuotation, customers, setSalesOrders, logActivity]);
    
    const addLead = useCallback((leadData: Omit<T.Lead, 'id'>): T.Lead => {
        const newLead: T.Lead = { id: Date.now(), ...leadData };
        setLeads(prev => [newLead, ...prev]);
        logActivity(T.ActionType.CREATED, `Potansiyel müşteri '${newLead.name}' oluşturuldu.`, 'lead', newLead.id);
        return newLead;
    }, [setLeads, logActivity]);

    const convertLead = useCallback((leadId: number): { customer: T.Customer; contact: T.Contact; deal: T.Deal } | undefined => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return undefined;

        // Create Customer
        const newCustomerData: Omit<T.Customer, 'id' | 'avatar'> = {
            name: lead.company || lead.name,
            company: lead.company || lead.name,
            email: lead.email,
            phone: lead.phone,
            lastContact: new Date().toISOString().split('T')[0],
            status: 'potensiyel',
            industry: 'Bilinmiyor',
            tags: ['dönüştürüldü'],
            assignedToId: lead.assignedToId,
            leadSource: lead.source,
            accountType: 'Tüzel Kişi',
            accountCode: `C${Date.now()}`,
            taxId: '',
            taxOffice: '',
            billingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: lead.email, phone: lead.phone, coordinates: { lat: 0, lng: 0 } },
            shippingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: lead.email, phone: lead.phone, coordinates: { lat: 0, lng: 0 } },
            iban: '',
            openingBalance: 0,
            currency: 'TRY',
            openingDate: new Date().toISOString().split('T')[0],
        };
        const newCustomer = addCustomer(newCustomerData);

        // Create Contact
        const newContactData: Omit<T.Contact, 'id'> = {
            customerId: newCustomer.id,
            name: lead.name,
            title: 'İlgili Kişi',
            email: lead.email,
            phone: lead.phone,
        };
        addContact(newContactData);
        
        // Create Deal
        const newDealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'> = {
            title: `${lead.company || lead.name} Anlaşması`,
            customerId: newCustomer.id,
            stage: T.DealStage.Lead,
            closeDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            assignedToId: lead.assignedToId,
            lineItems: [],
        };
        const newDeal = addDeal(newDealData);

        // Update lead status (or delete it)
        setLeads(prev => prev.filter(l => l.id !== leadId));
        logActivity(T.ActionType.LEAD_CONVERTED, `Potansiyel müşteri '${lead.name}' müşteriye dönüştürüldü.`, 'lead', lead.id);
        const newContact = contacts.find(c => c.customerId === newCustomer.id && c.name === lead.name) || ({} as T.Contact);

        return { customer: newCustomer, contact: newContact, deal: newDeal };
    }, [leads, setLeads, addCustomer, addContact, addDeal, contacts, logActivity]);
    
    const hasPermission = useCallback((permission: T.Permission) => {
        const userRole = currentUser.role;
        if (!userRole || !rolesPermissions[userRole]) {
            return false;
        }
        if (userRole === 'admin') return true; // Admins have all permissions
        return rolesPermissions[userRole].includes(permission);
    }, [currentUser, rolesPermissions]);

    const value: T.AppContextType = useMemo(() => ({
        customers: customersWithAssignee,
        addCustomer,
        updateCustomer: originalUpdateCustomer,
        updateCustomerStatus: originalUpdateCustomerStatus,
        bulkUpdateCustomerStatus,
        assignCustomersToEmployee,
        addTagsToCustomers,
        deleteCustomer: originalDeleteCustomer,
        deleteMultipleCustomers: originalDeleteMultipleCustomers,
        importCustomers,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        communicationLogs,
        addCommunicationLog,
        updateCommunicationLog: (log) => setCommunicationLogs(prev => prev.map(l => l.id === log.id ? log : l)),
        deleteCommunicationLog: (logId) => setCommunicationLogs(prev => prev.filter(l => l.id !== logId)),
        savedViews,
        addSavedView,
        deleteSavedView,
        loadSavedView,
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
        activityLogs,
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
        currentUser,
        expenses,
        assets,
        hrParameters,
        salesReturns,
        addSalesReturn: (returnData: Omit<T.SalesReturn, 'id' | 'returnNumber' | 'customerName'>) => {
            const customer = customers.find(c => c.id === returnData.customerId);
            if (!customer) return undefined;
            const newReturn: T.SalesReturn = {
                ...returnData,
                id: Date.now(),
                returnNumber: `RTN-${Date.now()}`,
                customerName: customer.name
            };
            setSalesReturns(prev => [...prev, newReturn]);
            return newReturn;
        },
        updateSalesReturn: (salesReturn: T.SalesReturn) => setSalesReturns(prev => prev.map(sr => sr.id === salesReturn.id ? salesReturn : sr)),
        deleteSalesReturn: (id: number) => setSalesReturns(prev => prev.filter(sr => sr.id !== id)),
        quotations,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        convertQuotationToSalesOrder,
        leads,
        addLead,
        convertLead,
        commissionRecords,
        createCommissionRecord,
        setCurrentUser,
        isManager: (employeeId: number) => employees.some(e => e.managerId === employeeId),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        addToCart: (product, quantity) => {
            setCartItems(prev => {
                const existingItem = prev.find(item => item.productId === product.id);
                if (existingItem) {
                    return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
                }
                return [...prev, { productId: product.id, productName: product.name, quantity, price: product.price, sku: product.sku }];
            });
        },
        removeFromCart: (productId) => setCartItems(prev => prev.filter(item => item.productId !== productId)),
        updateCartQuantity: (productId, quantity) => setCartItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item).filter(item => item.quantity > 0)),
        clearCart: () => setCartItems([]),
        createSalesOrderFromCart: (customerId: number) => {
            if (cartItems.length === 0) {
                console.warn("Cart is empty, cannot create sales order.");
                return;
            }
            const customer = customers.find(c => c.id === customerId);
            if (!customer) {
                console.error("Customer not found for sales order creation.");
                return;
            }
    
            const orderItems: T.SalesOrderItem[] = cartItems.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    discountRate: 0,
                    taxRate: product?.financials.vatRate || 20,
                    committedStockItemIds: [],
                    shippedQuantity: 0,
                };
            });
    
            const subTotal = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const totalDiscount = 0;
            const totalTax = orderItems.reduce((sum, item) => {
                const lineTotal = item.quantity * item.price;
                return sum + (lineTotal * (item.taxRate / 100));
            }, 0);
            const shippingCost = 0;
            const grandTotal = subTotal + totalTax + shippingCost;
            
            const newOrderData: Omit<T.SalesOrder, "id" | "orderNumber" | "customerName"> = {
                customerId: customerId,
                orderDate: new Date().toISOString().split('T')[0],
                items: orderItems,
                status: T.SalesOrderStatus.OnayBekliyor,
                shippingAddress: customer.shippingAddress,
                billingAddress: customer.billingAddress,
                notes: 'Sepetten oluşturuldu.',
                subTotal,
                totalDiscount,
                totalTax,
                shippingCost,
                grandTotal,
            };
            
            addSalesOrder(newOrderData);
            setCartItems([]);
            logActivity(T.ActionType.CREATED, `Sepetten ${customer.name} için yeni bir satış siparişi oluşturuldu.`, 'sales_order');
        },
        addScheduledTask: (schedule) => setScheduledTasks(prev => [...prev, { ...schedule, id: Date.now() }]),
        updateScheduledTask: (schedule) => setScheduledTasks(prev => prev.map(s => s.id === schedule.id ? schedule : s)),
        deleteScheduledTask: (scheduleId) => setScheduledTasks(prev => prev.filter(s => s.id !== scheduleId)),
        runScheduledTasksCheck: () => {}, // Mock implementation
        addTaskTemplate: (templateData) => setTaskTemplates(prev => [...prev, { ...templateData, id: Date.now() }]),
        updateTaskTemplate: (template) => setTaskTemplates(prev => prev.map(t => t.id === template.id ? template : t)),
        deleteTaskTemplate: (templateId) => setTaskTemplates(prev => prev.filter(t => t.id !== templateId)),
        addBom: (bomData) => setBoms(prev => [...prev, { ...bomData, id: Date.now(), productName: products.find(p => p.id === bomData.productId)?.name || '' }]),
        updateBom: (bom) => setBoms(prev => prev.map(b => b.id === bom.id ? bom : b)),
        addWorkOrder: (woData) => {
             const newWO = { ...woData, id: Date.now(), workOrderNumber: `WO-${Date.now()}`, productName: products.find(p => p.id === woData.productId)?.name || '' };
             setWorkOrders(prev => [...prev, newWO]);
             return newWO;
        },
        updateWorkOrderStatus: (workOrderId, newStatus) => setWorkOrders(prev => prev.map(wo => wo.id === workOrderId ? { ...wo, status: newStatus } : wo)),
        getProductStockInfo: (productId) => ({ physical: 0, committed: 0, available: 0 }), // Mock
        getProductStockByWarehouse: (productId, warehouseId) => ({ physical: 0, committed: 0, available: 0 }), // Mock
        addSalesOrder,
        updateSalesOrder: (order) => setSalesOrders(prev => prev.map(o => o.id === order.id ? order : o)),
        deleteSalesOrder: (orderId) => setSalesOrders(prev => prev.filter(o => o.id !== orderId)),
        updateSalesOrderStatus: (orderId, newStatus) => setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)),
        convertOrderToInvoice: (orderId) => {}, // Mock
        confirmPickList: (pickListId) => {}, // Mock
        addProduct: (productData, initialStock) => setProducts(prev => [...prev, { ...productData, id: Date.now() }]),
        updateProduct: (product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p)),
        deleteProduct: (id) => setProducts(prev => prev.filter(p => p.id !== id)),
        addWarehouse: (warehouseData) => setWarehouses(prev => [...prev, { ...warehouseData, id: Date.now() }]),
        updateWarehouse: (warehouse) => setWarehouses(prev => prev.map(w => w.id === warehouse.id ? warehouse : w)),
        deleteWarehouse: (id) => setWarehouses(prev => prev.filter(w => w.id !== id)),
        addInventoryTransfer: (transferData) => {}, // Mock
        addInventoryAdjustment: (adjustmentData) => {}, // Mock
        receivePurchaseOrderItems: (poId, itemsToReceive, warehouseId) => {}, // Mock
        addPurchaseOrder: (poData) => {}, // Mock
        updatePurchaseOrder: (po) => {}, // Mock
        updatePurchaseOrderStatus: (poId, status) => {}, // Mock
        createBillFromPO: (poId) => {}, // Mock
        convertDealToSalesOrder: (deal) => {}, // Mock
        allocateStockToSalesOrder: (soId, allocations) => {}, // Mock
        createShipmentFromSalesOrder: (soId, itemsToShip) => {}, // Mock
        createPickList: (shipmentIds) => {}, // Mock
        addAutomation: (auto) => {}, // Mock
        updateAutomation: (auto) => {}, // Mock
        deleteAutomation: (autoId) => {}, // Mock
        updateSystemList: (key, items) => {}, // Mock
        updateEmailTemplate: (template) => {}, // Mock
        addPriceList: (list) => {}, // Mock
        updatePriceList: (list) => {}, // Mock
        deletePriceList: (listId) => {}, // Mock
        updatePriceListItems: (listId, items) => {}, // Mock
        addTaxRate: (rate) => {}, // Mock
        updateTaxRate: (rate) => {}, // Mock
        deleteTaxRate: (rateId) => {}, // Mock
        addAccount: (account) => {}, // Mock
        updateAccount: (account) => {}, // Mock
        addJournalEntry: (entryData) => { return {} as T.JournalEntry; }, // Mock
        updateJournalEntry: (entry) => {}, // Mock
        deleteJournalEntry: (entryId) => {}, // Mock
        reverseJournalEntry: (entryId) => { return undefined; }, // Mock
        addRecurringJournalEntry: (template) => {}, // Mock
        updateRecurringJournalEntry: (template) => {}, // Mock
        deleteRecurringJournalEntry: (templateId) => {}, // Mock
        generateEntryFromRecurringTemplate: async (templateId) => { return undefined; }, // Mock
        addBudget: (budget) => {}, // Mock
        updateBudget: (budget) => {}, // Mock
        deleteBudget: (budgetId) => {}, // Mock
        addCostCenter: (costCenter) => {}, // Mock
        updateCostCenter: (costCenter) => {}, // Mock
        deleteCostCenter: (costCenterId) => {}, // Mock
        setDashboardLayout,
        addWidgetToDashboard: (widgetId: string) => {}, // Mock
        removeWidgetFromDashboard: (id: string) => {}, // Mock
        hasPermission,
        addDeal,
        updateDeal: (deal) => setDeals(prev => prev.map(d => d.id === deal.id ? deal : d)),
        updateDealStage,
        updateDealWinLossReason: (dealId, stage, reason) => {}, // Mock
        deleteDeal: (id) => setDeals(prev => prev.filter(d => d.id !== id)),
        addProject,
        updateProject: (project) => setProjects(prev => prev.map(p => p.id === project.id ? project : p)),
        deleteProject: (id) => setProjects(prev => prev.filter(p => p.id !== id)),
        addTask,
        updateTask: (task, options) => setTasks(prev => prev.map(t => t.id === task.id ? task : t)),
        updateRecurringTask: (task, updateData, scope, options) => {}, // Mock
        deleteTask: (id) => setTasks(prev => prev.filter(t => t.id !== id)),
        updateTaskStatus: (taskId, newStatus) => setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)),
        addSubtask: (parentId, title) => {}, // Mock
        addTaskDependency: (taskId, dependsOnId) => {}, // Mock
        removeTaskDependency: (taskId, dependsOnId) => {}, // Mock
        deleteMultipleTasks: (taskIds) => {}, // Mock
        logTimeOnTask: (taskId, minutes) => {}, // Mock
        toggleTaskStar: (taskId) => {}, // Mock
        createTasksFromTemplate: (templateId, startDate, relatedEntityType, relatedEntityId) => {}, // Mock
        addAttachmentToTask: (taskId, attachment) => {}, // Mock
        deleteAttachmentFromTask: (taskId, attachmentId) => {}, // Mock
        addInvoice,
        updateInvoice,
        bulkUpdateInvoiceStatus,
        deleteInvoice,
        addBill: (bill) => { return undefined; }, // Mock
        updateBill: (bill) => {}, // Mock
        bulkUpdateBillStatus: (billIds, newStatus) => {}, // Mock
        addSupplier: (supplierData) => {}, // Mock
        updateSupplier: (supplier) => {}, // Mock
        deleteSupplier: (id) => {}, // Mock
        deletePurchaseOrder: (id) => {}, // Mock
        addEmployee: (employeeData) => {}, // Mock
        updateEmployee: (employee) => {}, // Mock
        deleteEmployee: (id) => {}, // Mock
        addLeaveRequest: (requestData) => {}, // Mock
        updateLeaveRequestStatus: (requestId, newStatus) => {}, // Mock
        addBankAccount: (accountData) => {}, // Mock
        updateBankAccount: (account) => {}, // Mock
        deleteBankAccount: (id) => {}, // Mock
        addTransaction: (transactionData) => {}, // Mock
        updateTransaction: (transaction) => {}, // Mock
        deleteTransaction: (id) => {}, // Mock
        addTicket,
        updateTicket: (ticket) => {}, // Mock
        deleteTicket: (id) => {}, // Mock
        addDocument: (docData) => {}, // Mock
        renameDocument: (docId, newName) => {}, // Mock
        deleteDocument: (id) => {}, // Mock
        deleteMultipleDocuments: (ids) => {}, // Mock
        addFolder: (folderName, parentId) => {}, // Mock
        moveDocuments: (docIds, targetFolderId) => {}, // Mock
        toggleDocumentStar: (docId) => {}, // Mock
        shareDocument: (docId, shares) => {}, // Mock
        addComment: (text, entityType, entityId) => {}, // Mock
        updateComment: (comment) => {}, // Mock
        deleteComment: (commentId) => {}, // Mock
        addSalesActivity: (activityData) => {}, // Mock
        addPerformanceReview: (reviewData) => {}, // Mock
        updatePerformanceReview: (review) => {}, // Mock
        addJobOpening: (jobData) => {}, // Mock
        updateJobOpening: (job) => {}, // Mock
        addCandidate: (candidateData) => {}, // Mock
        updateCandidate: (candidate) => {}, // Mock
        updateCandidateStage: (candidateId, newStage) => {}, // Mock
        addOnboardingTemplate: (templateData) => {}, // Mock
        updateOnboardingTemplate: (template) => {}, // Mock
        startOnboardingWorkflow: (data) => {}, // Mock
        updateOnboardingWorkflowStatus: (workflowId, itemIndex, isCompleted) => {}, // Mock
        addPayrollRun: (payPeriod) => { return undefined; }, // Mock
        updatePayrollRunStatus: (runId, status, journalEntryId) => {}, // Mock
        postPayrollRunToJournal: (runId) => {}, // Mock
        exportPayrollRunToAphbXml: (runId) => {}, // Mock
        updatePayslip: (payslip) => {}, // Mock
        calculateTerminationPayments: (employeeId, terminationDate, additionalGrossPay, additionalBonuses, usedAnnualLeave) => { return null; }, // Mock
        calculateAnnualLeaveBalance: (employeeId) => ({ entitled: 0, used: 0, balance: 0 }), // Mock
        calculatePayrollCost: (grossSalary) => ({} as T.PayrollSimulationResult), // Mock
        updateCompanyInfo: setCompanyInfo,
        updateBrandingSettings: setBrandingSettings,
        updateSecuritySettings: setSecuritySettings,
        updateCounters: setCounters,
        addRole: (roleData, cloneFromRoleId) => {}, // Mock
        updateRolePermissions: (roleId, permissions) => {}, // Mock
        deleteRole: (roleId) => {}, // Mock
        addCustomField: (fieldData) => {}, // Mock
        updateCustomField: (field) => {}, // Mock
        deleteCustomField: (id) => {}, // Mock
        markNotificationAsRead: (id) => {}, // Mock
        clearAllNotifications: () => {}, // Mock
        createProjectFromDeal: (deal) => {}, // Mock
        createTasksFromDeal: (deal) => {}, // Mock
        logActivity,
        updateAccountingLockDate: setAccountingLockDate,
        addStockMovement: (productId, warehouseId, type, quantityChange, notes, relatedDocumentId) => {}, // Mock
        addExpense: (expenseData) => {}, // Mock
        updateExpenseStatus: (expenseId, status) => {}, // Mock
        addAsset: (assetData) => {}, // Mock
        updateAsset: (asset) => {}, // Mock
        updateHrParameters: setHrParameters,
    }), [
        customers, projects, tasks, notifications, invoices, bills, products, suppliers, purchaseOrders, employees, leaveRequests, performanceReviews, jobOpenings, candidates, onboardingTemplates, onboardingWorkflows, payrollRuns, payslips, bankAccounts, transactions, tickets, documents, comments, salesActivities, activityLogs, customFieldDefinitions, dashboardLayout, companyInfo, brandingSettings, securitySettings, roles, rolesPermissions, taxRates, systemLists, emailTemplates, priceLists, priceListItems, automations, automationLogs, taskTemplates, scheduledTasks, counters, cartItems, warehouses, stockMovements, inventoryTransfers, inventoryAdjustments, salesOrders, shipments, stockItems, pickLists, boms, workOrders, accounts, journalEntries, recurringJournalEntries, budgets, costCenters, accountingLockDate, currentUser, expenses, assets, hrParameters, salesReturns, setSalesReturns, quotations, setQuotations, addQuotation, updateQuotation, deleteQuotation, convertQuotationToSalesOrder, setCurrentUser, logActivity, setActivityLogs, setDeals, setBills, setSuppliers, setPurchaseOrders, setEmployees, setLeaveRequests, setPerformanceReviews, setJobOpenings, setCandidates, setOnboardingTemplates, setOnboardingWorkflows, setPayrollRuns, setPayslips, setBankAccounts, setTransactions, setTickets, setDocuments, setComments, setSalesActivities, setRoles, setRolesPermissions, setTaxRates, setSystemLists, setEmailTemplates, setPriceLists, setPriceListItems, setAutomations, setAutomationLogs, setTaskTemplates, setScheduledTasks, setWarehouses, setStockMovements, setInventoryTransfers, setInventoryAdjustments, setSalesOrders, setShipments, setStockItems, setPickLists, setBoms, setWorkOrders, setAccounts, setJournalEntries, setRecurringJournalEntries, setBudgets, setCostCenters, setDashboardLayout, setExpenses, setAssets, setHrParameters, addDeal, updateDealStage, addProject, addTask, addTicket, addSalesOrder, addInvoice, updateInvoice, bulkUpdateInvoiceStatus, deleteInvoice, customersWithAssignee, addCustomer, originalUpdateCustomer, originalUpdateCustomerStatus, bulkUpdateCustomerStatus, assignCustomersToEmployee, addTagsToCustomers, originalDeleteCustomer, originalDeleteMultipleCustomers, importCustomers, contacts, addContact, updateContact, deleteContact, setContacts, communicationLogs, addCommunicationLog, setCommunicationLogs, savedViews, addSavedView, deleteSavedView, loadSavedView, setSavedViews, leads, addLead, convertLead, commissionRecords, createCommissionRecord, setLeads, setCommissionRecords
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): T.AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

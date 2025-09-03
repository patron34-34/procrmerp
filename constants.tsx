import React from 'react';
import { 
    Customer, Deal, Project, Task, Notification, Invoice, Product, Supplier, PurchaseOrder, 
    Employee, LeaveRequest, BankAccount, Transaction, SupportTicket, Permission, 
    ActivityLog, Document, DashboardWidget, Comment, CommunicationLog, 
    SavedView, SortConfig, Contact, DealLineItem, CustomFieldDefinition, 
    SalesActivity, PerformanceReview, JobOpening, Candidate, OnboardingTemplate, OnboardingWorkflow, 
    OnboardingWorkflowStatus, OnboardingType, CompanyInfo, CustomFieldType, BrandingSettings, 
    SecuritySettings, Role, Account, JournalEntry, JournalEntryItem, JournalEntryType, JournalEntryStatus, 
    AccountType, RecurringJournalEntry, RecurringFrequency, Budget, CostCenter, Bill, BillStatus, 
    TaxRate, SystemLists, SystemListItem, EmailTemplate, 
    PriceList, PriceListItem, InvoiceStatus, DealStage, PurchaseOrderStatus, LeaveType, LeaveStatus, 
    TaskStatus, TaskPriority, TicketStatus, TicketPriority, CandidateStage, Automation, AutomationLog, 
    AutomationTriggerType, AutomationActionType, Warehouse, StockMovement, InventoryTransfer, 
    InventoryAdjustment, StockMovementType, AdjustmentReason, InventoryAdjustmentStatus, 
    SalesOrder, SalesOrderStatus, Shipment, ShipmentStatus, WidgetConfig, 
    StockItem, StockItemStatus, SalesOrderItem, PickList, PickListItem, InvoiceLineItem, ShipmentItem, 
    PayrollRun, Payslip, TaskTemplate, ScheduledTask, Attachment, Address,
// FIX: Fix typo in type import.
    ReportCardInfo, Cinsiyet, CalismaStatusu, SigortaKolu, MedeniDurum, EgitimSeviyesi,
    ProductType, EInvoiceType, Unit, SupplierContact, BillOfMaterials, WorkOrder, WorkOrderStatus,
    InvoiceType, EInvoiceScenario, EInvoiceProfile, CountersSettings, JobOpeningStatus, AssignedDepartment,
    Expense, ExpenseStatus, Asset, AssetStatus,
    TransactionType, TransactionCategory, DocumentType, CommunicationLogType, SalesActivityType,
    HrParameters,
    Quotation,
    Lead,
    CommissionRecord
} from './types';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 208 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="var(--primary-color, #4f46e5)" /> 
                <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
        </defs>
        {/* 'P' part of the icon */}
        <path d="M8 0H28C38.4934 0 47 8.50659 47 19V19C47 29.4934 38.4934 38 28 38H22V50H8V0Z" fill="url(#logoGradient)"/>
        {/* 'F' part of the icon */}
        <path d="M22 0H41V10H22V0Z" fill="url(#logoGradient)"/>
        <path d="M22 19H35V29H22V19Z" fill="url(#logoGradient)"/>
        
        {/* Text "ProFusion" */}
        <text x="58" y="35" fontFamily="Inter, sans-serif" fontSize="30" fill="currentColor">
            <tspan fontWeight="800">Pro</tspan>
            <tspan fontWeight="500">Fusion</tspan>
        </text>
    </svg>
);

const iconBaseClass = "h-6 w-6";
const smallIconBaseClass = "h-5 w-5";

export const ICONS = {
    dashboard: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>,
    customers: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    sales: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
    projects: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H22v10z"/></svg>,
    planner: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>,
    inventory: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 6H4V4h16v4zm0 10H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H4v-4h16v4z"/></svg>,
    manufacturing: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 6l9 15H3m14-8v-2h-4v2h4z"/></svg>,
    invoices: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    bank: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3h6m-6 3h6m-6 3h6m-6 3h6" /></svg>,
    accounting: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6" /></svg>,
    hr: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.66c.12-.144.237-.29.348-.437m-5.165 4.908a2.25 2.25 0 01-3.182-3.182 2.25 2.25 0 013.182 3.182zM12 12a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" /></svg>,
    reports: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    adminPanel: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>,
    list: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    kanban: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm3 1h4v12H8V4z" /></svg>,
    map: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V3.362l-2.073 1.382A.75.75 0 018.5 4.5v4.25a.75.75 0 01-1.5 0V5.513l-2.073 1.382A.75.75 0 014.25 6.5v8a.75.75 0 01-1.5 0v-8A2.25 2.25 0 015 4.362l2.5-1.667A2.25 2.25 0 0110 4.362l2.5 1.667A2.25 2.25 0 0115 8.138v4.112a2.25 2.25 0 01-2.5 2.167 2.25 2.25 0 01-2.5-2.167v-1.25a.75.75 0 011.5 0v1.25c0 .414.336.75.75.75s.75-.336.75-.75V8.138a.75.75 0 00-.377-.654L10.377 6.1a.75.75 0 010-1.308l2.5-1.667A.75.75 0 0012 2.25v-.75A.75.75 0 0112 1.5z" clipRule="evenodd" /></svg>,
    import: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.28 8.28a.75.75 0 10-1.06 1.06l4.25 4.25a.75.75 0 001.06 0l4.25-4.25a.75.75 0 10-1.06-1.06l-2.97 2.97V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>,
    add: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>,
    analytics: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 11.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-2.5h-1v2.5a.5.5 0 01-1 0v-3zM8.25.5a.5.5 0 00-.5.5v14a.5.5 0 001 0v-14a.5.5 0 00-.5.5zM14.5 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v10a.5.5 0 01-1 0v-9.5h-1v9.5a.5.5 0 01-1 0v-10z" clipRule="evenodd" /></svg>,
    export: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.75a.75.75 0 01.75.75v8.614l2.97-2.97a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 11.28a.75.75 0 011.06-1.06l2.97 2.97V4.5a.75.75 0 01.75-.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>,
    edit: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>,
    trash: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    close: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    general: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.95 7.95 0 005.965.044l2.836-.616a.75.75 0 00.572-1.242l-2.66-2.918a.75.75 0 00-1.152-.088l-1.42 1.238a4.95 4.95 0 00-5.074-.032L3.5 8.351V2.75z" /></svg>,
    appearance: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" /><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-1.06 1.061a1 1 0 11-1.415-1.414l1.061-1.06a1 1 0 011.414 0zM5.354 7.768a1 1 0 00-1.415-1.414L2.879 7.414a1 1 0 101.414 1.414l1.061-1.06zM17.414 14.121a1 1 0 01-1.414 0l-1.061-1.06a1 1 0 111.415-1.415l1.06 1.061a1 1 0 010 1.414zM4.293 14.121a1 1 0 10-1.414-1.414L3.94 11.646a1 1 0 101.414 1.414l-1.06 1.061z" clipRule="evenodd" /></svg>,
    security: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>,
    employees: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.98 9.98 0 0010 18a9.98 9.98 0 006.125-2.095 1.23 1.23 0 00.41-1.412A6.969 6.969 0 0010 11.5a6.969 6.969 0 00-6.535 2.993z" /></svg>,
    roles: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.66c.12-.144.237-.29.348-.437" /></svg>,
    customization: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    integrations: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
    dataManagement: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>,
    priceList: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    tax: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V2.75l3.75 1.5 3.75-1.5 3.75 1.5z" /></svg>,
    costCenter: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0c0-5.942 4.03-10.834 9-11.822m0 23.644c-4.97 0-9-4.882-9-10.822m9 11.822c4.97 0 9-4.882 9-10.822M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    counters: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0-4.991v4.99" /></svg>,
    expenses: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    support: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    warehouse: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5-1.5-.545M3 4.5l4.5 1.636M6.75 6.75l4.5 1.636" /></svg>,
    asset: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    payroll: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    leave: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>,
    team: <svg className={iconBaseClass} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    documents: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    suppliers: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875M16.5 14.25v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.5 0H5.625c-.621 0-1.125.504-1.125 1.125v1.5a1.125 1.125 0 01-1.125 1.125h-1.5m12-9l-3.75 3.75-3.75-3.75" /></svg>,
    lock: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    calendar: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>,
    gantt: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>,
    magic: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.037-.502.082-.752.132M9.75 3.104a2.25 2.25 0 00-2.25 2.25c0 1.02.623 1.904 1.5 2.21M9.75 3.104a2.25 2.25 0 012.25 2.25c0 1.02-.623 1.904-1.5 2.21M14.25 14.5l-4.25-4.25m4.25 4.25v5.714a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-5.714m4.25 4.25c-.251.037-.502.082-.752.132M14.25 14.5a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-5.714m-4.25 4.25a2.25 2.25 0 01-2.25-2.25c0-1.02.623 1.904 1.5-2.21M14.25 14.5c.251.037.502.082.752.132M14.25 14.5a2.25 2.25 0 00-2.25-2.25c0-1.02.623 1.904 1.5-2.21M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>,
    starFilled: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2.5a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L10 13.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192-3.047-2.97a.75.75 0 01.416-1.28l4.21-.612L9.327 2.918A.75.75 0 0110 2.5z" clipRule="evenodd" /></svg>,
    starOutline: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988H8.88a.563.563 0 00.475-.31L11.48 3.5z" /></svg>,
    tasks: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>,
    filePdf: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V6.621a2.25 2.25 0 00-.659-1.591l-2.871-2.871A2.25 2.25 0 0013.121 2H4.25zM12 2.5a.5.5 0 01.5.5v2.25a.75.75 0 00.75.75H15.5a.5.5 0 010 1h-7a.5.5 0 010-1h3.75V3a.5.5 0 01.5-.5z" /><path d="M8.5 11.75a.75.75 0 01.75-.75h2a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75z" /></svg>,
    fileCsv: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    search: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.358 3.358a1 1 0 01-1.414 1.414l-3.358-3.358A7 7 0 012 9z" clipRule="evenodd" /></svg>,
    notification: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.632l-1.42 2.13a1.5 1.5 0 001.257 2.257h10.518H17.5" /></svg>,
    transfer: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    adjustment: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    receive: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    purchaseOrder: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    fileWord: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V6.621a2.25 2.25 0 00-.659-1.591l-2.871-2.871A2.25 2.25 0 0013.121 2H4.25zM12 2.5a.5.5 0 01.5.5v2.25a.75.75 0 00.75.75H15.5a.5.5 0 010 1h-7a.5.5 0 010-1h3.75V3a.5.5 0 01.5-.5z" /><path d="M6.25 11.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm3.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" /></svg>,
    fileExcel: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V6.621a2.25 2.25 0 00-.659-1.591l-2.871-2.871A2.25 2.25 0 0013.121 2H4.25zM12 2.5a.5.5 0 01.5.5v2.25a.75.75 0 00.75.75H15.5a.5.5 0 010 1h-7a.5.5 0 010-1h3.75V3a.5.5 0 01.5-.5z" /><path d="M6.5 11a.5.5 0 01.5.5v.5h.5a.5.5 0 010 1H7v.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm2.5.5a.5.5 0 000-1h3a.5.5 0 000 1h-3z" /></svg>,
    fileImage: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V6.621a2.25 2.25 0 00-.659-1.591l-2.871-2.871A2.25 2.25 0 0013.121 2H4.25zM12 2.5a.5.5 0 01.5.5v2.25a.75.75 0 00.75.75H15.5a.5.5 0 010 1h-7a.5.5 0 010-1h3.75V3a.5.5 0 01.5-.5z" /><path d="M6 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7.5 2.5a.5.5 0 00-1 0v.5h.5a.5.5 0 000-1h-.5v-.5a.5.5 0 00-1 0v.5a1.5 1.5 0 001.5 1.5v.5a.5.5 0 001 0v-2.5a.5.5 0 00-.5-.5z" /></svg>,
    fileOther: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V6.621a2.25 2.25 0 00-.659-1.591l-2.871-2.871A2.25 2.25 0 0013.121 2H4.25zM12 2.5a.5.5 0 01.5.5v2.25a.75.75 0 00.75.75H15.5a.5.5 0 010 1h-7a.5.5 0 010-1h3.75V3a.5.5 0 01.5-.5z" /></svg>,
    folder: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>,
    share: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 100-2.186m0 2.186c-.18.324-.283.696-.283 1.093s.103.77.283 1.093m0-2.186l-9.566-5.314" /></svg>,
    saveAndNew: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    save: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" /></svg>,
    phoneCall: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>,
    meeting: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    email: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    system: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.131-1.002h1.053c.571 0 1.04.46 1.131 1.002l.667 4.004c.026.155.05.309.076.463c.313.978.756 1.855 1.332 2.615c.575.76.825 1.724.825 2.723v.81c0 1.13-.57 2.138-1.465 2.744c-.958.645-2.16.945-3.415.945h-1.054c-1.254 0-2.456-.3-3.415-.945C6.57 16.96 6 15.952 6 14.822v-.81c0-1-.25-1.962.825-2.723c.576-.76 1.02-1.637 1.332-2.615a13.32 13.32 0 01.076-.463l.667-4.004z" /></svg>,
    note: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    ellipsisVertical: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
    copy: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a2.25 2.25 0 01-2.25-2.25v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>,
    reverse: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0-4.991v4.99" /></svg>,
    budget: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m1.5-3.75h-1.5m-16.5 18.75v-16.5c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v16.5" /></svg>,
    trialBalance: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m8.25-15.75l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25M3.75 12h16.5" /></svg>,
    balanceSheet: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16.5a1.5 1.5 0 01-1.5-1.5v-10a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5v10a1.5 1.5 0 01-1.5-1.5h-9zM5 8.5h4V5H5v3.5zM10.5 8.5H15V5h-4.5v3.5zM5 15h4.5v-3.5H5V15zm5.5 0H15v-3.5h-4.5V15z" /></svg>,
    incomeStatement: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>,
    cashFlow: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    ledger: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    arAging: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>,
    profitAndLoss: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    salesOrder: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.116 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    shipment: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>,
    print: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>,
    check: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    pickList: <svg className={iconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>,
    fileXml: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.25A2.25 2.25 0 006 20.25z" /></svg>,
    filter: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
    view: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    commission: <svg className={smallIconBaseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m1.5-3.75h-1.5m-16.5 18.75v-16.5c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v16.5" /></svg>,
};

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 1, name: "Tekno A.Ş.", company: "Tekno A.Ş.", email: "info@tekno.com", phone: "0212 123 4567", lastContact: "2024-05-10", status: "aktif", avatar: "https://i.pravatar.cc/150?u=c1", industry: "Teknoloji", tags: ["vip", "yeni-fırsat"], assignedToId: 1, leadSource: "Website", priceListId: 1, healthScore: 92,
        accountType: 'Tüzel Kişi', accountCode: 'C001', taxId: '1234567890', taxOffice: 'Maslak',
        billingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Şişli', streetAddress: 'Büyükdere Cd. No: 1', postalCode: '34394', email: 'muhasebe@tekno.com', phone: '0212 123 4567', coordinates: { lat: 41.077, lng: 29.01 } },
        shippingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Şişli', streetAddress: 'Büyükdere Cd. No: 1', postalCode: '34394', email: 'operasyon@tekno.com', phone: '0212 123 4568' },
        iban: 'TR110006200000000006212345', openingBalance: 5000, currency: 'TRY', openingDate: '2023-01-15',
        eInvoiceMailbox: 'urn:mail:defaultpk@tekno.com'
    },
    {
        id: 2, name: "Lojistik Ltd.", company: "Lojistik Ltd.", email: "info@lojistik.com.tr", phone: "0312 987 6543", lastContact: "2024-04-22", status: "potensiyel", avatar: "https://i.pravatar.cc/150?u=c2", industry: "Lojistik", tags: ["takip", "büyük-anlaşma"], assignedToId: 2, leadSource: "Referans", healthScore: 75,
        accountType: 'Tüzel Kişi', accountCode: 'C002', taxId: '0987654321', taxOffice: 'Ulus',
        billingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Blv. No: 100', postalCode: '06100', email: 'muhasebe@lojistik.com.tr', phone: '0312 987 6543', coordinates: { lat: 39.92, lng: 32.85 } },
        shippingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Blv. No: 100', postalCode: '06100', email: '', phone: '' },
        iban: 'TR220001000000000012345678', openingBalance: 0, currency: 'TRY', openingDate: '2024-03-01',
    },
    {
        id: 3, name: "Gıda Pazarlama", company: "Gıda Pazarlama", email: "info@gidapazarlama.com", phone: "0232 555 1234", lastContact: "2024-05-15", status: "kaybedilmiş", avatar: "https://i.pravatar.cc/150?u=c3", industry: "Gıda", tags: ["fiyat-hassas"], assignedToId: 1, leadSource: "Fuar", healthScore: 34,
        accountType: 'Tüzel Kişi', accountCode: 'C003', taxId: '1122334455', taxOffice: 'Konak',
        billingAddress: { country: 'Türkiye', city: 'İzmir', district: 'Konak', streetAddress: 'Gazi Blv. No: 50', postalCode: '35210', email: 'muhasebe@gidapazarlama.com', phone: '0232 555 1234', coordinates: { lat: 38.42, lng: 27.14 } },
        shippingAddress: { country: 'Türkiye', city: 'İzmir', district: 'Konak', streetAddress: 'Gazi Blv. No: 50', postalCode: '35210', email: '', phone: '' },
        iban: 'TR330001200000000054321098', openingBalance: -1200, currency: 'TRY', openingDate: '2023-11-20'
    },
    {
        id: 4, name: "İnşaat A.Ş.", company: "İnşaat A.Ş.", email: "info@insaat.com", phone: "0216 444 5566", lastContact: "2024-05-01", status: "aktif", avatar: "https://i.pravatar.cc/150?u=c4", industry: "İnşaat", tags: ["anahtar-müşteri"], assignedToId: 2, leadSource: "Soğuk Arama", healthScore: 88,
        accountType: 'Tüzel Kişi', accountCode: 'C004', taxId: '9988776655', taxOffice: 'Kadıköy',
        billingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Ataşehir', streetAddress: 'Barbaros Mah. Lale Sk. No: 8', postalCode: '34746', email: 'muhasebe@insaat.com', phone: '0216 444 5566', coordinates: { lat: 40.99, lng: 29.1 } },
        shippingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Ataşehir', streetAddress: 'Barbaros Mah. Lale Sk. No: 8', postalCode: '34746', email: '', phone: '' },
        iban: 'TR440006400000112345678901', openingBalance: 0, currency: 'TRY', openingDate: '2023-08-10'
    }
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 1, customerId: 1, name: "Ahmet Yılmaz", title: "CEO", email: "ahmet.yilmaz@tekno.com", phone: "0532 123 4567" },
    { id: 2, customerId: 1, name: "Fatma Öztürk", title: "Satın Alma Müdürü", email: "fatma.ozturk@tekno.com", phone: "0533 987 6543" },
    { id: 3, customerId: 2, name: "Mehmet Kaya", title: "Operasyon Direktörü", email: "mehmet.kaya@lojistik.com.tr", phone: "0542 555 1234" }
];

export const MOCK_DEALS: Deal[] = [
    { id: 1, title: "Tekno A.Ş. - CRM Projesi", customerId: 1, customerName: "Tekno A.Ş.", value: 15000, stage: DealStage.Won, closeDate: "2024-04-20", assignedToId: 1, assignedToName: "Ali Veli", lineItems: [], lastActivityDate: '2024-04-18', winReason: 'Ürün Kalitesi' },
    { id: 2, title: "Lojistik Ltd. - Depo Otomasyonu", customerId: 2, customerName: "Lojistik Ltd.", value: 75000, stage: DealStage.Proposal, closeDate: "2024-06-15", assignedToId: 2, assignedToName: "Ayşe Kaya", lineItems: [], lastActivityDate: '2024-05-10' },
    { id: 3, title: "Gıda Pazarlama - Raporlama Sistemi", customerId: 3, customerName: "Gıda Pazarlama", value: 8000, stage: DealStage.Lost, closeDate: "2024-05-12", assignedToId: 1, assignedToName: "Ali Veli", lineItems: [], lastActivityDate: '2024-05-11', lossReason: 'Fiyat' },
    { id: 4, title: "Tekno A.Ş. - Destek Paketi", customerId: 1, customerName: "Tekno A.Ş.", value: 5000, stage: DealStage.Lead, closeDate: "2024-07-01", assignedToId: 1, assignedToName: "Ali Veli", lineItems: [], lastActivityDate: '2024-05-15' }
];

export const MOCK_PROJECTS: Project[] = [
    { id: 1, name: "Tekno A.Ş. CRM Implementasyonu", customerId: 1, client: "Tekno A.Ş.", deadline: "2024-08-30", status: "zamanında", progress: 65, description: "Müşterinin tüm satış süreçlerinin yeni CRM sistemine aktarılması.", startDate: "2024-05-01", teamMemberIds: [1, 3], budget: 20000, spent: 12500, tags: ["crm", "faz-1"] },
    { id: 2, name: "İnşaat A.Ş. Web Sitesi Yenileme", customerId: 4, client: "İnşaat A.Ş.", deadline: "2024-07-15", status: "riskli", progress: 80, description: "Kurumsal web sitesinin modern standartlara göre yeniden tasarlanması ve geliştirilmesi.", startDate: "2024-04-10", teamMemberIds: [2, 4], budget: 15000, spent: 14000, tags: ["web", "tasarım"] }
];

export const MOCK_TASKS: Task[] = [
    { id: 1, title: "Proje planını oluştur", description: "", status: TaskStatus.Completed, priority: TaskPriority.High, dueDate: "2024-05-05", assignedToId: 1, assignedToName: "Ali Veli", relatedEntityType: "project", relatedEntityId: 1, relatedEntityName: "Tekno A.Ş. CRM Implementasyonu", timeSpent: 120, estimatedTime: 180 },
    { id: 2, title: "Müşteri ile toplantı ayarla", description: "Proje başlangıç toplantısı.", status: TaskStatus.InProgress, priority: TaskPriority.Normal, dueDate: "2024-06-10", assignedToId: 2, assignedToName: "Ayşe Kaya", relatedEntityType: "project", relatedEntityId: 2, relatedEntityName: "İnşaat A.Ş. Web Sitesi Yenileme", isStarred: true },
    { id: 3, title: "Teklif hazırla", description: "Depo otomasyonu için detaylı teklif.", status: TaskStatus.Todo, priority: TaskPriority.High, dueDate: "2024-06-05", assignedToId: 2, assignedToName: "Ayşe Kaya", relatedEntityType: "deal", relatedEntityId: 2, relatedEntityName: "Lojistik Ltd. - Depo Otomasyonu", dependsOn: [2] },
    { id: 4, title: "Ana sayfa tasarımını onayla", description: "", status: TaskStatus.Todo, priority: TaskPriority.Normal, dueDate: "2024-06-15", assignedToId: 4, assignedToName: "Zeynep Çelik", parentId: 2 },
    { id: 5, title: "Aylık Raporları Gönder", description: "Tüm müşterilere aylık aktivite raporlarını gönder.", status: TaskStatus.Todo, priority: TaskPriority.Normal, dueDate: "2024-06-30", assignedToId: 1, assignedToName: "Ali Veli", recurrenceRule: "FREQ=MONTHLY" }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, message: "Ali Veli yeni bir görev atadı: 'Teklif hazırla'", type: "info", read: false, timestamp: "2024-05-16 10:30" },
    { id: 2, message: "Proje 'Tekno A.Ş. CRM' riskli durumda.", type: "warning", read: false, timestamp: "2024-05-16 09:15" },
    { id: 3, message: "Fatura #2024-001 ödendi.", type: "success", read: true, timestamp: "2024-05-15 14:00" },
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 1, invoiceNumber: "2024-001", customerId: 1, customerName: "Tekno A.Ş.", issueDate: "2024-04-25", dueDate: "2024-05-25", status: InvoiceStatus.Paid,
        items: [{ id: 1, productId: 1, productName: "CRM Lisans Yıllık", quantity: 1, unitPrice: 10000, discountRate: 0, taxRate: 20, unit: 'Adet', discountAmount: 0, taxAmount: 2000, totalPrice: 10000, vatIncludedPrice: 12000 }],
        subTotal: 10000, totalDiscount: 0, totalTax: 2000, grandTotal: 12000, amountInWords: 'On iki bin Lira', totalWithholding: 0,
        customizationId: 'TR1.2', scenario: EInvoiceScenario.EFatura, invoiceType: 'Satış', issueTime: '14:30', documentCurrency: 'TRY'
    },
    {
        id: 2, invoiceNumber: "2024-002", customerId: 4, customerName: "İnşaat A.Ş.", issueDate: "2024-05-10", dueDate: "2024-06-10", status: InvoiceStatus.Sent,
        items: [{ id: 2, productId: 2, productName: "Web Tasarım Hizmeti", quantity: 1, unitPrice: 8000, discountRate: 10, taxRate: 20, unit: 'Adet', discountAmount: 800, taxAmount: 1440, totalPrice: 7200, vatIncludedPrice: 8640 }],
        subTotal: 8000, totalDiscount: 800, totalTax: 1440, grandTotal: 8640, amountInWords: 'Sekiz bin altı yüz kırk Lira', totalWithholding: 0,
        customizationId: 'TR1.2', scenario: EInvoiceScenario.EArsiv, invoiceType: 'Satış', issueTime: '10:00', documentCurrency: 'TRY'
    }
];

export const MOCK_QUOTATIONS: Quotation[] = [];

export const MOCK_BILLS: Bill[] = [
    { id: 1, supplierId: 1, supplierName: "Sunucu Hizmetleri A.Ş.", billNumber: "SH-2024-556", issueDate: "2024-05-01", dueDate: "2024-05-20", totalAmount: 1200, status: BillStatus.Paid },
    { id: 2, supplierId: 2, supplierName: "Ofis Malzemeleri Ltd.", billNumber: "OM-890", issueDate: "2024-05-15", dueDate: "2024-06-15", totalAmount: 450, status: BillStatus.Payable }
];

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: "CRM Lisans Yıllık", sku: "CRM-YILLIK-01", price: 10000, category: "Yazılım", productType: ProductType.Hizmet, eInvoiceType: EInvoiceType.Hizmet, unit: Unit.Adet, lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 10000, saleCurrency: 'TRY', vatRate: 20 } },
    { id: 2, name: "Web Tasarım Hizmeti", sku: "WEB-HIZMET-01", price: 8000, category: "Hizmet", productType: ProductType.Hizmet, eInvoiceType: EInvoiceType.Hizmet, unit: Unit.Saat, lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 8000, saleCurrency: 'TRY', vatRate: 20 } },
];

// START: ADDED MISSING MOCK DATA AND CONSTANTS

export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [
    { id: 1, customerId: 1, type: CommunicationLogType.Call, content: "Proje başlangıç toplantısı yapıldı. Tüm gereksinimler anlaşıldı.", timestamp: "2024-05-10T14:00:00Z", userId: 1, userName: "Ali Veli" },
    { id: 2, customerId: 2, type: CommunicationLogType.Email, content: "Depo otomasyonu teklifi gönderildi. Geri dönüş bekleniyor.", timestamp: "2024-05-10T11:00:00Z", userId: 2, userName: "Ayşe Kaya" }
];

export const MOCK_SAVED_VIEWS: SavedView[] = [
    { id: 1, name: "VIP Müşterilerim", filters: { status: "aktif", industry: "Teknoloji", assignedToId: "1", leadSource: "all" }, sortConfig: { key: 'name', direction: 'ascending' } }
];

export const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: 1, name: "Sunucu Hizmetleri A.Ş.", email: "destek@sunucu.com", phone: "0850 123 4567", avatar: "https://i.pravatar.cc/150?u=s1", tags: ["hosting", "altyapı"],
        accountType: 'Tüzel Kişi', accountCode: 'S001', taxId: '1112223333', taxOffice: 'Beşiktaş',
        address: { country: 'Türkiye', city: 'İstanbul', district: 'Beşiktaş', streetAddress: 'Barbaros Blv.', postalCode: '34353', email: 'destek@sunucu.com', phone: '0850 123 4567' },
        iban: 'TR100006200000000006298765', openingBalance: -1200, currency: 'TRY', openingDate: '2023-02-01'
    },
    {
        id: 2, name: "Ofis Malzemeleri Ltd.", email: "siparis@ofis.com", phone: "0212 987 6543", avatar: "https://i.pravatar.cc/150?u=s2", tags: ["kırtasiye"],
        accountType: 'Tüzel Kişi', accountCode: 'S002', taxId: '4445556666', taxOffice: 'Eminönü',
        address: { country: 'Türkiye', city: 'İstanbul', district: 'Fatih', streetAddress: 'Sirkeci Cd.', postalCode: '34112', email: 'siparis@ofis.com', phone: '0212 987 6543' },
        iban: 'TR200001000000000012398765', openingBalance: 0, currency: 'TRY', openingDate: '2023-05-15'
    }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
    { id: 1, poNumber: "PO-2024-001", supplierId: 2, supplierName: "Ofis Malzemeleri Ltd.", orderDate: "2024-05-02", expectedDate: "2024-05-09", targetWarehouseId: 1, status: PurchaseOrderStatus.Received, items: [], totalAmount: 450, billId: 2 },
];

export const MOCK_EMPLOYEES: Employee[] = [
    { id: 1, employeeId: "EMP001", name: "Ali Veli", department: "Satış", position: "Satış Yöneticisi", email: "ali.veli@profusion.com", phone: "0532 111 2233", hireDate: "2022-01-15", salary: 25000, avatar: "https://i.pravatar.cc/150?u=e1", role: "yonetici", managerId: 2 },
    { id: 2, employeeId: "EMP002", name: "Ayşe Kaya", department: "Yönetim", position: "Genel Müdür", email: "ayse.kaya@profusion.com", phone: "0532 222 3344", hireDate: "2020-03-01", salary: 40000, avatar: "https://i.pravatar.cc/150?u=e2", role: "admin" },
    { id: 3, employeeId: "EMP003", name: "Mehmet Yılmaz", department: "Teknik", position: "Proje Yöneticisi", email: "mehmet.yilmaz@profusion.com", phone: "0532 333 4455", hireDate: "2021-06-20", salary: 30000, avatar: "https://i.pravatar.cc/150?u=e3", role: "yonetici", managerId: 2 },
    { id: 4, employeeId: "EMP004", name: "Zeynep Çelik", department: "Teknik", position: "Yazılım Geliştirici", email: "zeynep.celik@profusion.com", phone: "0532 444 5566", hireDate: "2023-08-10", salary: 22000, avatar: "https://i.pravatar.cc/150?u=e4", role: "calisan", managerId: 3 }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    { id: 1, employeeId: 1, employeeName: "Ali Veli", leaveType: LeaveType.Annual, startDate: "2024-07-20", endDate: "2024-07-27", reason: "Yaz tatili", status: LeaveStatus.Approved },
    { id: 2, employeeId: 4, employeeName: "Zeynep Çelik", leaveType: LeaveType.Sick, startDate: "2024-05-14", endDate: "2024-05-15", reason: "Grip", status: LeaveStatus.Approved },
    { id: 3, employeeId: 1, employeeName: "Ali Veli", leaveType: LeaveType.Unpaid, startDate: "2024-08-01", endDate: "2024-08-02", reason: "Kişisel", status: LeaveStatus.Pending }
];

export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const MOCK_JOB_OPENINGS: JobOpening[] = [];
export const MOCK_CANDIDATES: Candidate[] = [];
export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [];
export const MOCK_ONBOARDING_WORKFLOWS: OnboardingWorkflow[] = [];
export const MOCK_PAYROLL_RUNS: PayrollRun[] = [];
export const MOCK_PAYSLIPS: Payslip[] = [];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    { id: 1, accountName: "Ana Vadesiz Hesap", bankName: "Garanti BBVA", accountNumber: "TR...1234", balance: 150250.75 },
    { id: 2, accountName: "Dolar Hesabı", bankName: "Akbank", accountNumber: "TR...5678", balance: 25400.50 }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, date: "2024-05-15", description: "Tekno A.Ş. Fatura Ödemesi", amount: 12000, type: TransactionType.Income, category: TransactionCategory.Sales, accountId: 1 },
    { id: 2, date: "2024-05-14", description: "Ofis Kira Ödemesi", amount: 5000, type: TransactionType.Expense, category: TransactionCategory.Rent, accountId: 1 },
    { id: 3, date: "2024-05-13", description: "Sunucu Hizmetleri A.Ş. Fatura", amount: 1200, type: TransactionType.Expense, category: TransactionCategory.Utilities, accountId: 1 }
];

export const MOCK_TICKETS: SupportTicket[] = [
    { id: 1, ticketNumber: "TKT-2024-001", subject: "Raporlarda yavaşlık", description: "Satış raporları çok yavaş yükleniyor.", customerId: 1, customerName: "Tekno A.Ş.", assignedToId: 3, assignedToName: "Mehmet Yılmaz", status: TicketStatus.Open, priority: TicketPriority.High, createdDate: "2024-05-14", attachments: [] }
];

export const MOCK_DOCUMENTS: Document[] = [];
export const MOCK_COMMENTS: Comment[] = [];
export const MOCK_SALES_ACTIVITIES: SalesActivity[] = [];
export const MOCK_CUSTOM_FIELD_DEFINITIONS: CustomFieldDefinition[] = [];

export const INITIAL_DASHBOARD_LAYOUT: DashboardWidget[] = [
  { id: '1', widgetId: 'stat-total-revenue', w: 1, h: 1 },
  { id: '2', widgetId: 'stat-unpaid-invoices', w: 1, h: 1 },
  { id: '3', widgetId: 'stat-active-customers', w: 1, h: 1 },
  { id: '4', widgetId: 'stat-open-tickets', w: 1, h: 1 },
  { id: '5', widgetId: 'chart-financial-summary', w: 4, h: 2 },
  { id: '6', widgetId: 'list-my-tasks', w: 2, h: 2 },
];

export const MOCK_COMPANY_INFO: CompanyInfo = { name: "ProFusion ERP", address: "Teknoloji Vadisi, No:1, İstanbul", phone: "0212 555 0000", email: "info@profusion.com", website: "https://profusion.com" };
export const MOCK_BRANDING_SETTINGS: BrandingSettings = { logoUrl: "", primaryColor: "#3b82f6" };
export const MOCK_SECURITY_SETTINGS: SecuritySettings = { passwordMinLength: 8, passwordRequireUppercase: true, passwordRequireNumber: true, sessionTimeout: 30 };

export const INITIAL_ROLES: Role[] = [
    { id: "admin", name: "Admin", isSystemRole: true },
    { id: "yonetici", name: "Yönetici", isSystemRole: true },
    { id: "calisan", name: "Çalışan", isSystemRole: true },
    { id: "satis", name: "Satış Temsilcisi", isSystemRole: false },
    { id: "muhasebe", name: "Muhasebe Uzmanı", isSystemRole: false }
];

// FIX: Move PERMISSION_DESCRIPTIONS before its usage.
export const PERMISSION_DESCRIPTIONS: { [key in Permission]: { id: Permission, description: string } } = {
    'dashboard:goruntule': { id: 'dashboard:goruntule', description: 'Kontrol panelini görüntüleyebilir.' },
    'dashboard:duzenle': { id: 'dashboard:duzenle', description: 'Kontrol panelindeki bileşenleri düzenleyebilir.' },
    'musteri:goruntule': { id: 'musteri:goruntule', description: 'Müşteri kayıtlarını görüntüleyebilir.' },
    'musteri:yonet': { id: 'musteri:yonet', description: 'Müşteri oluşturabilir, düzenleyebilir ve silebilir.' },
    'anlasma:goruntule': { id: 'anlasma:goruntule', description: 'Satış anlaşmalarını görüntüleyebilir.' },
    'anlasma:yonet': { id: 'anlasma:yonet', description: 'Satış anlaşması oluşturabilir, düzenleyebilir ve silebilir.' },
    'proje:goruntule': { id: 'proje:goruntule', description: 'Projeleri görüntüleyebilir.' },
    'proje:yonet': { id: 'proje:yonet', description: 'Proje oluşturabilir, düzenleyebilir ve silebilir.' },
    'gorev:goruntule': { id: 'gorev:goruntule', description: 'Görevleri görüntüleyebilir.' },
    'gorev:yonet': { id: 'gorev:yonet', description: 'Görev oluşturabilir, düzenleyebilir ve silebilir.' },
    'fatura:goruntule': { id: 'fatura:goruntule', description: 'Faturaları görüntüleyebilir.' },
    'fatura:yonet': { id: 'fatura:yonet', description: 'Fatura oluşturabilir, düzenleyebilir ve silebilir.' },
    'takvim:goruntule': { id: 'takvim:goruntule', description: 'Takvimi görüntüleyebilir.' },
    'rapor:goruntule': { id: 'rapor:goruntule', description: 'Tüm raporları görüntüleyebilir.' },
    'envanter:goruntule': { id: 'envanter:goruntule', description: 'Envanter ve ürünleri görüntüleyebilir.' },
    'envanter:yonet': { id: 'envanter:yonet', description: 'Ürün, tedarikçi, satın alma siparişi yönetebilir.' },
    'depo:yonet': { id: 'depo:yonet', description: 'Depoları yönetebilir.' },
    'stok-hareketi:goruntule': { id: 'stok-hareketi:goruntule', description: 'Stok hareketlerini görüntüleyebilir.' },
    'stok-sayimi:yap': { id: 'stok-sayimi:yap', description: 'Stok sayımı ve düzeltmesi yapabilir.' },
    'satis-siparis:goruntule': { id: 'satis-siparis:goruntule', description: 'Satış siparişlerini görüntüleyebilir.' },
    'satis-siparis:yonet': { id: 'satis-siparis:yonet', description: 'Satış siparişi oluşturabilir, düzenleyebilir ve silebilir.' },
    'sevkiyat:goruntule': { id: 'sevkiyat:goruntule', description: 'Sevkiyatları görüntüleyebilir.' },
    'sevkiyat:yonet': { id: 'sevkiyat:yonet', description: 'Sevkiyat oluşturabilir, düzenleyebilir ve silebilir.' },
    'toplama-listesi:goruntule': { id: 'toplama-listesi:goruntule', description: 'Toplama listelerini görüntüleyebilir.' },
    'toplama-listesi:yonet': { id: 'toplama-listesi:yonet', description: 'Toplama listesi oluşturabilir, düzenleyebilir ve silebilir.' },
    'ik:goruntule': { id: 'ik:goruntule', description: 'İK modülünü ve çalışan bilgilerini (maaş hariç) görüntüleyebilir.' },
    'ik:maas-goruntule': { id: 'ik:maas-goruntule', description: 'Çalışan maaş bilgilerini görüntüleyebilir.' },
    'ik:izin-yonet': { id: 'ik:izin-yonet', description: 'İzin taleplerini yönetebilir.' },
    'ik:performans-yonet': { id: 'ik:performans-yonet', description: 'Performans değerlendirmelerini yönetebilir.' },
    'ik:ise-alim-goruntule': { id: 'ik:ise-alim-goruntule', description: 'İşe alım modülünü görüntüleyebilir.' },
    'ik:ise-alim-yonet': { id: 'ik:ise-alim-yonet', description: 'Açık pozisyon ve adayları yönetebilir.' },
    'ik:oryantasyon-goruntule': { id: 'ik:oryantasyon-goruntule', description: 'Oryantasyon modülünü görüntüleyebilir.' },
    'ik:oryantasyon-yonet': { id: 'ik:oryantasyon-yonet', description: 'Oryantasyon şablon ve iş akışlarını yönetebilir.' },
    'ik:bordro-yonet': { id: 'ik:bordro-yonet', description: 'Bordro süreçlerini yönetebilir.' },
    'ik:rapor-goruntule': { id: 'ik:rapor-goruntule', description: 'İK raporlarını görüntüleyebilir.' },
    'ik:masraf-yonet': { id: 'ik:masraf-yonet', description: 'Masraf taleplerini yönetebilir.' },
    'ik:varlik-yonet': { id: 'ik:varlik-yonet', description: 'Şirket varlıklarını (zimmet) yönetebilir.' },
    'finans:goruntule': { id: 'finans:goruntule', description: 'Finans modülünü görüntüleyebilir.' },
    'finans:yonet': { id: 'finans:yonet', description: 'Banka hesaplarını ve işlemleri yönetebilir.' },
    'destek:goruntule': { id: 'destek:goruntule', description: 'Destek taleplerini görüntüleyebilir.' },
    'destek:yonet': { id: 'destek:yonet', description: 'Destek taleplerini yönetebilir.' },
    'aktivite:goruntule': { id: 'aktivite:goruntule', description: 'Sistem aktivite kayıtlarını görüntüleyebilir.' },
    // FIX: Add missing permission description.
    'dokuman:goruntule': { id: 'dokuman:goruntule', description: 'Dokümanları görüntüleyebilir.' },
    'dokuman:yonet': { id: 'dokuman:yonet', description: 'Doküman oluşturabilir, düzenleyebilir ve silebilir.' },
    'yorum:yonet': { id: 'yorum:yonet', description: 'Kayıtlara yorum ekleyebilir, düzenleyebilir ve silebilir.' },
    'kullanici:yonet': { id: 'kullanici:yonet', description: 'Kullanıcıları ve rollerini yönetebilir.' },
    'ayarlar:goruntule': { id: 'ayarlar:goruntule', description: 'Ayarlar sayfasını görüntüleyebilir.' },
    'ayarlar:genel-yonet': { id: 'ayarlar:genel-yonet', description: 'Genel şirket ayarlarını yönetebilir.' },
    'ayarlar:roller-yonet': { id: 'ayarlar:roller-yonet', description: 'Rolleri ve izinleri yönetebilir.' },
    'ayarlar:guvenlik-yonet': { id: 'ayarlar:guvenlik-yonet', description: 'Güvenlik ayarlarını yönetebilir.' },
    'ayarlar:muhasebe-yonet': { id: 'ayarlar:muhasebe-yonet', description: 'Muhasebe ayarlarını yönetebilir.' },
    'ayarlar:maliyet-merkezi-yonet': { id: 'ayarlar:maliyet-merkezi-yonet', description: 'Maliyet merkezlerini yönetebilir.' },
    'ayarlar:vergi-yonet': { id: 'ayarlar:vergi-yonet', description: 'Vergi oranlarını yönetebilir.' },
    'ayarlar:ik-bordro-yonet': { id: 'ayarlar:ik-bordro-yonet', description: 'İK ve Bordro ayarlarını yönetebilir.' },
    'muhasebe:goruntule': { id: 'muhasebe:goruntule', description: 'Muhasebe modülünü (hesap planı vb.) görüntüleyebilir.' },
    'muhasebe:yonet': { id: 'muhasebe:yonet', description: 'Yevmiye fişi vb. muhasebe kayıtlarını yönetebilir.' },
    'muhasebe:mutabakat-yap': { id: 'muhasebe:mutabakat-yap', description: 'Banka mutabakatı yapabilir.' },
    'muhasebe:defteri-kebir-goruntule': { id: 'muhasebe:defteri-kebir-goruntule', description: 'Defter-i Kebir (muavin) raporunu görüntüleyebilir.' },
    'muhasebe:bilanco-goruntule': { id: 'muhasebe:bilanco-goruntule', description: 'Bilanço raporunu görüntüleyebilir.' },
    'muhasebe:gelir-tablosu-goruntule': { id: 'muhasebe:gelir-tablosu-goruntule', description: 'Gelir Tablosu raporunu görüntüleyebilir.' },
    'muhasebe:nakit-akis-goruntule': { id: 'muhasebe:nakit-akis-goruntule', description: 'Nakit Akış Tablosu raporunu görüntüleyebilir.' },
    'muhasebe:alacak-yaslandirma-goruntule': { id: 'muhasebe:alacak-yaslandirma-goruntule', description: 'Alacak Yaşlandırma raporunu görüntüleyebilir.' },
    'muhasebe:kar-zarar-goruntule': { id: 'muhasebe:kar-zarar-goruntule', description: 'Kar/Zarar raporunu görüntüleyebilir.' },
    'muhasebe:tekrarlanan-yonet': { id: 'muhasebe:tekrarlanan-yonet', description: 'Tekrarlanan yevmiye fişlerini yönetebilir.' },
    'muhasebe:butce-yonet': { id: 'muhasebe:butce-yonet', description: 'Bütçeleri yönetebilir.' },
    'otomasyon:goruntule': { id: 'otomasyon:goruntule', description: 'Otomasyonları görüntüleyebilir.' },
    'otomasyon:yonet': { id: 'otomasyon:yonet', description: 'Otomasyon oluşturabilir, düzenleyebilir ve silebilir.' },
};

export const INITIAL_ROLES_PERMISSIONS: Record<string, Permission[]> = {
    admin: Object.values(PERMISSION_DESCRIPTIONS).map(p => p.id as Permission), // All permissions
    yonetici: ['dashboard:goruntule', 'musteri:goruntule', 'musteri:yonet', 'anlasma:goruntule', 'anlasma:yonet', 'proje:goruntule', 'gorev:goruntule', 'gorev:yonet', 'rapor:goruntule', 'ik:goruntule'],
    calisan: ['dashboard:goruntule', 'musteri:goruntule', 'proje:goruntule', 'gorev:goruntule', 'takvim:goruntule'],
    satis: ['dashboard:goruntule', 'musteri:goruntule', 'musteri:yonet', 'anlasma:goruntule', 'anlasma:yonet', 'fatura:goruntule', 'takvim:goruntule'],
    muhasebe: ['dashboard:goruntule', 'fatura:goruntule', 'fatura:yonet', 'finans:goruntule', 'finans:yonet', 'muhasebe:goruntule', 'muhasebe:yonet', 'muhasebe:mutabakat-yap']
};

export const MOCK_TAX_RATES: TaxRate[] = [{ id: 1, name: "KDV %20", rate: 0.20 }, { id: 2, name: "KDV %10", rate: 0.10 }, { id: 3, name: "KDV %1", rate: 0.01 }];

export const INITIAL_SYSTEM_LISTS: SystemLists = {
    customerStatus: [
        { id: 'aktif', label: 'Aktif', color: '#22c55e' },
        { id: 'potensiyel', label: 'Potensiyel', color: '#3b82f6' },
        { id: 'kaybedilmiş', label: 'Kaybedilmiş', color: '#64748b' }
    ],
    dealStage: [], taskStatus: [], taskPriority: [],
    leadSource: [
        { id: 'Website', label: 'Website' },
        { id: 'Referans', label: 'Referans' },
        { id: 'Fuar', label: 'Fuar' },
        { id: 'Soğuk Arama', label: 'Soğuk Arama' }
    ],
};

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [];
export const MOCK_PRICE_LISTS: PriceList[] = [{ id: 1, name: "Genel Fiyat Listesi", currency: 'TRY', isDefault: true }];
export const MOCK_PRICE_LIST_ITEMS: PriceListItem[] = [];
export const MOCK_AUTOMATIONS: Automation[] = [];
export const MOCK_AUTOMATION_LOGS: AutomationLog[] = [];
export const MOCK_TASK_TEMPLATES: TaskTemplate[] = [];
export const MOCK_SCHEDULED_TASKS: ScheduledTask[] = [];
export const MOCK_COUNTERS_SETTINGS: CountersSettings = { prefix: 'FAT-', nextNumber: 3, padding: 6 };
export const MOCK_WAREHOUSES: Warehouse[] = [{ id: 1, name: 'Ana Depo', location: 'Merkez', isDefault: true }];
export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [];
export const MOCK_INVENTORY_TRANSFERS: InventoryTransfer[] = [];
export const MOCK_INVENTORY_ADJUSTMENTS: InventoryAdjustment[] = [];
export const MOCK_SALES_ORDERS: SalesOrder[] = [];
export const MOCK_SHIPMENTS: Shipment[] = [];
export const MOCK_STOCK_ITEMS: StockItem[] = [];
export const MOCK_PICK_LISTS: PickList[] = [];
export const MOCK_BOMS: BillOfMaterials[] = [];
export const MOCK_WORK_ORDERS: WorkOrder[] = [];
export const MOCK_ACCOUNTS: Account[] = [];
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [];
export const MOCK_RECURRING_JOURNAL_ENTRIES: RecurringJournalEntry[] = [];
export const MOCK_BUDGETS: Budget[] = [];
export const MOCK_COST_CENTERS: CostCenter[] = [];
export const MOCK_EXPENSES: Expense[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const DEFAULT_TURKISH_PAYROLL_PARAMS_2025: HrParameters = { MINIMUM_WAGE_GROSS: 25000, SGK_CEILING: 187500, EMPLOYEE_SGK_RATE: 0.14, EMPLOYEE_UNEMPLOYMENT_RATE: 0.01, EMPLOYER_SGK_RATE: 0.205, EMPLOYER_UNEMPLOYMENT_RATE: 0.02, EMPLOYER_SGK_INCENTIVE_RATE: 0.05, STAMP_DUTY_RATE: 0.00759, INCOME_TAX_EXEMPTION_BASE: 25000, INCOME_TAX_BRACKETS: [{ limit: 110000, rate: 0.15 }, { limit: 230000, rate: 0.20 }, { limit: 870000, rate: 0.27 }, { limit: 3000000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }], SEVERANCE_CEILING: 35058.58 };
export const MOCK_SALES_RETURNS: any[] = [];
export const MOCK_LEADS: Lead[] = [];
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [];

export const AVAILABLE_WIDGETS: WidgetConfig[] = [
    { id: 'stat-total-revenue', name: 'Toplam Gelir', type: 'StatCard', defaultW: 1, defaultH: 1 },
    { id: 'stat-unpaid-invoices', name: 'Ödenmemiş Faturalar', type: 'StatCard', defaultW: 1, defaultH: 1 },
    { id: 'stat-active-customers', name: 'Aktif Müşteriler', type: 'StatCard', defaultW: 1, defaultH: 1 },
    { id: 'stat-open-tickets', name: 'Açık Destek Talepleri', type: 'StatCard', defaultW: 1, defaultH: 1 },
    { id: 'chart-financial-summary', name: 'Finansal Özet', type: 'Chart', defaultW: 4, defaultH: 2 },
    { id: 'list-my-tasks', name: 'Görevlerim', type: 'List', defaultW: 2, defaultH: 2 },
    { id: 'list-recent-activities', name: 'Son Aktiviteler', type: 'List', defaultW: 2, defaultH: 2 },
    { id: 'chart-invoice-status', name: 'Fatura Durum Dağılımı', type: 'Chart', defaultW: 2, defaultH: 2 },
];
export const SGK_TERMINATION_CODES: any[] = [];
export const SGK_PROFESSION_CODES_SAMPLE: any[] = [];
export const CINSIYET_OPTIONS: Cinsiyet[] = ['Erkek', 'Kadın'];
export const CALISMA_STATUSU_OPTIONS: CalismaStatusu[] = ['Tam Zamanlı', 'Yarı Zamanlı', 'Geçici', 'Stajyer'];
export const SIGORTA_KOLU_OPTIONS: SigortaKolu[] = ['4A', '4B', '4C'];
export const MEDENI_DURUM_OPTIONS: MedeniDurum[] = ['Bekar', 'Evli'];
export const EGITIM_SEVIYELERI: EgitimSeviyesi[] = ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
export const SGK_INCENTIVE_CODES: any[] = [];
export const REPORT_CARDS: ReportCardInfo[] = [];
export const HR_REPORT_CARDS: ReportCardInfo[] = [];
export const PROJECT_HOURLY_RATE = 75;
export const DEAL_STAGE_PROBABILITIES: { [key in DealStage]: number } = { [DealStage.Lead]: 0.1, [DealStage.Contacted]: 0.3, [DealStage.Proposal]: 0.6, [DealStage.Won]: 1, [DealStage.Lost]: 0 };
export const WIN_REASONS = ['Fiyat', 'Ürün Kalitesi', 'Hizmet', 'İlişki', 'Diğer'];
export const LOSS_REASONS = ['Fiyat', 'Rakip Ürün', 'Zamanlama', 'Bütçe Yok', 'Diğer'];
export const SGK_MISSING_DAY_REASONS: any[] = [];
export const TEVKIFAT_KODLARI: any[] = [];
export const KDV_MUAFİYET_KODLARI: any[] = [];
export const INVOICE_TYPE_OPTIONS: InvoiceType[] = ['Satış', 'İade', 'Tevkifat', 'İstisna', 'Özel Matrah'];
export const PAYMENT_METHODS: string[] = ['Nakit', 'Banka Transferi', 'Kredi Kartı'];
// END: ADDED MISSING MOCK DATA AND CONSTANTS
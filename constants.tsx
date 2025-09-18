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
    ReportCardInfo, Cinsiyet, CalismaStatusu, SigortaKolu, MedeniDurum, EgitimSeviyesi,
    ProductType, EInvoiceType, Unit, SupplierContact, BillOfMaterials, WorkOrder, WorkOrderStatus,
    InvoiceType, EInvoiceScenario, EInvoiceProfile, CountersSettings, JobOpeningStatus, AssignedDepartment,
    Expense, ExpenseStatus, Asset, AssetStatus,
    TransactionType, TransactionCategory, DocumentType, CommunicationLogType, SalesActivityType,
    HrParameters,
    Quotation, QuotationStatus,
    SalesReturn, SalesReturnStatus,
    Lead, LeadStatus,
    CommissionRecord,
    // FIX: Add missing ActionType import
    ActionType
} from './types';
import { numberToWords } from './utils/numberToWords';


export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 208 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="var(--primary-color, #4f46e5)" /> 
                <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
        </defs>
        <path d="M45.64 31.97L33.2 12.02L20.24 32.55L24.51 39.54L45.64 31.97Z" fill="url(#logoGradient)"/>
        <path d="M2.5 49.5C18.5 49.5 25.42 27.56 45.5 32C41.17 24.33 22.5 8.5 2.5 0.5V49.5Z" fill="url(#logoGradient)" fillOpacity="0.5"/>
        <text x="60" y="35" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="bold" fill="var(--text-main)">ProFusion</text>
    </svg>
);

export const ICONS = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
    customers: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.69c.125.13.248.26.37.39a6.375 6.375 0 01-3.835 6.814z" /></svg>,
    sales: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-2.25M21 12l-3.75 2.25" /></svg>,
    projects: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V5.25A2.25 2.25 0 0018 3H6A2.25 2.25 0 003.75 3zM3.75 14.25V21a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-5.25M6 18h12" /></svg>,
    planner: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 11.25h.008v.008H12v-.008z" /></svg>,
    invoices: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    inventory: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    hr: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    bank: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 0l-3.75 3.75M12 3v0l3.75 3.75m-7.5 3V21h15V6.75a3 3 0 00-3-3H6.75a3 3 0 00-3 3v14.25z" /></svg>,
    reports: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V5.25A2.25 2.25 0 0018 3H6A2.25 2.25 0 003.75 5.25v12.75A2.25 2.25 0 006 20.25z" /></svg>,
    support: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v4.992m11.667 0l-3.181 3.183a8.25 8.25 0 01-11.667 0l-3.181-3.183" /></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" /></svg>,
    security: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>,
    notification: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    search: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.358 3.358a1 1 0 01-1.414 1.414l-3.358-3.358A7 7 0 012 9z" clipRule="evenodd" /></svg>,
    add: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    trash: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.12 0-2.037.953-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
    list: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
    export: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
    import: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
    archive: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    kanban: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
    map: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-10.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V8.25zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM4.5 6.75v8.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V6.75c0-.621-.504-1.125-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125zM19.5 6.75h.008v.008h-.008V6.75z" /></svg>,
    close: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    saveAndNew: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5m-7.5 0l-1 0m1 0l1 0m-1 0l0 10.5m0-10.5L9.25 7.5M15.75 7.5l1 0m-1 0l-1 0m1 0l0 10.5m0-10.5l-.75 0" /></svg>,
    save: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
    lock: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    ellipsisVertical: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
    starFilled: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>,
    starOutline: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    folder: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    filePdf: <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    fileWord: <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    fileExcel: <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    fileImage: <svg className="text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    fileOther: <svg className="text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    share: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" /></svg>,
    copy: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a2.25 2.25 0 01-2.25-2.25V11.25a2.25 2.25 0 012.25-2.25h.094c.349-.313.652-.647.925-.998.273-.351.52-.729.734-1.118.215-.39.392-.792.512-1.207a2.986 2.986 0 012.56-1.465h.345a2.986 2.986 0 012.559 1.465c.12.415.297.817.512 1.207.214.389.46.767.734 1.118.273.351.576.685.925.998h.094a2.25 2.25 0 012.25 2.25v9.563c0 .53-.213 1.036-.59 1.413a1.875 1.875 0 11-3.427-1.11z" /></svg>,
    print: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.366c0-1.623 1.29-2.924 2.923-2.924h.023a2.923 2.923 0 012.924 2.924L12 13.829m0 0V21m0-7.171c2.115-1.166 3.633-3.642 3.633-6.467 0-1.623-1.29-2.924-2.923-2.924h-.023a2.923 2.923 0 01-2.924-2.924V3.366" /></svg>,
    reverse: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>,
    documents: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    commission: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m16.5 0h.375a1.125 1.125 0 011.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
    analytics: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg>,
    suppliers: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18h1a1 1 0 001-1V6a1 1 0 00-1-1h-1m-1 12V6" /></svg>,
    purchaseOrder: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.116 1.007zM8.25 10.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75zm6 0a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75z" /></svg>,
    salesOrder: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.838-5.517c.18-1.077-.738-2.006-1.838-2.006H5.21" /></svg>,
    manufacturing: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>,
    tasks: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    employees: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    leave: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>,
    payroll: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m16.5 0h.375a1.125 1.125 0 011.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
    team: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    transfer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    accounting: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    ledger: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    magic: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a3.375 3.375 0 00-2.455-2.456l-1.178-.648 1.178-.648a3.375 3.375 0 002.455-2.456l.648-1.178.648 1.178a3.375 3.375 0 002.456 2.456l1.178.648-1.178.648a3.375 3.375 0 00-2.456 2.456z" /></svg>,
    general: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>,
    appearance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-5.304-5.304L4.098 14.598a3.75 3.75 0 000 5.304z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5h.008v.008h-.008v-.008zM19.5 12h.008v.008h-.008V12zm-7.5 7.5h.008v.008h-.008v-.008z" /></svg>,
    roles: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.69c.125.13.248.26.37.39a6.375 6.375 0 01-3.835 6.814z" /></svg>,
    customization: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a.375.375 0 000-.53l-2.472-2.472M11.42 15.17L9 17.594a2.652 2.652 0 01-3.75 0L3 15.228a2.652 2.652 0 010-3.75L9 3.828a2.652 2.652 0 013.75 0L15.17 6.25" /></svg>,
    priceList: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
    tax: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M100,0 L0,100" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 100-12 6 6 0 000 12z" /></svg>,
    costCenter: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 18.75l7.5-7.5 7.5 7.5" /></svg>,
    counters: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h-1.5a3 3 0 01-3-3V8.25a3 3 0 013-3h1.5m-5.25 0h5.25m5.25 0h1.5a3 3 0 013 3v8.25a3 3 0 01-3 3h-1.5" /></svg>,
    integrations: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
    dataManagement: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>,
    expenses: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    asset: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>,
    trialBalance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-3-3h6M3 12h18" /></svg>,
    balanceSheet: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>,
    incomeStatement: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 19.875v-6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.625c0-.621.504-1.125 1.125-1.125h15.75c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 10.875V8.625zM12 3v4.5" /></svg>,
    cashFlow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375" /></svg>,
    arAging: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.227-.1.462-.1.714v16.5c0 .252.035.487.1.714M8.25 12h7.5" /></svg>,
    profitAndLoss: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v.513a5.034 5.034 0 002.252 4.192l.233.16a2.25 2.25 0 002.735 0l.233-.16a5.034 5.034 0 002.252-4.192v-.513zM9.75 9.75c0-1.232.046-2.453.138-3.662a4.006 4.006 0 013.7-3.7 48.678 48.678 0 017.324 0 4.006 4.006 0 013.7 3.7c.092 1.21.138 2.43.138 3.662v.513a5.034 5.034 0 01-2.252 4.192l-.233.16a2.25 2.25 0 01-2.735 0l-.233-.16a5.034 5.034 0 01-2.252-4.192v-.513z" /></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    adjustment: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0h9.75" /></svg>,
    receive: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>,
    gantt: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>,
    filter: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
    phoneCall: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
    meeting: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    system: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.437c.094.562.59.994 1.17.994h.257c.58 0 1.057.468 1.11.994l.073.437c.09.542.56 1.007 1.11 1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.437c.094.562.59.994 1.17.994h.257c.58 0 1.057.468 1.11.994l.073.437c.09.542.56 1.007 1.11 1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.437c.094.562.59.994 1.17.994h.257c.58 0 1.057.468 1.11.994l.073.437c.09.542.56 1.007 1.11 1.007h-1.093c-.55 0-1.02-.465-1.11-1.007l-.073-.437c-.094-.562-.59-.994-1.17-.994h-.257c-.58 0-1.057-.468-1.11-.994l-.073-.437c-.09-.542-.56-1.007-1.11-1.007h-1.093c-.55 0-1.02-.465-1.11-1.007l-.073-.437c-.094-.562-.59-.994-1.17-.994h-.257c-.58 0-1.057-.468-1.11-.994l-.073-.437c-.09-.542-.56-1.007-1.11-1.007H8.344c-.55 0-1.02-.465-1.11-1.007l-.073-.437c-.094-.562-.59-.994-1.17-.994H5.73c-.58 0-1.057-.468-1.11-.994l-.073-.437c-.09-.542-.56-1.007-1.11-1.007H2.25c-.55 0-1.02.465-1.11 1.007l-.073.437c-.094-.562-.59-.994-1.17-.994h-.257c-.58 0-1.057-.468-1.11-.994l-.073-.437c-.09-.542-.56-1.007-1.11-1.007H-1.093c-.55 0-1.02.465-1.11 1.007l-.073.437c-.094-.562-.59-.994-1.17-.994h-.257c-.58 0-1.057-.468-1.11-.994l-.073-.437c-.09-.542-.56-1.007-1.11-1.007z" /></svg>,
    note: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>,
    budget: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v5.136c0 .865-.473 1.65-1.22 2.053l-8.25 4.512c-.747.402-1.68.402-2.427 0l-8.25-4.512A2.25 2.25 0 011.5 14.886V9.75M21.75 9.75L12 4.864 2.25 9.75M21.75 9.75v0a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25v0" /></svg>,
    warehouse: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 18V4.5a1.5 1.5 0 011.5-1.5z" /></svg>,
    shipment: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875m-17.25 4.5h16.5a1.125 1.125 0 001.125-1.125V6.75A1.125 1.125 0 0019.875 5.625h-1.584a1.125 1.125 0 01-1.125-1.125z" /></svg>,
    pickList: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    fileXml: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
    view: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export const REPORT_CARDS: ReportCardInfo[] = [
    { title: 'Satış Performansı', description: 'Kazanılan anlaşmaları, geliri ve aylık performansı analiz edin.', link: '/reports/sales', icon: ICONS.sales },
    { title: 'Fatura Durumu', description: 'Faturalarınızın durumunu (ödenmiş, gecikmiş, taslak) takip edin.', link: '/reports/invoices', icon: ICONS.invoices },
    { title: 'Gider Analizi', description: 'Giderlerinizi kategorilere göre inceleyerek maliyet kontrolü yapın.', link: '/reports/expenses', icon: ICONS.expenses },
];

export const HR_REPORT_CARDS: ReportCardInfo[] = [
    {
        title: 'Personel Devir Oranı (Turnover)',
        description: 'Belirli bir dönemdeki personel giriş ve çıkışlarını analiz ederek devir oranını hesaplayın.',
        link: '/hr/reports/turnover',
        icon: ICONS.analytics,
    },
    {
        title: 'Demografi Raporu',
        description: 'Çalışanların yaş, cinsiyet ve departmanlara göre dağılımını analiz edin.',
        link: '/hr/reports/demographics',
        icon: ICONS.team,
    },
    {
        title: 'İzin İstatistikleri',
        description: 'Onaylanmış izinlerin türlerine, aylara ve çalışanlara göre dağılımını analiz edin.',
        link: '/hr/reports/leave-statistics',
        icon: ICONS.leave,
    },
    {
        title: 'Performans Değerlendirme Özeti',
        description: 'Yapılan performans değerlendirmelerinin genel puan ortalamalarını ve dağılımlarını görüntüleyin.',
        link: '/hr/reports/performance-summary',
        icon: ICONS.reports,
    },
];

export const WIN_REASONS = ['Fiyat', 'Ürün Kalitesi', 'Müşteri Hizmetleri', 'Teslimat Hızı', 'Diğer'];
export const LOSS_REASONS = ['Fiyat', 'Rakip Daha İyi', 'İhtiyaç Kalmadı', 'Zamanlama', 'Diğer'];

export const DEAL_STAGE_PROBABILITIES: { [key in DealStage]: number } = {
    [DealStage.Lead]: 0.1,
    [DealStage.Contacted]: 0.3,
    [DealStage.Proposal]: 0.6,
    [DealStage.Won]: 1,
    [DealStage.Lost]: 0,
};

export const TEVKIFAT_KODLARI = [
  { code: '601', description: 'Yapım İşleri ile Bu İşlerle Birlikte İfa Edilen Mühendislik-Mimarlık ve Etüt-Proje Hizmetleri (3/10)', rate: 0.3 },
  { code: '602', description: 'Etüt, Plan-Proje, Danışmanlık, Denetim ve Benzeri Hizmetler (9/10)', rate: 0.9 },
  // ... add all other codes
];

export const KDV_MUAFİYET_KODLARI = [
  { code: '301', description: 'İhracat İstisnası' },
  { code: '351', description: 'Diplomatik İstisna' },
  // ... add all other codes
];

export const PAYMENT_METHODS = ["Nakit", "Kredi Kartı", "Banka Havalesi/EFT", "Çek"];

export const SGK_MISSING_DAY_REASONS = [
    { code: '1', description: 'İstirahat' },
    { code: '3', description: 'Disiplin cezası' },
    { code: '12', description: 'Birden fazla' },
    // ... add more
];

export const SGK_TERMINATION_CODES = [
    { code: '3', description: 'İstifa' },
    { code: '4', description: 'İşveren tarafından haklı sebep bildirmeden fesih' },
    // ... add more
];

export const SGK_PROFESSION_CODES_SAMPLE = [
    { code: '2511.01', description: 'Yazılım Geliştiricisi' },
    { code: '2144.01', description: 'Makine Mühendisi' },
    { code: '3322.01', description: 'Muhasebe Meslek Elemanı' },
    // ... add more
];

export const SGK_INCENTIVE_CODES = [
    { code: '5510', description: '5 Puanlık Hazine Teşviği' },
    { code: '6111', description: 'İlave 6 Puanlık Teşvik' },
    // ... add more
];

export const CINSIYET_OPTIONS: Cinsiyet[] = ['Erkek', 'Kadın'];
export const CALISMA_STATUSU_OPTIONS: CalismaStatusu[] = ['Tam Zamanlı', 'Yarı Zamanlı', 'Geçici', 'Stajyer'];
export const SIGORTA_KOLU_OPTIONS: SigortaKolu[] = ['4A', '4B', '4C'];
export const MEDENI_DURUM_OPTIONS: MedeniDurum[] = ['Bekar', 'Evli'];
export const EGITIM_SEVIYELERI: EgitimSeviyesi[] = ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
export const INVOICE_TYPE_OPTIONS: InvoiceType[] = ['Satış', 'İade', 'Tevkifat', 'İstisna', 'Özel Matrah'];

export const PERMISSION_DESCRIPTIONS: { [key in Permission]: { description: string } } = {
    'dashboard:goruntule': { description: 'Kontrol panelini görüntüleyebilir.' },
    'dashboard:duzenle': { description: 'Kontrol panelini düzenleyebilir.' },
    'musteri:goruntule': { description: 'Müşterileri görüntüleyebilir.' },
    'musteri:yonet': { description: 'Müşteri ekleyebilir, düzenleyebilir, silebilir.' },
    'anlasma:goruntule': { description: 'Anlaşmaları görüntüleyebilir.' },
    'anlasma:yonet': { description: 'Anlaşma ekleyebilir, düzenleyebilir, silebilir.' },
    'proje:goruntule': { description: 'Projeleri görüntüleyebilir.' },
    'proje:yonet': { description: 'Proje ekleyebilir, düzenleyebilir, silebilir.' },
    'gorev:goruntule': { description: 'Görevleri görüntüleyebilir.' },
    'gorev:yonet': { description: 'Görev ekleyebilir, düzenleyebilir, silebilir.' },
    'fatura:goruntule': { description: 'Faturaları görüntüleyebilir.' },
    'fatura:yonet': { description: 'Fatura ekleyebilir, düzenleyebilir, silebilir.' },
    'takvim:goruntule': { description: 'Takvimi görüntüleyebilir.' },
    'rapor:goruntule': { description: 'Raporları görüntüleyebilir.' },
    'envanter:goruntule': { description: 'Envanteri görüntüleyebilir.' },
    'envanter:yonet': { description: 'Envanter yönetebilir (ürün, reçete vb.).' },
    'depo:yonet': { description: 'Depoları yönetebilir.' },
    'stok-hareketi:goruntule': { description: 'Stok hareketlerini görüntüleyebilir.' },
    'stok-sayimi:yap': { description: 'Stok sayımı yapabilir.' },
    'satis-siparis:goruntule': { description: 'Satış siparişlerini görüntüleyebilir.' },
    'satis-siparis:yonet': { description: 'Satış siparişlerini yönetebilir.' },
    'sevkiyat:goruntule': { description: 'Sevkiyatları görüntüleyebilir.' },
    'sevkiyat:yonet': { description: 'Sevkiyatları yönetebilir.' },
    'toplama-listesi:goruntule': { description: 'Toplama listelerini görüntüleyebilir.' },
    'toplama-listesi:yonet': { description: 'Toplama listelerini yönetebilir.' },
    'ik:goruntule': { description: 'İK modülünü görüntüleyebilir.' },
    'ik:maas-goruntule': { description: 'Maaş bilgilerini görüntüleyebilir.' },
    'ik:izin-yonet': { description: 'İzin taleplerini yönetebilir.' },
    'ik:performans-yonet': { description: 'Performans değerlendirmelerini yönetebilir.' },
    'ik:ise-alim-goruntule': { description: 'İşe alım sürecini görüntüleyebilir.' },
    'ik:ise-alim-yonet': { description: 'İşe alım sürecini yönetebilir.' },
    'ik:oryantasyon-goruntule': { description: 'Oryantasyon süreçlerini görüntüleyebilir.' },
    'ik:oryantasyon-yonet': { description: 'Oryantasyon süreçlerini yönetebilir.' },
    'ik:bordro-yonet': { description: 'Bordro süreçlerini yönetebilir.' },
    'ik:rapor-goruntule': { description: 'İK raporlarını görüntüleyebilir.' },
    'ik:masraf-yonet': { description: 'Masraf taleplerini yönetebilir.' },
    'ik:varlik-yonet': { description: 'Zimmetli varlıkları yönetebilir.' },
    'finans:goruntule': { description: 'Finans modülünü görüntüleyebilir.' },
    'finans:yonet': { description: 'Finansal işlemleri yönetebilir.' },
    'destek:goruntule': { description: 'Destek taleplerini görüntüleyebilir.' },
    'destek:yonet': { description: 'Destek taleplerini yönetebilir.' },
    'aktivite:goruntule': { description: 'Aktivite kayıtlarını görüntüleyebilir.' },
    'dokuman:goruntule': { description: 'Dokümanları görüntüleyebilir.' },
    'dokuman:yonet': { description: 'Dokümanları yönetebilir.' },
    'yorum:yonet': { description: 'Yorum ekleyebilir/silebilir.' },
    'kullanici:yonet': { description: 'Kullanıcıları yönetebilir.' },
    'ayarlar:goruntule': { description: 'Ayarları görüntüleyebilir.' },
    'ayarlar:genel-yonet': { description: 'Genel ayarları yönetebilir.' },
    'ayarlar:roller-yonet': { description: 'Rolleri ve izinleri yönetebilir.' },
    'ayarlar:guvenlik-yonet': { description: 'Güvenlik ayarlarını yönetebilir.' },
    'ayarlar:muhasebe-yonet': { description: 'Muhasebe ayarlarını yönetebilir.' },
    'ayarlar:maliyet-merkezi-yonet': { description: 'Maliyet merkezlerini yönetebilir.' },
    'ayarlar:vergi-yonet': { description: 'Vergi ayarlarını yönetebilir.' },
    'ayarlar:ik-bordro-yonet': { description: 'İK ve bordro ayarlarını yönetebilir.' },
    'muhasebe:goruntule': { description: 'Muhasebe modülünü görüntüleyebilir.' },
    'muhasebe:yonet': { description: 'Muhasebe kayıtlarını yönetebilir.' },
    'muhasebe:mutabakat-yap': { description: 'Banka mutabakatı yapabilir.' },
    'muhasebe:defteri-kebir-goruntule': { description: 'Defter-i Kebir\'i görüntüleyebilir.' },
    'muhasebe:bilanco-goruntule': { description: 'Bilanço\'yu görüntüleyebilir.' },
    'muhasebe:gelir-tablosu-goruntule': { description: 'Gelir Tablosu\'nu görüntüleyebilir.' },
    'muhasebe:nakit-akis-goruntule': { description: 'Nakit Akış Tablosu\'nu görüntüleyebilir.' },
    'muhasebe:alacak-yaslandirma-goruntule': { description: 'Alacak Yaşlandırma Raporu\'nu görüntüleyebilir.' },
    'muhasebe:kar-zarar-goruntule': { description: 'Kar/Zarar Raporu\'nu görüntüleyebilir.' },
    'muhasebe:tekrarlanan-yonet': { description: 'Tekrarlanan yevmiye fişlerini yönetebilir.' },
    'muhasebe:butce-yonet': { description: 'Bütçeleri yönetebilir.' },
    'otomasyon:goruntule': { description: 'Otomasyonları görüntüleyebilir.' },
    'otomasyon:yonet': { description: 'Otomasyonları yönetebilir.' },
};

export const AVAILABLE_WIDGETS: WidgetConfig[] = [
    { id: 'stat-total-revenue', name: 'Toplam Gelir', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-unpaid-invoices', name: 'Ödenmemiş Faturalar', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-active-customers', name: 'Aktif Müşteriler', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-open-tickets', name: 'Açık Destek Talepleri', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'chart-financial-summary', name: 'Finansal Özet', type: 'Chart', defaultW: 4, defaultH: 2 },
    { id: 'chart-invoice-status', name: 'Fatura Durum Dağılımı', type: 'Chart', defaultW: 2, defaultH: 2 },
    { id: 'list-my-tasks', name: 'Yapılacaklar Listem', type: 'List', defaultW: 2, defaultH: 2 },
    { id: 'list-recent-activities', name: 'Son Aktiviteler', type: 'List', defaultW: 2, defaultH: 2 },
];

// Re-adding all mock data that was missing
export const MOCK_EMPLOYEES: Employee[] = [
    { id: 1, employeeId: 'EMP001', name: 'Ayşe Yılmaz', department: 'Satış', position: 'Satış Temsilcisi', email: 'ayse.yilmaz@profusion.com', phone: '555-1234', hireDate: '2022-01-15', salary: 25000, avatar: 'https://i.pravatar.cc/150?u=1', role: 'calisan', managerId: 2, contactId: 101 },
    { id: 2, employeeId: 'EMP002', name: 'Ahmet Kaya', department: 'Satış', position: 'Satış Müdürü', email: 'ahmet.kaya@profusion.com', phone: '555-5678', hireDate: '2020-03-10', salary: 40000, avatar: 'https://i.pravatar.cc/150?u=2', role: 'yonetici', contactId: 102 },
    { id: 3, employeeId: 'EMP003', name: 'Fatma Demir', department: 'Yazılım', position: 'Kıdemli Yazılım Geliştirici', email: 'fatma.demir@profusion.com', phone: '555-9012', hireDate: '2019-07-20', salary: 50000, avatar: 'https://i.pravatar.cc/150?u=3', role: 'calisan', managerId: 4, contactId: 103 },
    { id: 4, employeeId: 'EMP004', name: 'Mehmet Çelik', department: 'Yönetim', position: 'CEO', email: 'mehmet.celik@profusion.com', phone: '555-3456', hireDate: '2018-01-01', salary: 80000, avatar: 'https://i.pravatar.cc/150?u=4', role: 'admin', contactId: 104 },
];

const emptyAddress: Address = { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '' };

export const MOCK_CUSTOMERS: Omit<Customer, 'assignedToName'>[] = [
    { id: 1, name: 'Lojistik A.Ş.', company: 'Lojistik A.Ş.', email: 'info@lojistikas.com', phone: '212-111-2233', lastContact: '2024-07-15', status: 'aktif', avatar: `https://i.pravatar.cc/150?u=c1`, industry: 'Lojistik', tags: ['öncelikli', 'büyük müşteri'], assignedToId: 1, leadSource: 'referans', accountType: 'Tüzel Kişi', accountCode: 'C001', taxId: '1234567890', taxOffice: 'Maslak', billingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Sarıyer', streetAddress: 'Büyükdere Cad. No:1', postalCode: '34467', email: 'muhasebe@lojistikas.com', phone: '212-111-2233' }, shippingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Sarıyer', streetAddress: 'Büyükdere Cad. No:1', postalCode: '34467', email: '', phone: '' }, iban: 'TR110006200000100000000001', openingBalance: 0, currency: 'TRY', openingDate: '2023-01-01', eInvoiceMailbox: 'urn:mail:defaultpk@lojistikas.com' },
    { id: 2, name: 'Tekno Market', company: 'Tekno Market', email: 'iletisim@teknomarket.com', phone: '312-444-5566', lastContact: '2024-07-10', status: 'potansiyel', avatar: `https://i.pravatar.cc/150?u=c2`, industry: 'Perakende', tags: ['yeni'], assignedToId: 1, leadSource: 'website', accountType: 'Tüzel Kişi', accountCode: 'C002', taxId: '0987654321', taxOffice: 'Çankaya', billingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Bulvarı No:50', postalCode: '06420', email: 'info@teknomarket.com', phone: '312-444-5566' }, shippingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Bulvarı No:50', postalCode: '06420', email: '', phone: '' }, iban: 'TR220006200000200000000002', openingBalance: 0, currency: 'TRY', openingDate: '2023-02-15' },
    { id: 3, name: 'Üretim Sanayi Ltd.', company: 'Üretim Sanayi Ltd.', email: 'uretim@sanayi.com.tr', phone: '262-555-0011', lastContact: '2024-06-20', status: 'aktif', avatar: 'https://i.pravatar.cc/150?u=c3', industry: 'Üretim', tags: [], assignedToId: 2, leadSource: 'fuar', accountType: 'Tüzel Kişi', accountCode: 'C003', taxId: '1122334455', taxOffice: 'Gebze', billingAddress: emptyAddress, shippingAddress: emptyAddress, iban: 'TR330006200000300000000003', openingBalance: 0, currency: 'EUR', openingDate: '2022-11-20'},
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 1, customerId: 1, name: 'Ali Veli', title: 'Lojistik Müdürü', email: 'ali.veli@lojistikas.com', phone: '555-111-2233'},
    { id: 2, customerId: 2, name: 'Zeynep Satış', title: 'Satın Alma Uzmanı', email: 'zeynep.satis@teknomarket.com', phone: '555-444-5566'},
    { id: 101, customerId: 1, name: 'Ayşe Yılmaz', title: 'Satış Temsilcisi', email: 'ayse.yilmaz@profusion.com', phone: '555-1234'},
    { id: 102, customerId: 2, name: 'Ahmet Kaya', title: 'Satış Müdürü', email: 'ahmet.kaya@profusion.com', phone: '555-5678'},
    { id: 103, customerId: 3, name: 'Fatma Demir', title: 'Yazılım Geliştirici', email: 'fatma.demir@profusion.com', phone: '555-9012'},
    { id: 104, customerId: 1, name: 'Mehmet Çelik', title: 'CEO', email: 'mehmet.celik@profusion.com', phone: '555-3456'},
];

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Ofis Malzemeleri A.Ş.', email: 'info@ofismalzemeleri.com', phone: '212-333-4455', avatar: 'https://i.pravatar.cc/150?u=s1', tags: ['kırtasiye', 'güvenilir'], accountType: 'Tüzel Kişi', accountCode: 'S001', taxId: '5544332211', taxOffice: 'Kağıthane', address: emptyAddress, iban: 'TR440006200000400000000004', openingBalance: 0, currency: 'TRY', openingDate: '2023-01-01' },
];

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, productType: ProductType.TicariMal, eInvoiceType: EInvoiceType.Urun, name: 'Profesyonel CRM Lisansı', sku: 'CRM-PRO-YILLIK', unit: Unit.Adet, category: 'Yazılım', lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 1500, saleCurrency: 'TRY', vatRate: 20 }, price: 1500 },
    { id: 2, productType: ProductType.Hizmet, eInvoiceType: EInvoiceType.Hizmet, name: 'Danışmanlık Saati', sku: 'DAN-SAAT', unit: Unit.Saat, category: 'Hizmet', lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 250, saleCurrency: 'TRY', vatRate: 20 }, price: 250 },
    { id: 3, productType: ProductType.TicariMal, eInvoiceType: EInvoiceType.Urun, name: 'Ofis Sandalyesi', sku: 'OF-SND-01', unit: Unit.Adet, category: 'Mobilya', lowStockThreshold: 5, trackBy: 'none', financials: { purchasePrice: 300, purchaseCurrency: 'TRY', salePrice: 500, saleCurrency: 'TRY', vatRate: 20 }, price: 500 },
];

export const MOCK_DEALS: Deal[] = [
    { id: 1, title: 'Lojistik A.Ş. Yıllık CRM Yenileme', customerId: 1, customerName: 'Lojistik A.Ş.', value: 15000, stage: DealStage.Proposal, closeDate: '2024-08-15', assignedToId: 1, assignedToName: 'Ayşe Yılmaz', lineItems: [{productId: 1, productName: 'Profesyonel CRM Lisansı', quantity: 10, price: 1500}], lastActivityDate: '2024-07-20', createdDate: '2024-07-01' },
    { id: 2, title: 'Tekno Market Danışmanlık', customerId: 2, customerName: 'Tekno Market', value: 5000, stage: DealStage.Won, closeDate: '2024-07-10', assignedToId: 2, assignedToName: 'Ahmet Kaya', lineItems: [{productId: 2, productName: 'Danışmanlık Saati', quantity: 20, price: 250}], winReason: 'Fiyat', lastActivityDate: '2024-07-10', createdDate: '2024-06-15' },
];

export const MOCK_PROJECTS: Project[] = [
    { id: 1, name: 'CRM Entegrasyonu', customerId: 1, client: 'Lojistik A.Ş.', deadline: '2024-09-30', status: 'zamanında', progress: 40, description: 'Mevcut ERP sistemi ile CRM entegrasyonu.', startDate: '2024-07-01', teamMemberIds: [3], budget: 20000, spent: 8000, tags: ['entegrasyon', 'crm'] },
    { id: 2, name: 'E-ticaret Optimizasyonu', customerId: 2, client: 'Tekno Market', deadline: '2024-08-20', status: 'riskli', progress: 75, description: 'Web sitesi performans iyileştirmeleri.', startDate: '2024-06-15', teamMemberIds: [1, 3], budget: 12000, spent: 10000, tags: ['web', 'optimizasyon'] },
];

export const MOCK_TASKS: Task[] = [
    { id: 1, title: 'Müşteri ile toplantı ayarla', description: '', status: TaskStatus.Completed, priority: TaskPriority.High, dueDate: '2024-07-25', assignedToId: 1, assignedToName: 'Ayşe Yılmaz', relatedEntityType: 'deal', relatedEntityId: 1, relatedEntityName: 'Lojistik A.Ş. Yıllık CRM Yenileme' },
    { id: 2, title: 'API dokümantasyonunu incele', description: '', status: TaskStatus.InProgress, priority: TaskPriority.Normal, dueDate: '2024-08-05', assignedToId: 3, assignedToName: 'Fatma Demir', relatedEntityType: 'project', relatedEntityId: 1, relatedEntityName: 'CRM Entegrasyonu' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 1, invoiceNumber: 'FAT-2024-001', customerId: 1, customerName: 'Lojistik A.Ş.', issueDate: '2024-07-01', dueDate: '2024-07-31', status: InvoiceStatus.Sent, items: [], subTotal: 1000, totalDiscount: 0, totalTax: 200, grandTotal: 1200, totalWithholding: 0, amountInWords: '', customizationId: 'TR1.2', scenario: EInvoiceScenario.EFatura, invoiceType: 'Satış', issueTime: '10:30' , documentCurrency: 'TRY' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 1, employeeId: 1, employeeName: 'Ayşe Yılmaz', submissionDate: '2024-07-20', description: 'Müşteri yemeği', category: 'Yemek', amount: 350, status: ExpenseStatus.Pending, attachments: [], projectId: 2},
];

export const MOCK_BILLS: Bill[] = [
    { id: 1, supplierId: 1, supplierName: 'Ofis Malzemeleri A.Ş.', billNumber: 'OM-1001', issueDate: '2024-07-18', dueDate: '2024-08-18', totalAmount: 850, status: BillStatus.Approved },
];

export const MOCK_COMMENTS: Comment[] = [
    { id: 1, text: 'Müşteri teklifi onayladı, sözleşme bekleniyor.', timestamp: '2024-07-22T14:30:00Z', userId: 1, userName: 'Ayşe Yılmaz', userAvatar: MOCK_EMPLOYEES[0].avatar, relatedEntityType: 'deal', relatedEntityId: 1},
    { id: 2, text: 'Geliştirme ortamı hazırlandı.', timestamp: '2024-07-23T10:00:00Z', userId: 3, userName: 'Fatma Demir', userAvatar: MOCK_EMPLOYEES[2].avatar, relatedEntityType: 'project', relatedEntityId: 1},
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
    { id: 1, timestamp: '2024-07-23T10:00:00Z', userId: 3, userName: 'Fatma Demir', userAvatar: MOCK_EMPLOYEES[2].avatar, actionType: ActionType.STATUS_CHANGED, details: "Görev durumu 'Devam Ediyor' olarak değiştirildi.", entityType: 'task', entityId: 2},
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [];
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_TICKETS: SupportTicket[] = [];
export const MOCK_DOCUMENTS: Document[] = [];
export const MOCK_SALES_ACTIVITIES: SalesActivity[] = [];
export const MOCK_CUSTOM_FIELD_DEFINITIONS: CustomFieldDefinition[] = [];
export const INITIAL_DASHBOARD_LAYOUT: DashboardWidget[] = [];
export const MOCK_COMPANY_INFO: CompanyInfo = { name: 'ProFusion Inc.', address: 'Teknoloji Cad. No:1, İstanbul', phone: '0212 123 4567', email: 'info@profusion.com', website: 'www.profusion.com'};
export const MOCK_BRANDING_SETTINGS: BrandingSettings = { logoUrl: '', primaryColor: '#4f46e5', fontSize: 'md' };
export const MOCK_SECURITY_SETTINGS: SecuritySettings = { passwordMinLength: 8, passwordRequireNumber: true, passwordRequireUppercase: true, sessionTimeout: 30 };
export const INITIAL_ROLES: Role[] = [{id: 'admin', name: 'Admin', isSystemRole: true}, {id: 'yonetici', name: 'Yönetici', isSystemRole: false}, {id: 'calisan', name: 'Çalışan', isSystemRole: false}];
export const INITIAL_ROLES_PERMISSIONS: Record<string, Permission[]> = {
    'admin': Object.keys(PERMISSION_DESCRIPTIONS) as Permission[],
    'yonetici': ['dashboard:goruntule', 'musteri:goruntule', 'musteri:yonet', 'anlasma:goruntule', 'anlasma:yonet'],
    'calisan': ['dashboard:goruntule', 'musteri:goruntule', 'anlasma:goruntule'],
};
export const MOCK_TAX_RATES: TaxRate[] = [];
export const INITIAL_SYSTEM_LISTS: SystemLists = {
    customerStatus: [{id: 'aktif', label: 'Aktif', color: '#22c55e'}, {id: 'potansiyel', label: 'Potansiyel', color: '#3b82f6'}, {id: 'kaybedilmis', label: 'Kaybedilmiş', color: '#64748b'}],
    dealStage: [], taskStatus: [], taskPriority: [], leadSource: []
};
export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [];
export const MOCK_PRICE_LISTS: PriceList[] = [];
export const MOCK_PRICE_LIST_ITEMS: PriceListItem[] = [];
export const MOCK_AUTOMATIONS: Automation[] = [];
export const MOCK_AUTOMATION_LOGS: AutomationLog[] = [];
export const MOCK_TASK_TEMPLATES: TaskTemplate[] = [];
export const MOCK_SCHEDULED_TASKS: ScheduledTask[] = [];
export const MOCK_COUNTERS_SETTINGS: CountersSettings = { prefix: 'FAT', nextNumber: 1, padding: 5 };
export const MOCK_WAREHOUSES: Warehouse[] = [];
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
export const DEFAULT_TURKISH_PAYROLL_PARAMS_2025: HrParameters = {
    MINIMUM_WAGE_GROSS: 25000.00, SGK_CEILING: 187500.00,
    EMPLOYEE_SGK_RATE: 0.14, EMPLOYEE_UNEMPLOYMENT_RATE: 0.01,
    EMPLOYER_SGK_RATE: 0.205, EMPLOYER_UNEMPLOYMENT_RATE: 0.02,
    EMPLOYER_SGK_INCENTIVE_RATE: 0.05, STAMP_DUTY_RATE: 0.00759,
    INCOME_TAX_EXEMPTION_BASE: 25000.00,
    INCOME_TAX_BRACKETS: [
        { limit: 110000, rate: 0.15 }, { limit: 230000, rate: 0.20 },
        { limit: 870000, rate: 0.27 }, { limit: 3000000, rate: 0.35 },
        { limit: Infinity, rate: 0.40 }
    ],
    SEVERANCE_CEILING: 35050.00,
    DEFAULT_HOURLY_RATE: 150,
};
export const MOCK_SALES_RETURNS: SalesReturn[] = [];
export const MOCK_QUOTATIONS: Quotation[] = [];
export const MOCK_LEADS: Lead[] = [];
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [];
export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const MOCK_JOB_OPENINGS: JobOpening[] = [];
export const MOCK_CANDIDATES: Candidate[] = [];
export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [];
export const MOCK_ONBOARDING_WORKFLOWS: OnboardingWorkflow[] = [];
export const MOCK_PAYROLL_RUNS: PayrollRun[] = [];
export const MOCK_PAYSLIPS: Payslip[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [];
export const MOCK_SAVED_VIEWS: SavedView[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
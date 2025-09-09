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
    CommissionRecord
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
    print: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.366c0-1.623 1.29-2.924 2.923-2.924h.023a2.923 2.923 0 012.924 2.924L12 13.829m0 0V21m0-7.171c2.115-1.166 3.633-3.642 3.633-6.467 0-1.623-1.29-2.924-2.923-2.924h-.023a2.923 2.923 0 00-2.924 2.924l.001 7.171z" /></svg>,
    fileCsv: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m9.75 9.75h-4.5m0-4.5h4.5m-4.5 2.25h4.5m-4.5 2.25V15m-3.75-3.75V15m-3.75-3.75L4.5 15m3.75-3.75V15m-3.75 0h3.75M3 12h18M3 15h18" /></svg>,
    fileXml: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
    view: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    filter: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
    gantt: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>,
    magic: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.25 21.75l-.648-1.177a3.375 3.375 0 00-3.71-3.71l-1.177-.648L12.75 15l1.177.648a3.375 3.375 0 003.71 3.71z" /></svg>,
    tasks: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5-13.5h16.5" /></svg>,
    documents: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.125c0-.621.504-1.125 1.125-1.125H9.375m3-3h.008v.008h-.008v-.008z" /></svg>,
    employees: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 18.72v7.217a2.47 2.47 0 01-2.468 2.468A18.75 18.75 0 012.25 12c0-7.784 4.887-14.35 11.625-16.425a1.875 1.875 0 012.063 1.875v7.217z" /></svg>,
    leave: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    payroll: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v15c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125v-15c0-.621.504-1.125 1.125-1.125h3.75z" /></svg>,
    team: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 18.72v7.217a2.47 2.47 0 01-2.468 2.468A18.75 18.75 0 012.25 12c0-7.784 4.887-14.35 11.625-16.425a1.875 1.875 0 012.063 1.875v7.217z" /></svg>,
    accounting: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    ledger: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    reverse: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>,
    suppliers: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16l-2-2m2 2l2-2m-2 2v-2m2 2V6a2 2 0 00-2-2h-5.586a1 1 0 00-.707.293l-2.414 2.414A1 1 0 006 6.414V16m7-10h3.5a1.5 1.5 0 010 3H13z" /></svg>,
    purchaseOrder: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.252c-.654 0-1.187-.585-1.117-1.243l1.263-12A3.75 3.75 0 017.5 4.5h9c1.657 0 3.093 1.135 3.563 2.686z" /></svg>,
    salesOrder: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.095-.824l1.923-6.164a.5.5 0 00-.465-.675H5.48c-.413 0-.77.295-.85.702L3.8 12.812m1.96 1.438L5.95 7.5h14.1a.641.641 0 01.625.562l-2.016 6.554a.64.64 0 01-.625.438H7.5z" /></svg>,
    manufacturing: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.636 5.562a.606.606 0 01-.852 0l-1.815-1.815a.606.606 0 010-.852l5.562-4.636m4.636-4.636l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.636 5.562m4.636-4.636l2.496 3.03" /></svg>,
    commission: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v15c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125v-15c0-.621.504-1.125 1.125-1.125h3.75z" /></svg>,
    analytics: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg>,
    expenses: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    asset: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75c0 3.28-2.69 5.94-6 5.94S5.25 9.93 5.25 6.75m12 0c0-1.514-1.236-2.75-2.75-2.75S11.75 5.236 11.75 6.75m5.5 0c0 1.514-1.236 2.75-2.75 2.75S9 8.264 9 6.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    receive: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    transfer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    adjustment: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v4.992m11.667 0l-3.181 3.183a8.25 8.25 0 01-11.667 0l-3.181-3.183" /></svg>,
    warehouse: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" /></svg>,
    shipment: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM17 8h2.5a1.5 1.5 0 010 3H17m0 0a2.5 2.5 0 100 5h2.5" /></svg>,
    pickList: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v13.75c0 .621.504 1.125 1.125 1.125z" /></svg>,
    phoneCall: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
    meeting: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 18.72v7.217a2.47 2.47 0 01-2.468 2.468A18.75 18.75 0 012.25 12c0-7.784 4.887-14.35 11.625-16.425a1.875 1.875 0 012.063 1.875v7.217z" /></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    system: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 01-4.5-4.5v-4.5a4.5 4.5 0 014.5-4.5h7.5a4.5 4.5 0 014.5 4.5v1.844M18.338 16.338l-4.5-4.5m4.5 0l-4.5 4.5m4.5-4.5v4.5m0-4.5h-4.5" /></svg>,
    note: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    trialBalance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg>,
    balanceSheet: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" /></svg>,
    incomeStatement: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h4.5m3-3h6M3.75 6h12" /></svg>,
    cashFlow: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" /></svg>,
    arAging: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    profitAndLoss: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-3.832A8.959 8.959 0 0121 12" /></svg>,
    general: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A48.225 48.225 0 0112 4.5a48.225 48.225 0 0110.072 4.611l-2.072 1.036m-15.482 0A50.697 50.697 0 0112 13.489a50.697 50.697 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>,
    appearance: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    roles: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.69c.125.13.248.26.37.39a6.375 6.375 0 01-3.835 6.814z" /></svg>,
    customization: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827a1.125 1.125 0 01.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456a1.125 1.125 0 00-1.075.124.939.939 0 00-.22.127c-.331.183-.581.495-.644.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a.952.952 0 00-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456a1.125 1.125 0 001.075-.124.952.952 0 00.22-.127c.332-.183.582-.495.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    priceList: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L14.16 3.097A1.875 1.875 0 0012.164 3H9.568z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
    tax: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>,
    costCenter: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    counters: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5m-7.5 5.25h7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    integrations: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
    dataManagement: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>,
    budget: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v15c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125v-15c0-.621.504-1.125 1.125-1.125h3.75z" /></svg>,
};
export const MOCK_CUSTOMERS: Customer[] = [
    { id: 101, name: 'Tekno A.Ş.', company: 'Teknoloji Çözümleri A.Ş.', email: 'info@teknoas.com', phone: '0212 111 2233', lastContact: '2024-07-15', status: 'aktif', avatar: 'https://i.pravatar.cc/150?u=101', industry: 'Teknoloji', tags: ['e-fatura', 'büyük müşteri'], assignedToId: 2, leadSource: 'Website', accountType: 'Tüzel Kişi', accountCode: 'CUST-001', taxId: '8350012345', taxOffice: 'Maslak', billingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Sarıyer', streetAddress: 'Büyükdere Cad. No:1', postalCode: '34467', email: 'muhasebe@teknoas.com', phone: '0212 111 2233'}, shippingAddress: { country: 'Türkiye', city: 'İstanbul', district: 'Sarıyer', streetAddress: 'Büyükdere Cad. No:1', postalCode: '34467', email: 'lojistik@teknoas.com', phone: '0212 111 2234'}, iban: 'TR110006200000100000123456', openingBalance: 0, currency: 'TRY', openingDate: '2023-01-10', eInvoiceMailbox: 'urn:mail:pk_teknoas@hs01.kep.tr' },
    { id: 102, name: 'Lojistik Ltd.', company: 'Hızlı Lojistik Ltd. Şti.', email: 'destek@hizlilojistik.com', phone: '0312 444 5566', lastContact: '2024-06-20', status: 'aktif', avatar: 'https://i.pravatar.cc/150?u=102', industry: 'Lojistik', tags: ['sadık müşteri'], assignedToId: 4, leadSource: 'Referans', accountType: 'Tüzel Kişi', accountCode: 'CUST-002', taxId: '4640023456', taxOffice: 'Çankaya', billingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Blv. No:50', postalCode: '06420', email: 'muhasebe@hizlilojistik.com', phone: '0312 444 5566'}, shippingAddress: { country: 'Türkiye', city: 'Ankara', district: 'Çankaya', streetAddress: 'Atatürk Blv. No:50', postalCode: '06420', email: 'operasyon@hizlilojistik.com', phone: '0312 444 5567'}, iban: 'TR220001000002000002345678', openingBalance: 0, currency: 'TRY', openingDate: '2022-05-20', eInvoiceMailbox: 'urn:mail:pk_hizlilojistik@hs01.kep.tr' },
    { id: 103, name: 'Gıda Pazarlama', company: 'Anadolu Gıda Pazarlama A.Ş.', email: 'siparis@anadolugida.com', phone: '0232 777 8899', lastContact: '2024-05-10', status: 'pasif', avatar: 'https://i.pravatar.cc/150?u=103', industry: 'Gıda', tags: [], assignedToId: 2, leadSource: 'Soğuk Arama', accountType: 'Tüzel Kişi', accountCode: 'CUST-003', taxId: '0710034567', taxOffice: 'Konak', billingAddress: { country: 'Türkiye', city: 'İzmir', district: 'Konak', streetAddress: 'Mimar Kemalettin Cad. No:8', postalCode: '35210', email: 'muhasebe@anadolugida.com', phone: '0232 777 8899'}, shippingAddress: { country: 'Türkiye', city: 'İzmir', district: 'Konak', streetAddress: 'Mimar Kemalettin Cad. No:8', postalCode: '35210', email: 'depo@anadolugida.com', phone: '0232 777 8890'}, iban: 'TR330006400000300000345678', openingBalance: 0, currency: 'TRY', openingDate: '2023-11-01' },
];
export const MOCK_CONTACTS: Contact[] = [];
export const MOCK_DEALS: Deal[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_TASKS: Task[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_INVOICES: Invoice[] = [
    { id: 1, invoiceNumber: 'FAT-20240001', customerId: 101, customerName: 'Tekno A.Ş.', issueDate: '2024-07-20', dueDate: '2024-08-20', status: InvoiceStatus.Sent, items: [{ id: 1, productId: 201, productName: 'Danışmanlık Hizmeti', quantity: 20, unit: Unit.Saat, unitPrice: 500, discountRate: 0, taxRate: 20, discountAmount: 0, taxAmount: 2000, totalPrice: 10000, vatIncludedPrice: 12000 }], subTotal: 10000, totalDiscount: 0, totalTax: 2000, grandTotal: 12000, totalWithholding: 0, customizationId: 'TR1.2', scenario: EInvoiceScenario.EFatura, invoiceType: 'Satış', documentCurrency: 'TRY', amountInWords: numberToWords(12000, 'TRY'), issueTime: "10:30" },
    { id: 2, invoiceNumber: 'FAT-20240002', customerId: 102, customerName: 'Lojistik Ltd.', issueDate: '2024-06-15', dueDate: '2024-07-15', status: InvoiceStatus.Paid, items: [{ id: 2, productId: 202, productName: 'Yazılım Lisansı', quantity: 2, unit: Unit.Adet, unitPrice: 2500, discountRate: 10, taxRate: 20, discountAmount: 500, taxAmount: 900, totalPrice: 4500, vatIncludedPrice: 5400 }], subTotal: 5000, totalDiscount: 500, totalTax: 900, grandTotal: 5400, totalWithholding: 0, customizationId: 'TR1.2', scenario: EInvoiceScenario.EArsiv, invoiceType: 'Satış', documentCurrency: 'TRY', amountInWords: numberToWords(5400, 'TRY'), issueTime: "14:00" },
    { id: 3, invoiceNumber: 'FAT-20240003', customerId: 101, customerName: 'Tekno A.Ş.', issueDate: '2024-05-10', dueDate: '2024-06-10', status: InvoiceStatus.Overdue, items: [{ id: 3, productId: 203, productName: 'Bakım Anlaşması', quantity: 1, unit: Unit.Adet, unitPrice: 15000, discountRate: 0, taxRate: 20, discountAmount: 0, taxAmount: 3000, totalPrice: 15000, vatIncludedPrice: 18000 }], subTotal: 15000, totalDiscount: 0, totalTax: 3000, grandTotal: 18000, totalWithholding: 0, customizationId: 'TR1.2', scenario: EInvoiceScenario.EFatura, invoiceType: 'Satış', documentCurrency: 'TRY', amountInWords: numberToWords(18000, 'TRY'), issueTime: "11:45" },
    { id: 4, invoiceNumber: '', customerId: 103, customerName: 'Gıda Pazarlama', issueDate: '2024-07-25', dueDate: '2024-08-25', status: InvoiceStatus.Draft, items: [{ id: 4, productId: 201, productName: 'Danışmanlık Hizmeti', quantity: 5, unit: Unit.Saat, unitPrice: 500, discountRate: 0, taxRate: 20, discountAmount: 0, taxAmount: 500, totalPrice: 2500, vatIncludedPrice: 3000 }], subTotal: 2500, totalDiscount: 0, totalTax: 500, grandTotal: 3000, totalWithholding: 0, customizationId: 'TR1.2', scenario: EInvoiceScenario.EArsiv, invoiceType: 'Satış', documentCurrency: 'TRY', amountInWords: numberToWords(3000, 'TRY'), issueTime: "09:00" },
    { id: 5, invoiceNumber: 'FAT-20230150', customerId: 102, customerName: 'Lojistik Ltd.', issueDate: '2023-12-20', dueDate: '2024-01-20', status: InvoiceStatus.Archived, items: [], subTotal: 8000, totalDiscount: 0, totalTax: 1600, grandTotal: 9600, totalWithholding: 0, customizationId: 'TR1.2', scenario: EInvoiceScenario.EArsiv, invoiceType: 'Satış', documentCurrency: 'TRY', amountInWords: numberToWords(9600, 'TRY'), issueTime: "16:20" },
];
export const MOCK_PRODUCTS: Product[] = [
    { id: 201, productType: ProductType.Hizmet, eInvoiceType: EInvoiceType.Hizmet, name: 'Danışmanlık Hizmeti', sku: 'SRV-CONS-01', unit: Unit.Saat, category: 'Hizmetler', lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 500, saleCurrency: 'TRY', vatRate: 20 }, price: 500 },
    { id: 202, productType: ProductType.TicariMal, eInvoiceType: EInvoiceType.Urun, name: 'Yazılım Lisansı - Yıllık', sku: 'LIC-SOFT-Y', unit: Unit.Adet, category: 'Yazılım', lowStockThreshold: 100, trackBy: 'none', financials: { purchasePrice: 1000, purchaseCurrency: 'TRY', salePrice: 2500, saleCurrency: 'TRY', vatRate: 20 }, price: 2500 },
    { id: 203, productType: ProductType.Hizmet, eInvoiceType: EInvoiceType.Hizmet, name: 'Yıllık Bakım Anlaşması', sku: 'SRV-MAIN-Y', unit: Unit.Adet, category: 'Hizmetler', lowStockThreshold: 0, trackBy: 'none', financials: { purchasePrice: 0, purchaseCurrency: 'TRY', salePrice: 15000, saleCurrency: 'TRY', vatRate: 20 }, price: 15000 },
    { id: 204, productType: ProductType.TicariMal, eInvoiceType: EInvoiceType.Urun, name: 'Ofis Sandalyesi', sku: 'HW-CHR-01', unit: Unit.Adet, category: 'Donanım', lowStockThreshold: 5, trackBy: 'none', financials: { purchasePrice: 1200, purchaseCurrency: 'TRY', salePrice: 1800, saleCurrency: 'TRY', vatRate: 20 }, price: 1800 },
];
export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 301, name: 'Ofis Malzemeleri A.Ş.', email: 'satis@ofismalzemeleri.com', phone: '0216 123 4567', avatar: 'https://i.pravatar.cc/150?u=301', tags: ['güvenilir'], accountType: 'Tüzel Kişi', accountCode: 'SUP-001', taxId: '6350045678', taxOffice: 'Kadıköy', address: { country: 'Türkiye', city: 'İstanbul', district: 'Kadıköy', streetAddress: 'Söğütlüçeşme Cad.', postalCode: '34710', email: 'satis@ofismalzemeleri.com', phone: '0216 123 4567' }, iban: 'TR440006200000400000456789', openingBalance: 0, currency: 'TRY', openingDate: '2023-02-15' },
    { id: 302, name: 'Sunucu Hizmetleri Ltd.', email: 'info@sunucuhizmet.net', phone: '0850 987 6543', avatar: 'https://i.pravatar.cc/150?u=302', tags: [], accountType: 'Tüzel Kişi', accountCode: 'SUP-002', taxId: '8210056789', taxOffice: 'Şişli', address: { country: 'Türkiye', city: 'İstanbul', district: 'Şişli', streetAddress: 'Halaskargazi Cad.', postalCode: '34371', email: 'info@sunucuhizmet.net', phone: '0850 987 6543' }, iban: 'TR550001000005000005678901', openingBalance: 0, currency: 'USD', openingDate: '2022-08-01' },
];
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 1, employeeId: 'EMP001', name: 'Ayşe Yılmaz', department: 'Yönetim', position: 'Genel Müdür',
        email: 'ayse.yilmaz@profusion.com', phone: '555-111-2233', hireDate: '2020-01-15', salary: 150000,
        avatar: 'https://i.pravatar.cc/150?u=ayse', role: 'admin',
        tcKimlikNo: "11111111111", sgkSicilNo: "123456789", dogumTarihi: "1980-05-20", cinsiyet: "Kadın",
        medeniDurum: "Evli", bakmaklaYukumluKisiSayisi: 2, esiCalisiyorMu: false
    },
    {
        id: 2, employeeId: 'EMP002', name: 'Ahmet Çelik', department: 'Satış', position: 'Satış Müdürü',
        email: 'ahmet.celik@profusion.com', phone: '555-222-3344', hireDate: '2021-03-01', salary: 95000,
        avatar: 'https://i.pravatar.cc/150?u=ahmet', role: 'satis', managerId: 1
    },
    {
        id: 3, employeeId: 'EMP003', name: 'Fatma Kaya', department: 'Muhasebe', position: 'Muhasebe Uzmanı',
        email: 'fatma.kaya@profusion.com', phone: '555-333-4455', hireDate: '2022-06-20', salary: 75000,
        avatar: 'https://i.pravatar.cc/150?u=fatma', role: 'muhasebe', managerId: 1
    },
    {
        id: 4, employeeId: 'EMP004', name: 'Mehmet Öztürk', department: 'Satış', position: 'Satış Temsilcisi',
        email: 'mehmet.ozturk@profusion.com', phone: '555-444-5566', hireDate: '2023-02-10', salary: 65000,
        avatar: 'https://i.pravatar.cc/150?u=mehmet', role: 'satis', managerId: 2
    },
    {
        id: 5, employeeId: 'EMP005', name: 'Zeynep Aydın', department: 'İK', position: 'İK Uzmanı',
        email: 'zeynep.aydin@profusion.com', phone: '555-555-6677', hireDate: '2022-09-01', salary: 72000,
        avatar: 'https://i.pravatar.cc/150?u=zeynep', role: 'admin', managerId: 1
    },
    {
        id: 6, employeeId: 'EMP006', name: 'Ali Vural', department: 'Operasyon', position: 'Çalışan',
        email: 'ali.vural@profusion.com', phone: '555-666-7788', hireDate: '2023-08-15', salary: 55000,
        avatar: 'https://i.pravatar.cc/150?u=ali', role: 'calisan', managerId: 2
    }
];
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [];
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_TICKETS: SupportTicket[] = [];
export const MOCK_DOCUMENTS: Document[] = [];
export const MOCK_COMMENTS: Comment[] = [];
export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [];
export const MOCK_SAVED_VIEWS: SavedView[] = [];
export const MOCK_CUSTOM_FIELD_DEFINITIONS: CustomFieldDefinition[] = [];
export const MOCK_SALES_ACTIVITIES: SalesActivity[] = [];
export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [];
export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const MOCK_JOB_OPENINGS: JobOpening[] = [];
export const MOCK_CANDIDATES: Candidate[] = [];
export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [];
export const MOCK_ONBOARDING_WORKFLOWS: OnboardingWorkflow[] = [];
export const MOCK_PAYROLL_RUNS: PayrollRun[] = [];
export const MOCK_PAYSLIPS: Payslip[] = [];
export const MOCK_ACCOUNTS: Account[] = [];
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [];
export const MOCK_RECURRING_JOURNAL_ENTRIES: RecurringJournalEntry[] = [];
export const MOCK_BUDGETS: Budget[] = [];
export const MOCK_COST_CENTERS: CostCenter[] = [];
export const MOCK_BILLS: Bill[] = [
    { id: 401, supplierId: 302, supplierName: 'Sunucu Hizmetleri Ltd.', billNumber: 'SH-2024-58', issueDate: '2024-07-18', dueDate: '2024-08-01', totalAmount: 1200, status: BillStatus.PendingApproval },
    { id: 402, supplierId: 301, supplierName: 'Ofis Malzemeleri A.Ş.', billNumber: 'OM-9876', issueDate: '2024-07-15', dueDate: '2024-07-30', totalAmount: 850, status: BillStatus.Approved },
    { id: 403, supplierId: 301, supplierName: 'Ofis Malzemeleri A.Ş.', billNumber: 'OM-9801', issueDate: '2024-06-12', dueDate: '2024-06-27', totalAmount: 620, status: BillStatus.Paid },
    { id: 404, supplierId: 302, supplierName: 'Sunucu Hizmetleri Ltd.', billNumber: 'SH-2024-45', issueDate: '2024-06-18', dueDate: '2024-07-01', totalAmount: 1200, status: BillStatus.Paid },
    { id: 405, supplierId: 301, supplierName: 'Ofis Malzemeleri A.Ş.', billNumber: 'OM-9750', issueDate: '2024-05-20', dueDate: '2024-06-05', totalAmount: 450, status: BillStatus.Archived },
    { id: 406, supplierId: 301, supplierName: 'Ofis Malzemeleri A.Ş.', billNumber: 'OM-9912', issueDate: '2024-07-20', dueDate: '2024-08-20', totalAmount: 330, status: BillStatus.Rejected },
];
export const MOCK_TAX_RATES: TaxRate[] = [];
export const MOCK_PRICE_LISTS: PriceList[] = [];
export const MOCK_PRICE_LIST_ITEMS: PriceListItem[] = [];
export const MOCK_AUTOMATIONS: Automation[] = [];
export const MOCK_AUTOMATION_LOGS: AutomationLog[] = [];
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
export const MOCK_TASK_TEMPLATES: TaskTemplate[] = [];
export const MOCK_SCHEDULED_TASKS: ScheduledTask[] = [];
export const MOCK_EXPENSES: Expense[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const MOCK_SALES_RETURNS: SalesReturn[] = [
    { id: 501, returnNumber: 'IADE-2024001', customerId: 102, customerName: 'Lojistik Ltd.', issueDate: '2024-07-18', status: SalesReturnStatus.Approved, items: [{ id: 5, productId: 202, productName: 'Yazılım Lisansı', quantity: 1, unit: Unit.Adet, unitPrice: 2500, discountRate: 10, taxRate: 20, discountAmount: 250, taxAmount: 450, totalPrice: 2250, vatIncludedPrice: 2700 }], subTotal: 2500, totalTax: 450, grandTotal: 2700, originalInvoiceId: 2 },
];
export const MOCK_QUOTATIONS: Quotation[] = [];
export const MOCK_LEADS: Lead[] = [];
export const MOCK_COMMISSION_RECORDS: CommissionRecord[] = [];
export const INITIAL_DASHBOARD_LAYOUT: DashboardWidget[] = [
    { id: '1', widgetId: 'stat-total-revenue', w: 2, h: 1 },
    { id: '2', widgetId: 'stat-unpaid-invoices', w: 2, h: 1 },
    { id: '3', widgetId: 'stat-active-customers', w: 2, h: 1 },
    { id: '4', widgetId: 'chart-financial-summary', w: 4, h: 2 },
    { id: '5', widgetId: 'list-my-tasks', w: 2, h: 2 },
];
export const AVAILABLE_WIDGETS: WidgetConfig[] = [
    { id: 'stat-total-revenue', name: 'Toplam Gelir', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-unpaid-invoices', name: 'Ödenmemiş Faturalar', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-active-customers', name: 'Aktif Müşteriler', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-open-tickets', name: 'Açık Destek Talepleri', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-total-cash', name: 'Toplam Nakit', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'stat-net-cash-flow', name: 'Net Nakit Akışı (30 Gün)', type: 'StatCard', defaultW: 2, defaultH: 1 },
    { id: 'chart-financial-summary', name: 'Finansal Özet', type: 'Chart', defaultW: 4, defaultH: 2 },
    { id: 'chart-invoice-status', name: 'Fatura Durum Dağılımı', type: 'Chart', defaultW: 2, defaultH: 2 },
    { id: 'list-my-tasks', name: 'Görevlerim', type: 'List', defaultW: 2, defaultH: 2 },
    { id: 'list-recent-activities', name: 'Son Aktiviteler', type: 'List', defaultW: 2, defaultH: 2 },
    { id: 'list-today-view', name: 'Bugünün Özeti', type: 'List', defaultW: 2, defaultH: 2 },
];
export const WIN_REASONS: string[] = ['Fiyat Avantajı', 'Ürün Kalitesi', 'Hızlı Teslimat', 'İyi İlişki', 'Diğer'];
export const LOSS_REASONS: string[] = ['Fiyat Yüksek Kaldı', 'Rakip Tercih Edildi', 'İhtiyaç Kalmadı', 'Zamanlama Uymadı', 'Diğer'];
export const DEAL_STAGE_PROBABILITIES: { [key: string]: number } = { [DealStage.Lead]: 0.1, [DealStage.Contacted]: 0.3, [DealStage.Proposal]: 0.6, [DealStage.Won]: 1, [DealStage.Lost]: 0 };
export const PROJECT_HOURLY_RATE = 75; // in dollars
export const MOCK_COMPANY_INFO: CompanyInfo = { name: "ProFusion Inc.", address: "Teknopark, İstanbul, Türkiye", phone: "+90 212 123 4567", email: "info@profusion.com", website: "www.profusion.com" };
export const MOCK_BRANDING_SETTINGS: BrandingSettings = { logoUrl: "", primaryColor: "#4f46e5" };
export const MOCK_SECURITY_SETTINGS: SecuritySettings = { passwordMinLength: 8, passwordRequireNumber: true, passwordRequireUppercase: true, sessionTimeout: 30 };
export const INITIAL_ROLES: Role[] = [ { id: 'admin', name: 'Admin', isSystemRole: true }, { id: 'calisan', name: 'Çalışan', isSystemRole: true }, { id: 'satis', name: 'Satış Temsilcisi', isSystemRole: false }, { id: 'muhasebe', name: 'Muhasebe', isSystemRole: false }, ];
export const PERMISSION_DESCRIPTIONS: Record<Permission, { description: string }> = { 'dashboard:goruntule': { description: 'Kontrol panelini görüntüle' }, 'dashboard:duzenle': { description: 'Kontrol panelini düzenle' }, 'musteri:goruntule': { description: 'Müşterileri görüntüle' }, 'musteri:yonet': { description: 'Müşteri ekle/düzenle/sil' }, 'anlasma:goruntule': { description: 'Anlaşmaları görüntüle' }, 'anlasma:yonet': { description: 'Anlaşma ekle/düzenle/sil' }, 'proje:goruntule': { description: 'Projeleri görüntüle' }, 'proje:yonet': { description: 'Proje ekle/düzenle/sil' }, 'gorev:goruntule': { description: 'Görevleri görüntüle' }, 'gorev:yonet': { description: 'Görev ekle/düzenle/sil' }, 'fatura:goruntule': { description: 'Faturaları görüntüle' }, 'fatura:yonet': { description: 'Fatura ekle/düzenle/sil' }, 'takvim:goruntule': { description: 'Takvimi görüntüle' }, 'rapor:goruntule': { description: 'Raporları görüntüle' }, 'envanter:goruntule': { description: 'Envanteri görüntüle' }, 'envanter:yonet': { description: 'Envanter yönet (ürün, sipariş)' }, 'ik:goruntule': { description: 'İK modülünü görüntüle' }, 'ik:maas-goruntule': { description: 'Maaş bilgilerini görüntüle' }, 'ik:izin-yonet': { description: 'İzinleri yönet' }, 'ik:performans-yonet': { description: 'Performansları yönet' }, 'finans:goruntule': { description: 'Finans modülünü görüntüle' }, 'finans:yonet': { description: 'Finansal kayıtları yönet' }, 'destek:goruntule': { description: 'Destek taleplerini görüntüle' }, 'destek:yonet': { description: 'Destek taleplerini yönet' }, 'aktivite:goruntule': { description: 'Aktivite kayıtlarını görüntüle' }, 'dokuman:goruntule': { description: 'Dokümanları görüntüle' }, 'dokuman:yonet': { description: 'Dokümanları yönet' }, 'yorum:yonet': { description: 'Yorum ekle/düzenle/sil' }, 'kullanici:yonet': { description: 'Kullanıcıları yönet' }, 'ayarlar:goruntule': { description: 'Ayarları görüntüle' }, 'ayarlar:genel-yonet': { description: 'Genel ayarları yönet' }, 'ayarlar:roller-yonet': { description: 'Rolleri ve izinleri yönet' }, 'ayarlar:guvenlik-yonet': { description: 'Güvenlik ayarlarını yönet' },'depo:yonet': { description: 'Depoları yönet'},'stok-hareketi:goruntule': { description: 'Stok hareketlerini görüntüle' },'stok-sayimi:yap': { description: 'Stok sayımı yap' },'satis-siparis:goruntule': { description: 'Satış siparişlerini görüntüle' },'satis-siparis:yonet': { description: 'Satış siparişlerini yönet' },'sevkiyat:goruntule': { description: 'Sevkiyatları görüntüle' },'sevkiyat:yonet': { description: 'Sevkiyatları yönet' },'toplama-listesi:goruntule': { description: 'Toplama listelerini görüntüle' },'toplama-listesi:yonet': { description: 'Toplama listelerini yönet' }, 'ik:ise-alim-goruntule': { description: 'İşe alım modülünü görüntüle' }, 'ik:ise-alim-yonet': { description: 'İşe alım modülünü yönet' }, 'ik:oryantasyon-goruntule': { description: 'Oryantasyon modülünü görüntüle' }, 'ik:oryantasyon-yonet': { description: 'Oryantasyon modülünü yönet' }, 'ik:bordro-yonet': { description: 'Bordroları yönet' }, 'ik:rapor-goruntule': { description: 'İK raporlarını görüntüle' }, 'ik:masraf-yonet': { description: 'Masrafları yönet' }, 'ik:varlik-yonet': { description: 'Varlıkları yönet' }, 'ayarlar:muhasebe-yonet': { description: 'Muhasebe ayarlarını yönet' }, 'ayarlar:maliyet-merkezi-yonet': { description: 'Maliyet merkezlerini yönet' }, 'ayarlar:vergi-yonet': { description: 'Vergi ayarlarını yönet' }, 'ayarlar:ik-bordro-yonet': { description: 'İK & Bordro ayarlarını yönet' }, 'muhasebe:goruntule': { description: 'Muhasebe modülünü görüntüle' }, 'muhasebe:yonet': { description: 'Muhasebe kayıtlarını yönet' }, 'muhasebe:mutabakat-yap': { description: 'Banka mutabakatı yap' }, 'muhasebe:defteri-kebir-goruntule': { description: 'Defter-i kebiri görüntüle' },
'muhasebe:bilanco-goruntule': { description: 'Bilanço raporunu görüntüle' },
'muhasebe:gelir-tablosu-goruntule': { description: 'Gelir tablosu raporunu görüntüle' },
'muhasebe:nakit-akis-goruntule': { description: 'Nakit akış tablosunu görüntüle' },
'muhasebe:alacak-yaslandirma-goruntule': { description: 'Alacak yaşlandırma raporunu görüntüle' },
'muhasebe:kar-zarar-goruntule': { description: 'Kar/Zarar raporunu görüntüle' },
'muhasebe:tekrarlanan-yonet': { description: 'Tekrarlanan yevmiye fişlerini yönet' },
'muhasebe:butce-yonet': { description: 'Bütçeleri yönet' },
'otomasyon:goruntule': { description: 'Otomasyonları görüntüle' },
'otomasyon:yonet': { description: 'Otomasyonları yönet' }, };

export const INITIAL_ROLES_PERMISSIONS: Record<string, Permission[]> = {
    'admin': [], // Admin has all permissions by default, handled in hasPermission logic
    'calisan': ['dashboard:goruntule', 'takvim:goruntule', 'gorev:goruntule', 'dokuman:goruntule'],
    'satis': [
        'dashboard:goruntule', 'musteri:goruntule', 'musteri:yonet', 'anlasma:goruntule', 'anlasma:yonet',
        'proje:goruntule', 'gorev:goruntule', 'gorev:yonet', 'fatura:goruntule', 'fatura:yonet', 'takvim:goruntule', 'rapor:goruntule'
    ],
    'muhasebe': [
        'dashboard:goruntule', 'musteri:goruntule', 'fatura:goruntule', 'fatura:yonet', 'takvim:goruntule', 'rapor:goruntule',
        'muhasebe:goruntule', 'muhasebe:yonet', 'muhasebe:mutabakat-yap', 'muhasebe:defteri-kebir-goruntule',
        'muhasebe:bilanco-goruntule', 'muhasebe:gelir-tablosu-goruntule', 'muhasebe:nakit-akis-goruntule'
    ],
};

export const INITIAL_SYSTEM_LISTS: SystemLists = {
    customerStatus: [
        { id: 'potansiyel', label: 'Potansiyel', color: '#3b82f6' },
        { id: 'aktif', label: 'Aktif', color: '#22c55e' },
        { id: 'pasif', label: 'Pasif', color: '#f97316' },
        { id: 'kaybedilmiş', label: 'Kaybedilmiş', color: '#64748b' },
    ],
    dealStage: [], // Uses enum, not a list
    taskStatus: [], // Uses enum
    taskPriority: [], // Uses enum
    leadSource: [
        { id: 'Website', label: 'Website' },
        { id: 'Referans', label: 'Referans' },
        { id: 'Soğuk Arama', label: 'Soğuk Arama' },
    ]
};

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
    { id: 'invoice', name: 'Yeni Fatura Bildirimi', subject: 'Yeni Faturanız: {invoiceNumber}', body: 'Merhaba {customerName},\n\n{invoiceNumber} numaralı faturanız oluşturulmuştur. Görüntülemek için linke tıklayabilirsiniz.\n\nTeşekkürler,\n{companyName}', variables: ['invoiceNumber', 'customerName', 'companyName'] },
    { id: 'newUser', name: 'Yeni Kullanıcı Karşılama', subject: 'ProFusion\'a Hoşgeldiniz!', body: 'Merhaba {userName},\n\nHesabınız başarıyla oluşturuldu.\n\nİyi çalışmalar,\n{companyName}', variables: ['userName', 'companyName'] },
    { id: 'taskAssigned', name: 'Yeni Görev Ataması', subject: 'Size yeni bir görev atandı: {taskTitle}', body: 'Merhaba {userName},\n\n\'{taskTitle}\' başlıklı görev size atandı.\n\nDetaylar için sisteme giriş yapabilirsiniz.\n\nİyi çalışmalar,\n{companyName}', variables: ['userName', 'taskTitle', 'companyName'] },
];

export const MOCK_COUNTERS_SETTINGS: CountersSettings = { prefix: 'FAT-', nextNumber: 1001, padding: 8 };

export const DEFAULT_TURKISH_PAYROLL_PARAMS_2025: HrParameters = {
    MINIMUM_WAGE_GROSS: 25000.00,
    SGK_CEILING: 187500.00,
    EMPLOYEE_SGK_RATE: 0.14,
    EMPLOYEE_UNEMPLOYMENT_RATE: 0.01,
    EMPLOYER_SGK_RATE: 0.205,
    EMPLOYER_UNEMPLOYMENT_RATE: 0.02,
    EMPLOYER_SGK_INCENTIVE_RATE: 0.05,
    STAMP_DUTY_RATE: 0.00759,
    INCOME_TAX_EXEMPTION_BASE: 25000.00,
    INCOME_TAX_BRACKETS: [
        { limit: 110000, rate: 0.15 },
        { limit: 230000, rate: 0.20 },
        { limit: 870000, rate: 0.27 },
        { limit: 3000000, rate: 0.35 },
        { limit: Infinity, rate: 0.40 },
    ],
    SEVERANCE_CEILING: 35058.58,
};

export const SGK_TERMINATION_CODES = [
    { code: "3", description: "İstifa" },
    { code: "4", description: "İşverenin haklı nedenle feshi" },
    { code: "22", description: "Diğer nedenler" },
];

export const SGK_PROFESSION_CODES_SAMPLE = [
    { code: "2511.01", description: "Yazılım Geliştirici" },
    { code: "2421.05", description: "Muhasebe Meslek Elemanı" },
    { code: "3322.01", description: "Satış Temsilcisi" },
];
export const CINSIYET_OPTIONS: Cinsiyet[] = ['Erkek', 'Kadın'];
export const CALISMA_STATUSU_OPTIONS: CalismaStatusu[] = ['Tam Zamanlı', 'Yarı Zamanlı', 'Geçici', 'Stajyer'];
export const SIGORTA_KOLU_OPTIONS: SigortaKolu[] = ['4A', '4B', '4C'];
export const MEDENI_DURUM_OPTIONS: MedeniDurum[] = ['Bekar', 'Evli'];
export const EGITIM_SEVIYELERI: EgitimSeviyesi[] = ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
export const SGK_INCENTIVE_CODES = [
    { code: "5510", description: "%5 Hazine Desteği" },
    { code: "6111", description: "İlave İstihdam Teşviki" },
];
export const SGK_MISSING_DAY_REASONS = [
    { code: "1", description: "İstirahat" },
    { code: "7", description: "Puantaj Kayıtları" },
    { code: "12", description: "Birden Fazla" },
];

export const REPORT_CARDS: ReportCardInfo[] = [
    { title: 'Satış Performansı', description: 'Kazanılan anlaşmaları, toplam geliri ve aylık performansı analiz edin.', link: '/reports/sales', icon: ICONS.sales },
    { title: 'Fatura Durum Raporu', description: 'Ödenmiş, ödenmemiş ve vadesi geçmiş faturalarınızın durumunu takip edin.', link: '/reports/invoices', icon: ICONS.invoices },
    { title: 'Gider Analizi', description: 'Giderlerinizi kategori bazında analiz ederek maliyetlerinizi kontrol altında tutun.', link: '/reports/expenses', icon: ICONS.expenses },
];

export const HR_REPORT_CARDS: ReportCardInfo[] = [
    { title: 'Personel Devir Oranı (Turnover)', description: 'Belirli bir dönemdeki personel giriş çıkışlarını ve devir oranını analiz edin.', link: '/hr/reports/turnover', icon: ICONS.reports },
];

export const INVOICE_TYPE_OPTIONS: InvoiceType[] = ['Satış', 'İade', 'Tevkifat', 'İstisna', 'Özel Matrah'];
export const PAYMENT_METHODS = ['Nakit', 'Kredi Kartı', 'Havale/EFT', 'Çek'];

export const TEVKIFAT_KODLARI = [
    { code: '601', description: 'Yapım İşleri ile Bu İşlerle Birlikte İfa Edilen Mühendislik-Mimarlık ve Etüt-Proje Hizmetleri (3/10)', rate: 0.3 },
    { code: '602', description: 'Etüt, Plan, Proje, Danışmanlık, Denetim ve Benzeri Hizmetler (9/10)', rate: 0.9 },
    { code: '624', description: 'Yük Taşımacılığı Hizmeti (2/10)', rate: 0.2 },
    { code: '625', description: 'Ticari Reklam Hizmetleri (3/10)', rate: 0.3 },
];

export const KDV_MUAFİYET_KODLARI = [
    { code: '301', description: 'İstisna Olmayan Diğer' },
    { code: '350', description: 'Diğerleri' },
    { code: '351', description: 'İhracat İstisnası (Mal ve Hizmet)' },
];
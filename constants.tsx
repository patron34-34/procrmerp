import React from 'react';
import { 
    Customer, Deal, Project, Task, Notification, Invoice, Product, Supplier, PurchaseOrder, 
    Employee, LeaveRequest, BankAccount, Transaction, TransactionType, SupportTicket, Permission, 
    ActivityLog, ActionType, EntityType, Document, DashboardWidget, Comment, CommunicationLog, 
    CommunicationLogType, SavedView, SortConfig, Contact, DealLineItem, CustomFieldDefinition, 
    SalesActivity, SalesActivityType, DocumentShare, DocumentType, SharePermission, PurchaseOrderItem, 
    PerformanceReview, JobOpening, Candidate, OnboardingTemplate, OnboardingWorkflow, 
    OnboardingWorkflowStatus, OnboardingType, CompanyInfo, CustomFieldType, BrandingSettings, 
    SecuritySettings, Role, Account, JournalEntry, JournalEntryItem, JournalEntryType, JournalEntryStatus, 
    AccountType, RecurringJournalEntry, RecurringFrequency, Budget, CostCenter, Bill, BillStatus, 
    TaxRate, TransactionCategory, SystemLists, SystemListKey, SystemListItem, EmailTemplate, 
    PriceList, PriceListItem, InvoiceStatus, DealStage, PurchaseOrderStatus, LeaveType, LeaveStatus, 
    TaskStatus, TicketStatus, TicketPriority, TaskPriority, CandidateStage, Automation, AutomationLog, 
    AutomationTriggerType, AutomationActionType, Warehouse, StockMovement, InventoryTransfer, 
    InventoryAdjustment, StockMovementType, AdjustmentReason, InventoryAdjustmentStatus, 
    InventoryTransferStatus, SalesOrder, SalesOrderStatus, Shipment, ShipmentStatus, WidgetConfig, 
    StockItem, StockItemStatus, SalesOrderItem, PickList, PickListItem, InvoiceLineItem, ShipmentItem, 
    PayrollRun, Payslip, PayslipEarning, PayslipDeduction, SeveranceCalculationResult, 
    PayrollSimulationResult, TaskTemplate, ScheduledTask, Attachment, Address,
    ReportCardInfo, Cinsiyet, CalismaStatusu, SigortaKolu, MedeniDurum, EgitimSeviyesi
} from './types';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 5L5 25L25 45L45 25L25 5Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M25 5L45 25" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
        <text x="55" y="32" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="bold" fill="currentColor">ProFusion</text>
    </svg>
);

const iconWrapper = (svg: JSX.Element) => React.cloneElement(svg, {
    className: "h-5 w-5",
    strokeWidth: 1.5,
});

export const ICONS = {
    dashboard: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>),
    customers: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.566-.16-1.168.359-1.168.359m0 0a3.004 3.004 0 01-3.5-2.25m3.5 2.25a3.001 3.001 0 003.5-2.25m-3.5 2.25a3.001 3.001 0 01-3.5-2.25m0 0a3.004 3.004 0 00-3.5-2.25m7.5-2.962c-.566.16-1.168-.359-1.168-.359m0 0a3.004 3.004 0 013.5 2.25m-3.5-2.25a3.001 3.001 0 00-3.5 2.25m3.5-2.25a3.001 3.001 0 013.5 2.25m0 0a3.004 3.004 0 003.5 2.25m-7.5 2.962c.566.16 1.168-.359 1.168-.359m0 0a3.004 3.004 0 00-3.5 2.25m3.5 2.25a3.001 3.001 0 01-3.5-2.25m0 0a3.004 3.004 0 01-3.5-2.25m7.5-2.962c-.566-.16-1.168.359-1.168-.359" /></svg>),
    sales: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>),
    planner: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l2.25 2.25 4.5-4.5" /></svg>),
    salesOrder: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.252c-.654 0-1.187-.585-1.117-1.243l1.263-12A3.75 3.75 0 017.5 6h9a3.75 3.75 0 013.75 3.75z" /></svg>),
    projects: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.446-2.25 2.656h-11.5c-1.286-.21-2.25-1.343-2.25-2.656V14.15M17.25 4.5l-4.5 4.5-4.5-4.5" /></svg>),
    tasks: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    invoices: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>),
    documents: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>),
    automations: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.96 14.96 0 010 2.56m0 0a14.96 14.96 0 01-2.56 0m2.56 0V12a2.25 2.25 0 00-2.25-2.25h-1.5m3.75 0V7.5a2.25 2.25 0 00-2.25-2.25h-1.5m3.75 0h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m-3.75 0h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m-3.75 0h-.375a1.125 1.125 0 01-1.125-1.125v-1.5c0 -.621.504 1.125 1.125-1.125h.375m-3.75 0V7.5a2.25 2.25 0 012.25-2.25h1.5M12 14.37v4.82m0 0a6 6 0 01-5.84-7.38m5.84 7.38a14.96 14.96 0 010-2.56m0 2.56a14.96 14.96 0 012.56 0m-2.56 0V12a2.25 2.25 0 012.25-2.25h1.5m-3.75 0V7.5a2.25 2.25 0 012.25-2.25h1.5m-3.75 0h-.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h.375m0 0h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375m0 0V12a2.25 2.25 0 00-2.25-2.25h-1.5" /></svg>),
    reports: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125V6.375m1.125 13.125A1.125 1.125 0 004.5 19.5h15V6.375m0 13.125A1.125 1.125 0 0119.5 19.5h-15m15-13.125a1.125 1.125 0 00-1.125-1.125H6.375m13.125 0A1.125 1.125 0 0119.5 4.5h-15m15 0a1.125 1.125 0 00-1.125-1.125H6.375m0 0A1.125 1.125 0 015.25 3h13.5" /></svg>),
    support: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>),
    inventory: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>),
    products: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>),
    accounting: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v.01M12 12V11m0 1v.01M12 16v.01M12 16v-1m0 1v.01M12 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    hr: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    adminPanel: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.212l2.29.916a12 12 0 014.28 4.28l.916 2.29c.205.55.153 1.154-.142 1.636l-2.146 3.193m-2.29-9.16a12 12 0 00-4.28-4.28l-.916-2.29a1.65 1.65 0 00-1.636-.142L2.96 5.599a12.022 12.022 0 00-.916 2.29c-.205.55-.153 1.154.142 1.636l2.146 3.193m9.16-2.29a12 12 0 014.28 4.28l.916 2.29c.205.55.153 1.154-.142 1.636l-2.146 3.193a12 12 0 01-4.28 4.28l-2.29.916a1.65 1.65 0 01-1.636.142l-3.193-2.146a12.022 12.022 0 01-2.29-.916c-.55-.205-1.154-.153-1.636.142l-3.193 2.146m9.16-11.453a3.001 3.001 0 11-4.243 4.243 3.001 3.001 0 014.243-4.243z" /></svg>),
    general: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg>),
    appearance: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.034 7.5h15.932c.66 0 1.147.694.857 1.285L12.857 19.21a1.96 1.96 0 01-3.714 0L4.17 8.785a.784.784 0 01-.136-1.285z" /></svg>),
    security: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.75M15 3.75a11.959 11.959 0 01-3.598 2.25" /></svg>),
    employees: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M15 19.128L12 15.75M15 19.128l-2.625-2.625m0-3l-2.625 2.625m2.625-2.625l2.625 2.625m-2.625-2.625L12 15.75M12 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>),
    roles: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M15 19.128L12 15.75M15 19.128l-2.625-2.625m0-3l-2.625 2.625m2.625-2.625l2.625 2.625m-2.625-2.625L12 15.75M12 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>),
    customization: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 01-3.388-1.62m-5.043-.025a15.998 15.998 0 01-3.388-1.622m7.703 6.042a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-1.622-3.385m5.043.025a15.998 15.998 0 013.388 1.622m-7.703 6.042a15.998 15.998 0 011.622 3.385m-3.388-1.62a15.998 15.998 0 00-3.388 1.622m" /></svg>),
    priceList: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>),
    tax: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>),
    costCenter: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l2.903 7.12A59.962 59.962 0 0112 20.904a59.962 59.962 0 016.822-8.636l2.903-7.12" /></svg>),
    integrations: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>),
    dataManagement: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" /></svg>),
    add: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>),
    trash: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>),
    edit: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>),
    export: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>),
    import: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>),
    list: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>),
    kanban: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>),
    map: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-10.5h-7a.5.5 0 00-.5.5v12.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V6.25a.5.5 0 00-.5-.5z" /></svg>),
    analytics: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h3.75m-3.75 0A4.502 4.502 0 0112 14.25v-2.25m0-2.25v-2.25a4.5 4.5 0 10-9 0v6.75a4.5 4.5 0 109 0v-6.75" /></svg>),
    calendar: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>),
    gantt: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>),
    notification: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>),
    search: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>),
    close: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>),
    lock: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>),
    filePdf: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>),
    fileWord: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>),
    fileExcel: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>),
    fileImage: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>),
    fileOther: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>),
    note: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>),
    phoneCall: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>),
    meeting: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.566-.16-1.168.359-1.168.359m0 0a3.004 3.004 0 01-3.5-2.25m3.5 2.25a3.001 3.001 0 003.5-2.25m-3.5 2.25a3.001 3.001 0 01-3.5-2.25m0 0a3.004 3.004 0 00-3.5-2.25m7.5-2.962c-.566.16-1.168-.359-1.168-.359m0 0a3.004 3.004 0 013.5 2.25m-3.5-2.25a3.001 3.001 0 00-3.5 2.25m3.5-2.25a3.001 3.001 0 013.5 2.25m0 0a3.004 3.004 0 003.5 2.25m-7.5 2.962c.566.16 1.168-.359 1.168-.359m0 0a3.004 3.004 0 00-3.5 2.25m3.5 2.25a3.001 3.001 0 01-3.5-2.25m0 0a3.004 3.004 0 01-3.5-2.25m7.5-2.962c-.566-.16-1.168.359-1.168-.359" /></svg>),
    email: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>),
    ellipsisVertical: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>),
    transfer: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>),
    adjustment: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>),
    suppliers: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V6h2a1 1 0 011 1v9a1 1 0 01-1 1h-1l-2 2z" /></svg>),
    receive: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>),
    purchaseOrder: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>),
    leave: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.898 12.102A9.955 9.955 0 0112 21a9.955 9.955 0 01-8.898-8.898" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.102 12.102A9.955 9.955 0 0112 3a9.955 9.955 0 018.898 8.898" /></svg>),
    starFilled: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>),
    starOutline: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>),
    folder: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>),
    share: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.186m0-4.186c.114.05.23.09.349.124m-3.498 3.938c.22.062.45.101.687.124m7.538-2.552a2.25 2.25 0 100 4.186m0-4.186c-.114.05-.23.09-.349.124m3.498 3.938c-.22.062-.45.101-.687.124m-7.187-3.949a2.25 2.25 0 100-4.186m0 4.186c.114-.05.23-.09.349-.124m-3.498-3.938c.22-.062.45-.101.687.124m7.187 3.949a2.25 2.25 0 100-4.186m0 4.186c-.114-.05-.23-.09-.349-.124m3.498-3.938c-.22-.062-.45-.101-.687.124" /></svg>),
    system: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>),
    magic: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.82.162l3.19 3.19a.75.75 0 01-.53 1.28l-3.19-3.19a.75.75 0 01-.162-.82z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm0 18a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V21a.75.75 0 01.75-.75zm6-10.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75z" /></svg>),
    saveAndNew: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    copy: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>),
    reverse: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>),
    trialBalance: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" /></svg>),
    balanceSheet: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5l7.5 7.5 7.5-7.5" /></svg>),
    incomeStatement: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    cashFlow: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    ledger: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>),
    arAging: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>),
    profitAndLoss: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    bills: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>),
    bank: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>),
    transactions: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" /></svg>),
    warehouse: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg>),
    shipment: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V6h2a1 1 0 011 1v9a1 1 0 01-1 1h-1l-2 2z" /></svg>),
    pickList: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    payroll: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
    budget: iconWrapper(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
};

export const AVAILABLE_WIDGETS: WidgetConfig[] = [
    { id: 'stat-total-cash', name: 'Toplam Nakit', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'stat-net-cash-flow', name: 'Net Nakit Akışı', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'stat-total-revenue', name: 'Toplam Gelir', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'stat-unpaid-invoices', name: 'Ödenmemiş Faturalar', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'stat-active-customers', name: 'Aktif Müşteriler', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'stat-open-tickets', name: 'Açık Destek Talepleri', type: 'StatCard', defaultW: 2, defaultH: 2 },
    { id: 'chart-financial-summary', name: 'Finansal Özet', type: 'Chart', defaultW: 4, defaultH: 4 },
    { id: 'chart-invoice-status', name: 'Fatura Durumları', type: 'Chart', defaultW: 2, defaultH: 4 },
    { id: 'list-today-view', name: 'Bugün', type: 'List', defaultW: 3, defaultH: 4 },
    { id: 'list-my-tasks', name: 'Görevlerim', type: 'List', defaultW: 3, defaultH: 4 },
    { id: 'list-recent-activities', name: 'Son Aktiviteler', type: 'List', defaultW: 6, defaultH: 4 },
];

export const MOCK_COMPANY_INFO: CompanyInfo = {
  name: 'ProFusion Inc.',
  address: '123 Tech Avenue, Silicon Valley, CA 94043',
  phone: '+1 (555) 123-4567',
  email: 'contact@profusion.inc',
  website: 'www.profusion.inc'
};

export const MOCK_BRANDING_SETTINGS: BrandingSettings = {
  logoUrl: '',
  primaryColor: '#3b82f6'
};

export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,
  sessionTimeout: 30
};

export const INITIAL_ROLES: Role[] = [
    { id: 'admin', name: 'Admin', isSystemRole: true },
    { id: 'satis', name: 'Satış', isSystemRole: false },
    { id: 'operasyon', name: 'Operasyon', isSystemRole: false },
    { id: 'muhasebe', name: 'Muhasebe', isSystemRole: false },
    { id: 'calisan', name: 'Çalışan', isSystemRole: true },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, employeeId: 'EMP001', name: 'Ali Veli', department: 'Yönetim', position: 'CEO', email: 'ali.veli@example.com', phone: '555-001', hireDate: '2020-01-15', salary: 150000, avatar: 'https://i.pravatar.cc/150?u=1', role: 'Admin', managerId: undefined, istenCikisTarihi: undefined },
  { id: 2, employeeId: 'EMP002', name: 'Ayşe Yılmaz', department: 'Satış', position: 'Satış Müdürü', email: 'ayse.yilmaz@example.com', phone: '555-002', hireDate: '2021-03-20', salary: 95000, avatar: 'https://i.pravatar.cc/150?u=2', role: 'Satış', managerId: 1 },
  { id: 3, employeeId: 'EMP003', name: 'Mehmet Kaya', department: 'Operasyon', position: 'Proje Yöneticisi', email: 'mehmet.kaya@example.com', phone: '555-003', hireDate: '2021-05-10', salary: 85000, avatar: 'https://i.pravatar.cc/150?u=3', role: 'Operasyon', managerId: 1 },
  { id: 4, employeeId: 'EMP004', name: 'Fatma Demir', department: 'Muhasebe', position: 'Muhasebe Uzmanı', email: 'fatma.demir@example.com', phone: '555-004', hireDate: '2022-08-01', salary: 70000, avatar: 'https://i.pravatar.cc/150?u=4', role: 'Muhasebe', managerId: 1 },
  { id: 5, employeeId: 'EMP005', name: 'Can Öztürk', department: 'Satış', position: 'Satış Temsilcisi', email: 'can.ozturk@example.com', phone: '555-005', hireDate: '2023-02-11', salary: 60000, avatar: 'https://i.pravatar.cc/150?u=5', role: 'Çalışan', managerId: 2 },
];

const mockAddress1: Address = {
  country: 'Türkiye', city: 'İstanbul', district: 'Beşiktaş', streetAddress: 'Teknopark, No: 123', postalCode: '34349',
  email: 'info@teknoas.com', phone: '212-555-1111', coordinates: { lat: 41.044, lng: 29.002 }
};

const mockAddress2: Address = {
  country: 'Türkiye', city: 'Kocaeli', district: 'Gebze', streetAddress: 'GOSB, 100. Yıl Cd.', postalCode: '41400',
  email: 'contact@lojistik.com', phone: '216-555-2222', coordinates: { lat: 40.793, lng: 29.432 }
};

const mockAddress3: Address = {
    country: 'Türkiye', city: 'Ankara', district: 'Yenimahalle', streetAddress: 'Ostim OSB, 1234. Sk', postalCode: '06370',
    email: 'info@gidasan.com', phone: '312-555-3333', coordinates: { lat: 39.9678, lng: 32.7612 }
};


export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 1, name: 'Tekno A.Ş.', email: 'info@teknoas.com', company: 'Tekno A.Ş.', phone: '212-555-1111', 
    lastContact: '2024-07-10', status: 'aktif', avatar: 'https://i.pravatar.cc/150?u=c1', industry: 'Teknoloji', 
    tags: ['vip', 'yeni-firsat'], assignedToId: 2, healthScore: 85, leadSource: 'Website',
    accountType: 'Tüzel Kişi', accountCode: 'CUST-001', taxId: '8350051234', taxOffice: 'Beşiktaş V.D.',
    billingAddress: mockAddress1,
    shippingAddress: mockAddress1,
    iban: 'TR330006200004600006297523', openingBalance: 15000, currency: 'TRY', openingDate: '2022-01-10',
    eInvoiceMailbox: 'default@teknoas.com.tr', eDispatchMailbox: 'default@teknoas.com.tr'
  },
  { 
    id: 2, name: 'Lojistik Ltd.', email: 'contact@lojistik.com', company: 'Lojistik Ltd.', phone: '216-555-2222', 
    lastContact: '2024-06-25', status: 'aktif', avatar: 'https://i.pravatar.cc/150?u=c2', industry: 'Lojistik', 
    tags: ['uzun-vadeli'], assignedToId: 5, healthScore: 65, leadSource: 'Referans',
    accountType: 'Tüzel Kişi', accountCode: 'CUST-002', taxId: '6080084567', taxOffice: 'Gebze V.D.',
    billingAddress: mockAddress2,
    shippingAddress: mockAddress2,
    iban: 'TR330006200004600006297524', openingBalance: 0, currency: 'USD', openingDate: '2023-05-20',
  },
  { 
    id: 3, name: 'Gıda Sanayi', email: 'info@gidasan.com', company: 'Gıda Sanayi', phone: '312-555-3333', 
    lastContact: '2024-07-12', status: 'potensiyel', avatar: 'https://i.pravatar.cc/150?u=c3', industry: 'Gıda', 
    tags: [], assignedToId: 2, healthScore: 45, leadSource: 'Fuar',
    accountType: 'Gerçek Kişi', accountCode: 'CUST-003', taxId: '12345678910', taxOffice: 'Ostim V.D.',
    billingAddress: mockAddress3,
    shippingAddress: mockAddress3,
    iban: 'TR330006200004600006297525', openingBalance: -5000, currency: 'EUR', openingDate: '2024-02-15'
  },
];


export const MOCK_DEALS: Deal[] = [
    { id: 1, title: 'CRM Entegrasyonu', customerId: 1, customerName: 'Tekno A.Ş.', value: 25000, stage: DealStage.Proposal, closeDate: '2024-08-15', assignedToId: 2, assignedToName: 'Ayşe Yılmaz', lineItems: [{productId: 1, productName: 'Danışmanlık Saati', quantity: 100, price: 250}], lastActivityDate: '2024-07-10' },
    { id: 2, title: 'Depo Otomasyon Sistemi', customerId: 2, customerName: 'Lojistik Ltd.', value: 75000, stage: DealStage.Won, closeDate: '2024-07-05', assignedToId: 5, assignedToName: 'Can Öztürk', lineItems: [{productId: 2, productName: 'Yazılım Lisansı', quantity: 5, price: 15000}], winReason: 'Fiyat Avantajı', lastActivityDate: '2024-07-01' },
    { id: 3, title: 'Web Sitesi Yenileme', customerId: 3, customerName: 'Gıda Sanayi', value: 15000, stage: DealStage.Contacted, closeDate: '2024-09-01', assignedToId: 2, assignedToName: 'Ayşe Yılmaz', lineItems: [{productId: 1, productName: 'Danışmanlık Saati', quantity: 60, price: 250}], lastActivityDate: '2024-07-12' },
];

export const MOCK_PROJECTS: Project[] = [];
export const MOCK_TASKS: Task[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];
export const MOCK_INVOICES: Invoice[] = [];
export const MOCK_PRODUCTS: Product[] = [
    {id: 1, sku: 'CONS-HOUR', name: 'Danışmanlık Saati', category: 'Hizmet', price: 250, lowStockThreshold: 0, trackBy: 'none' },
    {id: 2, sku: 'SOFT-LIC', name: 'Yazılım Lisansı', category: 'Yazılım', price: 15000, lowStockThreshold: 0, trackBy: 'none' },
    {id: 3, sku: 'HW-LAP-01', name: 'Dizüstü Bilgisayar X-Pro', category: 'Donanım', price: 1200, lowStockThreshold: 5, trackBy: 'serial', binLocation: 'A1-01' },
    {id: 4, sku: 'HW-MOU-05', name: 'Kablosuz Mouse Z-Series', category: 'Aksesuar', price: 45, lowStockThreshold: 20, trackBy: 'batch', binLocation: 'C3-12' },
];
export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'TeknoTedarik A.Ş.', contactPerson: 'Ahmet Çelik', email: 'ahmet@teknotedarik.com', phone: '212-111-2233' },
    { id: 2, name: 'Ofis Malzemeleri Ltd.', contactPerson: 'Zeynep Aydın', email: 'zeynep@ofis.com', phone: '312-444-5566' },
];
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [];
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    { id: 1, accountName: 'Merkez Kasa', bankName: 'Nakit', accountNumber: 'KASA-TRY', balance: 50000 },
    { id: 2, accountName: 'Garanti Bankası Vadesiz', bankName: 'Garanti BBVA', accountNumber: 'TR12...', balance: 250000 },
];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_TICKETS: SupportTicket[] = [];
export const INITIAL_ROLES_PERMISSIONS: Record<string, Permission[]> = {};
export const MOCK_DOCUMENTS: Document[] = [];
export const INITIAL_DASHBOARD_LAYOUT: DashboardWidget[] = [];
export const MOCK_COMMENTS: Comment[] = [];
export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [];
export const MOCK_SAVED_VIEWS: SavedView[] = [];
export const MOCK_CONTACTS: Contact[] = [];
export const MOCK_CUSTOM_FIELD_DEFINITIONS: CustomFieldDefinition[] = [];
export const MOCK_SALES_ACTIVITIES: SalesActivity[] = [];
export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const MOCK_JOB_OPENINGS: JobOpening[] = [];
export const MOCK_CANDIDATES: Candidate[] = [];
export const MOCK_ONBOARDING_TEMPLATES: OnboardingTemplate[] = [];
export const MOCK_ONBOARDING_WORKFLOWS: OnboardingWorkflow[] = [];
export const MOCK_ACCOUNTS: Account[] = [
    // Assets
    { id: 1, accountNumber: '100', name: 'Kasa', type: AccountType.Asset, balance: 50000 },
    { id: 2, accountNumber: '102', name: 'Bankalar', type: AccountType.Asset, balance: 250000 },
    { id: 3, accountNumber: '120', name: 'Alıcılar', type: AccountType.Asset, balance: 15000 },
    { id: 4, accountNumber: '153', name: 'Ticari Mallar', type: AccountType.Asset, balance: 0 },
    // Liabilities
    { id: 5, accountNumber: '320', name: 'Satıcılar', type: AccountType.Liability, balance: 0 },
    { id: 6, accountNumber: '360', name: 'Ödenecek Vergi ve Fonlar', type: AccountType.Liability, balance: 0 },
    // Equity
    { id: 7, accountNumber: '500', name: 'Sermaye', type: AccountType.Equity, balance: 315000 },
    // Revenue
    { id: 8, accountNumber: '600', name: 'Yurtiçi Satışlar', type: AccountType.Revenue, balance: 0 },
    // Expense
    { id: 9, accountNumber: '770', name: 'Genel Yönetim Giderleri', type: AccountType.Expense, balance: 0 },
    { id: 10, accountNumber: '770.01', name: 'Maaş Giderleri', type: AccountType.Expense, balance: 0, parentId: 9 },
    { id: 11, accountNumber: '770.02', name: 'Kira Giderleri', type: AccountType.Expense, balance: 0, parentId: 9 },
];
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [];
export const MOCK_RECURRING_JOURNAL_ENTRIES: RecurringJournalEntry[] = [];
export const MOCK_BUDGETS: Budget[] = [];
export const MOCK_COST_CENTERS: CostCenter[] = [];
export const MOCK_TAX_RATES: TaxRate[] = [];
export const INITIAL_SYSTEM_LISTS: SystemLists = { customerStatus: [], dealStage: [], taskStatus: [], taskPriority: [], leadSource: [] };
export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [];
export const MOCK_PRICE_LISTS: PriceList[] = [];
export const MOCK_PRICE_LIST_ITEMS: PriceListItem[] = [];
export const MOCK_AUTOMATIONS: Automation[] = [];
export const MOCK_AUTOMATION_LOGS: AutomationLog[] = [];
export const MOCK_WAREHOUSES: Warehouse[] = [
    { id: 1, name: 'Merkez Depo', location: 'İstanbul', isDefault: true },
    { id: 2, name: 'Ankara Bölge Depo', location: 'Ankara', isDefault: false },
];
export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [];
export const MOCK_INVENTORY_TRANSFERS: InventoryTransfer[] = [];
export const MOCK_INVENTORY_ADJUSTMENTS: InventoryAdjustment[] = [];
export const MOCK_SALES_ORDERS: SalesOrder[] = [];
export const MOCK_SHIPMENTS: Shipment[] = [];
export const MOCK_PICK_LISTS: PickList[] = [];
export const MOCK_PAYSLIPS: Payslip[] = [];
export const PROJECT_HOURLY_RATE = 100;

export const MOCK_BILLS: Bill[] = [];
export const MOCK_STOCK_ITEMS: StockItem[] = [
    { id: 1, productId: 3, warehouseId: 1, serialNumber: 'SN-A123', status: StockItemStatus.Available },
    { id: 2, productId: 3, warehouseId: 1, serialNumber: 'SN-A124', status: StockItemStatus.Available },
    { id: 3, productId: 4, warehouseId: 1, batchNumber: 'BATCH-001', expiryDate: '2025-12-31', quantity: 50, status: StockItemStatus.Available },
];
export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
    { id: 1, payPeriod: "Haziran 2024", runDate: "2024-06-30", status: 'Muhasebeleşti', employeeCount: 4, totalGrossPay: 390000, totalDeductions: 120000, totalNetPay: 270000, totalEmployerSgk: 85000, journalEntryId: 1 }
];

export const DEAL_STAGE_PROBABILITIES: { [key in DealStage]: number } = {
    [DealStage.Lead]: 0.1,
    [DealStage.Contacted]: 0.3,
    [DealStage.Proposal]: 0.6,
    [DealStage.Won]: 1,
    [DealStage.Lost]: 0,
};

export const WIN_REASONS = ['Fiyat Avantajı', 'Ürün Kalitesi', 'Hızlı Teslimat', 'İyi İlişkiler', 'Diğer'];
export const LOSS_REASONS = ['Fiyat Yüksek', 'Rakip Tercihi', 'İhtiyaç Değişikliği', 'Zamanlama', 'Diğer'];

export const REPORT_CARDS: ReportCardInfo[] = [
    { title: "Satış Performansı", description: "Anlaşma kazanma oranları, gelir ve satış hattı performansını analiz edin.", link: "/reports/sales", icon: ICONS.sales },
    { title: "Fatura Durumu", description: "Ödenmiş, gecikmiş ve taslak faturaların durumunu ve toplam tutarlarını görün.", link: "/reports/invoices", icon: ICONS.invoices },
    { title: "Gider Analizi", description: "Giderlerinizi kategoriye göre inceleyin ve maliyetleri kontrol altında tutun.", link: "/reports/expenses", icon: ICONS.transactions },
];

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
    'dashboard:goruntule': 'Kontrol panelini görüntüleme',
    'dashboard:duzenle': 'Kontrol panelini düzenleme',
    'musteri:goruntule': 'Müşteri kayıtlarını görüntüleme',
    'musteri:yonet': 'Müşteri ekleme, düzenleme, silme',
    'anlasma:goruntule': 'Satış anlaşmalarını görüntüleme',
    'anlasma:yonet': 'Anlaşma ekleme, düzenleme, silme',
    'proje:goruntule': 'Projeleri görüntüleme',
    'proje:yonet': 'Proje ekleme, düzenleme, silme',
    'gorev:goruntule': 'Görevleri görüntüleme',
    'gorev:yonet': 'Görev ekleme, düzenleme, silme',
    'fatura:goruntule': 'Faturaları görüntüleme',
    'fatura:yonet': 'Fatura ekleme, düzenleme, silme',
    'takvim:goruntule': 'Takvimi görüntüleme',
    'rapor:goruntule': 'Raporları görüntüleme',
    'envanter:goruntule': 'Envanter modülünü görüntüleme',
    'envanter:yonet': 'Envanter yönetimi (ürün ekleme vb.)',
    'depo:yonet': 'Depo yönetimi',
    'stok-hareketi:goruntule': 'Stok hareketlerini görüntüleme',
    'stok-sayimi:yap': 'Stok sayımı yapabilme',
    'satis-siparis:goruntule': 'Satış siparişlerini görüntüleme',
    'satis-siparis:yonet': 'Satış siparişlerini yönetme',
    'sevkiyat:goruntule': 'Sevkiyatları görüntüleme',
    'sevkiyat:yonet': 'Sevkiyatları yönetme',
    'toplama-listesi:goruntule': 'Toplama listelerini görüntüleme',
    'toplama-listesi:yonet': 'Toplama listelerini yönetme',
    'ik:goruntule': 'İK modülünü görüntüleme',
    'ik:maas-goruntule': 'Maaş bilgilerini görüntüleme',
    'ik:izin-yonet': 'İzin taleplerini yönetme',
    'ik:performans-yonet': 'Performans değerlendirmelerini yönetme',
    'ik:ise-alim-goruntule': 'İşe alım modülünü görüntüleme',
    'ik:ise-alim-yonet': 'İşe alım modülünü yönetme',
    'ik:oryantasyon-goruntule': 'Oryantasyon iş akışlarını görüntüleme',
    'ik:oryantasyon-yonet': 'Oryantasyon iş akışlarını yönetme',
    'ik:bordro-yonet': 'Bordro yönetimi',
    'finans:goruntule': 'Finans modülünü (banka hesapları vb.) görüntüleme',
    'finans:yonet': 'Finans modülünü yönetme',
    'destek:goruntule': 'Destek taleplerini görüntüleme',
    'destek:yonet': 'Destek taleplerini yönetme',
    'aktivite:goruntule': 'Aktivite kayıtlarını görüntüleme',
    'dokuman:goruntule': 'Dokümanları görüntüleme',
    'dokuman:yonet': 'Dokümanları yönetme (ekleme, silme vb.)',
    'yorum:yonet': 'Yorum ekleme, düzenleme',
    'kullanici:yonet': 'Kullanıcıları yönetme (ekleme, rol atama vb.)',
    'ayarlar:goruntule': 'Ayarlar sayfasını görüntüleme',
    'ayarlar:genel-yonet': 'Genel ayarları yönetme',
    'ayarlar:roller-yonet': 'Rol ve izinleri yönetme',
    'ayarlar:guvenlik-yonet': 'Güvenlik ayarlarını yönetme',
    'ayarlar:muhasebe-yonet': 'Muhasebe ayarlarını yönetme',
    'ayarlar:maliyet-merkezi-yonet': 'Maliyet merkezlerini yönetme',
    'ayarlar:vergi-yonet': 'Vergi oranlarını yönetme',
    'muhasebe:goruntule': 'Muhasebe modülünü görüntüleme',
    'muhasebe:yonet': 'Muhasebe kayıtlarını yönetme',
    'muhasebe:mutabakat-yap': 'Banka mutabakatı yapma',
    'muhasebe:defteri-kebir-goruntule': 'Defter-i Kebir görüntüleme',
    'muhasebe:bilanco-goruntule': 'Bilanço görüntüleme',
    'muhasebe:gelir-tablosu-goruntule': 'Gelir tablosu görüntüleme',
    'muhasebe:nakit-akis-goruntule': 'Nakit akış tablosu görüntüleme',
    'muhasebe:alacak-yaslandirma-goruntule': 'Alacak yaşlandırma raporunu görüntüleme',
    'muhasebe:kar-zarar-goruntule': 'Kâr-zarar raporunu görüntüleme',
    'muhasebe:tekrarlanan-yonet': 'Tekrarlanan yevmiye kayıtlarını yönetme',
    'muhasebe:butce-yonet': 'Bütçeleri yönetme',
    'otomasyon:goruntule': 'Otomasyonları görüntüleme',
    'otomasyon:yonet': 'Otomasyonları yönetme',
};

export const SGK_TERMINATION_CODES = [
    { code: '3', description: 'Belirsiz süreli iş sözleşmesinin işçi tarafından feshi (istifa)' },
    { code: '4', description: 'Belirsiz süreli iş sözleşmesinin işveren tarafından haklı sebep bildirilmeden feshi' },
    { code: '22', description: 'Askerlik' },
    { code: '25', description: 'İşverenin haklı nedenle derhal feshi' },
];

export const SGK_PROFESSION_CODES_SAMPLE = [
    { code: '2511.01', description: 'Yazılım Geliştiricisi' },
    { code: '2421.05', description: 'Pazarlama Uzmanı' },
    { code: '3322.01', description: 'Muhasebe Meslek Elemanı' },
    { code: '1211.01', description: 'İnsan Kaynakları Müdürü' },
];

export const SGK_MISSING_DAY_REASONS = [
    { code: '1', description: 'İstirahat' },
    { code: '7', description: 'Puantaj Kayıtları' },
    { code: '12', description: 'Birden Fazla' },
    { code: '13', description: 'Diğer' },
];

export const CINSIYET_OPTIONS: Cinsiyet[] = ['Erkek', 'Kadın'];
export const CALISMA_STATUSU_OPTIONS: CalismaStatusu[] = ['Tam Zamanlı', 'Yarı Zamanlı', 'Geçici', 'Stajyer'];
export const SIGORTA_KOLU_OPTIONS: SigortaKolu[] = ['4A', '4B', '4C'];
export const MEDENI_DURUM_OPTIONS: MedeniDurum[] = ['Bekar', 'Evli'];
export const EGITIM_SEVIYELERI: EgitimSeviyesi[] = ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];


export const MOCK_TASK_TEMPLATES: TaskTemplate[] = [
    {
        id: 1,
        name: "Yeni Müşteri Oryantasyonu",
        description: "Yeni bir müşteri kazanıldığında standart olarak oluşturulacak görevler.",
        items: [
            { id: 'item-1', taskName: "Karşılama e-postası gönder", dueDaysAfterStart: 0, priority: TaskPriority.High, estimatedTime: 30, defaultAssigneeRoleId: 'satis', parentId: null },
            { id: 'item-2', taskName: "Proje başlangıç toplantısı ayarla", dueDaysAfterStart: 1, priority: TaskPriority.High, estimatedTime: 60, defaultAssigneeRoleId: 'operasyon', parentId: null },
            { id: 'item-3', taskName: "Müşteri gereksinimlerini analiz et", dueDaysAfterStart: 2, priority: TaskPriority.Normal, estimatedTime: 240, defaultAssigneeRoleId: 'operasyon', parentId: 'item-2' },
            { id: 'item-4', taskName: "İlk taslak/çözüm sunumu hazırla", dueDaysAfterStart: 5, priority: TaskPriority.Normal, estimatedTime: 180, defaultAssigneeRoleId: 'operasyon', parentId: 'item-2' },
            { id: 'item-5', taskName: "Müşteriden geri bildirim al", dueDaysAfterStart: 7, priority: TaskPriority.High, estimatedTime: 60, defaultAssigneeRoleId: 'satis', parentId: null },
        ]
    },
    {
        id: 2,
        name: "Aylık Raporlama Süreci",
        description: "Her ayın başında tekrarlanan finansal ve operasyonel raporlama görevleri.",
        items: [
            { id: 'item-6', taskName: "Satış verilerini topla ve analiz et", dueDaysAfterStart: 1, priority: TaskPriority.Normal, estimatedTime: 120, defaultAssigneeRoleId: 'satis', parentId: null },
            { id: 'item-7', taskName: "Gider raporlarını oluştur", dueDaysAfterStart: 2, priority: TaskPriority.Normal, estimatedTime: 90, defaultAssigneeRoleId: 'muhasebe', parentId: null },
            { id: 'item-8', taskName: "Aylık P&L tablosunu hazırla", dueDaysAfterStart: 3, priority: TaskPriority.High, estimatedTime: 180, defaultAssigneeRoleId: 'muhasebe', parentId: null },
            { id: 'item-9', taskName: "Yönetim sunumunu hazırla", dueDaysAfterStart: 4, priority: TaskPriority.High, estimatedTime: 120, defaultAssigneeRoleId: 'admin', parentId: 'item-8' },
        ]
    }
];

export const MOCK_SCHEDULED_TASKS: ScheduledTask[] = [
    {
        id: 1,
        name: "Aylık Raporlama Süreci",
        taskTemplateId: 2, // "Aylık Raporlama Süreci"
        rrule: 'FREQ=MONTHLY;BYMONTHDAY=20',
        startDate: '2024-01-01',
        nextRunDate: '2024-08-20',
        lastRunDate: '2024-07-20',
        enabled: true,
    }
];

export const TURKISH_PAYROLL_PARAMS_2025 = {
    SGK_CEILING: 150189.00,
    EMPLOYEE_SGK_RATE: 0.14,
    EMPLOYEE_UNEMPLOYMENT_RATE: 0.01,
    EMPLOYER_SGK_RATE: 0.205,
    EMPLOYER_UNEMPLOYMENT_RATE: 0.02,
    INCOME_TAX_EXEMPTION_BASE: 20002.50, // Asgari Ücret
    STAMP_DUTY_EXEMPTION_BASE: 20002.50, // Asgari Ücret
    STAMP_DUTY_RATE: 0.00759,
    BES_RATE: 0.03, // Otomatik Katılım
    INCOME_TAX_BRACKETS: [
        { limit: 110000, rate: 0.15 },
        { limit: 230000, rate: 0.20 },
        { limit: 870000, rate: 0.27 },
        { limit: 3000000, rate: 0.35 },
        { limit: Infinity, rate: 0.40 },
    ],
};
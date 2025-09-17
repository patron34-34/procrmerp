import { StringMappingType } from "react-router-dom/dist/history";


// Toast (from NotificationContext)
export type ToastType = 'success' | 'warning' | 'error' | 'info';
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  sku: string;
}

export interface Address {
    country: string;
    city: string;
    district: string;
    streetAddress: string;
    postalCode: string;
    email: string;
    phone: string;
    phone2?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface Attachment {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number; // in KB
    url: string; // a mock url
    uploadedAt: string;
    uploadedById: number;
}

export interface ScheduledTask {
    id: number;
    name: string;
    taskTemplateId: number;
    rrule: string; // Recurrence rule string (e.g., 'FREQ=MONTHLY;BYMONTHDAY=15')
    startDate: string;
    endDate?: string;
    nextRunDate: string;
    lastRunDate?: string;
    enabled: boolean;
}

export interface PayrollSimulationResult {
    grossSalary: number;
    netSalary: number;
    employeeSgkContribution: number;
    employeeUnemploymentContribution: number;
    incomeTax: number;
    stampDuty: number;
    totalEmployeeDeductions: number;
    employerSgkContribution: number;
    employerUnemploymentContribution: number;
    totalEmployerCost: number;
    incomeTaxExemption: number;
    stampDutyExemption: number;
}

export interface SeveranceCalculationResult {
    // Service duration
    serviceYears: number;
    serviceMonths: number;
    serviceDays: number;
    totalServiceDays: number;
    // Inputs
    finalGrossSalary: number; // The gross salary used for calculations (base + additions)
    // Severance
    severancePayBase: number;
    severancePayGross: number;
    severanceStampDuty: number;
    severancePayNet: number;
    // Notice
    noticePeriodWeeks: number;
    noticePayGross: number;
    noticePayNet: number;
    // Annual Leave
    annualLeaveDaysEntitled: number;
    annualLeaveDaysUsed: number;
    annualLeaveDaysUnused: number;
    annualLeavePayGross: number;
    annualLeavePayNet: number;
    // Bonus
    bonusGross: number;
    bonusNet: number;
    // Combined Taxable Items
    totalTaxableGross: number;
    totalIncomeTax: number;
    totalStampDuty: number;
    // Grand Total
    totalNetPayment: number;
}


export interface PayslipEarning {
    name: string;
    amount: number;
}

export interface PayslipDeduction {
    name: string;
    amount: number;
}

export interface Payslip {
    id: number;
    payrollRunId: number;
    employeeId: number;
    employeeName: string;
    payPeriod: string;
    runDate: string;
    grossPay: number;
    earnings: PayslipEarning[];
    deductions: PayslipDeduction[];
    netPay: number;
    // Gelişmiş alanlar
    sgkPremium: number; // İşçi SGK + İşsizlik
    unemploymentPremium: number; // Sadece işçi işsizlik
    incomeTaxBase: number;
    cumulativeIncomeTaxBase: number;
    incomeTaxAmount: number;
    stampDutyAmount: number;
    // Türkiye Standartları
    employerSgkPremium: number; // İşveren SGK + İşsizlik
    incomeTaxExemption: number;
    stampDutyExemption: number;
    besKesintisi: number;
    agiTutari: number; // Hesaplanan AGİ
    // Puantaj Kartı Alanları
    normalCalismaGunu: number;
    haftaTatili: number;
    genelTatil: number;
    ucretliIzin: number;
    ucretsizIzin: number;
    raporluGun: number;
    fazlaMesaiSaati: number;
    // Yeni Puantaj Alanları
    resmiTatilMesaisi: number; // Saat
    geceVardiyasiSaati: number; // Saat
    eksikGun: number;
    eksikGunNedeni?: string;
    // Ek Ödemeler / Diğer Kesintiler
    ekOdemeler: { name: string; amount: number }[];
    digerKesintiler: { name: string; amount: number }[];
    besKesintisiVarMi?: boolean;
    sgkTesvikIndirimi?: number;
}

export interface PayrollRun {
    id: number;
    payPeriod: string; // "Temmuz 2024"
    runDate: string; // YYYY-MM-DD
    status: 'Taslak' | 'Onaylandı' | 'Muhasebeleşti';
    employeeCount: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    journalEntryId?: number;
    // Türkiye Standartları
    totalEmployerSgk: number;
}

export interface PriceList {
    id: number;
    name: string;
    currency: 'TRY' | 'USD' | 'EUR';
    isDefault: boolean;
}

export interface PriceListItem {
    priceListId: number;
    productId: number;
    price: number;
}

export interface SystemListItem {
    id: string;
    label: string;
    color?: string;
}

export type SystemListKey = 'customerStatus' | 'dealStage' | 'taskStatus' | 'taskPriority' | 'leadSource';

export type SystemLists = {
    [key in SystemListKey]: SystemListItem[];
}

export interface EmailTemplate {
    id: 'invoice' | 'newUser' | 'taskAssigned';
    name: string;
    subject: string;
    body: string;
    variables: string[];
}

export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
  status: string;
  avatar: string;
  industry: string;
  tags: string[];
  assignedToId: number;
  leadSource: string;
  customFields?: { [key: string]: string | number | boolean };
  priceListId?: number;
  healthScore?: number;
  healthScoreBreakdown?: string[];

  // New detailed fields
  accountType: 'Gerçek Kişi' | 'Tüzel Kişi';
  accountCode: string;
  taxId: string; // T.C. Kimlik No / Vergi Kimlik No
  taxOffice: string;
  
  billingAddress: Address;
  shippingAddress: Address;
  
  iban: string;
  iban2?: string;
  openingBalance: number;
  currency: 'TRY' | 'USD' | 'EUR';
  openingDate: string;

  eInvoiceMailbox?: string;
  eDispatchMailbox?: string;
}


export interface Contact {
    id: number;
    customerId: number;
    name: string;
    title: string;
    email: string;
    phone: string;
}

export type SortConfig = { key: keyof (Customer & { assignedToName: string }); direction: 'ascending' | 'descending' } | null;

export interface SavedView {
  id: number;
  name: string;
  filters: {
    status: string[];
    industry: string[];
    assignedToId: number[];
    leadSource: string[];
  };
  sortConfig: SortConfig;
}

export interface DealLineItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export enum DealStage {
    Lead = 'Potensiyel',
    Contacted = 'İletişim Kuruldu',
    Proposal = 'Teklif',
    Won = 'Kazanıldı',
    Lost = 'Kaybedildi',
}

export interface Deal {
  id: number;
  title: string;
  customerId: number;
  customerName: string;
  value: number;
  stage: DealStage;
  closeDate: string;
  assignedToId: number;
  assignedToName: string;
  lineItems: DealLineItem[];
  winReason?: string;
  lossReason?: string;
  lastActivityDate: string;
  createdDate: string;
}

export interface Project {
    id: number;
    name: string;
    customerId: number;
    client: string;
    deadline: string;
    status: 'zamanında' | 'riskli' | 'tamamlandı' | 'beklemede';
    progress: number;
    description: string;
    startDate: string;
    teamMemberIds: number[];
    budget: number;
    spent: number;
    tags: string[];
}

export enum TaskStatus {
    Todo = 'Yapılacak',
    InProgress = 'Devam Ediyor',
    Completed = 'Tamamlandı',
}

export enum TaskPriority {
    Low = 'Düşük',
    Normal = 'Normal',
    High = 'Yüksek',
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    startDate?: string;
    assignedToId: number;
    assignedToName: string;
    relatedEntityType?: 'customer' | 'project' | 'deal';
    relatedEntityId?: number;
    relatedEntityName?: string;
    parentId?: number;
    dependsOn?: number[];
    estimatedTime?: number; // in minutes
    timeSpent?: number; // in minutes
    attachments?: Attachment[];
    isStarred?: boolean;
    // --- RECURRENCE FIELDS ---
    recurrenceRule?: string; // e.g., 'FREQ=DAILY', 'FREQ=WEEKLY'
    recurrenceExceptions?: string[]; // Array of 'YYYY-MM-DD' strings to skip
    originalDate?: string; // For an instance of a recurring task, the original date it was generated for
    seriesId?: number; // The ID of the parent recurring task if this is an instance
    endDate?: string; // For the series
}

export interface TaskTemplateItem {
    id: string; // Using string for temporary client-side ID
    taskName: string;
    dueDaysAfterStart: number;
    priority: TaskPriority;
    estimatedTime: number; // in minutes
    parentId: string | null;
    defaultAssigneeRoleId: string;
}
export interface TaskTemplate {
    id: number;
    name: string;
    description: string;
    items: TaskTemplateItem[];
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    read: boolean;
    timestamp: string;
    link?: string;
    title?: string;
}

export interface InvoiceLineItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discountRate: number;
    discountAmount: number;
    discountDescription?: string;
    taxRate: number;
    taxAmount: number;
    taxExemptionReason?: string; 
    withholdingCode?: string;    
    description?: string;        
    totalPrice: number; // quantity * unitPrice - discountAmount
    vatIncludedPrice: number; // totalPrice + taxAmount
}

export enum InvoiceStatus {
    Draft = 'Taslak',
    Sent = 'Gönderildi',
    Paid = 'Ödendi',
    Overdue = 'Gecikmiş',
    Archived = 'Arşivlendi'
}

export type InvoiceType = 'Satış' | 'İade' | 'Tevkifat' | 'İstisna' | 'Özel Matrah';
export enum EInvoiceScenario {
    EFatura = 'e-Fatura',
    EArsiv = 'e-Arşiv',
}
export enum EInvoiceProfile {
    Temel = 'Temel',
    Ticari = 'Ticari',
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    customerId: number;
    customerName: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    items: InvoiceLineItem[];
    amountInWords: string;
    // Totals
    subTotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    totalWithholding: number;
    dealId?: number;
    // New fields for Turkish standards
    uuid?: string;
    customizationId: string; // Özelleştirme Numarası
    scenario: EInvoiceScenario;
    invoiceType: InvoiceType;
    invoiceTemplate?: string;
    eInvoiceType?: EInvoiceProfile;
    issueTime: string;
    documentCurrency: 'TRY' | 'USD' | 'EUR';
    exchangeRate?: number;
    isExport?: boolean;
    // Notes
    notes?: string;
    // Order info
    orderNumber?: string;
    orderDate?: string;
    // Dispatch info
    dispatchNumber?: string;
    dispatchDate?: string;
    // Payment info
    paymentDueDate?: string;
    paymentMethod?: string;
    // Return Info
    reason?: string;
    originalInvoiceId?: number;
}

export enum SalesReturnStatus {
    Draft = 'Taslak',
    Approved = 'Onaylandı',
    Processed = 'İşlendi', // e.g. stock returned, credit note issued
}

export interface SalesReturn {
    id: number;
    returnNumber: string;
    customerId: number;
    customerName: string;
    issueDate: string;
    status: SalesReturnStatus;
    items: InvoiceLineItem[]; // Can reuse this
    reason?: string;
    originalInvoiceId?: number;
    // Totals
    subTotal: number;
    totalTax: number;
    grandTotal: number;
}

export enum QuotationStatus {
    Draft = 'Taslak',
    Sent = 'Gönderildi',
    Accepted = 'Kabul Edildi',
    Rejected = 'Reddedildi',
    Expired = 'Süresi Doldu',
}

export interface QuotationLineItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discountRate: number;
    taxRate: number;
    description?: string;
    totalPrice: number; // calculated
}

export interface Quotation {
    id: number;
    quotationNumber: string;
    customerId: number;
    customerName: string;
    dealId?: number;
    issueDate: string;
    expiryDate: string;
    status: QuotationStatus;
    items: QuotationLineItem[];
    notes?: string;
    terms?: string;
    // totals
    subTotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    // related docs
    salesOrderId?: number;
    publicLink?: string;
}

export enum ProductType {
    TicariMal = 'Ticari Mal',
    Hizmet = 'Hizmet',
    Hammadde = 'Hammadde',
    Mamul = 'Mamul',
    Demirbas = 'Demirbaş',
}

export enum EInvoiceType {
    Urun = 'Ürün',
    Hizmet = 'Hizmet',
}

export type Currency = 'TRY' | 'USD' | 'EUR';

export enum Unit {
    Adet = 'Adet',
    Kilo = 'Kg',
    Metre = 'm',
    Litre = 'Lt',
    Paket = 'Paket',
    Saat = 'Saat',
}

export interface ExportInfo {
    gtipNo?: string;
    deliveryTerm?: string;
    shippingMethod?: string;
}

export interface FinancialDetails {
    purchasePrice: number;
    purchaseCurrency: Currency;
    salePrice: number;
    saleCurrency: Currency;
    vatRate: number; // as percentage, e.g., 20
    exemptionCode?: string;
    withholdingCode?: string; // Tevkifat
    stopajRate?: number; // as percentage
}

export interface Product {
    id: number;
    // General Info
    productType: ProductType;
    eInvoiceType: EInvoiceType;
    name: string;
    sku: string; // Stok Kodu
    unit: Unit;
    brand?: string;
    model?: string;
    category: string; // Can be used for grouping
    // Inventory Info
    lowStockThreshold: number;
    trackBy: 'none' | 'serial' | 'batch';
    binLocation?: string;
    // Financial Info
    financials: FinancialDetails;
    // For backwards compatibility
    price: number;
    // Export Info
    exportInfo?: ExportInfo;
    // Notes
    note1?: string;
    note2?: string;
}


export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tags: string[];
  
  accountType: 'Gerçek Kişi' | 'Tüzel Kişi';
  accountCode: string;
  taxId: string;
  taxOffice: string;
  
  address: Address;
  
  iban: string;
  iban2?: string;
  openingBalance: number;
  currency: 'TRY' | 'USD' | 'EUR';
  openingDate: string;

  eInvoiceMailbox?: string;
  eDispatchMailbox?: string;
}

export interface SupplierContact {
    id: number;
    supplierId: number;
    name: string;
    title: string;
    email: string;
    phone: string;
}

export enum PurchaseOrderStatus {
    Draft = 'Taslak',
    Ordered = 'Sipariş Verildi',
    Shipped = 'Kargolandı',
    PartiallyReceived = 'Kısmen Teslim Alındı',
    Received = 'Teslim Alındı',
    Cancelled = 'İptal Edildi',
}

export interface PurchaseOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    receivedQuantity: number;
}

export interface PurchaseOrder {
    id: number;
    poNumber: string;
    supplierId: number;
    supplierName: string;
    orderDate: string;
    expectedDate: string;
    targetWarehouseId: number;
    status: PurchaseOrderStatus;
    items: PurchaseOrderItem[];
    totalAmount: number;
    billId?: number;
    journalEntryId?: number; 
}

export enum LeaveType {
    Annual = 'Yıllık İzin',
    Sick = 'Hastalık İzni',
    Unpaid = 'Ücretsiz İzin',
    Other = 'Diğer',
}

export enum LeaveStatus {
    Pending = 'Beklemede',
    Approved = 'Onaylandı',
    Rejected = 'Reddedildi',
}

export interface LeaveRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
}

export interface BankAccount {
    id: number;
    accountName: string;
    bankName: string;
    accountNumber: string;
    balance: number;
}

export enum TransactionType {
    Income = 'Gelir',
    Expense = 'Gider',
}

export enum TransactionCategory {
    Sales = 'Satış',
    Rent = 'Kira',
    Salaries = 'Maaşlar',
    Utilities = 'Faturalar',
    Marketing = 'Pazarlama',
    Other = 'Diğer',
}

export interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    accountId: number;
    journalEntryId?: number;
}
export interface CalendarEvent {
    id: string;
    type: EventType;
    date: Date;
    endDate?: Date;
    title: string;
    color: string;
    isAllDay: boolean;
    data: any;
    ownerId: number;
}

export type EventType = 'project' | 'deal' | 'invoice' | 'task' | 'appointment';
export interface ReportCardInfo {
    title: string;
    description: string;
    link: string;
    icon: JSX.Element;
}
export enum TicketStatus {
    Open = 'Açık',
    Pending = 'Beklemede',
    Resolved = 'Çözüldü',
    Closed = 'Kapalı',
}

export enum TicketPriority {
    Low = 'Düşük',
    Normal = 'Normal',
    High = 'Yüksek',
    Urgent = 'Acil',
}

export interface SupportTicket {
    id: number;
    ticketNumber: string;
    subject: string;
    description: string;
    customerId: number;
    customerName: string;
    assignedToId: number;
    assignedToName: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdDate: string;
    resolvedDate?: string;
    firstResponseDate?: string;
    attachments: Attachment[];
}
export type Permission =
    | 'dashboard:goruntule' | 'dashboard:duzenle'
    | 'musteri:goruntule' | 'musteri:yonet'
    | 'anlasma:goruntule' | 'anlasma:yonet'
    | 'proje:goruntule' | 'proje:yonet'
    | 'gorev:goruntule' | 'gorev:yonet'
    | 'fatura:goruntule' | 'fatura:yonet'
    | 'takvim:goruntule'
    | 'rapor:goruntule'
    | 'envanter:goruntule' | 'envanter:yonet'
    | 'depo:yonet'
    | 'stok-hareketi:goruntule'
    | 'stok-sayimi:yap'
    | 'satis-siparis:goruntule' | 'satis-siparis:yonet'
    | 'sevkiyat:goruntule' | 'sevkiyat:yonet'
    | 'toplama-listesi:goruntule' | 'toplama-listesi:yonet'
    | 'ik:goruntule' | 'ik:maas-goruntule' | 'ik:izin-yonet' | 'ik:performans-yonet'
    | 'ik:ise-alim-goruntule' | 'ik:ise-alim-yonet'
    | 'ik:oryantasyon-goruntule' | 'ik:oryantasyon-yonet'
    | 'ik:bordro-yonet'
    | 'ik:rapor-goruntule'
    | 'ik:masraf-yonet' | 'ik:varlik-yonet'
    | 'finans:goruntule' | 'finans:yonet'
    | 'destek:goruntule' | 'destek:yonet'
    | 'aktivite:goruntule'
    | 'dokuman:goruntule' | 'dokuman:yonet'
    | 'yorum:yonet'
    | 'kullanici:yonet'
    | 'ayarlar:goruntule' | 'ayarlar:genel-yonet' | 'ayarlar:roller-yonet' | 'ayarlar:guvenlik-yonet'
    | 'ayarlar:muhasebe-yonet' | 'ayarlar:maliyet-merkezi-yonet' | 'ayarlar:vergi-yonet' | 'ayarlar:ik-bordro-yonet'
    | 'muhasebe:goruntule' | 'muhasebe:yonet' | 'muhasebe:mutabakat-yap'
    | 'muhasebe:defteri-kebir-goruntule' | 'muhasebe:bilanco-goruntule' | 'muhasebe:gelir-tablosu-goruntule' | 'muhasebe:nakit-akis-goruntule'
    | 'muhasebe:alacak-yaslandirma-goruntule' | 'muhasebe:kar-zarar-goruntule'
    | 'muhasebe:tekrarlanan-yonet' | 'muhasebe:butce-yonet'
    | 'otomasyon:goruntule' | 'otomasyon:yonet'
    ;

export type EntityType = 'customer' | 'deal' | 'project' | 'task' | 'invoice' | 'product' | 'supplier' | 'purchase_order' | 'employee' | 'ticket' | 'document' | 'user' | 'role' | 'automation' | 'journal_entry' | 'payroll_run' | 'task_template' | 'scheduled_task' | 'sales_order' | 'shipment' | 'work_order' | 'bom' | 'bill' | 'warehouse' | 'inventory_transfer' | 'inventory_adjustment' | 'expense' | 'asset' | 'sales_return' | 'quotation' | 'lead' | 'commission' | 'pick_list';

export enum ActionType {
    CREATED = 'Oluşturuldu',
    UPDATED = 'Güncellendi',
    DELETED = 'Silindi',
    STATUS_CHANGED = 'Durum Değiştirildi',
    COMMENT_ADDED = 'Yorum Eklendi',
    FILE_UPLOADED = 'Dosya Yüklendi',
    USER_LOGIN = 'Giriş Yaptı',
    USER_LOGOUT = 'Çıkış Yaptı',
    PERMISSION_CHANGED = 'İzin Değiştirildi',
    PAYROLL_RUN_CREATED = 'Bordro Oluşturuldu',
    JOURNAL_ENTRY_CREATED = 'Yevmiye Fişi Oluşturuldu',
    JOURNAL_ENTRY_DELETED = 'Yevmiye Fişi Silindi',
    JOURNAL_ENTRY_REVERSED = 'Yevmiye Fişi Ters Kayıt',
    TASK_CREATED = 'Görev Oluşturuldu',
    TASK_CREATED_MULTIPLE = 'Çoklu Görev Oluşturuldu',
    TASK_UPDATED = 'Görev Güncellendi',
    TASK_UPDATED_MULTIPLE = 'Çoklu Görev Güncellendi',
    TASK_DELETED = 'Görev Silindi',
    DELETED_MULTIPLE = 'Çoklu Kayıt Silindi',
    PROJECT_CREATED = 'Proje Oluşturuldu',
    PROJECT_UPDATED = 'Proje Güncellendi',
    PROJECT_DELETED = 'Proje Silindi',
    PAYSLIP_UPDATED = 'Maaş Pusulası Güncellendi',
    TASK_TEMPLATE_CREATED = 'Görev Şablonu Oluşturuldu',
    TASK_TEMPLATE_UPDATED = 'Görev Şablonu Güncellendi',
    TASK_TEMPLATE_DELETED = 'Görev Şablonu Silindi',
    SCHEDULED_TASK_CREATED = 'Planlanmış Görev Oluşturuldu',
    SCHEDULED_TASK_UPDATED = 'Planlanmış Görev Güncellendi',
    SCHEDULED_TASK_DELETED = 'Planlanmış Görev Silindi',
    LEAD_CONVERTED = 'Potansiyel Müşteri Dönüştürüldü',
    MENTIONED_IN_COMMENT = 'Yorumda bahsedildi',
}

export interface ActivityLog {
    id: number;
    timestamp: string;
    userId: number;
    userName: string;
    userAvatar: string;
    actionType: ActionType;
    details: string;
    entityType?: EntityType;
    entityId?: number;
}
export enum DocumentType {
    PDF = 'PDF',
    Word = 'Word',
    Excel = 'Excel',
    Image = 'Resim',
    Other = 'Diğer',
}

export enum SharePermission {
    View = 'Görüntüleme',
    Edit = 'Düzenleme',
}

export interface DocumentShare {
    userId: number;
    permission: SharePermission;
}

export interface Document {
    id: number;
    name: string;
    type: 'folder' | 'file';
    parentId: number | null;
    documentType?: DocumentType;
    fileSize?: number; // in KB
    uploadDate: string;
    uploadedById: number;
    uploadedByName: string;
    relatedEntityType?: 'customer' | 'project' | 'deal';
    relatedEntityId?: number;
    relatedEntityName?: string;
    isStarred?: boolean;
    sharedWith?: DocumentShare[];
}

export type DocumentSortConfig = {
    key: keyof Document;
    direction: 'ascending' | 'descending';
};

export interface WidgetConfig {
    id: string;
    name: string;
    type: 'StatCard' | 'Chart' | 'List';
    defaultW: number;
    defaultH: number;
}
export interface DashboardWidget {
    id: string;
    widgetId: string;
    x?: number;
    y?: number;
    w: number;
    h: number;
}
export interface Comment {
    id: number;
    text: string;
    timestamp: string;
    userId: number;
    userName: string;
    userAvatar: string;
    relatedEntityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order';
    relatedEntityId: number;
}
export enum CommunicationLogType {
    Note = 'Not',
    Call = 'Arama',
    Email = 'E-posta',
    Meeting = 'Toplantı',
}
export interface CommunicationLog {
    id: number;
    customerId: number;
    type: CommunicationLogType;
    content: string;
    timestamp: string;
    userId: number;
    userName: string;
}
export interface CustomFieldDefinition {
    id: number;
    name: string;
    type: CustomFieldType;
    appliesTo: 'customer' | 'deal' | 'project';
    options?: string[];
}
export enum CustomFieldType {
    Text = 'Metin',
    Number = 'Sayı',
    Date = 'Tarih',
    Dropdown = 'Açılır Menü',
    Checkbox = 'Onay Kutusu',
}
export enum SalesActivityType {
    Call = 'Telefon Görüşmesi',
    Meeting = 'Toplantı',
    Email = 'E-posta',
    System = 'Sistem',
}
export interface SalesActivity {
    id: number;
    dealId: number;
    type: SalesActivityType;
    notes: string;
    timestamp: string;
    userId: number;
    userName: string;
    userAvatar: string;
}
export interface Goal {
    id: string;
    description: string;
    target: string;
    status: 'Yolda' | 'Tamamlandı' | 'İlgi Gerekiyor' | 'Henüz Başlamadı';
}

export interface PeerFeedback {
    id: string;
    reviewerId: number;
    reviewerName: string;
    strengths: string;
    areasForImprovement: string;
}

export interface PerformanceReview {
    id: number;
    employeeId: number;
    employeeName: string;
    reviewerId: number;
    reviewerName: string;
    reviewDate: string;
    periodStartDate: string;
    periodEndDate: string;
    overallRating: number; // 1-5
    strengths: string;
    areasForImprovement: string;
    goalsForNextPeriod: string;
    status: 'Beklemede' | 'Tamamlandı';
    goals: Goal[];
    peerFeedback: PeerFeedback[];
}
export enum JobOpeningStatus {
    Open = 'Açık',
    Closed = 'Kapalı',
}
export interface JobOpening {
    id: number;
    title: string;
    department: string;
    description: string;
    requirements: string;
    status: JobOpeningStatus;
}
export enum CandidateStage {
    NewApplication = 'Yeni Başvuru',
    Screening = 'İnceleme',
    Interview = 'Mülakat',
    Offer = 'Teklif',
    Hired = 'İşe Alındı',
    Rejected = 'Reddedildi',
}
export interface Candidate {
    id: number;
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    avatar: string;
    applicationDate: string;
    jobOpeningId: number;
    stage: CandidateStage;
    notes?: string;
}
export enum OnboardingType {
    Onboarding = 'İşe Alım',
    Offboarding = 'İşten Çıkış',
}
export enum AssignedDepartment {
    HR = 'İK',
    IT = 'IT',
    Finance = 'Finans',
    Manager = 'Yönetici',
}
export interface OnboardingTemplateItem {
    taskName: string;
    assignedTo: AssignedDepartment;
}
export interface OnboardingTemplate {
    id: number;
    name: string;
    type: OnboardingType;
    items: OnboardingTemplateItem[];
}
export enum OnboardingWorkflowStatus {
    InProgress = 'Devam Ediyor',
    Completed = 'Tamamlandı',
}
export interface OnboardingWorkflow {
    id: number;
    employeeId: number;
    employeeName: string;
    templateId: number;
    templateName: string;
    type: OnboardingType;
    startDate: string;
    status: OnboardingWorkflowStatus;
    itemsStatus: boolean[];
}

// HR - Employee and related enums
export type Cinsiyet = 'Erkek' | 'Kadın';
export type CalismaStatusu = 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Geçici' | 'Stajyer';
export type SigortaKolu = '4A' | '4B' | '4C';
export type MedeniDurum = 'Bekar' | 'Evli';
export type EgitimSeviyesi = 'İlköğretim' | 'Lise' | 'Ön Lisans' | 'Lisans' | 'Yüksek Lisans' | 'Doktora';

export interface Employee {
    id: number;
    employeeId: string;
    name: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    hireDate: string;
    salary: number;
    avatar: string;
    role: string;
    managerId?: number;
    contactId?: number;
    tcKimlikNo?: string;
    sgkSicilNo?: string;
    dogumTarihi?: string;
    cinsiyet?: Cinsiyet;
    medeniDurum?: MedeniDurum;
    bakmaklaYukumluKisiSayisi?: number;
    esiCalisiyorMu?: boolean;
    adres?: string;
    uyruk?: string;
    egitimSeviyesi?: EgitimSeviyesi;
    calismaStatusu?: CalismaStatusu;
    sigortaKolu?: SigortaKolu;
    engellilikOrani?: number;
    vergiIndirimiVarMi?: boolean;
    meslekKodu?: string;
    meslekAdi?: string;
    istenCikisTarihi?: string;
    istenCikisNedeni?: string;
    istenCikisKodu?: string;
    besKesintisiVarMi?: boolean;
    tesviktenYararlaniyorMu?: boolean;
    tesvikKodu?: string;
}


// Settings
export interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
}

export interface BrandingSettings {
    logoUrl: string;
    primaryColor: string;
    fontSize: 'sm' | 'md' | 'lg';
}

export interface SecuritySettings {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumber: boolean;
    sessionTimeout: number; // in minutes
}

export interface Role {
    id: string;
    name: string;
    isSystemRole: boolean;
}

export interface CountersSettings {
    prefix: string;
    nextNumber: number;
    padding: number;
}


// Accounting
export enum AccountType {
    Asset = 'Varlık',
    Liability = 'Yükümlülük',
    Equity = 'Özkaynak',
    Revenue = 'Gelir',
    Expense = 'Gider',
}

export interface Account {
    id: number;
    accountNumber: string;
    name: string;
    type: AccountType;
    balance: number;
    parentId?: number;
    defaultTaxRateId?: number;
}

export enum JournalEntryType {
    Mahsup = 'Mahsup Fişi',
    Tahsil = 'Tahsil Fişi',
    Tediye = 'Tediye Fişi',
}

export enum JournalEntryStatus {
    Draft = 'Taslak',
    Posted = 'Kaydedildi',
}

export interface JournalEntryItem {
    accountId: number;
    debit: number;
    credit: number;
    description?: string;
    costCenterId?: number;
    documentDate?: string;
    documentNumber?: string;
}

export interface JournalEntry {
    id: number;
    entryNumber: string;
    date: string;
    memo: string;
    type: JournalEntryType;
    status: JournalEntryStatus;
    items: JournalEntryItem[];
    documentNumber?: string;
}

export enum RecurringFrequency {
    Daily = 'Günlük',
    Weekly = 'Haftalık',
    Monthly = 'Aylık',
    Yearly = 'Yıllık',
}

export interface RecurringJournalEntry {
    id: number;
    name: string;
    frequency: RecurringFrequency;
    startDate: string;
    endDate?: string;
    nextDate: string;
    memoTemplate: string;
    items: Omit<JournalEntryItem, 'description'>[];
    totalAmount: number;
}

export interface BudgetItem {
    accountId: number;
    accountName: string; 
    amount: number;
}

export interface Budget {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    items: BudgetItem[];
}

export interface CostCenter {
    id: number;
    name: string;
}

export enum BillStatus {
    PendingApproval = 'Onay Bekliyor',
    Approved = 'Onaylandı',
    Rejected = 'Reddedildi',
    Paid = 'Ödendi',
    Archived = 'Arşivlendi',
}

export interface Bill {
    id: number;
    supplierId: number;
    supplierName: string;
    billNumber: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    status: BillStatus;
    purchaseOrderId?: number;
    journalEntryId?: number;
}

export interface TaxRate {
    id: number;
    name: string;
    rate: number; // e.g., 0.18 for 18%
}

// Automation
export enum AutomationTriggerType {
    DEAL_STAGE_CHANGED = 'Anlaşma Aşaması Değiştiğinde',
}

export enum AutomationActionType {
    WEBHOOK = 'Webhook Gönder',
    CREATE_PROJECT = 'Proje Oluştur',
    CREATE_TASK = 'Görev Oluştur',
    UPDATE_CUSTOMER_STATUS = 'Müşteri Durumunu Güncelle',
}

export interface Automation {
    id: number;
    name: string;
    triggerType: AutomationTriggerType;
    triggerConfig: { stageId: DealStage };
    actions: AutomationAction[];
    active: boolean;
    lastRun?: string;
}

export type AutomationAction =
    | { type: AutomationActionType.WEBHOOK; config: { url: string; } }
    | { type: AutomationActionType.CREATE_PROJECT; config: { projectNameTemplate: string; } }
    | { type: AutomationActionType.CREATE_TASK; config: { title: string; assignedTo: 'deal_owner' | 'project_manager'; dueDays: number; } }
    | { type: AutomationActionType.UPDATE_CUSTOMER_STATUS; config: { newStatus: string; } };

export interface AutomationLog {
    id: number;
    automationId: number;
    timestamp: string;
    status: 'başarılı' | 'başarısız';
    requestPayload: string; // JSON string
    responseBody?: string; // JSON string
    error?: string;
}

// Inventory
export interface Warehouse {
    id: number;
    name: string;
    location: string;
    isDefault?: boolean;
}

export enum StockMovementType {
    PurchaseReceive = 'Satın Alma Mal Kabul',
    SalesShipment = 'Satış Sevkiyatı',
    TransferOut = 'Transfer Çıkışı',
    TransferIn = 'Transfer Girişi',
    Adjustment = 'Stok Düzeltmesi',
    ManufacturingConsume = 'Üretim Sarfiyatı',
    ManufacturingProduce = 'Üretimden Giriş',
}

export interface StockMovement {
    id: number;
    timestamp: string;
    productId: number;
    productName: string;
    warehouseId: number;
    warehouseName: string;
    type: StockMovementType;
    quantityChange: number;
    notes?: string;
    relatedDocumentId?: number; // PO id, SO id, etc.
}

export interface InventoryTransferItem {
    productId: number;
    quantity: number;
}

export enum InventoryTransferStatus {
    Pending = 'Beklemede',
    Shipped = 'Gönderildi',
    Received = 'Teslim Alındı',
}

export interface InventoryTransfer {
    id: number;
    transferNumber: string;
    date: string;
    fromWarehouseId: number;
    toWarehouseId: number;
    items: InventoryTransferItem[];
    status: InventoryTransferStatus;
    notes?: string;
}

export enum AdjustmentReason {
    Stocktake = 'Stok Sayımı',
    Damaged = 'Hasarlı Ürün',
    Lost = 'Kayıp',
    Found = 'Bulunan',
    Other = 'Diğer',
}

export interface InventoryAdjustmentItem {
    productId: number;
    expectedQuantity: number;
    countedQuantity: number;
}

export enum InventoryAdjustmentStatus {
    Draft = 'Taslak',
    Completed = 'Tamamlandı',
}

export interface InventoryAdjustment {
    id: number;
    adjustmentNumber: string;
    date: string;
    warehouseId: number;
    reason: AdjustmentReason;
    items: InventoryAdjustmentItem[];
    status: InventoryAdjustmentStatus;
    notes?: string;
}

export enum SalesOrderStatus {
    OnayBekliyor = 'Onay Bekliyor',
    Onaylandı = 'Onaylandı',
    StokBekleniyor = 'Stok Bekleniyor',
    UretimBekleniyor = 'Üretim Bekleniyor',
    SevkeHazır = 'Sevke Hazır',
    KısmenSevkEdildi = 'Kısmen Sevk Edildi',
    TamamenSevkEdildi = 'Tamamen Sevk Edildi',
    Faturalandı = 'Faturalandı',
    İptalEdildi = 'İptal Edildi'
}

export interface SalesOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    discountRate: number;
    taxRate: number;
    committedStockItemIds: number[];
    shippedQuantity: number;
}

export interface SalesOrder {
    id: number;
    orderNumber: string;
    customerId: number;
    customerName: string;
    orderDate: string;
    items: SalesOrderItem[];
    status: SalesOrderStatus;
    shippingAddress: Address;
    billingAddress: Address;
    notes?: string;
    subTotal: number;
    totalDiscount: number;
    totalTax: number;
    shippingCost: number;
    grandTotal: number;
    dealId?: number;
    invoiceId?: number;
    shipmentIds?: number[];
    pickListIds?: number[];
    workOrderIds?: number[];
}

export enum ShipmentStatus {
    ReadyToShip = 'Sevke Hazır',
    Shipped = 'Sevk Edildi',
    Cancelled = 'İptal Edildi'
}

export interface ShipmentItem {
    productId: number;
    quantity: number;
    stockItemIds: number[];
}

export interface Shipment {
    id: number;
    shipmentNumber: string;
    salesOrderId: number;
    salesOrderNumber: string;
    customerId: number;
    customerName: string;
    shipmentDate: string;
    status: ShipmentStatus;
    items: ShipmentItem[];
    trackingNumber?: string;
}

export enum StockItemStatus {
    Available = 'Kullanılabilir',
    Committed = 'Ayrılmış',
    Shipped = 'Sevk Edildi',
    Consumed = 'Tüketildi',
    Damaged = 'Hasarlı',
}

export interface StockItem {
    id: number;
    productId: number;
    warehouseId: number;
    status: StockItemStatus;
    quantity?: number; // for batch tracked
    serialNumber?: string;
    batchNumber?: string;
    expiryDate?: string;
}

export interface PickListItem {
    productId: number;
    productName: string;
    productSku: string;
    quantityToPick: number;
    binLocation?: string;
    serialNumbers?: string[];
    batchNumber?: string;
    relatedShipmentId: number;
}

export interface PickList {
    id: number;
    pickListNumber: string;
    creationDate: string;
    status: 'Beklemede' | 'Toplanıyor' | 'Toplandı';
    assignedToId?: number;
    items: PickListItem[];
    relatedShipmentIds: number[];
}

export interface BillOfMaterials {
    id: number;
    productId: number;
    productName: string;
    items: BomItem[];
}

export interface BomItem {
    productId: number;
    productName: string;
    quantity: number;
}

export enum WorkOrderStatus {
    Taslak = 'Taslak',
    Onaylandı = 'Onaylandı',
    Uretimde = 'Üretimde',
    Tamamlandı = 'Tamamlandı',
    IptalEdildi = 'İptal Edildi',
}

export interface WorkOrder {
    id: number;
    workOrderNumber: string;
    productId: number;
    productName: string;
    quantityToProduce: number;
    bomId: number;
    status: WorkOrderStatus;
    creationDate: string;
    startDate?: string;
    completionDate?: string;
    notes?: string;
    salesOrderId?: number;
    componentCommits?: { productId: number, stockItemIds: number[] }[];
}

// HR Self-Service Types
export enum ExpenseStatus {
    Pending = 'Beklemede',
    Approved = 'Onaylandı',
    Rejected = 'Reddedildi',
    Paid = 'Ödendi',
}

export interface Expense {
    id: number;
    employeeId: number;
    employeeName: string;
    submissionDate: string;
    description: string;
    category: 'Seyahat' | 'Yemek' | 'Ofis Malzemeleri' | 'Diğer';
    amount: number;
    status: ExpenseStatus;
    attachments: Attachment[];
}

export enum AssetStatus {
    InUse = 'Kullanımda',
    InStorage = 'Depoda',
    Retired = 'Emekli',
}

export interface Asset {
    id: number;
    name: string;
    category: 'Laptop' | 'Telefon' | 'Monitör' | 'Araç' | 'Diğer';
    serialNumber: string;
    purchaseDate: string;
    assignedToId?: number;
    assignmentDate?: string;
    status: AssetStatus;
}

export interface HrParameters {
    MINIMUM_WAGE_GROSS: number;
    SGK_CEILING: number;
    EMPLOYEE_SGK_RATE: number;
    EMPLOYEE_UNEMPLOYMENT_RATE: number;
    EMPLOYER_SGK_RATE: number;
    EMPLOYER_UNEMPLOYMENT_RATE: number;
    EMPLOYER_SGK_INCENTIVE_RATE: number;
    STAMP_DUTY_RATE: number;
    INCOME_TAX_EXEMPTION_BASE: number;
    INCOME_TAX_BRACKETS: { limit: number; rate: number }[];
    SEVERANCE_CEILING: number;
}

export enum LeadStatus {
    New = 'Yeni',
    Contacted = 'İletişim Kuruldu',
    Qualified = 'Nitelikli',
    Unqualified = 'Niteliksiz',
}

export interface Lead {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: LeadStatus;
    source: string;
    assignedToId: number;
}

export interface CommissionRecord {
    id: number;
    employeeId: number;
    dealId: number;
    dealValue: number;
    commissionAmount: number;
    earnedDate: string;
}

export interface SalesAnalyticsData {
    weightedPipelineValue: number;
    totalPipelineValue: number;
    winRate: number;
    avgSalesCycle: number; // in days
    topPerformers: { name: string; value: number }[];
}


export interface AppContextType {
    customers: (Customer & { assignedToName: string })[];
    addCustomer: (customerData: Omit<Customer, 'id' | 'avatar'>) => (Customer & { assignedToName: string });
    updateCustomer: (customer: Customer) => (Customer & { assignedToName: string });
    updateCustomerStatus: (customerId: number, newStatus: string) => (Customer & { assignedToName: string }) | undefined;
    bulkUpdateCustomerStatus: (customerIds: number[], newStatus: string) => void;
    assignCustomersToEmployee: (customerIds: number[], employeeId: number) => void;
    addTagsToCustomers: (customerIds: number[], tags: string[]) => void;
    deleteCustomer: (id: number) => void;
    deleteMultipleCustomers: (ids: number[]) => void;
    importCustomers: (customersData: Omit<Customer, 'id' | 'avatar'>[]) => (Customer & { assignedToName: string })[];
    contacts: Contact[];
    addContact: (contactData: Omit<Contact, 'id'>) => Contact;
    updateContact: (contact: Contact) => Contact | undefined;
    deleteContact: (contactId: number) => void;
    communicationLogs: CommunicationLog[];
    addCommunicationLog: (customerId: number, type: CommunicationLogType, content: string) => CommunicationLog;
    updateCommunicationLog: (log: CommunicationLog) => CommunicationLog | undefined;
    deleteCommunicationLog: (logId: number) => void;
    savedViews: SavedView[];
    addSavedView: (name: string, filters: SavedView['filters'], sortConfig: SortConfig) => SavedView;
    deleteSavedView: (id: number) => void;
    loadSavedView: (id: number) => SavedView | undefined;
    summarizeActivityFeed: (customerId: number) => Promise<string>;
    
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
    activityLogs: ActivityLog[];
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
    counters: CountersSettings;
    cartItems: CartItem[];
    warehouses: Warehouse[];
    stockMovements: StockMovement[];
    inventoryTransfers: InventoryTransfer[];
    inventoryAdjustments: InventoryAdjustment[];
    salesOrders: SalesOrder[];
    shipments: Shipment[];
    stockItems: StockItem[];
    pickLists: PickList[];
    boms: BillOfMaterials[];
    workOrders: WorkOrder[];
    accounts: Account[];
    journalEntries: JournalEntry[];
    recurringJournalEntries: RecurringJournalEntry[];
    budgets: Budget[];
    costCenters: CostCenter[];
    accountingLockDate: string | null;
    currentUser: Employee;
    expenses: Expense[];
    assets: Asset[];
    hrParameters: HrParameters;
    salesReturns: SalesReturn[];
    addSalesReturn: (returnData: Omit<SalesReturn, 'id' | 'returnNumber' | 'customerName'>) => SalesReturn;
    updateSalesReturn: (salesReturn: SalesReturn) => SalesReturn | undefined;
    deleteSalesReturn: (id: number) => void;
    quotations: Quotation[];
    addQuotation: (quotationData: Omit<Quotation, 'id' | 'quotationNumber' | 'customerName'>) => Quotation;
    updateQuotation: (quotation: Quotation) => Quotation | undefined;
    deleteQuotation: (id: number) => void;
    convertQuotationToSalesOrder: (quotationId: number) => SalesOrder | undefined;
    leads: Lead[];
    addLead: (leadData: Omit<Lead, 'id'>) => Lead;
    convertLead: (leadId: number) => { customer: Customer; contact: Contact; deal: Deal } | undefined;
    commissionRecords: CommissionRecord[];
    setCurrentUser: (user: Employee) => void;
    isManager: (employeeId: number) => boolean;
    itemCount: number;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateCartQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    createSalesOrderFromCart: (customerId: number) => SalesOrder | undefined;
    addScheduledTask: (schedule: Omit<ScheduledTask, "id">) => ScheduledTask;
    updateScheduledTask: (schedule: ScheduledTask) => ScheduledTask | undefined;
    deleteScheduledTask: (scheduleId: number) => void;
    runScheduledTasksCheck: () => void;
    addTaskTemplate: (templateData: Omit<TaskTemplate, "id">) => TaskTemplate;
    updateTaskTemplate: (template: TaskTemplate) => TaskTemplate | undefined;
    deleteTaskTemplate: (templateId: number) => void;
    addBom: (bomData: Omit<BillOfMaterials, "id" | "productName">) => BillOfMaterials | undefined;
    updateBom: (bom: BillOfMaterials) => BillOfMaterials | undefined;
    addWorkOrder: (woData: Omit<WorkOrder, "id" | "workOrderNumber" | "productName">) => WorkOrder | undefined;
    updateWorkOrder: (wo: WorkOrder) => WorkOrder | undefined;
    updateWorkOrderStatus: (workOrderId: number, newStatus: WorkOrderStatus) => void;
    getProductStockInfo: (productId: number) => { physical: number, committed: number, available: number };
    getProductStockByWarehouse: (productId: number, warehouseId: number) => { physical: number, committed: number, available: number };
    addSalesOrder: (orderData: Omit<SalesOrder, "id" | "orderNumber" | "customerName">) => SalesOrder;
    updateSalesOrder: (order: SalesOrder) => SalesOrder | undefined;
    deleteSalesOrder: (orderId: number) => void;
    updateSalesOrderStatus: (orderId: number, newStatus: SalesOrderStatus) => void;
    convertOrderToInvoice: (orderId: number) => Invoice | undefined;
    confirmPickList: (pickListId: number) => void;
    addProduct: (productData: Omit<Product, "id">, initialStock?: { warehouseId: number, quantity: number }) => Product;
    updateProduct: (product: Product) => Product | undefined;
    deleteProduct: (id: number) => void;
    addWarehouse: (warehouseData: Omit<Warehouse, "id">) => Warehouse;
    updateWarehouse: (warehouse: Warehouse) => Warehouse | undefined;
    deleteWarehouse: (id: number) => void;
    addInventoryTransfer: (transferData: Omit<InventoryTransfer, "id" | "transferNumber" | "status">) => InventoryTransfer | undefined;
    addInventoryAdjustment: (adjustmentData: Omit<InventoryAdjustment, "id" | "adjustmentNumber" | "status">) => InventoryAdjustment | undefined;
    receivePurchaseOrderItems: (poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string, expiry: string })[] }[], warehouseId: number) => void;
    addPurchaseOrder: (poData: Omit<PurchaseOrder, "id" | "poNumber" | "supplierName">) => PurchaseOrder;
    updatePurchaseOrder: (po: PurchaseOrder) => PurchaseOrder | undefined;
    updatePurchaseOrderStatus: (poId: number, status: PurchaseOrderStatus) => void;
    createBillFromPO: (poId: number) => Bill | undefined;
    allocateStockToSalesOrder: (soId: number, allocations: { [productId: string]: number[] }) => void;
    createShipmentFromSalesOrder: (soId: number, itemsToShip: ShipmentItem[]) => Shipment | undefined;
    createPickList: (shipmentIds: number[]) => PickList | undefined;
    addAutomation: (auto: Omit<Automation, "id" | "lastRun">) => Automation;
    updateAutomation: (auto: Automation) => Automation | undefined;
    deleteAutomation: (autoId: number) => void;
    updateSystemList: (key: SystemListKey, items: SystemListItem[]) => void;
    updateEmailTemplate: (template: EmailTemplate) => void;
    addPriceList: (list: Omit<PriceList, "id">) => PriceList;
    updatePriceList: (list: PriceList) => PriceList | undefined;
    deletePriceList: (listId: number) => void;
    updatePriceListItems: (listId: number, items: PriceListItem[]) => void;
    addTaxRate: (rate: Omit<TaxRate, "id">) => TaxRate;
    updateTaxRate: (rate: TaxRate) => TaxRate | undefined;
    deleteTaxRate: (rateId: number) => void;
    addAccount: (account: Omit<Account, "id">) => Account;
    updateAccount: (account: Account) => Account | undefined;
    addJournalEntry: (entryData: Omit<JournalEntry, 'id' | 'entryNumber'>) => JournalEntry;
    updateJournalEntry: (entry: JournalEntry) => JournalEntry | undefined;
    deleteJournalEntry: (entryId: number) => void;
    reverseJournalEntry: (entryId: number) => JournalEntry | undefined;
    addRecurringJournalEntry: (template: Omit<RecurringJournalEntry, 'id'>) => RecurringJournalEntry;
    updateRecurringJournalEntry: (template: RecurringJournalEntry) => RecurringJournalEntry | undefined;
    deleteRecurringJournalEntry: (templateId: number) => void;
    generateEntryFromRecurringTemplate: (templateId: number) => Promise<JournalEntry | undefined>;
    addBudget: (budget: Omit<Budget, 'id'>) => Budget;
    updateBudget: (budget: Budget) => Budget | undefined;
    deleteBudget: (budgetId: number) => void;
    addCostCenter: (costCenter: Omit<CostCenter, 'id'>) => CostCenter;
    updateCostCenter: (costCenter: CostCenter) => CostCenter | undefined;
    deleteCostCenter: (costCenterId: number) => void;
    setDashboardLayout: (layout: DashboardWidget[]) => void;
    addWidgetToDashboard: (widgetId: string) => void;
    removeWidgetFromDashboard: (id: string) => void;
    hasPermission: (permission: Permission) => boolean;
    addDeal: (dealData: Omit<Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'>) => Deal;
    updateDeal: (deal: Deal) => Deal | undefined;
    updateDealStage: (dealId: number, newStage: DealStage) => void;
    bulkUpdateDealStage: (dealIds: number[], newStage: DealStage, reason?: string) => void;
    updateDealWinLossReason: (dealId: number, stage: DealStage.Won | DealStage.Lost, reason: string) => void;
    winDeal: (deal: Deal, winReason: string, createProject: boolean, useTaskTemplate?: boolean, taskTemplateId?: number) => Promise<void>;
    deleteDeal: (id: number) => void;
    deleteMultipleDeals: (dealIds: number[]) => void;
    addProject: (projectData: Omit<Project, 'id' | 'client'>, taskTemplateId?: number) => Project;
    updateProject: (project: Project) => Project | undefined;
    deleteProject: (id: number) => void;
    addTask: (taskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles?: string[]) => Task;
    updateTask: (task: Task, options?: { silent?: boolean }) => Task | undefined;
    updateRecurringTask: (task: Task, updateData: Partial<Task>, scope: 'this' | 'all', options?: { silent?: boolean }) => void;
    deleteTask: (id: number) => void;
    updateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
    addSubtask: (parentId: number, title: string) => Task | undefined;
    addTaskDependency: (taskId: number, dependsOnId: number) => void;
    removeTaskDependency: (taskId: number, dependsOnId: number) => void;
    deleteMultipleTasks: (taskIds: number[]) => void;
    logTimeOnTask: (taskId: number, minutes: number) => void;
    toggleTaskStar: (taskId: number) => void;
    createTasksFromTemplate: (templateId: number, startDate: string, relatedEntityType?: 'customer' | 'project' | 'deal', relatedEntityId?: number) => void;
    addAttachmentToTask: (taskId: number, attachment: Attachment) => void;
    deleteAttachmentFromTask: (taskId: number, attachmentId: number) => void;
    addInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>) => Invoice;
    updateInvoice: (invoice: Invoice) => Invoice | undefined;
    bulkUpdateInvoiceStatus: (invoiceIds: number[], newStatus: InvoiceStatus) => void;
    deleteInvoice: (id: number) => void;
    addBill: (bill: Omit<Bill, 'id' | 'billNumber' | 'supplierName'>) => Bill;
    updateBill: (bill: Bill) => Bill | undefined;
    bulkUpdateBillStatus: (billIds: number[], newStatus: BillStatus) => void;
    addSupplier: (supplierData: Omit<Supplier, "id" | "avatar">) => Supplier;
    updateSupplier: (supplier: Supplier) => Supplier | undefined;
    deleteSupplier: (id: number) => void;
    deletePurchaseOrder: (id: number) => void;
    addEmployee: (employeeData: Omit<Employee, "id" | "avatar" | "employeeId">) => Employee;
    updateEmployee: (employee: Employee) => Employee | undefined;
    deleteEmployee: (id: number) => void;
    addLeaveRequest: (requestData: Omit<LeaveRequest, "id" | "employeeName" | "status">) => LeaveRequest;
    updateLeaveRequestStatus: (requestId: number, newStatus: LeaveStatus) => void;
    addBankAccount: (accountData: Omit<BankAccount, "id">) => BankAccount;
    updateBankAccount: (account: BankAccount) => BankAccount | undefined;
    deleteBankAccount: (id: number) => void;
    addTransaction: (transactionData: Omit<Transaction, "id">) => Transaction;
    updateTransaction: (transaction: Transaction) => Transaction | undefined;
    deleteTransaction: (id: number) => void;
    addTicket: (ticketData: Omit<SupportTicket, "id" | "ticketNumber" | "customerName" | "assignedToName" | "createdDate">) => SupportTicket;
    updateTicket: (ticket: SupportTicket) => SupportTicket | undefined;
    deleteTicket: (id: number) => void;
    addDocument: (docData: Omit<Document, "id" | "uploadedByName">) => Document;
    renameDocument: (docId: number, newName: string) => void;
    deleteDocument: (id: number) => void;
    deleteMultipleDocuments: (ids: number[]) => void;
    addFolder: (folderName: string, parentId: number | null) => Document;
    moveDocuments: (docIds: number[], targetFolderId: number | null) => void;
    toggleDocumentStar: (docId: number) => void;
    shareDocument: (docId: number, shares: DocumentShare[]) => void;
    addComment: (text: string, entityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order', entityId: number) => Comment;
    updateComment: (comment: Comment) => Comment | undefined;
    deleteComment: (commentId: number) => void;
    addSalesActivity: (activityData: Omit<SalesActivity, "id" | "userName" | "userAvatar" | "timestamp">) => SalesActivity;
    addPerformanceReview: (reviewData: Omit<PerformanceReview, "id" | "employeeName" | "reviewerName">) => PerformanceReview;
    updatePerformanceReview: (review: PerformanceReview) => PerformanceReview | undefined;
    addJobOpening: (jobData: Omit<JobOpening, "id">) => JobOpening;
    updateJobOpening: (job: JobOpening) => JobOpening | undefined;
    addCandidate: (candidateData: Omit<Candidate, "id">) => Candidate;
    updateCandidate: (candidate: Candidate) => Candidate | undefined;
    updateCandidateStage: (candidateId: number, newStage: CandidateStage) => void;
    addOnboardingTemplate: (templateData: Omit<OnboardingTemplate, "id">) => OnboardingTemplate;
    updateOnboardingTemplate: (template: OnboardingTemplate) => OnboardingTemplate | undefined;
    startOnboardingWorkflow: (data: { employeeId: number, templateId: number }) => OnboardingWorkflow | undefined;
    updateOnboardingWorkflowStatus: (workflowId: number, itemIndex: number, isCompleted: boolean) => void;
    addPayrollRun: (payPeriod: string) => PayrollRun | undefined;
    updatePayrollRunStatus: (runId: number, status: PayrollRun['status'], journalEntryId?: number) => void;
    postPayrollRunToJournal: (runId: number) => void;
    exportPayrollRunToAphbXml: (runId: number) => void;
    updatePayslip: (payslip: Partial<Payslip> & { id: number; }) => void;
    calculateTerminationPayments: (employeeId: number, terminationDate: string, additionalGrossPay: number, additionalBonuses: number, usedAnnualLeave: number) => SeveranceCalculationResult | null;
    calculateAnnualLeaveBalance: (employeeId: number) => { entitled: number; used: number; balance: number };
    calculatePayrollCost: (grossSalary: number) => PayrollSimulationResult;
    updateCompanyInfo: (info: CompanyInfo) => void;
    updateBrandingSettings: (settings: BrandingSettings) => void;
    updateSecuritySettings: (settings: SecuritySettings) => void;
    updateCounters: (settings: CountersSettings) => void;
    addRole: (roleData: Omit<Role, 'id' | 'isSystemRole'>, cloneFromRoleId?: string) => Role;
    updateRolePermissions: (roleId: string, permissions: Permission[]) => void;
    deleteRole: (roleId: string) => void;
    addCustomField: (fieldData: Omit<CustomFieldDefinition, 'id'>) => CustomFieldDefinition;
    updateCustomField: (field: CustomFieldDefinition) => CustomFieldDefinition | undefined;
    deleteCustomField: (id: number) => void;
    markNotificationAsRead: (id: number) => void;
    clearAllNotifications: () => void;
    deleteNotification: (id: number) => void;
    deleteAllNotifications: () => void;
    logActivity: (actionType: ActionType, details: string, entityType?: EntityType, entityId?: number) => void;
    updateAccountingLockDate: (date: string | null) => void;
    addStockMovement: (productId: number, warehouseId: number, type: StockMovementType, quantityChange: number, notes?: string, relatedDocumentId?: number) => void;
    addExpense: (expenseData: Omit<Expense, 'id' | 'employeeName' | 'status' | 'employeeId'>) => Expense;
    updateExpenseStatus: (expenseId: number, status: ExpenseStatus) => void;
    addAsset: (assetData: Omit<Asset, 'id'>) => Asset;
    updateAsset: (asset: Asset) => Asset | undefined;
    updateHrParameters: (params: HrParameters) => void;
    isCommandPaletteOpen: boolean;
    setIsCommandPaletteOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;

    // Centralized Modal Management
    isCustomerFormOpen: boolean;
    setIsCustomerFormOpen: (isOpen: boolean, customer?: Customer | null) => void;
    editingCustomer: Customer | null;
    
    isDealFormOpen: boolean;
    setIsDealFormOpen: (isOpen: boolean, deal?: Deal | null, prefilled?: Partial<Deal>) => void;
    editingDeal: Deal | null;
    prefilledDealData: Partial<Deal> | null;
    
    isTaskFormOpen: boolean;
    setIsTaskFormOpen: (isOpen: boolean, task?: Task | null, prefilled?: Partial<Task>) => void;
    editingTask: Task | null;
    prefilledTaskData: Partial<Task> | null;
    
    isProjectFormOpen: boolean;
    setIsProjectFormOpen: (isOpen: boolean, project?: Project | null, prefilled?: Partial<Project>) => void;
    editingProject: Project | null;
    prefilledProjectData: Partial<Project> | null;

    isTicketFormOpen: boolean;
    setIsTicketFormOpen: (isOpen: boolean, ticket?: SupportTicket | null, prefilled?: Partial<SupportTicket>) => void;
    editingTicket: SupportTicket | null;
    prefilledTicketData: Partial<SupportTicket> | null;

    isSalesOrderFormOpen: boolean;
    setIsSalesOrderFormOpen: (isOpen: boolean, order?: SalesOrder | null, prefilled?: Partial<SalesOrder>) => void;
    editingSalesOrder: SalesOrder | null;
    prefilledSalesOrderData: Partial<SalesOrder> | null;

    isLogModalOpen: boolean;
    setIsLogModalOpen: (isOpen: boolean, customerId?: number | null) => void;
    logModalCustomerId: number | null;
}
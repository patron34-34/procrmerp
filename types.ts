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
  filters: { status: string; industry: string; assignedToId: string; leadSource: string; };
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

export type EntityType = 'customer' | 'deal' | 'project' | 'task' | 'invoice' | 'product' | 'supplier' | 'purchase_order' | 'employee' | 'ticket' | 'document' | 'user' | 'role' | 'automation' | 'journal_entry' | 'payroll_run' | 'task_template' | 'scheduled_task' | 'sales_order' | 'shipment' | 'work_order' | 'bom' | 'bill' | 'warehouse' | 'inventory_transfer' | 'inventory_adjustment' | 'expense' | 'asset' | 'sales_return' | 'quotation' | 'lead' | 'commission';

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
    TASK_UPDATED = 'Görev Güncellendi',
    TASK_UPDATED_MULTIPLE = 'Çoklu Görev Güncellendi',
    TASK_DELETED = 'Görev Silindi',
    TASK_DELETED_MULTIPLE = 'Çoklu Görev Silindi',
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
    Payable = 'Ödenecek',
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

// Add ApiService to AppContextType
import { ApiService } from '../services/api';

export interface AppContextType {
    api: ApiService;
    customers: (Customer & { assignedToName: string })[];
    addCustomer: (customerData: Omit<Customer, 'id' | 'avatar'>) => Customer;
    updateCustomer: (customer: Customer) => Customer;
    updateCustomerStatus: (customerId: number, newStatus: string) => Customer | undefined;
    bulkUpdateCustomerStatus: (customerIds: number[], newStatus: string) => void;
    assignCustomersToEmployee: (customerIds: number[], employeeId: number) => void;
    addTagsToCustomers: (customerIds: number[], tags: string[]) => void;
    deleteCustomer: (id: number) => void;
    deleteMultipleCustomers: (ids: number[]) => void;
    importCustomers: (customersData: Omit<Customer, 'id' | 'avatar'>[]) => Customer[];
    contacts: Contact[];
    addContact: (contactData: Omit<Contact, 'id'>) => Contact;
    updateContact: (contact: Contact) => void;
    deleteContact: (contactId: number) => void;
    communicationLogs: CommunicationLog[];
    addCommunicationLog: (customerId: number, type: CommunicationLogType, content: string) => void;
    updateCommunicationLog: (log: CommunicationLog) => void;
    deleteCommunicationLog: (logId: number) => void;
    savedViews: SavedView[];
    addSavedView: (name: string, filters: SavedView['filters'], sortConfig: SortConfig) => void;
    deleteSavedView: (id: number) => void;
    loadSavedView: (id: number) => SavedView | undefined;
    
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
    addSalesReturn: (returnData: Omit<SalesReturn, 'id' | 'returnNumber' | 'customerName'>) => SalesReturn | undefined;
    updateSalesReturn: (salesReturn: SalesReturn) => void;
    deleteSalesReturn: (id: number) => void;
    quotations: Quotation[];
    addQuotation: (quotationData: Omit<Quotation, 'id' | 'quotationNumber' | 'customerName'>) => Quotation;
    updateQuotation: (quotation: Quotation) => void;
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
    createSalesOrderFromCart: (customerId: number) => void;
    addScheduledTask: (schedule: Omit<ScheduledTask, "id">) => void;
    updateScheduledTask: (schedule: ScheduledTask) => void;
    deleteScheduledTask: (scheduleId: number) => void;
    runScheduledTasksCheck: () => void;
    addTaskTemplate: (templateData: Omit<TaskTemplate, "id">) => void;
    updateTaskTemplate: (template: TaskTemplate) => void;
    deleteTaskTemplate: (templateId: number) => void;
    addBom: (bomData: Omit<BillOfMaterials, "id" | "productName">) => void;
    updateBom: (bom: BillOfMaterials) => void;
    addWorkOrder: (woData: Omit<WorkOrder, "id" | "workOrderNumber" | "productName">) => WorkOrder | undefined;
    updateWorkOrderStatus: (workOrderId: number, newStatus: WorkOrderStatus) => void;
    getProductStockInfo: (productId: number) => { physical: number, committed: number, available: number };
    getProductStockByWarehouse: (productId: number, warehouseId: number) => { physical: number, committed: number, available: number };
    addSalesOrder: (orderData: Omit<SalesOrder, "id" | "orderNumber" | "customerName">) => void;
    updateSalesOrder: (order: SalesOrder) => void;
    deleteSalesOrder: (orderId: number) => void;
    updateSalesOrderStatus: (orderId: number, newStatus: SalesOrderStatus) => void;
    convertOrderToInvoice: (orderId: number) => void;
    confirmPickList: (pickListId: number) => void;
    addProduct: (productData: Omit<Product, "id">, initialStock?: { warehouseId: number, quantity: number }) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;
    addWarehouse: (warehouseData: Omit<Warehouse, "id">) => void;
    updateWarehouse: (warehouse: Warehouse) => void;
    deleteWarehouse: (id: number) => void;
    addInventoryTransfer: (transferData: Omit<InventoryTransfer, "id" | "transferNumber" | "status">) => void;
    addInventoryAdjustment: (adjustmentData: Omit<InventoryAdjustment, "id" | "adjustmentNumber" | "status">) => void;
    receivePurchaseOrderItems: (poId: number, itemsToReceive: { productId: number, quantity: number, details: (string | { batch: string, expiry: string })[] }[], warehouseId: number) => void;
    addPurchaseOrder: (poData: Omit<PurchaseOrder, "id" | "poNumber" | "supplierName">) => void;
    updatePurchaseOrder: (po: PurchaseOrder) => void;
    updatePurchaseOrderStatus: (poId: number, status: PurchaseOrderStatus) => void;
    createBillFromPO: (poId: number) => void;
    allocateStockToSalesOrder: (soId: number, allocations: { [productId: string]: number[] }) => void;
    createShipmentFromSalesOrder: (soId: number, itemsToShip: ShipmentItem[]) => void;
    createPickList: (shipmentIds: number[]) => void;
    addAutomation: (auto: Omit<Automation, "id" | "lastRun">) => void;
    updateAutomation: (auto: Automation) => void;
    deleteAutomation: (autoId: number) => void;
    updateSystemList: (key: SystemListKey, items: SystemListItem[]) => void;
    updateEmailTemplate: (template: EmailTemplate) => void;
    addPriceList: (list: Omit<PriceList, "id">) => void;
    updatePriceList: (list: PriceList) => void;
    deletePriceList: (listId: number) => void;
    updatePriceListItems: (listId: number, items: PriceListItem[]) => void;
    addTaxRate: (rate: Omit<TaxRate, "id">) => void;
    updateTaxRate: (rate: TaxRate) => void;
    deleteTaxRate: (rateId: number) => void;
    addAccount: (account: Omit<Account, "id">) => void;
    updateAccount: (account: Account) => void;
    addJournalEntry: (entryData: Omit<JournalEntry, 'id' | 'entryNumber'>) => JournalEntry;
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
    hasPermission: (permission: Permission) => boolean;
    addDeal: (dealData: Omit<Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'>) => Deal;
    updateDeal: (deal: Deal) => void;
    updateDealStage: (dealId: number, newStage: DealStage) => void;
    updateDealWinLossReason: (dealId: number, stage: DealStage.Won | DealStage.Lost, reason: string) => void;
    deleteDeal: (id: number) => void;
    addProject: (projectData: Omit<Project, 'id' | 'client'>, taskTemplateId?: number) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: number) => void;
    addTask: (taskData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles?: string[]) => Task | undefined;
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
    addInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>) => Invoice;
    updateInvoice: (invoice: Invoice) => void;
    bulkUpdateInvoiceStatus: (invoiceIds: number[], newStatus: InvoiceStatus) => void;
    deleteInvoice: (id: number) => void;
    addBill: (bill: Omit<Bill, 'id'>) => Bill | undefined;
    updateBill: (bill: Bill) => void;
    bulkUpdateBillStatus: (billIds: number[], newStatus: BillStatus) => void;
    addSupplier: (supplierData: Omit<Supplier, "id" | "avatar">) => void;
    updateSupplier: (supplier: Supplier) => void;
    deleteSupplier: (id: number) => void;
    deletePurchaseOrder: (id: number) => void;
    addEmployee: (employeeData: Omit<Employee, "id" | "avatar" | "employeeId">) => void;
    updateEmployee: (employee: Employee) => void;
    deleteEmployee: (id: number) => void;
    addLeaveRequest: (requestData: Omit<LeaveRequest, "id" | "employeeName" | "status">) => void;
    updateLeaveRequestStatus: (requestId: number, newStatus: LeaveStatus) => void;
    addBankAccount: (accountData: Omit<BankAccount, "id">) => void;
    updateBankAccount: (account: BankAccount) => void;
    deleteBankAccount: (id: number) => void;
    addTransaction: (transactionData: Omit<Transaction, "id">) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: number) => void;
    addTicket: (ticketData: Omit<SupportTicket, "id" | "ticketNumber" | "customerName" | "assignedToName" | "createdDate">) => void;
    updateTicket: (ticket: SupportTicket) => void;
    deleteTicket: (id: number) => void;
    addDocument: (docData: Omit<Document, "id" | "uploadedByName">) => void;
    renameDocument: (docId: number, newName: string) => void;
    deleteDocument: (id: number) => void;
    deleteMultipleDocuments: (ids: number[]) => void;
    addFolder: (folderName: string, parentId: number | null) => void;
    moveDocuments: (docIds: number[], targetFolderId: number | null) => void;
    toggleDocumentStar: (docId: number) => void;
    shareDocument: (docId: number, shares: DocumentShare[]) => void;
    addComment: (text: string, entityType: 'customer' | 'project' | 'deal' | 'task' | 'ticket' | 'sales_order', entityId: number) => void;
    updateComment: (comment: Comment) => void;
    deleteComment: (commentId: number) => void;
    addSalesActivity: (activityData: Omit<SalesActivity, "id" | "userName" | "userAvatar" | "timestamp">) => void;
    addPerformanceReview: (reviewData: Omit<PerformanceReview, "id" | "employeeName" | "reviewerName">) => void;
    updatePerformanceReview: (review: PerformanceReview) => void;
    addJobOpening: (jobData: Omit<JobOpening, "id">) => void;
    updateJobOpening: (job: JobOpening) => void;
    addCandidate: (candidateData: Omit<Candidate, "id">) => void;
    updateCandidate: (candidate: Candidate) => void;
    updateCandidateStage: (candidateId: number, newStage: CandidateStage) => void;
    addOnboardingTemplate: (templateData: Omit<OnboardingTemplate, "id">) => void;
    updateOnboardingTemplate: (template: OnboardingTemplate) => void;
    startOnboardingWorkflow: (data: { employeeId: number, templateId: number }) => void;
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
    addRole: (roleData: Omit<Role, 'id' | 'isSystemRole'>, cloneFromRoleId?: string) => void;
    updateRolePermissions: (roleId: string, permissions: Permission[]) => void;
    deleteRole: (roleId: string) => void;
    addCustomField: (fieldData: Omit<CustomFieldDefinition, 'id'>) => void;
    updateCustomField: (field: CustomFieldDefinition) => void;
    deleteCustomField: (id: number) => void;
    markNotificationAsRead: (id: number) => void;
    clearAllNotifications: () => void;
    logActivity: (actionType: ActionType, details: string, entityType?: EntityType, entityId?: number) => void;
    updateAccountingLockDate: (date: string | null) => void;
    addStockMovement: (productId: number, warehouseId: number, type: StockMovementType, quantityChange: number, notes?: string, relatedDocumentId?: number) => void;
    addExpense: (expenseData: Omit<Expense, 'id' | 'employeeName' | 'status' | 'employeeId'>) => void;
    updateExpenseStatus: (expenseId: number, status: ExpenseStatus) => void;
    addAsset: (assetData: Omit<Asset, 'id'>) => void;
    updateAsset: (asset: Asset) => void;
    updateHrParameters: (params: HrParameters) => void;
    isCommandPaletteOpen: boolean;
    setIsCommandPaletteOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
}
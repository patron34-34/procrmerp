






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
  status: 'aktif' | 'kaybedilmiş' | 'potensiyel';
  avatar: string;
  industry: string;
  tags: string[];
  assignedToId: number;
  healthScore?: number;
  leadSource: string;
  customFields?: { [key: string]: string | number | boolean };
  priceListId?: number;

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
    taxRate: number;
}

export enum InvoiceStatus {
    Draft = 'Taslak',
    Sent = 'Gönderildi',
    Paid = 'Ödendi',
    Overdue = 'Gecikmiş',
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
    subTotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    notes: string;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    category: string;
    price: number;
    lowStockThreshold: number;
    trackBy: 'none' | 'serial' | 'batch';
    binLocation?: string;
}

export interface Supplier {
    id: number;
    name: string;
    contactPerson: string;
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
    type: EventType;
    date: Date;
    endDate?: Date;
    title: string;
    color: string;
    isAllDay: boolean;
    data: any;
    ownerId: number;
}

export type EventType = 'project' | 'deal' | 'invoice' | 'task';
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
    | 'finans:goruntule' | 'finans:yonet'
    | 'destek:goruntule' | 'destek:yonet'
    | 'aktivite:goruntule'
    | 'dokuman:goruntule' | 'dokuman:yonet'
    | 'yorum:yonet'
    | 'kullanici:yonet'
    | 'ayarlar:goruntule' | 'ayarlar:genel-yonet' | 'ayarlar:roller-yonet' | 'ayarlar:guvenlik-yonet'
    | 'ayarlar:muhasebe-yonet' | 'ayarlar:maliyet-merkezi-yonet' | 'ayarlar:vergi-yonet'
    | 'muhasebe:goruntule' | 'muhasebe:yonet' | 'muhasebe:mutabakat-yap'
    | 'muhasebe:defteri-kebir-goruntule' | 'muhasebe:bilanco-goruntule' | 'muhasebe:gelir-tablosu-goruntule' | 'muhasebe:nakit-akis-goruntule'
    | 'muhasebe:alacak-yaslandirma-goruntule' | 'muhasebe:kar-zarar-goruntule'
    | 'muhasebe:tekrarlanan-yonet' | 'muhasebe:butce-yonet'
    | 'otomasyon:goruntule' | 'otomasyon:yonet'
    ;

export type EntityType = 'customer' | 'deal' | 'project' | 'task' | 'invoice' | 'product' | 'supplier' | 'purchase_order' | 'employee' | 'ticket' | 'document' | 'user' | 'role' | 'automation' | 'journal_entry' | 'payroll_run' | 'task_template' | 'scheduled_task';

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
    relatedEntityType: 'customer' | 'project' | 'deal' | 'task';
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

// ================== MISSING TYPES ==================

// Toast (from NotificationContext)
export type ToastType = 'success' | 'warning' | 'error' | 'info';
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
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
    | { type: AutomationActionType.UPDATE_CUSTOMER_STATUS; config: { newStatus: 'aktif' | 'kaybedilmiş' | 'potensiyel'; } };

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
    Pending = 'Beklemede',
    AwaitingStock = 'Stok Bekleniyor',
    ReadyToShip = 'Sevke Hazır',
    PartiallyShipped = 'Kısmen Sevk Edildi',
    Shipped = 'Sevk Edildi',
    Cancelled = 'İptal Edildi',
}
export interface SalesOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
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
    totalAmount: number;
    status: SalesOrderStatus;
}

export enum ShipmentStatus {
    ReadyToShip = 'Sevke Hazır',
    Shipped = 'Sevk Edildi',
    Cancelled = 'İptal Edildi',
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
}
export enum StockItemStatus {
    Available = 'Mevcut',
    Committed = 'Ayrılmış',
    Shipped = 'Sevk Edildi',
}

export interface StockItem {
    id: number;
    productId: number;
    warehouseId: number;
    serialNumber?: string;
    batchNumber?: string;
    expiryDate?: string;
    quantity?: number; // for batch items
    status: StockItemStatus;
}

export interface PickListItem {
    productId: number;
    productName: string;
    productSku: string;
    quantityToPick: number;
    binLocation?: string;
    serialNumbers?: string[];
    batchNumber?: string;
}

export interface PickList {
    id: number;
    pickListNumber: string;
    creationDate: string;
    assignedToId: number;
    status: 'Beklemede' | 'Toplanıyor' | 'Toplandı';
    items: PickListItem[];
    relatedShipmentIds: number[];
}

// Tasks
export interface TaskTemplateItem {
    id: string; // A unique ID within the template for parenting
    taskName: string;
    dueDaysAfterStart: number;
    priority: TaskPriority;
    estimatedTime: number; // in minutes
    defaultAssigneeRoleId: string;
    parentId: string | null;
}

export interface TaskTemplate {
    id: number;
    name: string;
    description: string;
    items: TaskTemplateItem[];
}
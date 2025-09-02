import { Customer, Deal, Invoice, SupportTicket, DealStage, InvoiceStatus, TicketPriority, TicketStatus } from '../types';

export const calculateHealthScore = (
    customer: Customer,
    deals: Deal[],
    invoices: Invoice[],
    tickets: SupportTicket[]
): number => {
    let score = 50; // Base score

    const customerDeals = deals.filter(d => d.customerId === customer.id);
    const customerInvoices = invoices.filter(i => i.customerId === customer.id);
    const customerTickets = tickets.filter(t => t.customerId === customer.id);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Positive factors
    const recentWonDealsValue = customerDeals
        .filter(d => d.stage === DealStage.Won && new Date(d.closeDate) > ninetyDaysAgo)
        .reduce((sum, d) => sum + d.value, 0);
    
    score += Math.min(25, Math.floor(recentWonDealsValue / 2000)); // +1 point per $2k, max +25

    const totalPaid = customerInvoices
        .filter(i => i.status === InvoiceStatus.Paid)
        .reduce((sum, i) => sum + i.grandTotal, 0);

    if (totalPaid > 10000) score += 5;
    if (totalPaid > 50000) score += 5; // Total +10

    // Negative factors
    const overdueAmount = customerInvoices
        .filter(i => i.status === InvoiceStatus.Overdue)
        .reduce((sum, i) => sum + i.grandTotal, 0);

    if (overdueAmount > 0) score -= 15;
    score -= Math.min(15, Math.floor(overdueAmount / 1000)); // -1 per $1k overdue, max -15

    const highPriorityTickets = customerTickets.filter(t => 
// FIX: Add missing 'TicketStatus' to the type imports.
        (t.status === TicketStatus.Open || t.status === TicketStatus.Pending) &&
        (t.priority === TicketPriority.High || t.priority === TicketPriority.Urgent)
    ).length;

    score -= highPriorityTickets * 10; // -10 per high/urgent ticket

    const daysSinceLastContact = (new Date().getTime() - new Date(customer.lastContact).getTime()) / (1000 * 3600 * 24);
    if (daysSinceLastContact > 60) score -= 15;
    else if (daysSinceLastContact > 30) score -= 5;
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
};
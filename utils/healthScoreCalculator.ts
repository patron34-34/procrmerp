import { Customer, Deal, Invoice, SupportTicket, DealStage, InvoiceStatus, TicketPriority, TicketStatus } from '../types';

export const calculateHealthScore = (
    customer: Customer,
    deals: Deal[],
    invoices: Invoice[],
    tickets: SupportTicket[]
): { score: number; breakdown: string[] } => {
    let score = 50; // Base score
    const breakdown: string[] = ['+50 puan: Temel Puan'];

    const customerDeals = deals.filter(d => d.customerId === customer.id);
    const customerInvoices = invoices.filter(i => i.customerId === customer.id);
    const customerTickets = tickets.filter(t => t.customerId === customer.id);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Positive factors
    const recentWonDealsValue = customerDeals
        .filter(d => d.stage === DealStage.Won && new Date(d.closeDate) > ninetyDaysAgo)
        .reduce((sum, d) => sum + d.value, 0);
    
    const dealPoints = Math.min(25, Math.floor(recentWonDealsValue / 2000));
    if (dealPoints > 0) {
        score += dealPoints;
        breakdown.push(`+${dealPoints} puan: Yakın zamanda kazanılan anlaşmalar`);
    }

    const totalPaid = customerInvoices
        .filter(i => i.status === InvoiceStatus.Paid)
        .reduce((sum, i) => sum + i.grandTotal, 0);

    if (totalPaid > 50000) {
        score += 10;
        breakdown.push(`+10 puan: Yüksek yaşam boyu değeri`);
    } else if (totalPaid > 10000) {
        score += 5;
        breakdown.push(`+5 puan: Orta yaşam boyu değeri`);
    }

    // Negative factors
    const overdueAmount = customerInvoices
        .filter(i => i.status === InvoiceStatus.Overdue)
        .reduce((sum, i) => sum + i.grandTotal, 0);

    if (overdueAmount > 0) {
        score -= 15;
        breakdown.push(`-15 puan: Gecikmiş bakiye mevcut`);
        const overduePoints = Math.min(15, Math.floor(overdueAmount / 1000));
        if(overduePoints > 0) {
            score -= overduePoints;
            breakdown.push(`-${overduePoints} puan: Gecikmiş bakiye tutarı`);
        }
    }

    const highPriorityTickets = customerTickets.filter(t => 
        (t.status === TicketStatus.Open || t.status === TicketStatus.Pending) &&
        (t.priority === TicketPriority.High || t.priority === TicketPriority.Urgent)
    ).length;

    if (highPriorityTickets > 0) {
        const ticketPoints = highPriorityTickets * 10;
        score -= ticketPoints;
        breakdown.push(`-${ticketPoints} puan: ${highPriorityTickets} adet yüksek öncelikli destek talebi`);
    }

    const daysSinceLastContact = (new Date().getTime() - new Date(customer.lastContact).getTime()) / (1000 * 3600 * 24);
    if (daysSinceLastContact > 60) {
        score -= 15;
        breakdown.push(`-15 puan: 60+ gündür iletişim kurulmadı`);
    } else if (daysSinceLastContact > 30) {
        score -= 5;
        breakdown.push(`-5 puan: 30+ gündür iletişim kurulmadı`);
    }
    
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    return { score: finalScore, breakdown };
};
import { TicketPriority } from '../types';

export type SLAStatus = 'Zamanında' | 'Riskli' | 'Vadesi Geçti';

interface SLAInfo {
    status: SLAStatus;
    colorClass: string;
    rowClass: string;
    urgencyScore: number;
}

/**
 * Calculates the SLA status, color classes, and an urgency score for a support ticket.
 * Higher score means more urgent.
 * @param createdDate The ISO string of the ticket's creation date.
 * @param priority The priority of the ticket.
 * @returns An object containing SLA information.
 */
export const getSLAInfo = (createdDate: string, priority: TicketPriority): SLAInfo => {
    const created = new Date(createdDate).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - created) / (1000 * 60 * 60);

    let thresholdWarn: number, thresholdOverdue: number;
    let priorityScore: number;

    switch (priority) {
        case TicketPriority.Urgent:
            thresholdWarn = 2; // 2 hours
            thresholdOverdue = 4; // 4 hours
            priorityScore = 400;
            break;
        case TicketPriority.High:
            thresholdWarn = 12; // 12 hours
            thresholdOverdue = 24; // 1 day
            priorityScore = 300;
            break;
        case TicketPriority.Normal:
            thresholdWarn = 48; // 2 days
            thresholdOverdue = 72; // 3 days
            priorityScore = 200;
            break;
        case TicketPriority.Low:
        default:
            thresholdWarn = 96; // 4 days
            thresholdOverdue = 168; // 7 days
            priorityScore = 100;
            break;
    }

    if (hoursPassed > thresholdOverdue) {
        return {
            status: 'Vadesi Geçti',
            colorClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            rowClass: 'bg-red-50 dark:bg-red-900/20',
            urgencyScore: 1000 + priorityScore + hoursPassed, // Overdue is highest urgency
        };
    }
    if (hoursPassed > thresholdWarn) {
        return {
            status: 'Riskli',
            colorClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            rowClass: 'bg-yellow-50 dark:bg-yellow-900/20',
            urgencyScore: 500 + priorityScore + hoursPassed, // At risk is next
        };
    }
    return {
        status: 'Zamanında',
        colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        rowClass: '',
        urgencyScore: priorityScore + hoursPassed, // On time
    };
};

import React from 'react';
import { TicketPriority } from '../../types';

interface TicketSLAStatusProps {
    createdDate: string;
    priority: TicketPriority;
}

const TicketSLAStatus: React.FC<TicketSLAStatusProps> = ({ createdDate, priority }) => {
    const getSLAInfo = () => {
        const created = new Date(createdDate).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - created) / (1000 * 60 * 60);

        let thresholdWarn: number, thresholdOverdue: number;

        switch (priority) {
            case TicketPriority.Urgent:
                thresholdWarn = 2; // 2 hours
                thresholdOverdue = 4; // 4 hours
                break;
            case TicketPriority.High:
                thresholdWarn = 12; // 12 hours
                thresholdOverdue = 24; // 1 day
                break;
            case TicketPriority.Normal:
                thresholdWarn = 48; // 2 days
                thresholdOverdue = 72; // 3 days
                break;
            case TicketPriority.Low:
                thresholdWarn = 96; // 4 days
                thresholdOverdue = 168; // 7 days
                break;
            default:
                thresholdWarn = 48;
                thresholdOverdue = 72;
        }

        if (hoursPassed > thresholdOverdue) {
            return { text: 'Vadesi Geçti', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
        }
        if (hoursPassed > thresholdWarn) {
            return { text: 'Riskli', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
        }
        return { text: 'Zamanında', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    };

    const { text, color } = getSLAInfo();

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
            {text}
        </span>
    );
};

export default TicketSLAStatus;
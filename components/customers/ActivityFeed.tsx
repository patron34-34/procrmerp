import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLog, ActivityLog, CommunicationLogType, Comment } from '../../types';
import { ICONS } from '../../constants';
import InlineCommunicationLogger from './InlineCommunicationLogger';

interface ActivityFeedProps {
    customerId: number;
}

type TimelineItem = (CommunicationLog | ActivityLog | Comment) & { itemType: 'log' | 'activity' | 'comment' };

const ActivityFeed: React.FC<ActivityFeedProps> = ({ customerId }) => {
    const { communicationLogs, activityLogs, comments, deals, projects, hasPermission } = useApp();
    
    const canManageCustomers = hasPermission('musteri:yonet');

    const timelineItems = useMemo(() => {
        const customerDeals = deals.filter(d => d.customerId === customerId).map(d => d.id);
        const customerProjects = projects.filter(p => p.customerId === customerId).map(p => p.id);
        
        const logs: TimelineItem[] = communicationLogs
            .filter(log => log.customerId === customerId)
            .map(log => ({ ...log, itemType: 'log' }));
        
        const customerComments: TimelineItem[] = comments
            .filter(c => c.relatedEntityType === 'customer' && c.relatedEntityId === customerId)
            .map(c => ({...c, itemType: 'comment' }));

        const activities: TimelineItem[] = activityLogs
            .filter(act => 
                (act.entityType === 'customer' && act.entityId === customerId) ||
                (act.entityType === 'deal' && customerDeals.includes(act.entityId || 0)) ||
                (act.entityType === 'project' && customerProjects.includes(act.entityId || 0))
            )
            .map(act => ({ ...act, itemType: 'activity' }));
        
        return [...logs, ...activities, ...customerComments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [communicationLogs, activityLogs, comments, deals, projects, customerId]);

    const getTimelineIcon = (item: TimelineItem) => {
        const iconMap = {
            [CommunicationLogType.Note]: ICONS.note,
            [CommunicationLogType.Call]: ICONS.phoneCall,
            [CommunicationLogType.Email]: ICONS.email,
            [CommunicationLogType.Meeting]: ICONS.meeting,
        };

        if (item.itemType === 'log') return iconMap[(item as CommunicationLog).type] || ICONS.note;
        if (item.itemType === 'comment') return ICONS.note;
        
        const actionType = (item as ActivityLog).actionType;
        if (actionType.includes("CREATED")) return ICONS.add;
        if (actionType.includes("UPDATED") || actionType.includes("CHANGED")) return ICONS.edit;
        if (actionType.includes("DELETED")) return ICONS.trash;
        return ICONS.system;
    };
    
    return (
        <div className="space-y-6">
            {canManageCustomers && <InlineCommunicationLogger customerId={customerId} />}
            
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {timelineItems.length > 0 ? timelineItems.map(item => (
                    <div key={`${item.itemType}-${item.id}`} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex-shrink-0">
                            {getTimelineIcon(item)}
                        </div>
                        <div className="flex-1">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-sm text-text-main dark:text-dark-text-main whitespace-pre-wrap">
                                    {item.itemType === 'activity' ? (item as ActivityLog).details : (item as CommunicationLog).content || (item as Comment).text}
                                </p>
                            </div>
                            <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 flex justify-between px-1">
                                <span><span className="font-semibold">{item.userName}</span></span>
                                <span>{new Date(item.timestamp).toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">
                        Bu müşteri için aktivite kaydı bulunamadı.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
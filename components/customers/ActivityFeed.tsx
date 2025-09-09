import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLog, ActivityLog, CommunicationLogType, Comment } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { summarizeText } from '../../services/geminiService';

interface ActivityFeedProps {
    customerId: number;
}

type TimelineItem = (CommunicationLog | ActivityLog | Comment) & { itemType: 'log' | 'activity' | 'comment' };

const ActivityFeed: React.FC<ActivityFeedProps> = ({ customerId }) => {
    const { communicationLogs, activityLogs, comments, deals, projects, summarizeActivityFeed } = useApp();
    const { addToast } = useNotification();
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

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

    const handleSummarize = async () => {
        if (timelineItems.length === 0) {
            addToast("Özetlenecek aktivite bulunmuyor.", "info");
            return;
        }
        setIsSummarizing(true);
        setSummary('');
        try {
            const result = await summarizeActivityFeed(customerId);
            setSummary(result);
            addToast("Aktivite özeti oluşturuldu.", "success");
        } catch (error) {
            console.error("Summarization error:", error);
            addToast("Özet oluşturulurken bir hata oluştu.", "error");
        } finally {
            setIsSummarizing(false);
        }
    };

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
            <div className="flex justify-end">
                <Button variant="secondary" onClick={handleSummarize} disabled={isSummarizing}>
                    <span className="flex items-center gap-2">{ICONS.magic} {isSummarizing ? 'Özetleniyor...' : 'AI ile Özetle'}</span>
                </Button>
            </div>

            {summary && (
                <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                    <h4 className="font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-2">{ICONS.magic} AI Özeti</h4>
                    <p className="text-sm mt-2 whitespace-pre-wrap">{summary}</p>
                </div>
            )}
            
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


import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesActivity, Comment, SalesActivityType } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import LogActivityModal from './LogActivityModal';

interface ActivityTimelineProps {
  dealId: number;
}

type TimelineItem = (SalesActivity | Comment) & { itemType: 'activity' | 'comment' };

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ dealId }) => {
  const { salesActivities, comments, addComment, currentUser, hasPermission } = useApp();
  const [newComment, setNewComment] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const canManageDeals = hasPermission('anlasma:yonet');
  const canManageComments = hasPermission('yorum:yonet');

  const timelineItems = useMemo(() => {
    const activities: TimelineItem[] = salesActivities
      .filter(a => a.dealId === dealId)
      .map(a => ({ ...a, itemType: 'activity' }));
    
    const dealComments: TimelineItem[] = comments
      .filter(c => c.relatedEntityType === 'deal' && c.relatedEntityId === dealId)
      .map(c => ({ ...c, itemType: 'comment' }));

    return [...activities, ...dealComments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [salesActivities, comments, dealId]);
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newComment.trim() && canManageComments) {
      addComment(newComment, 'deal', dealId);
      setNewComment('');
    }
  };

  const getItemIcon = (item: TimelineItem) => {
    const iconStyle = "w-5 h-5 text-white";
    let type: SalesActivityType | 'comment' = 'comment';
    if(item.itemType === 'activity') type = (item as SalesActivity).type;

    const styles: { [key: string]: { bg: string, icon: React.ReactNode } } = {
      [SalesActivityType.Call]: { bg: 'bg-blue-500', icon: <div className={iconStyle}>{ICONS.phoneCall}</div> },
      [SalesActivityType.Meeting]: { bg: 'bg-purple-500', icon: <div className={iconStyle}>{ICONS.meeting}</div> },
      [SalesActivityType.Email]: { bg: 'bg-red-500', icon: <div className={iconStyle}>{ICONS.email}</div> },
      [SalesActivityType.System]: { bg: 'bg-slate-500', icon: <div className={iconStyle}>{ICONS.system}</div> },
      'comment': { bg: 'bg-yellow-500', icon: <div className={iconStyle}>{ICONS.note}</div> },
    };
    return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles[type].bg}`}>{styles[type].icon}</div>;
  };

  return (
    <>
      {canManageDeals && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4 flex flex-wrap gap-2">
           <Button variant="secondary" onClick={() => setIsLogModalOpen(true)}>
                <span className="flex items-center gap-1">{ICONS.add} Aktivite Ekle</span>
           </Button>
            <form onSubmit={handleCommentSubmit} className="flex-grow flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Hızlı bir not ekle... (@ ile bahset)"
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    disabled={!canManageComments}
                />
                <Button type="submit" disabled={!newComment.trim() || !canManageComments}>Kaydet</Button>
            </form>
        </div>
      )}

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {timelineItems.length > 0 ? timelineItems.map(item => (
          <div key={`${item.itemType}-${item.id}`} className="flex items-start gap-3">
            {getItemIcon(item)}
            <div className="flex-1">
              <p className="text-sm text-text-main dark:text-dark-text-main whitespace-pre-wrap">
                {item.itemType === 'activity' ? (item as SalesActivity).notes : (item as Comment).text}
              </p>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                <span className="font-semibold">{item.userName}</span> • {new Date(item.timestamp).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        )) : (
          <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">
            Bu anlaşma için henüz bir aktivite veya yorum yok.
          </p>
        )}
      </div>

      {isLogModalOpen && (
        <LogActivityModal 
            isOpen={isLogModalOpen}
            onClose={() => setIsLogModalOpen(false)}
            dealId={dealId}
        />
      )}
    </>
  );
};

export default ActivityTimeline;

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority, Deal, Invoice, Project, Task } from '../../types';
import { Link } from 'react-router-dom';
import { ICONS } from '../../constants';
import TodoListCard from '../pages/dashboard/TodoListCard';

interface ListWidgetProps {
  widgetId: string;
}

type TodayItem = {
    id: string;
    type: 'Görev' | 'Proje' | 'Anlaşma' | 'Fatura';
    title: string;
    date: string;
    link: string;
    icon: JSX.Element;
};

const ListWidget: React.FC<ListWidgetProps> = ({ widgetId }) => {
  const { tasks, currentUser, activityLogs, projects, deals, invoices } = useApp();

  const renderContent = () => {
    switch (widgetId) {
      case 'list-today-view':
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const todayTasks: TodayItem[] = tasks
            .filter(t => t.dueDate === todayStr && t.assignedToId === currentUser.id)
            .map(t => ({ id: `task-${t.id}`, type: 'Görev', title: t.title, date: t.dueDate, link: `/planner`, icon: ICONS.tasks }));

        const todayProjects: TodayItem[] = projects
            .filter(p => p.deadline === todayStr && p.teamMemberIds.includes(currentUser.id))
            .map(p => ({ id: `project-${p.id}`, type: 'Proje', title: p.name, date: p.deadline, link: `/projects/${p.id}`, icon: ICONS.projects }));

        const todayDeals: TodayItem[] = deals
            .filter(d => d.closeDate === todayStr && d.assignedToId === currentUser.id)
            .map(d => ({ id: `deal-${d.id}`, type: 'Anlaşma', title: d.title, date: d.closeDate, link: `/deals/${d.id}`, icon: ICONS.sales }));
        
        const todayInvoices: TodayItem[] = invoices
            .filter(i => i.dueDate === todayStr)
            .map(i => ({ id: `invoice-${i.id}`, type: 'Fatura', title: `${i.invoiceNumber} - ${i.customerName}`, date: i.dueDate, link: `/invoices`, icon: ICONS.invoices }));
        
        const allTodayItems = [...todayTasks, ...todayProjects, ...todayDeals, ...todayInvoices];

        return (
            <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                {allTodayItems.length > 0 ? allTodayItems.map(item => (
                    <div key={item.id} className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center gap-3">
                        <div className="text-primary-500">{item.icon}</div>
                        <div className="flex-1">
                            <Link to={item.link} className="font-semibold text-sm text-text-main dark:text-dark-text-main truncate hover:underline">{item.title}</Link>
                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                                Tür: {item.type}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary py-4">Bugün için yapılacak bir şey yok. Harika!</p>
                )}
            </div>
        );


      case 'list-my-tasks':
        return <TodoListCard />;

      case 'list-recent-activities':
        const recentActivities = activityLogs.slice(0, 5);
        return (
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
                recentActivities.map(log => (
                    <div key={log.id} className="flex items-start gap-3">
                        <img src={log.userAvatar} alt={log.userName} className="h-9 w-9 rounded-full"/>
                        <div>
                            <p className="text-sm text-text-main dark:text-dark-text-main">
                                <span className="font-semibold">{log.userName}</span> {log.details}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                {new Date(log.timestamp).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-text-secondary dark:text-dark-text-secondary">Henüz aktivite yok.</p>
            )}
            <div className="mt-4 border-t border-slate-200 dark:border-dark-border pt-2 text-center">
                <Link to="/admin/activity-log" className="text-sm font-semibold text-primary-600 hover:underline">Tümünü Gör</Link>
            </div>
          </div>
        );
      
      default:
        return <div>Bilinmeyen Liste Bileşeni</div>;
    }
  };

  return <div className="h-full flex flex-col">{renderContent()}</div>;
};

export default ListWidget;
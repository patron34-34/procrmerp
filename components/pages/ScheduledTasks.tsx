import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduledTask } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import EmptyState from '../ui/EmptyState';
import ScheduledTaskFormModal from '../automations/ScheduledTaskFormModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useNotification } from '../../context/NotificationContext';

const ScheduledTasks: React.FC = () => {
    const { scheduledTasks, taskTemplates, deleteScheduledTask, runScheduledTasksCheck, hasPermission } = useApp();
    const { addToast } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<ScheduledTask | null>(null);
    const [scheduleToDelete, setScheduleToDelete] = useState<ScheduledTask | null>(null);

    const canManage = hasPermission('otomasyon:yonet');

    const openModalForNew = () => {
        setEditingSchedule(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (schedule: ScheduledTask) => {
        setEditingSchedule(schedule);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (scheduleToDelete) {
            deleteScheduledTask(scheduleToDelete.id);
            setScheduleToDelete(null);
        }
    };
    
    const getTemplateName = (templateId: number) => {
        return taskTemplates.find(t => t.id === templateId)?.name || 'Bilinmeyen Şablon';
    };

    return (
        <>
            <Card
                title="Planlanmış Görevler"
                action={
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={runScheduledTasksCheck}>Şimdi Çalıştır (Simülasyon)</Button>
                        {canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Plan</span></Button>}
                    </div>
                }
            >
                <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                    Tekrarlayan görevleri bir takvime göre otomatik olarak oluşturun. Sistem, "Sıradaki Çalışma Tarihi" geldiğinde ilgili şablondan görevleri oluşturacaktır.
                </p>
                <div className="overflow-x-auto">
                    {scheduledTasks.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Plan Adı</th>
                                <th className="p-3 font-semibold">Kullanılan Şablon</th>
                                <th className="p-3 font-semibold">Son Çalışma</th>
                                <th className="p-3 font-semibold">Sıradaki Çalışma</th>
                                <th className="p-3 font-semibold">Durum</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {scheduledTasks.map(schedule => (
                                    <tr key={schedule.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{schedule.name}</td>
                                        <td className="p-3">{getTemplateName(schedule.taskTemplateId)}</td>
                                        <td className="p-3">{schedule.lastRunDate || 'Henüz çalışmadı'}</td>
                                        <td className={`p-3 font-mono ${new Date(schedule.nextRunDate) <= new Date() && schedule.enabled ? 'text-orange-500 font-bold' : ''}`}>
                                            {schedule.nextRunDate}
                                            {new Date(schedule.nextRunDate) <= new Date() && schedule.enabled && <span className="ml-2" title="Çalışma zamanı geçti">⚠️</span>}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${schedule.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {schedule.enabled ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                            <button onClick={() => openModalForEdit(schedule)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                            <button onClick={() => setScheduleToDelete(schedule)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                        </div></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.planner}
                            title="Henüz Planlanmış Görev Yok"
                            description="Tekrarlayan iş akışlarınızı otomatikleştirmek için ilk planınızı oluşturun."
                            action={canManage ? <Button onClick={openModalForNew}>Plan Oluştur</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {isModalOpen && canManage && (
                <ScheduledTaskFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    schedule={editingSchedule}
                />
            )}
            
            {canManage && <ConfirmationModal
                isOpen={!!scheduleToDelete}
                onClose={() => setScheduleToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Planlanmış Görevi Sil"
                message={`'${scheduleToDelete?.name}' adlı planı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem gelecekteki görev oluşturmalarını durduracaktır.`}
            />}
        </>
    );
};

export default ScheduledTasks;
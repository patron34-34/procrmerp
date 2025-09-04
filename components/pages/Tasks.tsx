import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, ActionType } from '../../types';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import TaskFormModal from '../tasks/TaskFormModal';
import TaskDetailModal from '../tasks/TaskDetailModal';
import TaskListView from '../tasks/TaskListView';
import TaskKanbanView from '../tasks/TaskKanbanView';
import TaskFilterBar from '../tasks/TaskFilterBar';
import Card from '../ui/Card';
import TaskCalendarView from '../tasks/TaskCalendarView';
import TaskGanttView from '../tasks/TaskGanttView';
import BatchActionModal from '../tasks/BatchActionModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import Modal from '../ui/Modal';
import { useNotification } from '../../context/NotificationContext';
import CreateFromTemplateModal from '../tasks/CreateFromTemplateModal';
import { isSameDay } from '../../utils/dateUtils';
import RecurringTaskUpdateModal from '../tasks/RecurringTaskUpdateModal';
import { expandRecurringEvents } from '../../utils/recurringEvents';
import { exportToCSV } from '../../utils/csvExporter';
import PrintableTaskList from '../tasks/PrintableTaskList';
import TaskWorkloadView from '../tasks/TaskWorkloadView';
import TaskAnalyticsView from '../tasks/TaskAnalyticsView';
import Dropdown, { DropdownItem } from '../ui/Dropdown';

type ViewMode = 'list' | 'kanban' | 'calendar' | 'gantt' | 'workload' | 'analytics';

interface FocusSuggestion {
    taskId: number;
    reason: string;
}

const Tasks: React.FC = () => {
    const { tasks, hasPermission, currentUser, deleteTask, deleteMultipleTasks, updateTask, addTaskDependency, removeTaskDependency, toggleTaskStar, updateRecurringTask, addTask, logActivity } = useApp();
    const { addToast } = useNotification();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [detailTask, setDetailTask] = useState<Task | null>(null);
    const [quickAddData, setQuickAddData] = useState<Partial<Task> | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [recurringUpdateState, setRecurringUpdateState] = useState<{task: Task, updateData: Partial<Task>} | null>(null);
    const [tasksToPrint, setTasksToPrint] = useState<Task[] | null>(null);

    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        assignedToId: 'all',
        searchTerm: '',
        isStarredOnly: false,
    });
    
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [batchAction, setBatchAction] = useState<'assign' | 'status' | 'priority' | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
    const [isGeneratingFocus, setIsGeneratingFocus] = useState(false);
    const [focusSuggestions, setFocusSuggestions] = useState<FocusSuggestion[]>([]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    const canManageTasks = hasPermission('gorev:yonet');
    
    const allVisibleTasks = useMemo(() => {
        // A simple view window for performance. In a real app, this would be more dynamic.
        const viewStart = new Date();
        viewStart.setMonth(viewStart.getMonth() - 2);
        const viewEnd = new Date();
        viewEnd.setMonth(viewEnd.getMonth() + 3);
        return expandRecurringEvents(tasks, viewStart, viewEnd);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const topLevelTasks = allVisibleTasks.filter(task => !task.parentId);

        return topLevelTasks.filter(task => {
            const searchMatch = task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                                task.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const statusMatch = filters.status === 'all' || task.status === filters.status;
            const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
            const assigneeMatch = filters.assignedToId === 'all' || task.assignedToId === parseInt(filters.assignedToId);
            const starredMatch = !filters.isStarredOnly || task.isStarred;
            
            return searchMatch && statusMatch && priorityMatch && starredMatch && assigneeMatch;
        });
    }, [allVisibleTasks, filters]);
    
    useEffect(() => {
        if (tasksToPrint) {
            // This function will be called after the print dialog is closed
            const handleAfterPrint = () => {
                setTasksToPrint(null);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
    
            window.addEventListener('afterprint', handleAfterPrint);
    
            // A very small timeout can still help ensure the DOM is updated before the print dialog opens.
            const printTimeout = setTimeout(() => {
                window.print();
            }, 50);
    
            // Cleanup function for the effect
            return () => {
                clearTimeout(printTimeout);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
        }
    }, [tasksToPrint]);

    const handleGenerateFocus = () => {
        setIsGeneratingFocus(true);
        setIsFocusModalOpen(true);
        setFocusSuggestions([]);

        const userTasks = allVisibleTasks.filter(t => t.assignedToId === currentUser.id && t.status !== TaskStatus.Completed);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const suggestions: FocusSuggestion[] = [];
        const addedTaskIds = new Set<number>();

        const addSuggestion = (task: Task, reason: string) => {
            if (!addedTaskIds.has(task.id) && suggestions.length < 5) {
                suggestions.push({ taskId: task.id, reason });
                addedTaskIds.add(task.id);
            }
        };

        // Rule 1: Overdue tasks (High priority first)
        userTasks
            .filter(t => new Date(t.dueDate) < today)
            .sort((a, b) => {
                if (a.priority === TaskPriority.High && b.priority !== TaskPriority.High) return -1;
                if (a.priority !== TaskPriority.High && b.priority === TaskPriority.High) return 1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // older ones first
            })
            .forEach(t => addSuggestion(t, "Bu görevin teslim tarihi geçti."));

        // Rule 2: High priority tasks due today
        userTasks
            .filter(t => isSameDay(new Date(t.dueDate), today) && t.priority === TaskPriority.High)
            .forEach(t => addSuggestion(t, "Bugün bitmesi gereken yüksek öncelikli bir görev."));

        // Rule 3: High priority tasks due tomorrow
        userTasks
            .filter(t => isSameDay(new Date(t.dueDate), tomorrow) && t.priority === TaskPriority.High)
            .forEach(t => addSuggestion(t, "Yarın bitmesi gereken yüksek öncelikli bir görev, bugünden başlamak iyi olabilir."));
        
        // Rule 4: Other tasks due today
        userTasks
            .filter(t => isSameDay(new Date(t.dueDate), today) && t.priority !== TaskPriority.High)
            .forEach(t => addSuggestion(t, "Bu görevin teslim tarihi bugün."));

        setFocusSuggestions(suggestions.slice(0, 5));
        setIsGeneratingFocus(false);
    };


    const handleApplyFocus = () => {
        focusSuggestions.forEach(s => toggleTaskStar(s.taskId));
        addToast(`${focusSuggestions.length} görev odak listesine eklendi.`, 'success');
        setFilters(prev => ({ ...prev, isStarredOnly: true }));
        setIsFocusModalOpen(false);
    };

    const handleOpenNewForm = () => {
        if (!canManageTasks) return;
        setEditingTask(null);
        setQuickAddData(null);
        setIsFormModalOpen(true);
    };
    
    const handleCalendarDayClick = (date: Date) => {
        if (!canManageTasks) return;
        setEditingTask(null);
        setQuickAddData({ 
            dueDate: date.toISOString().split('T')[0],
            startDate: date.toISOString().split('T')[0],
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (task: Task) => {
        if (!canManageTasks) return;
        setEditingTask(task);
        setQuickAddData(null);
        setDetailTask(null); // Close detail if editing
        setIsFormModalOpen(true);
    };

    const handleOpenDetailModal = (task: Task) => {
        setDetailTask(task);
    };
    
    const handleCloseDetailModal = () => {
        setDetailTask(null);
    };

    const handleRecurringAwareUpdate = (taskToUpdate: Task, updateData: Partial<Task>) => {
        if (taskToUpdate.seriesId && canManageTasks) {
            setRecurringUpdateState({ task: taskToUpdate, updateData });
        } else {
            updateTask({ ...taskToUpdate, ...updateData });
        }
    };
    
    const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
        const task = allVisibleTasks.find(t => t.id === taskId);
        if (task) {
            handleRecurringAwareUpdate(task, { status: newStatus });
        }
    };

    const handleBatchUpdate = (value: string | number) => {
        let updates: Partial<Pick<Task, 'assignedToId' | 'status' | 'priority'>> = {};
        switch(batchAction) {
            case 'assign': updates.assignedToId = value as number; break;
            case 'status': updates.status = value as TaskStatus; break;
            case 'priority': updates.priority = value as TaskPriority; break;
            default: return;
        }

        const tasksToUpdate = allVisibleTasks.filter(t => selectedIds.includes(t.id));

        tasksToUpdate.forEach(task => {
            if (task.seriesId) {
                // This is a virtual instance of a recurring task
                updateRecurringTask(task, updates, 'this', { silent: true });
            } else {
                // This is a regular task or a recurring series parent
                const originalTask = tasks.find(t => t.id === task.id);
                if (originalTask) {
                    updateTask({ ...originalTask, ...updates }, { silent: true });
                }
            }
        });

        if (tasksToUpdate.length > 0) {
            logActivity(ActionType.TASK_UPDATED_MULTIPLE, `${tasksToUpdate.length} görev toplu olarak güncellendi.`);
            addToast(`${tasksToUpdate.length} görev başarıyla güncellendi.`, 'success');
        }

        setBatchAction(null);
        setSelectedIds([]);
    };
    
    const handleDeleteMultipleConfirm = () => {
        deleteMultipleTasks(selectedIds);
        setIsDeleteConfirmOpen(false);
        setSelectedIds([]);
    };
    
    const handleDeleteRequest = (task: Task) => {
        if (!canManageTasks) return;
        setTaskToDelete(task);
    };

    const handleDeleteConfirm = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
        }
    };

    const handleDateDrop = (task: Task, newDate: Date) => {
        if (canManageTasks) {
            handleRecurringAwareUpdate(task, { dueDate: newDate.toISOString().split('T')[0] });
        }
    };
    
    const handleFormSubmit = (formData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[]) => {
        if (editingTask && editingTask.id) { // Editing existing task
            const originalTask = allVisibleTasks.find(t => t.id === editingTask.id) || editingTask;
             if (originalTask.seriesId) { // Editing an instance
                handleRecurringAwareUpdate(originalTask, formData);
            } else { // Editing a normal task or a series parent
                updateTask({ ...originalTask, ...formData });
            }
        } else { // Adding a new task
            addTask(formData, subtaskTitles);
        }
        setIsFormModalOpen(false);
        setEditingTask(null);
    };

    const handleListUpdate = (updatedTask: Task) => {
        const originalTask = allVisibleTasks.find(t => t.id === updatedTask.id);
        if (!originalTask) {
            updateTask(updatedTask); // Fallback
            return;
        }
    
        const changes: Partial<Task> = {};
        if (originalTask.status !== updatedTask.status) changes.status = updatedTask.status;
        if (originalTask.priority !== updatedTask.priority) changes.priority = updatedTask.priority;
        if (originalTask.assignedToId !== updatedTask.assignedToId) changes.assignedToId = updatedTask.assignedToId;
        
        if (Object.keys(changes).length > 0) {
            handleRecurringAwareUpdate(originalTask, changes);
        }
    };

    const handlePrint = () => {
        const selectedTasks = allVisibleTasks.filter(t => selectedIds.includes(t.id));
        if (selectedTasks.length > 0) {
            setTasksToPrint(selectedTasks);
        } else {
            addToast('Lütfen yazdırmak için en az bir görev seçin.', 'warning');
        }
    };

    const handleExport = () => {
        const selectedTasks = allVisibleTasks.filter(t => selectedIds.includes(t.id));
        if (selectedTasks.length > 0) {
            const dataToExport = selectedTasks.map(t => ({
                'Başlık': t.title,
                'Bitiş Tarihi': t.dueDate,
                'Durum': t.status,
                'Öncelik': t.priority,
                'Sorumlu': t.assignedToName
            }));
            exportToCSV(dataToExport, 'gorev-listesi.csv');
        } else {
            addToast('Lütfen dışa aktarmak için en az bir görev seçin.', 'warning');
        }
    };

    const handleEmail = () => {
        const selectedTasks = allVisibleTasks.filter(t => selectedIds.includes(t.id));
        if (selectedTasks.length > 0) {
            const subject = 'Görev Listesi';
            const body = 'Seçilen görevler:\n\n' + selectedTasks.map(t => 
                `- ${t.title} (Bitiş: ${t.dueDate}, Sorumlu: ${t.assignedToName}, Durum: ${t.status})`
            ).join('\n');
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            addToast('Lütfen e-posta göndermek için en az bir görev seçin.', 'warning');
        }
    };

    const renderBatchActionToolbar = () => {
        if (selectedIds.length === 0 || !canManageTasks) return null;
        return (
            <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-lg mb-4 flex items-center gap-4 flex-wrap">
                <span className="font-semibold">{selectedIds.length} görev seçildi.</span>
                <Button variant="secondary" onClick={() => setBatchAction('assign')}>Sorumlu Değiştir</Button>
                <Button variant="secondary" onClick={() => setBatchAction('status')}>Durum Değiştir</Button>
                <Button variant="secondary" onClick={() => setBatchAction('priority')}>Öncelik Değiştir</Button>
                <Button variant="secondary" onClick={handlePrint}>Yazdır</Button>
                <Button variant="secondary" onClick={handleExport}>Dışa Aktar (CSV)</Button>
                <Button variant="secondary" onClick={handleEmail}>E-posta Gönder</Button>
                <Button variant="danger" onClick={() => setIsDeleteConfirmOpen(true)}>Sil</Button>
            </div>
        );
    };
    
    const isAllTasksActive = filters.assignedToId === 'all';
    const isMyTasksActive = filters.assignedToId === currentUser.id.toString();

    const ViewButton: React.FC<{ mode: ViewMode, title: string, icon: JSX.Element }> = ({ mode, title, icon }) => (
        <button
            onClick={() => setViewMode(mode)}
            className={`p-1 rounded ${viewMode === mode ? 'bg-white dark:bg-slate-500 shadow' : ''}`}
            title={title}
        >
            {icon}
        </button>
    );

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <div className="p-4 border-b dark:border-dark-border">
                        <TaskFilterBar filters={filters} onFilterChange={setFilters} />
                    </div>
                    <div className="p-4 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md flex">
                                <button 
                                    onClick={() => setFilters({ ...filters, assignedToId: 'all' })} 
                                    className={`px-3 py-1 text-sm font-semibold rounded ${isAllTasksActive ? 'bg-white dark:bg-slate-500 shadow' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    Tüm Görevler
                                </button>
                                <button 
                                    onClick={() => setFilters({ ...filters, assignedToId: currentUser.id.toString() })} 
                                    className={`px-3 py-1 text-sm font-semibold rounded ${isMyTasksActive ? 'bg-white dark:bg-slate-500 shadow' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    Benim Görevlerim
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                                <ViewButton mode="list" title="Liste" icon={ICONS.list} />
                                <ViewButton mode="kanban" title="Kanban" icon={ICONS.kanban} />
                                <ViewButton mode="calendar" title="Takvim" icon={ICONS.calendar} />
                                <ViewButton mode="gantt" title="Gantt" icon={ICONS.gantt} />
                                <ViewButton mode="workload" title="İş Yükü" icon={ICONS.employees} />
                                <ViewButton mode="analytics" title="Analiz" icon={ICONS.analytics} />
                            </div>
                            {canManageTasks && (
                                <Dropdown
                                    trigger={<Button>Yeni...</Button>}
                                    menuPosition="right-0"
                                >
                                    <DropdownItem onClick={handleOpenNewForm}>{ICONS.add} Yeni Görev</DropdownItem>
                                    <DropdownItem onClick={() => setIsTemplateModalOpen(true)}>{ICONS.add} Şablondan Oluştur</DropdownItem>
                                    <DropdownItem onClick={handleGenerateFocus}>{ICONS.magic} Günün Odağını Belirle</DropdownItem>
                                </Dropdown>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        {renderBatchActionToolbar()}
                        {viewMode === 'list' && (
                            <TaskListView 
                                tasks={filteredTasks}
                                onTaskClick={handleOpenDetailModal}
                                selectedIds={selectedIds}
                                onSelectionChange={setSelectedIds}
                                onUpdateTask={handleListUpdate}
                                onDeleteRequest={handleDeleteRequest}
                                onEditRequest={handleOpenEditForm}
                            />
                        )}
                        {viewMode === 'kanban' && (
                            <TaskKanbanView 
                                tasks={filteredTasks}
                                onTaskClick={handleOpenDetailModal}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                        {viewMode === 'calendar' && (
                            <TaskCalendarView
                                tasks={allVisibleTasks}
                                onTaskClick={handleOpenDetailModal}
                                onDateDrop={handleDateDrop}
                                onNewTask={handleCalendarDayClick}
                            />
                        )}
                        {viewMode === 'gantt' && (
                            <TaskGanttView
                                tasks={filteredTasks}
                                onTaskClick={handleOpenDetailModal}
                                onAddTaskDependency={addTaskDependency}
                                onRemoveTaskDependency={removeTaskDependency}
                            />
                        )}
                        {viewMode === 'workload' && <TaskWorkloadView />}
                        {viewMode === 'analytics' && <TaskAnalyticsView />}
                    </div>
                </Card>

                {isFormModalOpen && canManageTasks && (
                    <TaskFormModal 
                        isOpen={isFormModalOpen}
                        onClose={() => setIsFormModalOpen(false)}
                        task={editingTask}
                        prefilledData={quickAddData}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {detailTask && (
                    <TaskDetailModal
                        task={detailTask}
                        isOpen={!!detailTask}
                        onClose={handleCloseDetailModal}
                        onEdit={handleOpenEditForm}
                    />
                )}
                
                {isTemplateModalOpen && canManageTasks && (
                    <CreateFromTemplateModal
                        isOpen={isTemplateModalOpen}
                        onClose={() => setIsTemplateModalOpen(false)}
                    />
                )}

                <Modal isOpen={isFocusModalOpen} onClose={() => setIsFocusModalOpen(false)} title="✨ Günün Odak Listesi">
                    {isGeneratingFocus ? (
                        <div className="text-center p-8">Sizin için en önemli görevler analiz ediliyor...</div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Bugün odaklanmanız için önerilen görevler:</p>
                            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {focusSuggestions.map(suggestion => {
                                const task = allVisibleTasks.find(t => t.id === suggestion.taskId);
                                if (!task) return null;
                                return (
                                    <li key={suggestion.taskId} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-primary-600 dark:text-primary-400 italic mt-1">"{suggestion.reason}"</p>
                                    </li>
                                )
                            })}
                            </ul>
                            <div className="flex justify-end gap-2 pt-4 border-t dark:border-dark-border">
                                <Button variant="secondary" onClick={() => setIsFocusModalOpen(false)}>Kapat</Button>
                                <Button onClick={handleApplyFocus}>Önerileri Yıldızla</Button>
                            </div>
                        </div>
                    )}
                </Modal>

                {batchAction && canManageTasks && (
                    <BatchActionModal
                        isOpen={!!batchAction}
                        onClose={() => setBatchAction(null)}
                        onConfirm={handleBatchUpdate}
                        action={batchAction}
                        itemCount={selectedIds.length}
                    />
                )}

                 {recurringUpdateState && (
                    <RecurringTaskUpdateModal
                        isOpen={!!recurringUpdateState}
                        onClose={() => setRecurringUpdateState(null)}
                        onConfirm={(scope) => {
                            if (recurringUpdateState) {
                                updateRecurringTask(recurringUpdateState.task, recurringUpdateState.updateData, scope);
                            }
                            setRecurringUpdateState(null);
                        }}
                    />
                )}

                {canManageTasks && (
                    <>
                        <ConfirmationModal
                            isOpen={isDeleteConfirmOpen}
                            onClose={() => setIsDeleteConfirmOpen(false)}
                            onConfirm={handleDeleteMultipleConfirm}
                            title={`${selectedIds.length} Görevi Sil`}
                            message={`${selectedIds.length} görevi ve bunlara bağlı tüm alt görevleri kalıcı olarak silmek istediğinizden emin misiniz?`}
                        />
                        <ConfirmationModal
                            isOpen={!!taskToDelete}
                            onClose={() => setTaskToDelete(null)}
                            onConfirm={handleDeleteConfirm}
                            title="Görevi Sil"
                            message={`'${taskToDelete?.title}' adlı görevi ve tüm alt görevlerini kalıcı olarak silmek istediğinizden emin misiniz?`}
                        />
                    </>
                )}
            </div>
            {tasksToPrint && <PrintableTaskList tasks={tasksToPrint} />}
        </>
    );
};

export default Tasks;

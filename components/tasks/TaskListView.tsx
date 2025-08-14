

import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';

interface TaskListViewProps {
    tasks: Task[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onTaskClick: (task: Task) => void;
    onUpdateTask: (task: Task) => void;
    onDeleteRequest: (task: Task) => void;
    onEditRequest: (task: Task) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, selectedIds, onSelectionChange, onTaskClick, onUpdateTask, onDeleteRequest, onEditRequest }) => {
    const { tasks: allTasks, hasPermission, toggleTaskStar, employees } = useApp();
    const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
    const [editingCell, setEditingCell] = useState<{ id: number; key: 'status' | 'priority' | 'assignedToId' } | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);


    const canManageTasks = hasPermission('gorev:yonet');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getPriorityIcon = (priority: TaskPriority) => {
        const styles: { [key in TaskPriority]: { icon: React.ReactNode, color: string } } = {
            [TaskPriority.Low]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: 'text-slate-500' },
            [TaskPriority.Normal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>, color: 'text-blue-500' },
            [TaskPriority.High]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: 'text-yellow-500' },
        };
        return <span title={priority} className={styles[priority].color}>{styles[priority].icon}</span>;
    };

    const getStatusBadge = (status: TaskStatus) => {
        const styles: { [key in TaskStatus]: string } = {
            [TaskStatus.Todo]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
            [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [TaskStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const getSubtaskProgress = (task: Task) => {
        const subtasks = allTasks.filter(t => t.parentId === task.id);
        if (subtasks.length === 0) return null;

        const completed = subtasks.filter(st => st.status === TaskStatus.Completed).length;
        const total = subtasks.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return (
            <div className="w-24">
                <div className="flex justify-between text-xs text-text-secondary dark:text-dark-text-secondary">
                    <span>{completed}/{total}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700 mt-1">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        );
    };

    const handleToggleExpand = (taskId: number) => {
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onSelectionChange(tasks.map(t => t.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const handleInlineUpdate = (task: Task, key: 'status' | 'priority' | 'assignedToId', value: string | number) => {
        onUpdateTask({ ...task, [key]: value });
        setEditingCell(null);
    };
    
    const renderTaskRow = (task: Task, level: number) => {
        const subtasks = allTasks.filter(t => t.parentId === task.id);
        const hasSubtasks = subtasks.length > 0;
        const isExpanded = expandedTasks.has(task.id);
        const isSelected = selectedIds.includes(task.id);

        return (
            <Fragment key={task.id}>
                <tr className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50 group">
                    <td className="p-4" style={{ paddingLeft: `${level * 24 + 16}px` }}>
                         <div className="flex items-center gap-2">
                             <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleSelectOne(e, task.id)}
                                disabled={!canManageTasks}
                             />
                             <button onClick={() => toggleTaskStar(task.id)} className={`text-slate-400 hover:text-yellow-500 ${task.isStarred ? 'text-yellow-400' : ''}`}>
                                 {task.isStarred ? ICONS.starFilled : ICONS.starOutline}
                             </button>
                             {hasSubtasks ? (
                                <button onClick={() => handleToggleExpand(task.id)} className="text-slate-500">
                                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                             ) : <div className="w-4 h-4" />}
                             <span className="font-medium cursor-pointer" onClick={() => onTaskClick(task)}>{task.title}</span>
                         </div>
                    </td>
                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary" onClick={() => canManageTasks && setEditingCell({ id: task.id, key: 'assignedToId' })}>
                         {editingCell?.id === task.id && editingCell.key === 'assignedToId' ? (
                            <select
                                defaultValue={task.assignedToId}
                                onBlur={() => setEditingCell(null)}
                                onChange={(e) => handleInlineUpdate(task, 'assignedToId', parseInt(e.target.value))}
                                autoFocus
                                className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            >
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        ) : (
                            <span className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded">{task.assignedToName}</span>
                        )}
                    </td>
                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{task.dueDate}</td>
                    <td className="p-4" onClick={() => canManageTasks && setEditingCell({ id: task.id, key: 'priority' })}>
                         {editingCell?.id === task.id && editingCell.key === 'priority' ? (
                            <select
                                defaultValue={task.priority}
                                onBlur={() => setEditingCell(null)}
                                onChange={(e) => handleInlineUpdate(task, 'priority', e.target.value)}
                                autoFocus
                                className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            >
                                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                         ) : <div className="cursor-pointer">{getPriorityIcon(task.priority)}</div>}
                    </td>
                    <td className="p-4">{getSubtaskProgress(task) || '-'}</td>
                    <td className="p-4" onClick={() => canManageTasks && setEditingCell({ id: task.id, key: 'status' })}>
                         {editingCell?.id === task.id && editingCell.key === 'status' ? (
                            <select
                                defaultValue={task.status}
                                onBlur={() => setEditingCell(null)}
                                onChange={(e) => handleInlineUpdate(task, 'status', e.target.value)}
                                autoFocus
                                className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            >
                                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                         ) : <div className="cursor-pointer">{getStatusBadge(task.status)}</div>}
                    </td>
                    {canManageTasks && <td className="p-4">
                        <div className="relative opacity-0 group-hover:opacity-100">
                            <button onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}>
                                {ICONS.ellipsisVertical}
                            </button>
                            {openMenuId === task.id && (
                                <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-md shadow-lg z-20">
                                    <ul className="py-1">
                                        <li><button onClick={() => { onEditRequest(task); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.edit} Düzenle</button></li>
                                        <li><button onClick={() => { onDeleteRequest(task); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.trash} Sil</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </td>}
                </tr>
                {isExpanded && subtasks.map(subtask => renderTaskRow(subtask, level + 1))}
            </Fragment>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-slate-200 dark:border-dark-border">
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-4 font-semibold w-[40%]">
                            <input type="checkbox" onChange={handleSelectAll} disabled={!canManageTasks} className="mr-4"/>
                            Başlık
                        </th>
                        <th className="p-4 font-semibold">Sorumlu</th>
                        <th className="p-4 font-semibold">Bitiş Tarihi</th>
                        <th className="p-4 font-semibold">Öncelik</th>
                        <th className="p-4 font-semibold">Alt Görevler</th>
                        <th className="p-4 font-semibold">Durum</th>
                        {canManageTasks && <th className="p-4 font-semibold">Eylemler</th>}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => renderTaskRow(task, 0))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskListView;

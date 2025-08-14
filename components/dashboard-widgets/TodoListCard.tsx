import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Task, TaskStatus } from '../../../types';

const TodoListCard: React.FC = () => {
    const { tasks, currentUser, updateTaskStatus, hasPermission } = useApp();
    const canManageTasks = hasPermission('gorev:yonet');

    const myTasks = tasks
        .filter(task => task.assignedToId === currentUser.id && task.status !== TaskStatus.Completed)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5); // Show top 5 tasks

    const handleToggleStatus = (task: Task) => {
        if (!canManageTasks) return;
        const newStatus = task.status === TaskStatus.Completed ? TaskStatus.InProgress : TaskStatus.Completed;
        updateTaskStatus(task.id, newStatus);
    };

    return (
        <div className="h-full flex flex-col">
            {myTasks.length > 0 ? (
                <ul className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {myTasks.map(task => (
                        <li key={task.id} className="flex items-start">
                            <input
                                type="checkbox"
                                checked={task.status === TaskStatus.Completed}
                                onChange={() => handleToggleStatus(task)}
                                className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 mt-0.5 cursor-pointer disabled:cursor-not-allowed"
                                id={`task-widget-${task.id}`}
                                disabled={!canManageTasks}
                            />
                            <label htmlFor={`task-widget-${task.id}`} className="ml-3 cursor-pointer">
                                <p className={`font-medium text-sm text-text-main dark:text-dark-text-main ${task.status === TaskStatus.Completed ? 'line-through text-text-secondary dark:text-dark-text-secondary' : ''}`}>
                                    {task.title}
                                </p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                    Bitiş Tarihi: {task.dueDate}
                                </p>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary py-4">
                        Size atanmış aktif bir görev bulunmuyor. Harika iş!
                    </p>
                </div>
            )}
            <div className="mt-4 border-t border-border dark:border-dark-border pt-3 text-center">
                <Link to="/planner" className="text-sm font-semibold text-primary-600 hover:underline">
                    Tüm Görevleri Gör
                </Link>
            </div>
        </div>
    );
};

export default TodoListCard;
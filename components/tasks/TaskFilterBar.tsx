import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';

interface TaskFilterBarProps {
  filters: {
    status: string;
    priority: string;
    assignedToId: string;
    searchTerm: string;
    isStarredOnly: boolean;
  };
  onFilterChange: (filters: TaskFilterBarProps['filters']) => void;
}

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({ filters, onFilterChange }) => {
  const { employees } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  const toggleStarredFilter = () => {
      onFilterChange({ ...filters, isStarredOnly: !filters.isStarredOnly });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
      <input
        type="text"
        name="searchTerm"
        placeholder="Görev ara..."
        value={filters.searchTerm}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border col-span-1 md:col-span-2 lg:col-span-1"
      />
      <select
        name="status"
        value={filters.status}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
      >
        <option value="all">Tüm Durumlar</option>
        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        name="priority"
        value={filters.priority}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
      >
        <option value="all">Tüm Öncelikler</option>
        {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        name="assignedToId"
        value={filters.assignedToId}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
      >
        <option value="all">Tüm Sorumlular</option>
        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <Button
          variant={filters.isStarredOnly ? 'primary' : 'secondary'}
          onClick={toggleStarredFilter}
          className="w-full"
      >
          <span className="flex items-center justify-center gap-2">{ICONS.starFilled} Yıldızlı</span>
      </Button>
    </div>
  );
};

export default TaskFilterBar;

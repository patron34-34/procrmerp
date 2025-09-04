import React from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';

interface SalesFilterBarProps {
  filters: { assignedToId: string; closeDateStart: string; closeDateEnd: string; showStale: boolean; };
  setFilters: (filters: { assignedToId: string; closeDateStart: string; closeDateEnd: string; showStale: boolean; }) => void;
}

const SalesFilterBar: React.FC<SalesFilterBarProps> = ({ filters, setFilters }) => {
  const { employees } = useApp();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setFilters({ ...filters, [name]: isCheckbox ? checked : value });
  };
  
  const handleClearFilters = () => {
    setFilters({ assignedToId: 'all', closeDateStart: '', closeDateEnd: '', showStale: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card dark:bg-dark-card rounded-lg border dark:border-dark-border">
      <div>
        <label htmlFor="assignedToId" className="sr-only">Sorumlu</label>
        <select 
          name="assignedToId" 
          id="assignedToId"
          value={filters.assignedToId} 
          onChange={handleFilterChange} 
          className="w-full sm:w-auto p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
        >
          <option value="all">Tüm Sorumlular</option>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="closeDateStart" className="text-sm">Kapanış Tarihi:</label>
        <input 
          type="date" 
          name="closeDateStart"
          id="closeDateStart"
          value={filters.closeDateStart}
          onChange={handleFilterChange}
          className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
        />
        <span>-</span>
        <input 
          type="date" 
          name="closeDateEnd"
          id="closeDateEnd"
          value={filters.closeDateEnd}
          onChange={handleFilterChange}
          className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
        />
      </div>
      <div className="flex items-center">
        <input 
            type="checkbox"
            id="showStale"
            name="showStale"
            checked={filters.showStale}
            onChange={handleFilterChange}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="showStale" className="ml-2 block text-sm">İşlem Görmeyenleri Göster</label>
      </div>
      <Button onClick={handleClearFilters} variant="secondary">Filtreleri Temizle</Button>
    </div>
  );
};

export default SalesFilterBar;
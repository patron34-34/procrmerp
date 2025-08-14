
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog, ActionType } from '../../types';
import Card from '../ui/Card';

const ActivityLogPage: React.FC = () => {
    const { activityLogs, employees } = useApp();

    const [filters, setFilters] = useState({
        user: 'all',
        action: 'all',
        startDate: '',
        endDate: '',
        search: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredLogs = useMemo(() => {
        return activityLogs.filter(log => {
            if (filters.user !== 'all' && log.userId !== parseInt(filters.user)) {
                return false;
            }
            if (filters.action !== 'all' && log.actionType !== filters.action) {
                return false;
            }
            const logDate = new Date(log.timestamp);
            if (filters.startDate && logDate < new Date(filters.startDate)) {
                return false;
            }
            if (filters.endDate) {
                 const endDate = new Date(filters.endDate);
                 endDate.setHours(23, 59, 59, 999); // Include the whole day
                 if(logDate > endDate) return false;
            }
            if (filters.search && !log.details.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [activityLogs, filters]);

    return (
        <Card title="Aktivite Kayıtları">
            <div className="p-4 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Detaylarda Ara</label>
                        <input type="text" name="search" id="search" value={filters.search} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                     <div>
                        <label htmlFor="user" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Kullanıcı</label>
                        <select name="user" id="user" value={filters.user} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Kullanıcılar</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="action" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Eylem Türü</label>
                        <select name="action" id="action" value={filters.action} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Eylemler</option>
                            {Object.values(ActionType).map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Başlangıç Tarihi</label>
                        <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Bitiş Tarihi</label>
                        <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200 dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-4 font-semibold">Kullanıcı</th>
                            <th className="p-4 font-semibold">Eylem</th>
                            <th className="p-4 font-semibold">Detaylar</th>
                            <th className="p-4 font-semibold">Tarih ve Saat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={log.userAvatar} alt={log.userName} className="h-9 w-9 rounded-full"/>
                                        <span className="font-medium">{log.userName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                        {log.actionType}
                                    </span>
                                </td>
                                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{log.details}</td>
                                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{new Date(log.timestamp).toLocaleString('tr-TR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredLogs.length === 0 && (
                    <div className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">
                        Filtre kriterlerine uygun aktivite kaydı bulunamadı.
                    </div>
                 )}
            </div>
        </Card>
    );
};

export default ActivityLogPage;

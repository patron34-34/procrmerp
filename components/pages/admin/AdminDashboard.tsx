import React from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { employees, roles, activityLogs } = useApp();

    const stats = {
        totalUsers: employees.length,
        activeUsers: employees.length > 1 ? employees.length - 1 : employees.length, // Mock data
        totalRoles: roles.length,
    };

    // Mock data for the chart
    const dataGrowthData = [
        { name: 'Oca', Müşteriler: 4, Anlaşmalar: 2, Projeler: 1 },
        { name: 'Şub', Müşteriler: 3, Anlaşmalar: 5, Projeler: 2 },
        { name: 'Mar', Müşteriler: 6, Anlaşmalar: 4, Projeler: 3 },
        { name: 'Nis', Müşteriler: 5, Anlaşmalar: 7, Projeler: 4 },
        { name: 'May', Müşteriler: 8, Anlaşmalar: 6, Projeler: 5 },
        { name: 'Haz', Müşteriler: 7, Anlaşmalar: 9, Projeler: 6 },
    ];
    
    const recentActivities = activityLogs.slice(0, 5);

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main">Admin Kontrol Paneli</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Kullanıcı</h4><p className="text-3xl font-bold">{stats.totalUsers}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Aktif Kullanıcı (24s)</h4><p className="text-3xl font-bold">{stats.activeUsers}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Tanımlı Rol Sayısı</h4><p className="text-3xl font-bold">{stats.totalRoles}</p></Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Sistem Durumu</h4>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-lg font-bold text-green-600">Tüm Sistemler Çalışır Durumda</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Veri Büyüme Oranı (Son 6 Ay)" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Legend />
                            <Bar dataKey="Müşteriler" fill="#3b82f6" />
                            <Bar dataKey="Anlaşmalar" fill="#16a34a" />
                            <Bar dataKey="Projeler" fill="#f97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Son Aktiviteler">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {recentActivities.length > 0 ? recentActivities.map(log => (
                            <div key={log.id} className="flex items-start gap-3">
                                <img src={log.userAvatar} alt={log.userName} className="h-9 w-9 rounded-full"/>
                                <div>
                                    <p className="text-sm text-text-main dark:text-dark-text-main">
                                        <span className="font-semibold">{log.userName}</span> {log.details}
                                    </p>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-text-secondary dark:text-dark-text-secondary py-4">Sistemde henüz aktivite yok.</p>
                        )}
                    </div>
                     <div className="mt-4 border-t border-slate-200 dark:border-dark-border pt-2 text-center">
                        <Link to="/activity-log" className="text-sm font-semibold text-primary-600 hover:underline">Tümünü Gör</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;

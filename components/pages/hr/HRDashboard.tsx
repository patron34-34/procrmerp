import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeaveStatus } from '../../../types';
import { Link } from 'react-router-dom';

const HRDashboard: React.FC = () => {
    const { employees, leaveRequests } = useApp();

    const stats = useMemo(() => {
        const totalEmployees = employees.length;
        const pendingLeaves = leaveRequests.filter(lr => lr.status === LeaveStatus.Pending).length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newHires = employees.filter(e => new Date(e.hireDate) >= thirtyDaysAgo).length;

        return { totalEmployees, pendingLeaves, newHires };
    }, [employees, leaveRequests]);

    const departmentData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        employees.forEach(e => {
            counts[e.department] = (counts[e.department] || 0) + 1;
        });
        return Object.keys(counts).map(name => ({ name, 'Çalışan Sayısı': counts[name] }));
    }, [employees]);

    const upcomingAnniversaries = useMemo(() => {
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);
        
        return employees.filter(e => {
            const hireDate = new Date(e.hireDate);
            const anniversaryThisYear = new Date(today.getFullYear(), hireDate.getMonth(), hireDate.getDate());
            return anniversaryThisYear >= today && anniversaryThisYear <= next30Days;
        }).sort((a,b) => new Date(a.hireDate).getMonth() - new Date(b.hireDate).getMonth());
    }, [employees]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Çalışan</h4>
                    <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Bekleyen İzin Talepleri</h4>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingLeaves}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Yeni İşe Alımlar (Son 30 Gün)</h4>
                    <p className="text-3xl font-bold text-green-500">{stats.newHires}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Departmanlara Göre Çalışan Dağılımı" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#94a3b8' }} />
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }} />
                            <Bar dataKey="Çalışan Sayısı" fill="#3b82f6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Yaklaşan İş Yıl Dönümleri">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {upcomingAnniversaries.length > 0 ? upcomingAnniversaries.map(employee => {
                            const hireDate = new Date(employee.hireDate);
                            const years = new Date().getFullYear() - hireDate.getFullYear();
                            return (
                                <div key={employee.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={employee.avatar} alt={employee.name} className="w-9 h-9 rounded-full"/>
                                        <div>
                                            <Link to={`/hr/employees/${employee.id}`} className="font-semibold text-sm hover:underline">{employee.name}</Link>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{years}. Yılını Kutlayacak</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{hireDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })}</span>
                                </div>
                            )
                        }) : <p className="text-center text-text-secondary dark:text-dark-text-secondary py-4">Yaklaşan yıl dönümü yok.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HRDashboard;

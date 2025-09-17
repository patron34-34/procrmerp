
import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const DemographicsReport: React.FC = () => {
    const { employees } = useApp();

    const ageData = useMemo(() => {
        const ageGroups: { [key: string]: number } = {
            '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0
        };
        employees.forEach(e => {
            if (!e.dogumTarihi) return;
            const birthDate = new Date(e.dogumTarihi);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            if (age <= 25) ageGroups['18-25']++;
            else if (age <= 35) ageGroups['26-35']++;
            else if (age <= 45) ageGroups['36-45']++;
            else if (age <= 55) ageGroups['46-55']++;
            else ageGroups['56+']++;
        });
        return Object.keys(ageGroups).map(name => ({ name, 'Çalışan Sayısı': ageGroups[name] }));
    }, [employees]);

    const genderData = useMemo(() => {
        const counts = employees.reduce((acc, e) => {
            const gender = e.cinsiyet || 'Belirtilmemiş';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        return Object.keys(counts).map(name => ({ name, value: counts[name] }));
    }, [employees]);
    
    const departmentData = useMemo(() => {
        const counts = employees.reduce((acc, e) => {
            acc[e.department] = (acc[e.department] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        return Object.keys(counts).map(name => ({ name, 'Çalışan Sayısı': counts[name] }));
    }, [employees]);

    const GENDER_COLORS = { 'Kadın': '#ec4899', 'Erkek': '#3b82f6', 'Belirtilmemiş': '#64748b' };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Demografi Raporu</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Cinsiyet Dağılımı">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Departmanlara Göre Dağılım">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Çalışan Sayısı" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Yaş Dağılımı" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Çalışan Sayısı" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default DemographicsReport;

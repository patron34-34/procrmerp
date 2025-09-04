import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import Card from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { generateProductivitySummary } from '../../services/geminiService';
import { useNotification } from '../../context/NotificationContext';

const TaskAnalyticsView: React.FC = () => {
    const { tasks, employees } = useApp();
    const { addToast } = useNotification();

    const [summary, setSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const analyticsData = useMemo(() => {
        const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed);
        
        const tasksPerPerson = employees.map(emp => {
            const completed = completedTasks.filter(t => t.assignedToId === emp.id).length;
            return { name: emp.name, 'Tamamlanan Görev': completed };
        }).filter(item => item['Tamamlanan Görev'] > 0);

        const statusDistribution = Object.values(TaskStatus).map(status => ({
            name: status,
            value: tasks.filter(t => t.status === status).length,
        }));

        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Completed).length;
        
        return {
            tasksPerPerson,
            statusDistribution,
            totalTasks: tasks.length,
            completedTasks: completedTasks.length,
            overdueTasks
        };
    }, [tasks, employees]);

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        setSummary('');
        try {
            const dataForAI = {
                totalTasks: analyticsData.totalTasks,
                completedTasks: analyticsData.completedTasks,
                overdueTasks: analyticsData.overdueTasks,
                tasksCompletedByUser: analyticsData.tasksPerPerson,
            };
            const result = await generateProductivitySummary(dataForAI);
            setSummary(result);
        } catch (error) {
            console.error(error);
            addToast("Özet oluşturulurken bir hata oluştu.", "error");
        } finally {
            setIsGenerating(false);
        }
    };


    const PIE_COLORS: { [key in TaskStatus]: string } = {
        [TaskStatus.Todo]: '#64748b',
        [TaskStatus.InProgress]: '#3b82f6',
        [TaskStatus.Completed]: '#22c55e',
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><h4 className="text-text-secondary">Toplam Görev</h4><p className="text-3xl font-bold">{analyticsData.totalTasks}</p></Card>
                <Card><h4 className="text-text-secondary">Tamamlanan Görev</h4><p className="text-3xl font-bold">{analyticsData.completedTasks}</p></Card>
                <Card><h4 className="text-text-secondary">Gecikmiş Görev</h4><p className="text-3xl font-bold text-red-500">{analyticsData.overdueTasks}</p></Card>
            </div>

            <Card title="AI Verimlilik Özeti">
                <div className="flex flex-col items-start gap-4">
                    <Button onClick={handleGenerateSummary} disabled={isGenerating}>
                        <span className="flex items-center gap-2">{ICONS.magic} {isGenerating ? 'Oluşturuluyor...' : 'Özet Oluştur'}</span>
                    </Button>
                    {isGenerating && <div className="spinner"></div>}
                    {summary && <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg w-full whitespace-pre-wrap">{summary}</div>}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Kişiye Göre Tamamlanan Görevler">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.tasksPerPerson}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }} />
                            <Bar dataKey="Tamamlanan Görev" fill="var(--primary-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Görev Durum Dağılımı">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as TaskStatus]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default TaskAnalyticsView;

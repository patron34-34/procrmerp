import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Employee } from '../../types';
import { getWeekDays, getWeekRangeText } from '../../utils/dateUtils';
import Button from '../ui/Button';

const TaskWorkloadView: React.FC = () => {
    const { tasks, employees } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

    const workloadData = useMemo(() => {
        const data = new Map<number, { [date: string]: number }>();
        employees.forEach(emp => data.set(emp.id, {}));

        tasks.forEach(task => {
            if (task.estimatedTime && task.startDate && task.dueDate) {
                const startDate = new Date(task.startDate);
                const endDate = new Date(task.dueDate);
                const durationDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1);
                const dailyMinutes = task.estimatedTime / durationDays;

                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    const employeeWorkload = data.get(task.assignedToId);
                    if (employeeWorkload) {
                        employeeWorkload[dateStr] = (employeeWorkload[dateStr] || 0) + dailyMinutes;
                    }
                }
            }
        });
        return data;
    }, [tasks, employees]);
    
    const changeWeek = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (7 * amount));
            return newDate;
        });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => changeWeek(-1)}>&lt; Önceki Hafta</Button>
                    <Button variant="secondary" onClick={() => changeWeek(1)}>Sonraki Hafta &gt;</Button>
                </div>
                 <h3 className="text-lg font-semibold">{getWeekRangeText(currentDate)}</h3>
            </div>
            <div className="overflow-x-auto border rounded-lg dark:border-dark-border">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-3 font-semibold sticky left-0 bg-slate-50 dark:bg-slate-900/50 min-w-[200px]">Çalışan</th>
                            {weekDays.map(day => (
                                <th key={day.toISOString()} className="p-3 font-semibold text-center min-w-[100px]">
                                    {day.toLocaleDateString('tr-TR', { weekday: 'short' })}
                                    <span className="block font-normal text-xs">{day.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' })}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} className="border-b dark:border-dark-border">
                                <td className="p-2 font-medium sticky left-0 bg-white dark:bg-dark-card">
                                    <div className="flex items-center gap-2">
                                        <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full" />
                                        <span>{emp.name}</span>
                                    </div>
                                </td>
                                {weekDays.map(day => {
                                    const dateStr = day.toISOString().split('T')[0];
                                    const totalMinutes = workloadData.get(emp.id)?.[dateStr] || 0;
                                    const totalHours = totalMinutes / 60;
                                    const isOverloaded = totalHours > 8;

                                    return (
                                        <td key={dateStr} className={`p-3 text-center font-mono ${isOverloaded ? 'bg-red-100 dark:bg-red-900/50' : ''}`}>
                                            {totalHours > 0 ? `${totalHours.toFixed(1)}s` : '-'}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskWorkloadView;

import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { LeaveStatus, ExpenseStatus, TaskStatus } from '../../../types';
import { Link } from 'react-router-dom';
import { ICONS } from '../../../constants';

const MyTeam: React.FC = () => {
    const { currentUser, employees, leaveRequests, expenses, updateLeaveRequestStatus, updateExpenseStatus, tasks } = useApp();

    const myTeam = useMemo(() => {
        return employees.filter(e => e.managerId === currentUser.id);
    }, [employees, currentUser.id]);

    const myTeamIds = useMemo(() => myTeam.map(e => e.id), [myTeam]);

    const pendingLeaveRequests = useMemo(() => {
        return leaveRequests.filter(lr => myTeamIds.includes(lr.employeeId) && lr.status === LeaveStatus.Pending);
    }, [leaveRequests, myTeamIds]);
    
    const pendingExpenses = useMemo(() => {
        return expenses.filter(e => myTeamIds.includes(e.employeeId) && e.status === ExpenseStatus.Pending);
    }, [expenses, myTeamIds]);

    const teamUpcomingLeaves = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return leaveRequests
            .filter(lr => myTeamIds.includes(lr.employeeId) && lr.status === LeaveStatus.Approved && new Date(lr.startDate) >= today)
            .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5);
    }, [leaveRequests, myTeamIds]);
    
    const teamStats = useMemo(() => {
        const teamTasks = tasks.filter(t => myTeamIds.includes(t.assignedToId));
        return {
            memberCount: myTeam.length,
            openTasks: teamTasks.filter(t => t.status !== TaskStatus.Completed).length,
            overdueTasks: teamTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Completed).length,
        };
    }, [myTeamIds, tasks, myTeam.length]);


    const getStatusBadge = (type: 'leave' | 'expense', status: LeaveStatus | ExpenseStatus) => {
        if(type === 'leave') {
            const styles = { [LeaveStatus.Pending]: 'bg-yellow-100 text-yellow-800' };
            return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as LeaveStatus]}`}>{status}</span>
        }
        const styles = { [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800' };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as ExpenseStatus]}`}>{status}</span>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Yönetici Paneli: Ekibim</h1>

            <Card title="Ekip Genel Durumu">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-text-secondary">Ekip Üyesi</p>
                        <p className="font-bold text-2xl">{teamStats.memberCount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Açık Görevler</p>
                        <p className="font-bold text-2xl">{teamStats.openTasks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Gecikmiş Görevler</p>
                        <p className={`font-bold text-2xl ${teamStats.overdueTasks > 0 ? 'text-red-500' : ''}`}>{teamStats.overdueTasks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Onay Bekleyenler</p>
                        <p className="font-bold text-2xl text-yellow-500">{pendingLeaveRequests.length + pendingExpenses.length}</p>
                    </div>
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card title={`Onay Kuyruğu (${pendingLeaveRequests.length + pendingExpenses.length})`}>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {pendingLeaveRequests.length === 0 && pendingExpenses.length === 0 ? (
                                <p className="text-text-secondary text-center py-4">Onayınızı bekleyen bir talep bulunmuyor.</p>
                            ) : (
                                <>
                                    {pendingLeaveRequests.map(req => (
                                        <div key={`leave-${req.id}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{req.employeeName}</p>
                                                <p className="text-sm text-text-secondary">{req.leaveType}: {req.startDate} - {req.endDate}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 {getStatusBadge('leave', req.status)}
                                                <Button size="sm" onClick={() => updateLeaveRequestStatus(req.id, LeaveStatus.Approved)}>Onayla</Button>
                                                <Button size="sm" variant="danger" onClick={() => updateLeaveRequestStatus(req.id, LeaveStatus.Rejected)}>Reddet</Button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingExpenses.map(exp => (
                                         <div key={`exp-${exp.id}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{exp.employeeName}</p>
                                                <p className="text-sm text-text-secondary" title={exp.description}>{exp.category}: <span className="font-mono">${exp.amount}</span></p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge('expense', exp.status)}
                                                <Button size="sm" onClick={() => updateExpenseStatus(exp.id, ExpenseStatus.Approved)}>Onayla</Button>
                                                <Button size="sm" variant="danger" onClick={() => updateExpenseStatus(exp.id, ExpenseStatus.Rejected)}>Reddet</Button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </Card>

                    <Card title="Takım İzin Takvimi (Yaklaşan)">
                         <div className="space-y-2">
                            {teamUpcomingLeaves.length > 0 ? teamUpcomingLeaves.map(leave => (
                                <div key={leave.id} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary-600">{ICONS.calendar}</span>
                                        <span className="font-semibold">{leave.employeeName}</span>
                                    </div>
                                    <span className="text-sm">{leave.startDate} - {leave.endDate} ({leave.leaveType})</span>
                                </div>
                            )) : <p className="text-text-secondary text-center py-4">Yaklaşan izin bulunmuyor.</p>}
                        </div>
                    </Card>
                </div>
                
                <div className="lg:col-span-1">
                    <Card title="Ekip Üyeleri">
                         <div className="space-y-3">
                            {myTeam.map(member => (
                                <Link key={member.id} to={`/hr/employees/${member.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="font-semibold text-sm">{member.name}</p>
                                        <p className="text-xs text-text-secondary">{member.position}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyTeam;

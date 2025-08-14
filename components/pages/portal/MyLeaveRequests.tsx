
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

const MyLeaveRequests: React.FC = () => {
    const { currentUser, leaveRequests, addLeaveRequest } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<LeaveRequest, 'id' | 'employeeName' | 'status' | 'employeeId'> = {
        leaveType: LeaveType.Annual,
        startDate: today,
        endDate: today,
        reason: '',
    };
    const [formData, setFormData] = useState(initialFormState);


    const myLeaveRequests = useMemo(() => {
        return leaveRequests.filter(lr => lr.employeeId === currentUser.id);
    }, [leaveRequests, currentUser.id]);

    const annualLeaveBalance = useMemo(() => {
        const hireDate = new Date(currentUser.hireDate);
        const today = new Date();
        const yearsOfService = today.getFullYear() - hireDate.getFullYear();
        
        let totalEntitled = 0;
        if (yearsOfService >= 1) {
            for (let i = 1; i <= yearsOfService; i++) {
                if (i <= 5) totalEntitled += 14;
                else if (i <= 15) totalEntitled += 20;
                else totalEntitled += 26;
            }
        }
        
        const usedLeave = myLeaveRequests
            .filter(lr => lr.leaveType === LeaveType.Annual && lr.status === LeaveStatus.Approved)
            .reduce((sum, lr) => {
                const start = new Date(lr.startDate);
                const end = new Date(lr.endDate);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                return sum + diffDays;
            }, 0);
        
        return totalEntitled - usedLeave;
    }, [currentUser, myLeaveRequests]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addLeaveRequest({ ...formData, employeeId: currentUser.id });
        setIsModalOpen(false);
    };

    const getStatusBadge = (status: LeaveStatus) => {
        const styles: { [key in LeaveStatus]: string } = {
            [LeaveStatus.Approved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [LeaveStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [LeaveStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };


    return (
        <>
            <div className="space-y-6">
                <Card>
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-text-secondary dark:text-dark-text-secondary">Kalan Yıllık İzin Hakkınız</h4>
                            <p className="text-3xl font-bold">{annualLeaveBalance} gün</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>Yeni İzin Talebi Oluştur</Button>
                    </div>
                </Card>
                <Card title="İzin Geçmişim">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">İzin Türü</th>
                                <th className="p-3 font-semibold">Başlangıç</th>
                                <th className="p-3 font-semibold">Bitiş</th>
                                <th className="p-3 font-semibold">Sebep</th>
                                <th className="p-3 font-semibold">Durum</th>
                            </tr></thead>
                            <tbody>
                                {myLeaveRequests.map(lr => (
                                    <tr key={lr.id} className="border-b dark:border-dark-border">
                                        <td className="p-3">{lr.leaveType}</td>
                                        <td className="p-3">{lr.startDate}</td>
                                        <td className="p-3">{lr.endDate}</td>
                                        <td className="p-3">{lr.reason}</td>
                                        <td className="p-3">{getStatusBadge(lr.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni İzin Talebi">
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">İzin Türü</label>
                        <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                           {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium">Başlangıç Tarihi</label>
                           <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        </div>
                        <div>
                           <label className="block text-sm font-medium">Bitiş Tarihi</label>
                           <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium">Sebep</label>
                         <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">Talep Oluştur</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default MyLeaveRequests;

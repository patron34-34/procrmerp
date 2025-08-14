

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';

const LeaveManagement: React.FC = () => {
    const { leaveRequests, employees, addLeaveRequest, updateLeaveRequestStatus, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canManageLeaves = hasPermission('ik:izin-yonet');

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<LeaveRequest, 'id' | 'employeeName' | 'status'> = {
        employeeId: employees[0]?.id || 0,
        leaveType: LeaveType.Annual,
        startDate: today,
        endDate: today,
        reason: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const openModalForNew = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'employeeId' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.employeeId && formData.startDate && formData.endDate) {
            addLeaveRequest(formData);
            setIsModalOpen(false);
            resetForm();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
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
            <Card
                title="Tüm İzin Talepleri"
                action={<Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Talep Oluştur</span></Button>}
            >
                <div className="overflow-x-auto">
                    {leaveRequests.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Çalışan</th>
                                    <th className="p-4 font-semibold">İzin Türü</th>
                                    <th className="p-4 font-semibold">Başlangıç Tarihi</th>
                                    <th className="p-4 font-semibold">Bitiş Tarihi</th>
                                    <th className="p-4 font-semibold">Durum</th>
                                    {canManageLeaves && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium">{request.employeeName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{request.leaveType}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{request.startDate}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{request.endDate}</td>
                                        <td className="p-4">{getStatusBadge(request.status)}</td>
                                        {canManageLeaves && <td className="p-4">
                                            {request.status === LeaveStatus.Pending ? (
                                                <div className="flex items-center gap-2">
                                                    <Button onClick={() => updateLeaveRequestStatus(request.id, LeaveStatus.Approved)} variant="primary" className="!px-2 !py-1 text-xs">Onayla</Button>
                                                    <Button onClick={() => updateLeaveRequestStatus(request.id, LeaveStatus.Rejected)} variant="danger" className="!px-2 !py-1 text-xs">Reddet</Button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">-</span>
                                            )}
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.leave}
                            title="Henüz İzin Talebi Yok"
                            description="İlk izin talebini oluşturarak başlayın."
                            action={<Button onClick={openModalForNew}>Talep Oluştur</Button>}
                        />
                    )}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni İzin Talebi Oluştur">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Çalışan *</label>
                        <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                           {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="leaveType" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">İzin Türü *</label>
                        <select name="leaveType" id="leaveType" value={formData.leaveType} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                           {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                           <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                        <div>
                           <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                           <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                    </div>
                    <div>
                         <label htmlFor="reason" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Sebep</label>
                         <textarea name="reason" id="reason" value={formData.reason} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"></textarea>
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

export default LeaveManagement;
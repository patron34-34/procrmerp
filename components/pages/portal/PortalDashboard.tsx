import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { Link } from 'react-router-dom';
import { LeaveStatus } from '../../../types';
import Button from '../../ui/Button';

const PortalDashboard: React.FC = () => {
    const { currentUser, payslips, leaveRequests, calculateAnnualLeaveBalance } = useApp();

    const lastPayslip = useMemo(() => {
        return payslips
            .filter(p => p.employeeId === currentUser.id)
            .sort((a, b) => new Date(b.runDate).getTime() - new Date(a.runDate).getTime())[0];
    }, [payslips, currentUser.id]);

    const upcomingLeave = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return leaveRequests
            .filter(lr => lr.employeeId === currentUser.id && lr.startDate >= today && lr.status === LeaveStatus.Approved)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
    }, [leaveRequests, currentUser.id]);
    
    const leaveBalance = useMemo(() => {
        return calculateAnnualLeaveBalance(currentUser.id);
    }, [currentUser.id, calculateAnnualLeaveBalance, leaveRequests]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Hoş Geldin, {currentUser.name.split(' ')[0]}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Son Maaş Pusulası">
                    {lastPayslip ? (
                        <div className="space-y-2">
                            <p className="text-lg font-semibold">{lastPayslip.payPeriod}</p>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Net Ödeme:</span>
                                <span className="font-bold text-green-600">${lastPayslip.netPay.toLocaleString()}</span>
                            </div>
                            <Link to="/portal/payslips" className="text-primary-600 hover:underline text-sm font-semibold block mt-4">Tümünü Gör →</Link>
                        </div>
                    ) : (
                        <p className="text-text-secondary">Henüz maaş pusulası oluşturulmadı.</p>
                    )}
                </Card>
                <Card title="İzin Durumu">
                     <div className="space-y-2">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary-600">{leaveBalance.balance}</p>
                            <p className="text-text-secondary">gün kullanılabilir yıllık izniniz var.</p>
                        </div>
                        {upcomingLeave && (
                            <div className="mt-4 pt-4 border-t dark:border-dark-border">
                                <p className="font-semibold text-sm">Yaklaşan İzin:</p>
                                <p className="text-text-secondary text-sm">{upcomingLeave.startDate} - {upcomingLeave.endDate} ({upcomingLeave.leaveType})</p>
                            </div>
                        )}
                        <Link to="/portal/leaves" className="text-primary-600 hover:underline text-sm font-semibold block mt-4">İzin Taleplerini Yönet →</Link>
                    </div>
                </Card>
                 <Card title="Hızlı Eylemler">
                    <div className="flex flex-col gap-2">
                        <Link to="/portal/leaves"><Button className="w-full justify-center">Yeni İzin Talebi Oluştur</Button></Link>
                        <Link to="/portal/expenses"><Button variant="secondary" className="w-full justify-center">Yeni Masraf Talebi</Button></Link>
                        <Link to="/profile"><Button variant="secondary" className="w-full justify-center">Profilimi Görüntüle</Button></Link>
                    </div>
                 </Card>
            </div>
        </div>
    );
};

export default PortalDashboard;

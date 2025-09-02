import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Payslip } from '../../../types';
import Card from '../../ui/Card';
import PayslipDetailModal from '../../hr/PayslipDetailModal';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';

const MyPayslips: React.FC = () => {
    const { currentUser, payslips } = useApp();
    const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);

    const myPayslips = useMemo(() => {
        return payslips
            .filter(p => p.employeeId === currentUser.id)
            .sort((a,b) => new Date(b.runDate).getTime() - new Date(a.runDate).getTime());
    }, [payslips, currentUser.id]);

    return (
        <>
            <Card title="Maaş Pusulalarım">
                <div className="overflow-x-auto">
                    {myPayslips.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Dönem</th>
                                <th className="p-3 font-semibold text-right">Brüt Maaş</th>
                                <th className="p-3 font-semibold text-right">Net Maaş</th>
                                <th className="p-3 font-semibold text-center">Eylemler</th>
                            </tr></thead>
                            <tbody>
                                {myPayslips.map(p => (
                                    <tr key={p.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{p.payPeriod}</td>
                                        <td className="p-3 text-right font-mono">${p.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-right font-mono text-green-600 font-semibold">${p.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => setViewingPayslip(p)} className="text-primary-600 hover:underline text-sm">Görüntüle/Yazdır</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState 
                            icon={ICONS.payroll}
                            title="Maaş Pusulası Bulunamadı"
                            description="Sistemde sizin için oluşturulmuş bir maaş pusulası henüz bulunmuyor."
                        />
                    )}
                </div>
            </Card>
            {viewingPayslip && (
                <PayslipDetailModal
                    isOpen={!!viewingPayslip}
                    onClose={() => setViewingPayslip(null)}
                    payslip={viewingPayslip}
                />
            )}
        </>
    );
};

export default MyPayslips;
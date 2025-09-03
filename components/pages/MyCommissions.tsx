import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

const MyCommissions: React.FC = () => {
    const { commissionRecords, currentUser, deals } = useApp();
    const myCommissions = commissionRecords.filter(c => c.employeeId === currentUser.id);
    const totalCommission = myCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

    return (
        <div className="space-y-6">
            <Card>
                <h4 className="text-text-secondary">Kazanılan Toplam Komisyon</h4>
                <p className="text-3xl font-bold text-green-600">${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </Card>
            <Card title="Komisyon Detayları">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3 font-semibold">İlgili Anlaşma</th>
                        <th className="p-3 font-semibold text-right">Anlaşma Değeri</th>
                        <th className="p-3 font-semibold text-right">Komisyon Tutarı</th>
                        <th className="p-3 font-semibold">Kazanıldığı Tarih</th>
                    </tr></thead>
                    <tbody>
                        {myCommissions.map(c => {
                            const deal = deals.find(d => d.id === c.dealId);
                            return (
                                <tr key={c.id} className="border-b dark:border-dark-border">
                                    <td className="p-3 font-medium">
                                        {deal ? <Link to={`/deals/${deal.id}`} className="text-primary-600 hover:underline">{deal.title}</Link> : 'Bilinmeyen Anlaşma'}
                                    </td>
                                    <td className="p-3 text-right font-mono">${c.dealValue.toLocaleString()}</td>
                                    <td className="p-3 text-right font-mono text-green-600 font-semibold">${c.commissionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="p-3">{c.earnedDate}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default MyCommissions;

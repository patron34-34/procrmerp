import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Payslip, PayrollRun } from '../../../types';
import Card from '../../ui/Card';
import PuantajEditModal from '../PuantajEditModal';
import { useState } from 'react';
import Button from '../../ui/Button';

interface BulkTimesheetGridProps {
    payslips: Payslip[];
    payrollRunStatus: PayrollRun['status'];
}

const PuantajInput: React.FC<{
    payslipId: number;
    field: keyof Payslip;
    value: number | undefined;
    isEditable: boolean;
    onChange: (payslipId: number, field: keyof Payslip, value: string) => void;
}> = ({ payslipId, field, value, isEditable, onChange }) => (
    <input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(payslipId, field, e.target.value)}
        disabled={!isEditable}
        className="w-24 p-1 border border-transparent hover:border-slate-300 focus:border-primary-500 rounded-md text-right bg-transparent focus:bg-white dark:focus:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
    />
);

const BulkTimesheetGrid: React.FC<BulkTimesheetGridProps> = ({ payslips, payrollRunStatus }) => {
    const { updatePayslip } = useApp();
    const [editingPayslip, setEditingPayslip] = useState<Payslip | null>(null);
    const isEditable = payrollRunStatus === 'Taslak';

    const handleInputChange = (payslipId: number, field: keyof Payslip, value: string) => {
        if (!isEditable) return;
        const numericValue = Number(value);
        const updateData = { id: payslipId, [field]: numericValue };
        updatePayslip(updateData as any); 
    };

    const puantajFields: { key: keyof Payslip; label: string }[] = [
        { key: 'normalCalismaGunu', label: 'Normal Gün' },
        { key: 'haftaTatili', label: 'Hafta Tatili' },
        { key: 'ucretliIzin', label: 'Ücretli İzin' },
        { key: 'raporluGun', label: 'Raporlu' },
        { key: 'fazlaMesaiSaati', label: 'F. Mesai (Saat)' },
        { key: 'resmiTatilMesaisi', label: 'R. Tatil Mesai (Saat)'},
        { key: 'eksikGun', label: 'Eksik Gün'}
    ];
    
    const resultFields: { key: keyof Payslip; label: string; color?: string }[] = [
        { key: 'grossPay', label: 'Brüt Maaş' },
        { key: 'netPay', label: 'Net Maaş', color: 'text-green-600' },
    ];

    return (
        <>
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold sticky left-0 bg-slate-50 dark:bg-slate-900/50">Çalışan</th>
                            {puantajFields.map(f => <th key={String(f.key)} className="p-3 font-semibold text-right">{f.label}</th>)}
                            {resultFields.map(f => <th key={String(f.key)} className="p-3 font-semibold text-right">{f.label}</th>)}
                             <th className="p-3 font-semibold text-center">Detay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslips.map(p => (
                            <tr key={p.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                <td className="p-2 font-medium sticky left-0 bg-white dark:bg-dark-card group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">{p.employeeName}</td>
                                {puantajFields.map(field => (
                                    <td key={String(field.key)} className="p-1 text-right">
                                        <PuantajInput
                                            payslipId={p.id}
                                            field={field.key}
                                            value={p[field.key] as number}
                                            isEditable={isEditable}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                ))}
                                {resultFields.map(field => (
                                    <td key={String(field.key)} className={`p-3 text-right font-mono font-semibold ${field.color || ''}`}>
                                        {(p[field.key] as number).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                                    </td>
                                ))}
                                <td className="p-2 text-center">
                                    <Button size="sm" variant="secondary" onClick={() => setEditingPayslip(p)} disabled={!isEditable}>
                                        Detay
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
        {editingPayslip && (
            <PuantajEditModal 
                isOpen={!!editingPayslip}
                onClose={() => setEditingPayslip(null)}
                payslip={editingPayslip}
            />
        )}
        </>
    );
};

export default BulkTimesheetGrid;
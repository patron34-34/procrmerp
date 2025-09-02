import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PayrollSimulationResult } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const ResultRow: React.FC<{ label: string; value: number; className?: string }> = ({ label, value, className }) => (
    <div className={`flex justify-between py-1.5 border-b border-slate-200 dark:border-dark-border/50 ${className}`}>
        <span className="text-text-secondary dark:text-dark-text-secondary">{label}</span>
        <span className="font-mono">{value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</span>
    </div>
);

const PayrollSimulation: React.FC = () => {
    const { calculatePayrollCost } = useApp();
    const [grossSalary, setGrossSalary] = useState<number>(25000); // Start with minimum wage
    const [result, setResult] = useState<PayrollSimulationResult | null>(null);

    const handleCalculate = () => {
        if (grossSalary > 0) {
            const simulationResult = calculatePayrollCost(grossSalary);
            setResult(simulationResult);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card title="Maliyet Simülasyonu">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="grossSalary" className="block text-sm font-medium">Aylık Brüt Maaş</label>
                            <input
                                type="number"
                                id="grossSalary"
                                value={grossSalary}
                                onChange={e => setGrossSalary(Number(e.target.value))}
                                className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            />
                        </div>
                        <Button onClick={handleCalculate} className="w-full justify-center">Maliyeti Hesapla</Button>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                {result && (
                    <Card title={`${result.grossSalary.toLocaleString('tr-TR')} ₺ Brüt Maaş İçin Maliyet Analizi`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold mb-2 text-lg">Çalışan Kesintileri</h4>
                                <ResultRow label="Brüt Maaş" value={result.grossSalary} />
                                <ResultRow label="SGK Primi (%14)" value={-result.employeeSgkContribution} />
                                <ResultRow label="İşsizlik Sig. (%1)" value={-result.employeeUnemploymentContribution} />
                                <ResultRow label="Gelir Vergisi" value={-result.incomeTax} className="text-red-600" />
                                <ResultRow label="Damga Vergisi" value={-result.stampDuty} className="text-red-600" />
                                <ResultRow label="Net Ele Geçen" value={result.netSalary} className="!font-bold !text-lg !text-green-600 !border-t-2 !border-slate-300 dark:!border-dark-border" />
                            </div>
                             <div>
                                <h4 className="font-bold mb-2 text-lg">İşveren Maliyetleri</h4>
                                <ResultRow label="Brüt Maaş" value={result.grossSalary} />
                                <ResultRow label="SGK İşveren Payı (%20.5)" value={result.employerSgkContribution} />
                                <ResultRow label="İşsizlik Sig. İşveren Payı (%2)" value={result.employerUnemploymentContribution} />
                                <ResultRow label="Toplam İşveren Maliyeti" value={result.totalEmployerCost} className="!font-bold !text-lg !text-blue-600 !border-t-2 !border-slate-300 dark:!border-dark-border" />

                                <h4 className="font-bold mb-2 text-lg mt-6">Vergi İstisnaları (Bilgi Amaçlı)</h4>
                                <ResultRow label="Gelir Vergisi İstisnası" value={result.incomeTaxExemption} />
                                <ResultRow label="Damga Vergisi İstisnası" value={result.stampDutyExemption} />
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PayrollSimulation;
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Employee, SeveranceCalculationResult } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import PrintableIbraname from '../../hr/PrintableIbraname';

const ResultRow: React.FC<{ label: string; value: string | number; isBold?: boolean; className?: string }> = ({ label, value, isBold, className }) => (
    <div className={`flex justify-between py-1.5 ${isBold ? 'font-bold' : ''} ${className}`}>
        <span className="text-text-secondary dark:text-dark-text-secondary">{label}</span>
        <span className="font-mono">{typeof value === 'number' ? value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}</span>
    </div>
);

const TerminationCalculator: React.FC = () => {
    const { employees, calculateTerminationPayments } = useApp();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);
    const [terminationDate, setTerminationDate] = useState(new Date().toISOString().split('T')[0]);
    const [grossSalary, setGrossSalary] = useState(0);
    const [additionalGrossPay, setAdditionalGrossPay] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [usedAnnualLeave, setUsedAnnualLeave] = useState(0);
    const [result, setResult] = useState<SeveranceCalculationResult | null>(null);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [documentToPrint, setDocumentToPrint] = useState<'ibraname' | null>(null);


    useEffect(() => {
        if (selectedEmployeeId > 0) {
            const employee = employees.find(e => e.id === selectedEmployeeId);
            if (employee) {
                setGrossSalary(employee.salary);
            }
        } else {
            setGrossSalary(0);
        }
        setResult(null);
    }, [selectedEmployeeId, employees]);

    const handleCalculate = () => {
        if (selectedEmployeeId > 0) {
            const calculationResult = calculateTerminationPayments(
                selectedEmployeeId,
                terminationDate,
                additionalGrossPay,
                bonus,
                usedAnnualLeave
            );
            setResult(calculationResult);
        }
    };
    
    useEffect(() => {
        if (documentToPrint) {
            const handleAfterPrint = () => {
                setDocumentToPrint(null);
                window.removeEventListener('afterprint', handleAfterPrint);
            };

            window.addEventListener('afterprint', handleAfterPrint);
            
            const printTimeout = setTimeout(() => {
                window.print();
            }, 50);

            return () => {
                clearTimeout(printTimeout);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
        }
    }, [documentToPrint]);


    const employee = employees.find(e => e.id === selectedEmployeeId);

    return (
        <>
        {documentToPrint && employee && result && (
            <div className="printable-area">
                 <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        .printable-area, .printable-area * { visibility: visible; }
                        .printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; }
                    }
                `}</style>
                {documentToPrint === 'ibraname' && <PrintableIbraname employee={employee} result={result} terminationDate={terminationDate} />}
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card title="Tazminat Hesaplama">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Çalışan</label>
                            <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value={0}>Seçiniz...</option>
                                {employees.filter(e => !e.istenCikisTarihi).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        {employee && (
                            <>
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm">
                                    <p><strong>İşe Giriş:</strong> {employee.hireDate}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">İşten Çıkış Tarihi</label>
                                    <input type="date" value={terminationDate} onChange={e => setTerminationDate(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Son Brüt Ücret</label>
                                    <input type="number" value={grossSalary} onChange={e => setGrossSalary(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Giydirilmiş Ücrete Eklenecek Aylık Ödemeler</label>
                                    <input type="number" value={additionalGrossPay} onChange={e => setAdditionalGrossPay(Number(e.target.value))} placeholder="Yol, yemek, prim vb." className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Prim / Bonus (Brüt)</label>
                                    <input type="number" value={bonus} onChange={e => setBonus(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Kullanılmış Yıllık İzin (Gün)</label>
                                    <input type="number" value={usedAnnualLeave} onChange={e => setUsedAnnualLeave(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <Button onClick={handleCalculate} className="w-full justify-center">Hesapla</Button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                {result && employee && (
                    <Card title={`${employee.name} için Hesaplama Sonuçları`}>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <h4 className="font-bold mb-2">Hizmet Süresi</h4>
                                <div className="grid grid-cols-3 text-center">
                                    <div><p className="text-2xl font-bold">{result.serviceYears}</p><p className="text-sm text-text-secondary">Yıl</p></div>
                                    <div><p className="text-2xl font-bold">{result.serviceMonths}</p><p className="text-sm text-text-secondary">Ay</p></div>
                                    <div><p className="text-2xl font-bold">{result.serviceDays}</p><p className="text-sm text-text-secondary">Gün</p></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-2">Kıdem Tazminatı</h4>
                                    <ResultRow label="Hesaplamaya Esas Ücret" value={result.finalGrossSalary} />
                                    <ResultRow label="Brüt Kıdem Tazminatı" value={result.severancePayGross} />
                                    <ResultRow label="Damga Vergisi" value={-result.severanceStampDuty} />
                                    <ResultRow label="Net Kıdem Tazminatı" value={result.severancePayNet} isBold />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">İhbar Tazminatı ({result.noticePeriodWeeks} Hafta)</h4>
                                    <ResultRow label="Brüt İhbar Tazminatı" value={result.noticePayGross} />
                                    <ResultRow label="Net İhbar Tazminatı" value={result.noticePayNet} isBold />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Yıllık İzin Ücreti ({result.annualLeaveDaysUnused} Gün)</h4>
                                    <ResultRow label="Brüt Yıllık İzin Ücreti" value={result.annualLeavePayGross} />
                                    <ResultRow label="Net Yıllık İzin Ücreti" value={result.annualLeavePayNet} isBold />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Prim / Bonus</h4>
                                    <ResultRow label="Brüt Prim / Bonus" value={result.bonusGross} />
                                    <ResultRow label="Net Prim / Bonus" value={result.bonusNet} isBold />
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2">
                                <ResultRow label="Toplam Brüt Vergiye Tabi Tutar" value={result.totalTaxableGross} />
                                <ResultRow label="Toplam Gelir Vergisi" value={-result.totalIncomeTax} />
                                <ResultRow label="Toplam Damga Vergisi" value={-result.totalStampDuty} />
                                <ResultRow label="TOPLAM NET ÖDEME" value={result.totalNetPayment} isBold className="!text-xl !text-green-600" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => {setDocumentToPrint('ibraname')}}>İbraname Oluştur</Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
        </>
    );
};

export default TerminationCalculator;
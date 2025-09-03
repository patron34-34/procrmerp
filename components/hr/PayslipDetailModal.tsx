

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Payslip } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Logo } from '../../constants';

interface PuantajCardProps {
    payslip: Payslip;
}

const PuantajCard: React.FC<PuantajCardProps> = ({ payslip }) => {
    
    const totalSgkDays = payslip.normalCalismaGunu + payslip.haftaTatili + payslip.genelTatil + payslip.ucretliIzin + payslip.raporluGun;

    return (
        <div>
            <h4 className="font-bold text-lg mb-2">PUANTAJ KARTI</h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>Normal Çalışma Günü:</span><span className="font-mono text-right">{payslip.normalCalismaGunu}</span>
                    <span>Hafta Tatili:</span><span className="font-mono text-right">{payslip.haftaTatili}</span>
                    <span>Genel Tatil:</span><span className="font-mono text-right">{payslip.genelTatil}</span>
                    <span>Ücretli İzin:</span><span className="font-mono text-right">{payslip.ucretliIzin}</span>
                    <span>Raporlu Gün:</span><span className="font-mono text-right">{payslip.raporluGun}</span>
                    <span className="text-red-500">Ücretsiz İzin:</span><span className="font-mono text-right text-red-500">{payslip.ucretsizIzin}</span>
                    <span className="text-red-500">Eksik Gün:</span><span className="font-mono text-right text-red-500">{payslip.eksikGun}</span>
                </div>
                <div className="flex justify-between pt-2 mt-1 border-t font-bold dark:border-slate-600">
                    <span>Toplam SGK Günü:</span>
                    <span className="font-mono text-right">{totalSgkDays}</span>
                </div>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 mt-1 border-t dark:border-slate-600">
                    <span>Fazla Mesai (Saat):</span><span className="font-mono text-right">{payslip.fazlaMesaiSaati}</span>
                    <span>Resmi Tatil Mesaisi (Saat):</span><span className="font-mono text-right">{payslip.resmiTatilMesaisi}</span>
                    <span>Gece Vardiyası (Saat):</span><span className="font-mono text-right">{payslip.geceVardiyasiSaati}</span>
                </div>
            </div>
        </div>
    );
};


interface PayslipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip | null;
}

const PayslipDetailModal: React.FC<PayslipDetailModalProps> = ({ isOpen, onClose, payslip }) => {
    const { companyInfo, employees } = useApp();

    if (!payslip) return null;

    const employee = employees.find(e => e.id === payslip.employeeId);
    
    const totalEarnings = payslip.grossPay;
    const yasalKesintilerTotal = payslip.sgkPremium + payslip.incomeTaxAmount + payslip.stampDutyAmount;
    
    const formatCurrency = (amount: number) => {
        if (typeof amount !== 'number') return '0,00 ₺';
        return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Maaş Pusulası" size="4xl">
            <div className="printable-area">
                <div className="p-6 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white">
                    <div className="flex justify-between items-start pb-4 border-b dark:border-slate-600">
                        <div>
                            <Logo className="h-10 text-primary-600" />
                            <p className="font-bold text-lg mt-2">{companyInfo.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{companyInfo.address}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold">ÜCRET HESAP PUSULASI</h3>
                            <p className="text-slate-600 dark:text-slate-400">Dönem: {payslip.payPeriod}</p>
                        </div>
                    </div>
                    
                    {employee && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-b pb-4 dark:border-slate-600">
                             <div>
                                <p className="font-bold">{employee.name}</p>
                                <p className="text-slate-600 dark:text-slate-400">{employee.position}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Çalışan ID:</strong> {employee.employeeId}</p>
                                <p><strong>İşe Giriş:</strong> {employee.hireDate}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-lg mb-2 text-green-700 dark:text-green-400">ÖDEMELER</h4>
                            <div className="space-y-1 border-t pt-2 dark:border-slate-600">
                                {payslip.earnings.map((e, i) => (
                                    <div key={i} className="flex justify-between text-sm"><span>{e.name}</span><span className="font-mono">{formatCurrency(e.amount)}</span></div>
                                ))}
                            </div>
                             <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t dark:border-slate-600">
                                <span>Brüt Ücret (Toplam Kazanç)</span>
                                <span className="font-mono">{formatCurrency(totalEarnings)}</span>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-bold text-lg mb-2 text-red-700 dark:text-red-400">KESİNTİLER</h4>
                             <div className="space-y-1 border-t pt-2 dark:border-slate-600">
                                <div className="flex justify-between text-sm"><span>SGK Primi İşçi Payı (%14)</span><span className="font-mono">{formatCurrency(payslip.sgkPremium - payslip.unemploymentPremium)}</span></div>
                                <div className="flex justify-between text-sm"><span>İşsizlik Sig. İşçi Payı (%1)</span><span className="font-mono">{formatCurrency(payslip.unemploymentPremium)}</span></div>
                                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-dashed dark:border-slate-700"><span>Gelir Vergisi Matrahı</span><span className="font-mono">{formatCurrency(payslip.incomeTaxBase)}</span></div>
                                <div className="flex justify-between text-xs text-slate-500"><span>Kümülatif G.V. Matrahı</span><span className="font-mono">{formatCurrency(payslip.cumulativeIncomeTaxBase)}</span></div>
                                <div className="flex justify-between text-sm"><span>Hesaplanan Gelir Vergisi</span><span className="font-mono">{formatCurrency(payslip.incomeTaxAmount + payslip.incomeTaxExemption)}</span></div>
                                <div className="flex justify-between text-sm text-green-600"><span>G.V. İstisnası</span><span className="font-mono">({formatCurrency(payslip.incomeTaxExemption)})</span></div>
                                <div className="flex justify-between text-sm font-semibold"><span>Ödenecek Gelir Vergisi</span><span className="font-mono">{formatCurrency(payslip.incomeTaxAmount)}</span></div>
                                <div className="flex justify-between text-sm"><span>Hesaplanan Damga Vergisi</span><span className="font-mono">{formatCurrency(payslip.stampDutyAmount + payslip.stampDutyExemption)}</span></div>
                                <div className="flex justify-between text-sm text-green-600"><span>D.V. İstisnası</span><span className="font-mono">({formatCurrency(payslip.stampDutyExemption)})</span></div>
                                <div className="flex justify-between text-sm font-semibold"><span>Ödenecek Damga Vergisi</span><span className="font-mono">{formatCurrency(payslip.stampDutyAmount)}</span></div>
                                {payslip.besKesintisi > 0 && <div className="flex justify-between text-sm"><span>BES Kesintisi</span><span className="font-mono">{formatCurrency(payslip.besKesintisi)}</span></div>}
                                {payslip.digerKesintiler.map((k, i) => (
                                    <div key={i} className="flex justify-between text-sm"><span>{k.name}</span><span className="font-mono">{formatCurrency(k.amount)}</span></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t dark:border-slate-600">
                                <span>Toplam Yasal Kesintiler</span>
                                <span className="font-mono">{formatCurrency(yasalKesintilerTotal)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-4 dark:border-slate-600">
                       <PuantajCard payslip={payslip} />
                       <div>
                            <h4 className="font-bold text-lg mb-2">İŞVEREN MALİYETİ</h4>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1 text-sm">
                                <div className="flex justify-between"><span>Brüt Ücret</span><span className="font-mono">{formatCurrency(payslip.grossPay)}</span></div>
                                <div className="flex justify-between"><span>SGK İşveren Payı</span><span className="font-mono">{formatCurrency(payslip.employerSgkPremium)}</span></div>
                                 <div className="flex justify-between font-bold mt-2 pt-2 border-t dark:border-slate-600">
                                    <span>Toplam İşveren Maliyeti</span>
                                    <span className="font-mono">{formatCurrency(payslip.grossPay + payslip.employerSgkPremium)}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg space-y-1 text-sm mt-4">
                                <div className="flex justify-between"><span>Hesaplanan AGİ Tutarı (Bilgi)</span><span className="font-mono">{formatCurrency(payslip.agiTutari)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-black dark:border-white">
                        <div className="flex justify-between font-bold text-xl">
                            <span>NET ÖDENEN</span>
                            <span className="font-mono">{formatCurrency(payslip.netPay)}</span>
                        </div>
                    </div>
                </div>
            </div>
             <div className="flex justify-end pt-4 gap-2 no-print">
                <Button type="button" variant="secondary" onClick={onClose}>Kapat</Button>
                <Button onClick={() => window.print()}>Yazdır</Button>
            </div>
        </Modal>
    );
};

export default PayslipDetailModal;
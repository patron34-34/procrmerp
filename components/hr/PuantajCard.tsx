
import React from 'react';
import { Payslip } from '../../types';

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

export default PuantajCard;

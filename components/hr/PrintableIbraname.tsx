import React from 'react';
import { Employee, SeveranceCalculationResult } from '../../types';
import { useApp } from '../../context/AppContext';

interface PrintableIbranameProps {
    employee: Employee;
    result: SeveranceCalculationResult;
    terminationDate: string;
}

const PrintableIbraname: React.FC<PrintableIbranameProps> = ({ employee, result, terminationDate }) => {
    const { companyInfo } = useApp();
    const today = new Date().toLocaleDateString('tr-TR');
    
    const formatCurrency = (amount: number) => {
         return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    }

    return (
        <div className="bg-white text-black p-8 font-serif text-sm">
            <h1 className="text-center text-lg font-bold uppercase mb-8">İBRANAME</h1>
            
            <p className="mb-4">
                <strong>{companyInfo.name}</strong> ({'"İşveren"'}) ünvanlı işyerinde <strong>{employee.hireDate}</strong> tarihinden <strong>{terminationDate}</strong> tarihine kadar çalışmış bulunmaktayım.
            </p>
            <p className="mb-4">
                İş sözleşmemin sona ermesi nedeniyle, aşağıda dökümü yapılan tüm yasal hak ve alacaklarımı, herhangi bir baskı altında kalmaksızın, eksiksiz ve nakden almış bulunmaktayım:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1 pl-4">
                <li>Net Kıdem Tazminatı: <strong>{formatCurrency(result.severancePayNet)}</strong></li>
                <li>Net İhbar Tazminatı: <strong>{formatCurrency(result.noticePayNet)}</strong></li>
                <li>Kullanılmamış Yıllık İzin Ücreti (Net): <strong>{formatCurrency(result.annualLeavePayNet)}</strong></li>
                <li>Net Prim / Bonus: <strong>{formatCurrency(result.bonusNet)}</strong></li>
                <li>Diğer (Maaş, Fazla Mesai vb. tüm alacaklar dahildir)</li>
            </ul>
            <p className="mb-4">
                Yukarıda belirtilen kalemler dahil olmak üzere, iş sözleşmemden kaynaklanan tüm ücret, fazla mesai, hafta tatili, genel tatil, yıllık izin ve diğer tüm sosyal hak ve alacaklarımı, toplamda <strong>{formatCurrency(result.totalNetPayment)}</strong> tutarında olmak üzere tamamen ve eksiksiz olarak teslim aldım.
            </p>
            <p className="mb-6">
                Bu ödemelerle birlikte İşveren'den, iş sözleşmemin feshinden kaynaklanan veya çalışma sürem boyunca doğmuş olan hiçbir başkaca alacağımın kalmadığını, İşveren'i maddi ve manevi olarak her türlü hak ve alacağımdan gayrikabili rücu olmak üzere ibra ettiğimi beyan ve kabul ederim.
            </p>

            <div className="mt-12 flex justify-between items-end">
                <div>
                    <p className="font-bold">İBRA EDEN (ÇALIŞAN)</p>
                    <p className="mt-8">Adı Soyadı: {employee.name}</p>
                    <p>T.C. Kimlik No: {employee.tcKimlikNo || '___________________'}</p>
                    <p className="mt-4">İmza:</p>
                </div>
                 <div>
                    <p><strong>Tarih:</strong> {today}</p>
                </div>
            </div>
        </div>
    );
};

export default PrintableIbraname;
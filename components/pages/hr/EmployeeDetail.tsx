

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { LeaveStatus, LeaveType, Payslip, Asset } from '../../../types';
import PayslipDetailModal from '../../hr/PayslipDetailModal';

type ActiveTab = 'ozluk' | 'leaves' | 'performance' | 'payroll' | 'assets';

interface EmployeeDetailProps {
    employeeId?: number;
}

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
    if (value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value))) return null;
    return (
        <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <dt className="text-text-secondary dark:text-dark-text-secondary">{label}</dt>
            <dd className="col-span-2 text-text-main dark:text-dark-text-main font-medium">{value}</dd>
        </div>
    );
};

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId: propEmployeeId }) => {
    const { id } = useParams<{ id: string }>();
    const { employees, leaveRequests, performanceReviews, payslips, calculateAnnualLeaveBalance, assets } = useApp();
    const [activeTab, setActiveTab] = useState<ActiveTab>('ozluk');
    const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);

    const employeeId = propEmployeeId || parseInt(id || '', 10);
    const employee = employees.find(e => e.id === employeeId);
    const manager = employees.find(e => e.id === employee?.managerId);

    const employeeLeaves = useMemo(() => leaveRequests.filter(lr => lr.employeeId === employeeId), [leaveRequests, employeeId]);
    const employeeReviews = useMemo(() => performanceReviews.filter(pr => pr.employeeId === employeeId), [performanceReviews, employeeId]);
    const employeePayslips = useMemo(() => payslips.filter(p => p.employeeId === employeeId).sort((a,b) => b.id - a.id), [payslips, employeeId]);
    const employeeAssets = useMemo(() => assets.filter(a => a.assignedToId === employeeId), [assets, employeeId]);
    
    const leaveBalance = useMemo(() => {
        if (!employeeId) return { entitled: 0, used: 0, balance: 0 };
        return calculateAnnualLeaveBalance(employeeId);
    }, [employeeId, calculateAnnualLeaveBalance]);
    
    if (!employee) {
        return <Card title="Hata"><p>Çalışan bulunamadı. Lütfen <Link to="/hr/employees">Çalışanlar</Link> sayfasına geri dönün.</p></Card>;
    }
    
    const getLeaveStatusBadge = (status: LeaveStatus) => {
        const styles: { [key in LeaveStatus]: string } = {
            [LeaveStatus.Approved]: 'bg-green-100 text-green-800',
            [LeaveStatus.Pending]: 'bg-yellow-100 text-yellow-800',
            [LeaveStatus.Rejected]: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'ozluk':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card title="İstihdam Bilgileri">
                                 <dl>
                                    <InfoRow label="Çalışan ID" value={employee.employeeId} />
                                    <InfoRow label="Departman" value={employee.department} />
                                    <InfoRow label="Pozisyon" value={employee.position} />
                                    <InfoRow label="Yönetici" value={manager ? <Link to={`/hr/employees/${manager.id}`} className="text-primary-600 hover:underline">{manager.name}</Link> : 'Yok'} />
                                    <InfoRow label="İşe Giriş Tarihi" value={employee.hireDate} />
                                    <InfoRow label="Çalışma Statüsü" value={employee.calismaStatusu} />
                                    <InfoRow label="Sigorta Kolu" value={employee.sigortaKolu} />
                                    <InfoRow label="SGK Sicil No" value={employee.sgkSicilNo} />
                                    <InfoRow label="SGK Meslek Kodu" value={`${employee.meslekKodu || ''} - ${employee.meslekAdi || ''}`} />
                                    <InfoRow label="Sistem Rolü" value={employee.role} />
                                 </dl>
                             </Card>
                             <Card title="Kişisel Bilgiler">
                                <dl>
                                    <InfoRow label="T.C. Kimlik No" value={employee.tcKimlikNo} />
                                    <InfoRow label="Doğum Tarihi" value={employee.dogumTarihi} />
                                    <InfoRow label="Cinsiyet" value={employee.cinsiyet} />
                                    <InfoRow label="Medeni Durum" value={employee.medeniDurum} />
                                    {employee.medeniDurum === 'Evli' && <InfoRow label="Eşi Çalışıyor mu?" value={employee.esiCalisiyorMu ? 'Evet' : 'Hayır'} />}
                                    <InfoRow label="Bakmakla Yükümlü Olunan Kişi" value={employee.bakmaklaYukumluKisiSayisi} />
                                    <InfoRow label="Uyruk" value={employee.uyruk} />
                                    <InfoRow label="Eğitim Seviyesi" value={employee.egitimSeviyesi} />
                                    <InfoRow label="Adres" value={employee.adres} />
                                </dl>
                            </Card>
                            {employee.istenCikisTarihi && (
                                <Card title="İşten Ayrılma Bilgileri" className="lg:col-span-2">
                                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                                        <InfoRow label="Ayrılma Tarihi" value={employee.istenCikisTarihi} />
                                        <InfoRow label="Ayrılma Nedeni" value={employee.istenCikisNedeni} />
                                        <InfoRow label="SGK Çıkış Kodu" value={employee.istenCikisKodu} />
                                    </dl>
                                </Card>
                            )}
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card title="Yıllık İzin Bakiyesi">
                                <dl>
                                    <InfoRow label="Hak Edilen" value={`${leaveBalance.entitled} gün`} />
                                    <InfoRow label="Kullanılan" value={`${leaveBalance.used} gün`} />
                                    <InfoRow label="Kalan Bakiye" value={<span className="font-bold text-lg text-green-600">{`${leaveBalance.balance} gün`}</span>} />
                                </dl>
                            </Card>
                            <Card title="Teşvik & İndirimler">
                                <dl>
                                    <InfoRow label="SGK Teşvikinden Yararlanıyor mu?" value={employee.tesviktenYararlaniyorMu ? 'Evet' : 'Hayır'} />
                                    {employee.tesviktenYararlaniyorMu && <InfoRow label="Teşvik Kodu" value={employee.tesvikKodu} />}
                                    <InfoRow label="Engellilik Oranı" value={employee.engellilikOrani ? `%${employee.engellilikOrani}` : 'Yok'} />
                                    <InfoRow label="Vergi İndirimi" value={employee.vergiIndirimiVarMi ? 'Evet' : 'Hayır'} />
                                </dl>
                            </Card>
                        </div>
                    </div>
                );
            case 'leaves':
                 return (
                    <Card title="İzin Geçmişi">
                        <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 dark:bg-slate-900/50"><th className="p-2">Tür</th><th className="p-2">Başlangıç</th><th className="p-2">Bitiş</th><th className="p-2">Durum</th></tr></thead>
                            <tbody>{employeeLeaves.map(lr => (<tr key={lr.id} className="border-b dark:border-dark-border"><td className="p-2">{lr.leaveType}</td><td className="p-2">{lr.startDate}</td><td className="p-2">{lr.endDate}</td><td className="p-2">{getLeaveStatusBadge(lr.status)}</td></tr>))}</tbody>
                        </table>
                    </Card>
                 );
            case 'performance':
                return (
                    <Card title="Performans Değerlendirmeleri">
                        {employeeReviews.map(review => (<div key={review.id} className="p-3 border rounded-md mb-3 dark:border-dark-border"><p className="font-bold">Dönem: {review.periodStartDate} - {review.periodEndDate}</p><p><strong>Puan:</strong> {review.overallRating}/5</p><p><strong>Değerlendiren:</strong> {review.reviewerName}</p></div>))}
                    </Card>
                );
            case 'payroll':
                 return (
                    <Card title="Maaş Pusulaları">
                        <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 dark:bg-slate-900/50"><th className="p-2">Dönem</th><th className="p-2 text-right">Brüt Maaş</th><th className="p-2 text-right">Net Maaş</th><th className="p-2 text-center">Eylemler</th></tr></thead>
                            <tbody>{employeePayslips.map(p => (<tr key={p.id} className="border-b dark:border-dark-border"><td className="p-2 font-medium">{p.payPeriod}</td><td className="p-2 text-right font-mono">${p.grossPay.toLocaleString()}</td><td className="p-2 text-right font-mono text-green-600 font-semibold">${p.netPay.toLocaleString()}</td><td className="p-2 text-center"><button onClick={() => setViewingPayslip(p)} className="text-primary-600 hover:underline text-sm">Görüntüle</button></td></tr>))}</tbody>
                        </table>
                    </Card>
                 );
             case 'assets':
                return (
                    <Card title="Zimmetli Varlıklar">
                        <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 dark:bg-slate-900/50"><th className="p-2">Varlık Adı</th><th className="p-2">Kategori</th><th className="p-2">Seri Numarası</th><th className="p-2">Atanma Tarihi</th></tr></thead>
                            <tbody>{employeeAssets.map(asset => (<tr key={asset.id} className="border-b dark:border-dark-border"><td className="p-2">{asset.name}</td><td className="p-2">{asset.category}</td><td className="p-2">{asset.serialNumber}</td><td className="p-2">{asset.assignmentDate}</td></tr>))}</tbody>
                        </table>
                    </Card>
                );
        }
    }

    return (
        <>
            <div className="space-y-6">
                {!propEmployeeId && (
                     <div className="mb-4">
                        <Link to="/hr/employees" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main">
                            &larr; Çalışanlara Geri Dön
                        </Link>
                    </div>
                )}
                <Card>
                    <div className="flex items-center gap-6">
                        <img src={employee.avatar} alt={employee.name} className="h-24 w-24 rounded-full"/>
                        <div>
                            <h2 className="text-3xl font-bold">{employee.name}</h2>
                            <p className="text-lg text-text-secondary dark:text-dark-text-secondary">{employee.position} - {employee.department}</p>
                        </div>
                    </div>
                </Card>
                
                <div className="border-b border-slate-200 dark:border-dark-border">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('ozluk')} className={`${activeTab === 'ozluk' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Özlük Bilgileri</button>
                        <button onClick={() => setActiveTab('assets')} className={`${activeTab === 'assets' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Varlıklar ({employeeAssets.length})</button>
                        <button onClick={() => setActiveTab('leaves')} className={`${activeTab === 'leaves' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>İzin Geçmişi</button>
                        <button onClick={() => setActiveTab('payroll')} className={`${activeTab === 'payroll' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Bordro</button>
                        <button onClick={() => setActiveTab('performance')} className={`${activeTab === 'performance' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Performans</button>
                    </nav>
                </div>
                <div>{renderTabContent()}</div>
            </div>

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

export default EmployeeDetail;
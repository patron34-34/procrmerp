
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import { ICONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';

const AccountingReportsHub: React.FC = () => {
    const { hasPermission } = useApp();

    const reportCards = [
        { title: "Mizan", description: "Belirli bir dönemdeki tüm hesapların borç ve alacak toplamlarını ve bakiyelerini gösterir.", link: "/accounting/reports/trial-balance", icon: ICONS.trialBalance, permission: 'muhasebe:goruntule' },
        { title: "Bilanço", description: "Bir şirketin belirli bir tarihteki varlıklarını, yükümlülüklerini ve özkaynaklarını gösteren finansal tablo.", link: "/accounting/reports/balance-sheet", icon: ICONS.balanceSheet, permission: 'muhasebe:bilanco-goruntule' },
        { title: "Gelir Tablosu", description: "Belirli bir dönemdeki gelirleri, giderleri ve net kar veya zararı özetler.", link: "/accounting/reports/income-statement", icon: ICONS.incomeStatement, permission: 'muhasebe:gelir-tablosu-goruntule' },
        { title: "Nakit Akış Tablosu", description: "İşletme, yatırım ve finansman faaliyetlerinden kaynaklanan nakit giriş ve çıkışlarını gösterir.", link: "/accounting/reports/cash-flow", icon: ICONS.cashFlow, permission: 'muhasebe:nakit-akis-goruntule' },
        { title: "Defter-i Kebir", description: "Her bir muhasebe hesabının ayrıntılı işlem dökümünü (muavin) görüntüleyin.", link: "/accounting/reports/general-ledger", icon: ICONS.ledger, permission: 'muhasebe:defteri-kebir-goruntule' },
        { title: "Alacak Yaşlandırma", description: "Vadesi geçmiş müşteri alacaklarını takip edin ve nakit akışınızı yönetin.", link: "/accounting/reports/ar-aging", icon: ICONS.arAging, permission: 'muhasebe:alacak-yaslandirma-goruntule' },
        { title: "Kâr ve Zarar (Özet)", description: "Maliyet merkezlerine göre gelir ve giderleri karşılaştırarak karlılığı analiz edin.", link: "/accounting/reports/profit-loss-summary", icon: ICONS.profitAndLoss, permission: 'muhasebe:kar-zarar-goruntule' },
    ];
    
    const availableReports = reportCards.filter(report => hasPermission(report.permission as any));

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main">Muhasebe Raporlama Merkezi</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">İşletmenizin finansal sağlığını analiz etmek için standart raporlara erişin.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableReports.map((report) => (
                    <Link key={report.link} to={report.link}>
                        <Card className="h-full hover:shadow-lg hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 text-primary-600">
                                    {report.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-dark-text-main">{report.title}</h3>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">{report.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AccountingReportsHub;
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import { REPORT_CARDS, HR_REPORT_CARDS, ICONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import { ReportCardInfo, Permission } from '../../../types';

const ReportsHub: React.FC = () => {
    const { hasPermission } = useApp();

    const accountingReports: ReportCardInfo[] = [
        { title: "Muhasebe Raporları", description: "Bilanço, gelir tablosu, mizan gibi standart mali raporlara erişin.", link: "/accounting/reports", icon: ICONS.accounting },
    ];

    const allReportGroups: { title: string; reports: ReportCardInfo[]; permission: Permission }[] = [
        { title: "Genel Raporlar", reports: REPORT_CARDS, permission: 'rapor:goruntule' },
        { title: "İK Raporları", reports: HR_REPORT_CARDS, permission: 'ik:rapor-goruntule' },
        { title: "Muhasebe Raporları", reports: accountingReports, permission: 'muhasebe:goruntule' },
    ];

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main">Rapor Merkezi</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">İşletmenizin performansını analiz etmek için raporları kullanın.</p>
            </div>

            {allReportGroups.map(group => {
                if (!hasPermission(group.permission)) return null;

                return (
                    <div key={group.title}>
                        <h2 className="text-2xl font-semibold mb-4">{group.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.reports.map((report) => (
                                <Link key={report.link} to={report.link}>
                                    <Card className="h-full hover:shadow-lg hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 text-primary-600 w-6 h-6">
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
            })}
        </div>
    );
};

export default ReportsHub;

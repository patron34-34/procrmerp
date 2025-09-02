
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import { REPORT_CARDS } from '../../../constants';

const ReportsHub: React.FC = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main">Rapor Merkezi</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">İşletme verilerinizi analiz edin ve bilinçli kararlar alın.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REPORT_CARDS.map((report) => (
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
};

export default ReportsHub;
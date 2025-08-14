import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import { ICONS } from '../../constants';

const Automations: React.FC = () => {
    const { hasPermission } = useApp();
    const canManage = hasPermission('otomasyon:yonet');

    const automationTypes = [
        {
            title: "Planlanmış Görevler",
            description: "Tekrarlayan görevleri (örn: aylık raporlama) belirli bir takvime göre otomatik olarak oluşturun.",
            link: "/automations/scheduled-tasks",
            icon: ICONS.planner,
            permission: canManage
        },
        {
            title: "Otomasyon Kuralları (Eski)",
            description: "Belirli bir olay gerçekleştiğinde (örn: anlaşma aşaması değiştiğinde) otomatik eylemler tetikleyin.",
            link: "/automations/rules", // This would be the old page, if you decide to keep it separate. For now, let's assume it's just a conceptual split.
            icon: ICONS.automations,
            permission: true
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main">Otomasyon Merkezi</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">İş akışlarınızı otomatikleştirin ve verimliliği artırın.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {automationTypes.filter(type => type.permission).map((type) => (
                    <Link key={type.link} to={type.link}>
                        <Card className="h-full hover:shadow-lg hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 text-primary-600">
                                    {type.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-dark-text-main">{type.title}</h3>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">{type.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Automations;
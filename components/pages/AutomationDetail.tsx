import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import AutomationLogView from '../automations/AutomationLogView';
import Button from '../ui/Button';

const AutomationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { automations } = useApp();
    
    const automationId = parseInt(id || '', 10);
    const automation = automations.find(a => a.id === automationId);

    if(!automation) {
        return <Card title="Hata"><p>Otomasyon bulunamadı. <Link to="/automations">Otomasyonlar listesine</Link> geri dönün.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{automation.name}</h2>
                        <p className="text-text-secondary">{automation.triggerType}</p>
                    </div>
                    <Link to="/automations">
                        <Button variant="secondary">&larr; Listeye Dön</Button>
                    </Link>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Yapılandırma">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Tetikleyici</h4>
                                <p className="text-sm p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md mt-1">
                                    Anlaşma aşaması <span className="font-bold">'{automation.triggerConfig.stageId}'</span> olduğunda
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Eylemler</h4>
                                <div className="space-y-2 mt-1">
                                    {automation.actions.map((action, index) => (
                                        <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                            <p className="font-semibold text-sm">{action.type}</p>
                                            <pre className="text-xs mt-1 bg-slate-100 dark:bg-slate-900 p-2 rounded whitespace-pre-wrap">
                                                {JSON.stringify(action.config, null, 2)}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Çalışma Geçmişi (Loglar)">
                        <AutomationLogView automationId={automationId} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AutomationDetail;

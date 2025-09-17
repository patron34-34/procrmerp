import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';

interface IntegrationCardProps {
    icon: JSX.Element;
    title: string;
    description: string;
}

const PlaceholderIntegrationCard: React.FC<IntegrationCardProps> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 border rounded-lg dark:border-dark-border bg-slate-50 dark:bg-slate-800/50">
        <div className="text-primary-600 w-8 h-8 flex-shrink-0 mt-1">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-bold">{title}</h4>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                Bağlı Değil
            </span>
            <Button size="sm" disabled title="Yakında">
                Bağlan
            </Button>
        </div>
    </div>
);


const IntegrationsSettings: React.FC = () => {
    const [eTransformationConfig, setETransformationConfig] = useState({
        username: '',
        password: '',
        apiKey: ''
    });
    const [isConnected, setIsConnected] = useState(false);

    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setETransformationConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would make an API call here to validate credentials
        console.log("Connecting with:", eTransformationConfig);
        setIsConnected(true);
    };
    
    const handleDisconnect = () => {
        setIsConnected(false);
        setETransformationConfig({ username: '', password: '', apiKey: '' });
    };


    const integrations = {
        'Bankacılık': [
            { icon: ICONS.bank, title: 'Garanti BBVA API', description: 'Hesap hareketlerinizi ve bakiyenizi otomatik olarak sisteme aktarın.' },
            { icon: ICONS.bank, title: 'İş Bankası API', description: 'İşlemlerinizi muhasebe kayıtlarıyla kolayca eşleştirin.' },
        ],
        'Lojistik': [
            { icon: ICONS.shipment, title: 'Yurtiçi Kargo API', description: 'Sevkiyatlarınızı otomatik olarak oluşturun ve kargo takibini sistemden yapın.' },
            { icon: ICONS.shipment, title: 'MNG Kargo API', description: 'Kargo süreçlerinizi otomatikleştirerek zaman kazanın.' },
        ]
    };

    return (
        <Card title="Entegrasyonlar">
            <p className="mb-6 text-text-secondary dark:text-dark-text-secondary">
                İş süreçlerinizi otomatikleştirmek ve verimliliği artırmak için ProFusion'ı diğer hizmetlerle entegre edin.
            </p>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold mb-3">e-Dönüşüm Entegrasyonları</h3>
                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="text-primary-600 w-8 h-8 flex-shrink-0 mt-1">{ICONS.invoices}</div>
                            <div className="flex-1">
                                <h4 className="font-bold">e-Fatura & e-Arşiv Portalı</h4>
                                <p className="text-sm text-text-secondary mt-1">
                                    Faturalarınızı doğrudan GİB portalına veya özel entegratörünüze gönderin. Bu entegrasyon, fatura oluşturma sürecini hızlandırır ve manuel hataları azaltır.
                                </p>
                                <div className="mt-4 pt-4 border-t dark:border-dark-border">
                                    {isConnected ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="font-semibold text-green-600">Bağlandı</span>
                                                </div>
                                                <Button variant="danger" size="sm" onClick={handleDisconnect}>Bağlantıyı Kes</Button>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-text-secondary">Kullanıcı Adı</label>
                                                <input type="text" value={eTransformationConfig.username} readOnly className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-800 border rounded-md" />
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleConnect} className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium">Kullanıcı Adı</label>
                                                <input type="text" name="username" value={eTransformationConfig.username} onChange={handleConfigChange} className="w-full mt-1" required />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Şifre</label>
                                                <input type="password" name="password" value={eTransformationConfig.password} onChange={handleConfigChange} className="w-full mt-1" required />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">API Anahtarı (varsa)</label>
                                                <input type="text" name="apiKey" value={eTransformationConfig.apiKey} onChange={handleConfigChange} className="w-full mt-1" />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit">Bağlan</Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {Object.entries(integrations).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-xl font-semibold mb-3">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map(item => <PlaceholderIntegrationCard key={item.title} {...item} />)}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default IntegrationsSettings;
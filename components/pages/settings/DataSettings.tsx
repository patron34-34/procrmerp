
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';

const DataSettings: React.FC = () => {
    return (
        <Card title="Veri Yönetimi">
            <div className="space-y-6">
                <div className="p-4 border rounded-lg dark:border-dark-border">
                    <h4 className="font-semibold text-lg">Veri İçeri Aktarma</h4>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1 mb-4">
                        CSV dosyalarından veri aktararak yeni kayıtlar oluşturun.
                    </p>
                    <Link to="/customers">
                        <Button variant="secondary">
                           <span className="flex items-center gap-2">{ICONS.import} Müşterileri İçeri Aktar</span>
                        </Button>
                    </Link>
                </div>
                 <div className="p-4 border rounded-lg dark:border-dark-border">
                    <h4 className="font-semibold text-lg">Veri Dışarı Aktarma</h4>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1 mb-4">
                        Verilerinizi yedeklemek veya başka bir platformda kullanmak için CSV formatında dışa aktarın.
                    </p>
                    <div className="flex flex-wrap gap-2">
                         <Link to="/customers"><Button variant="secondary">Müşterileri Dışa Aktar</Button></Link>
                         <Link to="/projects"><Button variant="secondary">Projeleri Dışa Aktar</Button></Link>
                         {/* Add more export options here */}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DataSettings;

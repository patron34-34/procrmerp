
import React from 'react';
import Card from '../../ui/Card';
import { ICONS } from '../../../constants';

const IntegrationsSettings: React.FC = () => {
    return (
        <Card title="Entegrasyonlar">
            <div className="text-center p-8">
                <div className="mx-auto h-12 w-12 text-slate-400">{ICONS.integrations}</div>
                <h3 className="mt-2 text-lg font-medium text-text-main dark:text-dark-text-main">
                    Entegrasyonlar Yakında!
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                    Favori uygulamalarınızı ProFusion'a bağlayarak iş akışlarınızı otomatikleştirin.
                </p>
            </div>
        </Card>
    );
};

export default IntegrationsSettings;

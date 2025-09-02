import React from 'react';
import Card from '../../ui/Card';

const TeamPerformance: React.FC = () => {
    return (
        <Card title="Ekip Performansı">
            <p className="text-text-secondary text-center py-8">
                Bu özellik şu anda yapım aşamasındadır. Yakında burada ekibinizin performans metriklerini ve hedeflerini takip edebileceksiniz.
            </p>
        </Card>
    );
};

export default TeamPerformance;

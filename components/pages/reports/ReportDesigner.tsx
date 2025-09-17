import React from 'react';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';

const ReportDesigner: React.FC = () => {
    return (
        <Card>
            <EmptyState
                icon={ICONS.reports}
                title="Rapor Tasarımcısı Yakında!"
                description="Bu özellik şu anda geliştirme aşamasındadır. Yakında kendi özel raporlarınızı oluşturabileceksiniz."
            />
        </Card>
    );
};

export default ReportDesigner;

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import LeadFormModal from '../sales/LeadFormModal';
import LeadConversionModal from '../sales/LeadConversionModal';

const LeadsPage: React.FC = () => {
    const { leads, hasPermission } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConversionOpen, setIsConversionOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const canManage = hasPermission('anlasma:yonet');

    const handleOpenNew = () => {
        setSelectedLead(null);
        setIsFormOpen(true);
    };

    const handleOpenConvert = (lead: Lead) => {
        setSelectedLead(lead);
        setIsConversionOpen(true);
    };
    
    return (
        <>
            <Card title="Potansiyel Müşteriler (Leads)" action={canManage && <Button onClick={handleOpenNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Ekle</span></Button>}>
                <table className="w-full text-left">
                    <thead><tr className="border-b dark:border-dark-border"><th className="p-2">İsim</th><th className="p-2">Şirket</th><th className="p-2">Durum</th><th className="p-2">Kaynak</th><th className="p-2">Eylemler</th></tr></thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id} className="border-b dark:border-dark-border">
                                <td className="p-2">{lead.name}</td>
                                <td className="p-2">{lead.company}</td>
                                <td className="p-2">{lead.status}</td>
                                <td className="p-2">{lead.source}</td>
                                <td className="p-2">
                                    {canManage && lead.status === 'Nitelikli' && <Button size="sm" onClick={() => handleOpenConvert(lead)}>Dönüştür</Button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            {isFormOpen && <LeadFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} lead={selectedLead} />}
            {isConversionOpen && selectedLead && <LeadConversionModal isOpen={isConversionOpen} onClose={() => setIsConversionOpen(false)} lead={selectedLead} />}
        </>
    );
};

export default LeadsPage;

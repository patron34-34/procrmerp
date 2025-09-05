import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../types';

interface CustomerOrgChartProps {
    customerId: number;
}

const ContactNode: React.FC<{ contact: Contact }> = ({ contact }) => (
    <div className="flex flex-col items-center p-3 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm w-48 text-center">
        <p className="font-bold text-text-main">{contact.name}</p>
        <p className="text-sm text-text-secondary">{contact.title}</p>
        <p className="text-xs text-text-secondary mt-2">{contact.email}</p>
    </div>
);


const CustomerOrgChart: React.FC<CustomerOrgChartProps> = ({ customerId }) => {
    const { contacts } = useApp();

    const customerContacts = useMemo(() => contacts.filter(c => c.customerId === customerId), [contacts, customerId]);

    // Simple hierarchy for now. A real implementation would need managerId on contacts.
    // For this demo, we assume a flat structure or a simple one.
    const rootContacts = customerContacts; // Assuming a flat structure for now

    const RenderTree: React.FC<{ contact: Contact }> = ({ contact }) => {
        // In a real app, you would find reports for this contact
        const reports: Contact[] = [];
        return (
            <li>
                <ContactNode contact={contact} />
                {reports.length > 0 && (
                    <ul>
                        {reports.map(report => <RenderTree key={report.id} contact={report} />)}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="overflow-x-auto p-4 bg-background dark:bg-dark-background rounded-lg">
            <div className="org-chart">
                 {rootContacts.length > 0 ? (
                    <ul>
                        {rootContacts.map(root => <RenderTree key={root.id} contact={root} />)}
                    </ul>
                ) : (
                    <p className="text-center text-text-secondary">Bu müşteri için kişi bulunamadı.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerOrgChart;

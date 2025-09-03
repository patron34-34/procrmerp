import React, { useState } from 'react';
import { Customer } from '../../types';
import KeyContacts from './KeyContacts';
import CustomerInfoCard from './CustomerInfoCard';
import ProactiveInsights from './ProactiveInsights';
import InlineCommunicationLogger from './InlineCommunicationLogger';

interface CustomerSidebarTabsProps {
    customer: Customer;
}

const CustomerSidebarTabs: React.FC<CustomerSidebarTabsProps> = ({ customer }) => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'info' | 'intelligence'>('contacts');

    const TabButton: React.FC<{ tabId: 'contacts' | 'info' | 'intelligence'; label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-3 text-sm font-semibold transition-colors flex-1 ${
                activeTab === tabId
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-transparent'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border shadow-sm">
            <div className="border-b border-border dark:border-dark-border flex">
                <TabButton tabId="contacts" label="Ana Kişiler" />
                <TabButton tabId="info" label="Cari Bilgileri" />
                <TabButton tabId="intelligence" label="Aktivite &amp; AI" />
            </div>
            <div className="p-6">
                {activeTab === 'contacts' && <KeyContacts customerId={customer.id} />}
                {activeTab === 'info' && <CustomerInfoCard customer={customer} />}
                {activeTab === 'intelligence' && (
                    <div className="space-y-6">
                        <InlineCommunicationLogger customerId={customer.id} />
                        <div>
                             <h4 className="font-semibold text-lg mb-2">Proaktif Öneriler</h4>
                            <ProactiveInsights customer={customer} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSidebarTabs;
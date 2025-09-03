import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCustomerSuggestions } from '../../services/geminiService';
import { Customer } from '../../types';
import { ICONS } from '../../constants';

interface ProactiveInsightsProps {
    customer: Customer;
}

const ProactiveInsights: React.FC<ProactiveInsightsProps> = ({ customer }) => {
    const { deals, projects, tickets } = useApp();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true);
            setError(null);
            try {
                const customerContext = {
                    customer: { id: customer.id, name: customer.name, status: customer.status, lastContact: customer.lastContact },
                    deals: deals.filter(d => d.customerId === customer.id).slice(-5),
                    projects: projects.filter(p => p.customerId === customer.id).slice(-3),
                    openTickets: tickets.filter(t => t.customerId === customer.id && (t.status === 'Açık' || t.status === 'Beklemede')),
                };
                const result = await generateCustomerSuggestions(customerContext);
                setSuggestions(result);
            } catch (err) {
                setError('Öneriler alınırken bir hata oluştu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [customer, deals, projects, tickets]);

    const getIconForAction = (actionType: string) => {
        switch (actionType) {
            case 'CREATE_TASK': return ICONS.tasks;
            case 'SCHEDULE_MEETING': return ICONS.meeting;
            case 'PROPOSE_UPSELL': return ICONS.sales;
            default: return ICONS.magic;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="spinner"></div>
                <span className="ml-3 text-text-secondary">Yapay Zeka analiz ediyor...</span>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (suggestions.length === 0) {
        return <p className="text-sm text-center text-text-secondary p-4">Bu müşteri için bir öneri bulunamadı.</p>;
    }

    return (
        <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-start gap-3">
                    <div className="text-primary-600 dark:text-primary-400 mt-1">{getIconForAction(suggestion.actionType)}</div>
                    <div>
                        <h5 className="font-bold text-sm">{suggestion.title}</h5>
                        <p className="text-xs text-text-secondary">{suggestion.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProactiveInsights;
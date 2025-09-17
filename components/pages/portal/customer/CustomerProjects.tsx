import React, { useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import Card from '../../../ui/Card';
import FeedbackCard from './FeedbackCard';

const CustomerProjects: React.FC = () => {
    const { currentUser, customers, contacts, projects } = useApp();

    const customerProjects = useMemo(() => {
        const contact = contacts.find(c => c.id === currentUser.contactId);
        if (!contact) return [];
        return projects.filter(p => p.customerId === contact.customerId);
    }, [currentUser, contacts, projects]);

    return (
        <div className="space-y-6">
            <Card title="Projelerim">
                <div className="space-y-4">
                {customerProjects.map(project => (
                    <div key={project.id} className="p-4 border rounded-lg dark:border-dark-border">
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p className="text-sm text-text-secondary">Durum: {project.status}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                    </div>
                ))}
                </div>
            </Card>
            <FeedbackCard />
        </div>
    );
};

export default CustomerProjects;

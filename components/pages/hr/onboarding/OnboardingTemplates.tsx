import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { OnboardingTemplate, OnboardingType } from '../../../../types';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { ICONS } from '../../../../constants';
import TemplateFormModal from '../../../hr/onboarding/TemplateFormModal';

const OnboardingTemplates: React.FC = () => {
    const { onboardingTemplates, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<OnboardingTemplate | null>(null);

    const canManage = hasPermission('ik:oryantasyon-yonet');

    const openModalForNew = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (template: OnboardingTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    return (
        <>
            <Card
                title="İşe Alım & İşten Çıkış Şablonları"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Şablon</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Şablon Adı</th>
                                <th className="p-3">Tür</th>
                                <th className="p-3">Görev Sayısı</th>
                                {canManage && <th className="p-3">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {onboardingTemplates.map(template => (
                                <tr key={template.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{template.name}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${template.type === OnboardingType.Onboarding ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                            {template.type}
                                        </span>
                                    </td>
                                    <td className="p-3">{template.items.length}</td>
                                    {canManage && <td className="p-3">
                                        <button onClick={() => openModalForEdit(template)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <TemplateFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    template={editingTemplate}
                />
            )}
        </>
    );
};

export default OnboardingTemplates;
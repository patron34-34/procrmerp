import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { RecurringJournalEntry } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import RecurringJournalEntryFormModal from '../../accounting/RecurringJournalEntryFormModal';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';

const RecurringJournalEntries: React.FC = () => {
    const { recurringJournalEntries, hasPermission, deleteRecurringJournalEntry, generateEntryFromRecurringTemplate } = useApp();
    const navigate = useNavigate();
    const { addToast } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<RecurringJournalEntry | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<RecurringJournalEntry | null>(null);

    const canManage = hasPermission('muhasebe:tekrarlanan-yonet');
    const today = new Date().toISOString().split('T')[0];

    const openModalForNew = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (template: RecurringJournalEntry) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if(templateToDelete) {
            deleteRecurringJournalEntry(templateToDelete.id);
            setTemplateToDelete(null);
        }
    };
    
    const handleGenerate = async (templateId: number) => {
        const newEntryId = await generateEntryFromRecurringTemplate(templateId);
        if (newEntryId) {
            addToast("Yevmiye fişi başarıyla oluşturuldu.", "success");
            navigate(`/accounting/journal-entries/${newEntryId}`);
        }
    };

    return (
        <>
            <Card
                title="Tekrarlanan Yevmiye Kayıtları"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Şablon</span></Button>}
            >
                 <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                    Düzenli olarak tekrarlanan muhasebe işlemleri için şablonlar oluşturun ve zamanı geldiğinde tek tıkla yevmiye fişlerini oluşturun.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Şablon Adı</th>
                            <th className="p-3 font-semibold">Sıklık</th>
                            <th className="p-3 font-semibold">Sıradaki Fiş Tarihi</th>
                            <th className="p-3 font-semibold text-right">Tutar</th>
                            <th className="p-3 font-semibold text-center">Eylemler</th>
                        </tr></thead>
                        <tbody>
                            {recurringJournalEntries.map(template => {
                                const isDue = template.nextDate <= today && (!template.endDate || template.endDate >= today);
                                return (
                                <tr key={template.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{template.name}</td>
                                    <td className="p-3">{template.frequency}</td>
                                    <td className={`p-3 font-semibold ${isDue ? 'text-orange-500' : ''}`}>{template.nextDate}</td>
                                    <td className="p-3 text-right font-mono">${template.totalAmount.toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Button onClick={() => handleGenerate(template.id)} disabled={!isDue} className="!px-3 !py-1 text-sm">
                                                Fiş Oluştur
                                            </Button>
                                            {canManage && (
                                                <>
                                                <button onClick={() => openModalForEdit(template)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                                <button onClick={() => setTemplateToDelete(template)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <RecurringJournalEntryFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    template={editingTemplate}
                />
            )}
             {canManage && <ConfirmationModal 
                isOpen={!!templateToDelete}
                onClose={() => setTemplateToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Tekrarlanan Kayıt Şablonunu Sil"
                message={`'${templateToDelete?.name}' adlı şablonu kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default RecurringJournalEntries;

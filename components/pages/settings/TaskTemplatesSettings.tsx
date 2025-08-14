import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TaskTemplate } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import EmptyState from '../../ui/EmptyState';
import TaskTemplateFormModal from '../../settings/TaskTemplateFormModal';
import ConfirmationModal from '../../ui/ConfirmationModal';

const TaskTemplatesSettings: React.FC = () => {
    const { taskTemplates, hasPermission, deleteTaskTemplate } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<TaskTemplate | null>(null);

    const canManage = hasPermission('ayarlar:genel-yonet');

    const openModalForNew = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (template: TaskTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (templateToDelete) {
            deleteTaskTemplate(templateToDelete.id);
            setTemplateToDelete(null);
        }
    };

    return (
        <>
            <Card
                title="Görev Şablonları Yönetimi"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Şablon</span></Button>}
            >
                <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                    Tekrarlayan iş akışlarınız için görev şablonları oluşturun ve yönetin. Bu şablonlar, Planlayıcı modülündeki 'Şablondan Oluştur' özelliği ile kullanılabilir.
                </p>
                <div className="overflow-x-auto">
                    {taskTemplates.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Şablon Adı</th>
                                <th className="p-3 font-semibold">Açıklama</th>
                                <th className="p-3 font-semibold text-center">Görev Sayısı</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {taskTemplates.map(template => (
                                    <tr key={template.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{template.name}</td>
                                        <td className="p-3 text-sm text-text-secondary dark:text-dark-text-secondary truncate max-w-sm">{template.description}</td>
                                        <td className="p-3 text-center">{template.items.length}</td>
                                        {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                            <button onClick={() => openModalForEdit(template)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                            <button onClick={() => setTemplateToDelete(template)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                        </div></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.planner}
                            title="Henüz Şablon Oluşturulmamış"
                            description="İlk görev şablonunuzu oluşturarak iş akışlarınızı otomatikleştirmeye başlayın."
                            action={canManage ? <Button onClick={openModalForNew}>Şablon Oluştur</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {isModalOpen && canManage && (
                <TaskTemplateFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    template={editingTemplate}
                />
            )}

            {canManage && (
                 <ConfirmationModal 
                    isOpen={!!templateToDelete}
                    onClose={() => setTemplateToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Görev Şablonunu Sil"
                    message={`'${templateToDelete?.name}' adlı şablonu kalıcı olarak silmek istediğinizden emin misiniz?`}
                />
            )}
        </>
    );
};

export default TaskTemplatesSettings;

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';
import { Project } from '../../types';
import { exportToCSV } from '../../utils/csvExporter';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';

const Projects: React.FC = () => {
  const { projects, employees, deleteProject, hasPermission, addProject, updateProject, customers } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  const canManageProjects = hasPermission('proje:yonet');
  
  // Form state moved from missing ProjectFormModal
  const initialFormState: Omit<Project, 'id' | 'client'> = {
    name: '',
    customerId: customers[0]?.id || 0,
    deadline: new Date().toISOString().split('T')[0],
    status: 'beklemede',
    progress: 0,
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    teamMemberIds: [],
    budget: 0,
    spent: 0,
    tags: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const [tagsInput, setTagsInput] = useState(''); // For comma-separated tags

  useEffect(() => {
    if (editingProject) {
        const { client, ...projectData } = editingProject;
        setFormData({ ...initialFormState, ...projectData });
        setTagsInput(editingProject.tags.join(', '));
    } else {
        setFormData(initialFormState);
        setTagsInput('');
    }
  }, [editingProject, isFormOpen]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['progress', 'customerId', 'budget', 'spent'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) : value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    const customer = customers.find(c => c.id === formData.customerId);
    const finalTags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const projectData = { ...formData, tags: finalTags };

    if (customer) {
        if (editingProject) {
            updateProject({ ...editingProject, ...projectData, client: customer.company });
        } else {
            addProject(projectData);
        }
        setIsFormOpen(false);
    }
  };
  
  const openModalForNew = () => {
    if (!canManageProjects) return;
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openModalForEdit = (project: Project) => {
    if (!canManageProjects) return;
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
        deleteProject(projectToDelete.id);
        setProjectToDelete(null);
    }
  };

  const handleExport = () => {
    const dataToExport = projects.map(({ id, customerId, teamMemberIds, ...rest }) => rest);
    exportToCSV(dataToExport, 'projeler.csv');
  };

  return (
    <>
    <Card 
        title="Tüm Projeler"
        action={
            <div className="flex items-center gap-2">
                <Button onClick={handleExport} variant="secondary">
                    <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                </Button>
                {canManageProjects && <Button onClick={openModalForNew}>
                    <span className="flex items-center gap-2">{ICONS.add} Yeni Ekle</span>
                </Button>}
            </div>
        }
    >
      <div className="overflow-x-auto">
      {projects.length > 0 ? (
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 dark:border-dark-border">
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              <th className="p-4 font-semibold">Proje Adı</th>
              <th className="p-4 font-semibold">Müşteri</th>
              <th className="p-4 font-semibold">Bitiş Tarihi</th>
              <th className="p-4 font-semibold">Takım</th>
              <th className="p-4 font-semibold">Bütçe</th>
              <th className="p-4 font-semibold">İlerleme</th>
              {canManageProjects && <th className="p-4 font-semibold">Eylemler</th>}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium">
                  <Link to={`/projects/${project.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {project.name}
                  </Link>
                   <div className="mt-1 flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{project.client}</td>
                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{project.deadline}</td>
                <td className="p-4">
                  <div className="flex -space-x-2">
                    {project.teamMemberIds.map(id => {
                      const member = employees.find(e => e.id === id);
                      return member ? <img key={id} src={member.avatar} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card"/> : null;
                    })}
                  </div>
                </td>
                <td className="p-4">
                  <div className="w-32">
                      <div className="flex justify-between text-xs text-text-secondary dark:text-dark-text-secondary">
                          <span>${project.spent.toLocaleString()}</span>
                          <span>${project.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700 mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(project.spent / project.budget) * 100}%` }}></div>
                      </div>
                  </div>
                </td>
                <td className="p-4">
                    <div className="flex items-center w-24">
                        <div className="w-full bg-slate-200 rounded-full h-2 mr-2 dark:bg-slate-700">
                            <div className={`h-2 rounded-full ${project.status === 'riskli' ? 'bg-yellow-500' : 'bg-primary-500'}`} style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                </td>
                {canManageProjects && <td className="p-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => openModalForEdit(project)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                        <button onClick={() => setProjectToDelete(project)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                    </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
            <EmptyState
                icon={ICONS.projects}
                title="Henüz Proje Yok"
                description="İlk projenizi ekleyerek yönetmeye başlayın."
                action={canManageProjects ? <Button onClick={openModalForNew}>Proje Ekle</Button> : undefined}
            />
        )}
      </div>
    </Card>

    {canManageProjects && (
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                  <label htmlFor="name" className="block text-sm font-medium">Proje Adı *</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleFormInputChange} className="mt-1 w-full" />
              </div>
              <div>
                  <label htmlFor="description" className="block text-sm font-medium">Açıklama</label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleFormInputChange} rows={3} className="mt-1 w-full"></textarea>
              </div>
              <div>
                  <label htmlFor="customerId" className="block text-sm font-medium">Müşteri *</label>
                  <select name="customerId" id="customerId" value={formData.customerId} onChange={handleFormInputChange} required className="mt-1 w-full">
                  {customers.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="startDate" className="block text-sm font-medium">Başlangıç Tarihi</label>
                      <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleFormInputChange} className="mt-1 w-full" />
                  </div>
                  <div>
                      <label htmlFor="deadline" className="block text-sm font-medium">Bitiş Tarihi</label>
                      <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleFormInputChange} className="mt-1 w-full" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="budget" className="block text-sm font-medium">Bütçe ($)</label>
                      <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleFormInputChange} className="mt-1 w-full" />
                  </div>
                  <div>
                      <label htmlFor="spent" className="block text-sm font-medium">Harcanan ($)</label>
                      <input type="number" name="spent" id="spent" value={formData.spent} onChange={handleFormInputChange} className="mt-1 w-full" />
                  </div>
              </div>
               <div>
                  <label htmlFor="tags" className="block text-sm font-medium">Etiketler (virgülle ayırın)</label>
                  <input type="text" name="tags" id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-1 w-full" />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                  <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>İptal</Button>
                  <Button type="submit">{editingProject ? "Güncelle" : "Ekle"}</Button>
              </div>
          </form>
      </Modal>
    )}
    
    {canManageProjects && <ConfirmationModal 
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Projeyi Sil"
        message={`'${projectToDelete?.name}' adlı projeyi kalıcı olarak silmek istediğinizden emin misiniz?`}
    />}
    </>
  );
};

export default Projects;
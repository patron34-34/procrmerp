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
import ProjectFormModal from '../projects/ProjectFormModal';

const Projects: React.FC = () => {
  const { projects, employees, deleteProject, hasPermission } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  const canManageProjects = hasPermission('proje:yonet');
  
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
          <thead className="border-b border-border">
            <tr className="bg-slate-50 dark:bg-sidebar">
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
              <tr key={project.id} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium">
                  <Link to={`/projects/${project.id}`} className="hover:text-primary-600">
                    {project.name}
                  </Link>
                   <div className="mt-1 flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-text-secondary">{project.client}</td>
                <td className="p-4 text-text-secondary">{project.deadline}</td>
                <td className="p-4">
                  <div className="flex -space-x-2">
                    {project.teamMemberIds.map(id => {
                      const member = employees.find(e => e.id === id);
                      return member ? <img key={id} src={member.avatar} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-card"/> : null;
                    })}
                  </div>
                </td>
                <td className="p-4">
                  <div className="w-32">
                      <div className="flex justify-between text-xs text-text-secondary">
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
                        <button onClick={() => openModalForEdit(project)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                        <button onClick={() => setProjectToDelete(project)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
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
    {isFormOpen && (
        <ProjectFormModal 
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            project={editingProject}
        />
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
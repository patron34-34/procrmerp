import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';
import { Project } from '../../types';
import { exportToCSV } from '../../utils/csvExporter';
import { Link } from 'react-router-dom';

type SortConfig = { key: keyof Project; direction: 'ascending' | 'descending' } | null;
type ViewMode = 'list' | 'grid';

const ProjectGridCard: React.FC<{ project: Project; employees: any[]; onEdit: () => void; onDelete: () => void; canManage: boolean; }> = ({ project, employees, onEdit, onDelete, canManage }) => (
    <Card className="flex flex-col h-full">
        <div className="flex justify-between items-start">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'riskli' ? 'bg-yellow-100 text-yellow-800' : project.status === 'tamamlandı' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{project.status}</span>
            {canManage && (
                <div className="flex gap-1">
                    <button onClick={onEdit} className="p-1 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100">{React.cloneElement(ICONS.edit, { className: "h-4 w-4"})}</button>
                    <button onClick={onDelete} className="p-1 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100">{React.cloneElement(ICONS.trash, { className: "h-4 w-4"})}</button>
                </div>
            )}
        </div>
        <div className="flex-grow my-3">
            <Link to={`/projects/${project.id}`} className="font-bold text-lg hover:text-primary-600 block">{project.name}</Link>
            <p className="text-sm text-text-secondary">{project.client}</p>
        </div>
        <div className="text-sm space-y-2">
            <div>
                <div className="flex justify-between text-xs text-text-secondary"><span>İlerleme</span><span>{project.progress}%</span></div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1"><div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div></div>
            </div>
             <div>
                <div className="flex justify-between text-xs text-text-secondary"><span>Bütçe</span><span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span></div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${project.budget > 0 ? (project.spent / project.budget) * 100 : 0}%` }}></div></div>
            </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
            <div className="flex -space-x-2">
                {project.teamMemberIds.slice(0, 4).map(id => {
                    const member = employees.find(e => e.id === id);
                    return member ? <img key={id} src={member.avatar} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-card"/> : null;
                })}
            </div>
            <span className="text-xs text-text-secondary">Bitiş: {project.deadline}</span>
        </div>
    </Card>
);

const Projects: React.FC = () => {
    const { projects, employees, deleteProject, hasPermission, setIsProjectFormOpen } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'deadline', direction: 'ascending' });
    
    const canManageProjects = hasPermission('proje:yonet');
    
    const openModalForNew = () => {
        if (!canManageProjects) return;
        setIsProjectFormOpen(true, null);
    };

    const openModalForEdit = (project: Project) => {
        if (!canManageProjects) return;
        setIsProjectFormOpen(true, project);
    };

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const searchMatch = searchTerm === '' ||
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const statusMatch = statusFilter === 'all' || project.status === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [projects, searchTerm, statusFilter]);

    const sortedProjects = useMemo(() => {
        let sortableItems = [...filteredProjects];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Project;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredProjects, sortConfig]);

    const handleExport = useCallback(() => {
        const dataToExport = sortedProjects.map(({ id, customerId, teamMemberIds, ...rest }) => rest);
        exportToCSV(dataToExport, 'projeler.csv');
    }, [sortedProjects]);
    
    const handleSort = useCallback((key: keyof Project) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const SortableHeader: React.FC<{ columnKey: keyof Project; title: string; }> = ({ columnKey, title }) => (
        <th className="p-3 font-semibold cursor-pointer" onClick={() => handleSort(columnKey)}>
            {title} {sortConfig?.key === columnKey && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </th>
    );

    return (
        <>
            <Card>
                <div className="p-4 border-b border-border flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <input type="text" placeholder="Proje, müşteri veya etiket ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64"/>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Durumlar</option>
                            <option value="zamanında">Zamanında</option>
                            <option value="riskli">Riskli</option>
                            <option value="tamamlandı">Tamamlandı</option>
                            <option value="beklemede">Beklemede</option>
                        </select>
                        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center">
                            <button onClick={() => setViewMode('grid')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Grid</button>
                            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Liste</button>
                        </div>
                    </div>
                    {canManageProjects && (
                        <div className="flex items-center gap-2">
                             <Button onClick={handleExport} variant="secondary">
                                <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                            </Button>
                            <Button onClick={openModalForNew}>
                                <span className="flex items-center gap-2">{ICONS.add} Yeni Proje</span>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    {sortedProjects.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProjects.map(project => (
                                    <ProjectGridCard 
                                        key={project.id} 
                                        project={project} 
                                        employees={employees} 
                                        onEdit={() => openModalForEdit(project)}
                                        onDelete={() => setProjectToDelete(project)}
                                        canManage={canManageProjects}
                                    />
                                ))}
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="border-b border-border"><tr className="bg-slate-50 dark:bg-sidebar">
                                    <SortableHeader columnKey="name" title="Proje Adı" />
                                    <SortableHeader columnKey="client" title="Müşteri" />
                                    <SortableHeader columnKey="deadline" title="Bitiş Tarihi" />
                                    <th className="p-3 font-semibold">Takım</th>
                                    <SortableHeader columnKey="progress" title="İlerleme" />
                                    {canManageProjects && <th className="p-3 font-semibold">Eylemler</th>}
                                </tr></thead>
                                <tbody>{sortedProjects.map(p => <tr key={p.id} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium"><Link to={`/projects/${p.id}`} className="hover:text-primary-600">{p.name}</Link></td>
                                    <td className="p-3">{p.client}</td><td className="p-3">{p.deadline}</td>
                                    <td className="p-3"><div className="flex -space-x-2">{p.teamMemberIds.map(id => { const m = employees.find(e=>e.id===id); return m ? <img key={id} src={m.avatar} title={m.name} className="w-8 h-8 rounded-full border-2 border-white"/>:null})}</div></td>
                                    <td className="p-3"><div className="flex items-center w-24"><div className="w-full bg-slate-200 rounded-full h-2 mr-2"><div className={`h-2 rounded-full ${p.status === 'riskli' ? 'bg-yellow-500' : 'bg-primary-500'}`} style={{width: `${p.progress}%`}}></div></div><span className="text-sm font-semibold">{p.progress}%</span></div></td>
                                    {canManageProjects && <td className="p-3"><div className="flex gap-2"><button onClick={()=>openModalForEdit(p)}>{React.cloneElement(ICONS.edit, { className: 'h-5 w-5' })}</button><button onClick={()=>setProjectToDelete(p)}>{React.cloneElement(ICONS.trash, { className: 'h-5 w-5' })}</button></div></td>}
                                </tr>)}</tbody>
                            </table>
                        )
                    ) : (
                        <EmptyState icon={ICONS.projects} title="Proje Bulunamadı" description="Filtrelerinizi değiştirin veya yeni bir proje ekleyin."/>
                    )}
                </div>
            </Card>
            
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

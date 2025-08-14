import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import CommentsThread from '../collaboration/CommentsThread';
import { TaskStatus, DocumentType, Project } from '../../types';
import { ICONS, PROJECT_HOURLY_RATE } from '../../constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { projects, tasks, documents, customers, employees, updateProject, hasPermission } = useApp();
    const projectId = parseInt(id || '', 10);
    const project = projects.find(p => p.id === projectId);
    const customer = customers.find(c => c.id === project?.customerId);

    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const canManageProjects = hasPermission('proje:yonet');

    const projectTasks = useMemo(() => tasks.filter(t => t.relatedEntityType === 'project' && t.relatedEntityId === projectId), [tasks, projectId]);
    const projectDocs = useMemo(() => documents.filter(d => d.relatedEntityType === 'project' && d.relatedEntityId === projectId), [documents, projectId]);
    const projectTeam = useMemo(() => employees.filter(e => project?.teamMemberIds.includes(e.id)), [employees, project]);
    
    const spentAmount = useMemo(() => {
        const totalMinutes = projectTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
        return (totalMinutes / 60) * PROJECT_HOURLY_RATE;
    }, [projectTasks]);


    if (!project) {
        return <Card title="Hata"><p>Proje bulunamadı. Lütfen <Link to="/projects">Projeler sayfasına</Link> geri dönün.</p></Card>;
    }
    
    const handleAddTeamMember = (employeeId: number) => {
        if (!project.teamMemberIds.includes(employeeId)) {
            const updatedProject = { ...project, teamMemberIds: [...project.teamMemberIds, employeeId] };
            updateProject(updatedProject);
        }
    };
    
    const handleRemoveTeamMember = (employeeId: number) => {
        const updatedProject = { ...project, teamMemberIds: project.teamMemberIds.filter(id => id !== employeeId) };
        updateProject(updatedProject);
    };

    const getStatusBadge = (status: string) => {
        const styles: { [key: string]: string } = {
          zamanında: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          riskli: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          tamamlandı: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          beklemede: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const getTaskStatusBadge = (status: TaskStatus) => {
        const styles: { [key in TaskStatus]: string } = {
          [TaskStatus.Todo]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
          [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          [TaskStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const getFileIcon = (type?: DocumentType) => {
        switch (type) {
            case DocumentType.PDF: return ICONS.filePdf;
            case DocumentType.Word: return ICONS.fileWord;
            case DocumentType.Excel: return ICONS.fileExcel;
            case DocumentType.Image: return ICONS.fileImage;
            default: return ICONS.fileOther;
        }
    };

    const budgetProgress = (spentAmount / project.budget) * 100;

    return (
        <>
        <div className="space-y-6">
             <div className="mb-4">
                <Link to="/projects" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main">
                    &larr; Projelere Geri Dön
                </Link>
            </div>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold">{project.name}</h2>
                            {getStatusBadge(project.status)}
                        </div>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
                            Müşteri: <Link to={`/customers/${customer?.id}`} className="text-primary-600 hover:underline">{project.client}</Link>
                        </p>
                    </div>
                    <div className="flex-shrink-0 text-right text-sm">
                        <p><strong>Başlangıç:</strong> {project.startDate}</p>
                        <p><strong>Bitiş:</strong> {project.deadline}</p>
                    </div>
                </div>
                 <div className="mt-4">
                    <label className="text-sm font-medium">Proje İlerlemesi</label>
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 space-y-6">
                     <Card title="Proje Özeti">
                         <p className="text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{project.description}</p>
                         <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                            ))}
                         </div>
                     </Card>
                     <Card title="İlgili Görevler">
                        {projectTasks.length > 0 ? (
                            <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 dark:bg-slate-900/50 sticky top-0"><th className="p-3 font-semibold">Görev</th><th className="p-3 font-semibold">Atanan</th><th className="p-3 font-semibold">Durum</th></tr></thead>
                            <tbody>{projectTasks.map(task => (<tr key={task.id} className="border-b last:border-b-0 dark:border-dark-border"><td className="p-3 font-medium">{task.title}</td><td className="p-3">{task.assignedToName}</td><td className="p-3">{getTaskStatusBadge(task.status)}</td></tr>))}</tbody>
                            </table></div>
                        ) : <p className="text-text-secondary dark:text-dark-text-secondary p-4 text-center">Bu projeye ait görev bulunmuyor.</p>}
                     </Card>
                     <Card title="Dokümanlar">
                        {projectDocs.length > 0 ? (
                            <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 dark:bg-slate-900/50 sticky top-0"><th className="p-3 font-semibold">Dosya</th><th className="p-3 font-semibold">Yükleyen</th></tr></thead>
                            <tbody>{projectDocs.map(doc => (<tr key={doc.id} className="border-b last:border-b-0 dark:border-dark-border"><td className="p-3 font-medium flex items-center gap-2">{getFileIcon(doc.documentType)}{doc.name}</td><td className="p-3">{doc.uploadedByName}</td></tr>))}</tbody>
                            </table></div>
                        ) : <p className="text-text-secondary dark:text-dark-text-secondary p-4 text-center">Bu projeye ait doküman bulunmuyor.</p>}
                     </Card>
                 </div>
                 <div className="lg:col-span-1 space-y-6">
                    <Card title="Bütçe Durumu">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Harcanan (Görev Süresinden)</p>
                                <p className="text-2xl font-bold">${spentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Toplam Bütçe</p>
                                <p className="text-lg font-semibold">${project.budget.toLocaleString()}</p>
                            </div>
                            <div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                    <div className={`h-2.5 rounded-full ${budgetProgress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div>
                                </div>
                                <p className={`text-sm font-semibold mt-1 ${budgetProgress > 100 ? 'text-red-500' : 'text-green-600'}`}>
                                    {budgetProgress > 100 ? `Bütçe aşıldı: $${(spentAmount - project.budget).toLocaleString()}` : `Kalan: $${(project.budget - spentAmount).toLocaleString()}`}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card title="Proje Takımı" action={canManageProjects && <Button variant="secondary" onClick={() => setIsTeamModalOpen(true)}>Üye Ekle</Button>}>
                        <div className="space-y-3">
                            {projectTeam.map(member => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full"/>
                                        <div>
                                            <p className="font-semibold text-sm">{member.name}</p>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{member.position}</p>
                                        </div>
                                    </div>
                                    {canManageProjects && <button onClick={() => handleRemoveTeamMember(member.id)} className="text-slate-400 hover:text-red-500">{ICONS.trash}</button>}
                                </div>
                            ))}
                        </div>
                    </Card>
                 </div>
            </div>
            <Card title="Proje Tartışması">
                <CommentsThread entityType="project" entityId={projectId} />
            </Card>
        </div>

        {canManageProjects && <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Takıma Üye Ekle">
            <div className="space-y-3">
                {employees.filter(e => !project.teamMemberIds.includes(e.id)).map(employee => (
                    <div key={employee.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                           <img src={employee.avatar} alt={employee.name} className="w-9 h-9 rounded-full"/>
                            <div>
                                <p className="font-semibold text-sm">{employee.name}</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{employee.position}</p>
                            </div>
                        </div>
                        <Button onClick={() => handleAddTeamMember(employee.id)}>Ekle</Button>
                    </div>
                ))}
            </div>
        </Modal>}
        </>
    );
};

export default ProjectDetail;

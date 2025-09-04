import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import CommentsThread from '../collaboration/CommentsThread';
import { TaskStatus, DocumentType, Project, Comment, Task } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { summarizeProject } from '../../services/geminiService';
import { useNotification } from '../../context/NotificationContext';
import ProjectTaskKanbanView from '../projects/ProjectTaskKanbanView';
import ProjectTaskGanttView from '../projects/ProjectTaskGanttView';


type ActiveTab = 'overview' | 'kanban' | 'gantt';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { projects, tasks, documents, customers, employees, updateProject, hasPermission, comments } = useApp();
    const { addToast } = useNotification();
    const projectId = parseInt(id || '', 10);
    const project = projects.find(p => p.id === projectId);
    const customer = customers.find(c => c.id === project?.customerId);

    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);


    const canManageProjects = hasPermission('proje:yonet');

    const projectTasks = useMemo(() => tasks.filter(t => t.relatedEntityType === 'project' && t.relatedEntityId === projectId), [tasks, projectId]);
    const projectDocs = useMemo(() => documents.filter(d => d.relatedEntityType === 'project' && d.relatedEntityId === projectId), [documents, projectId]);
    const projectTeam = useMemo(() => employees.filter(e => project?.teamMemberIds.includes(e.id)), [employees, project]);
    const projectComments = useMemo(() => comments.filter(c => c.relatedEntityType === 'project' && c.relatedEntityId === projectId), [comments, projectId]);
    

    if (!project) {
        return <Card title="Hata"><p>Proje bulunamadı. Lütfen <Link to="/projects">Projeler sayfasına</Link> geri dönün.</p></Card>;
    }

    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary('');
        try {
            const result = await summarizeProject(project, projectComments, projectTasks);
            setSummary(result);
            addToast("Proje özeti başarıyla oluşturuldu.", "success");
        } catch (error) {
            console.error("Error summarizing project:", error);
            addToast("Proje özeti oluşturulurken bir hata oluştu.", "error");
        } finally {
            setIsSummarizing(false);
        }
    };
    
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

    const budgetProgress = (project.spent / project.budget) * 100;

    const renderOverview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Proje Özeti" action={
                    <Button onClick={handleSummarize} disabled={isSummarizing} variant="secondary" size="sm">
                        <span className="flex items-center gap-2">{ICONS.magic} {isSummarizing ? 'Özetleniyor...' : 'AI ile Özetle'}</span>
                    </Button>
                }>
                    {summary && (
                        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                             <p className="text-sm mt-2 whitespace-pre-wrap">{summary}</p>
                        </div>
                    )}
                    <p className="text-text-secondary whitespace-pre-wrap">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                        ))}
                    </div>
                </Card>
                <Card title="Proje Tartışması">
                    <CommentsThread entityType="project" entityId={projectId} />
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
               <Card title="Bütçe Durumu">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-text-secondary">Harcanan (Görev Süresinden)</p>
                            <p className="text-2xl font-bold">${project.spent.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Toplam Bütçe</p>
                            <p className="text-lg font-semibold">${project.budget.toLocaleString()}</p>
                        </div>
                        <div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                <div className={`h-2.5 rounded-full ${budgetProgress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div>
                            </div>
                            <p className={`text-sm font-semibold mt-1 ${budgetProgress > 100 ? 'text-red-500' : 'text-green-600'}`}>
                                {budgetProgress > 100 ? `Bütçe aşıldı: $${(project.spent - project.budget).toLocaleString()}` : `Kalan: $${(project.budget - project.spent).toLocaleString()}`}
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
                                        <p className="text-xs text-text-secondary">{member.position}</p>
                                    </div>
                                </div>
                                {canManageProjects && <button onClick={() => handleRemoveTeamMember(member.id)} className="text-slate-400 hover:text-red-500">{ICONS.trash}</button>}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'kanban':
                return <ProjectTaskKanbanView tasks={projectTasks} />;
            case 'gantt':
                return <ProjectTaskGanttView tasks={projectTasks} />;
            default:
                return null;
        }
    };

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
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'riskli' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{project.status}</span>
                        </div>
                        <p className="text-text-secondary mt-1">
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

             <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-border'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Genel Bakış</button>
                    <button onClick={() => setActiveTab('kanban')} className={`${activeTab === 'kanban' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-border'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Görev Panosu</button>
                    <button onClick={() => setActiveTab('gantt')} className={`${activeTab === 'gantt' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-border'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Zaman Çizelgesi</button>
                </nav>
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>

        </div>

        {canManageProjects && <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Takıma Üye Ekle">
            <div className="space-y-3">
                {employees.filter(e => !project.teamMemberIds.includes(e.id)).map(employee => (
                    <div key={employee.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                           <img src={employee.avatar} alt={employee.name} className="w-9 h-9 rounded-full"/>
                            <div>
                                <p className="font-semibold text-sm">{employee.name}</p>
                                <p className="text-xs text-text-secondary">{employee.position}</p>
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
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import CommentsThread from '../collaboration/CommentsThread';
import { Project, Comment, Task, Expense } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { summarizeProject } from '../../services/geminiService';
import { useNotification } from '../../context/NotificationContext';
import TaskKanbanView from '../tasks/TaskKanbanView';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';

type ActiveTab = 'overview' | 'tasks' | 'budget' | 'discussion';

const ProjectExpenseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Expense, 'id' | 'employeeName' | 'status' | 'projectId'>) => void;
    project: Project;
}> = ({ isOpen, onClose, onSubmit, project }) => {
    const { currentUser, employees } = useApp();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [employeeId, setEmployeeId] = useState(currentUser.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (description.trim() && !isNaN(numAmount) && numAmount > 0) {
            onSubmit({
                employeeId: employeeId,
                submissionDate: date,
                description,
                category: 'Diğer',
                amount: numAmount,
                attachments: []
            });
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Proje Gideri Ekle: ${project.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label>Açıklama</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full" /></div>
                <div><label>Tutar</label><input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full" /></div>
                <div><label>Tarih</label><input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full" /></div>
                <div>
                    <label>Gideri Yapan</label>
                    <select value={employeeId} onChange={e => setEmployeeId(Number(e.target.value))} className="w-full">
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="secondary" onClick={onClose}>İptal</Button><Button type="submit">Ekle</Button></div>
            </form>
        </Modal>
    );
};


const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        projects, tasks, customers, employees, hasPermission, comments, updateTaskStatus, 
        setIsProjectFormOpen, expenses, addProjectExpense, deleteExpense, hrParameters, updateProject 
    } = useApp();
    const { addToast } = useNotification();
    const projectId = parseInt(id || '', 10);
    const project = projects.find(p => p.id === projectId);
    const customer = customers.find(c => c.id === project?.customerId);

    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>(project?.teamMemberIds || []);


    const canManageProjects = hasPermission('proje:yonet');
    
    useEffect(() => {
        if (project && isTeamModalOpen) {
            setSelectedTeamMembers(project.teamMemberIds);
        }
    }, [project, isTeamModalOpen]);

    const handleTeamMemberToggle = (memberId: number) => {
        setSelectedTeamMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId) 
                : [...prev, memberId]
        );
    };

    const handleTeamUpdate = () => {
        if (project) {
            updateProject({ ...project, teamMemberIds: selectedTeamMembers });
            setIsTeamModalOpen(false);
            addToast('Proje takımı güncellendi.', 'success');
        }
    };


    const projectTasks = useMemo(() => tasks.filter(t => t.relatedEntityType === 'project' && t.relatedEntityId === projectId), [tasks, projectId]);
    const projectTeam = useMemo(() => employees.filter(e => project?.teamMemberIds.includes(e.id)), [employees, project]);
    const projectComments = useMemo(() => comments.filter(c => c.relatedEntityType === 'project' && c.relatedEntityId === projectId), [comments, projectId]);
    const projectExpenses = useMemo(() => expenses.filter(e => e.projectId === projectId), [expenses, projectId]);
    const projectTimeCosts = useMemo(() => 
        projectTasks
            .filter(t => t.timeSpent && t.timeSpent > 0)
            .map(t => ({
                task: t,
                cost: (t.timeSpent! / 60) * hrParameters.DEFAULT_HOURLY_RATE
            })), 
        [projectTasks, hrParameters.DEFAULT_HOURLY_RATE]
    );
    
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
            addToast("Proje özeti oluşturulurken bir hata oluştu.", "error");
        } finally {
            setIsSummarizing(false);
        }
    };
    
    const handleDeleteExpense = () => {
        if(expenseToDelete) {
            deleteExpense(expenseToDelete.id);
            setExpenseToDelete(null);
            addToast("Gider silindi.", "success");
        }
    };

    const TabButton: React.FC<{ tabName: ActiveTab, label: string }> = ({ tabName, label }) => (
         <button 
            onClick={() => setActiveTab(tabName)} 
            className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm ${activeTab === tabName ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-border'}`}
        >
            {label}
        </button>
    );

    const renderOverview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Proje Özeti" action={
                    <Button onClick={handleSummarize} disabled={isSummarizing} variant="secondary" size="sm">
                        <span className="flex items-center gap-2">{ICONS.magic} {isSummarizing ? 'Özetleniyor...' : 'AI ile Özetle'}</span>
                    </Button>
                }>
                    {summary && <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg"><p className="whitespace-pre-wrap">{summary}</p></div>}
                    <p className="text-text-secondary whitespace-pre-wrap">{project.description}</p>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6 sticky top-24">
                <Card 
                    title="Proje Takımı"
                    action={canManageProjects ? <Button size="sm" variant="secondary" onClick={() => setIsTeamModalOpen(true)}>Üye Ekle/Çıkar</Button> : undefined}
                >
                    <div className="space-y-3">
                        {projectTeam.length > 0 ? projectTeam.map(member => (
                            <div key={member.id} className="flex items-center gap-3">
                                <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-sm">{member.name}</p>
                                    <p className="text-xs text-text-secondary">{member.position}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-center text-text-secondary py-4">Bu projeye henüz üye eklenmedi.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
    
    const renderBudgetTab = () => {
        const budgetProgress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Proje Giderleri" action={canManageProjects ? <Button onClick={() => setIsExpenseModalOpen(true)}>Yeni Gider Ekle</Button> : undefined}>
                        {projectExpenses.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-2 font-semibold">Açıklama</th><th className="p-2 font-semibold">Tarih</th><th className="p-2 font-semibold text-right">Tutar</th>{canManageProjects && <th className="p-2 w-10"></th>}
                                </tr></thead>
                                <tbody>
                                    {projectExpenses.map(exp => (
                                        <tr key={exp.id} className="border-b dark:border-dark-border last:border-0">
                                            <td className="p-2">{exp.description}</td>
                                            <td className="p-2">{exp.submissionDate}</td>
                                            <td className="p-2 text-right font-mono">${exp.amount.toLocaleString()}</td>
                                            {canManageProjects && <td className="p-2 text-right"><button onClick={() => setExpenseToDelete(exp)} className="text-red-500 hover:text-red-700">{React.cloneElement(ICONS.trash, { className: "w-4 h-4"})}</button></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center text-text-secondary py-4">Bu projeye henüz bir gider eklenmedi.</p>}
                    </Card>
                    <Card title="Zaman Girdileri Maliyeti">
                         {projectTimeCosts.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-2 font-semibold">Görev</th><th className="p-2 font-semibold">Süre</th><th className="p-2 font-semibold text-right">Maliyet</th>
                                </tr></thead>
                                <tbody>
                                    {projectTimeCosts.map(tc => (
                                        <tr key={tc.task.id} className="border-b dark:border-dark-border last:border-0">
                                            <td className="p-2">{tc.task.title}</td>
                                            <td className="p-2">{Math.floor(tc.task.timeSpent! / 60)}s {tc.task.timeSpent! % 60}d</td>
                                            <td className="p-2 text-right font-mono">${tc.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center text-text-secondary py-4">Bu projeye henüz zaman girişi yapılmadı.</p>}
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6 sticky top-24">
                    <Card title="Bütçe Durumu">
                         <div className="space-y-3">
                            <div><p className="text-sm text-text-secondary">Harcanan</p><p className="text-2xl font-bold">${project.spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                            <div><p className="text-sm text-text-secondary">Toplam Bütçe</p><p className="text-lg font-semibold">${project.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                            <div>
                                <div className="flex justify-between text-xs text-text-secondary"><span>Kullanım</span><span>{budgetProgress.toFixed(1)}%</span></div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1"><div className={`h-2.5 rounded-full ${budgetProgress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div></div>
                            </div>
                            <div><p className="text-sm text-text-secondary">Kalan Bütçe</p><p className={`text-xl font-bold ${project.budget - project.spent < 0 ? 'text-red-500' : 'text-green-600'}`}>${(project.budget - project.spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold">{project.name}</h2>
                            <p className="text-text-secondary mt-1">Müşteri: <Link to={`/customers/${customer?.id}`} className="text-primary-600 hover:underline">{project.client}</Link></p>
                        </div>
                        {canManageProjects && <Button onClick={() => setIsProjectFormOpen(true, project)}>Projeyi Düzenle</Button>}
                    </div>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-text-secondary">Durum</p><p className="font-semibold">{project.status}</p></div>
                        <div><p className="text-text-secondary">Başlangıç</p><p className="font-semibold">{project.startDate}</p></div>
                        <div><p className="text-text-secondary">Bitiş</p><p className="font-semibold">{project.deadline}</p></div>
                    </div>
                </Card>

                <div className="border-b border-border">
                    <nav className="-mb-px flex space-x-8"><TabButton tabName="overview" label="Genel Bakış" /><TabButton tabName="tasks" label="Görevler" /><TabButton tabName="budget" label="Bütçe & Harcamalar" /><TabButton tabName="discussion" label="Tartışma" /></nav>
                </div>
                
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'tasks' && <TaskKanbanView tasks={projectTasks} onTaskClick={() => {}} onStatusChange={(taskId, status) => updateTaskStatus(taskId, status)} />}
                {activeTab === 'budget' && renderBudgetTab()}
                {activeTab === 'discussion' && <Card><CommentsThread entityType="project" entityId={projectId} /></Card>}
            </div>
            
            <ProjectExpenseModal 
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onSubmit={(data) => addProjectExpense({ ...data, projectId: project.id })}
                project={project}
            />
             <ConfirmationModal 
                isOpen={!!expenseToDelete}
                onClose={() => setExpenseToDelete(null)}
                onConfirm={handleDeleteExpense}
                title="Gideri Sil"
                message={`'${expenseToDelete?.description}' adlı gideri silmek istediğinizden emin misiniz?`}
            />
            <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Proje Takımını Düzenle">
                <div className="space-y-4">
                    <p>Projeye dahil edilecek ekip üyelerini seçin.</p>
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {employees.map(employee => (
                            <label key={employee.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTeamMembers.includes(employee.id)}
                                    onChange={() => handleTeamMemberToggle(employee.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold text-sm">{employee.name}</p>
                                    <p className="text-xs text-text-secondary">{employee.position}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t dark:border-dark-border">
                        <Button variant="secondary" onClick={() => setIsTeamModalOpen(false)}>İptal</Button>
                        <Button onClick={handleTeamUpdate}>Kaydet</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProjectDetail;
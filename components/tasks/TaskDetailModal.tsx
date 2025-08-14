import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, Attachment, DocumentType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CommentsThread from '../collaboration/CommentsThread';
import { ICONS } from '../../constants';
import ConfirmationModal from '../ui/ConfirmationModal';
import { Link } from 'react-router-dom';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onEdit }) => {
    const { 
        hasPermission, deleteTask, 
        addSubtask,
        tasks: allTasks, addTaskDependency, removeTaskDependency,
        logTimeOnTask, updateTask, addAttachmentToTask,
        deleteAttachmentFromTask, currentUser
    } = useApp();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [dependencyToAdd, setDependencyToAdd] = useState('');
    const [timeToLog, setTimeToLog] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canManageTasks = hasPermission('gorev:yonet');
    
    const subtasks = useMemo(() => 
        allTasks.filter(t => t.parentId === task.id),
        [allTasks, task.id]
    );

    const dependencies = useMemo(() => 
        allTasks.filter(t => task.dependsOn?.includes(t.id)), 
        [allTasks, task.dependsOn]
    );

    const possibleDependencies = useMemo(() => 
        allTasks.filter(t => t.id !== task.id && !task.dependsOn?.includes(t.id) && t.parentId === undefined),
        [allTasks, task]
    );
    
    const handleDeleteRequest = () => {
        if (!canManageTasks) return;
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        deleteTask(task.id);
        setIsDeleteModalOpen(false);
        onClose();
    };
    
    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtask.trim() && canManageTasks) {
            addSubtask(task.id, newSubtask.trim());
            setNewSubtask('');
        }
    };
    
    const handleAddDependency = () => {
        if (dependencyToAdd && canManageTasks) {
            addTaskDependency(task.id, parseInt(dependencyToAdd));
            setDependencyToAdd('');
        }
    };
    
    const handleUploadClick = () => {
        if (canManageTasks) {
            fileInputRef.current?.click();
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && canManageTasks) {
            Array.from(e.target.files).forEach(file => {
                const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
                let docType: DocumentType = DocumentType.Other;
                if (fileExt === 'pdf') docType = DocumentType.PDF;
                else if (['doc', 'docx'].includes(fileExt)) docType = DocumentType.Word;
                else if (['xls', 'xlsx'].includes(fileExt)) docType = DocumentType.Excel;
                else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) docType = DocumentType.Image;
                
                const newAttachment: Attachment = {
                    id: Date.now() + Math.random(),
                    fileName: file.name,
                    fileType: docType,
                    fileSize: Math.round(file.size / 1024), // in KB
                    url: '#', // mock
                    uploadedAt: new Date().toISOString(),
                    uploadedById: currentUser.id,
                };
                addAttachmentToTask(task.id, newAttachment);
            });
             // Clear the input value to allow selecting the same file again
            e.target.value = '';
        }
    };

    const getFileIcon = (type: DocumentType | string) => {
        switch (type) {
            case DocumentType.PDF: return ICONS.filePdf;
            case DocumentType.Word: return ICONS.fileWord;
            case DocumentType.Excel: return ICONS.fileExcel;
            case DocumentType.Image: return ICONS.fileImage;
            default: return ICONS.fileOther;
        }
    };

    const handleLogTime = (e: React.FormEvent) => {
        e.preventDefault();
        const timeInHours = parseFloat(timeToLog);
        if (timeInHours > 0 && canManageTasks) {
            logTimeOnTask(task.id, timeInHours * 60);
            setTimeToLog('');
        }
    };
    
    const handleSubtaskToggle = (subtask: Task) => {
      if (!canManageTasks) return;
      const newStatus = subtask.status === TaskStatus.Completed ? TaskStatus.InProgress : TaskStatus.Completed;
      updateTask({ ...subtask, status: newStatus });
    };

    const formatTime = (minutes: number = 0) => {
        if (minutes < 0) minutes = 0;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}s ${m}d`;
    };

    const completedSubtasks = subtasks.filter(st => st.status === TaskStatus.Completed).length;
    const totalSubtasks = subtasks.length;
    const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    const timeProgress = (task.estimatedTime || 0) > 0 ? ((task.timeSpent || 0) / task.estimatedTime!) * 100 : 0;
    
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Görev Detayları" size="4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-text-main dark:text-dark-text-main">{task.title}</h2>
                            {canManageTasks && (
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => onEdit(task)}>Düzenle</Button>
                                    <Button variant="danger" onClick={handleDeleteRequest}>Sil</Button>
                                </div>
                            )}
                        </div>
                         
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-y py-3 dark:border-dark-border">
                            <div><p className="text-text-secondary">Sorumlu</p><p className="font-semibold">{task.assignedToName}</p></div>
                            <div><p className="text-text-secondary">Bitiş Tarihi</p><p className="font-semibold">{task.dueDate}</p></div>
                            <div><p className="text-text-secondary">Öncelik</p><p className="font-semibold">{task.priority}</p></div>
                            <div><p className="text-text-secondary">Durum</p><p className="font-semibold">{task.status}</p></div>
                             {task.relatedEntityName && task.relatedEntityType && task.relatedEntityId && (
                                <div>
                                    <p className="text-text-secondary">İlgili Kayıt</p>
                                    <Link to={`/${task.relatedEntityType === 'deal' ? 'deals' : `${task.relatedEntityType}s`}/${task.relatedEntityId}`} className="font-semibold text-primary-600 hover:underline">
                                        {task.relatedEntityName}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {task.description && (
                            <div>
                                <h4 className="font-semibold mb-2">Açıklama</h4>
                                <p className="text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{task.description}</p>
                            </div>
                        )}

                         <div>
                            <h4 className="font-semibold mb-2">Alt Görevler</h4>
                            {totalSubtasks > 0 && (
                                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mb-3">
                                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${subtaskProgress}%` }}></div>
                                </div>
                            )}
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {subtasks.map(st => (
                                    <div key={st.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={st.status === TaskStatus.Completed}
                                                onChange={() => handleSubtaskToggle(st)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                disabled={!canManageTasks}
                                            />
                                            <label className={`ml-3 text-sm ${st.status === TaskStatus.Completed ? 'line-through text-slate-500' : ''}`}>{st.title}</label>
                                        </div>
                                        {canManageTasks && (
                                            <button onClick={() => deleteTask(st.id)} className="text-slate-400 hover:text-red-500">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {canManageTasks && (
                                <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
                                    <input 
                                        type="text"
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        placeholder="Yeni alt görev ekle..."
                                        className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                    />
                                    <Button type="submit" disabled={!newSubtask.trim()}>Ekle</Button>
                                </form>
                            )}
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Dosya Ekleri</h4>
                             <input 
                                type="file" 
                                multiple 
                                ref={fileInputRef} 
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="space-y-2">
                                {task.attachments?.map(att => (
                                    <div key={att.id} className="group flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {getFileIcon(att.fileType as DocumentType)}
                                            <span className="truncate" title={att.fileName}>{att.fileName}</span>
                                        </div>
                                        <div className="flex items-center flex-shrink-0">
                                            <span className="text-sm text-text-secondary mr-4">{att.fileSize} KB</span>
                                            {canManageTasks && (
                                                <button onClick={() => deleteAttachmentFromTask(task.id, att.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {ICONS.trash}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {canManageTasks && (
                                <Button onClick={handleUploadClick} variant="secondary" className="mt-2 text-sm">
                                     <span className="flex items-center gap-2">{ICONS.add} Dosya Yükle</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h4 className="font-semibold mb-2">Zaman Kaydı</h4>
                            <div className="flex justify-between text-sm">
                                <span className="text-blue-600 font-medium">Harcanan: {formatTime(task.timeSpent)}</span>
                                <span className="text-text-secondary">Tahmini: {formatTime(task.estimatedTime)}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 my-2">
                                <div className={`h-2.5 rounded-full ${timeProgress > 100 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(timeProgress, 100)}%` }}></div>
                            </div>
                            {canManageTasks && (
                                <form onSubmit={handleLogTime} className="flex gap-2 mt-3">
                                    <input 
                                        type="number" 
                                        step="0.5" 
                                        placeholder="Süre (saat)"
                                        value={timeToLog}
                                        onChange={(e) => setTimeToLog(e.target.value)}
                                        className="w-32 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                    />
                                    <Button type="submit" disabled={!timeToLog}>Süre Ekle</Button>
                                </form>
                            )}
                        </div>

                         <div>
                            <h4 className="font-semibold mb-2">Bağlı Olduğu Görevler</h4>
                            {dependencies.length > 0 ? (
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                    {dependencies.map(dep => (
                                        <div key={dep.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
                                        <span className={dep.status === TaskStatus.Completed ? 'line-through' : ''}>{dep.title} ({dep.status})</span>
                                        {canManageTasks && <button onClick={() => removeTaskDependency(task.id, dep.id)} className="text-red-500 text-xs">Kaldır</button>}
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-text-secondary">Bu görevin bağlı olduğu başka görev yok.</p>}
                            {canManageTasks && (
                                <div className="flex gap-2 mt-3 pt-3 border-t dark:border-dark-border">
                                    <select 
                                        value={dependencyToAdd} 
                                        onChange={e => setDependencyToAdd(e.target.value)}
                                        className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                    >
                                        <option value="">Bağlılık ekle...</option>
                                        {possibleDependencies.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                    <Button onClick={handleAddDependency} disabled={!dependencyToAdd}>Ekle</Button>
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Yorumlar</h4>
                            <CommentsThread entityType="task" entityId={task.id} />
                        </div>
                    </div>
                </div>
            </Modal>
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Görevi Sil"
                message={`'${task.title}' adlı görevi ve tüm alt görevlerini kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </>
    );
};

export default TaskDetailModal;

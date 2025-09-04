import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { findAvailableSlots } from '../../services/geminiService';
// FIX: Import TaskStatus and TaskPriority enums to ensure type safety.
import { CalendarEvent, Task, TaskStatus, TaskPriority } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';

interface SmartScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SmartScheduleModal: React.FC<SmartScheduleModalProps> = ({ isOpen, onClose }) => {
    const { employees, tasks, addTask } = useApp();
    const { addToast } = useNotification();
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
    const [duration, setDuration] = useState(30);
    const [title, setTitle] = useState('');
    const [suggestedSlots, setSuggestedSlots] = useState<{ start: string, end: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFindTimes = async () => {
        if (selectedParticipantIds.length === 0 || !title.trim()) {
            addToast("Lütfen en az bir katılımcı ve bir toplantı başlığı girin.", "warning");
            return;
        }

        setIsLoading(true);
        setSuggestedSlots([]);

        try {
            const participantsEvents = selectedParticipantIds.map(id => {
                const emp = employees.find(e => e.id === id);
                const empTasks = tasks.filter(t => t.assignedToId === id && t.startDate && t.dueDate)
                                      .map(t => ({ start: new Date(t.startDate!).toISOString(), end: new Date(t.dueDate).toISOString() }));
                return { name: emp?.name || `User ${id}`, events: empTasks };
            });

            const slots = await findAvailableSlots(participantsEvents, duration);
            setSuggestedSlots(slots);
            if (slots.length === 0) {
                addToast("Uygun zaman bulunamadı. Kriterleri değiştirmeyi deneyin.", "info");
            }
        } catch (error) {
            console.error(error);
            addToast("Uygun zaman bulunurken bir hata oluştu.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectSlot = (slot: { start: string, end: string }) => {
        selectedParticipantIds.forEach(employeeId => {
            const taskData = {
                title: title,
                description: `Akıllı zamanlayıcı ile oluşturuldu. Katılımcılar: ${selectedParticipantIds.map(id => employees.find(e => e.id === id)?.name).join(', ')}`,
                // FIX: Use TaskStatus enum instead of a string literal for type safety.
                status: TaskStatus.Todo,
                // FIX: Use TaskPriority enum instead of a string literal for type safety.
                priority: TaskPriority.Normal,
                startDate: slot.start,
                dueDate: slot.end,
                assignedToId: employeeId,
            };
            addTask(taskData);
        });
        addToast(`${selectedParticipantIds.length} katılımcı için toplantı oluşturuldu.`, "success");
        onClose();
    };

    const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        setSelectedParticipantIds(selectedOptions);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Akıllı Zamanlama Asistanı" size="3xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Toplantı Başlığı *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Katılımcılar *</label>
                        <select
                            multiple
                            value={selectedParticipantIds.map(String)}
                            onChange={handleParticipantChange}
                            className="mt-1 w-full h-32 border rounded-md"
                        >
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Süre (dakika)</label>
                        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min="15" step="15" className="mt-1 w-full" />
                        <Button type="button" onClick={handleFindTimes} disabled={isLoading} className="w-full mt-4 justify-center">
                            {isLoading ? <div className="spinner !w-4 !h-4"></div> : 'Uygun Zamanları Bul'}
                        </Button>
                    </div>
                </div>

                {suggestedSlots.length > 0 && (
                    <div className="border-t pt-4 dark:border-dark-border">
                        <h4 className="font-semibold mb-2">Önerilen Zamanlar</h4>
                        <div className="flex flex-col gap-2">
                            {suggestedSlots.map((slot, index) => (
                                <Button key={index} variant="secondary" onClick={() => handleSelectSlot(slot)}>
                                    {new Date(slot.start).toLocaleString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SmartScheduleModal;
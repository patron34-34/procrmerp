import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceReview, Goal, PeerFeedback } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface PerformanceReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview | null;
}

const PerformanceReviewFormModal: React.FC<PerformanceReviewFormModalProps> = ({ isOpen, onClose, review }) => {
    const { employees, addPerformanceReview, updatePerformanceReview, currentUser } = useApp();
    
    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<PerformanceReview, 'id' | 'employeeName' | 'reviewerName'> = {
        employeeId: 0,
        reviewerId: currentUser.id,
        reviewDate: today,
        periodStartDate: '',
        periodEndDate: '',
        overallRating: 3,
        strengths: '',
        areasForImprovement: '',
        goalsForNextPeriod: '',
        status: 'Beklemede',
        goals: [],
        peerFeedback: []
    };
    const [formData, setFormData] = useState(initialFormState);
    const [peerToAdd, setPeerToAdd] = useState<number>(0);

    useEffect(() => {
        if (review) {
            setFormData({
                ...initialFormState,
                ...review,
                goals: review.goals || [],
                peerFeedback: review.peerFeedback || []
            });
        } else {
            setFormData(initialFormState);
        }
    }, [review, isOpen, currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') || name === 'overallRating' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.employeeId && formData.reviewerId) {
            if (review) {
                updatePerformanceReview({ ...review, ...formData });
            } else {
                addPerformanceReview(formData);
            }
            onClose();
        } else {
            alert("Lütfen çalışan ve değerlendirici seçin.");
        }
    };
    
    // Goal Functions
    const addGoal = () => setFormData(p => ({ ...p, goals: [...p.goals, { id: `g${Date.now()}`, description: '', target: '', status: 'Henüz Başlamadı' }] }));
    const removeGoal = (id: string) => setFormData(p => ({ ...p, goals: p.goals.filter(g => g.id !== id) }));
    const handleGoalChange = (id: string, field: keyof Goal, value: string) => {
        setFormData(p => ({ ...p, goals: p.goals.map(g => g.id === id ? { ...g, [field]: value } : g) }));
    };

    // Peer Feedback Functions
    const addPeer = () => {
        const peer = employees.find(e => e.id === peerToAdd);
        if (peer && !formData.peerFeedback.some(pf => pf.reviewerId === peer.id)) {
            setFormData(p => ({ ...p, peerFeedback: [...p.peerFeedback, { id: `p${Date.now()}`, reviewerId: peer.id, reviewerName: peer.name, strengths: '', areasForImprovement: '' }] }));
        }
    };
    const removePeer = (id: string) => setFormData(p => ({ ...p, peerFeedback: p.peerFeedback.filter(pf => pf.id !== id) }));
    const handlePeerChange = (id: string, field: keyof PeerFeedback, value: string) => {
        setFormData(p => ({ ...p, peerFeedback: p.peerFeedback.map(pf => pf.id === id ? { ...pf, [field]: value } : pf) }));
    };
    
    const availablePeers = employees.filter(e => e.id !== formData.employeeId && e.id !== formData.reviewerId && !formData.peerFeedback.some(pf => pf.reviewerId === e.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={review ? "Değerlendirmeyi Düzenle" : "Yeni Performans Değerlendirmesi"} size="4xl">
            <form onSubmit={handleSubmit}>
                 <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Çalışan *</label>
                            <select name="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 w-full"><option value="">Seçiniz...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Değerlendiren *</label>
                            <select name="reviewerId" value={formData.reviewerId} onChange={handleInputChange} required className="mt-1 w-full"><option value="">Seçiniz...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Değerlendirme Dönemi Başlangıcı</label>
                            <input type="date" name="periodStartDate" value={formData.periodStartDate} onChange={handleInputChange} className="mt-1 w-full"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Değerlendirme Dönemi Bitişi</label>
                            <input type="date" name="periodEndDate" value={formData.periodEndDate} onChange={handleInputChange} className="mt-1 w-full"/>
                        </div>
                    </div>
                    
                    <div className="border-t pt-4">
                        <h4 className="font-bold mb-2 text-lg">Yönetici Değerlendirmesi</h4>
                        <div>
                            <label className="block text-sm font-medium">Genel Puan (1-5)</label>
                            <input type="range" name="overallRating" min="1" max="5" value={formData.overallRating} onChange={handleInputChange} className="mt-1 w-full"/><div className="text-center font-bold">{formData.overallRating}</div>
                        </div>
                        <div><label className="block text-sm font-medium">Güçlü Yönler</label><textarea name="strengths" value={formData.strengths} onChange={handleInputChange} rows={3} className="mt-1 w-full" /></div>
                        <div><label className="block text-sm font-medium">Geliştirilecek Alanlar</label><textarea name="areasForImprovement" value={formData.areasForImprovement} onChange={handleInputChange} rows={3} className="mt-1 w-full" /></div>
                    </div>

                     <div className="border-t pt-4">
                        <h4 className="font-bold mb-2 text-lg">Hedefler</h4>
                        <div className="space-y-3">
                        {formData.goals.map((goal, index) => (
                             <div key={goal.id} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 grid grid-cols-[3fr_2fr_1.5fr_auto] gap-3 items-end">
                                <div><label className="text-xs font-semibold">Hedef Açıklaması</label><input type="text" value={goal.description} onChange={(e) => handleGoalChange(goal.id, 'description', e.target.value)} className="w-full text-sm" /></div>
                                <div><label className="text-xs font-semibold">Ölçülebilir Hedef</label><input type="text" value={goal.target} onChange={(e) => handleGoalChange(goal.id, 'target', e.target.value)} className="w-full text-sm" /></div>
                                <div><label className="text-xs font-semibold">Durum</label><select value={goal.status} onChange={(e) => handleGoalChange(goal.id, 'status', e.target.value)} className="w-full text-sm"><option>Henüz Başlamadı</option><option>Yolda</option><option>İlgi Gerekiyor</option><option>Tamamlandı</option></select></div>
                                <button type="button" onClick={() => removeGoal(goal.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md">{ICONS.trash}</button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="secondary" size="sm" onClick={addGoal} className="mt-3">Hedef Ekle</Button>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-bold mb-2 text-lg">Akran Değerlendirmeleri (360°)</h4>
                        <div className="space-y-3">
                        {formData.peerFeedback.map(pf => (
                             <div key={pf.id} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">{pf.reviewerName}</p>
                                    <button type="button" onClick={() => removePeer(pf.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-md">{ICONS.trash}</button>
                                </div>
                                <div><label className="block text-xs font-semibold">Güçlü Yönler</label><textarea value={pf.strengths} onChange={e => handlePeerChange(pf.id, 'strengths', e.target.value)} rows={2} className="w-full text-sm"/></div>
                                <div><label className="block text-xs font-semibold">Geliştirilecek Alanlar</label><textarea value={pf.areasForImprovement} onChange={e => handlePeerChange(pf.id, 'areasForImprovement', e.target.value)} rows={2} className="w-full text-sm"/></div>
                            </div>
                        ))}
                        </div>
                        <div className="mt-3 flex gap-2 items-end">
                            <div className="flex-grow">
                                <label className="text-sm font-medium">Değerlendirici Ekle</label>
                                <select value={peerToAdd} onChange={e => setPeerToAdd(Number(e.target.value))} className="w-full">
                                    <option value={0}>Akran seç...</option>
                                    {availablePeers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <Button type="button" variant="secondary" size="sm" onClick={addPeer}>Ekle</Button>
                        </div>
                    </div>
                 </div>
                <div className="flex justify-end pt-4 gap-2 border-t mt-4 dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default PerformanceReviewFormModal;

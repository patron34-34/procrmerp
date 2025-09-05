import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { JournalEntry, JournalEntryItem, JournalEntryType, JournalEntryStatus } from '../../../types';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { useNotification } from '../../../context/NotificationContext';
import { generateJournalEntryFromPrompt } from '../../../services/geminiService';
import JournalEntryRow from '../../accounting/JournalEntryRow';

const JournalEntryForm: React.FC = () => {
    const { accounts, addJournalEntry, updateJournalEntry, journalEntries, accountingLockDate } = useApp();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { addToast } = useNotification();

    const [memo, setMemo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [documentNumber, setDocumentNumber] = useState('');
    const [type, setType] = useState<JournalEntryType>(JournalEntryType.Mahsup);
    const [items, setItems] = useState<Partial<JournalEntryItem>[]>([
        { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
        { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
    ]);
    
    // AI Assistant State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const isEditMode = !!id;
    const entryNumber = useMemo(() => {
        if (isEditMode) {
            return journalEntries.find(e => e.id === parseInt(id!))?.entryNumber;
        }
        return 'Yeni Fiş';
    }, [id, journalEntries, isEditMode]);


    useEffect(() => {
        const entryToLoad = isEditMode
            ? journalEntries.find(e => e.id === parseInt(id!))
            : location.state?.copyFrom;

        const today = new Date().toISOString().split('T')[0];

        if (entryToLoad) {
            setDate(isEditMode ? entryToLoad.date : today);
            setMemo(isEditMode ? entryToLoad.memo : `Kopya: ${entryToLoad.memo}`);
            setDocumentNumber(entryToLoad.documentNumber || '');
            setType(entryToLoad.type || JournalEntryType.Mahsup);
            // Add an empty row at the end for continuous entry
            setItems([...entryToLoad.items.map((item: JournalEntryItem) => ({...item})), { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' }]);
        } else {
            // Reset for new entry
            setDate(today);
            setMemo('');
            setDocumentNumber('');
            setType(JournalEntryType.Mahsup);
            setItems([
                { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
                { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
            ]);
        }
    }, [id, journalEntries, location.state]);

    const { totalDebit, totalCredit, difference, isBalanced } = useMemo(() => {
        const totalDebit = items.reduce((sum, item) => sum + (item.debit || 0), 0);
        const totalCredit = items.reduce((sum, item) => sum + (item.credit || 0), 0);
        const difference = totalDebit - totalCredit;
        return { totalDebit, totalCredit, difference, isBalanced: Math.abs(difference) < 0.01 && totalDebit > 0 };
    }, [items]);
    
    const addItem = () => {
        setItems(prev => [...prev, { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' }]);
    };
    
    const handleDeleteItem = (index: number) => {
        if (items.length <= 2) {
            addToast("Fişte en az iki satır bulunmalıdır.", "warning");
            return;
        }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        addToast("Satır silindi.", "info");
    };
    
    const handleItemChange = (index: number, updatedItem: Partial<JournalEntryItem>) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        
        // Auto-add new row if last row is being edited
        if (index === items.length - 1 && updatedItem.accountId) {
             addItem();
        }
        
        setItems(newItems);
    };


    const handleSubmit = (andCreateNew: boolean) => {
        if (accountingLockDate && date <= accountingLockDate) {
            addToast(`İşlem yapılamadı. Muhasebe dönemi ${accountingLockDate} tarihinde kilitlenmiştir.`, "error");
            return;
        }

        const finalItems = items.filter(item => 
            item.accountId && ((item.debit != null && item.debit > 0) || (item.credit != null && item.credit > 0))
        );

        if (finalItems.length < 2) {
            addToast("Bir yevmiye kaydı en az iki dolu satır içermelidir.", "error");
            return;
        }

        const finalTotalDebit = finalItems.reduce((sum, item) => sum + (item.debit || 0), 0);
        const finalTotalCredit = finalItems.reduce((sum, item) => sum + (item.credit || 0), 0);
        
        if (Math.abs(finalTotalDebit - finalTotalCredit) >= 0.01 || finalTotalDebit === 0) {
            addToast("Yevmiye kaydı dengede olmalı ve toplam tutar sıfırdan büyük olmalıdır.", "error");
            return;
        }
        
        if (!memo.trim()) {
            addToast("Lütfen bir fiş açıklaması girin.", "error");
            return;
        }

        const entryData: Omit<JournalEntry, 'id' | 'entryNumber'> = { 
            date, 
            memo, 
            type, 
            documentNumber, 
            items: finalItems as JournalEntryItem[],
            status: JournalEntryStatus.Posted
        };
        if (isEditMode) {
            updateJournalEntry({ id: parseInt(id!), entryNumber: journalEntries.find(e=>e.id === parseInt(id!))!.entryNumber, ...entryData });
        } else {
            addJournalEntry(entryData);
        }
        
        if (andCreateNew) {
            setDate(new Date().toISOString().split('T')[0]);
            setMemo('');
            setDocumentNumber('');
            setType(JournalEntryType.Mahsup);
            setItems([
                { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
                { accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' },
            ]);
            addToast('Kayıt başarılı. Yeni fiş hazır.', 'success');
            navigate('/accounting/journal-entries/new', { replace: true });
        } else {
            addToast('Kayıt başarıyla tamamlandı.', 'success');
            navigate('/accounting/journal-entries');
        }
    };

    const handleAutoBalance = () => {
        if (difference !== 0) {
            const newItems = [...items];
            const lastEmptyIndex = newItems.findIndex(item => (item.debit === 0 || item.debit === undefined) && (item.credit === 0 || item.credit === undefined));
            
            const targetIndex = lastEmptyIndex !== -1 ? lastEmptyIndex : newItems.length - 1;
            const targetItem = { ...newItems[targetIndex] };

            if(difference > 0) {
                targetItem.credit = (targetItem.credit || 0) + difference;
                targetItem.debit = 0;
            } else {
                targetItem.debit = (targetItem.debit || 0) - difference;
                targetItem.credit = 0;
            }
            newItems[targetIndex] = targetItem;
            setItems(newItems);
        }
    };

    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const generatedItems = await generateJournalEntryFromPrompt(aiPrompt, accounts);
            
            const totalDebit = generatedItems.reduce((sum, item) => sum + (item.debit || 0), 0);
            const totalCredit = generatedItems.reduce((sum, item) => sum + (item.credit || 0), 0);
    
            if (Math.abs(totalDebit - totalCredit) > 0.01) {
                addToast('AI dengesiz bir kayıt oluşturdu. Lütfen girdinizi yeniden ifade etmeyi veya manuel olarak düzenlemeyi deneyin.', 'warning');
            }
    
            // Add an empty row for continued entry
            generatedItems.push({ accountId: undefined, description: '', debit: 0, credit: 0, documentDate: '', documentNumber: '' });
    
            setItems(generatedItems);
            // Automatically set the memo from the prompt if it's empty
            if (!memo) {
                setMemo(aiPrompt); 
            }
            setIsAiModalOpen(false);
            setAiPrompt('');
            addToast("Yevmiye kaydı taslağı AI tarafından oluşturuldu. Lütfen kontrol edip kaydedin.", 'success');
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEditMode ? `Fişi Düzenle: ${entryNumber}` : "Yeni Yevmiye Kaydı"}</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsAiModalOpen(true)}>
                        <span className="flex items-center gap-2">{ICONS.magic} AI Asistanı</span>
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>İptal</Button>
                    <Button onClick={() => handleSubmit(true)} disabled={!isBalanced}><span className="flex items-center gap-2">{ICONS.saveAndNew} Kaydet ve Yeni</span></Button>
                    <Button onClick={() => handleSubmit(false)} disabled={!isBalanced}>Kaydet</Button>
                </div>
            </div>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border-b dark:border-dark-border">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium">Fiş Tarihi *</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Yevmiye No</label>
                        <input type="text" value={entryNumber || 'Yeni Fiş'} disabled className="mt-1 w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fiş Türü *</label>
                         <select id="type" value={type} onChange={e => setType(e.target.value as JournalEntryType)} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border">
                            {Object.values(JournalEntryType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="documentNumber" className="block text-sm font-medium">Belge No</label>
                        <input type="text" id="documentNumber" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} placeholder="örn: FAT-123" className="mt-1 w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"/>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label htmlFor="memo" className="block text-sm font-medium">Fiş Açıklaması *</label>
                        <input type="text" id="memo" value={memo} onChange={e => setMemo(e.target.value)} required placeholder="örn: Aylık ofis kirası" className="mt-1 w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"/>
                    </div>
                </div>
                
                 {/* Journal Entry Grid */}
                <div className="p-2">
                    <div className="grid grid-cols-[2.5fr_3fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-2 bg-slate-50 dark:bg-slate-900/50 font-semibold text-sm">
                        <div>Hesap</div>
                        <div>Açıklama</div>
                        <div>Belge Tarihi</div>
                        <div>Belge No</div>
                        <div className="text-right">Borç</div>
                        <div className="text-right">Alacak</div>
                        <div></div>
                    </div>
                    <div className="space-y-1">
                        {items.map((item, index) => (
                            <JournalEntryRow
                                key={index}
                                item={item}
                                index={index}
                                onChange={handleItemChange}
                                onDelete={handleDeleteItem}
                                accounts={accounts}
                                isLastRow={index === items.length - 1}
                                globalMemo={memo}
                                globalDate={date}
                                globalDocNumber={documentNumber}
                            />
                        ))}
                    </div>
                </div>
                 <div className="flex justify-end p-4 border-t dark:border-dark-border">
                     <div className="w-[400px] space-y-2">
                        <div className="flex justify-between font-medium">
                            <span>Toplam Borç:</span>
                            <span>${totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Toplam Alacak:</span>
                            <span>${totalCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                         <div className={`flex justify-between items-center font-bold text-lg pt-2 border-t dark:border-slate-600 ${!isBalanced && difference !== 0 ? 'text-red-500' : 'text-green-600'}`}>
                            <div className="flex items-center gap-2">
                               <span>Fark:</span>
                               {difference !== 0 && <Button variant="secondary" onClick={handleAutoBalance} className="!px-2 !py-1 text-xs">Dengele</Button>}
                            </div>
                            <span>${difference.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                    </div>
                 </div>
            </Card>
        </div>
        <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="AI Asistanı ile Yevmiye Kaydı Oluştur">
            <div className="space-y-4">
                <p className="text-text-secondary dark:text-dark-text-secondary">
                    Finansal işlemi doğal bir dille açıklayın. AI, sizin için yevmiye kaydını oluşturacaktır.
                    <br />
                    Örnek: "Aylık 5000 TL ofis kirası bankadan ödendi." veya "Tekno A.Ş.'den 12500 TL'lik fatura tahsilatı bankaya geldi."
                </p>
                <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    placeholder="İşlemi açıklayın..."
                    disabled={isGenerating}
                />
                <div className="flex justify-end">
                    <Button onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()}>
                        {isGenerating ? <div className="spinner !w-5 !h-5" /> : 'Kaydı Oluştur'}
                    </Button>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default JournalEntryForm;
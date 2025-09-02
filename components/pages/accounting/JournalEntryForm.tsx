import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { JournalEntry, JournalEntryItem, JournalEntryType, JournalEntryStatus } from '../../../types';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AccountSelector from '../../accounting/AccountSelector';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { useNotification } from '../../../context/NotificationContext';
import { generateJournalEntryFromPrompt } from '../../../services/geminiService';

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
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

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

    const handleItemChange = (index: number, field: keyof JournalEntryItem, value: any) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index] };
        
        if (field === 'debit' || field === 'credit') {
            currentItem[field] = parseFloat(value) || 0;
            if (field === 'debit' && currentItem.debit > 0) currentItem.credit = 0;
            if (field === 'credit' && currentItem.credit > 0) currentItem.debit = 0;
        } else {
            (currentItem as any)[field] = value;
        }
        
        newItems[index] = currentItem;
        setItems(newItems);
    };

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
    
    const handleFocus = (index: number) => {
        setActiveRowIndex(index);
        
        const newItems = [...items];
        const currentItem = { ...newItems[index] };
        let itemChanged = false;
        
        if (!currentItem.description && memo) {
            currentItem.description = memo;
            itemChanged = true;
        }
        if (!currentItem.documentDate && date) {
            currentItem.documentDate = date;
            itemChanged = true;
        }
        if (!currentItem.documentNumber && documentNumber) {
            currentItem.documentNumber = documentNumber;
            itemChanged = true;
        }
        
        if(itemChanged) {
            newItems[index] = currentItem;
            setItems(newItems);
        }

        if (index === items.length - 1) {
            addItem();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent, index: number, field: string) => {
        if (e.key === 'Enter' && field === 'credit') {
            e.preventDefault();
            const nextRowInput = gridRef.current?.querySelector<HTMLInputElement>(`[data-row-index="${index + 1}"] [data-cell-index="0"] input`);
            if (nextRowInput) {
                nextRowInput.focus();
            }
        }
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

                <div ref={gridRef}>
                    <div className="grid grid-cols-[2.5fr_3fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-2 bg-slate-50 dark:bg-slate-900/50 font-semibold text-sm">
                        <div>Hesap</div>
                        <div>Açıklama</div>
                        <div>Belge Tarihi</div>
                        <div>Belge No</div>
                        <div className="text-right">Borç</div>
                        <div className="text-right">Alacak</div>
                        <div></div>
                    </div>
                    <div className="space-y-1 p-2">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            data-row-index={index}
                            className={`group grid grid-cols-[2.5fr_3fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 items-center p-1 rounded-md ${activeRowIndex === index ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
                            onKeyDown={(e) => {
                                if ((e.ctrlKey || e.metaKey) && (e.key === 'Delete' || e.key === 'Backspace')) {
                                    e.preventDefault();
                                    handleDeleteItem(index);
                                }
                            }}
                        >
                            <div data-cell-index="0" onFocus={() => handleFocus(index)}>
                               <AccountSelector accounts={accounts} value={item.accountId || 0} onChange={accId => handleItemChange(index, 'accountId', accId)} />
                            </div>
                            <input
                                type="text"
                                placeholder="Satır açıklaması"
                                value={item.description || ''}
                                onChange={e => handleItemChange(index, 'description', e.target.value)}
                                onFocus={() => handleFocus(index)}
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
                            />
                             <input
                                type="date"
                                value={item.documentDate || ''}
                                onChange={e => handleItemChange(index, 'documentDate', e.target.value)}
                                onFocus={() => handleFocus(index)}
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
                            />
                            <input
                                type="text"
                                placeholder="Satır belge no"
                                value={item.documentNumber || ''}
                                onChange={e => handleItemChange(index, 'documentNumber', e.target.value)}
                                onFocus={() => handleFocus(index)}
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={item.debit || ''}
                                onChange={e => handleItemChange(index, 'debit', e.target.value)}
                                onFocus={() => handleFocus(index)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'debit')}
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border text-right"
                            />
                             <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={item.credit || ''}
                                onChange={e => handleItemChange(index, 'credit', e.target.value)}
                                onFocus={() => handleFocus(index)}
                                onKeyDown={(e) => handleKeyDown(e, index, 'credit')}
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border text-right"
                            />
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteItem(index)}
                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                                    aria-label="Satırı sil"
                                    tabIndex={-1}
                                    disabled={items.length <= 2}
                                >
                                    {ICONS.trash}
                                </button>
                            </div>
                        </div>
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
                        {isGenerating ? 'Oluşturuluyor...' : 'Kaydı Oluştur'}
                    </Button>
                </div>
            </div>
        </Modal>
        </>
    );
};

export default JournalEntryForm;
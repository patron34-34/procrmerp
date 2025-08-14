import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { JournalEntry, JournalEntryStatus } from '../../../types';
import ConfirmationModal from '../../ui/ConfirmationModal';

const JournalEntries: React.FC = () => {
    const { journalEntries, hasPermission, deleteJournalEntry } = useApp();
    const navigate = useNavigate();
    const canManage = hasPermission('muhasebe:yonet');
    const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
    
    const getStatusBadge = (status: JournalEntryStatus) => {
        const styles: { [key in JournalEntryStatus]: string } = {
            [JournalEntryStatus.Draft]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [JournalEntryStatus.Posted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    const handleDeleteConfirm = () => {
        if (entryToDelete) {
            deleteJournalEntry(entryToDelete.id);
            setEntryToDelete(null);
        }
    };


    return (
        <>
            <Card
                title="Yevmiye Kayıtları"
                action={
                    canManage && (
                        <Link to="/accounting/journal-entries/new">
                            <Button>
                                <span className="flex items-center gap-2">{ICONS.add} Yeni Kayıt</span>
                            </Button>
                        </Link>
                    )
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Fiş No</th>
                            <th className="p-3 font-semibold">Tarih</th>
                            <th className="p-3 font-semibold">Fiş Türü</th>
                            <th className="p-3 font-semibold">Açıklama</th>
                            <th className="p-3 font-semibold">Durum</th>
                            <th className="p-3 font-semibold text-right">Tutar</th>
                            {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {journalEntries.map(entry => {
                                const totalDebit = entry.items.reduce((sum, item) => sum + item.debit, 0);
                                return (
                                <tr key={entry.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-mono">
                                        <Link to={`/accounting/journal-entries/${entry.id}`} className="text-primary-600 hover:underline">
                                            {entry.entryNumber}
                                        </Link>
                                    </td>
                                    <td className="p-3">{entry.date}</td>
                                    <td className="p-3">{entry.type}</td>
                                    <td className="p-3 font-medium">{entry.memo}</td>
                                    <td className="p-3">{getStatusBadge(entry.status)}</td>
                                    <td className="p-3 text-right font-mono">${totalDebit.toLocaleString()}</td>
                                    {canManage && <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => navigate(`/accounting/journal-entries/${entry.id}/edit`)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                            <button onClick={() => setEntryToDelete(entry)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                        </div>
                                    </td>}
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && <ConfirmationModal 
                isOpen={!!entryToDelete}
                onClose={() => setEntryToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Yevmiye Fişini Sil"
                message={`'${entryToDelete?.entryNumber}' numaralı yevmiye fişini kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default JournalEntries;
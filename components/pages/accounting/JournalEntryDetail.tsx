
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { JournalEntry, JournalEntryStatus } from '../../../types';
import ConfirmationModal from '../../ui/ConfirmationModal';

const JournalEntryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { journalEntries, accounts, hasPermission, reverseJournalEntry, deleteJournalEntry } = useApp();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const canManage = hasPermission('muhasebe:yonet');
    const entryId = parseInt(id || '', 10);
    const entry = journalEntries.find(e => e.id === entryId);

    if (!entry) {
        return <Card title="Hata"><p>Yevmiye kaydı bulunamadı. <Link to="/accounting/journal-entries">Kayıt listesine</Link> geri dönün.</p></Card>;
    }
    
    const handleReverse = () => {
        if (!canManage) return;
        const newEntryId = reverseJournalEntry(entry.id);
        if (newEntryId) {
            navigate(`/accounting/journal-entries/${newEntryId}`);
        } else {
             navigate('/accounting/journal-entries');
        }
    };

    const handleDeleteConfirm = () => {
        if (canManage) {
            deleteJournalEntry(entry.id);
            setIsDeleteModalOpen(false);
            navigate('/accounting/journal-entries');
        }
    };

    const getAccountName = (accountId: number) => {
        const account = accounts.find(a => a.id === accountId);
        return account ? `${account.accountNumber} - ${account.name}` : 'Bilinmeyen Hesap';
    };
    
    const getStatusBadge = (status: JournalEntryStatus) => {
        const styles: { [key in JournalEntryStatus]: string } = {
            [JournalEntryStatus.Draft]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [JournalEntryStatus.Posted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    const totalDebit = entry.items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = entry.items.reduce((sum, item) => sum + item.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
    const isPosted = entry.status === JournalEntryStatus.Posted;

    return (
        <>
            <div className="mb-4">
                <Link to="/accounting/journal-entries" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main">
                    &larr; Yevmiye Kayıtlarına Dön
                </Link>
            </div>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{entry.entryNumber}</h2>
                        <p className="text-text-secondary">{entry.date} - {entry.memo}</p>
                        <div className="flex gap-4 mt-2 items-center">
                            <span className="text-sm font-semibold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{entry.type}</span>
                            {getStatusBadge(entry.status)}
                            {entry.documentNumber && <span className="text-sm text-text-secondary">Belge No: {entry.documentNumber}</span>}
                        </div>
                    </div>
                    {canManage && (
                        <div className="flex gap-2">
                             <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                                <span className="flex items-center gap-2">{ICONS.trash} Sil</span>
                            </Button>
                            <Button variant="secondary" onClick={() => navigate(`/accounting/journal-entries/${entry.id}/edit`)}>
                               <span className="flex items-center gap-2">{ICONS.edit} Düzenle</span>
                            </Button>
                            <Link to="/accounting/journal-entries/new" state={{ copyFrom: entry }}>
                                <Button variant="secondary"><span className="flex items-center gap-2">{ICONS.copy} Kopyala</span></Button>
                            </Link>
                            <Button variant="secondary" onClick={handleReverse} disabled={!isPosted} title={!isPosted ? "Sadece kaydedilmiş fişler için ters kayıt oluşturulabilir." : ""}>
                               <span className="flex items-center gap-2">{ICONS.reverse} Ters Kayıt</span>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Hesap</th>
                            <th className="p-3 font-semibold">Açıklama</th>
                            <th className="p-3 font-semibold">Belge Tarihi</th>
                            <th className="p-3 font-semibold">Belge No</th>
                            <th className="p-3 font-semibold text-right">Borç</th>
                            <th className="p-3 font-semibold text-right">Alacak</th>
                        </tr></thead>
                        <tbody>
                            {entry.items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-dark-border">
                                    <td className="p-3">{getAccountName(item.accountId)}</td>
                                    <td className="p-3 text-text-secondary">{item.description}</td>
                                    <td className="p-3 text-text-secondary">{item.documentDate || '-'}</td>
                                    <td className="p-3 text-text-secondary">{item.documentNumber || '-'}</td>
                                    <td className="p-3 text-right font-mono">{item.debit > 0 ? `$${item.debit.toLocaleString()}` : '-'}</td>
                                    <td className="p-3 text-right font-mono">{item.credit > 0 ? `$${item.credit.toLocaleString()}` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="font-bold bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <td className="p-3" colSpan={4}>Toplam</td>
                                <td className={`p-3 text-right font-mono ${!isBalanced ? 'text-red-500' : ''}`}>
                                    ${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className={`p-3 text-right font-mono ${!isBalanced ? 'text-red-500' : ''}`}>
                                    ${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Yevmiye Fişini Sil"
                message={`'${entry.entryNumber}' numaralı yevmiye fişini kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </>
    );
};

export default JournalEntryDetail;

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const AccountingSettings: React.FC = () => {
    const { accountingLockDate, updateAccountingLockDate, hasPermission } = useApp();
    const [lockDate, setLockDate] = useState(accountingLockDate || '');
    
    const canManage = hasPermission('ayarlar:muhasebe-yonet');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateAccountingLockDate(lockDate || null);
    };
    
    const handleClear = () => {
        setLockDate('');
        updateAccountingLockDate(null);
    }

    return (
        <Card title="Muhasebe Ayarları">
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg">Dönem Kilitleme</h4>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary my-2">
                        Belirtilen tarihten önceki (ve o tarih dahil) muhasebe kayıtlarının değiştirilmesini veya silinmesini engelleyin. Bu, mali tablolar kesinleştikten sonra veri bütünlüğünü korumaya yardımcı olur.
                    </p>
                    <div className="flex items-end gap-4">
                        <div>
                            <label htmlFor="lockDate" className="block text-sm font-medium">Kilit Tarihi</label>
                            <input
                                type="date"
                                id="lockDate"
                                value={lockDate}
                                onChange={(e) => setLockDate(e.target.value)}
                                disabled={!canManage}
                                className="mt-1 block w-full max-w-xs p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"
                            />
                        </div>
                        {canManage && (
                           <Button type="button" variant="secondary" onClick={handleClear}>Tarihi Temizle</Button>
                        )}
                    </div>
                </div>
                 {canManage && (
                    <div className="flex justify-end pt-4 border-t dark:border-dark-border">
                        <Button type="submit">Ayarları Kaydet</Button>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default AccountingSettings;
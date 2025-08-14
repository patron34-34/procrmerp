import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { AutomationLog } from '../../types';

interface AutomationLogViewProps {
    automationId: number;
}

const AutomationLogView: React.FC<AutomationLogViewProps> = ({ automationId }) => {
    const { automationLogs } = useApp();
    const [viewingLog, setViewingLog] = useState<AutomationLog | null>(null);

    const logs = useMemo(() => {
        return automationLogs
            .filter(log => log.automationId === automationId)
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [automationLogs, automationId]);

    const renderJson = (jsonString: string) => {
        try {
            const obj = JSON.parse(jsonString);
            return <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-md max-h-60 overflow-auto"><code>{JSON.stringify(obj, null, 2)}</code></pre>;
        } catch(e) {
            return <p className="text-xs text-red-500">Geçersiz JSON</p>;
        }
    };

    return (
        <>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
                <thead className="border-b dark:border-dark-border sticky top-0 bg-card dark:bg-dark-card"><tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-3 font-semibold">Tarih</th>
                    <th className="p-3 font-semibold">Durum</th>
                    <th className="p-3 font-semibold">Detay</th>
                </tr></thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} className="border-b dark:border-dark-border">
                            <td className="p-3 text-sm">{new Date(log.timestamp).toLocaleString('tr-TR')}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${log.status === 'başarılı' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{log.status}</span>
                            </td>
                            <td className="p-3">
                                <button onClick={() => setViewingLog(log)} className="text-primary-600 hover:underline text-sm">Verileri Görüntüle</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {logs.length === 0 && <p className="p-4 text-center text-text-secondary">Bu otomasyon henüz çalışmadı.</p>}
        </div>
        {viewingLog && (
            <Modal isOpen={!!viewingLog} onClose={() => setViewingLog(null)} title="Log Detayları">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Gönderilen Veri (Request Payload)</h4>
                        {renderJson(viewingLog.requestPayload)}
                    </div>
                    {viewingLog.responseBody && <div>
                        <h4 className="font-semibold">Alınan Yanıt (Response Body)</h4>
                        {renderJson(viewingLog.responseBody)}
                    </div>}
                     {viewingLog.error && <div>
                        <h4 className="font-semibold text-red-500">Hata Mesajı</h4>
                        <p className="text-sm text-red-400">{viewingLog.error}</p>
                    </div>}
                </div>
            </Modal>
        )}
        </>
    );
};

export default AutomationLogView;
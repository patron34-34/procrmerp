import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { PayrollRun } from '../../../types';
import BulkTimesheetGrid from '../../hr/payroll/BulkTimesheetGrid';
import PayrollTotals from '../../hr/payroll/PayrollTotals';
import { ICONS } from '../../../constants';

const PayrollAndTimesheet: React.FC = () => {
    const { runId } = useParams<{ runId: string }>();
    const navigate = useNavigate();
    const { payrollRuns, payslips, updatePayrollRunStatus, postPayrollRunToJournal, exportPayrollRunToAphbXml, hasPermission, journalEntries } = useApp();

    const canManage = hasPermission('ik:bordro-yonet');
    const runIdNum = parseInt(runId || '', 10);

    const payrollRun = useMemo(() => payrollRuns.find(pr => pr.id === runIdNum), [payrollRuns, runIdNum]);
    const runPayslips = useMemo(() => payslips.filter(p => p.payrollRunId === runIdNum), [payslips, runIdNum]);
    const journalEntry = useMemo(() => payrollRun?.journalEntryId ? journalEntries.find(je => je.id === payrollRun.journalEntryId) : null, [journalEntries, payrollRun]);


    if (!payrollRun) {
        return <Card title="Hata"><p>Bordro çalışması bulunamadı. <Link to="/hr/payroll">Bordro listesine</Link> geri dönün.</p></Card>;
    }
    
    const getStatusBadge = (status: PayrollRun['status']) => {
        const styles: { [key in PayrollRun['status']]: string } = {
            'Taslak': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'Onaylandı': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Muhasebeleşti': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-sm font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Puantaj & Bordro: {payrollRun.payPeriod}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            {getStatusBadge(payrollRun.status)}
                            {journalEntry && (
                                <Link to={`/accounting/journal-entries/${journalEntry.id}`} className="text-sm text-primary-600 hover:underline">
                                    Yevmiye Fişi: {journalEntry.entryNumber}
                                </Link>
                            )}
                        </div>
                    </div>
                     {canManage && (
                        <div className="flex gap-2">
                           {payrollRun.status === 'Taslak' && (
                               <Button onClick={() => updatePayrollRunStatus(payrollRun.id, 'Onaylandı')}>
                                   Bordroyu Onayla
                               </Button>
                           )}
                           {payrollRun.status === 'Onaylandı' && (
                               <Button onClick={() => postPayrollRunToJournal(payrollRun.id)}>
                                   Muhasebeye Aktar
                               </Button>
                           )}
                           {payrollRun.status === 'Muhasebeleşti' && (
                                <Button onClick={() => exportPayrollRunToAphbXml(payrollRun.id)} variant="secondary">
                                    <span className="flex items-center gap-2">{ICONS.fileXml} APHB XML İndir</span>
                                </Button>
                           )}
                        </div>
                    )}
                </div>
            </Card>

            <PayrollTotals payrollRun={payrollRun} />

            <BulkTimesheetGrid payslips={runPayslips} payrollRunStatus={payrollRun.status} />
        </div>
    );
};

export default PayrollAndTimesheet;

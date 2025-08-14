
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Budget, AccountType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import BudgetFormModal from '../../accounting/BudgetFormModal';
import EmptyState from '../../ui/EmptyState';

const Budgets: React.FC = () => {
    const { budgets, accounts, journalEntries, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const canManage = hasPermission('muhasebe:butce-yonet');

    const openModalForNew = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const calculateBudgetActuals = (budget: Budget) => {
        const actuals: { [key: number]: number } = {};
        
        const budgetStartDate = new Date(budget.startDate);
        const budgetEndDate = new Date(budget.endDate);
        budgetEndDate.setHours(23, 59, 59, 999);

        const relevantJournalEntries = journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= budgetStartDate && entryDate <= budgetEndDate;
        });
        
        for (const item of budget.items) {
            actuals[item.accountId] = 0;
        }

        for (const entry of relevantJournalEntries) {
            for (const entryItem of entry.items) {
                if (actuals.hasOwnProperty(entryItem.accountId)) {
                     const account = accounts.find(a => a.id === entryItem.accountId);
                     if (!account) continue;
                     
                     if (account.type === AccountType.Revenue) {
                        actuals[entryItem.accountId] += entryItem.credit - entryItem.debit;
                    } else if (account.type === AccountType.Expense) {
                        actuals[entryItem.accountId] += entryItem.debit - entryItem.credit;
                    }
                }
            }
        }
        return actuals;
    };

    return (
        <>
            <Card
                title="Bütçeler"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Bütçe</span></Button>}
            >
                {budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map(budget => {
                            const actualsByAccount = calculateBudgetActuals(budget);
                            const totalBudgeted = budget.items.reduce((sum, item) => sum + item.amount, 0);
                            const totalActual = Object.values(actualsByAccount).reduce((sum, val) => sum + val, 0);
                            const progress = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;
                            
                            return (
                                <Card key={budget.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link to={`/accounting/budgets/${budget.id}`} className="font-bold text-lg hover:text-primary-600 dark:hover:text-primary-400">{budget.name}</Link>
                                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{budget.startDate} - {budget.endDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">${totalActual.toLocaleString()} / ${totalBudgeted.toLocaleString()}</p>
                                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Gerçekleşen / Bütçe</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                            <div className={`h-2.5 rounded-full ${progress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={ICONS.budget}
                        title="Henüz Bütçe Oluşturulmadı"
                        description="Mali hedeflerinizi belirlemek ve takip etmek için ilk bütçenizi oluşturun."
                        action={canManage ? <Button onClick={openModalForNew}>Bütçe Oluştur</Button> : undefined}
                    />
                )}
            </Card>
            {canManage && (
                <BudgetFormModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    budget={editingBudget}
                />
            )}
        </>
    );
};

export default Budgets;

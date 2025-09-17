import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { SalesAnalyticsData, DealStage } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { generateSalesSummary } from '../../../services/geminiService';

const SalesAnalyticsPage: React.FC = () => {
    const { deals, employees } = useApp();
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const analyticsData: SalesAnalyticsData = useMemo(() => {
        const openDeals = deals.filter(d => d.stage !== DealStage.Won && d.stage !== DealStage.Lost);
        const closedDeals = deals.filter(d => d.stage === DealStage.Won || d.stage === DealStage.Lost);
        const wonDeals = deals.filter(d => d.stage === DealStage.Won);
    
        const totalPipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
        const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0;
        
        const weightedPipelineValue = openDeals.reduce((sum, deal) => {
            const probability = { [DealStage.Lead]: 0.1, [DealStage.Contacted]: 0.3, [DealStage.Proposal]: 0.6, [DealStage.Won]: 1, [DealStage.Lost]: 0 }[deal.stage] || 0;
            return sum + (deal.value * probability);
        }, 0);

        const salesByEmployee = wonDeals.reduce((acc, deal) => {
            acc[deal.assignedToId] = (acc[deal.assignedToId] || 0) + deal.value;
            return acc;
        }, {} as Record<number, number>);

        const topPerformers = Object.entries(salesByEmployee)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([employeeId, value]) => ({
                name: employees.find(e => e.id === parseInt(employeeId))?.name || 'Bilinmeyen',
                value,
            }));

        const avgSalesCycle = closedDeals.length > 0 
            ? closedDeals.reduce((sum, deal) => {
                const created = new Date(deal.createdDate).getTime();
                const closed = new Date(deal.closeDate).getTime();
                const cycleDays = (closed - created) / (1000 * 3600 * 24);
                return sum + cycleDays;
            }, 0) / closedDeals.length
            : 0;

        return { weightedPipelineValue, totalPipelineValue, winRate, avgSalesCycle: Math.round(avgSalesCycle), topPerformers };
    }, [deals, employees]);

    const handleGenerateSummary = async () => {
        setLoading(true);
        try {
            const result = await generateSalesSummary(analyticsData);
            setSummary(result);
        } catch (e) {
            setSummary('Özet oluşturulurken bir hata oluştu.');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card><h4 className="text-text-secondary">Toplam Pipeline Değeri</h4><p className="text-3xl font-bold">${analyticsData.totalPipelineValue.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary">Ağırlıklı Pipeline Değeri</h4><p className="text-3xl font-bold">${analyticsData.weightedPipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></Card>
                <Card><h4 className="text-text-secondary">Kazanma Oranı</h4><p className="text-3xl font-bold text-green-600">{analyticsData.winRate.toFixed(1)}%</p></Card>
                <Card><h4 className="text-text-secondary">Ort. Satış Döngüsü</h4><p className="text-3xl font-bold">{analyticsData.avgSalesCycle} gün</p></Card>
            </div>
            <Card title="AI Performans Özeti">
                <div className="flex flex-col items-start gap-4">
                    <Button onClick={handleGenerateSummary} disabled={loading}>
                        <span className="flex items-center gap-2">{ICONS.magic} {loading ? 'Oluşturuluyor...' : 'Performans Özeti Oluştur'}</span>
                    </Button>
                    {loading && <div className="spinner"></div>}
                    {summary && <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg w-full whitespace-pre-wrap">{summary}</div>}
                </div>
            </Card>

            <Card title="En İyi Performans Gösterenler (Kazanılan Değer)">
                <div className="space-y-3">
                    {analyticsData.topPerformers.map((performer, index) => (
                        <div key={index} className="flex items-center">
                            <span className="font-semibold w-8">{index + 1}.</span>
                            <span className="flex-1">{performer.name}</span>
                            <div className="w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                <div 
                                    className="bg-primary-500 h-4 rounded-full text-white text-xs flex items-center justify-end pr-2"
                                    style={{ width: `${(performer.value / (analyticsData.topPerformers[0]?.value || 1)) * 100}%` }}
                                >
                                   ${performer.value.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default SalesAnalyticsPage;

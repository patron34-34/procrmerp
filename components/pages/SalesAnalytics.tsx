import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesAnalyticsData, DealStage } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { generateSalesSummary } from '../../services/geminiService';

const SalesAnalytics: React.FC = () => {
    const { deals } = useApp();
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

        return { weightedPipelineValue, totalPipelineValue, winRate, avgSalesCycle: 30, topPerformers: [] };
    }, [deals]);

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
        </div>
    );
};

export default SalesAnalytics;

import React, { useMemo } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Deal, DealStage } from '../../types';
import Card from '../ui/Card';

interface SalesAnalyticsViewProps {
    deals: Deal[];
}

const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({ deals }) => {
    
    const getStageColor = (stage: DealStage) => {
        switch (stage) {
            case DealStage.Lead: return '#3b82f6';
            case DealStage.Contacted: return '#8b5cf6';
            case DealStage.Proposal: return '#f97316';
            case DealStage.Won: return '#22c55e';
            default: return '#64748b';
        }
    }

    const funnelData = useMemo(() => {
        const stagesInOrder = [DealStage.Lead, DealStage.Contacted, DealStage.Proposal, DealStage.Won];
        const dealsInPipeline = deals.filter(d => d.stage !== DealStage.Lost);
        let previousStageCount = dealsInPipeline.length;

        const data = stagesInOrder.map((stage, index) => {
            const dealsInThisStageAndAfter = dealsInPipeline.filter(d => stagesInOrder.slice(index).includes(d.stage));
            const count = dealsInThisStageAndAfter.length;
            const value = dealsInThisStageAndAfter.reduce((sum, deal) => sum + deal.value, 0);
            
            let conversionRate = 0;
            if (previousStageCount > 0) {
                 conversionRate = (count / previousStageCount) * 100;
            }
            previousStageCount = count;

            return { stage, count, value, conversionRate, fill: getStageColor(stage) };
        });

        return data.filter(d => d.count > 0);
    }, [deals]);
    
    const winLossReasonData = (type: 'win' | 'loss') => {
        const reasonMap: { [key: string]: number } = {};
        const relevantDeals = deals.filter(d => d.stage === (type === 'win' ? DealStage.Won : DealStage.Lost));
        
        relevantDeals.forEach(deal => {
            const reason = type === 'win' ? deal.winReason : deal.lossReason;
            if (reason) {
                reasonMap[reason] = (reasonMap[reason] || 0) + 1;
            }
        });

        return Object.entries(reasonMap).map(([name, value]) => ({ name, value }));
    };

    const winData = winLossReasonData('win');
    const lossData = winLossReasonData('loss');
    const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#ef4444', '#64748b'];

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Satış Hunisi Analizi" className="lg:col-span-2">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                    Bu huni, her aşamadaki anlaşma sayısını, değerini ve bir önceki aşamaya göre dönüşüm oranını gösterir.
                </p>
                <div style={{ width: '100%', height: 450 }}>
                    <ResponsiveContainer>
                        <FunnelChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Funnel dataKey="count" data={funnelData} isAnimationActive>
                                <LabelList 
                                    position="center" 
                                    fill="#fff" 
                                    stroke="none" 
                                    dataKey="stage"
                                    fontWeight="bold"
                                    formatter={(value: string) => `${value} (${funnelData.find(d => d.stage === value)?.count})`}
                                />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card title="Kazanma Nedenleri Dağılımı">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={winData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {winData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Kaybetme Nedenleri Dağılımı">
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={lossData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {lossData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-md shadow-lg">
                <p className="font-bold">{data.stage}</p>
                <p>Anlaşma Sayısı: {data.count}</p>
                <p>Toplam Değer: ${data.value.toLocaleString()}</p>
                {data.stage !== DealStage.Lead && <p>Dönüşüm Oranı: {data.conversionRate.toFixed(1)}%</p>}
            </div>
        );
    }
    return null;
};

export default SalesAnalyticsView;

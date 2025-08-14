

import React, { useMemo } from 'react';
import { Deal, DealStage } from '../../types';
import { DEAL_STAGE_PROBABILITIES } from '../../constants';
import Card from '../ui/Card';

interface SalesStatsProps {
  deals: Deal[];
}

const SalesStats: React.FC<SalesStatsProps> = ({ deals }) => {
  const stats = useMemo(() => {
    const openDeals = deals.filter(d => d.stage !== DealStage.Won && d.stage !== DealStage.Lost);
    const closedDeals = deals.filter(d => d.stage === DealStage.Won || d.stage === DealStage.Lost);
    const wonDeals = deals.filter(d => d.stage === DealStage.Won);

    const totalPipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
    const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0;
    
    const weightedForecast = openDeals.reduce((sum, deal) => {
        const probability = DEAL_STAGE_PROBABILITIES[deal.stage] || 0;
        return sum + (deal.value * probability);
    }, 0);

    return { totalPipelineValue, winRate, weightedForecast };
  }, [deals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Pipeline Değeri</h4>
        <p className="text-3xl font-bold">${stats.totalPipelineValue.toLocaleString()}</p>
      </Card>
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Kazanma Oranı</h4>
        <p className="text-3xl font-bold text-green-500">{stats.winRate.toFixed(1)}%</p>
      </Card>
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Ağırlıklı Tahmin</h4>
        <p className="text-3xl font-bold text-primary-600">${stats.weightedForecast.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </Card>
    </div>
  );
};

export default SalesStats;

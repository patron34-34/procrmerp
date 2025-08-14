

import React, { useMemo } from 'react';
import { Customer } from '../../types';
import Card from '../ui/Card';

interface CustomerStatsProps {
  customers: Customer[];
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ customers }) => {
  const stats = useMemo(() => {
    const potential = customers.filter(c => c.status === 'potensiyel').length;
    const active = customers.filter(c => c.status === 'aktif').length;
    const lost = customers.filter(c => c.status === 'kaybedilmiş').length;
    const totalLeads = potential + active; // Conversion rate is often based on leads that could convert
    const conversionRate = totalLeads > 0 ? (active / totalLeads) * 100 : 0;
    
    return { potential, active, lost, conversionRate, total: customers.length };
  }, [customers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Müşteri (Filtrelenmiş)</h4>
        <p className="text-3xl font-bold">{stats.total}</p>
      </Card>
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Potansiyel</h4>
        <p className="text-3xl font-bold text-blue-500">{stats.potential}</p>
      </Card>
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Aktif</h4>
        <p className="text-3xl font-bold text-green-500">{stats.active}</p>
      </Card>
      <Card>
        <h4 className="text-text-secondary dark:text-dark-text-secondary">Dönüşüm Oranı (Potansiyel-Aktif)</h4>
        <p className="text-3xl font-bold text-primary-600">{stats.conversionRate.toFixed(1)}%</p>
      </Card>
    </div>
  );
};

export default CustomerStats;

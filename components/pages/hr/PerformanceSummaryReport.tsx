import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { PerformanceReview } from '../../../types';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';

const PerformanceSummaryReport: React.FC = () => {
    const { performanceReviews } = useApp();
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const [startDate, setStartDate] = useState(firstDayOfYear.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    
    const filteredReviews = useMemo(() => {
        return performanceReviews.filter(review =>
            review.reviewDate >= startDate &&
            review.reviewDate <= endDate
        );
    }, [performanceReviews, startDate, endDate]);

    const stats = useMemo(() => {
        if (filteredReviews.length === 0) {
            return { totalReviews: 0, averageRating: 0, ratingDistribution: [] };
        }
        const totalReviews = filteredReviews.length;
        const totalRating = filteredReviews.reduce((sum, r) => sum + r.overallRating, 0);
        const averageRating = totalRating / totalReviews;
        
        const ratingDistributionMap: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        filteredReviews.forEach(r => {
            ratingDistributionMap[r.overallRating]++;
        });
        const ratingDistribution = Object.keys(ratingDistributionMap).map(key => ({
            name: `${key} Yıldız`,
            'Değerlendirme Sayısı': ratingDistributionMap[parseInt(key)]
        }));
        
        return { totalReviews, averageRating, ratingDistribution };
    }, [filteredReviews]);

    const handleExport = () => {
        const dataToExport = filteredReviews.map(r => ({
            'Çalışan': r.employeeName,
            'Değerlendiren': r.reviewerName,
            'Tarih': r.reviewDate,
            'Puan': r.overallRating,
            'Durum': r.status,
        }));
        exportToCSV(dataToExport, `performans-raporu-${startDate}-${endDate}.csv`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Performans Değerlendirme Özeti</h1>
            <Card title="Filtreler">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-semibold">Başlangıç Tarihi</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Bitiş Tarihi</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1" />
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Toplam Değerlendirme</h4>
                    <p className="text-3xl font-bold">{stats.totalReviews}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Ortalama Puan</h4>
                    <p className="text-3xl font-bold text-primary-600">{stats.averageRating.toFixed(2)} / 5</p>
                </Card>
            </div>

            <Card title="Puan Dağılımı">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Değerlendirme Sayısı" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default PerformanceSummaryReport;

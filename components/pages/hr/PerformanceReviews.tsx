import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PerformanceReview } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import PerformanceReviewFormModal from '../../hr/PerformanceReviewFormModal';

const PerformanceReviews: React.FC = () => {
    const { performanceReviews, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);

    const canManage = hasPermission('ik:performans-yonet');

    const openModalForNew = () => {
        setEditingReview(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (review: PerformanceReview) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const renderRating = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <>
            <Card
                title="Performans Değerlendirmeleri"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Değerlendirme</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Çalışan</th>
                                <th className="p-3">Değerlendiren</th>
                                <th className="p-3">Tarih</th>
                                <th className="p-3">Puan</th>
                                <th className="p-3">Durum</th>
                                {canManage && <th className="p-3">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {performanceReviews.map(review => (
                                <tr key={review.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{review.employeeName}</td>
                                    <td className="p-3">{review.reviewerName}</td>
                                    <td className="p-3">{review.reviewDate}</td>
                                    <td className="p-3">{renderRating(review.overallRating)}</td>
                                    <td className="p-3">{review.status}</td>
                                    {canManage && <td className="p-3">
                                        <button onClick={() => openModalForEdit(review)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <PerformanceReviewFormModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    review={editingReview}
                />
            )}
        </>
    );
};

export default PerformanceReviews;
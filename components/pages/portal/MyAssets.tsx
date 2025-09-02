import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Asset } from '../../../types';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';

const MyAssets: React.FC = () => {
    const { currentUser, assets } = useApp();

    const myAssets = useMemo(() => {
        return assets.filter(a => a.assignedToId === currentUser.id);
    }, [assets, currentUser.id]);

    return (
        <Card title="Üzerimdeki Varlıklar (Zimmetler)">
            <div className="overflow-x-auto">
                 {myAssets.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Varlık Adı</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Seri Numarası</th>
                                <th className="p-3">Atanma Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAssets.map(asset => (
                                <tr key={asset.id} className="border-b dark:border-dark-border">
                                    <td className="p-3 font-medium">{asset.name}</td>
                                    <td className="p-3">{asset.category}</td>
                                    <td className="p-3 font-mono">{asset.serialNumber}</td>
                                    <td className="p-3">{asset.assignmentDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <EmptyState 
                        icon={ICONS.asset}
                        title="Üzerinize Zimmetli Varlık Bulunmuyor"
                        description="Şu anda size atanmış bir şirket varlığı bulunmamaktadır."
                    />
                 )}
            </div>
        </Card>
    );
};

export default MyAssets;
import React from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import EmptyState from '../../ui/EmptyState';

const BillOfMaterials: React.FC = () => {
    const { boms, hasPermission } = useApp();
    const canManage = hasPermission('envanter:yonet');

    return (
        <Card
            title="Ürün Reçeteleri (BOM)"
            action={
                canManage && (
                    <Link to="/manufacturing/boms/new">
                        <Button>
                            <span className="flex items-center gap-2">{ICONS.add} Yeni Reçete</span>
                        </Button>
                    </Link>
                )
            }
        >
            <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Bir mamul üretmek için gereken hammadde ve yarı mamullerin listesi.
            </p>
            <div className="overflow-x-auto">
                {boms.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Üretilen Mamul</th>
                                <th className="p-3 font-semibold">Bileşen Sayısı</th>
                                <th className="p-3 font-semibold">Bileşenler</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {boms.map(bom => (
                                <tr key={bom.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{bom.productName}</td>
                                    <td className="p-3 text-center">{bom.items.length}</td>
                                    <td className="p-3 text-sm text-text-secondary">
                                        {bom.items.map(item => `${item.productName} (x${item.quantity})`).join(', ')}
                                    </td>
                                    {canManage && (
                                        <td className="p-3">
                                            <Link to={`/manufacturing/boms/${bom.id}/edit`}>
                                                <Button variant="secondary" size="sm">Düzenle</Button>
                                            </Link>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.manufacturing}
                        title="Henüz Ürün Reçetesi Yok"
                        description="Üretim yapabilmek için ilk ürün reçetenizi oluşturun."
                        action={canManage ? <Link to="/manufacturing/boms/new"><Button>Reçete Oluştur</Button></Link> : undefined}
                    />
                )}
            </div>
        </Card>
    );
};

export default BillOfMaterials;
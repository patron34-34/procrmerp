import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Permission, Role } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS, PERMISSION_DESCRIPTIONS } from '../../../constants';
import RoleFormModal from '../../settings/RoleFormModal';
import ConfirmationModal from '../../ui/ConfirmationModal';


const permissionGroups: { [key: string]: { description: string, permissions: Permission[] } } = {
    'Genel': {
        description: "Uygulamanın temel modülleri için genel erişim.",
        permissions: ['dashboard:goruntule', 'dashboard:duzenle', 'takvim:goruntule', 'gorev:goruntule', 'gorev:yonet', 'dokuman:goruntule', 'dokuman:yonet', 'yorum:yonet', 'aktivite:goruntule']
    },
    'Müşteri İlişkileri': {
        description: "Müşteriler, anlaşmalar ve faturalandırma yönetimi.",
        permissions: ['musteri:goruntule', 'musteri:yonet', 'anlasma:goruntule', 'anlasma:yonet', 'fatura:goruntule', 'fatura:yonet']
    },
    'Operasyonlar': {
        description: "Projeler ve destek talepleri yönetimi.",
        permissions: ['proje:goruntule', 'proje:yonet', 'destek:goruntule', 'destek:yonet']
    },
    'Envanter': {
        description: "Basit ve gelişmiş envanter modülleri yönetimi.",
        permissions: ['envanter:goruntule', 'envanter:yonet', 'depo:yonet', 'stok-hareketi:goruntule', 'stok-sayimi:yap']
    },
    'İnsan Kaynakları': {
        description: "Çalışan, izin, performans ve işe alım yönetimi.",
        permissions: ['ik:goruntule', 'ik:maas-goruntule', 'ik:izin-yonet', 'ik:performans-yonet', 'ik:ise-alim-goruntule', 'ik:ise-alim-yonet', 'ik:oryantasyon-goruntule', 'ik:oryantasyon-yonet']
    },
    'Finans & Muhasebe': {
        description: "Finansal işlemler ve muhasebe kayıtları yönetimi.",
        permissions: [
            'finans:goruntule', 'finans:yonet',
            'muhasebe:goruntule', 'muhasebe:yonet', 'muhasebe:mutabakat-yap', 'muhasebe:tekrarlanan-yonet', 'muhasebe:butce-yonet',
            'muhasebe:defteri-kebir-goruntule', 'muhasebe:bilanco-goruntule', 'muhasebe:gelir-tablosu-goruntule', 'muhasebe:nakit-akis-goruntule', 'muhasebe:alacak-yaslandirma-goruntule', 'muhasebe:kar-zarar-goruntule'
        ]
    },
    'Raporlama': {
        description: "Tüm raporlama modüllerine erişim.",
        permissions: ['rapor:goruntule']
    },
    'Otomasyon': {
        description: "Otomasyonlar modülünün yönetimi.",
        permissions: ['otomasyon:goruntule', 'otomasyon:yonet']
    },
    'Sistem Yönetimi': {
        description: "Sistem genelindeki ayarlar ve kullanıcı yönetimi.",
        permissions: ['kullanici:yonet', 'ayarlar:goruntule', 'ayarlar:genel-yonet', 'ayarlar:roller-yonet', 'ayarlar:guvenlik-yonet', 'ayarlar:muhasebe-yonet', 'ayarlar:maliyet-merkezi-yonet', 'ayarlar:vergi-yonet']
    }
};


const RolesSettings: React.FC = () => {
    const { roles, rolesPermissions, updateRolePermissions, deleteRole } = useApp();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [currentPermissions, setCurrentPermissions] = useState<Set<Permission>>(new Set());
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);

    useEffect(() => {
        if (selectedRole) {
            setCurrentPermissions(new Set(rolesPermissions[selectedRole.id] || []));
        }
    }, [selectedRole, rolesPermissions]);
    
    const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
        const newPermissions = new Set(currentPermissions);
        if (isChecked) {
            newPermissions.add(permission);
        } else {
            newPermissions.delete(permission);
        }
        setCurrentPermissions(newPermissions);
    };
    
    const handleSave = () => {
        if (selectedRole) {
            updateRolePermissions(selectedRole.id, Array.from(currentPermissions));
        }
    };
    
    const handleDeleteConfirm = () => {
        if (roleToDelete) {
            deleteRole(roleToDelete.id);
            setRoleToDelete(null);
            if (selectedRole?.id === roleToDelete.id) {
                setSelectedRole(roles[0] || null);
            }
        }
    };

    return (
        <>
            <div className="flex gap-6">
                <div className="w-1/4">
                    <Card
                        title="Roller"
                        action={<Button onClick={() => setIsFormModalOpen(true)}>{ICONS.add} Yeni Rol</Button>}
                    >
                        <div className="space-y-1">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left p-2 rounded-md text-sm font-medium flex justify-between items-center ${selectedRole?.id === role.id ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <span>{role.name}</span>
                                    {!role.isSystemRole && selectedRole?.id === role.id && (
                                        <button onClick={(e) => { e.stopPropagation(); setRoleToDelete(role); }} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                                    )}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="w-3/4">
                    {selectedRole && (
                        <Card title={`İzinler: ${selectedRole.name}`}>
                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                                {Object.entries(permissionGroups).map(([groupName, group]) => (
                                    <div key={groupName}>
                                        <h4 className="font-bold text-lg">{groupName}</h4>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-2">{group.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                                            {group.permissions.map(permission => (
                                                <label key={permission} className="flex items-center" title={PERMISSION_DESCRIPTIONS[permission]}>
                                                    <input
                                                        type="checkbox"
                                                        checked={currentPermissions.has(permission)}
                                                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                                        disabled={selectedRole.isSystemRole}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-2 text-sm">{permission}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!selectedRole.isSystemRole && (
                                <div className="flex justify-end pt-4 mt-4 border-t dark:border-dark-border">
                                    <Button onClick={handleSave}>İzinleri Kaydet</Button>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>
            <RoleFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
            />
            <ConfirmationModal
                isOpen={!!roleToDelete}
                onClose={() => setRoleToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Rolü Sil"
                message={`'${roleToDelete?.name}' adlı rolü kalıcı olarak silmek istediğinizden emin misiniz? Bu role sahip kullanıcılar varsayılan role atanacaktır.`}
            />
        </>
    );
};

export default RolesSettings;
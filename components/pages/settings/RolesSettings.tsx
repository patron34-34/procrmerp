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
        description: "Basit ve gelişmiş envanter ve üretim yönetimi.",
        permissions: ['envanter:goruntule', 'envanter:yonet', 'depo:yonet', 'stok-hareketi:goruntule', 'stok-sayimi:yap', 'satis-siparis:goruntule', 'satis-siparis:yonet', 'sevkiyat:goruntule', 'sevkiyat:yonet', 'toplama-listesi:goruntule', 'toplama-listesi:yonet']
    },
    'İK': {
        description: "İnsan kaynakları, bordro ve çalışan yönetimi.",
        permissions: ['ik:goruntule', 'ik:maas-goruntule', 'ik:izin-yonet', 'ik:performans-yonet', 'ik:ise-alim-goruntule', 'ik:ise-alim-yonet', 'ik:oryantasyon-goruntule', 'ik:oryantasyon-yonet', 'ik:bordro-yonet', 'ik:rapor-goruntule', 'ik:masraf-yonet', 'ik:varlik-yonet']
    },
    'Finans & Muhasebe': {
        description: "Finansal işlemler, muhasebe kayıtları ve raporlama.",
        permissions: ['finans:goruntule', 'finans:yonet', 'muhasebe:goruntule', 'muhasebe:yonet', 'muhasebe:mutabakat-yap', 'muhasebe:defteri-kebir-goruntule', 'muhasebe:bilanco-goruntule', 'muhasebe:gelir-tablosu-goruntule', 'muhasebe:nakit-akis-goruntule', 'muhasebe:alacak-yaslandirma-goruntule', 'muhasebe:kar-zarar-goruntule', 'muhasebe:tekrarlanan-yonet', 'muhasebe:butce-yonet']
    },
     'Raporlama': {
        description: "Tüm modüller için genel raporlama erişimi.",
        permissions: ['rapor:goruntule']
    },
    'Yönetim & Ayarlar': {
        description: "Kullanıcı, rol ve sistem ayarları yönetimi.",
        permissions: ['kullanici:yonet', 'ayarlar:goruntule', 'ayarlar:genel-yonet', 'ayarlar:roller-yonet', 'ayarlar:guvenlik-yonet', 'ayarlar:muhasebe-yonet', 'ayarlar:maliyet-merkezi-yonet', 'ayarlar:vergi-yonet', 'ayarlar:ik-bordro-yonet', 'otomasyon:goruntule', 'otomasyon:yonet']
    }
};

const RolesSettings: React.FC = () => {
    const { roles, rolesPermissions, updateRolePermissions, deleteRole } = useApp();
    const [selectedRoleId, setSelectedRoleId] = useState<string>(roles.find(r => !r.isSystemRole)?.id || roles[0]?.id || '');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set());
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const selectedRole = useMemo(() => roles.find(r => r.id === selectedRoleId), [roles, selectedRoleId]);

    useEffect(() => {
        if (selectedRoleId && rolesPermissions[selectedRoleId]) {
            setSelectedPermissions(new Set(rolesPermissions[selectedRoleId]));
        } else {
            setSelectedPermissions(new Set());
        }
    }, [selectedRoleId, rolesPermissions]);

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        const newPermissions = new Set(selectedPermissions);
        if (checked) {
            newPermissions.add(permission);
        } else {
            newPermissions.delete(permission);
        }
        setSelectedPermissions(newPermissions);
    };

    const handleSave = () => {
        if (selectedRoleId) {
            updateRolePermissions(selectedRoleId, Array.from(selectedPermissions));
        }
    };
    
    const handleDeleteConfirm = () => {
        if (roleToDelete) {
            deleteRole(roleToDelete.id);
            setRoleToDelete(null);
            // Select the first available non-system role after deletion
            const firstNonSystemRole = roles.find(r => !r.isSystemRole && r.id !== roleToDelete.id);
            setSelectedRoleId(firstNonSystemRole?.id || roles[0]?.id || '');
        }
    };

    return (
        <>
        <Card>
             <div className="flex justify-between items-center p-4 border-b dark:border-dark-border">
                <div>
                    <h3 className="text-lg font-bold">Roller ve İzinler</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Kullanıcı rollerini yönetin ve her rol için erişim izinlerini belirleyin.</p>
                </div>
                <Button onClick={() => setIsRoleModalOpen(true)}><span className="flex items-center gap-2">{ICONS.add} Yeni Rol Ekle</span></Button>
            </div>
            <div className="flex">
                <div className="w-1/4 border-r dark:border-dark-border p-4">
                     <h4 className="font-semibold mb-2">Roller</h4>
                    <ul>
                        {roles.map(role => (
                            <li key={role.id}>
                                <button
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`w-full text-left p-2 rounded-md text-sm ${selectedRoleId === role.id ? 'bg-primary-100 dark:bg-primary-900/50 font-bold text-primary-700 dark:text-primary-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    {role.name} {role.isSystemRole && '(Sistem)'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-3/4 p-4">
                     {selectedRole ? (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-xl font-bold">{selectedRole.name}</h4>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Bu rol için izinleri düzenleyin.</p>
                                </div>
                                <div>
                                    {!selectedRole.isSystemRole && <Button variant="danger" size="sm" onClick={() => setRoleToDelete(selectedRole)}>Rolü Sil</Button>}
                                    <Button onClick={handleSave} className="ml-2" size="sm">Değişiklikleri Kaydet</Button>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                                {Object.entries(permissionGroups).map(([groupName, groupInfo]) => (
                                    <div key={groupName}>
                                        <h5 className="font-semibold">{groupName}</h5>
                                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-2">{groupInfo.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                            {groupInfo.permissions.map(permission => (
                                                <label key={permission} className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.has(permission)}
                                                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                                        disabled={selectedRole.isSystemRole}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                                    />
                                                    <span className="text-sm">{PERMISSION_DESCRIPTIONS[permission]?.description || permission}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Lütfen düzenlemek için bir rol seçin.</p>
                    )}
                </div>
            </div>
        </Card>
        <RoleFormModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
        {roleToDelete && (
            <ConfirmationModal
                isOpen={!!roleToDelete}
                onClose={() => setRoleToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Rolü Sil"
                message={`'${roleToDelete.name}' rolünü kalıcı olarak silmek istediğinizden emin misiniz? Bu role sahip kullanıcılar varsayılan 'Çalışan' rolüne atanacaktır.`}
            />
        )}
        </>
    );
};

export default RolesSettings;

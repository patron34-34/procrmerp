

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose }) => {
    const { roles, addRole } = useApp();
    const [roleName, setRoleName] = useState('');
    const [cloneFromRoleId, setCloneFromRoleId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (roleName.trim() && !roles.find(r => r.name === roleName.trim())) {
            addRole({ name: roleName.trim() }, cloneFromRoleId || undefined);
            onClose();
            setRoleName('');
            setCloneFromRoleId('');
        } else {
            alert("Lütfen geçerli ve benzersiz bir rol adı girin.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Rol Oluştur">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="roleName" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Rol Adı *</label>
                    <input
                        type="text"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        required
                        autoFocus
                    />
                </div>
                 <div>
                    <label htmlFor="cloneFrom" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">İzinleri Kopyala (Opsiyonel)</label>
                    <select
                        id="cloneFrom"
                        value={cloneFromRoleId}
                        onChange={(e) => setCloneFromRoleId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value="">Boş Rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button variant="secondary" type="button" onClick={onClose}>İptal</Button>
                    <Button type="submit">Oluştur</Button>
                </div>
            </form>
        </Modal>
    );
};

export default RoleFormModal;
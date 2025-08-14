
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const SecuritySettings: React.FC = () => {
    const { securitySettings, updateSecuritySettings, hasPermission } = useApp();
    const [formData, setFormData] = useState(securitySettings);

    const canManage = hasPermission('ayarlar:guvenlik-yonet');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseInt(value)
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSecuritySettings(formData);
    };

    return (
        <Card title="Güvenlik Ayarları">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg">Parola Politikası</h4>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">Kullanıcı parolaları için minimum gereksinimleri belirleyin.</p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="passwordMinLength" className="block text-sm font-medium">Minimum Parola Uzunluğu</label>
                            <input
                                type="number"
                                id="passwordMinLength"
                                name="passwordMinLength"
                                value={formData.passwordMinLength}
                                onChange={handleInputChange}
                                disabled={!canManage}
                                className="mt-1 block w-full max-w-xs p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="passwordRequireUppercase"
                                name="passwordRequireUppercase"
                                checked={formData.passwordRequireUppercase}
                                onChange={handleInputChange}
                                disabled={!canManage}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="passwordRequireUppercase" className="ml-2 block text-sm">Büyük harf gerektir</label>
                        </div>
                        <div className="flex items-center">
                             <input
                                type="checkbox"
                                id="passwordRequireNumber"
                                name="passwordRequireNumber"
                                checked={formData.passwordRequireNumber}
                                onChange={handleInputChange}
                                disabled={!canManage}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="passwordRequireNumber" className="ml-2 block text-sm">Rakam gerektir</label>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6 dark:border-dark-border">
                     <h4 className="font-semibold text-lg">Oturum Yönetimi</h4>
                     <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">Kullanıcı oturumlarının ne kadar süreyle aktif kalacağını belirleyin.</p>
                      <div>
                            <label htmlFor="sessionTimeout" className="block text-sm font-medium">Oturum Zaman Aşımı (dakika)</label>
                            <input
                                type="number"
                                id="sessionTimeout"
                                name="sessionTimeout"
                                value={formData.sessionTimeout}
                                onChange={handleInputChange}
                                disabled={!canManage}
                                className="mt-1 block w-full max-w-xs p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"
                            />
                        </div>
                </div>

                {canManage && (
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Değişiklikleri Kaydet</Button>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default SecuritySettings;

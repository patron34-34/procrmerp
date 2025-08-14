

import React, { useState } from 'react';
import Card from '../../ui/Card';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { useTheme } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';
import Button from '../../ui/Button';

const AppearanceSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { brandingSettings, updateBrandingSettings, hasPermission } = useApp();

    const [logoUrl, setLogoUrl] = useState(brandingSettings.logoUrl);
    const [primaryColor, setPrimaryColor] = useState(brandingSettings.primaryColor);
    const canManage = hasPermission('ayarlar:genel-yonet');

    const handleSave = () => {
        updateBrandingSettings({ logoUrl, primaryColor });
    };
    
    const handleReset = () => {
        setLogoUrl('');
        setPrimaryColor('#3b82f6');
        updateBrandingSettings({ logoUrl: '', primaryColor: '#3b82f6' });
    };

    return (
        <Card title="Marka & Görünüm Ayarları">
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Uygulama genelinde açık veya koyu temayı etkinleştirin.
                    </p>
                    <ToggleSwitch 
                        isOn={theme === 'dark'}
                        handleToggle={toggleTheme}
                        label="Karanlık Mod"
                    />
                </div>
                
                <div className="p-4 space-y-4">
                    <h4 className="text-lg font-semibold">Markalaşma</h4>
                    <div>
                        <label htmlFor="logoUrl" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Şirket Logosu URL'si</label>
                        <input
                            type="text"
                            id="logoUrl"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            disabled={!canManage}
                            placeholder="https://sirketiniz.com/logo.png"
                            className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"
                        />
                    </div>
                     <div>
                        <label htmlFor="primaryColor" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Ana Renk</label>
                        <div className="flex items-center gap-2 mt-1">
                             <input
                                type="color"
                                id="primaryColor"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                disabled={!canManage}
                                className="p-1 h-10 w-10 block bg-white dark:bg-slate-700 border border-border dark:border-dark-border cursor-pointer rounded-lg disabled:opacity-50"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                disabled={!canManage}
                                className="block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"
                            />
                        </div>
                    </div>
                     {canManage && (
                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="secondary" onClick={handleReset}>Sıfırla</Button>
                            <Button type="button" onClick={handleSave}>Değişiklikleri Kaydet</Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default AppearanceSettings;
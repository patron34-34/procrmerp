import React, { useState } from 'react';
import Card from '../../ui/Card';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { useTheme } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';
import Button from '../../ui/Button';
import { BrandingSettings } from '../../../types';

const AppearanceSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { brandingSettings, updateBrandingSettings, hasPermission } = useApp();

    const [logoUrl, setLogoUrl] = useState(brandingSettings.logoUrl);
    const [primaryColor, setPrimaryColor] = useState(brandingSettings.primaryColor);
    const [fontSize, setFontSize] = useState<BrandingSettings['fontSize']>(brandingSettings.fontSize || 'md');
    const canManage = hasPermission('ayarlar:genel-yonet');

    const handleSave = () => {
        updateBrandingSettings({ logoUrl, primaryColor, fontSize });
    };
    
    const handleReset = () => {
        setLogoUrl('');
        setPrimaryColor('#4f46e5');
        setFontSize('md');
        updateBrandingSettings({ logoUrl: '', primaryColor: '#4f46e5', fontSize: 'md' });
    };

    const FontSizeButton: React.FC<{ size: BrandingSettings['fontSize'], label: string }> = ({ size, label }) => (
        <button
            type="button"
            onClick={() => canManage && setFontSize(size)}
            disabled={!canManage}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                fontSize === size
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-card text-text-main border-border hover:bg-slate-100 dark:hover:bg-slate-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {label}
        </button>
    );

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

                    <div className="border-t pt-4 dark:border-dark-border">
                         <label className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Yazı Tipi Boyutu</label>
                         <p className="text-xs text-slate-500 mt-1 mb-2">Uygulama genelindeki metin boyutunu ayarlayın.</p>
                         <div className="flex items-center gap-2">
                            <FontSizeButton size="sm" label="Küçük" />
                            <FontSizeButton size="md" label="Normal" />
                            <FontSizeButton size="lg" label="Büyük" />
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
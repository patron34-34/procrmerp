import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import { useNavigate } from 'react-router-dom';

const CommandPalette: React.FC = () => {
    const { setIsCommandPaletteOpen } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const allCommands = useMemo(() => [
        { group: 'Navigasyon', name: 'Kontrol Paneli', action: () => navigate('/'), icon: ICONS.dashboard },
        { group: 'Navigasyon', name: 'Müşteriler', action: () => navigate('/customers'), icon: ICONS.customers },
        { group: 'Navigasyon', name: 'Satış Hattı', action: () => navigate('/sales'), icon: ICONS.sales },
        { group: 'Navigasyon', name: 'Projeler', action: () => navigate('/projects'), icon: ICONS.projects },
        { group: 'Navigasyon', name: 'Planlayıcı', action: () => navigate('/planner'), icon: ICONS.planner },
        { group: 'Navigasyon', name: 'Faturalar', action: () => navigate('/invoicing/outgoing'), icon: ICONS.invoices },
        { group: 'Navigasyon', name: 'Ürünler', action: () => navigate('/inventory/products'), icon: ICONS.inventory },
        { group: 'Navigasyon', name: 'İK Paneli', action: () => navigate('/hr'), icon: ICONS.hr },
        { group: 'Navigasyon', name: 'Ayarlar', action: () => navigate('/admin/settings'), icon: ICONS.settings },
        { group: 'Eylemler', name: 'Yeni Müşteri Oluştur', action: () => { /* TODO */ }, icon: ICONS.add },
        { group: 'Eylemler', name: 'Yeni Anlaşma Oluştur', action: () => { /* TODO */ }, icon: ICONS.add },
        { group: 'Eylemler', name: 'Yeni Görev Oluştur', action: () => { /* TODO */ }, icon: ICONS.add },
        { group: 'Eylemler', name: 'Yeni Fatura Oluştur', action: () => navigate('/invoicing/new'), icon: ICONS.add },

    ], [navigate]);

    const filteredCommands = useMemo(() => {
        if (!searchTerm) return allCommands;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return allCommands.filter(cmd => cmd.name.toLowerCase().includes(lowerSearchTerm));
    }, [searchTerm, allCommands]);

    const groupedCommands = useMemo(() => {
        return filteredCommands.reduce((acc, cmd) => {
            (acc[cmd.group] = acc[cmd.group] || []).push(cmd);
            return acc;
        }, {} as Record<string, typeof allCommands>);
    }, [filteredCommands]);

    const handleCommandClick = (action: () => void) => {
        setIsCommandPaletteOpen(false);
        action();
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsCommandPaletteOpen]);


    return (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-20 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsCommandPaletteOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-card rounded-2xl shadow-lg w-full max-w-xl m-4 border border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                    {ICONS.search}
                </div>
                <input
                    type="text"
                    placeholder="Komut ara veya yaz..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent p-4 pl-12 text-lg focus:outline-none"
                />
            </div>
            <div className="max-h-96 overflow-y-auto border-t border-border p-2">
                {Object.entries(groupedCommands).map(([group, commands]) => (
                    <div key={group}>
                        <h3 className="px-2 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">{group}</h3>
                        <ul>
                            {commands.map((cmd, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleCommandClick(cmd.action)}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <span className="w-5 h-5 text-text-secondary">{cmd.icon}</span>
                                        <span>{cmd.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {filteredCommands.length === 0 && (
                    <p className="p-4 text-center text-text-secondary">Sonuç bulunamadı.</p>
                )}
            </div>
          </div>
        </div>
    );
};

export default CommandPalette;
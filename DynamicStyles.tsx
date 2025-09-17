import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';

function hexToRgb(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const DynamicStyles: React.FC = () => {
    const { brandingSettings } = useApp();
    const { primaryColor, fontSize } = brandingSettings || {};

    useEffect(() => {
        const styleId = 'dynamic-branding-styles';
        let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }
        
        const rgb = hexToRgb(primaryColor || '#4f46e5');
        const primaryColorRgb = rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '79 70 229';

        // Font Size Styles
        let baseFontSize = '16px'; // md
        if (fontSize === 'sm') {
            baseFontSize = '14px';
        } else if (fontSize === 'lg') {
            baseFontSize = '18px';
        }
        
        styleTag.innerHTML = `
          :root {
            --primary-color: ${primaryColor};
            --primary-color-rgb: ${primaryColorRgb};
          }

          html {
            font-size: ${baseFontSize};
          }
          
          .bg-primary-600 { background-color: var(--primary-color) !important; }
          .hover\\:bg-primary-700:hover { filter: brightness(0.9); background-color: var(--primary-color) !important; }
          .text-primary-600 { color: var(--primary-color) !important; }
          .hover\\:text-primary-600:hover { color: var(--primary-color) !important; }
          .dark .dark\\:text-primary-400 { color: var(--primary-color) !important; }
          .dark .dark\\:hover\\:text-primary-400:hover { color: var(--primary-color) !important; }
          .focus\\:ring-primary-500:focus { --tw-ring-color: var(--primary-color) !important; }
          .border-primary-500 { border-color: var(--primary-color) !important; }
          .text-primary-700 { color: var(--primary-color) !important; filter: brightness(0.9); }
          .bg-primary-100 { background-color: rgba(var(--primary-color-rgb), 0.1) !important; }
          .text-primary-700 { color: var(--primary-color) !important; }
          .dark .dark\\:bg-primary-900\\/50 { background-color: rgba(var(--primary-color-rgb), 0.25) !important; }
          .dark .dark\\:text-primary-300 { color: var(--primary-color) !important; filter: brightness(1.2); }
          .form-checkbox.text-primary-600:checked,
          input[type="checkbox"].text-primary-600:checked {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }
        `;
    }, [primaryColor, fontSize]);

    return null;
};

export default DynamicStyles;
import React from 'react';

interface InfoRowProps {
    label: string;
    value?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    if (value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value))) return null;
    return (
        <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <dt className="text-text-secondary">{label}</dt>
            <dd className="col-span-2 text-text-main font-medium">{value}</dd>
        </div>
    );
};

export default InfoRow;
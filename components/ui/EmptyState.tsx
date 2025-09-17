import React, { ReactNode, ReactElement, memo } from 'react';

interface EmptyStateProps {
    icon: ReactElement;
    title: string;
    description: string;
    action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ icon, title, description, action }) => {
    return (
        <div className="text-center p-12 border-2 border-dashed border-border rounded-xl">
            <div className="mx-auto h-12 w-12 text-slate-400 [&_svg]:h-full [&_svg]:w-full">{icon}</div>
            <h3 className="mt-4 text-lg font-semibold text-text-main">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
});

export default EmptyState;
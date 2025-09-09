import React, { memo } from 'react';
import { DashboardWidget, WidgetConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Card from '../ui/Card';

interface WidgetWrapperProps {
  widget: DashboardWidget;
  config: WidgetConfig;
  isEditMode: boolean;
  children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = memo(({ widget, config, isEditMode, children }) => {
  const { removeWidgetFromDashboard } = useApp();

  return (
    <Card 
        className="flex flex-col h-full"
        title={config.name}
        action={
            isEditMode && (
                <button
                  onClick={() => removeWidgetFromDashboard(widget.id)}
                  className="text-slate-400 hover:text-red-500"
                  title="Bileşeni Kaldır"
                >
                  {ICONS.close}
                </button>
            )
        }
    >
        {children}
    </Card>
  );
});

export default WidgetWrapper;

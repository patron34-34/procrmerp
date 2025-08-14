import React from 'react';
import { DashboardWidget, WidgetConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';

interface WidgetWrapperProps {
  widget: DashboardWidget;
  config: WidgetConfig;
  isEditMode: boolean;
  children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ widget, config, isEditMode, children }) => {
  const { removeWidgetFromDashboard } = useApp();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center dark:border-dark-border">
        <h3 className="font-bold text-md text-text-main dark:text-dark-text-main">{config.name}</h3>
        {isEditMode && (
          <button
            onClick={() => removeWidgetFromDashboard(widget.id)}
            className="text-slate-400 hover:text-red-500"
            title="Bileşeni Kaldır"
          >
            {ICONS.close}
          </button>
        )}
      </div>
      <div className="p-4 flex-grow h-full">
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
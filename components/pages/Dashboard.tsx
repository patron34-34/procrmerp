

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_WIDGETS } from '../../constants';
import { WidgetConfig } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import WidgetWrapper from '../dashboard-widgets/WidgetWrapper';
import StatCardWidget from '../dashboard-widgets/StatCardWidget';
import ChartWidget from '../dashboard-widgets/ChartWidget';
import ListWidget from '../dashboard-widgets/ListWidget';
import Card from '../ui/Card';

const WIDGET_MAP = {
  StatCard: StatCardWidget,
  Chart: ChartWidget,
  List: ListWidget,
};

const Dashboard: React.FC = () => {
  const { dashboardLayout, setDashboardLayout, addWidgetToDashboard, hasPermission } = useApp();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [originalLayout, setOriginalLayout] = useState(dashboardLayout);

  const canManageDashboard = hasPermission('dashboard:duzenle');

  const handleEditToggle = () => {
    if (isEditMode) {
      // Save logic would go here if we had a backend
      setOriginalLayout(dashboardLayout); // "Save" the current layout
    } else {
      setOriginalLayout(dashboardLayout); // Store original layout on entering edit mode
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    setDashboardLayout(originalLayout);
    setIsEditMode(false);
  };

  const widgetsOnDashboard = new Set(dashboardLayout.map(w => w.widgetId));
  const availableWidgetsToAdd = AVAILABLE_WIDGETS.filter(w => !widgetsOnDashboard.has(w.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        {canManageDashboard && (
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button onClick={() => setIsAddWidgetModalOpen(true)}>Bileşen Ekle</Button>
                <Button onClick={handleEditToggle} variant="primary">Düzenlemeyi Bitir</Button>
                <Button onClick={handleCancelEdit} variant="secondary">İptal</Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} variant="secondary">Panoyu Düzenle</Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-min">
        {dashboardLayout.map(widget => {
          const config = AVAILABLE_WIDGETS.find(w => w.id === widget.widgetId);
          if (!config) return null;

          const WidgetComponent = WIDGET_MAP[config.type];
          
          return (
            <Card
              key={widget.id}
              className="!p-0 flex flex-col h-full"
              style={{
                gridColumn: `span ${widget.w}`,
                gridRow: `span ${widget.h}`,
              }}
            >
              <WidgetWrapper
                widget={widget}
                config={config}
                isEditMode={isEditMode}
              >
                <WidgetComponent widgetId={widget.widgetId} />
              </WidgetWrapper>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isAddWidgetModalOpen} onClose={() => setIsAddWidgetModalOpen(false)} title="Bileşen Ekle">
        <div className="max-h-96 overflow-y-auto">
          {availableWidgetsToAdd.length > 0 ? (
            <ul className="space-y-2">
              {availableWidgetsToAdd.map(widget => (
                <li key={widget.id}>
                  <button
                    onClick={() => {
                      addWidgetToDashboard(widget.id);
                      setIsAddWidgetModalOpen(false);
                    }}
                    className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md"
                  >
                    {widget.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-text-secondary dark:text-dark-text-secondary">Eklenecek başka bileşen yok.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

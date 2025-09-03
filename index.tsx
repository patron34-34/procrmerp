import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import DynamicStyles from './DynamicStyles';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AppProvider>
            <DynamicStyles />
            <App />
          </AppProvider>
        </NotificationProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
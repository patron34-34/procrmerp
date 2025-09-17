import React from 'react';
import { useApp } from '../../context/AppContext';
import CommunicationLogForm from './CommunicationLogForm';

const LogActivityModal: React.FC = () => {
    const { isLogModalOpen, setIsLogModalOpen, logModalCustomerId } = useApp();

    if (!isLogModalOpen || !logModalCustomerId) {
        return null;
    }

    return (
        <CommunicationLogForm
            isOpen={isLogModalOpen}
            onClose={() => setIsLogModalOpen(false, null)}
            customerId={logModalCustomerId}
        />
    );
};

export default LogActivityModal;
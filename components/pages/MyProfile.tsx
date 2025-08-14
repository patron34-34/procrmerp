import React from 'react';
import { useApp } from '../../context/AppContext';
import EmployeeDetail from './hr/EmployeeDetail';

const MyProfile: React.FC = () => {
    const { currentUser } = useApp();

    if (!currentUser) {
        return <div>Yükleniyor...</div>;
    }

    return <EmployeeDetail employeeId={currentUser.id} />;
};

export default MyProfile;

import React from 'react';
import { Link } from 'react-router-dom';
import { Employee } from '../../types';

const EmployeeNode: React.FC<{ employee: Employee }> = ({ employee }) => {
    return (
        <div className="flex flex-col items-center p-3 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm w-48 text-center">
            <Link to={`/hr/employees/${employee.id}`}>
                <img src={employee.avatar} alt={employee.name} className="w-16 h-16 rounded-full mb-2 mx-auto" />
            </Link>
            <Link to={`/hr/employees/${employee.id}`} className="font-bold text-text-main dark:text-dark-text-main hover:text-primary-600 dark:hover:text-primary-400">{employee.name}</Link>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{employee.position}</p>
        </div>
    );
};

export default EmployeeNode;

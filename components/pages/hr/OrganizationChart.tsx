import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Employee } from '../../../types';
import EmployeeNode from '../../hr/EmployeeNode';
import Card from '../../ui/Card';

const OrganizationChart: React.FC = () => {
    const { employees } = useApp();

    const employeesByManager = useMemo(() => {
        const map = new Map<number | undefined, Employee[]>();
        employees.forEach(employee => {
            const reports = map.get(employee.managerId) || [];
            reports.push(employee);
            map.set(employee.managerId, reports);
        });
        return map;
    }, [employees]);

    const rootEmployees = employees.filter(e => !e.managerId);

    const RenderTree: React.FC<{ employee: Employee }> = ({ employee }) => {
        const reports = employeesByManager.get(employee.id) || [];
        return (
            <li>
                <EmployeeNode employee={employee} />
                {reports.length > 0 && (
                    <ul>
                        {reports.map(report => <RenderTree key={report.id} employee={report} />)}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <Card title="Organizasyon Şeması">
            <div className="overflow-x-auto p-4">
                <div className="org-chart">
                     {rootEmployees.length > 0 ? (
                        <ul>
                            {rootEmployees.map(root => <RenderTree key={root.id} employee={root} />)}
                        </ul>
                    ) : (
                        <p className="text-center text-text-secondary dark:text-dark-text-secondary">Organizasyon şeması oluşturulamadı. Lütfen çalışan verilerini (özellikle yönetici atamalarını) kontrol edin.</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default OrganizationChart;

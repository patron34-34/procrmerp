

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Employee } from '../../../types';
import Card from '../../ui/Card';

const UsersSettings: React.FC = () => {
    const { employees, updateEmployee, hasPermission, roles } = useApp();

    const canManageUsers = hasPermission('kullanici:yonet');

    const handleRoleChange = (employee: Employee, newRole: string) => {
        updateEmployee({ ...employee, role: newRole });
    };

    return (
        <Card title="Kullanıcı Yönetimi">
            <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Sistemdeki kullanıcıları ve rollerini yönetin. Roller ve izinler hakkında daha detaylı ayarlar için 'Roller & İzinler' sekmesini ziyaret edin.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200 dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-4 font-semibold">Çalışan</th>
                            <th className="p-4 font-semibold">Departman</th>
                            <th className="p-4 font-semibold">Pozisyon</th>
                            <th className="p-4 font-semibold">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                <td className="p-4 flex items-center">
                                    <img src={employee.avatar} alt={employee.name} className="h-10 w-10 rounded-full mr-4" />
                                    <div>
                                        <p className="font-medium">{employee.name}</p>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{employee.email}</p>
                                    </div>
                                </td>
                                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{employee.department}</td>
                                <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{employee.position}</td>
                                <td className="p-4">
                                    {canManageUsers ? (
                                        <select
                                            value={employee.role}
                                            onChange={(e) => handleRoleChange(employee, e.target.value)}
                                            className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{employee.role}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default UsersSettings;
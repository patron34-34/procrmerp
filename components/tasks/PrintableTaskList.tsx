import React from 'react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';

interface PrintableTaskListProps {
    tasks: Task[];
}

const PrintableTaskList: React.FC<PrintableTaskListProps> = ({ tasks }) => {
    const { companyInfo } = useApp();
    const today = new Date().toLocaleDateString('tr-TR');

    return (
        <div className="printable-area">
            <div className="bg-white text-black p-8 font-sans">
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-black">
                    <div>
                        <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
                        <h2 className="text-xl">Görev Listesi</h2>
                    </div>
                    <div className="text-right">
                        <p><strong>Rapor Tarihi:</strong> {today}</p>
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="p-2">Görev Başlığı</th>
                            <th className="p-2">Sorumlu</th>
                            <th className="p-2">Bitiş Tarihi</th>
                            <th className="p-2">Öncelik</th>
                            <th className="p-2">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-300">
                                <td className="p-2 font-medium">{task.title}</td>
                                <td className="p-2">{task.assignedToName}</td>
                                <td className="p-2">{task.dueDate}</td>
                                <td className="p-2">{task.priority}</td>
                                <td className="p-2">{task.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrintableTaskList;
import React from 'react';
import { Task, TaskStatus } from '../../types';
import TaskKanbanView from '../tasks/TaskKanbanView';
import { useApp } from '../../context/AppContext';

interface ProjectTaskKanbanViewProps {
    tasks: Task[];
}

const ProjectTaskKanbanView: React.FC<ProjectTaskKanbanViewProps> = ({ tasks }) => {
    const { updateTaskStatus } = useApp();

    const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
        updateTaskStatus(taskId, newStatus);
    };

    return (
        <TaskKanbanView
            tasks={tasks}
            onTaskClick={() => {}} // Detail modal will be handled by the main planner page
            onStatusChange={handleStatusChange}
        />
    );
};

export default ProjectTaskKanbanView;
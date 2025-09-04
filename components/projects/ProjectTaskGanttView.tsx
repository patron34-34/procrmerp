import React from 'react';
import { Task } from '../../types';
import TaskGanttView from '../tasks/TaskGanttView';
import { useApp } from '../../context/AppContext';

interface ProjectTaskGanttViewProps {
    tasks: Task[];
}

const ProjectTaskGanttView: React.FC<ProjectTaskGanttViewProps> = ({ tasks }) => {
    const { addTaskDependency, removeTaskDependency } = useApp();

    return (
        <TaskGanttView
            tasks={tasks}
            onTaskClick={() => {}} // Detail modal handled by main planner
            onAddTaskDependency={addTaskDependency}
            onRemoveTaskDependency={removeTaskDependency}
        />
    );
};

export default ProjectTaskGanttView;
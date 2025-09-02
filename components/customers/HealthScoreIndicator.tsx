import React from 'react';

const HealthScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score > 80) return 'bg-green-500';
        if (score > 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className={`${getColor()} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-mono text-sm w-8 text-right">{score}</span>
        </div>
    );
};

export default HealthScoreIndicator;

import React from 'react';

interface HealthScoreIndicatorProps {
  score: number;
  breakdown?: string[];
}

const HealthScoreIndicator: React.FC<HealthScoreIndicatorProps> = ({ score, breakdown }) => {
    const getColor = () => {
        if (score > 80) return 'bg-green-500';
        if (score > 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="relative group flex items-center gap-2">
            <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className={`${getColor()} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-mono text-sm w-8 text-right">{score}</span>
            
            {breakdown && breakdown.length > 0 && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <h5 className="font-bold mb-1 border-b border-slate-600 pb-1">Sağlık Skoru Dökümü</h5>
                    <ul className="space-y-0.5">
                        {breakdown.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
            )}
        </div>
    );
};

export default HealthScoreIndicator;
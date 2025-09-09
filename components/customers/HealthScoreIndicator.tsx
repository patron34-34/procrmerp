import React from 'react';

interface HealthScoreIndicatorProps {
  score: number;
  breakdown?: string[];
}

const HealthScoreIndicator: React.FC<HealthScoreIndicatorProps> = ({ score, breakdown }) => {
    const getColor = () => {
        if (score > 75) return 'bg-green-500';
        if (score > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const renderBreakdownItem = (item: string, index: number) => {
        const isPositive = item.startsWith('+');
        const isNegative = item.startsWith('-');
        const colorClass = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : '';
        const text = item.substring(item.indexOf(':') + 2); // Get text after ": "
        const value = item.substring(0, item.indexOf(':')); // Get "+X puan" part
        
        return (
            <li key={index} className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    {isPositive && <svg className={`w-3 h-3 flex-shrink-0 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>}
                    {isNegative && <svg className={`w-3 h-3 flex-shrink-0 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
                    {!isPositive && !isNegative && <span className="text-xs">•</span>}
                    <span>{text}</span>
                </div>
                <span className={`font-mono font-semibold ${colorClass}`}>{value.split(' ')[0]}</span>
            </li>
        );
    };

    return (
        <div className="relative group flex items-center gap-2">
            <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className={`${getColor()} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="font-mono text-sm w-8 text-right">{score}</span>
            
            {breakdown && breakdown.length > 0 && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <h5 className="font-bold mb-2 border-b border-slate-600 pb-1.5">Sağlık Skoru Dökümü</h5>
                    <ul className="space-y-1.5 text-left">
                        {breakdown.map(renderBreakdownItem)}
                    </ul>
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
            )}
        </div>
    );
};

export default HealthScoreIndicator;
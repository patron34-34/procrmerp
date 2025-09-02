
export const getDaysInMonth = (year: number, month: number): Date[] => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

export const getMonthYearText = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', {
        month: 'long',
        year: 'numeric'
    });
};

export const getWeekdayHeaders = (): string[] => {
    return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
}

// Get the first day of the week (Monday) for a given date
const getStartOfWeek = (date: Date): Date => {
    const dt = new Date(date);
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(dt.setDate(diff));
}

export const getCalendarGrid = (year: number, month: number): (Date | null)[][] => {
    const monthDays = getDaysInMonth(year, month);
    if(monthDays.length === 0) return [];
    
    const firstDay = monthDays[0];
    const lastDay = monthDays[monthDays.length - 1];

    const calendarStartDate = getStartOfWeek(firstDay);
    
    const grid: (Date | null)[][] = [];
    let currentDay = new Date(calendarStartDate);
    
    for (let week = 0; week < 6; week++) {
        const weekRow: (Date | null)[] = [];
        for (let day = 0; day < 7; day++) {
             // We only push a copy of the date
            weekRow.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }
        grid.push(weekRow);
        // If the next week starts in the next month after the target month, break
        if(currentDay.getMonth() !== month && currentDay > lastDay) break;
    }
    
    return grid;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const getWeekDays = (date: Date): Date[] => {
    const start = getStartOfWeek(date);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(start);
        nextDay.setDate(start.getDate() + i);
        days.push(nextDay);
    }
    return days;
};

export const getWeekRangeText = (date: Date): string => {
    const weekDays = getWeekDays(date);
    const start = weekDays[0];
    const end = weekDays[6];

    if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`;
    }
    return `${start.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
};

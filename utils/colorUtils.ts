const COLORS = [
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
];

export const getUserColor = (userId: number): string => {
  if (userId === 0) return '#64748b'; // generic/system color
  return COLORS[userId % COLORS.length];
};

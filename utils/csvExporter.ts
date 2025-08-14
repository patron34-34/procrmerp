/**
 * Converts an array of objects to a CSV string.
 * @param data The array of objects to convert.
 * @param headers Optional array of strings for custom headers.
 * @returns The CSV formatted string.
 */
function convertToCSV<T extends object>(data: T[], headers?: string[]): string {
    if (!data || data.length === 0) {
        return '';
    }
    
    const columnHeaders = headers || Object.keys(data[0]);
    
    const replacer = (key: any, value: any) => value === null ? '' : value;
    
    const csvRows = data.map(row =>
        columnHeaders.map(fieldName =>
            JSON.stringify((row as any)[fieldName], replacer)
        ).join(',')
    );

    csvRows.unshift(columnHeaders.join(','));
    
    return csvRows.join('\r\n');
}

/**
 * Triggers a browser download for a CSV file.
 * @param data The array of objects to export.
 * @param filename The desired name for the downloaded file.
 * @param headers Optional custom headers for the CSV columns.
 */
export function exportToCSV<T extends object>(data: T[], filename: string, headers?: string[]): void {
    const csvString = convertToCSV(data, headers);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function formatToStandardEuDate(date: string): string {
    // format year-month-day to day.month.year format
    let dateObj = new Date(date);
    return dateObj.toLocaleDateString('de-DE');
}
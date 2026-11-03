/**
 * Utilities for formatting dates and times in Asia/Kolkata (IST) timezone
 */

export function formatDateTimeIST(dateString: string | Date | null | undefined): { date: string; time: string; full: string } {
  if (!dateString) {
    return { date: 'N/A', time: 'N/A', full: 'N/A' };
  }

  const d = new Date(dateString);
  if (isNaN(d.getTime())) {
    return { date: 'Invalid Date', time: 'Invalid Time', full: 'Invalid Date' };
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(d);
  const formattedTime = new Intl.DateTimeFormat('en-IN', timeOptions).format(d) + ' IST';

  return {
    date: formattedDate,
    time: formattedTime,
    full: `${formattedDate} at ${formattedTime}`,
  };
}

export function formatDateOnlyIST(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

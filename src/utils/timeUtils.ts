export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${secs}s`;
}

export function formatStopwatch(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatHours(hours: number): string {
  if (!hours || hours <= 0) return '0 hrs';
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins} mins`;
  }
  const fullHrs = Math.floor(hours);
  const remMins = Math.round((hours - fullHrs) * 60);
  if (remMins === 0) return `${fullHrs} ${fullHrs === 1 ? 'hr' : 'hrs'}`;
  return `${fullHrs}h ${remMins}m`;
}

export function isDateToday(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'No deadline';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateHoursAndMinutes(milliseconds: number) {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export function calculateDuration(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  const { hours, minutes } = calculateHoursAndMinutes(diff);
  
  if (hours === 0) {
    return `${minutes}分`;
  }
  return `${hours}時間${minutes > 0 ? ` ${minutes}分` : ''}`;
}

export function calculateTotalDuration(sessions: { startTime: Date; endTime?: Date }[]): string {
  const totalMilliseconds = sessions
    .filter(session => session.endTime)
    .reduce((total, session) => {
      return total + (session.endTime!.getTime() - session.startTime.getTime());
    }, 0);

  const { hours, minutes } = calculateHoursAndMinutes(totalMilliseconds);
  
  if (hours === 0) {
    return `${minutes}分`;
  }
  return `${hours}時間${minutes > 0 ? ` ${minutes}分` : ''}`;
}
import { WorkSession } from '../types';
import { formatTime, calculateDuration, calculateTotalDuration } from './timeUtils';

export function generateWorkSessionsText(sessions: WorkSession[]): string {
  const completedSessions = sessions.filter(session => session.endTime);
  
  if (completedSessions.length === 0) {
    return '作業記録はありません。';
  }

  const totalDuration = calculateTotalDuration(sessions);
  const header = `作業記録 (合計作業時間: ${totalDuration})\n\n`;

  const lines = completedSessions
    .map(session => {
      const duration = calculateDuration(session.startTime, session.endTime!);
      
      return [
        `作業: ${session.title}`,
        `開始: ${formatTime(session.startTime)}`,
        `終了: ${formatTime(session.endTime!)}`,
        `作業時間: ${duration}`,
        `\n`
      ].join('\n');
    });

  return header + lines.join('\n');
}

export function downloadWorkSessions(sessions: WorkSession[]) {
  const text = generateWorkSessionsText(sessions);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `作業記録_${new Date().toLocaleDateString('ja-JP')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
import { useState, useEffect } from 'react';
import { WorkSession } from '../types';
import { setCookie, getCookie } from '../utils/cookieUtils';

export function useWorkSessions() {
  const [sessions, setSessions] = useState<WorkSession[]>(() => {
    const savedSessions = getCookie('workSessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      return parsed.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined
      }));
    }
    return [];
  });

  useEffect(() => {
    setCookie('workSessions', JSON.stringify(sessions), 1);
  }, [sessions]);

  return [sessions, setSessions] as const;
}
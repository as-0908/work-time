import React, { useState } from 'react';
import { Timer, StopCircle, Trash2, Download } from 'lucide-react';
import { WorkSession, WorkSessionDisplay } from '../types';
import { formatTime, calculateDuration, calculateTotalDuration } from '../utils/timeUtils';
import { downloadWorkSessions } from '../utils/exportUtils';
import { useWorkSessions } from '../hooks/useWorkSessions';

export default function WorkTimer() {
  const [title, setTitle] = useState('');
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [sessions, setSessions] = useWorkSessions();

  const startWork = () => {
    if (!title.trim()) return;
    
    const newSession: WorkSession = {
      id: crypto.randomUUID(),
      title: title.trim(),
      startTime: new Date(),
    };
    
    setCurrentSession(newSession);
    setSessions(prev => [newSession, ...prev]);
  };

  const stopWork = () => {
    if (!currentSession) return;
    
    const endedSession: WorkSession = {
      ...currentSession,
      endTime: new Date(),
    };
    
    setSessions(prev =>
      prev.map(session =>
        session.id === currentSession.id ? endedSession : session
      )
    );
    setCurrentSession(null);
    setTitle('');
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const getDisplaySessions = (): WorkSessionDisplay[] => {
    return sessions.map(session => ({
      ...session,
      isActive: session.id === currentSession?.id,
      duration: session.endTime
        ? calculateDuration(session.startTime, session.endTime)
        : '作業中'
    }));
  };

  const totalDuration = calculateTotalDuration(sessions);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">作業時間管理</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="作業タイトルを入力"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!currentSession}
            />
            {!currentSession ? (
              <button
                onClick={startWork}
                disabled={!title.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Timer size={20} />
                開始
              </button>
            ) : (
              <button
                onClick={stopWork}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <StopCircle size={20} />
                終了
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">作業履歴</h2>
              <p className="text-gray-600 mt-2">
                合計作業時間: <span className="font-medium">{totalDuration}</span>
              </p>
            </div>
            <button
              onClick={() => downloadWorkSessions(sessions)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              title="作業履歴をダウンロード"
            >
              <Download size={20} />
              ダウンロード
            </button>
          </div>
          <div className="divide-y">
            {getDisplaySessions().map(session => (
              <div
                key={session.id}
                className={`p-6 flex items-center justify-between ${
                  session.isActive ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-900">
                    {session.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {formatTime(session.startTime)}
                    {session.endTime && ` 〜 ${formatTime(session.endTime)}`}
                    <span className="ml-4 font-medium">
                      {session.duration}
                    </span>
                  </p>
                </div>
                {!session.isActive && (
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-gray-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                作業履歴はありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
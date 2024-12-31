export interface WorkSession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
}

export interface WorkSessionDisplay extends WorkSession {
  isActive: boolean;
  duration: string;
}
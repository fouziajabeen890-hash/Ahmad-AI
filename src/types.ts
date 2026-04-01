export interface Lecture {
  id: string;
  title: string;
  videoId: string;
  startTime: number;
  endTime: number;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

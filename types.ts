export interface User {
  id: number;
  name: string;
  email: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  avatarColor: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  template: string;
  solution?: string;
  check?: (output: string) => boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

export interface Stat {
  label: string;
  value: string | number;
  icon: string;
}

export type Language = 'pt' | 'en';

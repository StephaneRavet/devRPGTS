export interface Quest {
  id?: number;
  name: string;
  description?: string;
  xp: number;
}

export interface User {
  username: string;
  level: number;
  xp: number;
} 
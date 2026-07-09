export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  status?: TaskStatus;
}

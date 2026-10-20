export interface Payment {
  id: string;
  client: string;
  concept: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}
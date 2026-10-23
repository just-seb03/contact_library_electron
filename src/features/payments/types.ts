export interface Payment {
  id: string;
  client: string;
  clientId?: number;
  concept: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}
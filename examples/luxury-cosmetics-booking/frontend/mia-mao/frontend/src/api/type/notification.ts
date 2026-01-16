export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  readAt: string | null;
  read: boolean;
  reference?: string;
}

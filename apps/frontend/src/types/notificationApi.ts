export interface NotificationAPI {
  id: number;
  type: 'like' | 'comment' | 'reply' | 'comment_like';
  from_user_id: number;
  from_user: string;
  from_picture: string | null;
  post_id: number | null;
  post_title: string | null;
  is_read: boolean;
  created_at: string;
}
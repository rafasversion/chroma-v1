export interface PhotoAPI {
  id: number;
  author: string;
  title: string;
  content: string;
  src: string;
  date: string;
  acessos: string;
  total_likes: number;
  total_comments: string;
  user_liked: boolean;
  is_video?: boolean;
  dominant_color?: string;
}
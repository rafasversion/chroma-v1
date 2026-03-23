export interface PostAPI {
  id: number;
  author: string;
  author_id?: number;
  author_picture?: string | null;
  title: string;
  description: string;
  file_url: string;
  date: string;
  access_number: number;
  total_likes: number;
  total_comments: number;
  user_liked: boolean;
  is_video?: boolean;
  dominant_color?: string | null;
}

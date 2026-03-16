export interface UserLikedPostAPI {
  id: number;
  author: string;
  title: string;
  date: string;
  src: string;
  content: string;
  acessos: string;
  total_comments: string;
  total_likes: number;
  user_liked: boolean;
}
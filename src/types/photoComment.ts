export interface PhotoComment {
  id: number;
  postId: string;
  author: string;
  date: string;
  content: string;
  type: string;
  userId: number;
}
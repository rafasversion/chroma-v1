export interface UserLikedPost {
  id: number;
  author: string;
  title: string;
  date: Date;
  src: string;
  content: string;
  acessos: number;
  totalComments: number;
  totalLikes: number;
  userLiked: boolean;
}
export interface PostCommentAPI {
  comment_id: number;
  comment_author: string;
  comment_content: string;
  comment_date: string;
  user_id: number;
  user_picture: string;
  total_likes: number;
  user_liked_comment?: boolean;
  replies: PostCommentAPI[];
}
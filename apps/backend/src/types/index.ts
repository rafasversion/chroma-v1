import { Request } from 'express';
export interface JWTPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  userPicture: string | null;
  googleUser: boolean;
}

export interface PhotoData {
  id: number;
  author: string;
  title: string;
  date: string;
  src: string | null;
  isVideo: boolean;
  content: string;
  access: number;
  totalComments: number;
  totalLikes: number;
  userLiked: boolean;
  dominantColor: string | null;
}

export interface CommentData {
  commentId: number;
  commentAuthor: string;
  commentContent: string;
  commentDate: string;
  userId: number;
  userPicture: string | null;
}
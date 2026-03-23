export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  user_picture?: string | null;
}
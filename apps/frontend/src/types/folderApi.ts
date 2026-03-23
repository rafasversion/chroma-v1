import type { PostAPI } from './postApi';

export interface FolderAPI {
  id: number;
  title: string;
  description?: string;
  cover_url: string | null;
  is_private: boolean;
  total_items: number;
  author?: string;
  created_at?: string;
  posts?: PostAPI[];
}
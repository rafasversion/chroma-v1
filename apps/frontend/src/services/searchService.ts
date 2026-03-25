import { fetchApi } from './api';

interface PostResult {
  id: number;
  title: string;
  src: string | null;
  is_video: boolean;
  author: string;
}

interface UserResult {
  id: number;
  username: string;
  name: string;
  picture: string | null;
}

interface SearchResult {
  posts: PostResult[];
  users: UserResult[];
}

export const searchService = async (q: string) => {
  return await fetchApi<SearchResult>(`/api/search?q=${encodeURIComponent(q)}`);
};
export interface Photo {
  id: number,
  author: string,
  title: string,
  content: string,
  src: string,
  date: Date,
  acessos: number,
  total_likes: number,
  total_comments: number,
  user_liked: boolean
}
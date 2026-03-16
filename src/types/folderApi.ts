import type { PhotoAPI } from "./photoApi";

export interface FolderAPI {
  capa: string;
  id: number;
  privada: boolean;
  titulo: string;
  descricao?: string;
  total: number;
  author?: string;
  posts?: PhotoAPI[];
}
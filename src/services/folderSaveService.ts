import { fecthApi } from './api.ts';

export interface PastaSaveResponse {
  message: string;
  total_fotos: number;
}

export const savePhotoToFolderService = async (photoId: number, pastaId: number) => {
  const url = `http://chroma-api.test/json/api/pasta/save`;
  const token = window.localStorage.getItem("token");

  return await fecthApi<PastaSaveResponse>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      photo_id: photoId,
      pasta_id: pastaId,
    }),
  });
};
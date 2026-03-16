import { fecthApi } from './api.ts';

export const removePhotoFromFolderService = async (photoId: number, pastaId: number) => {
  const token = window.localStorage.getItem("token");
  return await fecthApi<{ message: string; total_fotos: number }>(
    `http://chroma-api.test/json/api/pasta/remove`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ photo_id: photoId, pasta_id: pastaId }),
    }
  );
};
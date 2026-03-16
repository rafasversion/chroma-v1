import type { PhotoAPI } from "../types/photoApi";
import { fecthApi } from "./api";


export const updatePhotoService = async (id: number, formData: FormData) => {
  const token = window.localStorage.getItem("token");
  const url = `http://chroma-api.test/json/api/photo/update/${id}`;

  const jsonData = Object.fromEntries(formData)
  const data = await fecthApi<PhotoAPI>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jsonData)
  });
  return data;
};
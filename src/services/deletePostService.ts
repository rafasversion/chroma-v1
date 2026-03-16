export async function deletePostService(id: string, options: any) {
  const response = await fetch(`http://chroma-api.test/json/api/photo/${id}`, {
    method: "DELETE",
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao deletar photo");
  }

  return await response.json();
}
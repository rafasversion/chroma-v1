

export async function deleteFolderService(id: string, options: any) {
  const response = await fetch(`http://chroma-api.test/json/api/folder/${id}`, {
    method: "DELETE",
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao deletar pasta");
  }

  return await response.json();
}
export const fecthApi = async <T>(url: string, options?: RequestInit): Promise<T | null> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Erro" + response.status);
    const json = await response.json();
    return json as T;
  } catch (error) {
    if (error instanceof Error) console.error("Erro Fectch" + error.message);
    return null;
  }
}
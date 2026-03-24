const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T | null> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) console.error('fetchApi error:', error.message);
    return null;
  }
};

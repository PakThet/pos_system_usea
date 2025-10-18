import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class BaseApiService {
  protected async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
  const text = await response.text();
  throw new Error(`API error ${response.status} at ${API_BASE_URL}${endpoint}: ${text}`);
}


    return response.json();
  }
}

export default BaseApiService;
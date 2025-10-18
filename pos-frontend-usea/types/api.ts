export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
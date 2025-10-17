export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

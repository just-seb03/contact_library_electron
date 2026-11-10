export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: 'NOT_FOUND' | 'VALIDATION' | 'SQLITE_ERROR' | 'STORAGE_ERROR' }

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}


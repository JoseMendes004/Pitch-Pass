export interface ApiResponse<T> {
    data: T;
    message?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
}
//# sourceMappingURL=api.types.d.ts.map
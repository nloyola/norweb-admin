export interface PaginatedResponse<T> {
    total: number;
    next: string;
    prev: string;
    results: T[];
}

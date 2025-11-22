/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> {
    success: true;
    data: T[];
    pagination: PaginationMeta;
    message?: string;
}

/**
 * Create a success response
 */
export const successResponse = <T>(data: T, message?: string): SuccessResponse<T> => {
    return {
        success: true,
        data,
        ...(message && { message }),
    };
};

/**
 * Create a paginated response
 */
export const paginatedResponse = <T>(
    data: T[],
    page: number,
    limit: number,
    totalItems: number,
    message?: string
): PaginatedResponse<T> => {
    return {
        success: true,
        data,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
        },
        ...(message && { message }),
    };
};

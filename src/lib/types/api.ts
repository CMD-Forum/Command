export type ErrorResponse = { error?: string | null };
export interface APIResponse<T> extends ErrorResponse {
    data: T | null;
}
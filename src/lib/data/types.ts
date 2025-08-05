export type StandardDataResponse<T> = {
    response: T | null;
    error: string | null;
    status: number;
}
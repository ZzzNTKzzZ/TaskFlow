export interface ResponseApi<T> {
    data: T | null;
    success: boolean
}
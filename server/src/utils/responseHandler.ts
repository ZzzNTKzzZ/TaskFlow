type ApiResponse<T> = {
    success: true | false,
    data? : T,
    message?: string
}

export class responseHandler {
    static success<T>(data: T): ApiResponse<T> {
        return {
            success: true,
            data,
        }
    }
    static error(message: string): ApiResponse<null> {
        return {
            success: false,
            message
        }
    }
}
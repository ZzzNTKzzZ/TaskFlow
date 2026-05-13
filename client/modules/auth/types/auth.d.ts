export interface LoginData {
    email: string,
    password: string,
}

interface SignUpData {
    name: string,
    email: string,
    password: string
}

interface LoginResponse {
    user: User
    accessToken: string
    refreshToken: string
    success: boolean
    errMsg?: string
}

interface User {
    id: string,
    name: string,
    email: string,
    workspaceStats: {
        workspaceCount: number
    } 
}
import api from "./api"

export const loginApi = async (email:string, password: string) => {
    try {
        const response = await api.post("/auth/login", { email, password})
        return response.data
    } catch (error: any) {
    console.error("Login API Error:", error.response?.data || error.message);
    
    throw error.response?.data || error;
  }
}

export const registerApi = async(name: string, email:string, password: string) => {
    try {
        const response = await api.post("/auth/register", {name ,email, password})
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const refreshTokenApi = async (refreshToken: string) => {
    try {
        const response = await api.post("/refresh-token", {refreshToken})
        return response.data
    } catch (error) {
        console.log(error)
    }
}
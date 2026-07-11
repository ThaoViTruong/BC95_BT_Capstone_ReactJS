
import axios from 'axios'

const USER_STORAGE_KEY = "user"

const axiosInstance = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn/api",

    headers: {
        TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5NSIsIkhldEhhblN0cmluZyI6IjA2LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjUxNTIwMDAwMCIsIm5iZiI6MTc2ODQ5NjQwMCwiZXhwIjoxNzk2NjYyODAwfQ.GBx8YXuQEqPaUXMDOr0_pUGzusJf-6qUINIgi5L8LPw"
    }
})

axiosInstance.interceptors.request.use((config) => {
    localStorage.removeItem(USER_STORAGE_KEY)

    const user = sessionStorage.getItem(USER_STORAGE_KEY)

    if (user) {
        try {
            const { accessToken } = JSON.parse(user)

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`
            }
        } catch {
            sessionStorage.removeItem(USER_STORAGE_KEY)
        }
    }

    return config
})

export default axiosInstance

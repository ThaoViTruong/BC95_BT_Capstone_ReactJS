
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn/api",

    // thêm headers chung
    headers: {
        TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5NSIsIkhldEhhblN0cmluZyI6IjA2LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjUxNTIwMDAwMCIsIm5iZiI6MTc2ODQ5NjQwMCwiZXhwIjoxNzk2NjYyODAwfQ.GBx8YXuQEqPaUXMDOr0_pUGzusJf-6qUINIgi5L8LPw"
    }
})

axiosInstance.interceptors.request.use((config) => {
    const user = localStorage.getItem("user")
    console.log("user: ", user)

    if (user) {
        const { accessToken } = JSON.parse(user)
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

export default axiosInstance
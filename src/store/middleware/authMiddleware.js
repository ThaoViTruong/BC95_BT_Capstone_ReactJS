
const USER_STORAGE_KEY = "user"

export const authMiddleware = () => (next) => (action) => {
    const { type, payload } = action
    switch (type) {
        case "auth/login":
            localStorage.removeItem(USER_STORAGE_KEY)
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload))
            break
        case "auth/logout":
            localStorage.removeItem(USER_STORAGE_KEY)
            sessionStorage.removeItem(USER_STORAGE_KEY)
            break
        default:
            break
    }
    next(action) 
}

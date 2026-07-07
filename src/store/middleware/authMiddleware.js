
export const authMiddleware = () => (next) => (action) => {
    const { type, payload } = action
    switch (type) {
        case "auth/login":
            localStorage.setItem("user", JSON.stringify(payload))
            break
        case "auth/logout":
            localStorage.removeItem("user")
            break
        default:
            break
    }
    next(action) 
}

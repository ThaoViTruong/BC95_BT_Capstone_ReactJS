import { createSlice } from "@reduxjs/toolkit"

const getStoredUser = () => {
    const rawUser = localStorage.getItem("user")

    if (!rawUser) {
        return null
    }

    try {
        return JSON.parse(rawUser)
    } catch {
        localStorage.removeItem("user")
        return null
    }
}

const storedUser = getStoredUser()

const initialState = {
    user: storedUser,
    isLoggedIn: storedUser !== null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.user = null
            state.isLoggedIn = false
        }
    }
})

export const { login, logout } = authSlice.actions

export const selectorIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectorUser = (state) => state.auth.user

export default authSlice.reducer

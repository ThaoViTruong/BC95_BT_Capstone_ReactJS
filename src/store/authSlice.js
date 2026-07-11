import { createSlice } from "@reduxjs/toolkit"

const USER_STORAGE_KEY = "user"

const clearLegacyUserStorage = () => {
    localStorage.removeItem(USER_STORAGE_KEY)
}

const getStoredUser = () => {
    clearLegacyUserStorage()

    const rawUser = sessionStorage.getItem(USER_STORAGE_KEY)

    if (!rawUser) {
        return null
    }

    try {
        return JSON.parse(rawUser)
    } catch {
        sessionStorage.removeItem(USER_STORAGE_KEY)
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

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../api/userApi"

const USER_GROUP_CODES = ['GP00', 'GP01']

const fetchUsersByGroups = async () => {
    const responses = await Promise.all(
        USER_GROUP_CODES.map((groupCode) => userApi.getUserList(groupCode))
    )

    return responses.flatMap((response) => response.data.content || [])
}

const mergeUsersByAccount = (users) => {
    const mergedUsersMap = new Map()

    users.forEach((user) => {
        if (user?.taiKhoan) {
            mergedUsersMap.set(user.taiKhoan, user)
        }
    })

    return Array.from(mergedUsersMap.values())
}

const sortUsersByAccount = (users) => {
    return [...users].sort((userA, userB) =>
        (userA.taiKhoan || '').localeCompare(userB.taiKhoan || '')
    )
}

const normalizeUserKeyword = (keyword = '') => {
    return keyword.trim().toLowerCase()
}

const filterUsersByKeyword = (users, keyword) => {
    if (!keyword) {
        return users
    }

    return users.filter((user) =>
        [user.taiKhoan, user.hoTen, user.email, user.soDT, user.maLoaiNguoiDung]
            .some((value) => String(value || '').toLowerCase().includes(keyword))
    )
}

const paginateUsers = (users, currentPage, pageSize) => {
    const totalCount = users.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const safePage = Math.min(Math.max(currentPage, 1), totalPages)
    const startIndex = (safePage - 1) * pageSize

    return {
        currentPage: safePage,
        count: pageSize,
        totalPages,
        totalCount,
        items: users.slice(startIndex, startIndex + pageSize),
    }
}

export const useProfile = (isLoggedIn) => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await userApi.getProfile()
            return response.data.content
        },
        enabled: isLoggedIn, 
        refetchOnMount: 'always', 
    })
}

export const useUsers = (soTrang = 1, soPhanTuTrenTrang = 10, tuKhoa = '') => {
    return useQuery({
        queryKey: ['users', soTrang, soPhanTuTrenTrang, tuKhoa],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const fetchedUsers = await fetchUsersByGroups()
            const mergedUsers = mergeUsersByAccount(fetchedUsers)
            const sortedUsers = sortUsersByAccount(mergedUsers)
            const normalizedKeyword = normalizeUserKeyword(tuKhoa)
            const filteredUsers = filterUsersByKeyword(sortedUsers, normalizedKeyword)

            return paginateUsers(filteredUsers, soTrang, soPhanTuTrenTrang)
        }
    })
}

export const useAddUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userData) => userApi.addUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']})
        }
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userData) => userApi.updateUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (taiKhoan) => userApi.deleteUser(taiKhoan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

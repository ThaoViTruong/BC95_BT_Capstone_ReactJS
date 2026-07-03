import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../api/userApi"

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
            const [gp00Response, gp01Response] = await Promise.all([
                userApi.getUserList('GP00'),
                userApi.getUserList('GP01')
            ])

            const mergedUsersMap = new Map()

            ;[...(gp00Response.data.content || []), ...(gp01Response.data.content || [])].forEach((user) => {
                if (user?.taiKhoan) {
                    mergedUsersMap.set(user.taiKhoan, user)
                }
            })

            const normalizedKeyword = tuKhoa.trim().toLowerCase()
            const mergedUsers = Array.from(mergedUsersMap.values()).sort((userA, userB) =>
                (userA.taiKhoan || '').localeCompare(userB.taiKhoan || '')
            )

            const filteredUsers = normalizedKeyword
                ? mergedUsers.filter((user) =>
                    [user.taiKhoan, user.hoTen, user.email, user.soDT, user.maLoaiNguoiDung]
                        .some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
                )
                : mergedUsers

            const totalCount = filteredUsers.length
            const totalPages = Math.max(1, Math.ceil(totalCount / soPhanTuTrenTrang))
            const safePage = Math.min(Math.max(soTrang, 1), totalPages)
            const startIndex = (safePage - 1) * soPhanTuTrenTrang

            return {
                currentPage: safePage,
                count: soPhanTuTrenTrang,
                totalPages,
                totalCount,
                items: filteredUsers.slice(startIndex, startIndex + soPhanTuTrenTrang),
            }
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

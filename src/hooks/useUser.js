import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useUsers = (soTrang = 1, soPhanTuTrenTrang = 10) => {
    return useQuery({
        queryKey: ['users', soTrang, soPhanTuTrenTrang],
        queryFn: async () => {
            const response = await userApi.getUserListPhanTrang('GP01', soTrang, soPhanTuTrenTrang)
            return response.data.content 
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
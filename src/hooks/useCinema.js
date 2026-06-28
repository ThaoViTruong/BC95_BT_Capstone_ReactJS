import { useQuery } from "@tanstack/react-query"
import { cinemaApi } from "../api/cinemaApi"

export const useHeThongRap = () => {
    return useQuery({
        queryKey: ['heThongRap'],
        queryFn: async () => {
            const response = await cinemaApi.getHeThongRap()
            return response.data.content
        }
    })
}

export const useCumRapTheoHeThong = (maHeThongRap) => {
    return useQuery({
        queryKey: ['cumRapTheoHeThong', maHeThongRap],
        queryFn: async () => {
            const response = await cinemaApi.getCumRapTheoHeThong(maHeThongRap)
            return response.data.content
        },
        enabled: maHeThongRap !== undefined && maHeThongRap !== null && maHeThongRap !== ""
    })
}
import { useQuery } from "@tanstack/react-query"
import { movieApi } from "../api/movieApi"

export const useMovieList = (maNhom = 'GP01', soTrang = 1, soPhanTuTrenTrang = 10, tenPhim = '') => {
    return useQuery({
        queryKey: ['movieList', maNhom, soTrang, soPhanTuTrenTrang, tenPhim],
        queryFn: async () => {
            const response = await movieApi.getMovieList(maNhom, soTrang, soPhanTuTrenTrang, tenPhim)
            return response.data.content
        }
    })
}

export const useMovieDetail = (maPhim) => {
    return useQuery({
        queryKey: ['movieDetail', maPhim],
        queryFn: async () => {
            const response = await movieApi.getMovieDetail(maPhim)
            return response.data.content
        },
        enabled: maPhim !== undefined && maPhim !== null && maPhim !== ""
    })
}

export const useMovieShowtimes = (maPhim) => {
    return useQuery({
        queryKey: ['movieShowtimes', maPhim],
        queryFn: async () => {
            const response = await movieApi.getMovieShowtimes(maPhim)
            return response.data.content
        },
        enabled: !!maPhim
    })
}
// custom hook để lấy danh sách phim

import { useQuery } from "@tanstack/react-query"
import { movieApi } from "../api/movieApi"

export const useMovieList = (maNhom = 'GP01') => {
    return useQuery({
        queryKey: ['movieList', maNhom],
        queryFn: async () => {
            const response = await movieApi.getMovieList(maNhom)
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


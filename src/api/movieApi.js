import axiosInstance from "./axiosInstance"

export const movieApi = {

    getMovieList: (maNhom = 'GP01') => {
        return axiosInstance.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`)
    },

    getMovieDetail: (maPhim) => {
        return axiosInstance.get(`/QuanLyPhim/LayThongTinPhim?maPhim=${maPhim}`)
    },

    getBanners: () => {
        return axiosInstance.get('/QuanLyPhim/LayDanhSachBanner')
    }
}
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
    },

    addMovie: (formData) => {
        return axiosInstance.post('/QuanLyPhim/ThemPhimUploadHinh', formData)
    },

    updateMovieInfo: (movieData) => {
        return axiosInstance.post('/QuanLyPhim/CapNhatPhim', movieData)
    },

    deleteMovie: (maPhim) => {
        return axiosInstance.delete('/QuanLyPhim/XoaPhim', {
            params: {
                MaPhim: Number(maPhim),
            }
        })
    },

    updateMovie: (formData) => {
        return axiosInstance.post('/QuanLyPhim/CapNhatPhimUpload', formData)
    }
}

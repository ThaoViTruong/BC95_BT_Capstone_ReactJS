import axiosInstance from "./axiosInstance"

export const cinemaApi = {
    getHeThongRap: () => {
        return axiosInstance.get('/QuanLyRap/LayThongTinHeThongRap')
    },
    getCumRapTheoHeThong: (maHeThongRap) => {
        return axiosInstance.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`)
    },
    createShowtime: (showtimeData) => {
        return axiosInstance.post('/QuanLyDatVe/TaoLichChieu', showtimeData)
    }
}

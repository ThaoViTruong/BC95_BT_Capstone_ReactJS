import axiosInstance from "./axiosInstance"

export const cinemaApi = {
    getHeThongRap: () => {
        return axiosInstance.get('/QuanLyRap/LayThongTinHeThongRap')
    },
    getCumRapTheoHeThong: (maHeThongRap) => {
        return axiosInstance.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`)
    },
    getLichChieuHeThongRap: (maHeThongRap) => {
        return axiosInstance.get(
            `/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=GP01`
        )
    }
}

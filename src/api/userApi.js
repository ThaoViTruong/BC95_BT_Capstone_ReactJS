import axiosInstance from "./axiosInstance"

export const userApi = {
    getUserList: (maNhom) => {
        const queryParams = new URLSearchParams()

        if (maNhom?.trim()) {
            queryParams.set('MaNhom', maNhom.trim())
        }

        const queryString = queryParams.toString()

        return axiosInstance.get(
            queryString
                ? `/QuanLyNguoiDung/LayDanhSachNguoiDung?${queryString}`
                : '/QuanLyNguoiDung/LayDanhSachNguoiDung'
        )
    },
    getUserListPhanTrang: (maNhom = 'GP01', soTrang = 1, soPhanTuTrenTrang = 10, tuKhoa = '') => {
        const queryParams = new URLSearchParams({
            MaNhom: maNhom,
            soTrang: String(soTrang),
            soPhanTuTrenTrang: String(soPhanTuTrenTrang),
        })

        if (tuKhoa.trim()) {
            queryParams.set('tuKhoa', tuKhoa.trim())
        }

        return axiosInstance.get(`/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang?${queryParams.toString()}`)
    },
    getProfile: () => {
        return axiosInstance.post('/QuanLyNguoiDung/ThongTinTaiKhoan')
    },
    addUser: (userData) => {
        return axiosInstance.post('/QuanLyNguoiDung/ThemNguoiDung', userData)
    },
    updateUser: (userData) => {
        return axiosInstance.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', userData)
    },
    deleteUser: (taiKhoan) => {
        return axiosInstance.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${encodeURIComponent(taiKhoan)}`)
    },
}

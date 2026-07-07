// src/api/bookingApi.js
import axiosInstance from "./axiosInstance";

export const bookingApi = {
  /**
   * Lấy danh sách phòng vé (sơ đồ ghế) theo mã lịch chiếu
   * @param {string|number} maLichChieu
   * @returns {Promise<{ thongTinPhim: object, danhSachGhe: array }>}
   */
  getSeatList: async (maLichChieu) => {
    const res = await axiosInstance.get(
      `/QuanLyDatVe/LayDanhSachPhongVe`,
      {
        params: { MaLichChieu: maLichChieu },
      }
    );
    
    return res.data.content;
  },

  /**
   * Đặt vé
   * @param {Object} payload
   * @param {number} payload.maLichChieu
   * @param {Array<{ maGhe: number, giaVe: number }>} payload.danhSachVe
   * @returns {Promise<string>} 
   */
  datVe: async (payload) => {
    const res = await axiosInstance.post("/QuanLyDatVe/DatVe", payload);
    return res.data.content;
  },
};
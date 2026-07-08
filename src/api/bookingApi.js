import axiosInstance from "./axiosInstance";

export const bookingApi = {
  /**
   * @param {string|number} maLichChieu
   * @returns {Promise<{ thongTinPhim: object, danhSachGhe: array }>}
   */
  getSeatList: async (maLichChieu) => {
    const res = await axiosInstance.get(`/QuanLyDatVe/LayDanhSachPhongVe`, {
      params: { MaLichChieu: maLichChieu },
    });

    return res.data.content;
  },

  /**
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

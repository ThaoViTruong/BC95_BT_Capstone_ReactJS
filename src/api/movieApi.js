import axiosInstance from "./axiosInstance";

export const movieApi = {
  getMovieList: (
    maNhom = "GP01",
    soTrang = 1,
    soPhanTuTrenTrang = 10,
    tenPhim = "",
  ) => {
    const params = {
      maNhom,
      soTrang,
      soPhanTuTrenTrang,
    };

    if (tenPhim && tenPhim.trim() !== "") {
      params.tenPhim = tenPhim;
    }

    return axiosInstance.get("/QuanLyPhim/LayDanhSachPhimPhanTrang", {
      params,
    });
  },

  getMovieDetail: (maPhim) => {
    return axiosInstance.get(`/QuanLyPhim/LayThongTinPhim?maPhim=${maPhim}`);
  },
  getMovieListByDate: (
    maNhom = "GP01",
    soTrang = 1,
    soPhanTuTrenTrang = 10,
    tenPhim = "",
    tuNgay = "",
    denNgay = "",
  ) => {
    const params = {
      maNhom,
      soTrang,
      soPhanTuTrenTrang,
    };

    if (tenPhim && tenPhim.trim() !== "") params.tenPhim = tenPhim;
    if (tuNgay) params.tuNgay = tuNgay; // format: DD/MM/YYYY
    if (denNgay) params.denNgay = denNgay;

    return axiosInstance.get("/QuanLyPhim/LayDanhSachPhimTheoNgay", { params });
  },
  getMovieShowtimes: (maPhim) => {
    return axiosInstance.get(
      `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`,
    );
  },

  getBanners: () => {
    return axiosInstance.get("/QuanLyPhim/LayDanhSachBanner");
  },

  addMovie: (formData) => {
    return axiosInstance.post("/QuanLyPhim/ThemPhimUploadHinh", formData);
  },

  updateMovieInfo: (movieData) => {
    return axiosInstance.post("/QuanLyPhim/CapNhatPhim", movieData);
  },

  deleteMovie: (maPhim) => {
    return axiosInstance.delete("/QuanLyPhim/XoaPhim", {
      params: {
        MaPhim: Number(maPhim),
      },
    });
  },

  updateMovie: (formData) => {
    return axiosInstance.post("/QuanLyPhim/CapNhatPhimUpload", formData);
  },
};

// src/components/Cinema.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHeThongRap, useLichChieuHeThongRap } from "../hooks/useCinema";
import LoadingSpinner from "./LoadingSpinner";

// ===== HÀM FORMAT =====
const formatTimeOnly = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatDateOnly = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price || 0) + " đ";
};

const Cinema = () => {
  const [selectedCinema, setSelectedCinema] = useState("BHDStar");
  const [selectedCumRap, setSelectedCumRap] = useState(null);

  const { data: listHeThongRap, isLoading: isLoadingHeThongRap } =
    useHeThongRap();

  const { data: lichChieuData, isLoading: isLoadingLichChieu } =
    useLichChieuHeThongRap(selectedCinema);

  const handleSelectCinema = (maHeThongRap) => {
    setSelectedCinema(maHeThongRap);
    setSelectedCumRap(null);
  };

  const renderSelectedCinema = listHeThongRap?.find(
    (h) => h.maHeThongRap === selectedCinema,
  );

  const danhSachCumRap = lichChieuData?.[0]?.lstCumRap || [];

  const currentCumRap =
    danhSachCumRap.find((c) => c.maCumRap === selectedCumRap) ||
    danhSachCumRap[0];

  return (
    <div>
      {/* Tiêu đề section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Lịch chiếu theo <span className="text-yellow-400">Rạp</span>
        </h2>
        <p className="text-gray-400">
          Chọn chuỗi rạp và cụm rạp để xem lịch chiếu
        </p>
      </div>

      {isLoadingHeThongRap && <LoadingSpinner />}

      <div className="flex flex-col md:flex-row gap-6">
        {/* CỘT 1: HỆ THỐNG RẠP */}
        <div className="md:w-64 flex-shrink-0">
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-medium">
            Chuỗi rạp
          </h3>
          <div className="space-y-2">
            {listHeThongRap?.map((heThongRap) => (
              <button
                key={heThongRap.maHeThongRap}
                onClick={() => handleSelectCinema(heThongRap.maHeThongRap)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCinema === heThongRap.maHeThongRap
                    ? "bg-yellow-400/10 border border-yellow-400 text-yellow-400"
                    : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <img
                  src={heThongRap.logo}
                  alt={heThongRap.tenHeThongRap}
                  className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/40x40/fff/000?text=Logo";
                  }}
                />
                <span className="font-medium text-sm text-left">
                  {heThongRap.tenHeThongRap}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CỘT 2+3: CỤM RẠP & LỊCH CHIẾU */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={renderSelectedCinema?.logo}
              alt={renderSelectedCinema?.tenHeThongRap}
              className="w-12 h-12 object-contain bg-white rounded-xl p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/40x40/fff/000?text=Logo";
              }}
            />
            <h3 className="text-2xl font-bold text-yellow-400">
              {renderSelectedCinema?.tenHeThongRap}
            </h3>
          </div>

          {isLoadingLichChieu && <LoadingSpinner />}

          {!isLoadingLichChieu && danhSachCumRap.length > 0 && (
            <div className="grid grid-cols-12 gap-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* DANH SÁCH CỤM RẠP */}
              <div className="col-span-12 md:col-span-5 border-r border-gray-800 max-h-[700px] overflow-y-auto">
                {danhSachCumRap.map((cumRap) => (
                  <button
                    key={cumRap.maCumRap}
                    onClick={() => setSelectedCumRap(cumRap.maCumRap)}
                    className={`w-full text-left p-4 border-b border-gray-800 transition ${
                      currentCumRap?.maCumRap === cumRap.maCumRap
                        ? "bg-gray-800 border-l-4 border-l-yellow-400"
                        : "hover:bg-gray-800/60 border-l-4 border-l-transparent"
                    }`}
                  >
                    <p className="text-yellow-400 font-semibold text-sm mb-1 line-clamp-1">
                      {cumRap.tenCumRap}
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-1">
                      📍 {cumRap.diaChi}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {cumRap.danhSachPhim?.length || 0} phim đang chiếu
                    </p>
                  </button>
                ))}
              </div>

              {/* DANH SÁCH PHIM + SUẤT CHIẾU */}
              <div className="col-span-12 md:col-span-7 max-h-[700px] overflow-y-auto">
                {currentCumRap?.danhSachPhim?.length ? (
                  currentCumRap.danhSachPhim.map((phim) => (
                    <div
                      key={phim.maPhim}
                      className="p-4 border-b border-gray-800 flex gap-3"
                    >
                      <Link
                        to={`/movie/${phim.maPhim}`}
                        className="flex-shrink-0 block"
                      >
                        <img
                          src={phim.hinhAnh}
                          alt={phim.tenPhim}
                          className="w-16 h-24 object-cover rounded-lg hover:opacity-80 transition"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/64x96/1f2937/facc15?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${phim.maPhim}`}>
                          <h4 className="font-bold text-white mb-2 line-clamp-1 hover:text-yellow-400 transition">
                            {phim.tenPhim}
                          </h4>
                        </Link>

                        <p className="text-gray-500 text-xs mb-2">
                          Bấm vào giờ chiếu để đặt vé
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {phim.lstLichChieuTheoPhim
                            ?.slice(0, 12)
                            .map((lich) => (
                              <Link
                                key={lich.maLichChieu}
                                to={`/booking/${lich.maLichChieu}`}
                                className="group bg-gray-800 hover:bg-yellow-400 text-gray-200 hover:text-black text-xs px-3 py-2 rounded-lg transition border border-gray-700 hover:border-yellow-400"
                                title={`Giá: ${formatPrice(lich.giaVe)}`}
                              >
                                <div className="font-bold">
                                  {formatTimeOnly(lich.ngayChieuGioChieu)}
                                </div>
                                <div className="text-[10px] text-gray-500 group-hover:text-gray-800">
                                  {formatDateOnly(lich.ngayChieuGioChieu)}
                                </div>
                              </Link>
                            ))}
                        </div>

                        {phim.lstLichChieuTheoPhim?.length > 12 && (
                          <p className="text-gray-500 text-xs mt-2 italic">
                            +{phim.lstLichChieuTheoPhim.length - 12} suất khác
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-10">
                    Chưa có lịch chiếu
                  </p>
                )}
              </div>
            </div>
          )}

          {!isLoadingLichChieu && danhSachCumRap.length === 0 && (
            <div className="text-center py-10 text-gray-400 bg-gray-900 rounded-2xl border border-gray-800">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cinema;

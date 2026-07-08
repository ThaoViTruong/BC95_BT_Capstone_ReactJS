// src/components/Cinema.jsx
import { useState, useMemo, useEffect } from "react";
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

const formatPrice = (price) => {
  if (!price) return "";
  if (price >= 1000) return `${Math.round(price / 1000)}K`;
  return `${price}đ`;
};

// So sánh 2 ngày có cùng năm/tháng/ngày không
const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Chuyển Date -> key dạng "YYYY-MM-DD"
const dateToKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Lấy label thứ trong tuần
const getDayLabel = (date) => {
  const today = new Date();
  if (isSameDay(date, today)) return "Hôm nay";
  const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return days[date.getDay()];
};

const Cinema = () => {
  const [selectedCinema, setSelectedCinema] = useState("BHDStar");
  const [selectedCumRap, setSelectedCumRap] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: listHeThongRap, isLoading: isLoadingHeThongRap } =
    useHeThongRap();

  const { data: lichChieuData, isLoading: isLoadingLichChieu } =
    useLichChieuHeThongRap(selectedCinema);

  const handleSelectCinema = (maHeThongRap) => {
    setSelectedCinema(maHeThongRap);
    setSelectedCumRap(null);
    setSelectedDate(null);
  };

  const renderSelectedCinema = listHeThongRap?.find(
    (h) => h.maHeThongRap === selectedCinema,
  );

  const danhSachCumRap = lichChieuData?.[0]?.lstCumRap || [];

  const currentCumRap =
    danhSachCumRap.find((c) => c.maCumRap === selectedCumRap) ||
    danhSachCumRap[0];

  // ===== LẤY DANH SÁCH NGÀY CÓ LỊCH CHIẾU (SẮP XẾP TĂNG DẦN) =====
  const availableDates = useMemo(() => {
    if (!currentCumRap?.danhSachPhim) return [];

    const dateSet = new Set();
    currentCumRap.danhSachPhim.forEach((phim) => {
      phim.lstLichChieuTheoPhim?.forEach((lich) => {
        const d = new Date(lich.ngayChieuGioChieu);
        if (isNaN(d.getTime())) return;
        // Loại bỏ giờ, chỉ giữ ngày
        d.setHours(0, 0, 0, 0);
        dateSet.add(d.getTime());
      });
    });

    // Chuyển về mảng Date và sắp xếp tăng dần theo thời gian
    const sortedDates = Array.from(dateSet)
      .sort((a, b) => a - b)
      .map((timestamp) => {
        const d = new Date(timestamp);
        return {
          date: d,
          day: d.getDate(),
          month: d.getMonth() + 1,
          label: getDayLabel(d),
          key: dateToKey(d),
        };
      });

    return sortedDates;
  }, [currentCumRap]);

  // ===== TỰ ĐỘNG CHỌN NGÀY ĐẦU TIÊN KHI ĐỔI CỤM RẠP =====
  useEffect(() => {
    if (availableDates.length > 0) {
      const isCurrentValid = availableDates.some(
        (d) => d.key === selectedDate,
      );
      if (!isCurrentValid) {
        setSelectedDate(availableDates[0].key);
      }
    } else {
      setSelectedDate(null);
    }
  }, [availableDates, selectedDate]);

  // ===== LỌC PHIM & SUẤT CHIẾU THEO NGÀY ĐÃ CHỌN =====
  const filteredPhimByDate = useMemo(() => {
    if (!currentCumRap?.danhSachPhim || !selectedDate) return [];

    const [y, m, d] = selectedDate.split("-").map(Number);
    const selectedDateObj = new Date(y, m - 1, d);

    return currentCumRap.danhSachPhim
      .map((phim) => {
        const lichChieuTrongNgay = (phim.lstLichChieuTheoPhim || []).filter(
          (lich) => {
            const dt = new Date(lich.ngayChieuGioChieu);
            return isSameDay(dt, selectedDateObj);
          },
        );
        return { ...phim, lstLichChieuTheoPhim: lichChieuTrongNgay };
      })
      .filter((phim) => phim.lstLichChieuTheoPhim.length > 0);
  }, [currentCumRap, selectedDate]);

  return (
    <div>
      {/* Tiêu đề section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Lịch chiếu theo <span className="text-yellow-400">Rạp</span>
        </h2>
        <p className="text-gray-400">
          Chọn chuỗi rạp, cụm rạp và ngày để xem lịch chiếu
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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
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
              <div className="col-span-12 md:col-span-5 border-r border-gray-800 max-h-[750px] overflow-y-auto">
                {danhSachCumRap.map((cumRap) => (
                  <button
                    key={cumRap.maCumRap}
                    onClick={() => setSelectedCumRap(cumRap.maCumRap)}
                    className={`w-full text-left p-4 border-b border-gray-800 transition cursor-pointer ${
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
              <div className="col-span-12 md:col-span-7 max-h-[750px] overflow-y-auto">
                {/* ===== THANH CHỌN NGÀY (CHỈ HIỂN THỊ NGÀY CÓ LỊCH CHIẾU) ===== */}
                {availableDates.length > 0 && (
                  <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-3 py-3">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                      {availableDates.map((item) => {
                        const isActive = item.key === selectedDate;
                        return (
                          <button
                            key={item.key}
                            onClick={() => setSelectedDate(item.key)}
                            className={`flex-shrink-0 min-w-[70px] py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                              isActive
                                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            <div className="text-sm font-bold">
                              {item.day}/{item.month}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 ${
                                isActive ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              {item.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Banner thông báo */}
                <div className="mx-4 mt-4 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
                  <span>ⓘ</span>
                  <span>Nhấn vào suất chiếu để tiến hành mua vé</span>
                </div>

                {/* Thông tin cụm rạp đang chọn */}
                {currentCumRap && (
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white font-semibold text-sm">
                      {currentCumRap.tenCumRap}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      📍 {currentCumRap.diaChi}
                    </p>
                  </div>
                )}

                {/* Danh sách phim theo ngày */}
                {filteredPhimByDate.length ? (
                  filteredPhimByDate.map((phim) => (
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
                          className="w-20 h-28 object-cover rounded-lg hover:opacity-80 transition"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/80x112/1f2937/facc15?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${phim.maPhim}`}>
                          <h4 className="font-bold text-white mb-1 line-clamp-1 hover:text-yellow-400 transition">
                            {phim.tenPhim}
                          </h4>
                        </Link>

                        <p className="text-gray-500 text-xs mb-3">
                          Suất chiếu trong ngày
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {phim.lstLichChieuTheoPhim.map((lich) => (
                            <Link
                              key={lich.maLichChieu}
                              to={`/booking/${lich.maLichChieu}`}
                              className="group bg-gray-800 hover:bg-yellow-400 text-gray-200 hover:text-black text-xs px-3 py-2 rounded-lg transition border border-gray-700 hover:border-yellow-400 min-w-[70px] text-center"
                              title={`Giá: ${formatPrice(lich.giaVe)}`}
                            >
                              <div className="font-bold text-sm">
                                {formatTimeOnly(lich.ngayChieuGioChieu)}
                              </div>
                              <div className="text-[10px] text-gray-500 group-hover:text-gray-700 mt-0.5">
                                {formatPrice(lich.giaVe)}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 px-4">
                    <p className="text-gray-400 mb-1">
                      {availableDates.length === 0
                        ? "Cụm rạp này chưa có lịch chiếu"
                        : "Không có suất chiếu nào trong ngày này"}
                    </p>
                    {availableDates.length > 0 && (
                      <p className="text-gray-500 text-sm">
                        Vui lòng chọn ngày khác
                      </p>
                    )}
                  </div>
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
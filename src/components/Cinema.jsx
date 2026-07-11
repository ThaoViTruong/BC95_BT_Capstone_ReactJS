import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon, faCircleInfo, faLocationDot } from "../utils/fontAwesome";
import { useHeThongRap, useLichChieuHeThongRap } from "../hooks/useCinema";
import { useAdminMovieList } from "../hooks/useMovies";
import LoadingSpinner from "./LoadingSpinner";
import {
  createAvailableMovieIdSet,
  filterCinemaClustersByAvailableMovies,
} from "../utils/showtimeFilterUtils";

const NEXT_SEVEN_DAYS = 7;
const MA_NHOM = "GP01";

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

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const dateToKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getDayLabel = (date) => {
  const today = new Date();
  if (isSameDay(date, today)) return "Hôm nay";
  const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return days[date.getDay()];
};

const createNextSevenDateOptions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: NEXT_SEVEN_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      date,
      day: date.getDate(),
      month: date.getMonth() + 1,
      label: getDayLabel(date),
      key: dateToKey(date),
    };
  });
};

const isShowtimeWithinNextSevenDays = (dateValue) => {
  if (!dateValue) return false;

  const showtimeDate = new Date(dateValue);
  if (Number.isNaN(showtimeDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + NEXT_SEVEN_DAYS - 1);
  endDate.setHours(23, 59, 59, 999);

  return showtimeDate >= today && showtimeDate <= endDate;
};

const isMatchingSelectedDate = (dateValue, selectedDateObj) => {
  const showtimeDate = new Date(dateValue);

  if (Number.isNaN(showtimeDate.getTime())) {
    return false;
  }

  if (!isSameDay(showtimeDate, selectedDateObj)) {
    return false;
  }

  const now = new Date();
  if (isSameDay(selectedDateObj, now) && showtimeDate < now) {
    return false;
  }

  return true;
};

const countMoviesWithShowtimeInNextSevenDays = (movies = []) => {
  return movies.filter((phim) =>
    (phim.lstLichChieuTheoPhim || []).some((lich) =>
      isShowtimeWithinNextSevenDays(lich.ngayChieuGioChieu),
    ),
  ).length;
};

const Cinema = () => {
  const [selectedCinema, setSelectedCinema] = useState("BHDStar");
  const [selectedCumRap, setSelectedCumRap] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: listHeThongRap, isLoading: isLoadingHeThongRap } =
    useHeThongRap();

  const { data: lichChieuData, isLoading: isLoadingLichChieu } =
    useLichChieuHeThongRap(selectedCinema);
  const { data: availableMovies = [], isLoading: isLoadingMovies } =
    useAdminMovieList(MA_NHOM);

  const handleSelectCinema = (maHeThongRap) => {
    setSelectedCinema(maHeThongRap);
    setSelectedCumRap(null);
    setSelectedDate(null);
  };

  const renderSelectedCinema = listHeThongRap?.find(
    (h) => h.maHeThongRap === selectedCinema,
  );

  const availableMovieIds = useMemo(
    () => createAvailableMovieIdSet(availableMovies),
    [availableMovies],
  );
  const danhSachCumRap = useMemo(() => {
    return filterCinemaClustersByAvailableMovies(
      lichChieuData?.[0]?.lstCumRap || [],
      availableMovieIds,
    );
  }, [lichChieuData, availableMovieIds]);

  const currentCumRap =
    danhSachCumRap.find((c) => c.maCumRap === selectedCumRap) ||
    danhSachCumRap[0];

  const availableDates = useMemo(() => {
    return createNextSevenDateOptions();
  }, []);

  useEffect(() => {
    if (availableDates.length > 0) {
      const isCurrentValid = availableDates.some(
        (d) => d.key === selectedDate,
      );
      if (!isCurrentValid) {
        const timeoutId = setTimeout(() => {
          setSelectedDate(availableDates[0].key);
        }, 0);

        return () => clearTimeout(timeoutId);
      }
    } else {
      const timeoutId = setTimeout(() => {
        setSelectedDate(null);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [availableDates, selectedDate]);

  const filteredPhimByDate = useMemo(() => {
    if (!currentCumRap?.danhSachPhim || !selectedDate) return [];

    const [y, m, d] = selectedDate.split("-").map(Number);
    const selectedDateObj = new Date(y, m - 1, d);

    return currentCumRap.danhSachPhim
      .map((phim) => {
        const lichChieuTrongNgay = (phim.lstLichChieuTheoPhim || []).filter(
          (lich) =>
            isShowtimeWithinNextSevenDays(lich.ngayChieuGioChieu) &&
            isMatchingSelectedDate(lich.ngayChieuGioChieu, selectedDateObj),
        );
        return { ...phim, lstLichChieuTheoPhim: lichChieuTrongNgay };
      })
      .filter((phim) => phim.lstLichChieuTheoPhim.length > 0);
  }, [currentCumRap, selectedDate]);

  return (
    <div className="rounded-[26px] border border-white/10 bg-[#101214] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-4 lg:p-5">
      <div className="mb-6 text-center sm:mb-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-400 sm:text-xs">
          Lịch chiếu
        </p>
        <h2 className="mb-2 text-2xl font-black uppercase md:text-4xl">
          Lịch chiếu theo <span className="text-yellow-400">Rạp</span>
        </h2>
        <p className="text-xs text-gray-400 sm:text-sm">
          Chọn chuỗi rạp, cụm rạp và ngày để xem lịch chiếu
        </p>
      </div>

      {(isLoadingHeThongRap || isLoadingMovies) && <LoadingSpinner />}

      <div className="flex flex-col gap-4 xl:flex-row xl:gap-6">
        <div className="flex-shrink-0 xl:w-64">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.26em] text-gray-400 sm:mb-4 sm:text-xs">
            Chuỗi rạp
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-4 xl:block xl:space-y-2">
            {listHeThongRap?.map((heThongRap) => (
              <button
                key={heThongRap.maHeThongRap}
                onClick={() => handleSelectCinema(heThongRap.maHeThongRap)}
                className={`flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-center transition-all duration-200 xl:w-full xl:min-h-0 xl:flex-row xl:justify-start xl:gap-4 xl:px-4 xl:py-3 xl:text-left ${
                  selectedCinema === heThongRap.maHeThongRap
                    ? "bg-yellow-400/10 border border-yellow-400 text-yellow-400"
                    : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <img
                  src={heThongRap.logo}
                  alt={heThongRap.tenHeThongRap}
                  className="h-9 w-9 rounded-lg bg-white p-1 object-contain sm:h-10 sm:w-10"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/40x40/fff/000?text=Logo";
                  }}
                />
                <span className="line-clamp-2 text-center text-[10px] font-medium xl:text-left xl:text-sm">
                  {heThongRap.tenHeThongRap}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center gap-3 sm:mb-6">
            <img
              src={renderSelectedCinema?.logo}
              alt={renderSelectedCinema?.tenHeThongRap}
              className="h-10 w-10 rounded-xl bg-white p-1 object-contain sm:h-12 sm:w-12"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/40x40/fff/000?text=Logo";
              }}
            />
            <h3 className="text-lg font-bold text-yellow-400 sm:text-2xl">
              {renderSelectedCinema?.tenHeThongRap}
            </h3>
          </div>

          {isLoadingLichChieu && <LoadingSpinner />}

          {!isLoadingLichChieu && danhSachCumRap.length > 0 && (
            <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#151719]">
              <div className="col-span-12 max-h-[320px] overflow-y-auto border-b border-white/10 md:col-span-5 md:max-h-[750px] md:border-b-0 md:border-r">
                {danhSachCumRap.map((cumRap) => (
                  <button
                    key={cumRap.maCumRap}
                    onClick={() => setSelectedCumRap(cumRap.maCumRap)}
                    className={`w-full border-b border-white/10 p-3 text-left transition sm:p-4 ${
                      currentCumRap?.maCumRap === cumRap.maCumRap
                        ? "bg-gray-800 border-l-4 border-l-yellow-400"
                        : "hover:bg-gray-800/60 border-l-4 border-l-transparent"
                    }`}
                  >
                    <p className="mb-1 line-clamp-1 text-xs font-semibold text-yellow-400 sm:text-sm">
                      {cumRap.tenCumRap}
                    </p>
                    <p className="mb-1 line-clamp-2 text-[11px] text-gray-400 sm:text-xs">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                      {cumRap.diaChi}
                    </p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">
                      {countMoviesWithShowtimeInNextSevenDays(cumRap.danhSachPhim)} phim có suất chiếu
                    </p>
                  </button>
                ))}
              </div>

              <div className="col-span-12 max-h-[750px] overflow-y-auto md:col-span-7">
                {availableDates.length > 0 && (
                  <div className="sticky top-0 z-10 border-b border-white/10 bg-[#151719] px-3 py-3">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {availableDates.map((item) => {
                        const isActive = item.key === selectedDate;
                        return (
                          <button
                            key={item.key}
                            onClick={() => setSelectedDate(item.key)}
                            className={`flex-shrink-0 rounded-lg px-2 py-2 text-center transition-all ${
                              isActive
                                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                            style={{ minWidth: "78px" }}
                          >
                            <div className="text-xs font-bold sm:text-sm">
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

                <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-xs text-yellow-400 sm:mx-4 sm:mt-4 sm:px-4 sm:py-2.5 sm:text-sm">
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <span>Nhấn vào suất chiếu để tiến hành mua vé</span>
                </div>

                {currentCumRap && (
                  <div className="border-b border-white/10 px-3 py-3 sm:px-4">
                    <p className="text-sm font-semibold text-white">
                      {currentCumRap.tenCumRap}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                      {currentCumRap.diaChi}
                    </p>
                  </div>
                )}

                {filteredPhimByDate.length ? (
                  filteredPhimByDate.map((phim) => (
                    <div
                      key={phim.maPhim}
                      className="flex flex-col gap-3 border-b border-white/10 p-3 sm:flex-row sm:p-4"
                    >
                      <Link
                        to={`/movie/${phim.maPhim}`}
                        className="mx-auto block flex-shrink-0 sm:mx-0"
                      >
                        <img
                          src={phim.hinhAnh}
                          alt={phim.tenPhim}
                          className="h-24 w-[72px] rounded-lg object-cover transition hover:opacity-80 sm:h-28 sm:w-20"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/80x112/1f2937/facc15?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/movie/${phim.maPhim}`}>
                          <h4 className="mb-1 line-clamp-1 text-sm font-bold text-white transition hover:text-yellow-400 sm:text-base">
                            {phim.tenPhim}
                          </h4>
                        </Link>

                        <p className="mb-3 text-[11px] text-gray-500 sm:text-xs">
                          Suất chiếu trong 7 ngày kế tiếp
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {phim.lstLichChieuTheoPhim.map((lich) => (
                            <Link
                              key={lich.maLichChieu}
                              to={`/booking/${lich.maLichChieu}`}
                              className="group min-w-[68px] rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-2 text-center text-[11px] text-gray-200 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black sm:min-w-[74px] sm:px-3 sm:text-xs"
                              title={`Giá: ${formatPrice(lich.giaVe)}`}
                            >
                              <div className="text-xs font-bold sm:text-sm">
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
                      Không có suất chiếu nào trong ngày đã chọn
                    </p>
                    <p className="text-gray-500 text-sm">
                      Vui lòng chọn ngày khác trong 7 ngày kế tiếp
                    </p>
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

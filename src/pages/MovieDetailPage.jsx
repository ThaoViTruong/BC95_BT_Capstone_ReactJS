import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FontAwesomeIcon,
  faArrowLeft,
  faCalendarDays,
  faClapperboard,
  faLocationDot,
  faPlay,
  faStar,
  faTicket,
  faUsers,
} from "../utils/fontAwesome";
import { useMovieDetail, useMovieShowtimes } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
};

const isAvailableTodayShowtime = (dateValue) => {
  if (!dateValue) return false;

  const targetDate = new Date(dateValue);
  const today = new Date();

  if (Number.isNaN(targetDate.getTime())) {
    return false;
  }

  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate() &&
    targetDate.getTime() >= today.getTime()
  );
};

const getTodayShowtimeSystems = (showtimeData) => {
  if (!Array.isArray(showtimeData?.heThongRapChieu)) {
    return [];
  }

  return showtimeData.heThongRapChieu
    .map((heThong) => ({
      ...heThong,
      cumRapChieu: (heThong.cumRapChieu || [])
        .map((cumRap) => ({
          ...cumRap,
          lichChieuPhim: (cumRap.lichChieuPhim || []).filter((lich) =>
            isAvailableTodayShowtime(lich.ngayChieuGioChieu),
          ),
        }))
        .filter((cumRap) => cumRap.lichChieuPhim.length > 0),
    }))
    .filter((heThong) => heThong.cumRapChieu.length > 0);
};

const MovieDetailPage = () => {
  const { maPhim } = useParams();
  const { data: movie, isLoading, isError } = useMovieDetail(maPhim);
  const { data: showtimes, isLoading: loadingShowtimes } =
    useMovieShowtimes(maPhim);

  const showtimeRef = useRef(null);
  const [activeSystem, setActiveSystem] = useState(0);
  const todayShowtimeSystems = useMemo(
    () => getTodayShowtimeSystems(showtimes),
    [showtimes],
  );

  useEffect(() => {
    if (activeSystem >= todayShowtimeSystems.length) {
      const timeoutId = setTimeout(() => {
        setActiveSystem(0);
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [activeSystem, todayShowtimeSystems.length]);

  const handleBooking = () => {
    showtimeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Không tìm thấy phim</p>
          <Link to="/movie" className="inline-flex items-center gap-2 text-yellow-400 hover:underline">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại danh sách</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative flex min-h-[70vh] items-end">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: `url("${movie?.hinhAnh}")`,
            opacity: 0.15,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/40" />

        <div className="relative mx-auto w-full max-w-7xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <Link
            to="/movie"
            className="group mb-6 inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-yellow-400 sm:mb-8 sm:gap-2 sm:text-sm"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại danh sách
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <img
                  src={movie?.hinhAnh}
                  alt={movie?.tenPhim}
                  className="w-44 aspect-[2/3] rounded-xl object-cover shadow-2xl sm:w-64 sm:rounded-2xl lg:w-72
                             shadow-black/50 ring-1 ring-white/10 
                             group-hover:ring-yellow-400/30 group-hover:scale-[1.02] 
                             transition-all duration-500"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end">
              <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                {movie?.hot && (
                  <span
                    className="bg-red-500/20 text-red-400 border border-red-500/30 
                                  text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    Hot
                  </span>
                )}
                {movie?.dangChieu && (
                  <span
                    className="bg-green-500/20 text-green-400 border border-green-500/30 
                                  text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                  >
                    Đang chiếu
                  </span>
                )}
                {movie?.sapChieu && (
                  <span
                    className="bg-blue-500/20 text-blue-400 border border-blue-500/30 
                                  text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                  >
                    Sắp chiếu
                  </span>
                )}
              </div>
              <h1
                className="mb-3 text-2xl font-extrabold leading-tight sm:mb-4 sm:text-4xl lg:text-5xl
                              bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent 
                              "
              >
                {movie?.tenPhim || "Tên phim không xác định"}
              </h1>

              <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-wrap gap-0.5">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className={`text-lg sm:text-2xl ${
                        index < (movie?.danhGia || 0)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 sm:text-sm">
                  ({movie?.danhGia}/10 điểm)
                </span>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-2.5 sm:mb-6 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm sm:p-3">
                  <p className="mb-1 flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Khởi chiếu</span>
                  </p>
                  <p className="truncate text-xs font-medium text-white sm:text-sm">
                    {movie?.ngayKhoiChieu
                      ? new Date(movie.ngayKhoiChieu).toLocaleDateString(
                          "vi-VN",
                        )
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm sm:p-3">
                  <p className="mb-1 flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                    <FontAwesomeIcon icon={faClapperboard} />
                    <span>Mã phim</span>
                  </p>
                  <p className="text-xs font-medium text-white sm:text-sm">
                    #{movie?.maPhim}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm sm:p-3">
                  <p className="mb-1 flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Nhóm</span>
                  </p>
                  <p className="text-xs font-medium text-white sm:text-sm">
                    {movie?.maNhom}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-300 sm:text-base">
                  {movie?.moTa || "Chưa có mô tả cho phim này."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="#trailer"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 
                             bg-white/10 hover:bg-white/20 border border-white/20 
                             text-white font-semibold px-5 py-3 text-sm rounded-xl sm:px-8 sm:py-3.5 sm:text-base
                             transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  Xem Trailer
                </a>
                <button
                  onClick={handleBooking}
                  className="inline-flex items-center justify-center gap-2 
                             bg-gradient-to-r from-yellow-500 to-orange-500 
                             hover:from-yellow-400 hover:to-orange-400 
                             text-gray-900 font-bold px-5 py-3 text-sm rounded-xl sm:px-8 sm:py-3.5 sm:text-base
                             transition-all duration-300 shadow-lg shadow-yellow-500/25 
                             hover:shadow-yellow-500/40 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTicket} />
                  Đặt vé ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {movie?.trailer && (
        <div
          id="trailer"
          className="mx-auto max-w-5xl px-3 py-10 sm:px-6 sm:py-16 lg:px-8"
        >
          <h2 className="mb-6 text-center text-xl font-bold sm:mb-8 sm:text-2xl">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Trailer
            </span>
          </h2>
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden 
                          shadow-2xl shadow-black/50 ring-1 ring-white/10"
          >
            <iframe
              src={getYoutubeEmbedUrl(movie.trailer)}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}

      <div
        ref={showtimeRef}
        className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
      >
        <h2 className="mb-6 text-center text-xl font-bold sm:mb-8 sm:text-2xl">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Lịch chiếu & Đặt vé
          </span>
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loadingShowtimes ? (
            <div className="p-10 text-center sm:p-16">
              <div className="inline-block w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Đang tải lịch chiếu...</p>
            </div>
          ) : todayShowtimeSystems.length > 0 ? (
            <div className="flex min-h-[500px] flex-col md:flex-row">
              <div className="flex w-full flex-shrink-0 overflow-x-auto border-b border-gray-800 bg-gray-900/50 md:w-20 md:flex-col md:overflow-visible md:border-b-0 md:border-r sm:w-24">
                {todayShowtimeSystems.map((heThong, index) => (
                  <button
                    key={heThong.maHeThongRap}
                    onClick={() => setActiveSystem(index)}
                    title={heThong.tenHeThongRap}
                    className={`flex min-w-[72px] items-center justify-center p-2.5 sm:min-w-[96px] sm:p-4 md:w-full
                               border-b border-gray-800 transition-all duration-300 cursor-pointer 
                               ${
                                 activeSystem === index
                                   ? "border-b-2 border-b-yellow-400 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-100 md:border-b-0 md:border-l-4 md:border-l-yellow-400"
                                   : "border-b-2 border-b-transparent opacity-40 hover:bg-white/5 hover:opacity-80 md:border-b-0 md:border-l-4 md:border-l-transparent"
                               }`}
                  >
                    <img
                      src={heThong.logo}
                      alt={heThong.tenHeThongRap}
                      className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                    />
                  </button>
                ))}
              </div>

              <div className="custom-scrollbar max-h-[600px] flex-1 overflow-y-auto p-3 sm:p-6">
                {todayShowtimeSystems[activeSystem]?.cumRapChieu.map(
                  (cumRap) => (
                    <div
                      key={cumRap.maCumRap}
                      className="mb-6 border-b border-gray-800 pb-6 last:mb-0 last:border-b-0 last:pb-0 sm:mb-8 sm:pb-8"
                    >
                      <div className="mb-3 flex items-start gap-2.5 sm:mb-4 sm:gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold leading-tight text-green-400 sm:text-lg">
                            {cumRap.tenCumRap}
                          </h3>
                          <p className="mt-1 text-[11px] text-gray-500 sm:text-sm">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                            {cumRap.diaChi}
                          </p>
                        </div>
                      </div>

                      <div className="ml-0 flex flex-wrap gap-1.5 sm:ml-5 sm:gap-3">
                        {cumRap.lichChieuPhim.slice(0, 12).map((lich) => {
                          const date = new Date(lich.ngayChieuGioChieu);
                          const ngay = date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                          });
                          const gio = date.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <Link
                              key={lich.maLichChieu}
                              to={`/booking/${lich.maLichChieu}`}
                              className="group flex min-w-[66px] flex-col items-center rounded-lg border border-gray-700 px-2.5 py-1.5 transition-all duration-300 hover:border-yellow-500/50 hover:bg-yellow-500/5 sm:min-w-[80px] sm:px-4 sm:py-2"
                            >
                              <span className="text-[10px] text-gray-400 sm:text-xs">
                                {ngay}
                              </span>
                              <span className="text-xs font-bold text-yellow-400 group-hover:text-yellow-300 sm:text-base">
                                {gio}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center sm:p-16">
              <p className="text-base text-gray-500 sm:text-lg">
                <FontAwesomeIcon icon={faClapperboard} className="mr-2" />
                Hiện chưa có lịch chiếu khả dụng trong ngày cho phim này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;

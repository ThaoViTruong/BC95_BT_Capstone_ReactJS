import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FontAwesomeIcon,
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
  faClapperboard,
} from "../utils/fontAwesome";
import { useBanners, useMovieDetails } from "../hooks/useMovies";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data: banners = [], isLoading, isError } = useBanners();

  const maPhimList = useMemo(() => banners.map((b) => b.maPhim), [banners]);

  const movieDetailQueries = useMovieDetails(maPhimList);

  const bannersWithMovieInfo = useMemo(() => {
    return banners.map((banner, index) => {
      const movie = movieDetailQueries[index]?.data;
      return {
        ...banner,
        tenPhim: movie?.tenPhim || "Đang cập nhật",
        moTa: movie?.moTa || "",
      };
    });
  }, [banners, movieDetailQueries]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannersWithMovieInfo.length);
  }, [bannersWithMovieInfo.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + bannersWithMovieInfo.length) % bannersWithMovieInfo.length,
    );
  }, [bannersWithMovieInfo.length]);

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    if (isPaused || bannersWithMovieInfo.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, bannersWithMovieInfo.length]);

  useEffect(() => {
    if (currentSlide >= bannersWithMovieInfo.length) {
      const timeoutId = setTimeout(() => {
        setCurrentSlide(0);
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [bannersWithMovieInfo.length, currentSlide]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[45vh] md:h-[55vh] lg:h-[65vh] max-h-[600px] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
        <div className="relative text-gray-400 text-lg flex items-center gap-3">
          <span className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          Đang tải banner...
        </div>
      </div>
    );
  }

  if (isError || bannersWithMovieInfo.length === 0) {
    return (
      <div className="relative w-full h-[45vh] md:h-[55vh] lg:h-[65vh] max-h-[600px] bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <FontAwesomeIcon icon={faClapperboard} className="mb-2 text-4xl" />
          <p>Không tải được banner</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[1] bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_40%)]" />
      <div
        className="flex h-[54vh] max-h-[620px] min-h-[360px] w-full transition-transform duration-700 ease-in-out sm:h-[58vh] lg:h-[65vh]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannersWithMovieInfo.map((banner) => (
          <div
            key={banner.maBanner}
            className="relative w-full h-full flex-shrink-0"
          >
            <img
              src={banner.hinhAnh}
              alt={banner.tenPhim}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1920x600/1f2937/9ca3af?text=No+Image";
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/40 to-transparent" />
            <div className="absolute bottom-6 left-3 right-3 z-10 animate-fadeIn sm:bottom-10 sm:left-6 sm:right-auto sm:max-w-lg lg:bottom-16 lg:left-12 lg:max-w-2xl">
              <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-md sm:p-5 lg:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-xs">
                    Đang chiếu nổi bật
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/75 sm:text-xs">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    Cập nhật liên tục
                  </span>
                </div>

              <h2 className="mb-2 line-clamp-2 text-2xl font-extrabold text-white drop-shadow-lg sm:text-4xl lg:mb-3 lg:text-5xl">
                {banner.tenPhim}
              </h2>

              <p className="mb-4 line-clamp-3 text-xs text-gray-200 drop-shadow sm:text-sm lg:mb-5 lg:text-base">
                {banner.moTa ||
                  "Đặt vé ngay hôm nay để trải nghiệm những bộ phim bom tấn với chất lượng hình ảnh và âm thanh tuyệt đỉnh"}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to={`/movie/${banner.maPhim}`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:scale-[1.02] sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <span>Chi tiết</span>
                </Link>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bannersWithMovieInfo.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white transition-all duration-300 hover:scale-110 hover:bg-black/70 md:left-4 md:flex md:h-11 md:w-11 md:text-xl md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white transition-all duration-300 hover:scale-110 hover:bg-black/70 md:right-4 md:flex md:h-11 md:w-11 md:text-xl md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next slide"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2">
            {bannersWithMovieInfo.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-6 bg-red-600 sm:w-8"
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-10">
            <div
              key={currentSlide}
              className={`h-full bg-red-600 ${
                !isPaused ? "animate-progress" : ""
              }`}
              style={{ width: isPaused ? "0%" : "100%" }}
            />
          </div>
        </>
      )}

      <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progress {
                    animation: progress 5s linear;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
    </div>
  );
};

export default Banner;

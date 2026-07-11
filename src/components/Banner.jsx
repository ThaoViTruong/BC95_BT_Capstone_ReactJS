import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FontAwesomeIcon,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faClapperboard,
} from "../utils/fontAwesome";
import { useBanners, useMovieDetails } from "../hooks/useMovies";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
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

  const handleViewDetail = (maPhim) => {
    navigate(`/movie/${maPhim}`);
  };

  useEffect(() => {
    if (isPaused || bannersWithMovieInfo.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, bannersWithMovieInfo.length]);

  useEffect(() => {
    if (currentSlide >= bannersWithMovieInfo.length) {
      setCurrentSlide(0);
    }
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
      className="relative w-full h-[45vh] md:h-[55vh] lg:h-[65vh] max-h-[600px] overflow-hidden bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
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

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-gray-950/20 to-transparent" />
            <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl text-white animate-fadeIn">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 drop-shadow-lg line-clamp-2">
                {banner.tenPhim}
              </h2>

              <p className="text-sm md:text-base lg:text-lg mb-3 md:mb-5 text-gray-200 drop-shadow line-clamp-2">
                {banner.moTa ||
                  "Đặt vé ngay hôm nay để trải nghiệm những bộ phim bom tấn với chất lượng hình ảnh và âm thanh tuyệt đỉnh"}
              </p>

              <button
                onClick={() => handleViewDetail(banner.maPhim)}
                className="cursor-pointer inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 rounded-md font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30"
              >
                <span>Xem Chi Tiết</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {bannersWithMovieInfo.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-lg md:text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-lg md:text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {bannersWithMovieInfo.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-red-600"
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

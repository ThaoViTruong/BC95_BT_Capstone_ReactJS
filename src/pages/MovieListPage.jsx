// src/pages/MovieListPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMovieList, useMovieListByDate } from "../hooks/useMovies";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import Banner from "../components/Banner";
import Cinema from "../components/Cinema";

const MovieListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const pageSize = 10;
  const movieListRef = useRef(null);
  const location = useLocation();
  const debouncedSearch = useDebounce(search, 500);
  const formatDateForApi = (date) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const normalQuery = useMovieList(
    "GP01",
    debouncedSearch ? 1 : currentPage,
    debouncedSearch ? 999 : pageSize,
    "",
  );

  const dateQuery = useMovieListByDate(
    "GP01",
    currentPage,
    pageSize,
    "",
    isDateFilterActive ? formatDateForApi(appliedFromDate) : "",
    isDateFilterActive ? formatDateForApi(appliedToDate) : "",
  );

  const activeQuery = isDateFilterActive ? dateQuery : normalQuery;
  const { data, isLoading, isError, error, isFetching } = activeQuery;

  const allMovies = data?.items || [];

  const movies = debouncedSearch
    ? allMovies.filter((movie) => {
        const keyword = debouncedSearch.toLowerCase();
        return (
          movie.tenPhim?.toLowerCase().includes(keyword) ||
          movie.biDanh?.toLowerCase().includes(keyword)
        );
      })
    : allMovies;

  const totalPages = debouncedSearch ? 0 : data?.totalPages || 0;

  const handleApplyDateFilter = () => {
    if (!fromDate || !toDate) {
      alert("Vui lòng chọn cả 'Từ ngày' và 'Đến ngày'");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      alert("'Từ ngày' phải nhỏ hơn hoặc bằng 'Đến ngày'");
      return;
    }
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setIsDateFilterActive(true);
    setCurrentPage(1);
    setSearch("");
  };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    setAppliedFromDate("");
    setAppliedToDate("");
    setIsDateFilterActive(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (movieListRef.current) {
      const yOffset = -80;
      const y =
        movieListRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [location.hash, isLoading]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Banner />

      {/* ===== HERO SECTION ===== */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 py-16 px-4 overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Title */}
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30">
            <span className="text-yellow-400 text-sm font-medium">
              🎬 KHO PHIM HOT NHẤT
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Danh sách <span className="text-yellow-400">Phim</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Khám phá hàng trăm bộ phim hấp dẫn đang chờ bạn
          </p>

          {/* ===== UNIFIED SEARCH + FILTER CARD ===== */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden">
            {/* Search Bar */}
            <div className="p-5 border-b border-gray-700/60">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    isDateFilterActive
                      ? "Tìm kiếm bị vô hiệu hóa khi đang lọc theo ngày"
                      : "Tìm kiếm tên phim..."
                  }
                  disabled={isDateFilterActive}
                  className="w-full h-12 rounded-xl border border-gray-700 bg-gray-900/80 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Divider label */}
            <div className="flex items-center gap-3 px-5 pt-5">
              <div className="h-px flex-1 bg-gray-700/60" />
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest flex items-center gap-2">
                📅 Lọc theo khoảng thời gian
              </span>
              <div className="h-px flex-1 bg-gray-700/60" />
            </div>

            {/* Date Filter */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div className="flex flex-col text-left">
                  <label className="text-xs text-gray-400 mb-1.5 font-medium">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-11 rounded-xl bg-gray-900/80 border border-gray-700 px-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-xs text-gray-400 mb-1.5 font-medium">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-11 rounded-xl bg-gray-900/80 border border-gray-700 px-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleApplyDateFilter}
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-yellow-500/30"
                  >
                    Áp dụng
                  </button>
                  {isDateFilterActive && (
                    <button
                      onClick={handleClearDateFilter}
                      className="h-11 px-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      title="Xóa bộ lọc"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {isDateFilterActive && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-sm">
                  <span className="text-yellow-400">🎯</span>
                  <span className="text-gray-300">
                    Đang lọc:{" "}
                    <b className="text-yellow-400">
                      {formatDateForApi(appliedFromDate)}
                    </b>{" "}
                    →{" "}
                    <b className="text-yellow-400">
                      {formatDateForApi(appliedToDate)}
                    </b>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DANH SÁCH PHIM ===== */}
      <div
        ref={movieListRef}
        className="max-w-7xl mx-auto px-4 py-8 scroll-mt-20"
      >
        {isLoading && <LoadingSpinner />}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
            <p className="text-gray-500">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-gray-400">
              {debouncedSearch ? (
                <>
                  Tìm thấy{" "}
                  <span className="text-yellow-400 font-semibold">
                    {movies.length}
                  </span>{" "}
                  phim với "
                  <span className="text-yellow-400">{debouncedSearch}</span>"
                </>
              ) : isDateFilterActive ? (
                <>
                  Tìm thấy{" "}
                  <span className="text-yellow-400 font-semibold">
                    {data?.totalCount || 0}
                  </span>{" "}
                  phim trong khoảng ngày đã chọn
                </>
              ) : (
                <>
                  Hiển thị{" "}
                  <span className="text-yellow-400 font-semibold">
                    {movies.length}
                  </span>{" "}
                  /{" "}
                  <span className="text-yellow-400 font-semibold">
                    {data?.totalCount || 0}
                  </span>{" "}
                  phim
                </>
              )}
            </p>
          </div>
        )}

        {!isLoading && !isError && movies.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 px-6 py-16 text-center">
            <p className="mb-2 text-xl font-semibold text-white">
              Không tìm thấy phim phù hợp
            </p>
            <p className="text-gray-400">
              {isDateFilterActive
                ? "Không có phim nào trong khoảng ngày đã chọn. Hãy thử khoảng ngày khác."
                : "Hãy thử lại với từ khóa khác."}
            </p>
          </div>
        )}

        <div
          id="flim"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 scroll-mt-20"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.maPhim} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && !debouncedSearch && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Sau →
            </button>
          </div>
        )}

        {isFetching && !isLoading && (
          <p className="text-center text-gray-400 mt-4">Đang tải...</p>
        )}
      </div>

      {/* ===== SECTION LỊCH CHIẾU THEO RẠP ===== */}
      <section
        id="cinema-section"
        className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-800 mt-10 scroll-mt-20"
      >
        <Cinema />
      </section>
    </div>
  );
};

export default MovieListPage;

// src/pages/MovieListPage.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  FontAwesomeIcon,
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faMagnifyingGlass,
  faXmark,
} from "../utils/fontAwesome";
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
  const movieRailRef = useRef(null);
  const location = useLocation();
  const debouncedSearch = useDebounce(search, 500);
  const formatDateForApi = (date) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 0);

    return () => clearTimeout(timeoutId);
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
        return movie.tenPhim?.toLowerCase().includes(keyword);
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

  const scrollMovieRail = (direction) => {
    if (!movieRailRef.current) return;
    movieRailRef.current.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
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

      <div className="relative overflow-hidden bg-gradient-to-b from-[#111318] via-gray-950 to-gray-950 px-3 py-10 sm:px-4 sm:py-14">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-400 sm:text-xs">
            Khám phá phim
          </p>
          <h1 className="mb-3 text-3xl font-black sm:text-4xl md:text-5xl">
            Danh sách <span className="text-yellow-400">Phim</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-400 sm:mb-8 sm:text-base lg:text-lg">
            Xem nhanh phim đang chiếu, lọc theo ngày phát hành và chọn suất chiếu phù hợp.
          </p>
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#121417]/85 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:rounded-[30px]">
            <div className="border-b border-white/10 p-3 sm:p-5">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 sm:left-4"
                />
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
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0f1114] pl-9 pr-9 text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:pl-12 sm:pr-12 sm:text-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-700 text-gray-300 transition hover:bg-gray-600 hover:text-white sm:right-4"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-5 sm:pt-5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400 sm:gap-2 sm:text-xs sm:tracking-[0.24em]">
                <FontAwesomeIcon icon={faCalendarDays} />
                <span>Lọc theo khoảng thời gian</span>
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="p-3 sm:p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_88px] items-end gap-2 sm:gap-3 md:grid-cols-[1fr_1fr_auto]">
                <div className="flex flex-col text-left">
                  <label className="mb-1 text-[10px] font-medium text-gray-400 sm:mb-1.5 sm:text-xs">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-9 rounded-xl border border-white/10 bg-[#0f1114] px-2 text-[11px] text-white outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400 [color-scheme:dark] sm:h-11 sm:px-3 sm:text-sm"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label className="mb-1 text-[10px] font-medium text-gray-400 sm:mb-1.5 sm:text-xs">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-9 rounded-xl border border-white/10 bg-[#0f1114] px-2 text-[11px] text-white outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-yellow-400 [color-scheme:dark] sm:h-11 sm:px-3 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleApplyDateFilter}
                    className="h-9 w-full whitespace-nowrap rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 text-xs font-semibold text-black shadow-lg shadow-yellow-500/20 transition-all hover:from-yellow-500 hover:to-yellow-600 active:scale-95 sm:h-11 sm:px-6 sm:text-sm"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {isDateFilterActive && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-[11px] sm:mt-4 sm:rounded-full sm:px-4 sm:text-sm">
                  <FontAwesomeIcon icon={faFilter} className="text-yellow-400" />
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
                  <button
                    type="button"
                    onClick={handleClearDateFilter}
                    className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-[10px] text-white transition hover:bg-gray-600 sm:ml-1"
                    title="Xóa bộ lọc"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={movieListRef}
        id="movie-list-section"
        className="mx-auto max-w-7xl px-3 py-8 scroll-mt-20 sm:px-4 sm:py-10"
      >
        {isLoading && <LoadingSpinner />}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
            <p className="text-gray-500">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-400 sm:text-xs">
                Danh sách phim
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
                Phim Nổi Bật
              </h2>
              <p className="mt-2 max-w-2xl text-xs text-gray-400 sm:text-sm">
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

            <div className="hidden items-center gap-2 md:flex xl:hidden">
              <button
                type="button"
                onClick={() => scrollMovieRail(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                type="button"
                onClick={() => scrollMovieRail(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
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

        <div id="flim" className="scroll-mt-20">
          <div
            ref={movieRailRef}
            className="flex gap-3 overflow-x-auto pb-2 xl:hidden"
          >
            {movies.map((movie) => (
              <div
                key={movie.maPhim}
                className="w-[150px] min-w-[150px] sm:w-[180px] sm:min-w-[180px] md:w-[210px] md:min-w-[210px]"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-5 lg:grid-cols-4 xl:grid xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.maPhim} movie={movie} />
            ))}
          </div>
        </div>

        {!isLoading && !isError && totalPages > 1 && !debouncedSearch && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white transition-colors hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Trước</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 cursor-pointer rounded-lg text-sm font-medium transition-colors sm:h-10 sm:w-10 ${
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white transition-colors hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              <span>Sau</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}

        {isFetching && !isLoading && (
          <p className="text-center text-gray-400 mt-4">Đang tải...</p>
        )}
      </div>

      <section
        id="cinema-section"
        className="mx-auto mt-10 max-w-7xl scroll-mt-20 border-t border-gray-800 px-3 py-10 sm:px-4 sm:py-14"
      >
        <Cinema />
      </section>
    </div>
  );
};

export default MovieListPage;

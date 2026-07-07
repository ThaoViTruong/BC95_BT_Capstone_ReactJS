// src/pages/MovieListPage.jsx
import { useState } from 'react'
import { useMovieList } from "../hooks/useMovies";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import Banner from "../components/Banner";
import Cinema from "../components/Cinema";

const MovieListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const debouncedSearch = useDebounce(search, 500);

  // ⭐ Khi search: lấy nhiều phim để filter. Không search: phân trang bình thường
  const { data, isLoading, isError, error, isFetching } = useMovieList(
    "GP01",
    debouncedSearch ? 1 : currentPage,
    debouncedSearch ? 999 : pageSize,
    "" // ⭐ KHÔNG dùng tenPhim của API (vì nó search biDanh)
  );

  const allMovies = data?.items || [];

  // ⭐ Filter phía client theo tenPhim
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Banner />

      {/* ===== HERO + SEARCH ===== */}
      <div className="bg-gradient-to-black from-gray-900 to-gray-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Danh sách <span className="text-yellow-400">Phim</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Khám phá hàng trăm bộ phim hấp dẫn
        </p>

        <div className="relative mx-auto max-w-lg">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm tên phim..."
            className="w-full rounded-full border border-gray-700 bg-gray-800 py-3 pl-12 pr-12 text-white placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-yellow-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ===== DANH SÁCH PHIM ===== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && <LoadingSpinner />}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
            <p className="text-gray-500">{error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <p className="text-gray-400 mb-6">
            {debouncedSearch ? (
              <>
                Tìm thấy{" "}
                <span className="text-yellow-400 font-medium">
                  {movies.length}
                </span>{" "}
                phim với "
                <span className="text-yellow-400">{debouncedSearch}</span>"
              </>
            ) : (
              <>
                Hiển thị{" "}
                <span className="text-yellow-400 font-medium">
                  {movies.length}
                </span>{" "}
                /{" "}
                <span className="text-yellow-400 font-medium">
                  {data?.totalCount || 0}
                </span>{" "}
                phim
              </>
            )}
          </p>
        )}

        {!isLoading && !isError && movies.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 px-6 py-16 text-center">
            <p className="mb-2 text-xl font-semibold text-white">
              Không tìm thấy phim phù hợp
            </p>
            <p className="text-gray-400">Hãy thử lại với từ khóa khác.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.maPhim} movie={movie} />
          ))}
        </div>

        {/* Pagination - ẩn khi đang search */}
        {!isLoading && !isError && totalPages > 1 && !debouncedSearch && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
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
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sau →
            </button>
          </div>
        )}

        {isFetching && !isLoading && (
          <p className="text-center text-gray-400 mt-4">Đang tải...</p>
        )}
      </div>

      {/* ===== 🆕 SECTION LỊCH CHIẾU THEO RẠP ===== */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-800 mt-10">
        <Cinema />
      </section>
    </div>
  );
};

export default MovieListPage;


import React, { useState } from "react";
import { useMovieList } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import Banner from "../components/Banner";

const MovieListPage = () => {
  const { data: movies, isLoading, isError, error } = useMovieList("GP01");

  const [search, setSearch] = useState("");

   const filteredMovies = movies?.filter((movie) => movie.tenPhim.toLowerCase().includes(search.toLowerCase())
)
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Banner */}
      <Banner />

      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Danh sách <span className="text-yellow-400">Phim</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Khám phá hàng trăm bộ phim hấp dẫn
        </p>
        {/* Search Bar */}
       <div className="relative mx-auto max-w-lg">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tên phim, bí danh, mô tả..."
            aria-label="Tìm kiếm phim"
            className="w-full rounded-full border border-gray-700 bg-gray-800 py-3 pl-12 pr-12 text-white placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-yellow-400"
          />

          {search && (
           <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && <LoadingSpinner />}
        {/* Error State */}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-2">Đã xảy ra lỗi!</p>
            <p className="text-gray-500">{error?.message}</p>
          </div>
        )}

        {/* Count */}
        {/* <p className="text-gray-400 mb-6">
                    Hiển thị <span className="text-yellow-400 font-medium">{movies?.length || 0}</span> phim
                </p> */}
        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies?.map((movie) => (
            <MovieCard key={movie.maPhim} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieListPage;

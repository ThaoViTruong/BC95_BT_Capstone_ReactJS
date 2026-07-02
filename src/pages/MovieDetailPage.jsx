import React from "react";
import { Link, useParams } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import LoadingSpinner from "../components/LoadingSpinner";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
};

const MovieDetailPage = () => {
  const { maPhim } = useParams();
  const { data: movie, isLoading, isError, error } = useMovieDetail(maPhim);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Error State */}
      {isError && (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">Không tìm thấy phim</p>
            <Link to="/movie" className="text-yellow-400 hover:underline">
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          to="/movie"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url("${movie?.hinhAnh}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie?.hinhAnh}
                alt={movie?.tenPhim}
                className="w-64 mx-auto md:mx-0 rounded-2xl shadow-2xl shadow-yellow-400/10"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {movie?.tenPhim || "Tên phim không xác định"}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie?.hot && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    🔥 HOT
                  </span>
                )}
                {movie?.dangChieu && (
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    ✅ Đang chiếu
                  </span>
                )}
                {movie?.sapChieu && (
                  <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    🕐 Sắp chiếu
                  </span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < (movie?.danhGia || 0)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-yellow-400 font-bold text-xl">
                  {movie?.danhGia}/10
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Ngày khởi chiếu</p>
                  <p className="text-white font-medium">
                    {movie?.ngayKhoiChieu}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Mã phim</p>
                  <p className="text-white font-medium">#{movie?.maPhim}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Nhóm</p>
                  <p className="text-white font-medium">{movie?.maNhom}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Bí danh</p>
                  <p className="text-white font-medium">{movie?.biDanh}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-gray-300 font-semibold mb-2">Mô tả</h3>
                <p className="text-gray-400 leading-relaxed">
                  {movie?.moTa || "Chưa có mô tả cho phim này."}
                </p>
              </div>

              {/* Buttons */}
              <div>
                {/* ✅ Sửa: dùng trailer từ API */}
                <a
                  href={movie?.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Xem Trailer
                </a>
                <a className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors ml-5 cursor-pointer">
                  Nhấn để đặt vé
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Embed Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Trailer</h2>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          {movie?.trailer && (
            <iframe
              src={getYoutubeEmbedUrl(movie.trailer)}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;

import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const MovieDetailPage = () => {
  const { maPhim } = useParams();
  const { data: movie, isLoading, isError } = useMovieDetail(maPhim);
  const { data: showtimes, isLoading: loadingShowtimes } =
    useMovieShowtimes(maPhim);

  const showtimeRef = useRef(null);
  const [activeSystem, setActiveSystem] = useState(0);

  const handleBooking = () => {
    showtimeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Không tìm thấy phim</p>
          <Link to="/movie" className="text-yellow-400 hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ============================================= */}
      {/* 🔄 TỐI ƯU 1: HERO SECTION - Bố cục lại hoàn toàn */}
      {/* - Thêm min-h để hero có chiều cao cố định đẹp hơn */}
      {/* - Poster: thêm hover scale, border glow */}
      {/* - Back button nhúng vào trong hero thay vì tách riêng */}
      {/* ============================================= */}
      <div className="relative min-h-[70vh] flex items-end">
        {/* Background blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: `url("${movie?.hinhAnh}")`,
            opacity: 0.15,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/40" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button nằm trong hero */}
          <Link
            to="/movie"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Quay lại danh sách
          </Link>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* ============================================= */}
            {/* 🔄 TỐI ƯU 2: POSTER */}
            {/* - Tăng width từ w-64 lên w-72 */}
            {/* - Thêm hover:scale-105 */}
            {/* - Thêm ring glow khi hover */}
            {/* - Thêm aspect-[2/3] để poster luôn đúng tỷ lệ */}
            {/* ============================================= */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <img
                  src={movie?.hinhAnh}
                  alt={movie?.tenPhim}
                  className="w-72 aspect-[2/3] object-cover rounded-2xl shadow-2xl 
                             shadow-black/50 ring-1 ring-white/10 
                             group-hover:ring-yellow-400/30 group-hover:scale-[1.02] 
                             transition-all duration-500"
                />
                
              </div>
            </div>

            {/* ============================================= */}
            {/* 🔄 TỐI ƯU 3: INFO SECTION */}
            {/* - Tên phim: thêm text-5xl, gradient text */}
            {/* - Badges: icon + text rõ hơn, spacing tốt hơn */}
            {/* - Rating stars: gọn hơn, bỏ duplicate với poster badge */}
            {/* - Info grid: 2 cột trên mobile, icon cho mỗi item */}
            {/* - Mô tả: giới hạn 4 dòng, thêm line-clamp */}
            {/* - Buttons: kích thước lớn hơn, thêm icon rõ hơn */}
            {/* ============================================= */}
            <div className="flex-1 flex flex-col justify-end">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie?.hot && (
                  <span
                    className="bg-red-500/20 text-red-400 border border-red-500/30 
                                  text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
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

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 
                              bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent 
                              leading-tight"
              >
                {movie?.tenPhim || "Tên phim không xác định"}
              </h1>

              {/* Star rating - dạng compact hơn */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-2xl ${
                        index < (movie?.danhGia || 0)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({movie?.danhGia}/10 điểm)
                </span>
              </div>

              {/* ============================================= */}
              {/* 🔄 TỐI ƯU 4: INFO GRID */}
              {/* - Thêm emoji icon cho mỗi mục */}
              {/* - Bo tròn, nền mờ thay vì gray-800 cứng */}
              {/* - responsive: 2 cột trên mọi kích thước */}
              {/* ============================================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">📅 Khởi chiếu</p>
                  <p className="text-white font-medium text-sm truncate">
                    {movie?.ngayKhoiChieu
                      ? new Date(movie.ngayKhoiChieu).toLocaleDateString(
                          "vi-VN"
                        )
                      : "—"}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">🎬 Mã phim</p>
                  <p className="text-white font-medium text-sm">
                    #{movie?.maPhim}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">👥 Nhóm</p>
                  <p className="text-white font-medium text-sm">
                    {movie?.maNhom}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1">🏷️ Bí danh</p>
                  <p className="text-white font-medium text-sm truncate">
                    {movie?.biDanh}
                  </p>
                </div>
              </div>

              {/* ============================================= */}
              {/* 🔄 TỐI ƯU 5: MÔ TẢ */}
              {/* - Giới hạn 3 dòng bằng line-clamp-3 */}
              {/* - Màu text sáng hơn để dễ đọc */}
              {/* ============================================= */}
              <div className="mb-8">
                <p className="text-gray-300 leading-relaxed line-clamp-3">
                  {movie?.moTa || "Chưa có mô tả cho phim này."}
                </p>
              </div>

              {/* ============================================= */}
              {/* 🔄 TỐI ƯU 6: BUTTONS */}
              {/* - Kích thước lớn hơn, full-width trên mobile */}
              {/* - Thêm icon SVG thay vì text thuần */}
              {/* - Đặt vé: nổi bật hơn với gradient + shadow */}
              {/* ============================================= */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#trailer"
                  
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 
                             bg-white/10 hover:bg-white/20 border border-white/20 
                             text-white font-semibold px-8 py-3.5 rounded-xl 
                             transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Xem Trailer
                </a>
                <button
                  onClick={handleBooking}
                  className="inline-flex items-center justify-center gap-2 
                             bg-gradient-to-r from-yellow-500 to-orange-500 
                             hover:from-yellow-400 hover:to-orange-400 
                             text-gray-900 font-bold px-8 py-3.5 rounded-xl 
                             transition-all duration-300 shadow-lg shadow-yellow-500/25 
                             hover:shadow-yellow-500/40 cursor-pointer"
                >
                  
                   
                  Đặt vé ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* 🔄 TỐI ƯU 7: TRAILER SECTION */}
      {/* - Thêm max-w-5xl để iframe không quá rộng */}
      {/* - Thêm border ring cho iframe */}
      {/* - Center layout */}
      {/* ============================================= */}
      {movie?.trailer && (
        <div 
        id="trailer"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
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

      {/* ============================================= */}
      {/* 🔄 TỐI ƯU 8: LỊCH CHIẾU SECTION */}
      {/* - Sidebar: thêm tooltip tên hệ thống rạp */}
      {/* - Sidebar: active state rõ hơn với bg gradient */}
      {/* - Content: cụm rạp có icon địa chỉ */}
      {/* - Lịch chiếu: tách ngày/giờ rõ hơn, hover effect mượt */}
      {/* - Thêm padding, rounded cho toàn bộ section */}
      {/* - Dark theme cho section thay vì white (đồng bộ với page) */}
      {/* ============================================= */}
      <div ref={showtimeRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Lịch chiếu & Đặt vé
          </span>
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loadingShowtimes ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Đang tải lịch chiếu...</p>
            </div>
          ) : showtimes?.heThongRapChieu?.length > 0 ? (
            <div className="flex min-h-[500px]">
              {/* Sidebar */}
              <div className="w-20 sm:w-24 border-r border-gray-800 bg-gray-900/50 flex-shrink-0">
                {showtimes.heThongRapChieu.map((heThong, index) => (
                  <button
                    key={heThong.maHeThongRap}
                    onClick={() => setActiveSystem(index)}
                    title={heThong.tenHeThongRap}
                    className={`w-full p-3 sm:p-4 flex items-center justify-center 
                               border-b border-gray-800 transition-all duration-300 cursor-pointer 
                               ${
                                 activeSystem === index
                                   ? "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-l-yellow-400 opacity-100"
                                   : "hover:bg-white/5 opacity-40 hover:opacity-80 border-l-4 border-l-transparent"
                               }`}
                  >
                    <img
                      src={heThong.logo}
                      alt={heThong.tenHeThongRap}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                {showtimes.heThongRapChieu[activeSystem]?.cumRapChieu.map(
                  (cumRap) => (
                    <div
                      key={cumRap.maCumRap}
                      className="mb-8 pb-8 border-b border-gray-800 last:border-b-0 last:mb-0 last:pb-0"
                    >
                      {/* Tên cụm rạp + địa chỉ */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-green-400 leading-tight">
                            {cumRap.tenCumRap}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            📍 {cumRap.diaChi}
                          </p>
                        </div>
                      </div>

                      {/* Lịch chiếu */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 ml-5">
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
                              className="group border border-gray-700 rounded-lg px-3 sm:px-4 py-2 
                                         hover:border-yellow-500/50 hover:bg-yellow-500/5 
                                         transition-all duration-300 flex flex-col items-center 
                                         min-w-[80px]"
                            >
                              <span className="text-gray-400 text-xs">
                                {ngay}
                              </span>
                              <span className="text-yellow-400 font-bold text-sm sm:text-base group-hover:text-yellow-300">
                                {gio}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center">
              <p className="text-gray-500 text-lg">
                🎬 Hiện chưa có lịch chiếu cho phim này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;


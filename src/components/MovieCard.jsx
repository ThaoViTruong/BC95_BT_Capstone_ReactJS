import React from 'react'
import { Link } from 'react-router-dom'

// Ảnh fallback khi load lỗi
const FALLBACK_IMG = "https://via.placeholder.com/300x450/1f2937/facc15?text=No+Image"

// Format ngày dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return "Đang cập nhật"
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  } catch {
    return "Đang cập nhật"
  }
}

// Component Badge tái sử dụng
const Badge = ({ color, children, label }) => (
  <span 
    aria-label={label}
    className={`${color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-md`}
  >
    {children}
  </span>
)

const MovieCard = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.maPhim}`}
      className="block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Phần ảnh */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={movie.hinhAnh || FALLBACK_IMG}
          alt={`Poster phim ${movie.tenPhim}`}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay gradient khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {movie.hot && <Badge color="bg-red-500" label="Phim hot">HOT</Badge>}
          {movie.dangChieu && <Badge color="bg-green-500" label="Đang chiếu">Đang chiếu</Badge>}
          {movie.sapChieu && <Badge color="bg-blue-500" label="Sắp chiếu">Sắp chiếu</Badge>}
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="text-white text-sm font-medium">
            {movie.danhGia ?? "N/A"}/10
          </span>
        </div>

        {/* Nút "Xem ngay" hiện khi hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
           Xem Chi Tiết
          </span>
        </div>
      </div>

      {/* Phần thông tin */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-yellow-400 transition-colors">
          {movie.tenPhim}
        </h3>
        <p className="text-gray-400 text-sm flex items-center gap-1">
          📅 {formatDate(movie.ngayKhoiChieu)}
        </p>
      </div>
    </Link>
  )
}

// Tránh re-render không cần thiết
export default React.memo(MovieCard)
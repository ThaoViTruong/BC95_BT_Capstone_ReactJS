import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon, faCalendarDays, faStar } from '../utils/fontAwesome'

const FALLBACK_IMG = "https://placehold.co/300x450/1f2937/facc15?text=No+Image"
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
      className="group block overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/20 hover:shadow-yellow-400/10 sm:rounded-[22px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0f0f0f]">
        <img 
          src={movie.hinhAnh || FALLBACK_IMG}
          alt={`Poster phim ${movie.tenPhim}`}
          loading="lazy"
          onError={(e) => { 
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/15 opacity-90 transition-opacity duration-300"></div>

        <div className="absolute left-2 top-2 flex flex-wrap gap-1 pr-2">
          {movie.hot && <Badge color="bg-red-500" label="Phim hot">HOT</Badge>}
          {movie.dangChieu && <Badge color="bg-green-500" label="Đang chiếu">Đang chiếu</Badge>}
          {movie.sapChieu && <Badge color="bg-blue-500" label="Sắp chiếu">Sắp chiếu</Badge>}
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
          <FontAwesomeIcon icon={faStar} className="text-[10px] text-yellow-400 sm:text-sm" />
          <span className="text-[10px] font-medium text-white sm:text-sm">
            {movie.danhGia ?? "N/A"}/10
          </span>
        </div>

        <div className="absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          <span className="scale-90 transform rounded-full bg-yellow-400 px-4 py-2 font-bold text-gray-900 shadow-lg transition-transform group-hover:scale-100">
           Xem Chi Tiết
          </span>
        </div>
      </div>

    
      <div className="p-3 sm:p-4">
        <h3 className="mb-1 line-clamp-2 min-h-[42px] text-sm font-semibold text-white transition-colors group-hover:text-yellow-400 sm:min-h-[56px] sm:text-lg">
          {movie.tenPhim}
        </h3>
        <p className="flex items-center gap-1 text-[11px] text-gray-400 sm:text-sm">
          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] sm:text-xs" />
          <span>{formatDate(movie.ngayKhoiChieu)}</span>
        </p>
      </div>
    </Link>
  )
}


export default memo(MovieCard)

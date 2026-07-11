import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, faArrowLeft, faClapperboard, faHouse } from '../utils/fontAwesome'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-lg w-full text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        
        <FontAwesomeIcon icon={faClapperboard} className="mb-4 text-6xl animate-bounce text-yellow-400" />

        <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent leading-none">
          404
        </h1>

        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white">
          Oops! Trang không tồn tại
        </h2>

        <p className="mt-3 text-gray-400 leading-relaxed">
           <span className="text-yellow-400 font-semibold">"Xin lỗi, trang bạn đang tìm kiếm không tồn tại"</span>.  
          Hãy quay về trang chủ để khám phá thêm nhiều phim hấp dẫn nhé!
        </p>

        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>Về trang chủ</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white hover:bg-white/10 font-semibold transition-all hover:scale-105"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại</span>
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Hoặc thử <Link to="/movie" className="text-yellow-400 hover:underline">tìm phim ngay</Link>
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage

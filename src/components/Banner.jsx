import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const banners = [
    {
        id: 1,
        image: "https://movienew.cybersoft.edu.vn/hinhanh/ban-tay-diet-quy.png",
        title: "Bàn Tay Diệt Quỷ",
        description: "Bộ phim hành động kinh dị đầy kịch tính"
    },
    {
        id: 1283,
        image: "https://movienew.cybersoft.edu.vn/hinhanh/lat-mat-48h.png",
        title: "Lật Mặt 48H",
        description: "Cuộc đua sinh tử trong 48 giờ"
    },
    {
        id: 3,
        image: "https://movienew.cybersoft.edu.vn/hinhanh/cuoc-chien-sinh-tu.png",
        title: "Cuộc Chiến Sinh Tử",
        description: "Trận chiến không khoan nhượng"
    }
]

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const navigate = useNavigate()

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    }, [])

    const goToSlide = (index) => setCurrentSlide(index)

    const handleViewDetail = (id) => {
        navigate(`/movie/${id}`)
    }

    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(nextSlide, 5000)
        return () => clearInterval(interval)
    }, [isPaused, nextSlide])

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
                {banners.map((banner) => (
                    <div key={banner.id} className="relative w-full h-full flex-shrink-0">
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-gray-950/20 to-transparent" />

                        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 max-w-xl text-white animate-fadeIn">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 drop-shadow-lg">
                                {banner.title}
                            </h2>
                            <p className="text-sm md:text-base lg:text-lg mb-3 md:mb-5 text-gray-200 drop-shadow line-clamp-2">
                                {banner.description}
                            </p>
                            <button
                                onClick={() => handleViewDetail(banner.id)}
                                className="cursor-pointer px-4 md:px-6 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 rounded-md font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="cursor-pointer absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-lg md:text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                aria-label="Previous slide"
            >
                ❮
            </button>

            <button
                onClick={nextSlide}
                className="cursor-pointer absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-lg md:text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                aria-label="Next slide"
            >
                ❯
            </button>

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentSlide === index
                                ? 'w-8 bg-red-600'
                                : 'w-1.5 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-10">
                <div
                    key={currentSlide}
                    className={`h-full bg-red-600 ${!isPaused ? 'animate-progress' : ''}`}
                    style={{ width: isPaused ? '0%' : '100%' }}
                />
            </div>

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
    )
}

export default Banner


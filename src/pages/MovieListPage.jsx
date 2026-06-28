import React from 'react'
import { useMovieList } from '../hooks/useMovies'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard'
import Banner from '../components/Banner'

const MovieListPage = () => {
    const { data: movies, isLoading, isError, error } = useMovieList("GP01")

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Hero Banner */}
            <Banner />

            <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Danh sách <span className="text-yellow-400">Phim</span>
                </h1>
                <p className="text-gray-400 text-lg mb-8">Khám phá hàng trăm bộ phim hấp dẫn</p>
                {/* Search Bar */}
                <div className="max-w-lg mx-auto relative">
                    <input type="text" placeholder="Tìm kiếm tên phim..." className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-full px-6 py-3 pr-12 outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
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
                <p className="text-gray-400 mb-6">
                    Hiển thị <span className="text-yellow-400 font-medium">{movies?.length || 0}</span> phim
                </p>
                {/* Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {
                        movies?.map((movie) => (
                            <MovieCard key={movie.maPhim} movie={movie} />
                        ))
                    }

                </div>
            </div>
        </div>

    )
}

export default MovieListPage

import {
  formatDate,
  truncateText,
} from "../../../utils/admin/filmManagementUtils";
import MoviePagination from "./MoviePagination";
import MovieTags from "./MovieTags";

const MovieListSection = ({
  isLoading,
  isError,
  error,
  paginatedMovies,
  filteredMovies,
  activePage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onSelectPage,
  onStartEdit,
  onRequestDelete,
  onOpenShowtime,
}) => (
  <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
    <div className="flex flex-col gap-4 border-b border-white/10 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
      <p className="text-lg text-white/75">
        Hiển thị{" "}
        <span className="font-semibold text-yellow-300">
          {paginatedMovies.length}
        </span>{" "}
        / {filteredMovies.length} phim
      </p>
    </div>

    {isLoading ? (
      <div className="px-8 py-20 text-center text-lg text-white/75">
        Tải danh sách phim...
      </div>
    ) : null}

    {isError ? (
      <div className="px-8 py-20 text-center">
        <p className="text-2xl font-semibold text-red-400">
          Không thể tải danh sách phim.
        </p>
        <p className="mt-3 text-lg text-white/65">{error?.message}</p>
      </div>
    ) : null}

    {!isLoading && !isError ? (
      <>
        <div className="hidden grid-cols-[120px_120px_minmax(220px,1fr)_minmax(300px,1.2fr)_180px] gap-6 border-b border-white/10 bg-[#0e0e0e] px-8 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white xl:grid">
          <span>ID</span>
          <span>Hình ảnh</span>
          <span>Tên phim</span>
          <span>Mô tả</span>
          <span className="text-right">Hành động</span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="px-8 py-20 text-center text-lg text-white/75">
            Không có phim nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {paginatedMovies.map((movie) => (
              <div
                key={movie.maPhim}
                className="grid gap-6 px-8 py-7 xl:grid-cols-[120px_120px_minmax(220px,1fr)_minmax(300px,1.2fr)_180px] xl:items-start"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    ID
                  </p>
                  <p className="mt-2 text-2xl font-bold text-red-300">
                    #{movie.maPhim}
                  </p>
                  <p className="mt-3 text-sm text-white/65">
                    Phát hành: {formatDate(movie.ngayKhoiChieu)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    Hình ảnh
                  </p>
                  <div className="mt-2 h-32 w-24 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    Tên phim
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {movie.tenPhim}
                  </h3>
                  <MovieTags movie={movie} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    Mô tả
                  </p>
                  <p className="mt-2 text-lg leading-8 text-white/80">
                    {truncateText(movie.moTa)}
                  </p>
                  <p className="mt-4 text-sm text-white/65">
                    Đánh giá: {movie.danhGia ?? 0}/10
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    Hành động
                  </p>
                  <div className="mt-2 flex items-center gap-2 xl:justify-end">
                    <button
                      type="button"
                      onClick={() => onStartEdit(movie)}
                      aria-label={`Sửa phim ${movie.tenPhim}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition hover:bg-amber-400/20"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M4 20h4l10-10-4-4L4 16v4z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 7l4 4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(movie)}
                      aria-label={`Xóa phim ${movie.tenPhim}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 7h16" strokeLinecap="round" />
                        <path d="M10 11v6" strokeLinecap="round" />
                        <path d="M14 11v6" strokeLinecap="round" />
                        <path
                          d="M6 7l1 12h10l1-12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 7V4h6v3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenShowtime(movie)}
                      aria-label={`Tạo lịch chiếu cho phim ${movie.tenPhim}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8 3v4" strokeLinecap="round" />
                        <path d="M16 3v4" strokeLinecap="round" />
                        <path d="M4 9h16" strokeLinecap="round" />
                        <rect x="4" y="5" width="16" height="15" rx="2" />
                        <path d="M12 12v5" strokeLinecap="round" />
                        <path d="M9.5 14.5H14.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMovies.length > 0 ? (
          <MoviePagination
            activePage={activePage}
            totalPages={totalPages}
            filteredCount={filteredMovies.length}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
            onSelectPage={onSelectPage}
          />
        ) : null}
      </>
    ) : null}
  </div>
);

export default MovieListSection;

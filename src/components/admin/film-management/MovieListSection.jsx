import {
  formatDate,
  truncateText,
} from "../../../utils/admin/filmManagementUtils";
import MoviePagination from "./MoviePagination";
import MovieTags from "./MovieTags";

const MovieActionButtons = ({
  movie,
  onStartEdit,
  onRequestDelete,
  onOpenShowtime,
  compact = false,
}) => (
  <div className={`flex items-center gap-2 ${compact ? "" : "xl:justify-end"}`}>
    <button
      type="button"
      onClick={() => onStartEdit(movie)}
      aria-label={`Sửa phim ${movie.tenPhim}`}
      className={`inline-flex items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition hover:bg-amber-400/20 ${compact ? "h-9 w-9" : "h-11 w-11"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={compact ? "h-4 w-4" : "h-5 w-5"}
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
      className={`inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 ${compact ? "h-9 w-9" : "h-11 w-11"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={compact ? "h-4 w-4" : "h-5 w-5"}
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
      className={`inline-flex items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20 ${compact ? "h-9 w-9" : "h-11 w-11"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={compact ? "h-4 w-4" : "h-5 w-5"}
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
);

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
  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:rounded-[32px]">
    <div className="flex flex-col gap-2 border-b border-white/10 px-3 py-4 sm:px-6 sm:py-5">
      <h2 className="text-lg font-bold text-white sm:text-2xl">
        Danh sách phim
      </h2>
      <p className="text-xs text-white/65 sm:text-sm">
        Hiển thị{" "}
        <span className="font-semibold text-yellow-300">
          {paginatedMovies.length}
        </span>{" "}
        / {filteredMovies.length} phim
      </p>
    </div>

    {isLoading ? (
      <div className="px-4 py-16 text-center text-sm text-white/75 sm:px-8 sm:py-20 sm:text-lg">
        Tải danh sách phim...
      </div>
    ) : null}

    {isError ? (
      <div className="px-4 py-16 text-center sm:px-8 sm:py-20">
        <p className="text-lg font-semibold text-red-400 sm:text-2xl">
          Không thể tải danh sách phim.
        </p>
        <p className="mt-3 text-sm text-white/65 sm:text-lg">{error?.message}</p>
      </div>
    ) : null}

    {!isLoading && !isError ? (
      <>
        <div className="hidden grid-cols-[110px_110px_minmax(220px,1fr)_minmax(260px,1.1fr)_170px] gap-6 border-b border-white/10 bg-[#0e0e0e] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/75 xl:grid">
          <span>ID</span>
          <span>Hình ảnh</span>
          <span>Tên phim</span>
          <span>Mô tả</span>
          <span className="text-right">Hành động</span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-white/75 sm:px-8 sm:py-20 sm:text-lg">
            Không có phim nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            <div className="space-y-3 p-3 xl:hidden">
              {paginatedMovies.map((movie) => (
                <div
                  key={movie.maPhim}
                  className="rounded-[22px] border border-white/10 bg-[#141414] p-3.5 sm:p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] sm:h-28 sm:w-20">
                      <img
                        src={movie.hinhAnh}
                        alt={movie.tenPhim}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                        #{movie.maPhim}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white sm:text-lg">
                        {movie.tenPhim}
                      </h3>
                      <MovieTags movie={movie} compact />
                      <p className="mt-3 text-[11px] text-white/55 sm:text-xs">
                        Phát hành: {formatDate(movie.ngayKhoiChieu)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-white/65 sm:text-sm">
                        {truncateText(movie.moTa, 88)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <p className="text-[11px] text-white/55 sm:text-xs">
                      Đánh giá:{" "}
                      <span className="font-semibold text-white">
                        {movie.danhGia ?? 0}/10
                      </span>
                    </p>
                    <MovieActionButtons
                      movie={movie}
                      onStartEdit={onStartEdit}
                      onRequestDelete={onRequestDelete}
                      onOpenShowtime={onOpenShowtime}
                      compact
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden divide-y divide-white/10 xl:block">
            {paginatedMovies.map((movie) => (
              <div
                key={movie.maPhim}
                className="grid gap-6 px-6 py-6 xl:grid-cols-[110px_110px_minmax(220px,1fr)_minmax(260px,1.1fr)_170px] xl:items-start"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    ID
                  </p>
                  <p className="mt-2 text-xl font-bold text-red-300">
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
                  <div className="mt-2 h-28 w-20 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
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
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {movie.tenPhim}
                  </h3>
                  <MovieTags movie={movie} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">
                    Mô tả
                  </p>
                  <p className="mt-2 text-base leading-7 text-white/80">
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
                  <div className="mt-2">
                    <MovieActionButtons
                      movie={movie}
                      onStartEdit={onStartEdit}
                      onRequestDelete={onRequestDelete}
                      onOpenShowtime={onOpenShowtime}
                    />
                  </div>
                </div>
              </div>
            ))}
            </div>
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

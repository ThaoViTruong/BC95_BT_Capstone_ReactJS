const MoviePagination = ({
  activePage,
  totalPages,
  filteredCount,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <div className="flex flex-col gap-4 border-t border-white/10 px-3 py-4 sm:px-6 sm:py-5 xl:flex-row xl:items-center xl:justify-between">
    <p className="text-xs text-white/75 sm:text-sm">
      Trang <span className="font-semibold text-white">{activePage}</span> /{" "}
      {totalPages} - tổng cộng {filteredCount} phim
    </p>
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onPreviousPage}
        disabled={activePage === 1}
        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
      >
        Trước
      </button>
      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => onSelectPage(page)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activePage === page
                ? "bg-red-600 text-white"
                : "border border-white/10 text-white hover:bg-white/5"
            }`}
          >
            {page}
          </button>
        ),
        )}
      </div>
      <span className="inline-flex min-w-[48px] items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white sm:hidden">
        {activePage}/{totalPages}
      </span>
      <button
        type="button"
        onClick={onNextPage}
        disabled={activePage === totalPages}
        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
      >
        Sau
      </button>
    </div>
  </div>
);

export default MoviePagination;

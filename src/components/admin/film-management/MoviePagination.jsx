const MoviePagination = ({
  activePage,
  totalPages,
  filteredCount,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <div className="flex flex-col gap-5 border-t border-white/10 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
    <p className="text-base text-white/75">
      Trang <span className="font-semibold text-white">{activePage}</span> /{" "}
      {totalPages} - tổng cộng {filteredCount} phim
    </p>
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onPreviousPage}
        disabled={activePage === 1}
        className="rounded-2xl border border-white/10 px-4 py-3 text-base text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => onSelectPage(page)}
            className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
              activePage === page
                ? "bg-red-600 text-white"
                : "border border-white/10 text-white hover:bg-white/5"
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={onNextPage}
        disabled={activePage === totalPages}
        className="rounded-2xl border border-white/10 px-4 py-3 text-base text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  </div>
);

export default MoviePagination;

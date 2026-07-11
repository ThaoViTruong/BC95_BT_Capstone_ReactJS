import {
  FontAwesomeIcon,
  faFilter,
  faMagnifyingGlass,
} from "../../../utils/fontAwesome";

const MovieFilterBar = ({
  searchValue,
  statusFilter,
  onSearchChange,
  onStatusChange,
  statusOptions,
}) => (
  <div className="rounded-[24px] border border-white/10 bg-[#151515] p-3 sm:p-5">
    <div className="grid grid-cols-[minmax(0,1fr)_132px] items-end gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div>
        <label
          htmlFor="film-search"
          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:mb-3 sm:text-xs"
        >
          Tìm kiếm
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35 sm:left-3.5 sm:h-4 sm:w-4"
          />
          <input
            id="film-search"
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Tìm tên phim hoặc mã phim..."
            className="w-full rounded-xl border border-white/10 bg-[#181818] py-2 pl-8 pr-3 text-xs text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 sm:rounded-2xl sm:py-4 sm:pl-11 sm:pr-5 sm:text-base"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="film-status"
          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:mb-3 sm:text-xs"
        >
          Trạng thái
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faFilter}
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35 sm:left-3.5 sm:h-4 sm:w-4"
          />
          <select
            id="film-status"
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#181818] py-2 pl-8 pr-8 text-xs text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 sm:rounded-2xl sm:py-4 sm:pl-11 sm:pr-10 sm:text-base"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default MovieFilterBar;

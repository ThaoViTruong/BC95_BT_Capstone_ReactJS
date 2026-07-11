import { FontAwesomeIcon, faPlus } from "../../../utils/fontAwesome";

const MovieFilterBar = ({
  searchValue,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onOpenAddModal,
  statusOptions,
  labelClassName,
  inputClassName,
}) => (
  <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px_180px] xl:items-end">
      <div>
        <label htmlFor="film-search" className={labelClassName}>
          Tìm kiếm
        </label>
        <input
          id="film-search"
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Tìm kiếm bằng tên hoặc ID của phim..."
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="film-status" className={labelClassName}>
          Trạng thái
        </label>
        <select
          id="film-status"
          value={statusFilter}
          onChange={onStatusChange}
          className={inputClassName}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={onOpenAddModal}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 px-4 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Thêm phim</span>
      </button>
    </div>
  </div>
);

export default MovieFilterBar;

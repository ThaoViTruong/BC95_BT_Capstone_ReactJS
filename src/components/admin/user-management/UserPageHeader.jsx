import { FontAwesomeIcon, faMagnifyingGlass } from "../../../utils/fontAwesome";

const SearchResultLabel = ({ appliedKeyword }) => {
  if (!appliedKeyword) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-white/70">
      Kết quả tìm kiếm cho:{" "}
      <span className="font-medium text-yellow-400">{appliedKeyword}</span>
    </p>
  );
};

const UserPageHeader = ({
  currentPage,
  totalPages,
  totalCount,
  appliedKeyword,
  searchKeyword,
  onSearchSubmit,
  onSearchChange,
  onOpenAddModal,
}) => (
  <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
    <div>
      <h2 className="text-3xl font-bold text-white">Danh sách người dùng</h2>
      <p className="mt-2 text-base text-white/80">
        Trang <span className="font-medium text-yellow-400">{currentPage}</span>{" "}
        / {totalPages} - Tổng{" "}
        <span className="font-medium text-yellow-400">{totalCount}</span> người
        dùng
      </p>
      <SearchResultLabel appliedKeyword={appliedKeyword} />
    </div>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <form onSubmit={onSearchSubmit} className="relative w-full sm:w-80">
        <input
          type="text"
          value={searchKeyword}
          onChange={onSearchChange}
          placeholder="Tìm theo tên, tài khoản, email..."
          className="w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 pr-12 text-base text-white outline-none transition-all placeholder:text-white/40 focus:ring-2 focus:ring-yellow-400"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Tìm kiếm người dùng"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
        </button>
      </form>
      <button
        type="button"
        onClick={onOpenAddModal}
        className="rounded-xl bg-yellow-400 px-5 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-yellow-500"
      >
        Thêm người dùng
      </button>
    </div>
  </div>
);

export default UserPageHeader;

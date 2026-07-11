import {
  FontAwesomeIcon,
  faChevronLeft,
  faChevronRight,
} from "../../../utils/fontAwesome";

const UserPagination = ({
  currentPage,
  totalPages,
  paginationItems,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <div className="mt-6 flex items-center justify-center gap-2">
    <button
      type="button"
      onClick={onPreviousPage}
      disabled={currentPage === 1}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
      <span>Trước</span>
    </button>

    {paginationItems.map((item, index) =>
      item === "ellipsis" ? (
        <span
          key={`ellipsis-${index}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-sm font-medium text-white/55"
        >
          ...
        </span>
      ) : (
        <button
          key={item}
          type="button"
          onClick={() => onSelectPage(item)}
          className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors ${
            item === currentPage
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {item}
        </button>
      ),
    )}

    <button
      type="button"
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span>Sau</span>
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  </div>
);

export default UserPagination;

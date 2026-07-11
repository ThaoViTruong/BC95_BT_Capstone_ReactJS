export const ITEMS_PER_PAGE = 8;

export const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "dangChieu", label: "Đang chiếu" },
  { value: "sapChieu", label: "Sắp chiếu" },
  { value: "hot", label: "Nổi bật" },
];

export const labelClassName =
  "mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-white";
export const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export const getMoviesFromQueryData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

export const formatDate = (dateValue) => {
  if (!dateValue) return "Chưa cập nhật";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
  return date.toLocaleDateString("vi-VN");
};

export const truncateText = (text, maxLength = 140) => {
  if (!text) return "Chưa có mô tả.";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

export const getMovieStats = (movies) => ({
  total: movies.length,
  dangChieu: movies.filter((movie) => movie.dangChieu).length,
  sapChieu: movies.filter((movie) => movie.sapChieu).length,
  hot: movies.filter((movie) => movie.hot).length,
});

export const matchesMovieKeyword = (movie, normalizedKeyword) => {
  if (!normalizedKeyword) {
    return true;
  }

  return (
    movie.tenPhim?.toLowerCase().includes(normalizedKeyword) ||
    String(movie.maPhim).includes(normalizedKeyword)
  );
};

export const matchesMovieStatus = (movie, statusFilter) => {
  if (statusFilter === "all") return true;
  if (statusFilter === "dangChieu") return movie.dangChieu;
  if (statusFilter === "sapChieu") return movie.sapChieu;
  if (statusFilter === "hot") return movie.hot;
  return false;
};

export const filterMovies = (movies, searchValue, statusFilter) => {
  const normalizedKeyword = searchValue.trim().toLowerCase();

  return movies.filter((movie) => {
    return (
      matchesMovieKeyword(movie, normalizedKeyword) &&
      matchesMovieStatus(movie, statusFilter)
    );
  });
};

export const paginateMovies = (movies, currentPage, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(movies.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;

  return {
    totalPages,
    activePage,
    items: movies.slice(startIndex, startIndex + pageSize),
  };
};

export const getMovieTags = (movie) => {
  const tags = [];
  if (movie.hot) {
    tags.push({
      label: "Nổi bật",
      className: "border border-red-500/20 bg-red-500/10 text-red-300",
    });
  }
  if (movie.dangChieu) {
    tags.push({
      label: "Đang chiếu",
      className:
        "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    });
  }
  if (movie.sapChieu) {
    tags.push({
      label: "Sắp chiếu",
      className: "border border-sky-500/20 bg-sky-500/10 text-sky-300",
    });
  }
  return tags;
};

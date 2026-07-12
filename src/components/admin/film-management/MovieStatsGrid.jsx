const statsConfig = [
  {
    label: "Tổng",
    valueKey: "total",
    valueClassName: "text-white",
    hint: "Tổng số phim",
  },
  {
    label: "Đang",
    valueKey: "dangChieu",
    valueClassName: "text-emerald-300",
    hint: "Đang chiếu",
  },
  {
    label: "Sắp",
    valueKey: "sapChieu",
    valueClassName: "text-sky-300",
    hint: "Sắp chiếu",
  },
  {
    label: "Hot",
    valueKey: "hot",
    valueClassName: "text-red-300",
    hint: "Nổi bật",
  },
];

const MovieStatsGrid = ({ movieStats }) => (
  <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
    {statsConfig.map((item) => (
      <div
        key={item.valueKey}
        className="rounded-[18px] border border-white/10 bg-[#151515] px-2 py-2.5 sm:rounded-[28px] sm:px-5 sm:py-5"
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:text-xs sm:tracking-[0.22em]">
          {item.label}
        </p>
        <p className={`mt-1.5 text-xl font-black leading-none sm:mt-3 sm:text-4xl ${item.valueClassName}`}>
          {movieStats[item.valueKey]}
        </p>
        <p className="mt-1 hidden text-[11px] text-white/45 sm:mt-2 sm:block sm:text-sm">
          {item.hint}
        </p>
      </div>
    ))}
  </div>
);

export default MovieStatsGrid;

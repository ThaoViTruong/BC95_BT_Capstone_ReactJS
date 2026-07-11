const MovieStatsGrid = ({ movieStats }) => (
  <div className="grid gap-5 xl:grid-cols-4">
    <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
        Tổng số phim
      </p>
      <p className="mt-4 text-4xl font-bold text-white">{movieStats.total}</p>
    </div>
    <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
        Đang chiếu
      </p>
      <p className="mt-4 text-4xl font-bold text-yellow-300">
        {movieStats.dangChieu}
      </p>
    </div>
    <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
        Sắp chiếu
      </p>
      <p className="mt-4 text-4xl font-bold text-sky-300">
        {movieStats.sapChieu}
      </p>
    </div>
    <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
        Nổi bật
      </p>
      <p className="mt-4 text-4xl font-bold text-red-300">{movieStats.hot}</p>
    </div>
  </div>
);

export default MovieStatsGrid;

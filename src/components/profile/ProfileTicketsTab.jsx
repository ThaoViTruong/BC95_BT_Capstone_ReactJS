import {
  cardClassName,
  formatCurrency,
  formatDate,
  getTicketCinemaInfo,
  getTicketTotalPrice,
} from "../../utils/profile/profileUtils";

const ProfileTicketsTab = ({
  tickets,
  ticketCount,
  selectedTicket,
  onSelectTicket,
  activePage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white">
        Lịch sử mua hàng
      </h1>
    </div>

    <div className={cardClassName}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Danh sách đơn đã mua
          </h2>
        </div>
        <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
          Hiển thị {tickets.length} / {ticketCount} đơn
        </span>
      </div>

      {ticketCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center text-white/55">
          Bạn chưa có lịch sử mua hàng.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-2xl">
              <thead>
                <tr className=" text-left text-sm font-bold text-white">
                  <th className="px-5 py-4">Mã vé</th>
                  <th className="px-5 py-4">Phim</th>
                  <th className="px-5 py-4">Rạp</th>
                  <th className="px-5 py-4">Ngày đặt</th>
                  <th className="px-5 py-4">Tổng cộng</th>
                  <th className="px-5 py-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const cinemaInfo = getTicketCinemaInfo(ticket);
                  const isActive = selectedTicket?.maVe === ticket.maVe;
                  const totalPrice = getTicketTotalPrice(ticket);

                  return (
                    <tr
                      key={ticket.maVe}
                      className={`border-t border-white/10 text-sm text-white/85 ${
                        isActive ? "bg-yellow-400/10" : "bg-black/15"
                      }`}
                    >
                      <td className="px-5 py-4 font-semibold">
                        #{ticket.maVe}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {ticket.tenPhim}
                        </div>
                        <div className="mt-1 text-xs text-white/50">
                          {ticket.thoiLuongPhim || 0} phút
                        </div>
                      </td>
                      <td className="px-5 py-4">{cinemaInfo.heThongRap}</td>
                      <td className="px-5 py-4">
                        {formatDate(ticket.ngayDat)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-yellow-300">
                        {formatCurrency(totalPrice)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectTicket(ticket.maVe)}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "bg-yellow-400 text-gray-900"
                              : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.12]"
                          }`}
                        >
                          Xem vé
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-sm text-white/70">
              Trang <span className="font-semibold text-white">{activePage}</span>{" "}
              / {totalPages} - tổng cộng {ticketCount} đơn
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={activePage === 1}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onSelectPage(page)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      page === activePage
                        ? "bg-yellow-400 text-gray-900"
                        : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.1]"
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
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ProfileTicketsTab;

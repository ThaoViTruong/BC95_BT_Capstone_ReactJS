import {
  cardClassName,
  formatCurrency,
  formatDate,
  getTicketCinemaInfo,
  getTicketTotalPrice,
} from "../../utils/profile/profileUtils";
import { FontAwesomeIcon, faTicket } from "../../utils/fontAwesome";

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
  <div className="space-y-5 sm:space-y-6">
    <div className={cardClassName}>
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faTicket} className="text-sm text-amber-200" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
            Danh sách đơn đã mua
            </h2>
          </div>
        </div>
        <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-semibold text-yellow-300 sm:px-4 sm:py-2 sm:text-sm">
          Hiển thị {tickets.length} / {ticketCount} đơn
        </span>
      </div>

      {ticketCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center text-white/55">
          Bạn chưa có lịch sử mua hàng.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3 md:hidden">
            {tickets.map((ticket) => {
              const cinemaInfo = getTicketCinemaInfo(ticket);
              const isActive = selectedTicket?.maVe === ticket.maVe;
              const totalPrice = getTicketTotalPrice(ticket);

              return (
                <div
                  key={ticket.maVe}
                  className={`rounded-xl border px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4 ${
                    isActive
                      ? "border-yellow-400/40 bg-yellow-400/10"
                      : "border-white/10 bg-black/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white sm:text-sm">
                        #{ticket.maVe}
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-white sm:text-base">
                        {ticket.tenPhim}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-yellow-300 sm:text-sm">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-white/75 sm:mt-4 sm:space-y-2 sm:text-sm">
                    <p>Rạp: {cinemaInfo.heThongRap || "—"}</p>
                    <p>Ngày đặt: {formatDate(ticket.ngayDat)}</p>
                    <p>Thời lượng: {ticket.thoiLuongPhim || 0} phút</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTicket(ticket.maVe)}
                    className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold transition sm:mt-4 sm:px-4 sm:py-2.5 sm:text-sm ${
                      isActive
                        ? "bg-yellow-400 text-gray-900"
                        : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.12]"
                    }`}
                  >
                    Xem vé
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
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

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:gap-4 sm:pt-6 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-xs text-white/70 sm:text-sm">
              Trang <span className="font-semibold text-white">{activePage}</span>{" "}
              / {totalPages} - tổng cộng {ticketCount} đơn
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={activePage === 1}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onSelectPage(page)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
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
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
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

import { FontAwesomeIcon, faXmark } from "../../utils/fontAwesome";
import {
  formatCurrency,
  formatDateTime,
  getSeatTypeSummary,
  getTicketCinemaInfo,
  getTicketTotalPrice,
  getTicketUnitPrice,
  getUniqueSeats,
} from "../../utils/profile/profileUtils";

const SummaryCard = ({ label, value, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.03] p-4 ${className}`}
  >
    <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
    <div className="mt-2 text-sm font-medium text-white">{value}</div>
  </div>
);

const TicketDetailModal = ({ selectedTicket, onClose }) => {
  if (!selectedTicket) {
    return null;
  }

  const cinemaInfo = getTicketCinemaInfo(selectedTicket);
  const uniqueSeats = getUniqueSeats(selectedTicket);
  const seatLabels = uniqueSeats.map((seat) => `Ghế ${seat.tenGhe}`);
  const seatTypeSummary = getSeatTypeSummary(selectedTicket);
  const totalPrice = getTicketTotalPrice(selectedTicket);
  const unitPrice = getTicketUnitPrice(selectedTicket);
  const roomName =
    cinemaInfo.rap !== "Chưa có rạp" ? cinemaInfo.rap : "Chưa có thông tin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-white/10 bg-gradient-to-br from-[#071227] via-[#08111f] to-[#050b17] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-white transition hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-300"
          aria-label="Đóng chi tiết vé"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="mx-auto w-full max-w-[180px] lg:mx-0">
            <img
              src={selectedTicket.hinhAnh}
              alt={selectedTicket.tenPhim}
              className="h-[250px] w-full rounded-[22px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300/80">
              Chi tiết vé
            </p>
            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {selectedTicket.tenPhim}
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SummaryCard
                label="Mã đặt vé"
                value={`#${selectedTicket.maVe}`}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Ngày đặt"
                value={formatDateTime(selectedTicket.ngayDat)}
                className="border-white/10 bg-white/[0.03]"
              />
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <SummaryCard
                label="Phòng chiếu"
                value={roomName}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Đơn giá"
                value={formatCurrency(unitPrice)}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Cụm rạp"
                value={
                  <>
                    <p>{cinemaInfo.cumRap}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {cinemaInfo.heThongRap}
                    </p>
                  </>
                }
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Số vé"
                value={`${uniqueSeats.length} vé`}
                className="border-white/10 bg-white/[0.03]"
              />
            </div>

            <div
              className={`mt-3 grid gap-3 ${
                seatTypeSummary ? "md:grid-cols-2" : ""
              }`}
            >
              <SummaryCard
                label="Số ghế"
                value={
                  seatLabels.length
                    ? seatLabels.join(", ")
                    : "Chưa có dữ liệu ghế"
                }
                className="border-white/10 bg-white/[0.03]"
              />
              {seatTypeSummary ? (
                <SummaryCard
                  label="Loại ghế"
                  value={seatTypeSummary}
                  className="border-white/10 bg-white/[0.03]"
                />
              ) : null}
            </div>

            <div className="mt-5 border-t border-dashed border-yellow-400/20 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-red-200/70">
                    Tổng tiền
                  </p>
                  <p className="mt-2 text-3xl font-black text-yellow-300 sm:text-4xl">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Đóng chi tiết vé
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;

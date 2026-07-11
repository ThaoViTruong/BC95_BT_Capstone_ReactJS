import { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon, faArrowLeft } from "../utils/fontAwesome";
import { useSeatList, useBookTicket } from "../hooks/useBooking";
import { useToast } from "../components/ToastProvider";
import LoadingSpinner from "../components/LoadingSpinner";

const BookingMovie = () => {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data, isLoading, isError } = useSeatList(maLichChieu);
  const bookTicketMutation = useBookTicket();

  const [selectedSeats, setSelectedSeats] = useState([]);

  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + s.giaVe, 0),
    [selectedSeats]
  );

  const handleSelectSeat = (ghe) => {
    if (ghe.daDat) return;
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.maGhe === ghe.maGhe);
      if (exists) return prev.filter((s) => s.maGhe !== ghe.maGhe);
      return [...prev, ghe];
    });
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      showToast({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng chọn ít nhất 1 ghế!",
      });
      return;
    }

    const payload = {
      maLichChieu: Number(maLichChieu),
      danhSachVe: selectedSeats.map((seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe,
      })),
    };

    bookTicketMutation.mutate(payload, {
      onSuccess: () => {
        setSelectedSeats([]);
        showToast({
          type: "success",
          title: "Đặt vé thành công",
          message: "Bạn đã đặt vé thành công.",
        });
        navigate("/profile", { state: { activeTab: "history" } });
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Đặt vé thất bại",
          message:
            error?.response?.data?.content ||
            "Đặt vé thất bại, vui lòng thử lại!",
        });
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            Không tìm thấy thông tin lịch chiếu
          </p>
          <Link to="/movie" className="text-yellow-400 hover:underline">
            <span className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Quay lại danh sách phim</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const { thongTinPhim, danhSachGhe } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-3 pt-4 sm:px-4 sm:pt-6">
        <button
          onClick={() => navigate(-1)}
          className="group mb-5 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent text-xs text-gray-400 transition-colors hover:text-yellow-400 sm:mb-6 sm:gap-2 sm:text-sm"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Quay lại chọn suất chiếu
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 pb-8 sm:px-4 sm:pb-10 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6 sm:mb-8">
            <div className="mx-auto mb-2 h-1.5 w-4/5 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_24px_4px_rgba(250,204,21,0.35)] sm:h-2" />
            <p className="text-center text-xs text-gray-400 sm:text-sm">MÀN HÌNH</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 sm:rounded-2xl sm:p-6">
            <div className="overflow-x-auto pb-2">
              <div className="mx-auto grid w-max min-w-[440px] grid-cols-16 gap-1 sm:min-w-[640px] sm:gap-2">
                {danhSachGhe?.map((ghe) => {
                  const isSelected = selectedSeats.some(
                    (s) => s.maGhe === ghe.maGhe
                  );
                  const isVip = ghe.loaiGhe === "Vip";

                  let seatClass =
                    "flex h-7 w-7 items-center justify-center rounded text-[9px] font-bold transition-all sm:h-9 sm:w-9 sm:text-xs ";

                  if (ghe.daDat) {
                    seatClass +=
                      "cursor-not-allowed bg-gray-700 text-gray-500 opacity-70";
                  } else if (isSelected) {
                    seatClass +=
                      "bg-yellow-400 text-gray-900 scale-110 shadow-lg shadow-yellow-500/50";
                  } else if (isVip) {
                    seatClass +=
                      "bg-amber-600/80 text-white hover:bg-amber-500 hover:scale-110";
                  } else {
                    seatClass +=
                      "bg-green-600/80 text-white hover:bg-green-500 hover:scale-110";
                  }

                  return (
                    <button
                      key={ghe.maGhe}
                      disabled={ghe.daDat}
                      onClick={() => handleSelectSeat(ghe)}
                      className={seatClass}
                      title={`Ghế ${ghe.tenGhe} - ${ghe.loaiGhe}`}
                    >
                      {ghe.daDat ? "X" : ghe.tenGhe}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3 border-t border-gray-800 pt-3 text-[11px] sm:mt-6 sm:gap-6 sm:pt-4 sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-700 text-[9px] font-bold text-gray-500 sm:h-6 sm:w-6 sm:text-[10px]">
                  X
                </div>
                <span className="text-gray-400">Đã đặt</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-5 w-5 rounded bg-yellow-400 sm:h-6 sm:w-6" />
                <span className="text-gray-400">Đang chọn</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-5 w-5 rounded bg-green-600 sm:h-6 sm:w-6" />
                <span className="text-gray-400">Thường</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-5 w-5 rounded bg-amber-600 sm:h-6 sm:w-6" />
                <span className="text-gray-400">Vip</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60 lg:sticky lg:top-6 sm:rounded-2xl">
            {thongTinPhim?.hinhAnh && (
              <div className="relative h-32 overflow-hidden sm:h-40">
                <img
                  src={thongTinPhim.hinhAnh}
                  alt={thongTinPhim.tenPhim}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="line-clamp-2 text-lg font-bold text-white sm:text-xl">
                    {thongTinPhim.tenPhim}
                  </h2>
                </div>
              </div>
            )}

            <div className="space-y-3 p-3.5 sm:space-y-4 sm:p-5">
              <InfoRow label="Cụm rạp" value={thongTinPhim?.tenCumRap} />
              <InfoRow label="Địa chỉ" value={thongTinPhim?.diaChi} small />
              <InfoRow label="Rạp" value={thongTinPhim?.tenRap} />
              <InfoRow
                label="Ngày giờ chiếu"
                value={`${thongTinPhim?.ngayChieu || ""} - ${
                  thongTinPhim?.gioChieu || ""
                }`}
              />

              <div className="pt-3 border-t border-gray-800">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Ghế đã chọn
                </p>
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[...selectedSeats]
                      .sort((a, b) => (a.stt || 0) - (b.stt || 0))
                      .map((s) => (
                        <span
                          key={s.maGhe}
                          className={`rounded px-2 py-1 text-[11px] font-bold sm:text-xs ${
                            s.loaiGhe === "Vip"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-green-500/20 text-green-400 border border-green-500/40"
                          }`}
                        >
                          {s.tenGhe}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-600 sm:text-sm">
                    Chưa chọn ghế nào
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 border-t border-gray-800 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-gray-400">Tổng tiền</span>
                <span className="text-lg font-bold text-yellow-400 sm:text-2xl">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={
                  bookTicketMutation.isPending || selectedSeats.length === 0
                }
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-sm
                           hover:from-red-500 hover:to-red-600 
                           disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed
                           text-white font-bold sm:text-lg transition-all
                           shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:shadow-none"
              >
                {bookTicketMutation.isPending
                  ? "Đang xử lý..."
                  : `Đặt vé (${selectedSeats.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, small = false }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className={`text-white ${small ? "text-xs" : "text-sm"} font-medium`}>
      {value || "—"}
    </p>
  </div>
);

export default BookingMovie;


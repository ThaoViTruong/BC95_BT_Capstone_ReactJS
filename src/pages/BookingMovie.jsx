import { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSeatList, useBookTicket } from "../hooks/useBooking";
import LoadingSpinner from "../components/LoadingSpinner";
import BookingSuccessModal from "../components/BookingSuccessModal";

const BookingMovie = () => {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSeatList(maLichChieu);
  const bookTicketMutation = useBookTicket();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      alert("Vui lòng chọn ít nhất 1 ghế!");
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
        setShowSuccessModal(true);
        setSelectedSeats([]);
      },
      onError: (error) => {
        alert(
          error?.response?.data?.content ||
            "Đặt vé thất bại, vui lòng thử lại!"
        );
      },
    });
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    navigate("/profile", { state: { activeTab: "history" } });
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
            ← Quay lại danh sách phim
          </Link>
        </div>
      </div>
    );
  }

  const { thongTinPhim, danhSachGhe } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 
                     transition-colors mb-6 group cursor-pointer bg-transparent border-0"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Quay lại chọn suất chiếu
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="mx-auto w-4/5 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mb-2 shadow-[0_0_30px_5px_rgba(250,204,21,0.4)]" />
            <p className="text-center text-gray-400 text-sm">MÀN HÌNH</p>
          </div>

          <div className="bg-gray-900/60 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-16 gap-2 justify-center">
              {danhSachGhe?.map((ghe) => {
                const isSelected = selectedSeats.some(
                  (s) => s.maGhe === ghe.maGhe
                );
                const isVip = ghe.loaiGhe === "Vip";

                let seatClass =
                  "w-8 h-8 sm:w-9 sm:h-9 rounded text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all cursor-pointer ";

                if (ghe.daDat) {
                  seatClass +=
                    "bg-gray-700 text-gray-500 cursor-not-allowed opacity-70";
                } else if (isSelected) {
                  seatClass +=
                    "bg-yellow-400 text-gray-900 scale-110 shadow-lg shadow-yellow-500/50";
                } else if (isVip) {
                  seatClass +=
                    "bg-amber-600/80 hover:bg-amber-500 text-white hover:scale-110";
                } else {
                  seatClass +=
                    "bg-green-600/80 hover:bg-green-500 text-white hover:scale-110";
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

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-gray-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-[10px] font-bold">
                  X
                </div>
                <span className="text-gray-400">Đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 rounded" />
                <span className="text-gray-400">Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded" />
                <span className="text-gray-400">Thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-600 rounded" />
                <span className="text-gray-400">Vip</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden sticky top-6">
            {thongTinPhim?.hinhAnh && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={thongTinPhim.hinhAnh}
                  alt={thongTinPhim.tenPhim}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="text-xl font-bold text-white line-clamp-2">
                    {thongTinPhim.tenPhim}
                  </h2>
                </div>
              </div>
            )}

            <div className="p-5 space-y-4">
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
                  <div className="flex flex-wrap gap-2">
                    {[...selectedSeats]
                      .sort((a, b) => (a.stt || 0) - (b.stt || 0))
                      .map((s) => (
                        <span
                          key={s.maGhe}
                          className={`px-2 py-1 rounded text-xs font-bold ${
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
                  <p className="text-gray-600 text-sm italic">
                    Chưa chọn ghế nào
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-400">Tổng tiền</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={
                  bookTicketMutation.isPending || selectedSeats.length === 0
                }
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 
                           hover:from-red-500 hover:to-red-600 
                           disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed
                           text-white font-bold text-lg transition-all
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

      <BookingSuccessModal
        isOpen={showSuccessModal}
        onConfirm={handleConfirmSuccess}
        onClose={() => setShowSuccessModal(false)}
      />
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


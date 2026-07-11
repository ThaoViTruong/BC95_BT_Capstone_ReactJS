import { Fragment, useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FontAwesomeIcon,
  faChevronLeft,
  faChevronRight,
  faClock,
  faMagnifyingGlass,
  faPlus,
  faTicket,
  faUsers,
} from "../../utils/fontAwesome";
import LoadingSpinner from "../../components/LoadingSpinner";
import { cinemaApi } from "../../api/cinemaApi";
import { useHeThongRap } from "../../hooks/useCinema";

const MA_NHOM = "GP01";
const TIME_SLOTS = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "00:00",
  "02:00",
  "04:00",
  "06:00",
];
const HALL_COLUMN_WIDTH = 220;
const TIME_SLOT_MIN_WIDTH = 92;
const TIMELINE_MIN_WIDTH =
  HALL_COLUMN_WIDTH + TIME_SLOTS.length * TIME_SLOT_MIN_WIDTH;
const DAY_START_HOUR = 8;
const SLOT_INTERVAL_MINUTES = 120;
const DEFAULT_SHOWTIME_DURATION_MINUTES = 90;
const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
});

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const statusStyles = {
  active: {
    container:
      "border-red-500/70 bg-gradient-to-br from-[#161616] to-[#1d1116] shadow-[0_0_0_1px_rgba(239,68,68,0.15)]",
    badge: "bg-red-500/20 text-red-300",
    label: "ĐANG MỞ BÁN",
  },
  soldOut: {
    container:
      "border-yellow-500/60 bg-gradient-to-br from-[#171512] to-[#20190a] shadow-[0_0_0_1px_rgba(234,179,8,0.16)]",
    badge: "bg-yellow-500/20 text-yellow-200",
    label: "HẾT VÉ",
  },
  ended: {
    container:
      "border-white/10 bg-gradient-to-br from-[#161616] to-[#131313] opacity-55",
    badge: "bg-white/10 text-white/60",
    label: "ĐÃ KẾT THÚC",
  },
};

const createDateOptions = () => {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      value: formatDateKey(date),
      label: DATE_LABEL_FORMATTER.format(date).replace(
        /^\p{Letter}/u,
        (letter) => letter.toUpperCase(),
      ),
      index,
    };
  });
};

const getShortTitle = (title) => {
  if (!title) {
    return "Suất chiếu";
  }

  return title.length > 12 ? `${title.slice(0, 11)}...` : title;
};

const formatRuntime = (minutes) => {
  const endHour = 8 + Math.floor(minutes / 60);
  const endMinute = String(minutes % 60).padStart(2, "0");
  return `${String(endHour).padStart(2, "0")}:${endMinute}`;
};

const formatTimeLabel = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isSameDay = (date, targetDate) => {
  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
};

const getTimelineSlotIndex = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  let hour = date.getHours();
  if (hour < DAY_START_HOUR) {
    hour += 24;
  }

  const timelineMinutes =
    (hour - DAY_START_HOUR) * 60 + date.getMinutes();

  if (timelineMinutes < 0) {
    return null;
  }

  const slotIndex = Math.floor(timelineMinutes / SLOT_INTERVAL_MINUTES);

  if (slotIndex < 0 || slotIndex >= TIME_SLOTS.length) {
    return null;
  }

  return slotIndex;
};

const getShowtimeStatusKey = (dateValue) => {
  const showtimeDate = new Date(dateValue);

  if (Number.isNaN(showtimeDate.getTime())) {
    return "ended";
  }

  return showtimeDate < new Date() ? "ended" : "active";
};

const buildTimeRange = (dateValue) => {
  const startDate = new Date(dateValue);

  if (Number.isNaN(startDate.getTime())) {
    return "";
  }

  const endDate = new Date(
    startDate.getTime() + DEFAULT_SHOWTIME_DURATION_MINUTES * 60 * 1000,
  );

  return `${formatTimeLabel(startDate)} - ${formatTimeLabel(endDate)}`;
};

const getHallId = (heThong, cumRap, lich) => {
  return `${heThong.maHeThongRap}-${cumRap.maCumRap}-${String(
    lich.tenRap || cumRap.tenCumRap,
  )
    .trim()
    .toLowerCase()}`;
};

const getHallName = (cumRap, lich) => {
  return lich.tenRap || cumRap.tenCumRap || "Phòng chiếu";
};

const getHallFormat = (heThong, cumRap) => {
  return `${heThong.tenHeThongRap} - ${cumRap.tenCumRap}`;
};

const sortHallItems = (hallEntries) => {
  return hallEntries.sort((a, b) => {
    const byFormat = a.format.localeCompare(b.format, "vi");

    if (byFormat !== 0) {
      return byFormat;
    }

    return a.name.localeCompare(b.name, "vi");
  });
};

const buildActualShowtimeEntries = (scheduleSystems, activeDate, keyword) => {
  if (!activeDate) {
    return [];
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const selectedDate = new Date(`${activeDate}T00:00:00`);

  return scheduleSystems.flatMap((heThong) =>
    (heThong.lstCumRap || []).flatMap((cumRap) =>
      (cumRap.danhSachPhim || []).flatMap((phim) =>
        (phim.lstLichChieuTheoPhim || [])
          .map((lich) => {
            const showtimeDate = new Date(lich.ngayChieuGioChieu);
            const startSlot = getTimelineSlotIndex(lich.ngayChieuGioChieu);

            if (
              Number.isNaN(showtimeDate.getTime()) ||
              !isSameDay(showtimeDate, selectedDate) ||
              startSlot === null
            ) {
              return null;
            }

            const searchValues = [
              phim.tenPhim,
              heThong.tenHeThongRap,
              cumRap.tenCumRap,
              cumRap.diaChi,
              lich.tenRap,
            ]
              .filter(Boolean)
              .map((value) => String(value).toLowerCase());

            if (
              normalizedKeyword &&
              !searchValues.some((value) => value.includes(normalizedKeyword))
            ) {
              return null;
            }

            return {
              id: String(lich.maLichChieu),
              hallId: getHallId(heThong, cumRap, lich),
              hallName: getHallName(cumRap, lich),
              hallFormat: getHallFormat(heThong, cumRap),
              movieId: phim.maPhim,
              title: getShortTitle(phim.tenPhim),
              poster: phim.hinhAnh,
              startSlot,
              span: 1,
              timeRange: buildTimeRange(lich.ngayChieuGioChieu),
              statusKey: getShowtimeStatusKey(lich.ngayChieuGioChieu),
            };
          })
          .filter(Boolean),
      ),
    ),
  );
};

const getHallItems = (entries) => {
  const hallMap = new Map();

  entries.forEach((entry) => {
    if (!hallMap.has(entry.hallId)) {
      hallMap.set(entry.hallId, {
        id: entry.hallId,
        name: entry.hallName,
        format: entry.hallFormat,
      });
    }
  });

  return sortHallItems(Array.from(hallMap.values()));
};

const groupEntriesByHall = (entries, hallItems) => {
  return hallItems.reduce((result, hall) => {
    result[hall.id] = entries.filter((entry) => entry.hallId === hall.id);
    return result;
  }, {});
};

const getNextDateValue = (dateOptions, activeDate, direction) => {
  const currentIndex = dateOptions.findIndex((item) => item.value === activeDate);
  const nextIndex = Math.min(
    Math.max(currentIndex + direction, 0),
    dateOptions.length - 1,
  );

  return dateOptions[nextIndex].value;
};

const StatCard = ({ accentClassName, icon, label, value, subValue }) => (
  <div
    className={`rounded-[28px] border bg-[#121212] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)] ${accentClassName}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl text-white/80">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-white/55">{label}</p>
        <p className="mt-2 text-4xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/50">{subValue}</p>
      </div>
    </div>
  </div>
);

const ShowtimeCard = ({ entry, onOpenCreate }) => {
  const style = statusStyles[entry.statusKey];
  const isCompact = entry.span === 1;

  return (
    <button
      type="button"
      onClick={() => entry.movieId && onOpenCreate(entry.movieId)}
      className={`flex h-full w-full rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)] ${style.container} ${isCompact ? "items-start gap-2 p-2.5" : "items-start gap-3 p-3"}`}
    >
      {entry.poster ? (
        <img
          src={entry.poster}
          alt={entry.title}
          className={`rounded-xl object-cover ${isCompact ? "h-12 w-10" : "h-16 w-12"}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-xl bg-white/5 text-xs text-white/35 ${isCompact ? "h-12 w-10" : "h-16 w-12"}`}
        >
          N/A
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold text-white ${isCompact ? "text-xs leading-5" : "text-sm"}`}
        >
          {entry.title}
        </p>
        <p className={`mt-1 text-white/55 ${isCompact ? "text-[11px]" : "text-xs"}`}>
          {entry.timeRange}
        </p>
        <span
          className={`mt-3 inline-flex max-w-full rounded-full font-semibold ${style.badge} ${isCompact ? "px-2 py-1 text-[10px] tracking-[0.12em]" : "px-2.5 py-1 text-[10px] tracking-[0.2em]"}`}
        >
          {style.label}
        </span>
      </div>
    </button>
  );
};

const ShowtimeManagementPage = () => {
  const navigate = useNavigate();
  const { data: heThongRap = [], isLoading: isLoadingHeThongRap } =
    useHeThongRap();
  const dateOptions = useMemo(() => createDateOptions(), []);
  const [activeDate, setActiveDate] = useState(dateOptions[0]?.value || "");
  const [keyword, setKeyword] = useState("");
  const lichChieuQueries = useQueries({
    queries: heThongRap.map((heThong) => ({
      queryKey: ["adminShowtimeSystem", heThong.maHeThongRap, MA_NHOM],
      queryFn: async () => {
        const response = await cinemaApi.getLichChieuHeThongRap(
          heThong.maHeThongRap,
        );
        return response.data.content?.[0] || null;
      },
      enabled: Boolean(heThong.maHeThongRap),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const activeDateOption =
    dateOptions.find((item) => item.value === activeDate) || dateOptions[0];
  const scheduleSystems = useMemo(
    () => lichChieuQueries.map((query) => query.data).filter(Boolean),
    [lichChieuQueries],
  );
  const entries = useMemo(
    () => buildActualShowtimeEntries(scheduleSystems, activeDate, keyword),
    [scheduleSystems, activeDate, keyword],
  );
  const hallItems = useMemo(() => getHallItems(entries), [entries]);
  const entriesByHall = useMemo(
    () => groupEntriesByHall(entries, hallItems),
    [entries, hallItems],
  );
  const activeSystemCount = useMemo(() => {
    return new Set(hallItems.map((hall) => hall.format.split(" - ")[0])).size;
  }, [hallItems]);
  const todaysShowtimes = entries.length;
  const activeHallCount = hallItems.length;

  const handleDateChange = (direction) => {
    setActiveDate(getNextDateValue(dateOptions, activeDate, direction));
  };

  const handleOpenCreate = (movieId) => {
    navigate(`/admin/films/showtime/${movieId}`);
  };

  const handleCreateButton = () => {
    const firstMovieId = entries[0]?.movieId;

    if (firstMovieId) {
      handleOpenCreate(firstMovieId);
      return;
    }

    navigate("/admin/films");
  };

  const isLoading =
    isLoadingHeThongRap ||
    (heThongRap.length > 0 && lichChieuQueries.some((query) => query.isLoading));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[32px] border border-white/10 bg-[#101010]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white">
      <div className="rounded-[32px] border border-white/10 bg-[#101010] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              Quản Lý Lịch Chiếu
            </h1>
            <p className="mt-3 text-base text-white/55">
              Theo dõi suất chiếu theo ngày, phòng chiếu và trạng thái hoạt
              động.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm phim, rạp..."
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-12 py-3 text-base text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-red-500/15 placeholder:text-white/35"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35"
              />
            </div>

            <button
              type="button"
              onClick={handleCreateButton}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-500"
            >
              <FontAwesomeIcon icon={faPlus} />
              Thêm suất chiếu
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard
          accentClassName="border-red-500/35"
          icon={<FontAwesomeIcon icon={faClock} />}
          label="Suất chiếu hôm nay"
          value={todaysShowtimes}
          subValue="Đang hiển thị theo bộ lọc hiện tại"
        />
        <StatCard
          accentClassName="border-yellow-500/35"
          icon={<FontAwesomeIcon icon={faTicket} />}
          label="Rạp có lịch"
          value={activeHallCount}
          subValue="Số rạp có suất chiếu trong ngày đã chọn"
        />
        <StatCard
          accentClassName="border-white/15"
          icon={<FontAwesomeIcon icon={faUsers} />}
          label="Chuỗi rạp có lịch"
          value={activeSystemCount}
          subValue="Số hệ thống rạp có suất chiếu thực tế"
        />
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white/85">
              {activeDateOption?.label}
            </span>
            <button
              type="button"
              onClick={() => handleDateChange(-1)}
              disabled={activeDate === dateOptions[0]?.value}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              type="button"
              onClick={() => handleDateChange(1)}
              disabled={
                activeDate === dateOptions[dateOptions.length - 1]?.value
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="px-6 py-6" style={{ minWidth: `${TIMELINE_MIN_WIDTH}px` }}>
            <div
              className="grid gap-x-4 gap-y-6"
              style={{
                gridTemplateColumns: `${HALL_COLUMN_WIDTH}px repeat(12, minmax(${TIME_SLOT_MIN_WIDTH}px, 1fr))`,
              }}
            >
              <div className="self-center text-sm font-semibold uppercase tracking-[0.24em] text-white/30">
                Phòng chiếu
              </div>
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot}
                  className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/28"
                >
                  {slot}
                </div>
              ))}

              {hallItems.map((hall) => (
                <Fragment key={hall.id}>
                  <div className="flex min-h-[132px] flex-col justify-center rounded-[24px] border border-white/5 bg-white/[0.015] px-5">
                    <p className="text-3xl font-black text-white">
                      {hall.name}
                    </p>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-white/35">
                      {hall.format}
                    </p>
                  </div>

                  <div className="relative col-span-12 min-h-[132px] rounded-[24px] border border-white/5 bg-gradient-to-br from-white/[0.015] to-transparent">
                    <div className="absolute inset-0 grid grid-cols-12">
                      {TIME_SLOTS.map((slot) => (
                        <div
                          key={`${hall.id}-${slot}`}
                          className="border-l border-white/[0.04] first:border-l-0"
                        />
                      ))}
                    </div>

                    <div className="relative z-10 grid h-full grid-cols-12 gap-3 p-3">
                      {(entriesByHall[hall.id] || []).map((entry) => (
                        <div
                          key={entry.id}
                          style={{
                            gridColumn: `${entry.startSlot + 1} / span ${entry.span}`,
                          }}
                        >
                          <ShowtimeCard
                            entry={entry}
                            onOpenCreate={handleOpenCreate}
                          />
                        </div>
                      ))}
                      {!(entriesByHall[hall.id] || []).length ? (
                        <div className="col-span-12 flex min-h-[108px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-white/35">
                          Chưa có suất chiếu trong khung giờ hiển thị
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Fragment>
              ))}
              {!hallItems.length ? (
                <div
                  className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center text-white/45"
                  style={{ gridColumn: "1 / -1" }}
                >
                  Không có lịch chiếu thực tế cho ngày đã chọn.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeManagementPage;

import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useMovieList } from '../../hooks/useMovies'

const MA_NHOM = 'GP01'
const HALLS = [
  { id: 'room-01', name: 'Phòng 01', format: 'IMAX Laser' },
  { id: 'room-02', name: 'Phòng 02', format: 'Dolby Atmos' },
  { id: 'room-03', name: 'Phòng 03', format: 'Tiêu chuẩn' },
]
const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00']
const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
})

const statusStyles = {
  active: {
    container: 'border-red-500/70 bg-gradient-to-br from-[#161616] to-[#1d1116] shadow-[0_0_0_1px_rgba(239,68,68,0.15)]',
    badge: 'bg-red-500/20 text-red-300',
    label: 'ĐANG MỞ BÁN',
  },
  soldOut: {
    container: 'border-yellow-500/60 bg-gradient-to-br from-[#171512] to-[#20190a] shadow-[0_0_0_1px_rgba(234,179,8,0.16)]',
    badge: 'bg-yellow-500/20 text-yellow-200',
    label: 'HẾT VÉ',
  },
  ended: {
    container: 'border-white/10 bg-gradient-to-br from-[#161616] to-[#131313] opacity-55',
    badge: 'bg-white/10 text-white/60',
    label: 'ĐÃ KẾT THÚC',
  },
}

const createDateOptions = () => {
  const today = new Date()

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return {
      value: date.toISOString().slice(0, 10),
      label: DATE_LABEL_FORMATTER.format(date).replace(/^\p{Letter}/u, (letter) => letter.toUpperCase()),
      index,
    }
  })
}

const getShortTitle = (title) => {
  if (!title) {
    return 'Suất chiếu'
  }

  return title.length > 12 ? `${title.slice(0, 11)}...` : title
}

const formatRuntime = (minutes) => {
  const endHour = 8 + Math.floor(minutes / 60)
  const endMinute = String(minutes % 60).padStart(2, '0')
  return `${String(endHour).padStart(2, '0')}:${endMinute}`
}

const getShowtimeEntries = (movies, dayOffset) => {
  const sourceMovies = movies.slice(0, 6)

  return HALLS.flatMap((hall, hallIndex) => {
    const entryCount = hallIndex === 2 ? 1 : 2

    return Array.from({ length: entryCount }, (_, entryIndex) => {
      const movieIndex = (hallIndex * 2 + entryIndex + dayOffset) % Math.max(sourceMovies.length, 1)
      const movie = sourceMovies[movieIndex] || null
      const startSlot = (hallIndex * 2 + entryIndex * 3 + dayOffset) % 7
      const span = hallIndex === 2 ? 2 : entryIndex === 0 ? 2 : 1
      const durationMinutes = span * 75
      const startLabel = TIME_SLOTS[startSlot]
      const endLabel = formatRuntime((startSlot + 1) * 60 + durationMinutes)
      const statusKey = ['active', 'soldOut', 'ended'][(hallIndex + entryIndex + dayOffset) % 3]

      return {
        id: `${hall.id}-${entryIndex}-${movie?.maPhim ?? movieIndex}`,
        hallId: hall.id,
        movieId: movie?.maPhim,
        title: getShortTitle(movie?.tenPhim),
        poster: movie?.hinhAnh,
        startSlot,
        span,
        timeRange: `${startLabel} - ${endLabel}`,
        statusKey,
        occupancy: statusKey === 'soldOut' ? 100 : statusKey === 'active' ? 82 : 21,
      }
    })
  })
}

const StatCard = ({ accentClassName, icon, label, value, subValue }) => (
  <div className={`rounded-[28px] border bg-[#121212] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)] ${accentClassName}`}>
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
)

const ShowtimeCard = ({ entry, onOpenCreate }) => {
  const style = statusStyles[entry.statusKey]

  return (
    <button
      type="button"
      onClick={() => entry.movieId && onOpenCreate(entry.movieId)}
      className={`flex h-full w-full items-start gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)] ${style.container}`}
    >
      {entry.poster ? (
        <img src={entry.poster} alt={entry.title} className="h-16 w-12 rounded-xl object-cover" />
      ) : (
        <div className="flex h-16 w-12 items-center justify-center rounded-xl bg-white/5 text-xs text-white/35">N/A</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
        <p className="mt-1 text-xs text-white/55">{entry.timeRange}</p>
        <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] ${style.badge}`}>
          {style.label}
        </span>
      </div>
    </button>
  )
}

const ShowtimeManagementPage = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useMovieList(MA_NHOM)
  const movies = data?.items || []
  const dateOptions = useMemo(() => createDateOptions(), [])
  const [activeDate, setActiveDate] = useState(dateOptions[0]?.value || '')
  const [keyword, setKeyword] = useState('')

  const activeDateOption = dateOptions.find((item) => item.value === activeDate) || dateOptions[0]
  const allEntries = useMemo(
    () => getShowtimeEntries(movies, activeDateOption?.index || 0),
    [movies, activeDateOption]
  )

  const filteredEntries = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return allEntries
    }

    return allEntries.filter((entry) => {
      const hall = HALLS.find((item) => item.id === entry.hallId)

      return [entry.title, hall?.name, hall?.format]
        .some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
    })
  }, [allEntries, keyword])

  const entriesByHall = useMemo(() => {
    return HALLS.reduce((result, hall) => {
      result[hall.id] = filteredEntries.filter((entry) => entry.hallId === hall.id)
      return result
    }, {})
  }, [filteredEntries])

  const todaysShowtimes = filteredEntries.length
  const activeHallCount = HALLS.filter((hall) => (entriesByHall[hall.id] || []).length > 0).length
  const occupancyRate = filteredEntries.length
    ? Math.round(filteredEntries.reduce((total, entry) => total + entry.occupancy, 0) / filteredEntries.length)
    : 0

  const handleDateChange = (direction) => {
    const currentIndex = dateOptions.findIndex((item) => item.value === activeDate)
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), dateOptions.length - 1)
    setActiveDate(dateOptions[nextIndex].value)
  }

  const handleOpenCreate = (movieId) => {
    navigate(`/admin/films/showtime/${movieId}`)
  }

  const handleCreateButton = () => {
    if (movies[0]?.maPhim) {
      handleOpenCreate(movies[0].maPhim)
      return
    }

    navigate('/admin/films')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[32px] border border-white/10 bg-[#101010]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans text-white">
      <div className="rounded-[32px] border border-white/10 bg-[#101010] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">Quản Lý Lịch Chiếu</h1>
            <p className="mt-3 text-base text-white/55">Theo dõi suất chiếu theo ngày, phòng chiếu và trạng thái hoạt động.</p>
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
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-4.2-4.2" strokeLinecap="round" />
              </svg>
            </div>

            <button
              type="button"
              onClick={handleCreateButton}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-500"
            >
              <span className="text-lg leading-none">+</span>
              Thêm suất chiếu
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard accentClassName="border-red-500/35" icon="🕒" label="Suất chiếu hôm nay" value={todaysShowtimes} subValue="Đang hiển thị theo bộ lọc hiện tại" />
        <StatCard accentClassName="border-yellow-500/35" icon="🎟️" label="Rạp đang hoạt động" value={`${activeHallCount}/${HALLS.length}`} subValue="Số phòng có lịch chiếu trong ngày" />
        <StatCard accentClassName="border-white/15" icon="👥" label="Tỷ lệ lấp đầy" value={`${occupancyRate}%`} subValue="Ước tính theo trạng thái suất chiếu" />
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white/85">{activeDateOption?.label}</span>
            <button
              type="button"
              onClick={() => handleDateChange(-1)}
              disabled={activeDate === dateOptions[0]?.value}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => handleDateChange(1)}
              disabled={activeDate === dateOptions[dateOptions.length - 1]?.value}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              ›
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px] px-6 py-6">
            <div
              className="grid gap-x-4 gap-y-6"
              style={{
                gridTemplateColumns: '180px repeat(12, minmax(70px, 1fr))',
              }}
            >
              <div className="self-center text-sm font-semibold uppercase tracking-[0.24em] text-white/30">Phòng chiếu</div>
              {TIME_SLOTS.map((slot) => (
                <div key={slot} className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/28">
                  {slot}
                </div>
              ))}

              {HALLS.map((hall) => (
                <React.Fragment key={hall.id}>
                  <div className="flex min-h-[132px] flex-col justify-center rounded-[24px] border border-white/5 bg-white/[0.015] px-5">
                    <p className="text-3xl font-black text-white">{hall.name}</p>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-white/35">{hall.format}</p>
                  </div>

                  <div className="relative col-span-12 min-h-[132px] rounded-[24px] border border-white/5 bg-gradient-to-b from-white/[0.015] to-transparent">
                    <div className="absolute inset-0 grid grid-cols-12">
                      {TIME_SLOTS.map((slot) => (
                        <div key={`${hall.id}-${slot}`} className="border-l border-white/[0.04] first:border-l-0" />
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
                          <ShowtimeCard entry={entry} onOpenCreate={handleOpenCreate} />
                        </div>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowtimeManagementPage

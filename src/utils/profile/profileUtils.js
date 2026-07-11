import * as Yup from "yup";

export const PROFILE_TABS = {
  info: "info",
  tickets: "tickets",
};

export const TICKETS_PER_PAGE = 5;

export const userInfoSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  hoTen: Yup.string().trim().required("Họ tên không được để trống"),
  soDt: Yup.string().trim().required("Số điện thoại không được để trống"),
  matKhau: Yup.string().test(
    "password-length",
    "Mật khẩu phải có ít nhất 6 ký tự",
    (value) => !value || value.length >= 6,
  ),
  xacNhanMatKhau: Yup.string().when("matKhau", {
    is: (value) => Boolean(value?.trim()),
    then: (schema) =>
      schema
        .required("Vui lòng nhập lại mật khẩu")
        .oneOf([Yup.ref("matKhau")], "Mật khẩu xác nhận không khớp"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const formLabelClassName =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/72 sm:text-xs";
export const formInputClassName =
  "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-red-400 focus:ring-2 focus:ring-red-500/15 sm:px-4 sm:py-3";
export const formInputDisabledClassName =
  "w-full rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-sm text-white/65 outline-none sm:px-4 sm:py-3";
export const cardClassName =
  "rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(21,19,19,0.94),rgba(16,18,22,0.96))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:rounded-[26px] sm:p-5 lg:p-6";

export const getApiMessage = (content, fallbackMessage) => {
  if (typeof content === "string" && content.trim()) {
    return content;
  }

  if (content && typeof content === "object") {
    if (typeof content.message === "string" && content.message.trim()) {
      return content.message;
    }

    if (typeof content.content === "string" && content.content.trim()) {
      return content.content;
    }

    if (content.content && typeof content.content === "object") {
      if (
        typeof content.content.message === "string" &&
        content.content.message.trim()
      ) {
        return content.content.message;
      }
    }
  }

  return fallbackMessage;
};

export const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Chưa có dữ liệu";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "Chưa có dữ liệu";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export const getRoleLabel = (role) => {
  return role === "QuanTri" ? "Quản trị" : "Khách hàng";
};

export const getTicketCinemaInfo = (ticket) => {
  const firstSeat = ticket?.danhSachGhe?.[0];

  return {
    heThongRap: firstSeat?.tenHeThongRap || "Chưa có thông tin",
    cumRap: firstSeat?.tenCumRap || "Chưa có cụm rạp",
    rap: firstSeat?.tenRap || "Chưa có rạp",
  };
};

export const getUniqueSeats = (ticket) => {
  const seatMap = new Map();

  (ticket?.danhSachGhe || []).forEach((seat) => {
    const seatKey = seat?.maGhe || seat?.tenGhe;

    if (!seatKey || seatMap.has(seatKey)) {
      return;
    }

    seatMap.set(seatKey, seat);
  });

  return Array.from(seatMap.values());
};

const getSeatLevelTotalPrice = (ticket) => {
  return getUniqueSeats(ticket).reduce((totalPrice, seat) => {
    return totalPrice + (Number(seat?.giaVe) || 0);
  }, 0);
};

export const getTicketTotalPrice = (ticket) => {
  const ticketPrice = Number(ticket?.giaVe) || 0;
  const uniqueSeatCount = getUniqueSeats(ticket).length;

  if (ticketPrice > 0 && uniqueSeatCount > 0) {
    return ticketPrice * uniqueSeatCount;
  }

  if (ticketPrice > 0) {
    return ticketPrice;
  }

  const seatLevelTotalPrice = getSeatLevelTotalPrice(ticket);

  if (seatLevelTotalPrice > 0) {
    return seatLevelTotalPrice;
  }

  return Number(ticket?.giaVe) || 0;
};

export const getTicketUnitPrice = (ticket) => {
  const ticketPrice = Number(ticket?.giaVe) || 0;

  if (ticketPrice > 0) {
    return ticketPrice;
  }

  const uniqueSeats = getUniqueSeats(ticket);
  const totalPrice = getTicketTotalPrice(ticket);

  if (!uniqueSeats.length) {
    return totalPrice;
  }

  return Math.round(totalPrice / uniqueSeats.length);
};

export const sortTicketsByLatest = (ticketList = []) => {
  return [...ticketList].sort((ticketA, ticketB) => {
    const timeA = new Date(ticketA.ngayDat || 0).getTime();
    const timeB = new Date(ticketB.ngayDat || 0).getTime();

    if (timeA !== timeB) {
      return timeB - timeA;
    }

    return Number(ticketB.maVe || 0) - Number(ticketA.maVe || 0);
  });
};

export const paginateItems = (items, currentPage, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;

  return {
    totalPages,
    activePage,
    items: items.slice(startIndex, startIndex + pageSize),
  };
};

export const findTicketById = (tickets, ticketId) => {
  return (
    tickets.find((ticket) => String(ticket.maVe) === String(ticketId)) || null
  );
};

export const getProfileFormInitialValues = (profile, currentUser) => {
  return {
    taiKhoan: profile?.taiKhoan || "",
    hoTen: profile?.hoTen || "",
    email: profile?.email || "",
    soDt: profile?.soDT || "",
    matKhau: "",
    xacNhanMatKhau: "",
    maNhom: profile?.maNhom || currentUser?.maNhom || "GP00",
    maLoaiNguoiDung:
      profile?.maLoaiNguoiDung || currentUser?.maLoaiNguoiDung || "KhachHang",
  };
};

export const buildProfileUpdatePayload = (values, profile, currentUser) => {
  const normalizedPassword = values.matKhau.trim();
  const passwordToSubmit =
    normalizedPassword || profile?.matKhau || currentUser?.matKhau || "";

  return {
    normalizedPassword,
    payload: {
      taiKhoan: values.taiKhoan.trim(),
      matKhau: passwordToSubmit,
      email: values.email.trim(),
      soDt: values.soDt.trim(),
      maNhom: values.maNhom,
      maLoaiNguoiDung: values.maLoaiNguoiDung,
      hoTen: values.hoTen.trim(),
    },
  };
};

export const getResetProfileFormValues = (values) => ({
  ...values,
  matKhau: "",
  xacNhanMatKhau: "",
});

export const normalizeSeatType = (seatType) => {
  const normalizedValue = String(seatType || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  if (normalizedValue.includes("vip")) {
    return "Ghế VIP";
  }

  if (normalizedValue.includes("thuong")) {
    return "Ghế thường";
  }

  return null;
};

export const getSeatTypeSummary = (ticket) => {
  const uniqueSeats = getUniqueSeats(ticket);
  const seatTypeCount = new Map();

  uniqueSeats.forEach((seat) => {
    const seatTypeLabel = normalizeSeatType(seat?.loaiGhe);

    if (!seatTypeLabel) {
      return;
    }

    seatTypeCount.set(
      seatTypeLabel,
      (seatTypeCount.get(seatTypeLabel) || 0) + 1,
    );
  });

  return Array.from(seatTypeCount.entries())
    .map(([seatTypeLabel, count]) => `${seatTypeLabel}: ${count}`)
    .join(", ");
};

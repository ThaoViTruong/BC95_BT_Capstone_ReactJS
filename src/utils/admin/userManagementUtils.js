import * as Yup from "yup";

export const MA_NHOM = "GP01";
export const PAGE_SIZE = 10;

export const emptyUserForm = {
  taiKhoan: "",
  matKhau: "",
  email: "",
  soDT: "",
  hoTen: "",
  maLoaiNguoiDung: "KhachHang",
  maNhom: MA_NHOM,
};

export const userFormSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  soDT: Yup.string().required("Số điện thoại không được để trống"),
  hoTen: Yup.string().required("Họ tên không được để trống"),
  maLoaiNguoiDung: Yup.string().required(
    "Loại người dùng không được để trống",
  ),
});

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
  }

  return fallbackMessage;
};

export const buildPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [1];
  }

  const pageSet = new Set([
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ]);
  const normalizedPages = Array.from(pageSet)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((pageA, pageB) => pageA - pageB);

  const paginationItems = [];

  normalizedPages.forEach((page, index) => {
    const previousPage = normalizedPages[index - 1];

    if (index > 0 && page - previousPage > 1) {
      paginationItems.push("ellipsis");
    }

    paginationItems.push(page);
  });

  return paginationItems;
};

export const buildUserPayload = (values) => ({
  ...values,
  soDt: values.soDT,
});

export const getEditInitialValues = (editingUser) => {
  if (!editingUser) {
    return emptyUserForm;
  }

  return {
    taiKhoan: editingUser.taiKhoan || "",
    matKhau: "",
    email: editingUser.email || "",
    soDT: editingUser.soDT || "",
    hoTen: editingUser.hoTen || "",
    maLoaiNguoiDung: editingUser.maLoaiNguoiDung || "KhachHang",
    maNhom: editingUser.maNhom || MA_NHOM,
  };
};

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useToast } from "../../components/ToastProvider";
import {
  useAddUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../useUser";
import {
  PAGE_SIZE,
  buildPaginationItems,
  buildUserPayload,
  emptyUserForm,
  getApiMessage,
  getEditInitialValues,
  userFormSchema,
} from "../../utils/admin/userManagementUtils";

export const useUserManagementPage = () => {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pendingAddPayload, setPendingAddPayload] = useState(null);
  const [pendingEditPayload, setPendingEditPayload] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, isLoading } = useUsers(currentPage, PAGE_SIZE, appliedKeyword);

  const users = data?.items || [];
  const totalPages = data?.totalPages ?? currentPage;
  const totalCount = data?.totalCount || 0;
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  useEffect(() => {
    if (!isLoading && currentPage > totalPages) {
      const timeoutId = setTimeout(() => setCurrentPage(totalPages), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, isLoading, totalPages]);

  const addFormik = useFormik({
    initialValues: emptyUserForm,
    validationSchema: userFormSchema,
    onSubmit: async (values) => {
      setPendingAddPayload(buildUserPayload(values));
    },
  });

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: getEditInitialValues(editingUser),
    validationSchema: userFormSchema,
    onSubmit: (values) => {
      setPendingEditPayload(buildUserPayload(values));
    },
  });

  const handleConfirmAdd = async () => {
    if (!pendingAddPayload) {
      return;
    }

    try {
      await addUser.mutateAsync(pendingAddPayload);
      addFormik.resetForm();
      setPendingAddPayload(null);
      setIsAddModalOpen(false);
      showToast({
        type: "success",
        title: "Thêm người dùng thành công",
        message: "Người dùng mới đã được thêm vào hệ thống.",
      });
    } catch (error) {
      setPendingAddPayload(null);
      showToast({
        type: "error",
        title: "Thêm người dùng thất bại",
        message: getApiMessage(
          error.response?.data?.content,
          "Không thể thêm người dùng. Vui lòng thử lại.",
        ),
      });
    }
  };

  const handleCloseAddModal = () => {
    addFormik.resetForm();
    setPendingAddPayload(null);
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
    setPendingAddPayload(null);
    setPendingEditPayload(null);
    editFormik.resetForm();
  };

  const handleSearchUsers = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setAppliedKeyword(searchKeyword.trim());
  };

  const handleSearchKeywordChange = (event) => {
    const nextKeyword = event.target.value;
    setSearchKeyword(nextKeyword);

    if (!nextKeyword.trim()) {
      setCurrentPage(1);
      setAppliedKeyword("");
    }
  };

  const handleStartEdit = (user) => {
    setPendingAddPayload(null);
    setPendingEditPayload(null);
    setEditingUser(user);
  };

  const handleRequestDelete = (user) => {
    setUserToDelete(user);
  };

  const handleConfirmEdit = async () => {
    if (!pendingEditPayload) {
      return;
    }

    try {
      await updateUser.mutateAsync(pendingEditPayload);
      handleCloseEditModal();
      showToast({
        type: "success",
        title: "Cập nhật người dùng thành công",
        message: "Thông tin người dùng đã được cập nhật trên hệ thống.",
      });
    } catch (error) {
      setPendingEditPayload(null);
      showToast({
        type: "error",
        title: "Cập nhật người dùng thất bại",
        message: getApiMessage(
          error.response?.data?.content,
          "Không thể cập nhật người dùng. Vui lòng thử lại.",
        ),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      await deleteUser.mutateAsync(userToDelete.taiKhoan);
      setUserToDelete(null);
      showToast({
        type: "success",
        title: "Xóa người dùng thành công",
        message: "Người dùng đã được xóa khỏi danh sách quản trị.",
      });
    } catch (error) {
      setUserToDelete(null);
      showToast({
        type: "error",
        title: "Xóa người dùng thất bại",
        message: getApiMessage(
          error.response?.data?.content,
          "Không thể xóa người dùng. Vui lòng thử lại.",
        ),
      });
    }
  };

  return {
    isLoading,
    currentPage,
    totalPages,
    totalCount,
    searchKeyword,
    appliedKeyword,
    users,
    paginationItems,
    isAddModalOpen,
    editingUser,
    pendingAddPayload,
    pendingEditPayload,
    userToDelete,
    addFormik,
    editFormik,
    addUser,
    updateUser,
    deleteUser,
    setCurrentPage,
    setIsAddModalOpen,
    setPendingAddPayload,
    setPendingEditPayload,
    setUserToDelete,
    handleCloseAddModal,
    handleCloseEditModal,
    handleSearchUsers,
    handleSearchKeywordChange,
    handleStartEdit,
    handleRequestDelete,
    handleConfirmAdd,
    handleConfirmEdit,
    handleConfirmDelete,
  };
};

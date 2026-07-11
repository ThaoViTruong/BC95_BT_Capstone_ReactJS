import LoadingSpinner from "../../components/LoadingSpinner";
import ConfirmActionModal from "../../components/admin/user-management/ConfirmActionModal";
import UserFormModal from "../../components/admin/user-management/UserFormModal";
import UserPageHeader from "../../components/admin/user-management/UserPageHeader";
import UserPagination from "../../components/admin/user-management/UserPagination";
import UserTable from "../../components/admin/user-management/UserTable";
import { useUserManagementPage } from "../../hooks/admin/useUserManagementPage";

const UserPage = () => {
  const {
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
  } = useUserManagementPage();

  return (
    <div className="font-sans text-white">
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70">
          <LoadingSpinner />
        </div>
      ) : null}

      <UserPageHeader
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        appliedKeyword={appliedKeyword}
        searchKeyword={searchKeyword}
        onSearchSubmit={handleSearchUsers}
        onSearchChange={handleSearchKeywordChange}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <UserTable
        users={users}
        onStartEdit={handleStartEdit}
        onRequestDelete={handleRequestDelete}
      />

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginationItems={paginationItems}
        onPreviousPage={() => setCurrentPage((page) => page - 1)}
        onNextPage={() => setCurrentPage((page) => page + 1)}
        onSelectPage={setCurrentPage}
      />

      {isAddModalOpen ? (
        <UserFormModal
          title="Thêm người dùng mới"
          submitLabel="Thêm người dùng"
          formik={addFormik}
          isSubmitting={addUser.isPending}
          onClose={handleCloseAddModal}
          passwordPlaceholder="••••••••"
        />
      ) : null}

      {editingUser ? (
        <UserFormModal
          title={`Cập nhật người dùng: ${editingUser.taiKhoan}`}
          submitLabel="Lưu thay đổi"
          formik={editFormik}
          isSubmitting={updateUser.isPending}
          onClose={handleCloseEditModal}
          disableAccountField
          passwordPlaceholder="Nhập mật khẩu mới hoặc hiện tại"
          helperText="Vui lòng nhập mật khẩu để xác nhận cập nhật thông tin người dùng."
        />
      ) : null}

      <ConfirmActionModal
        isOpen={Boolean(pendingAddPayload)}
        title="Xác nhận thêm người dùng"
        description={
          pendingAddPayload
            ? `Bạn có chắc chắn muốn thêm tài khoản "${pendingAddPayload.taiKhoan}" vào hệ thống không?`
            : ''
        }
        confirmLabel="Xác nhận thêm"
        isSubmitting={addUser.isPending}
        onCancel={() => setPendingAddPayload(null)}
        onConfirm={handleConfirmAdd}
      />

      <ConfirmActionModal
        isOpen={Boolean(pendingEditPayload)}
        title="Xác nhận cập nhật người dùng"
        description={
          pendingEditPayload
            ? `Bạn có chắc chắn muốn cập nhật thông tin của tài khoản "${pendingEditPayload.taiKhoan}" không?`
            : ''
        }
        confirmLabel="Xác nhận cập nhật"
        isSubmitting={updateUser.isPending}
        onCancel={() => setPendingEditPayload(null)}
        onConfirm={handleConfirmEdit}
      />

      <ConfirmActionModal
        isOpen={Boolean(userToDelete)}
        title="Xác nhận xóa người dùng"
        description={
          userToDelete
            ? `Bạn có chắc chắn muốn xóa tài khoản "${userToDelete.taiKhoan}" khỏi hệ thống không?`
            : ''
        }
        confirmLabel="Xóa người dùng"
        isSubmitting={deleteUser.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserPage;



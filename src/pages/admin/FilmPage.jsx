import ConfirmActionModal from "../../components/admin/film-management/ConfirmActionModal";
import MovieFilterBar from "../../components/admin/film-management/MovieFilterBar";
import MovieFormModal from "../../components/admin/film-management/MovieFormModal";
import MovieListSection from "../../components/admin/film-management/MovieListSection";
import MovieStatsGrid from "../../components/admin/film-management/MovieStatsGrid";
import { useFilmManagementPage } from "../../hooks/admin/useFilmManagementPage";
import {
  inputClassName,
  labelClassName,
  statusOptions,
} from "../../utils/admin/filmManagementUtils";

const FilmPage = () => {
  const {
    isLoading,
    isError,
    error,
    searchValue,
    statusFilter,
    isAddModalOpen,
    isAddConfirmOpen,
    addForm,
    addImageFile,
    movieToDelete,
    movieStats,
    filteredMovies,
    activePage,
    totalPages,
    paginatedMovies,
    addMovieMutation,
    deleteMovieMutation,
    setCurrentPage,
    setAddForm,
    setAddImageFile,
    setIsAddConfirmOpen,
    setMovieToDelete,
    handleFormFieldChange,
    handleFileChange,
    handleOpenAddModal,
    handleStartEdit,
    handleSearchChange,
    handleStatusChange,
    handleOpenShowtime,
    handleRequestDelete,
    handleSubmitAdd,
    handleConfirmAdd,
    handleConfirmDelete,
    resetAddState,
  } = useFilmManagementPage();

  return (
    <div className="space-y-8 font-sans text-white">
      <section className="space-y-8">
        <MovieStatsGrid movieStats={movieStats} />

        <MovieFilterBar
          searchValue={searchValue}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onOpenAddModal={handleOpenAddModal}
          statusOptions={statusOptions}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />

        <MovieListSection
          isLoading={isLoading}
          isError={isError}
          error={error}
          paginatedMovies={paginatedMovies}
          filteredMovies={filteredMovies}
          activePage={activePage}
          totalPages={totalPages}
          onPreviousPage={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          onNextPage={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          onSelectPage={setCurrentPage}
          onStartEdit={handleStartEdit}
          onRequestDelete={handleRequestDelete}
          onOpenShowtime={handleOpenShowtime}
        />
      </section>

      {isAddModalOpen ? (
        <MovieFormModal
          title="Thêm phim"
          description="Tạo phim mới"
          formState={addForm}
          imageFile={addImageFile}
          isSubmitting={addMovieMutation.isPending}
          onClose={resetAddState}
          onSubmit={handleSubmitAdd}
          onFieldChange={handleFormFieldChange(setAddForm)}
          onImageChange={handleFileChange(setAddImageFile)}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
      ) : null}

      <ConfirmActionModal
        isOpen={isAddConfirmOpen}
        title="Xác nhận thêm phim"
        description={`Bạn có chắc chắn muốn thêm phim "${addForm.tenPhim || 'Chưa nhập tên phim'}" vào danh sách quản trị không?`}
        confirmLabel="Xác nhận thêm"
        isSubmitting={addMovieMutation.isPending}
        onCancel={() => setIsAddConfirmOpen(false)}
        onConfirm={handleConfirmAdd}
      />

      <ConfirmActionModal
        isOpen={Boolean(movieToDelete)}
        title={movieToDelete?.tenPhim || 'Xóa phim'}
        description="Hành động này sẽ xóa vĩnh viễn phim khỏi danh sách quản trị. Vui lòng xác nhận trước khi tiếp tục."
        confirmLabel="Xóa phim"
        isSubmitting={deleteMovieMutation.isPending}
        onCancel={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FilmPage;

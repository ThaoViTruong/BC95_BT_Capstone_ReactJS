import ConfirmActionModal from "../../components/admin/film-management/ConfirmActionModal";
import MovieFilterBar from "../../components/admin/film-management/MovieFilterBar";
import MovieFormModal from "../../components/admin/film-management/MovieFormModal";
import MovieListSection from "../../components/admin/film-management/MovieListSection";
import MovieStatsGrid from "../../components/admin/film-management/MovieStatsGrid";
import { useFilmManagementPage } from "../../hooks/admin/useFilmManagementPage";
import { FontAwesomeIcon, faPlus } from "../../utils/fontAwesome";
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
    <div className="space-y-5 font-sans text-white sm:space-y-6">
      <section className="rounded-[24px] border border-white/10 bg-[#101010] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-400 sm:text-xs">
              Quản trị phim
            </p>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Quản lý phim
            </h1>
            <p className="mt-2 text-xs text-white/55 sm:mt-3 sm:text-base">
              Cập nhật danh sách phim và lịch chiếu toàn hệ thống.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-red-400 hover:to-red-600 sm:rounded-2xl sm:px-5 sm:py-3"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="hidden sm:inline">Thêm phim mới</span>
            <span className="sm:hidden">Thêm phim</span>
          </button>
        </div>
      </section>

      <section className="space-y-5 sm:space-y-6">
        <MovieStatsGrid movieStats={movieStats} />

        <MovieFilterBar
          searchValue={searchValue}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          statusOptions={statusOptions}
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

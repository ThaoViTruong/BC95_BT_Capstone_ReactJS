import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { movieApi } from "../../api/movieApi";
import { useAdminMovieList } from "../useMovies";
import {
  filterMovies,
  getMovieStats,
  getMoviesFromQueryData,
  ITEMS_PER_PAGE,
  paginateMovies,
} from "../../utils/admin/filmManagementUtils";
import {
  buildMovieFormData,
  emptyMovieForm,
  getApiMessage,
  MA_NHOM,
} from "../../utils/admin/movieFormUtils";

export const useFilmManagementPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data, isLoading, isError, error } = useAdminMovieList(MA_NHOM);
  const movies = useMemo(() => getMoviesFromQueryData(data), [data]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyMovieForm);
  const [addImageFile, setAddImageFile] = useState(null);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const movieStats = useMemo(() => getMovieStats(movies), [movies]);
  const filteredMovies = useMemo(
    () => filterMovies(movies, searchValue, statusFilter),
    [movies, searchValue, statusFilter],
  );
  const { totalPages, activePage, items: paginatedMovies } = useMemo(
    () => paginateMovies(filteredMovies, currentPage, ITEMS_PER_PAGE),
    [filteredMovies, currentPage],
  );

  const refreshMovieList = () => {
    queryClient.invalidateQueries({ queryKey: ["adminMovieList", MA_NHOM] });
    queryClient.invalidateQueries({ queryKey: ["movieList", MA_NHOM] });
    queryClient.invalidateQueries({ queryKey: ["lichChieuHeThongRap"] });
    queryClient.invalidateQueries({ queryKey: ["adminShowtimeSystem"] });
    queryClient.invalidateQueries({ queryKey: ["movieShowtimes"] });
  };

  const resetAddState = () => {
    setIsAddModalOpen(false);
    setIsAddConfirmOpen(false);
    setAddForm(emptyMovieForm);
    setAddImageFile(null);
  };

  const handleFormFieldChange = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files?.[0] || null);
  };

  const addMovieMutation = useMutation({
    mutationFn: (formData) => movieApi.addMovie(formData),
    onSuccess: () => {
      resetAddState();
      refreshMovieList();
      showToast({
        type: "success",
        title: "Thêm phim thành công",
        message: "Phim mới đã được thêm vào danh sách quản trị.",
      });
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: "Thêm phim thất bại",
        message: getApiMessage(
          err.response?.data,
          "Thêm phim thất bại. Vui lòng thử lại.",
        ),
      });
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (maPhim) => movieApi.deleteMovie(maPhim),
    onSuccess: () => {
      setMovieToDelete(null);
      refreshMovieList();
      showToast({
        type: "success",
        title: "Xóa phim thành công",
        message: "Bộ phim đã được xóa khỏi danh sách quản trị.",
      });
    },
    onError: (err) => {
      setMovieToDelete(null);
      showToast({
        type: "error",
        title: "Xóa phim thất bại",
        message: getApiMessage(
          err.response?.data,
          "Xóa phim thất bại. Vui lòng thử lại.",
        ),
      });
    },
  });

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleStartEdit = (movie) => {
    navigate(`/admin/films/edit/${movie.maPhim}`);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleOpenShowtime = (movie) => {
    navigate(`/admin/films/showtime/${movie.maPhim}`);
  };

  const handleRequestDelete = (movie) => {
    setMovieToDelete(movie);
  };

  const handleSubmitAdd = (event) => {
    event.preventDefault();
    if (!addImageFile) {
      showToast({
        type: "error",
        title: "Thiếu poster",
        message: "Vui lòng chọn ảnh poster trước khi thêm phim.",
      });
      return;
    }
    setIsAddConfirmOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!addImageFile) {
      setIsAddConfirmOpen(false);
      return;
    }
    addMovieMutation.mutate(
      buildMovieFormData({
        movieForm: addForm,
        imageFile: addImageFile,
      }),
    );
  };

  const handleConfirmDelete = () => {
    if (!movieToDelete) return;
    deleteMovieMutation.mutate(movieToDelete.maPhim);
  };

  return {
    isLoading,
    isError,
    error,
    searchValue,
    statusFilter,
    isAddModalOpen,
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
    isAddConfirmOpen,
    setCurrentPage,
    setAddForm,
    setAddImageFile,
    setIsAddModalOpen,
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
  };
};

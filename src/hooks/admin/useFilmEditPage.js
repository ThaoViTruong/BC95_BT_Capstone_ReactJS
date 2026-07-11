import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { movieApi } from '../../api/movieApi'
import { useToast } from '../../components/ToastProvider'
import { useMovieDetail } from '../useMovies'
import {
  buildMovieUpdateUploadFormData,
  createMovieEditForm,
  emptyMovieEditForm,
  getMovieUpdateErrorMessage,
} from '../../utils/admin/movieUpdateUtils'

export const useFilmEditPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { idFilm } = useParams()
  const { data: movieDetail, isLoading, isError, error } = useMovieDetail(idFilm)

  const [formState, setFormState] = useState(emptyMovieEditForm)
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false)

  useEffect(() => {
    if (!movieDetail) {
      return
    }

    const timeoutId = setTimeout(() => {
      setFormState(createMovieEditForm(movieDetail))
      setCurrentImage(movieDetail.hinhAnh || '')
      setImageFile(null)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [movieDetail])

  const previewImage = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile)
    }

    return currentImage
  }, [currentImage, imageFile])

  useEffect(() => {
    return () => {
      if (previewImage && imageFile) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage, imageFile])

  const refreshMovieQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['adminMovieList'] }),
      queryClient.invalidateQueries({ queryKey: ['movieList'] }),
      queryClient.invalidateQueries({ queryKey: ['movieDetail', idFilm] }),
    ])
  }

  const updateMovieMutation = useMutation({
    mutationFn: async ({ movieForm, originalMovie, selectedImageFile, nextCurrentImage }) => {
      return movieApi.updateMovieWithImage(
        buildMovieUpdateUploadFormData({
          movieForm,
          originalMovie,
          imageFile: selectedImageFile,
          currentImage: nextCurrentImage,
        })
      )
    },
    onSuccess: async () => {
      setIsConfirmUpdateOpen(false)
      await refreshMovieQueries()
      showToast({
        type: 'success',
        title: 'Cập nhật phim thành công',
        message: 'Thông tin phim đã được cập nhật thành công.',
      })
    },
    onError: (mutationError) => {
      showToast({
        type: 'error',
        title: 'Cập nhật phim thất bại',
        message: getMovieUpdateErrorMessage(mutationError),
      })
    },
  })

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (event) => {
    setImageFile(event.target.files?.[0] || null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsConfirmUpdateOpen(true)
  }

  const handleConfirmUpdate = () => {
    if (!movieDetail) {
      setIsConfirmUpdateOpen(false)
      return
    }

    updateMovieMutation.mutate({
      movieForm: formState,
      originalMovie: movieDetail,
      selectedImageFile: imageFile,
      nextCurrentImage: currentImage,
    })
  }

  return {
    navigate,
    idFilm,
    movieDetail,
    isLoading,
    isError,
    error,
    formState,
    imageFile,
    previewImage,
    isConfirmUpdateOpen,
    updateMovieMutation,
    setIsConfirmUpdateOpen,
    handleFieldChange,
    handleImageChange,
    handleSubmit,
    handleConfirmUpdate,
  }
}

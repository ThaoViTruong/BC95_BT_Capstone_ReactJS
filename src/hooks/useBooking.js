// src/hooks/useBooking.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '../api/bookingApi'

/* ============ HOOK 1: LẤY DANH SÁCH GHẾ ============ */
export const useSeatList = (maLichChieu) => {
  return useQuery({
    queryKey: ['seatList', String(maLichChieu)],
    queryFn: () => bookingApi.getSeatList(maLichChieu),
    enabled: !!maLichChieu,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

/* ============ HOOK 2: ĐẶT VÉ ============ */
export const useBookTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => bookingApi.datVe(payload),

    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({
        queryKey: ['seatList', String(variables.maLichChieu)],
        type: 'active',
      })
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '../api/bookingApi'

export const useSeatList = (maLichChieu) => {
  return useQuery({
    queryKey: ['seatList', String(maLichChieu)],
    queryFn: () => bookingApi.getSeatList(maLichChieu),
    enabled: !!maLichChieu,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

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
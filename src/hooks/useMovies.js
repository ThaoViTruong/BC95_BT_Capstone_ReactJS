import { useQuery,useQueries } from "@tanstack/react-query";
import { movieApi } from "../api/movieApi";

export const useMovieList = (
  maNhom = "GP01",
  soTrang = 1,
  soPhanTuTrenTrang = 10,
  tenPhim = "",
) => {
  return useQuery({
    queryKey: ["movieList", maNhom, soTrang, soPhanTuTrenTrang, tenPhim],
    queryFn: async () => {
      const response = await movieApi.getMovieList(
        maNhom,
        soTrang,
        soPhanTuTrenTrang,
        tenPhim,
      );
      return response.data.content;
    },
  });
};

export const useMovieDetail = (maPhim) => {
  return useQuery({
    queryKey: ["movieDetail", maPhim],
    queryFn: async () => {
      const response = await movieApi.getMovieDetail(maPhim);
      return response.data.content;
    },
    enabled: maPhim !== undefined && maPhim !== null && maPhim !== "",
  });
};

export const useMovieDetails = (maPhimList = []) => {
  return useQueries({
    queries: maPhimList.map((maPhim) => ({
      queryKey: ["movieDetail", maPhim],
      queryFn: async () => {
        const response = await movieApi.getMovieDetail(maPhim);
        return response.data.content;
      },
      enabled: !!maPhim,
      staleTime: 5 * 60 * 1000,
    })),
  });
};

export const useMovieShowtimes = (maPhim) => {
  return useQuery({
    queryKey: ["movieShowtimes", maPhim],
    queryFn: async () => {
      const response = await movieApi.getMovieShowtimes(maPhim);
      return response.data.content;
    },
    enabled: !!maPhim,
  });
};

export const useBanners = () => {
    return useQuery({
        queryKey: ['banners'],
        queryFn: async () => {
            const response = await movieApi.getBanners()
            return response.data.content 
        },
        staleTime: 5 * 60 * 1000, 
    })
}

export const useMovieListByDate = (
  maNhom = "GP01",
  soTrang = 1,
  soPhanTuTrenTrang = 10,
  tenPhim = "",
  tuNgay = "",
  denNgay = "",
) => {
  return useQuery({
    queryKey: [
      "movieListByDate",
      maNhom,
      soTrang,
      soPhanTuTrenTrang,
      tenPhim,
      tuNgay,
      denNgay,
    ],
    queryFn: async () => {
      const response = await movieApi.getMovieListByDate(
        maNhom,
        soTrang,
        soPhanTuTrenTrang,
        tenPhim,
        tuNgay,
        denNgay,
      );
      const content = response.data.content;

      if (Array.isArray(content)) {
        const totalCount = content.length;
        const totalPages = Math.ceil(totalCount / soPhanTuTrenTrang);
        const startIndex = (soTrang - 1) * soPhanTuTrenTrang;
        const endIndex = startIndex + soPhanTuTrenTrang;
        const items = content.slice(startIndex, endIndex);

        return {
          items,
          totalCount,
          totalPages,
          currentPage: soTrang,
          count: items.length,
        };
      }

      return content;
    },
    enabled: !!(tuNgay && denNgay),
    keepPreviousData: true,
  });
};

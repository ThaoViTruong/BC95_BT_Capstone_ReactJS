export const createAvailableMovieIdSet = (movies = []) => {
  return new Set(
    movies
      .map((movie) => String(movie?.maPhim || "").trim())
      .filter(Boolean),
  );
};

const hasAvailableMovie = (movie, availableMovieIds) => {
  return availableMovieIds.has(String(movie?.maPhim || "").trim());
};

export const filterCinemaClustersByAvailableMovies = (
  cinemaClusters = [],
  availableMovieIds,
) => {
  if (!availableMovieIds?.size) {
    return cinemaClusters;
  }

  return cinemaClusters
    .map((cinemaCluster) => ({
      ...cinemaCluster,
      danhSachPhim: (cinemaCluster.danhSachPhim || []).filter((movie) =>
        hasAvailableMovie(movie, availableMovieIds),
      ),
    }))
    .filter((cinemaCluster) => cinemaCluster.danhSachPhim.length > 0);
};

export const filterScheduleSystemsByAvailableMovies = (
  scheduleSystems = [],
  availableMovieIds,
) => {
  if (!availableMovieIds?.size) {
    return scheduleSystems;
  }

  return scheduleSystems
    .map((scheduleSystem) => ({
      ...scheduleSystem,
      lstCumRap: filterCinemaClustersByAvailableMovies(
        scheduleSystem.lstCumRap || [],
        availableMovieIds,
      ),
    }))
    .filter((scheduleSystem) => scheduleSystem.lstCumRap.length > 0);
};

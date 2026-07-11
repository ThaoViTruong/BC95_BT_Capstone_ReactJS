import { getMovieTags } from "../../../utils/admin/filmManagementUtils";

const MovieTags = ({ movie }) => (
  <div className="mt-4 flex flex-wrap gap-2.5">
    {getMovieTags(movie).map((tag) => (
      <span
        key={`${movie.maPhim}-${tag.label}`}
        className={`rounded-full px-3 py-1.5 text-sm font-medium ${tag.className}`}
      >
        {tag.label}
      </span>
    ))}
  </div>
);

export default MovieTags;

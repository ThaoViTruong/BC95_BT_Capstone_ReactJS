import { getMovieTags } from "../../../utils/admin/filmManagementUtils";

const MovieTags = ({ movie, compact = false }) => (
  <div className={`mt-3 flex flex-wrap ${compact ? "gap-2" : "gap-2.5"} sm:mt-4`}>
    {getMovieTags(movie).map((tag) => (
      <span
        key={`${movie.maPhim}-${tag.label}`}
        className={`rounded-full font-medium ${compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-sm"} ${tag.className}`}
      >
        {tag.label}
      </span>
    ))}
  </div>
);

export default MovieTags;

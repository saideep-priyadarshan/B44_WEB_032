import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

const StarRating = ({ rating, size = "h-5 w-5" }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span key={starValue}>
            {rating >= starValue ? (
              <StarSolid className={`${size} text-yellow-400`} />
            ) : (
              <StarOutline className={`${size} text-yellow-400`} />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

import { ShieldCheck, Star } from "lucide-react";
import type { PublicReview } from "../lib/reviews";

export function RatingStars({
  rating,
  interactive = false,
  onChange,
  size = 17,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) =>
        interactive ? (
          <button
            key={value}
            type="button"
            onClick={() => onChange?.(value)}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            aria-pressed={rating === value}
            className="rounded-md p-1 text-amber-400 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Star size={30} fill={value <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
          </button>
        ) : (
          <Star key={value} size={size} className="text-amber-400" fill={value <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
        ),
      )}
    </div>
  );
}

export function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-4">
        <RatingStars rating={review.rating} />
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${review.verified ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
          {review.verified ? <><ShieldCheck size={13} /> Verified Project</> : "Customer Submitted"}
        </span>
      </div>
      <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-gray-600">“{review.comment}”</blockquote>
      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="font-display text-sm font-bold text-navy-900">{review.displayName}</p>
        <p className="mt-1 text-xs text-gray-400">
          {[review.service, review.location].filter(Boolean).join(" · ")}
        </p>
      </div>
    </article>
  );
}

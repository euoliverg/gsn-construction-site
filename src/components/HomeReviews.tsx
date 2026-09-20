import { useEffect, useState } from "react";
import { ArrowRight, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { subscribeToLatestPublicReviews, type PublicReview } from "../lib/reviews";
import Reveal from "./Reveal";
import { ReviewCard } from "./ReviewDisplay";

export default function HomeReviews() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => subscribeToLatestPublicReviews(
    (items) => {
      setReviews(items);
      setLoading(false);
    },
    3,
    () => setLoading(false),
  ), []);

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24" aria-labelledby="home-reviews-title">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.035]" />
      <div className="container-px relative mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600">CLIENT FEEDBACK</span>
            <h2 id="home-reviews-title" className="mt-4 text-balance font-display text-3xl font-bold text-navy-900 sm:text-4xl">What Homeowners Are Saying</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">Honest feedback submitted by GSN Construction customers and published without changing their opinion.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/reviews" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-navy-900 transition hover:border-blue-300 hover:text-blue-700">View All Reviews <ArrowRight size={16} /></Link>
            <Link to="/reviews#leave-review" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"><PenLine size={16} /> Leave a Review</Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading customer reviews">
            {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] bg-navy-900 px-7 py-10 text-center text-white shadow-elevated sm:px-10">
            <h3 className="font-display text-2xl font-bold">Be the First to Share Your Experience</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">Worked with GSN Construction? Your feedback helps other homeowners make an informed decision.</p>
            <Link to="/reviews#leave-review" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"><PenLine size={16} /> Leave a Review</Link>
          </div>
        )}
      </div>
    </section>
  );
}

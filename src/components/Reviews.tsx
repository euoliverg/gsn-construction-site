import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, ShieldCheck, Star } from "lucide-react";
import Reveal from "./Reveal";
import {
  REVIEW_SERVICES,
  submitReview,
  subscribeToPublicReviews,
  type PublicReview,
  type ReviewInput,
} from "../lib/reviews";

const EMPTY_FORM: ReviewInput = {
  fullName: "",
  contact: "",
  location: "",
  service: "",
  rating: 0,
  comment: "",
  consent: false,
  company: "",
};

function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (rating: number) => void }) {
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
          <Star key={value} size={17} className="text-amber-400" fill={value <= rating ? "currentColor" : "none"} strokeWidth={1.8} />
        ),
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <Stars rating={review.rating} />
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

export default function Reviews() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [form, setForm] = useState<ReviewInput>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = subscribeToPublicReviews(
      (items) => {
        setReviews(items);
        setLoadingReviews(false);
      },
      () => setLoadingReviews(false),
    );
    return unsubscribe;
  }, []);

  const average = useMemo(
    () => (reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0),
    [reviews],
  );

  const update = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.fullName.trim().length < 2) next.fullName = "Please enter your name.";
    if (!/^(?:[^@\s]+@[^@\s]+\.[^@\s]+|[\d()+\-.\s]{7,})$/.test(form.contact.trim())) {
      next.contact = "Enter a valid phone number or email.";
    }
    if (!form.service) next.service = "Please select the service received.";
    if (form.rating < 1 || form.rating > 5) next.rating = "Please choose a star rating.";
    if (form.comment.trim().length < 20) next.comment = "Please write at least 20 characters.";
    if (form.comment.trim().length > 1200) next.comment = "Please keep your review under 1,200 characters.";
    if (!form.consent) next.consent = "Please confirm that we may publish your review.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await submitReview(form);
      setForm(EMPTY_FORM);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="reviews" className="bg-gray-50 pb-24 pt-32 sm:pb-28 sm:pt-36">
      <div className="container-px mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600">CLIENT FEEDBACK</span>
          <h1 className="mt-4 text-balance font-display text-4xl font-bold text-navy-900 sm:text-5xl">
            Reviews Built on Real Work
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Customer feedback is published as submitted. A “Verified Project” badge is added only after GSN Construction confirms the customer relationship.
          </p>
        </Reveal>

        {(reviews.length > 0 || loadingReviews) && (
          <div className="mt-14">
            {reviews.length > 0 && (
              <div className="mb-7 flex flex-col items-center justify-between gap-4 rounded-2xl bg-navy-900 px-6 py-5 text-white sm:flex-row">
                <div>
                  <p className="font-display text-3xl font-bold">{average.toFixed(1)}</p>
                  <Stars rating={Math.round(average)} />
                </div>
                <p className="text-sm text-white/65">
                  Based on {reviews.length} published customer {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            )}
            {loadingReviews ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading reviews">
                {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-gray-100" />)}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
              </div>
            )}
          </div>
        )}

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-3xl bg-navy-900 p-7 text-white sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300">
              <ShieldCheck size={24} />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold">How review integrity works</h2>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed text-white/70">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-400" size={17} />Reviews are published automatically, exactly as submitted.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-400" size={17} />Contact information is used only to validate the submission and is never displayed.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-400" size={17} />Reviews are not edited to change the customer’s opinion.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-400" size={17} />Only confirmed customers may receive a Verified Project badge.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-elevated sm:p-9">
            {status === "success" ? (
              <div className="py-10 text-center" role="status">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><CheckCircle2 size={32} /></span>
                <h2 className="mt-6 font-display text-2xl font-bold text-navy-900">Thank You for Your Review</h2>
                <p className="mx-auto mt-3 max-w-md text-gray-500">Your feedback has been published. Thank you for helping other homeowners make an informed decision.</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-7 text-sm font-bold text-blue-600 hover:text-blue-700">Submit another review</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="font-display text-2xl font-bold text-navy-900">Share Your Experience</h2>
                <p className="mt-2 text-sm text-gray-500">Fields marked with * are required.</p>

                <fieldset className="mt-7">
                  <legend className="text-sm font-semibold text-navy-900">Your rating *</legend>
                  <div className="mt-2 inline-flex">
                    <Stars rating={form.rating} interactive onChange={(rating) => update("rating", rating)} />
                  </div>
                  {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
                </fieldset>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-navy-900">Full Name *
                    <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" maxLength={100} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                    {errors.fullName && <span className="mt-1 block text-xs text-red-600">{errors.fullName}</span>}
                  </label>
                  <label className="text-sm font-semibold text-navy-900">Phone or Email *
                    <input value={form.contact} onChange={(e) => update("contact", e.target.value)} autoComplete="email" maxLength={160} className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                    {errors.contact && <span className="mt-1 block text-xs text-red-600">{errors.contact}</span>}
                  </label>
                  <label className="text-sm font-semibold text-navy-900">Service Received *
                    <select value={form.service} onChange={(e) => update("service", e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500">
                      <option value="">Select a service</option>
                      {REVIEW_SERVICES.map((service) => <option key={service}>{service}</option>)}
                    </select>
                    {errors.service && <span className="mt-1 block text-xs text-red-600">{errors.service}</span>}
                  </label>
                  <label className="text-sm font-semibold text-navy-900">City (optional)
                    <input value={form.location} onChange={(e) => update("location", e.target.value)} maxLength={80} placeholder="e.g. Seattle, WA" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                  </label>
                </div>

                <label className="mt-5 block text-sm font-semibold text-navy-900">Your Review *
                  <textarea value={form.comment} onChange={(e) => update("comment", e.target.value)} rows={5} maxLength={1200} placeholder="Tell other homeowners about the work, communication, and your overall experience." className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 font-normal leading-relaxed outline-none focus:border-blue-500" />
                  <span className="mt-1 flex justify-between text-xs"><span className="text-red-600">{errors.comment}</span><span className="text-gray-400">{form.comment.length}/1,200</span></span>
                </label>

                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update("company", e.target.value)} /></label>
                </div>

                <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-gray-500">
                  <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600" />
                  <span>I confirm this reflects my genuine experience and authorize GSN Construction LLC to publish it using my first name and last initial. *</span>
                </label>
                {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}

                {status === "error" && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">We couldn’t submit your review. Please try again shortly.</p>}

                <button type="submit" disabled={status === "sending"} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-60">
                  {status === "sending" ? "Submitting…" : "Submit Review"}
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-400"><LockKeyhole size={13} />Your contact details are private and never displayed.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

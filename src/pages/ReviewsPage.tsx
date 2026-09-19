import Reviews from "../components/Reviews";
import { usePageTitle } from "../lib/usePageTitle";

export default function ReviewsPage() {
  usePageTitle(
    "Customer Reviews",
    "Read verified customer feedback and share your experience with GSN Construction LLC in Seattle, Washington.",
  );
  return <Reviews />;
}

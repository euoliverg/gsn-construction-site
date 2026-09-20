import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
  setDoc,
  writeBatch,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./firebase";

export const REVIEW_SERVICES = [
  "Bathroom Remodeling",
  "Flooring",
  "Interior Painting",
  "Exterior Painting",
  "Roofing",
  "Landscaping",
  "Door Installation",
  "Window Installation",
  "Multiple Services",
  "Other Project",
] as const;

export interface PublicReview {
  id: string;
  displayName: string;
  location: string;
  service: string;
  rating: number;
  comment: string;
  verified: boolean;
  publishedAt: number | null;
}

export interface ReviewSubmission extends PublicReview {
  fullName: string;
  contact: string;
  status: "pending" | "published" | "rejected";
  consent: boolean;
  createdAt: number | null;
}

export interface ReviewInput {
  fullName: string;
  contact: string;
  location: string;
  service: string;
  rating: number;
  comment: string;
  consent: boolean;
  company: string;
}

function millis(value: unknown): number | null {
  return value && typeof (value as Timestamp).toMillis === "function"
    ? (value as Timestamp).toMillis()
    : null;
}

function publicFromDoc(snap: QueryDocumentSnapshot<DocumentData>): PublicReview {
  const data = snap.data();
  return {
    id: snap.id,
    displayName: String(data.displayName ?? "Customer"),
    location: String(data.location ?? ""),
    service: String(data.service ?? "Home Improvement"),
    rating: Number(data.rating ?? 5),
    comment: String(data.comment ?? ""),
    verified: Boolean(data.verified),
    publishedAt: millis(data.publishedAt),
  };
}

function submissionFromDoc(snap: QueryDocumentSnapshot<DocumentData>): ReviewSubmission {
  const data = snap.data();
  return {
    ...publicFromDoc(snap),
    fullName: String(data.fullName ?? ""),
    contact: String(data.contact ?? ""),
    status: data.status === "published" || data.status === "rejected" ? data.status : "pending",
    consent: Boolean(data.consent),
    createdAt: millis(data.createdAt),
  };
}

export function publicDisplayName(fullName: string) {
  const parts = fullName.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts.at(-1)?.charAt(0).toUpperCase()}.`;
}

async function ensureAnonymousAuth() {
  if (!auth) throw new Error("Reviews are temporarily unavailable.");
  if (!auth.currentUser) await signInAnonymously(auth);
}

export async function submitReview(input: ReviewInput) {
  if (!db) throw new Error("Reviews are temporarily unavailable.");
  if (input.company.trim()) return;
  await ensureAnonymousAuth();
  const uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("Reviews are temporarily unavailable.");

  // One public review per anonymous Firebase identity. This creates a useful
  // friction against repeat spam without adding login steps for real clients.
  const batch = writeBatch(db);
  batch.set(doc(db, "reviewSubmissions", uid), {
    fullName: input.fullName.trim(),
    displayName: publicDisplayName(input.fullName),
    contact: input.contact.trim(),
    location: input.location.trim(),
    service: input.service,
    rating: input.rating,
    comment: input.comment.trim(),
    consent: input.consent,
    status: "published",
    verified: false,
    ownerId: uid,
    createdAt: serverTimestamp(),
    publishedAt: serverTimestamp(),
  });
  batch.set(doc(db, "reviews", uid), {
    displayName: publicDisplayName(input.fullName),
    location: input.location.trim(),
    service: input.service,
    rating: input.rating,
    comment: input.comment.trim(),
    verified: false,
    publishedAt: serverTimestamp(),
  });
  await batch.commit();
}

export function subscribeToPublicReviews(callback: (reviews: PublicReview[]) => void, onError?: () => void) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "reviews"), orderBy("publishedAt", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(publicFromDoc)), () => onError?.());
}

export function subscribeToLatestPublicReviews(
  callback: (reviews: PublicReview[]) => void,
  maximum = 3,
  onError?: () => void,
) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "reviews"), orderBy("publishedAt", "desc"), limit(maximum));
  return onSnapshot(q, (snap) => callback(snap.docs.map(publicFromDoc)), () => onError?.());
}

export function subscribeToReviewSubmissions(callback: (reviews: ReviewSubmission[]) => void, onError?: () => void) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "reviewSubmissions"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(submissionFromDoc)), () => onError?.());
}

export async function publishReview(review: ReviewSubmission, verified: boolean) {
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(doc(db, "reviews", review.id), {
    displayName: publicDisplayName(review.fullName),
    location: review.location,
    service: review.service,
    rating: review.rating,
    comment: review.comment,
    verified,
    publishedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "reviewSubmissions", review.id), {
    status: "published",
    verified,
    publishedAt: serverTimestamp(),
  });
}

export async function rejectReview(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "reviews", id));
  await updateDoc(doc(db, "reviewSubmissions", id), {
    status: "rejected",
    verified: false,
  });
}

export async function deleteReviewSubmission(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await Promise.all([
    deleteDoc(doc(db, "reviewSubmissions", id)),
    deleteDoc(doc(db, "reviews", id)),
  ]);
}

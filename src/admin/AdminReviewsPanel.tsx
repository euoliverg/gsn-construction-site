import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, LogOut, ShieldCheck, Star, Trash2, XCircle } from "lucide-react";
import { signOut, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  deleteReviewSubmission,
  publishReview,
  rejectReview,
  subscribeToReviewSubmissions,
  type ReviewSubmission,
} from "../lib/reviews";

function formatDate(value: number | null) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(value) : "Agora";
}

export default function AdminReviewsPanel({ user, onBack }: { user: User; onBack: () => void }) {
  const [reviews, setReviews] = useState<ReviewSubmission[]>([]);
  const [filter, setFilter] = useState<"pending" | "published" | "rejected">("published");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => subscribeToReviewSubmissions(setReviews), []);

  const filtered = useMemo(() => reviews.filter((review) => review.status === filter), [reviews, filter]);
  const counts = useMemo(() => ({
    pending: reviews.filter((review) => review.status === "pending").length,
    published: reviews.filter((review) => review.status === "published").length,
    rejected: reviews.filter((review) => review.status === "rejected").length,
  }), [reviews]);

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    setError("");
    try { await action(); } catch { setError("Não foi possível concluir a ação. Verifique sua conexão e tente novamente."); }
    finally { setBusyId(null); }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} aria-label="Voltar para conversas" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:text-navy-900"><ArrowLeft size={18} /></button>
            <div><p className="font-display text-sm font-bold text-navy-900">Moderação de avaliações</p><p className="text-xs text-gray-400">{user.email}</p></div>
          </div>
          <button type="button" onClick={() => auth && signOut(auth)} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-navy-900"><LogOut size={16} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
          <strong>Publicação automática ativa:</strong> novas avaliações entram no site imediatamente. Retire apenas spam, abuso ou conteúdo comprovadamente falso. Marque “Verified Project” somente após conferir o contato com um cliente/projeto real.
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {(["pending", "published", "rejected"] as const).map((status) => (
            <button key={status} type="button" onClick={() => setFilter(status)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${filter === status ? "bg-navy-900 text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300"}`}>
              {status === "pending" ? "Pendentes" : status === "published" ? "Publicadas" : "Rejeitadas"} ({counts[status]})
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center text-sm text-gray-400">Nenhuma avaliação nesta fila.</div>}
          {filtered.map((review) => (
            <article key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-navy-900">{review.fullName}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(review.createdAt)} · {review.service}</p>
                </div>
                <div className="flex text-amber-400" aria-label={`${review.rating} estrelas`}>{[1,2,3,4,5].map((value) => <Star key={value} size={16} fill={value <= review.rating ? "currentColor" : "none"} />)}</div>
              </div>
              <blockquote className="mt-5 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">“{review.comment}”</blockquote>
              <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                <div><dt className="text-gray-400">Contato privado</dt><dd className="mt-0.5 font-semibold text-navy-900">{review.contact}</dd></div>
                <div><dt className="text-gray-400">Exibição pública</dt><dd className="mt-0.5 font-semibold text-navy-900">{review.displayName}{review.location ? ` · ${review.location}` : ""}</dd></div>
              </dl>

              {review.status === "pending" && (
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  <button disabled={busyId === review.id} onClick={() => run(review.id, () => publishReview(review, true))} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"><ShieldCheck size={14} /> Publicar verificada</button>
                  <button disabled={busyId === review.id} onClick={() => run(review.id, () => publishReview(review, false))} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-bold text-navy-900 hover:bg-gray-50 disabled:opacity-50"><CheckCircle2 size={14} /> Publicar</button>
                  <button disabled={busyId === review.id} onClick={() => run(review.id, () => rejectReview(review.id))} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"><XCircle size={14} /> Rejeitar</button>
                </div>
              )}
              {review.status === "published" && (
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700"><CheckCircle2 size={13} /> Publicada{review.verified ? " · Verified Project" : ""}</span>
                  {!review.verified && <button disabled={busyId === review.id} onClick={() => run(review.id, () => publishReview(review, true))} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><ShieldCheck size={13} /> Marcar projeto verificado</button>}
                  <button disabled={busyId === review.id} onClick={() => run(review.id, () => rejectReview(review.id))} className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"><XCircle size={13} /> Retirar do site</button>
                </div>
              )}
              {review.status === "rejected" && (
                <div className="mt-6 flex justify-end"><button disabled={busyId === review.id} onClick={() => run(review.id, () => deleteReviewSubmission(review.id))} className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"><Trash2 size={13} /> Excluir permanentemente</button></div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

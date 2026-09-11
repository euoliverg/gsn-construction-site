import { useEffect, useRef, useState } from "react";
import { signOut, type User } from "firebase/auth";
import { ArrowLeft, CheckCircle2, LogOut, Send } from "lucide-react";
import { auth } from "../lib/firebase";
import {
  markConversationRead,
  sendMessage,
  setConversationStatus,
  subscribeToConversations,
  subscribeToMessages,
  type ChatMessage,
  type Conversation,
} from "../lib/chat";
import { BUSINESS } from "../lib/constants";

function timeAgo(ms: number | null) {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function AdminDashboard({ user }: { user: User }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToConversations(setConversations), []);

  useEffect(() => {
    if (!activeId) return;
    const unsub = subscribeToMessages(activeId, setMessages);
    return unsub;
  }, [activeId]);

  useEffect(() => {
    if (activeId) markConversationRead(activeId, "admin");
  }, [activeId, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId) return;
    setDraft("");
    await sendMessage(activeId, text, "admin", user.email ?? "Team");
  };

  const listVisible = !activeId;

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50 lg:flex-row">
      {/* Conversation list */}
      <aside
        className={`${listVisible ? "flex" : "hidden"} lg:flex w-full lg:w-80 shrink-0 flex-col border-r border-gray-100 bg-white`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <div>
            <p className="font-display text-sm font-semibold text-navy-900">{BUSINESS.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => auth && signOut(auth)}
            aria-label="Sair"
            className="text-gray-400 hover:text-navy-900"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Nenhuma conversa ainda.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`flex w-full flex-col gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-blue-100/40 ${
                activeId === c.id ? "bg-blue-100/60" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-900">{c.visitorName}</span>
                <span className="text-[11px] text-gray-400">{timeAgo(c.lastMessageAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-gray-500">{c.lastMessageText || "Nova conversa"}</span>
                {c.unreadByAdmin > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                    {c.unreadByAdmin}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat panel */}
      <section className={`${listVisible ? "hidden" : "flex"} lg:flex flex-1 flex-col`}>
        {!active ? (
          <div className="hidden flex-1 items-center justify-center text-sm text-gray-400 lg:flex">
            Selecione uma conversa para responder.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Back to conversations"
                  className="text-gray-400 hover:text-navy-900 lg:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p className="text-sm font-semibold text-navy-900">{active.visitorName}</p>
                  <p className="text-xs text-gray-400">{active.status === "open" ? "Aberta" : "Fechada"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConversationStatus(active.id, active.status === "open" ? "closed" : "open")}
                className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600"
              >
                <CheckCircle2 size={14} />
                {active.status === "open" ? "Marcar como fechada" : "Reabrir"}
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                      m.sender === "admin"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-navy-900 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.sender === "admin" ? m.text : m.translatedText}
                    {m.sender === "visitor" && (
                      <p className="mt-1 text-[10px] italic text-gray-400">Original (EN): {m.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Digite sua resposta em português…"
                className="flex-1 rounded-lg border border-gray-100 px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Enviar resposta"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

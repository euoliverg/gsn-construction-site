import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import {
  getOrCreateConversation,
  markConversationRead,
  sendMessage,
  subscribeToConversation,
  subscribeToMessages,
  type ChatMessage,
} from "../lib/chat";

const NAME_KEY = "gsn_chat_visitor_name";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? "");
  const [nameSubmitted, setNameSubmitted] = useState(() => Boolean(localStorage.getItem(NAME_KEY)));
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadByVisitor, setUnreadByVisitor] = useState(0);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [attract, setAttract] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isFirebaseConfigured) return null;

  // Give the bubble a brief bounce shortly after the page loads to catch a
  // first-time visitor's eye, then settle down.
  useEffect(() => {
    const start = setTimeout(() => setAttract(true), 1800);
    const stop = setTimeout(() => setAttract(false), 1800 + 2600);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
  }, []);

  // Sign the visitor in anonymously once, then create/load their conversation.
  // Kicks off as soon as the name is submitted — not gated on the widget being
  // open — so replies can be tracked (for the unread badge) even while closed.
  useEffect(() => {
    if (!nameSubmitted || conversationId) return;
    let cancelled = false;

    (async () => {
      try {
        if (!auth) throw new Error("Chat is not configured.");
        const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
        const id = await getOrCreateConversation(name || "Visitor", user.uid);
        if (!cancelled) {
          setConversationId(id);
          setReady(true);
        }
      } catch (err) {
        console.error("Chat init failed", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nameSubmitted, name, conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribeToMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  // Track unread replies so the bubble can badge itself even while closed.
  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribeToConversation(conversationId, (conv) => {
      setUnreadByVisitor(conv?.unreadByVisitor ?? 0);
    });
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    if (open && conversationId && unreadByVisitor > 0) {
      markConversationRead(conversationId, "visitor");
    }
  }, [open, conversationId, unreadByVisitor]);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(NAME_KEY, trimmed);
    setNameSubmitted(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !conversationId || sending) return;
    setDraft("");
    setSending(true);
    try {
      await sendMessage(conversationId, text, "visitor");
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : unreadByVisitor > 0 ? `Open chat — ${unreadByVisitor} new message${unreadByVisitor > 1 ? "s" : ""}` : "Open chat"}
        className={`fixed bottom-24 left-4 lg:bottom-8 lg:left-8 z-50 flex h-14 items-center justify-center gap-2.5 rounded-full bg-blue-600 text-white shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 ${
          open ? "w-14" : "px-4 sm:pr-5"
        } ${attract && !open ? "animate-bounce" : ""}`}
      >
        {!open && unreadByVisitor > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
              {unreadByVisitor > 9 ? "9+" : unreadByVisitor}
            </span>
            <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" aria-hidden="true" />
          </>
        )}
        {open ? <X size={22} /> : <MessageCircle size={22} className="shrink-0" />}
        {!open && (
          <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">Chat with us</span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-40 left-4 right-4 lg:bottom-24 lg:left-8 lg:right-auto z-50 flex h-[70vh] max-h-[520px] w-auto lg:w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-elevated animate-fade-up">
          <div className="flex items-center justify-between bg-navy-900 px-4 py-3.5 text-white">
            <div>
              <p className="font-display text-sm font-semibold">GSN Construction</p>
              <p className="text-xs text-blue-300">👋 We typically reply within a few hours</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-blue-200 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {!nameSubmitted ? (
            <form onSubmit={handleNameSubmit} className="flex flex-1 flex-col justify-center gap-3 px-5">
              <p className="text-sm text-gray-700">
                Hi! What's your name? We'll use it to say hello properly. 😊
              </p>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-lg border border-gray-100 px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
              >
                Start chat
              </button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-gray-50 px-3.5 py-3.5">
                {!ready && (
                  <p className="text-center text-xs text-gray-400">Connecting…</p>
                )}
                {ready && messages.length === 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-3.5 py-2.5 text-sm leading-snug text-navy-900">
                      Hey {name.split(" ")[0]}! 👋 Ask us anything about your project — roofing,
                      remodeling, painting, whatever you need. We'll get back to you soon.
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                        m.sender === "visitor"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-navy-900 border border-gray-100 rounded-bl-sm"
                      }`}
                    >
                      {m.sender === "visitor" ? m.text : m.translatedText}
                      {m.sender === "admin" && (
                        <p className="mt-1 text-[10px] italic text-gray-400">Translated automatically</p>
                      )}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600/60 px-3.5 py-2 text-sm text-white">
                      <span className="inline-flex gap-1 align-middle">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 bg-white p-2.5">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  disabled={!ready}
                  className="flex-1 rounded-lg border border-gray-100 px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-blue-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!ready || !draft.trim() || sending}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

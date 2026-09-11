import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import {
  getOrCreateConversation,
  markConversationRead,
  sendMessage,
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
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isFirebaseConfigured) return null;

  // Sign the visitor in anonymously once, then create/load their conversation.
  useEffect(() => {
    if (!open || !nameSubmitted || conversationId) return;
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
  }, [open, nameSubmitted, name, conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribeToMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    if (open && conversationId) {
      markConversationRead(conversationId, "visitor");
    }
  }, [open, conversationId, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
    if (!text || !conversationId) return;
    setDraft("");
    try {
      await sendMessage(conversationId, text, "visitor");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-24 left-4 lg:bottom-8 lg:left-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-elevated transition-transform duration-300 hover:-translate-y-1 hover:bg-blue-500"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-40 left-4 right-4 lg:bottom-24 lg:left-8 lg:right-auto z-50 flex h-[70vh] max-h-[520px] w-auto lg:w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-elevated">
          <div className="flex items-center justify-between bg-navy-900 px-4 py-3.5 text-white">
            <div>
              <p className="font-display text-sm font-semibold">GSN Construction</p>
              <p className="text-xs text-blue-300">We typically reply within a few hours</p>
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
                Tell us your name to start chatting with our team.
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
                className="rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
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
                  <p className="text-center text-xs text-gray-400">
                    Send us a message and a team member will respond here.
                  </p>
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
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 bg-white p-2.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  disabled={!ready}
                  className="flex-1 rounded-lg border border-gray-100 px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-blue-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!ready || !draft.trim()}
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

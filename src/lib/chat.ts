import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { translateText } from "./translate";

export interface ChatMessage {
  id: string;
  /** Original text, in the sender's own language (English for visitors, Portuguese for admins). */
  text: string;
  /** Auto-translated text, in the other side's language. */
  translatedText: string;
  sender: "visitor" | "admin";
  senderName?: string;
  createdAt: number | null;
}

export interface Conversation {
  id: string;
  visitorName: string;
  status: "open" | "closed";
  lastMessageText: string;
  lastMessageAt: number | null;
  unreadByAdmin: number;
  unreadByVisitor: number;
  createdAt: number | null;
}

export async function getOrCreateConversation(visitorName: string, uid: string): Promise<string> {
  if (!db) throw new Error("Chat is not configured.");
  // The conversation id IS the visitor's anonymous Firebase Auth uid — this is
  // what the Firestore security rules check to scope a visitor to their own
  // conversation (see isOwningVisitor in firestore.rules).
  const conversationId = uid;
  const ref = doc(db, "conversations", conversationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Only set these on first creation — reopening the widget later must not
    // wipe out the real lastMessageText/lastMessageAt/unread counters.
    await setDoc(ref, {
      visitorName,
      status: "open",
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
      lastMessageText: "",
      unreadByAdmin: 0,
      unreadByVisitor: 0,
    });
  } else {
    await setDoc(ref, { visitorName, status: "open" }, { merge: true });
  }
  return conversationId;
}

export async function sendMessage(
  conversationId: string,
  text: string,
  sender: "visitor" | "admin",
  senderName?: string
) {
  if (!db) throw new Error("Chat is not configured.");
  const trimmed = text.trim();
  if (!trimmed) return;

  // Visitors write in English, admins write in Portuguese — always translate
  // to the other language so each side reads their own.
  const translatedText =
    sender === "visitor"
      ? await translateText(trimmed, "en", "pt")
      : await translateText(trimmed, "pt", "en");

  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    text: trimmed,
    translatedText,
    sender,
    senderName: senderName ?? null,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "conversations", conversationId), {
    // Keep the conversation preview in Portuguese for the admin list.
    lastMessageText: sender === "visitor" ? translatedText : trimmed,
    lastMessageAt: serverTimestamp(),
    status: "open",
    ...(sender === "visitor"
      ? { unreadByAdmin: increment(1) }
      : { unreadByVisitor: increment(1) }),
  });
}

export function subscribeToMessages(
  conversationId: string,
  cb: (messages: ChatMessage[]) => void
): Unsubscribe {
  if (!db) return () => {};
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          text: data.text,
          translatedText: data.translatedText ?? data.text,
          sender: data.sender,
          senderName: data.senderName ?? undefined,
          createdAt: data.createdAt?.toMillis?.() ?? null,
        };
      })
    );
  });
}

export function subscribeToConversation(
  conversationId: string,
  cb: (conversation: Conversation | null) => void
): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(doc(db, "conversations", conversationId), (snap) => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    const data = snap.data();
    cb({
      id: snap.id,
      visitorName: data.visitorName ?? "Visitor",
      status: data.status ?? "open",
      lastMessageText: data.lastMessageText ?? "",
      lastMessageAt: data.lastMessageAt?.toMillis?.() ?? null,
      unreadByAdmin: data.unreadByAdmin ?? 0,
      unreadByVisitor: data.unreadByVisitor ?? 0,
      createdAt: data.createdAt?.toMillis?.() ?? null,
    });
  });
}

export function subscribeToConversations(cb: (conversations: Conversation[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, "conversations"), orderBy("lastMessageAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          visitorName: data.visitorName ?? "Visitor",
          status: data.status ?? "open",
          lastMessageText: data.lastMessageText ?? "",
          lastMessageAt: data.lastMessageAt?.toMillis?.() ?? null,
          unreadByAdmin: data.unreadByAdmin ?? 0,
          unreadByVisitor: data.unreadByVisitor ?? 0,
          createdAt: data.createdAt?.toMillis?.() ?? null,
        };
      })
    );
  });
}

export async function markConversationRead(conversationId: string, who: "admin" | "visitor") {
  if (!db) return;
  await updateDoc(doc(db, "conversations", conversationId), {
    [who === "admin" ? "unreadByAdmin" : "unreadByVisitor"]: 0,
  });
}

export async function setConversationStatus(conversationId: string, status: "open" | "closed") {
  if (!db) return;
  await updateDoc(doc(db, "conversations", conversationId), { status });
}

/** Permanently deletes a conversation and all of its messages. Employee-only (see firestore.rules). */
export async function deleteConversation(conversationId: string) {
  if (!db) return;
  const messagesSnap = await getDocs(collection(db, "conversations", conversationId, "messages"));
  await Promise.all(messagesSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, "conversations", conversationId));
}

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
  writeBatch,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { translateText, translateAuto } from "./translate";

export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  /** Original text, in the sender's own language (visitor's detected language, or Portuguese for admins). */
  text: string;
  /** Auto-translated text, in the other side's language. */
  translatedText: string;
  /** ISO 639-1 code the original text was written in (e.g. "en", "es", "pt"). */
  originalLanguage: string;
  sender: "visitor" | "admin";
  senderName?: string;
  status: MessageStatus;
  createdAt: number | null;
  readAt: number | null;
}

export interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string | null;
  visitorPhone: string | null;
  /** ISO 639-1 code of the visitor's language, detected from their messages. Updates if they switch languages. */
  visitorLanguage: string;
  /** Site path the visitor was on when the conversation started. */
  startPage: string | null;
  status: "open" | "closed";
  lastMessageText: string;
  lastMessageAt: number | null;
  unreadByAdmin: number;
  unreadByVisitor: number;
  createdAt: number | null;
}

export async function getOrCreateConversation(
  visitorName: string,
  uid: string,
  startPage?: string
): Promise<string> {
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
      visitorEmail: null,
      visitorPhone: null,
      visitorLanguage: "en",
      startPage: startPage ?? null,
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

/** Visitor-supplied contact details are optional and can arrive any time during the chat. */
export async function setVisitorContact(
  conversationId: string,
  contact: { email?: string; phone?: string }
) {
  if (!db) return;
  const update: Record<string, string> = {};
  if (contact.email?.trim()) update.visitorEmail = contact.email.trim();
  if (contact.phone?.trim()) update.visitorPhone = contact.phone.trim();
  if (Object.keys(update).length === 0) return;
  await setDoc(doc(db, "conversations", conversationId), update, { merge: true });
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

  let translatedText: string;
  let originalLanguage: string;

  if (sender === "visitor") {
    // Detect whatever language the visitor is writing in (it can change
    // mid-conversation) and always translate to Portuguese for the team.
    const convSnap = await getDoc(doc(db, "conversations", conversationId));
    const lastKnownLanguage = convSnap.exists() ? convSnap.data().visitorLanguage ?? "en" : "en";
    const result = await translateAuto(trimmed, "pt", lastKnownLanguage);
    translatedText = result.text;
    originalLanguage = result.detectedLang;
    if (originalLanguage && originalLanguage !== lastKnownLanguage) {
      await setDoc(doc(db, "conversations", conversationId), { visitorLanguage: originalLanguage }, { merge: true });
    }
  } else {
    // Admins always write in Portuguese; translate into whichever language
    // this visitor has been detected using, defaulting to English.
    const convSnap = await getDoc(doc(db, "conversations", conversationId));
    const targetLanguage = convSnap.exists() ? convSnap.data().visitorLanguage ?? "en" : "en";
    translatedText = await translateText(trimmed, "pt", targetLanguage);
    originalLanguage = "pt";
  }

  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    text: trimmed,
    translatedText,
    originalLanguage,
    sender,
    senderName: senderName ?? null,
    // Firestore's realtime sync delivers this near-instantly to whoever has
    // the conversation open, so "delivered" is the honest starting status;
    // it becomes "read" once the recipient actually views it.
    status: "delivered",
    readAt: null,
    createdAt: serverTimestamp(),
  });

  // setDoc/merge rather than updateDoc: if an employee deleted this
  // conversation while the visitor still had the widget open, updateDoc
  // would throw and the message would be stranded in a subcollection with
  // no parent — invisible in the admin list. Merging recreates the
  // conversation so the new message still reaches the team.
  await setDoc(
    doc(db, "conversations", conversationId),
    {
      // Keep the conversation preview in Portuguese for the admin list.
      lastMessageText: sender === "visitor" ? translatedText : trimmed,
      lastMessageAt: serverTimestamp(),
      status: "open",
      ...(sender === "visitor"
        ? { unreadByAdmin: increment(1) }
        : { unreadByVisitor: increment(1) }),
    },
    { merge: true }
  );
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
          originalLanguage: data.originalLanguage ?? "en",
          sender: data.sender,
          senderName: data.senderName ?? undefined,
          status: data.status ?? "sent",
          createdAt: data.createdAt?.toMillis?.() ?? null,
          readAt: data.readAt?.toMillis?.() ?? null,
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
    cb(toConversation(snap.id, snap.data()));
  });
}

export function subscribeToConversations(cb: (conversations: Conversation[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(collection(db, "conversations"), orderBy("lastMessageAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => toConversation(d.id, d.data())));
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toConversation(id: string, data: any): Conversation {
  return {
    id,
    visitorName: data.visitorName ?? "Visitor",
    visitorEmail: data.visitorEmail ?? null,
    visitorPhone: data.visitorPhone ?? null,
    visitorLanguage: data.visitorLanguage ?? "en",
    startPage: data.startPage ?? null,
    status: data.status ?? "open",
    lastMessageText: data.lastMessageText ?? "",
    lastMessageAt: data.lastMessageAt?.toMillis?.() ?? null,
    unreadByAdmin: data.unreadByAdmin ?? 0,
    unreadByVisitor: data.unreadByVisitor ?? 0,
    createdAt: data.createdAt?.toMillis?.() ?? null,
  };
}

// These two fire from UI effects without an await, so a conversation that
// was deleted in the meantime must not surface as an unhandled rejection —
// there's simply nothing left to mark or reopen.
export async function markConversationRead(conversationId: string, who: "admin" | "visitor") {
  if (!db) return;
  try {
    await updateDoc(doc(db, "conversations", conversationId), {
      [who === "admin" ? "unreadByAdmin" : "unreadByVisitor"]: 0,
    });
  } catch {
    /* conversation no longer exists */
  }
}

/**
 * Stamps every unread message from the other side as "read" — the read
 * receipt the sender sees ticks over from delivered to read. `reader` is
 * whoever is now viewing the conversation, so it marks the counterpart's
 * messages.
 */
export async function markMessagesRead(conversationId: string, reader: "admin" | "visitor") {
  if (!db) return;
  const counterpart = reader === "admin" ? "visitor" : "admin";
  try {
    const messagesSnap = await getDocs(collection(db, "conversations", conversationId, "messages"));
    const batch = writeBatch(db);
    let touched = false;
    for (const docSnap of messagesSnap.docs) {
      const data = docSnap.data();
      if (data.sender === counterpart && data.status !== "read") {
        batch.update(docSnap.ref, { status: "read", readAt: serverTimestamp() });
        touched = true;
      }
    }
    if (touched) await batch.commit();
  } catch {
    /* conversation no longer exists */
  }
  await markConversationRead(conversationId, reader);
}

export async function setConversationStatus(conversationId: string, status: "open" | "closed") {
  if (!db) return;
  try {
    await updateDoc(doc(db, "conversations", conversationId), { status });
  } catch {
    /* conversation no longer exists */
  }
}

/** Permanently deletes a conversation and all of its messages. Employee-only (see firestore.rules). */
export async function deleteConversation(conversationId: string) {
  if (!db) return;
  const messagesSnap = await getDocs(collection(db, "conversations", conversationId, "messages"));
  await Promise.all(messagesSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, "conversations", conversationId));
}

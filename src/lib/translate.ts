// Free, keyless translation with two layered providers so a visitor's
// message almost always comes through translated, even if one provider is
// unavailable:
//
//   1. Google Translate's public web endpoint (translate_a/single) — real
//      machine translation, tried first, and the only one of the two that
//      can auto-detect the source language. It's unofficial and occasionally
//      blocks the request with a CORS error depending on which edge server
//      answers, so it's wrapped in retries with backoff.
//   2. MyMemory's API as a fallback if Google fails outright. MyMemory is a
//      crowdsourced translation memory, which occasionally returns garbage
//      or even offensive text for innocuous input — so its result is run
//      through a small safety filter before we trust it; anything flagged
//      is discarded in favor of just showing the original text.
//
// Results are cached in memory so a repeated phrase (greetings, common
// questions) translates instantly without hitting the network again.

const CACHE_LIMIT = 200;
const cache = new Map<string, string>();

function cacheKey(text: string, from: string, to: string) {
  return `${from}>${to}:${text}`;
}

function rememberInCache(key: string, value: string) {
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Emails, URLs, phone numbers and money amounts must reach the other side
// exactly as typed — machine translation regularly mangles them (splitting
// "$1,200" or rewriting a phone number's punctuation). Swap them for inert
// placeholder tokens before translating and put the originals back after.
const PROTECT_PATTERN =
  /([\w.+-]+@[\w-]+\.[\w.-]+)|(https?:\/\/[^\s]+)|(\+?\d[\d\s().-]{7,}\d)|(\$\s?\d[\d,.]*)/g;

function protect(text: string): { masked: string; restore: (s: string) => string } {
  const saved: string[] = [];
  const masked = text.replace(PROTECT_PATTERN, (match) => {
    const token = `%%${saved.length}%%`;
    saved.push(match);
    return token;
  });
  const restore = (s: string) =>
    s.replace(/%%\s*(\d+)\s*%%/g, (_m, i) => saved[Number(i)] ?? _m);
  return { masked, restore };
}

interface GoogleResult {
  text: string;
  detectedLang: string | null;
}

async function tryGoogle(text: string, from: string, to: string): Promise<GoogleResult | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const res = await fetchWithTimeout(url, 6000);
  if (!res) return null;
  try {
    const data = await res.json();
    // Response shape: [[[translatedChunk, originalChunk, ...], ...], ..., detectedLang]
    const translated = Array.isArray(data?.[0])
      ? data[0].map((chunk: unknown[]) => chunk?.[0] ?? "").join("")
      : "";
    if (!translated.trim()) return null;
    const detectedLang = typeof data?.[2] === "string" ? data[2] : null;
    return { text: translated.trim(), detectedLang };
  } catch {
    return null;
  }
}

// A short blocklist covering the worst vulgarities across the languages GSN
// is most likely to see — enough to catch the kind of garbage MyMemory's
// crowdsourced memory has been seen to return for innocuous input, without
// trying to be an exhaustive profanity filter.
const UNSAFE_PATTERN =
  /\b(fuck|shit|bitch|cunt|whore|dick|cock|asshole|puta|putas|caralho|foda[-\s]?se|porra|buceta|cacete|viado|arrombad|piranha|vagabund|desgraç|puta[- ]?madre|pendejo|joder|salope|connard)\w*\b/i;

async function tryMyMemory(text: string, from: string, to: string): Promise<string | null> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetchWithTimeout(url, 6000);
  if (!res) return null;
  try {
    const data = await res.json();
    const translated: string | undefined = data?.responseData?.translatedText;
    if (!translated) return null;
    if (/MYMEMORY WARNING/i.test(translated)) return null;
    // Safety net: if the source text wasn't itself flagged but the
    // "translation" is, it's almost certainly garbage from the memory —
    // don't trust it.
    if (UNSAFE_PATTERN.test(translated) && !UNSAFE_PATTERN.test(text)) return null;
    return translated.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Translates `text` from `from` to `to`. Language codes are ISO 639-1
 * (e.g. "en", "pt", "es", "fr") or "auto" for `from` to let Google detect
 * the source language — use `translateAuto` when you also need to know
 * which language was detected.
 */
export async function translateText(text: string, from: string, to: string): Promise<string> {
  const { detected } = await translateDetecting(text, from, to);
  return detected.text;
}

async function translateDetecting(
  text: string,
  from: string,
  to: string
): Promise<{ detected: { text: string; lang: string | null } }> {
  const trimmed = text.trim();
  if (!trimmed) return { detected: { text: "", lang: null } };

  const key = cacheKey(trimmed, from, to);
  const cached = cache.get(key);
  if (cached) return { detected: { text: cached, lang: null } };

  const { masked, restore } = protect(trimmed);

  // Google first, with a couple of backed-off retries — it's real machine
  // translation and usually succeeds.
  const backoffs = [0, 300, 900];
  for (const delay of backoffs) {
    if (delay > 0) await sleep(delay);
    const result = await tryGoogle(masked, from, to);
    if (result) {
      const restored = restore(result.text);
      rememberInCache(key, restored);
      return { detected: { text: restored, lang: result.detectedLang } };
    }
  }

  // Google failed every attempt (e.g. blocked by CORS on this edge) — fall
  // back to MyMemory, filtered for safety. MyMemory can't auto-detect, so
  // "auto" isn't valid for it; skip straight to returning the original text.
  if (from !== "auto") {
    const fallback = await tryMyMemory(masked, from, to);
    if (fallback) {
      const restored = restore(fallback);
      rememberInCache(key, restored);
      return { detected: { text: restored, lang: null } };
    }
  }

  // Both providers failed — keep the chat working with the original text
  // rather than blocking the message.
  return { detected: { text: trimmed, lang: null } };
}

/**
 * Translates `text` into `to`, auto-detecting the source language. Returns
 * both the translation and the detected language code (e.g. "es"), so the
 * caller can remember which language to translate replies back into.
 * Falls back to `fallbackLang` (best-guess source, e.g. the conversation's
 * last known language) if detection isn't available.
 */
export async function translateAuto(
  text: string,
  to: string,
  fallbackLang = "en"
): Promise<{ text: string; detectedLang: string }> {
  const { detected } = await translateDetecting(text, "auto", to);
  return { text: detected.text, detectedLang: detected.lang ?? fallbackLang };
}

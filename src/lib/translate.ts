// Free, keyless translation with two layered providers so a visitor's
// message almost always comes through translated, even if one provider is
// unavailable:
//
//   1. Google Translate's public web endpoint (translate_a/single) — real
//      machine translation, tried first. It's unofficial and occasionally
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

async function tryGoogle(text: string, from: string, to: string): Promise<string | null> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const res = await fetchWithTimeout(url, 6000);
  if (!res) return null;
  try {
    const data = await res.json();
    // Response shape: [[[translatedChunk, originalChunk, ...], ...], ...]
    const translated = Array.isArray(data?.[0])
      ? data[0].map((chunk: unknown[]) => chunk?.[0] ?? "").join("")
      : "";
    return translated.trim() || null;
  } catch {
    return null;
  }
}

// A short blocklist covering the worst English/Portuguese vulgarities —
// enough to catch the kind of garbage MyMemory's crowdsourced memory has
// been seen to return for innocuous input, without trying to be an
// exhaustive profanity filter.
const UNSAFE_PATTERN =
  /\b(fuck|shit|bitch|cunt|whore|dick|cock|asshole|puta|putas|caralho|foda[-\s]?se|porra|buceta|cacete|viado|arrombad|piranha|vagabund|desgraç)\w*\b/i;

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

export async function translateText(
  text: string,
  from: "en" | "pt",
  to: "en" | "pt"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const key = cacheKey(trimmed, from, to);
  const cached = cache.get(key);
  if (cached) return cached;

  // Google first, with a couple of backed-off retries — it's real machine
  // translation and usually succeeds.
  const backoffs = [0, 300, 900];
  for (const delay of backoffs) {
    if (delay > 0) await sleep(delay);
    const result = await tryGoogle(trimmed, from, to);
    if (result) {
      rememberInCache(key, result);
      return result;
    }
  }

  // Google failed every attempt (e.g. blocked by CORS on this edge) — fall
  // back to MyMemory, filtered for safety.
  const fallback = await tryMyMemory(trimmed, from, to);
  if (fallback) {
    rememberInCache(key, fallback);
    return fallback;
  }

  // Both providers failed — keep the chat working with the original text
  // rather than blocking the message.
  return trimmed;
}

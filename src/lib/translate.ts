// Free, keyless translation using Google Translate's public web endpoint
// (the same one translate.google.com's website itself calls). Unlike
// MyMemory's crowdsourced translation memory — which can return garbage or
// even offensive "translations" for common phrases submitted by random
// users — this is machine translation straight from Google, consistent and
// safe for a business-facing chat.
export async function translateText(
  text: string,
  from: "en" | "pt",
  to: "en" | "pt"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;
    const res = await fetch(url);
    if (!res.ok) return trimmed;
    const data = await res.json();
    // Response shape: [[[translatedChunk, originalChunk, ...], ...], ...]
    const translated = Array.isArray(data?.[0])
      ? data[0].map((chunk: unknown[]) => chunk?.[0] ?? "").join("")
      : "";
    return translated.trim() || trimmed;
  } catch {
    return trimmed;
  }
}

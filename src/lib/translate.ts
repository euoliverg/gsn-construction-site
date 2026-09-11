// Free, keyless translation via the MyMemory API (https://mymemory.translated.net).
// Good enough for short chat messages. If it fails or the quota is hit, we just
// fall back to the original text so the chat never breaks.
export async function translateText(
  text: string,
  from: "en" | "pt",
  to: "en" | "pt"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${from}|${to}`;
    const res = await fetch(url);
    if (!res.ok) return trimmed;
    const data = await res.json();
    const translated: string | undefined = data?.responseData?.translatedText;
    if (!translated || /MYMEMORY WARNING/i.test(translated)) return trimmed;
    return translated;
  } catch {
    return trimmed;
  }
}

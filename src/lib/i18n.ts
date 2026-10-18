// ── SCN Technologies signature language layer ───────────────────────
// 12 fully hand-built languages (work offline), 44 more via free live
// translation API (MyMemory) with caching — 56 languages total.

export interface LangDef {
  code: string
  name: string
  flag: string
  builtin?: boolean
}

export const LANGUAGES: LangDef[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', builtin: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', builtin: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷', builtin: true },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', builtin: true },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', builtin: true },
  { code: 'pt', name: 'Português', flag: '🇵🇹', builtin: true },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', builtin: true },
  { code: 'ko', name: '한국어', flag: '🇰🇷', builtin: true },
  { code: 'zh', name: '中文', flag: '🇨🇳', builtin: true },
  { code: 'ja', name: '日本語', flag: '🇯🇵', builtin: true },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', builtin: true },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', builtin: true },
  // Live-translated via free API
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', builtin: true },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
  { code: 'ht', name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'ca', name: 'Català', flag: '🇪🇸' },
  { code: 'eu', name: 'Euskara', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', flag: '🇪🇸' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Cymraeg', flag: '🇬🇧' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
]

export const RTL_LANGS = new Set(['ar', 'he', 'ur', 'fa'])

// ── Free live translation (MyMemory) with localStorage cache ─────────

const CACHE_KEY = 'transpose-i18n-cache'

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

let memCache: Record<string, string> = loadCache()

function cacheKey(lang: string, text: string) {
  return `${lang}::${text}`
}

function persistCache() {
  try {
    // keep it bounded — localStorage is ~5MB
    const keys = Object.keys(memCache)
    if (keys.length > 2500) {
      const drop = keys.slice(0, keys.length - 2500)
      drop.forEach((k) => delete memCache[k])
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(memCache))
  } catch {
    /* full or private mode — cache just won't persist */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Translate one string via the free MyMemory API — SEQUENTIAL, paced,
 * with 429 backoff (the free tier rate-limits hard). Cached forever once
 * fetched, so a language only pays this cost on its very first use.
 */
export async function translateText(text: string, lang: string): Promise<string> {
  if (!text.trim()) return text
  const key = cacheKey(lang, text)
  if (memCache[key]) return memCache[key]
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
      const res = await fetch(url)
      if (res.status === 429) {
        await sleep(1200 * (attempt + 1)) // back off: 1.2s, 2.4s, 3.6s
        continue
      }
      const data = await res.json()
      const out: string = data?.responseData?.translatedText
      if (out && !/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID/i.test(out)) {
        memCache[key] = out
        persistCache()
        return out
      }
      return text
    } catch {
      /* offline — fall through */
    }
    await sleep(400)
  }
  return text
}

/**
 * Translate every string in a table (arrays included) to `lang`.
 * Cached entries resolve instantly; the rest hit the free API in small batches.
 */
export async function translateTable<T>(en: T, lang: string): Promise<T> {
  const entries: [string, string][] = [] // [path, text]
  const collect = (node: unknown, path: string) => {
    if (typeof node === 'string') entries.push([path, node])
    else if (Array.isArray(node)) node.forEach((v, i) => collect(v, `${path}.${i}`))
    else if (node && typeof node === 'object')
      Object.entries(node as Record<string, unknown>).forEach(([k, v]) => collect(v, path ? `${path}.${k}` : k))
  }
  collect(en, '')

  const result: Record<string, unknown> = JSON.parse(JSON.stringify(en))
  const set = (path: string, value: string) => {
    const parts = path.split('.')
    let node: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]] as Record<string, unknown>
    node[parts[parts.length - 1]] = value
  }

  // resolve cached first
  const pending: [string, string][] = []
  for (const [path, text] of entries) {
    const hit = memCache[cacheKey(lang, text)]
    if (hit) set(path, hit)
    else pending.push([path, text])
  }

  // fetch the rest STRICTLY one at a time with a small gap — the free API
  // 429s any burst, so we pace it like a polite guest.
  for (const [path, text] of pending) {
    const out = await translateText(text, lang)
    set(path, out)
    await sleep(180)
  }
  return result as T
}

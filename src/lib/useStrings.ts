import { useEffect, useState } from 'react'
import { BUILTIN_STRINGS, type Strings } from '@/lib/a11y'
import { translateTable } from '@/lib/i18n'

const translated = new Map<string, Strings>()

/**
 * Resolve the string table for any supported language.
 * Builtin languages return instantly; others live-translate the English
 * table via the free MyMemory API (cached in localStorage afterwards).
 * While a first-time language downloads, the app shows English and swaps
 * in the translation the moment it lands — never a frozen screen.
 */
export function useStrings(lang: string): { t: Strings; translating: boolean } {
  const builtin = (BUILTIN_STRINGS as Record<string, Strings>)[lang]
  const cached = translated.get(lang)
  const [t, setT] = useState<Strings>(builtin ?? cached ?? BUILTIN_STRINGS.en)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    if (builtin) {
      setT(builtin)
      setTranslating(false)
      return
    }
    const hit = translated.get(lang)
    if (hit) {
      setT(hit)
      setTranslating(false)
      return
    }
    let alive = true
    setTranslating(true)
    translateTable(BUILTIN_STRINGS.en, lang).then((table) => {
      if (!alive) return
      translated.set(lang, table)
      setT(table)
      setTranslating(false)
    })
    return () => {
      alive = false
    }
  }, [lang, builtin])

  return { t, translating }
}

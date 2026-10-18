import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { A11yPrefs, ColorVision, Strings } from '@/lib/a11y'
import { LANGUAGES } from '@/lib/i18n'

// ── The SCN color-vision SVG filters (GetWell standard) ─────────────
export function ColorVisionFilters() {
  return (
    <svg aria-hidden style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="deuteranomaly"><feColorMatrix type="matrix" values="0.8 0.2 0 0 0 0.258 0.742 0 0 0 0 0.142 0.858 0 0 0 0 0 1 0"/></filter>
        <filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>
        <filter id="protanomaly"><feColorMatrix type="matrix" values="0.817 0.183 0 0 0 0.333 0.667 0 0 0 0 0.125 0.875 0 0 0 0 0 1 0"/></filter>
        <filter id="protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>
        <filter id="tritanomaly"><feColorMatrix type="matrix" values="0.967 0.033 0 0 0 0 0.733 0.267 0 0 0 0.183 0.817 0 0 0 0 0 1 0"/></filter>
        <filter id="tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>
      </defs>
    </svg>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'focus-ring relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200',
          checked ? 'border-primary bg-primary' : 'border-border bg-muted'
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-0.5 h-5.5 w-5.5 rounded-full bg-card shadow transition-transform duration-200',
            'h-[22px] w-[22px]',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

function Category({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border/60 pb-3 pt-3 first:pt-1 last:border-b-0">
      <p className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold tracking-tight text-primary">
        <span aria-hidden>{icon}</span> {title}
      </p>
      {children}
    </div>
  )
}

const COLOR_VISION_OPTIONS: { id: ColorVision; label: string }[] = [
  { id: 'deuteranomaly', label: 'Deuteranomaly' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'protanomaly', label: 'Protanomaly' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'tritanomaly', label: 'Tritanomaly' },
  { id: 'tritanopia', label: 'Tritanopia' },
  { id: 'achromatopsia', label: 'Achromatopsia' },
  { id: 'none', label: 'Normal vision' },
]

export function A11yPanel({
  prefs,
  setPrefs,
  t,
  translating = false,
}: {
  prefs: A11yPrefs
  setPrefs: (p: A11yPrefs) => void
  t: Strings
  translating?: boolean
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const set = (patch: Partial<A11yPrefs>) => setPrefs({ ...prefs, ...patch })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const currentLang = LANGUAGES.find((l) => l.code === prefs.lang) ?? LANGUAGES[0]

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t.a11yOpen}
        title={t.a11yOpen}
        className={cn(
          'focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-150 hover:border-primary hover:text-primary active:scale-95',
          !open && 'a11y-pulse'
        )}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* globe — languages */}
          <circle cx="9.5" cy="12" r="6" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="9.5" cy="12" rx="2.7" ry="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3.5 12h12" stroke="currentColor" strokeWidth="1.2" />
          {/* universal access person — accessibility */}
          <circle cx="17.6" cy="6.2" r="1.9" fill="currentColor" />
          <path
            d="M13.6 9.6c1.4.55 2.7.8 4 .8s2.6-.25 4-.8M17.6 10.4v4.1m0 0-3.1 5.3M17.6 14.5l3.1 5.3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          {/* blurred backdrop */}
          <div
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label={t.a11yTitle}
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[85dvh] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl shadow-foreground/20 backdrop-blur-xl"
          >
            <div className="border-b border-border/60 px-5 pb-3 pt-4 text-center">
              <p className="font-serif text-lg font-semibold tracking-tight">♿ {t.a11yTitle}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{t.a11yIntro}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-2">
              {/* Language — 61 options, glass picker */}
              <Category icon="🌐" title={t.optLang}>
                <div className="flex items-center gap-2 py-1">
                  <span className="flag-emoji text-xl" aria-hidden>{currentLang.flag}</span>
                  <select
                    aria-label={t.optLang}
                    value={prefs.lang}
                    onChange={(e) => set({ lang: e.target.value })}
                    className="focus-ring select-chevron tap-select h-11 w-full cursor-pointer rounded-md border px-3 text-sm font-semibold"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        <span className="flag-emoji">{l.flag} </span>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="pb-1 text-[10px] leading-snug text-muted-foreground">
                  {translating ? t.a11yTranslating : t.a11yLangNote}
                </p>
              </Category>

              <Category icon="🧠" title="Neurodivergent">
                <Toggle checked={prefs.autism} onChange={(v) => set({ autism: v })} label="🧩 Autism-friendly (calm)" />
                <Toggle checked={prefs.adhd} onChange={(v) => set({ adhd: v })} label="⚡ ADHD support (focus)" />
                <Toggle checked={prefs.dyslexia} onChange={(v) => set({ dyslexia: v })} label="📖 Dyslexia-friendly font" />
              </Category>

              <Category icon="💙" title="Mental health">
                <Toggle checked={prefs.anxiety} onChange={(v) => set({ anxiety: v })} label="🌊 Anxiety relief" />
                <Toggle checked={prefs.ptsd} onChange={(v) => set({ ptsd: v })} label="🎖️ PTSD support (no flash)" />
                <Toggle checked={prefs.bipolar} onChange={(v) => set({ bipolar: v })} label="⚖️ Bipolar / mania support" />
                <Toggle checked={prefs.cognitive} onChange={(v) => set({ cognitive: v })} label="🧘 Cognitive load reduction" />
                <Toggle checked={prefs.calm} onChange={(v) => set({ calm: v })} label="🕊️ Calm mode (stop all motion)" />
              </Category>

              <Category icon="👁️" title="Vision">
                <Toggle checked={prefs.highContrast} onChange={(v) => set({ highContrast: v })} label="🔆 High contrast" />
                <Toggle checked={prefs.colorblind} onChange={(v) => set({ colorblind: v })} label={t.optColorblind} />
                <Toggle checked={prefs.largeText} onChange={(v) => set({ largeText: v })} label={t.optLargeText} />
                <Toggle checked={prefs.dark} onChange={(v) => set({ dark: v })} label={t.optDark} />
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Color vision types
                </p>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 pb-1">
                  {COLOR_VISION_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={prefs.colorVision === o.id}
                      onClick={() => set({ colorVision: o.id })}
                      className={cn(
                        'focus-ring h-10 rounded-md border text-xs font-medium transition-all active:scale-95',
                        prefs.colorVision === o.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Category>

              <Category icon="✋" title="Motor & physical">
                <Toggle checked={prefs.largeTargets} onChange={(v) => set({ largeTargets: v })} label="🎯 Large click targets" />
                <Toggle checked={prefs.keyboardOnly} onChange={(v) => set({ keyboardOnly: v })} label="⌨️ Keyboard navigation" />
              </Category>

              <Category icon="💬" title="Speech & communication">
                <Toggle checked={prefs.simpleLanguage} onChange={(v) => set({ simpleLanguage: v })} label="📖 Simplified language" />
              </Category>
            </div>

            <div className="border-t border-border/60 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring h-11 w-full rounded-md bg-primary text-sm font-bold text-primary-foreground transition-all duration-150 hover:brightness-110 active:scale-95"
              >
                {t.close}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

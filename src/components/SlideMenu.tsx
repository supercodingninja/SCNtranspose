import { useEffect } from 'react'
import { Link } from 'react-router'
import type { Strings } from '@/lib/a11y'

/**
 * Slide-over translucent menu — the page behind blurs out, links cover the
 * screen, X closes. Jump straight to any part of the app without scrolling.
 */
export function SlideMenu({
  open,
  onClose,
  t,
  isHome,
}: {
  open: boolean
  onClose: () => void
  t: Strings
  isHome: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const jump = (id: string) => {
    onClose()
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const itemCls =
    'focus-ring flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/70 px-4 py-4 text-left text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-150 hover:border-primary hover:text-primary active:scale-[0.98]'

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-label={t.menuTitle}>
      {/* blurred backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} aria-hidden />
      {/* panel */}
      <div className="absolute right-0 top-0 flex h-full w-[min(84vw,340px)] flex-col border-l border-border bg-card/85 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <p className="font-serif text-base font-semibold tracking-tight">{t.menuTitle}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.menuClose}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2.5 overflow-y-auto p-4" aria-label={t.menuTitle}>
          {isHome ? (
            <>
              <button type="button" className={itemCls} onClick={() => jump('source')}>
                <span className="note-display text-xs font-bold text-primary">01</span> {t.s1Title}
              </button>
              <button type="button" className={itemCls} onClick={() => jump('band')}>
                <span className="note-display text-xs font-bold text-primary">02</span> {t.s2Title}
              </button>
              <button type="button" className={itemCls} onClick={() => jump('staff-block')}>
                <span aria-hidden>𝄞</span> {t.staffTitle}
              </button>
              <Link to="/" className={itemCls} onClick={onClose}>
                <span aria-hidden>♪</span> {t.menuHome}
              </Link>
            </>
          ) : (
            <>
              <Link to="/app" className={itemCls} onClick={onClose}>
                <span aria-hidden>→</span> {t.getStarted}
              </Link>
            </>
          )}
          <div className="mt-2 rounded-xl border border-primary/20 bg-secondary/60 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-secondary-foreground">{t.menuHint}</p>
          </div>
        </nav>
        <p className="mt-auto border-t border-border px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t.footerMark}
        </p>
      </div>
    </div>
  )
}

/** The floating menu button (bottom-right thumb zone). */
export function MenuFab({ onOpen, label }: { onOpen: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      style={{
        right: 'max(1.25rem, env(safe-area-inset-right))',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
      className="focus-ring fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-90"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  )
}

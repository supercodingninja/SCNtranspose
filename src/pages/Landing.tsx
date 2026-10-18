import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Reveal } from '@/components/Reveal'
import { A11yPanel } from '@/components/A11yPanel'
import { SlideMenu, MenuFab } from '@/components/SlideMenu'
import { applyPrefs, loadPrefs, savePrefs, type A11yPrefs } from '@/lib/a11y'
import { useStrings } from '@/lib/useStrings'

export default function Landing() {
  const navigate = useNavigate()
  const [prefs, setPrefsState] = useState<A11yPrefs>(() => loadPrefs())
  const videoRef = useRef<HTMLVideoElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, translating } = useStrings(prefs.lang)

  function setPrefs(next: A11yPrefs) {
    setPrefsState(next)
    savePrefs(next)
  }
  useEffect(() => {
    applyPrefs(prefs)
  }, [prefs])
  // Music autoplay — the song starts the moment the page opens.
  // 1) Try playing the video WITH sound immediately (browsers allow this for
  //    returning/engaged visitors; Chrome's Media Engagement Index, installed
  //    PWA, or a prior visit all grant it).
  // 2) If blocked (first-ever visit on strict browsers), start muted and arm
  //    one-time listeners that flip sound on at the very first touch/scroll/key —
  //    nobody has to hunt for a button; the music simply starts with the page.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const arm = () => {
      const unmute = () => {
        if (v.muted) {
          v.muted = false
          v.volume = 1
          v.play().catch(() => {})
        }
        detach()
      }
      const detach = () => {
        window.removeEventListener('pointerdown', unmute)
        window.removeEventListener('touchstart', unmute)
        window.removeEventListener('scroll', unmute)
        window.removeEventListener('keydown', unmute)
      }
      window.addEventListener('pointerdown', unmute, { passive: true })
      window.addEventListener('touchstart', unmute, { passive: true })
      window.addEventListener('scroll', unmute, { passive: true })
      window.addEventListener('keydown', unmute)
    }
    v.muted = false
    v.volume = 1
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
      arm()
    })
  }, [])

  return (
    <div className="min-h-dvh">
      <div className="grain" aria-hidden />
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6">
        {/* Header */}
        <header className="relative flex items-center justify-center border-b border-border py-5">
          <div className="absolute left-0 hidden items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-2.5 py-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
              {t.offlineReady}
            </span>
          </div>
          <div className="absolute right-0">
            <A11yPanel prefs={prefs} setPrefs={setPrefs} t={t} translating={translating} />
          </div>
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary">
              <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-serif text-lg font-semibold tracking-tight">{t.appName}</span>
          </div>
        </header>

        {/* Landing — tour video with music + Get Started */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="kenburns pointer-events-none absolute -inset-10"
            style={{
              background:
                'radial-gradient(42% 55% at 22% 18%, hsl(223 90% 88% / 0.9), transparent 70%), radial-gradient(38% 48% at 82% 30%, hsl(221 96% 31% / 0.14), transparent 70%), radial-gradient(50% 42% at 50% 88%, hsl(41 60% 80% / 0.55), transparent 72%)',
            }}
          />
          {[
            { left: '6%', size: 20, dur: '11s', delay: '0s' },
            { left: '26%', size: 14, dur: '14s', delay: '3.5s' },
            { left: '72%', size: 24, dur: '12s', delay: '1.2s' },
            { left: '88%', size: 15, dur: '15s', delay: '5s' },
            { left: '48%', size: 12, dur: '13s', delay: '7s' },
          ].map((n, i) => (
            <svg
              key={i}
              aria-hidden
              className="float-note"
              style={{ left: n.left, width: n.size, height: n.size * 1.35, animationDuration: n.dur, animationDelay: n.delay }}
              viewBox="0 0 24 32"
              fill="none"
            >
              <path
                d="M9 26V6l12-2.5V22"
                stroke="hsl(38 60% 45%)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="6.5" cy="26" rx="4" ry="3" fill="hsl(38 60% 45%)" />
              <ellipse cx="18.5" cy="22" rx="4" ry="3" fill="hsl(38 60% 45%)" />
            </svg>
          ))}
          <Reveal className="relative pb-8 pt-6 text-center sm:pb-10 sm:pt-10">
            <p className="note-display text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              {t.landingKicker}
            </p>
            <h1 className="mx-auto mt-3 max-w-md font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {t.landingLine}
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
              {t.landingSub}
            </p>

            <div className="mx-auto mt-6 max-w-sm">
              <video
                ref={videoRef}
                className="w-full rounded-xl border border-primary/25 bg-card object-contain shadow-lg shadow-primary/10"
                src="./demo.mp4"
                autoPlay
                loop
                playsInline
                preload="auto"
                aria-label={t.tourAria}
              />
              <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t.songCredit}
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="focus-ring hint-glow h-14 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-150 hover:brightness-110 active:scale-95"
              >
                {t.getStarted} →
              </button>
              <p className="text-xs text-muted-foreground">{t.tourHint}</p>
            </div>
          </Reveal>
        </div>

        {/* Footer */}
        <Reveal className="mt-6 text-center" delay={100}>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">{t.footerText}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            {t.footerMark}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{t.copyright}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/80">{t.companies}</p>
        </Reveal>
      </div>
      <MenuFab onOpen={() => setMenuOpen(true)} label={t.menuOpen} />
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} isHome={false} />
    </div>
  )
}

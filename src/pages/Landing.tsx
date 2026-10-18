import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Reveal } from '@/components/Reveal'
import { A11yPanel } from '@/components/A11yPanel'
import { SlideMenu, MenuFab } from '@/components/SlideMenu'
import { applyPrefs, loadPrefs, savePrefs, type A11yPrefs } from '@/lib/a11y'
import { useStrings } from '@/lib/useStrings'

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The landing page with the demo video and Get Started.
// Explanation: I redesigned the layout to use the full iPad screen. On tablets
//   and desktops, the video and text sit side-by-side in a two-column grid,
//   eliminating the need to scroll. On phones, it stacks vertically as before.
//   The video references demo.mp4 from the public folder, which Vite copies
//   to the dist root during build.
// In Other Words: I made the welcome page look great on big screens by putting
//   the video and words next to each other instead of one on top of the other.
// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()
  const [prefs, setPrefsState] = useState<A11yPrefs>(() => loadPrefs())
  const videoRef = useRef<HTMLVideoElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, translating } = useStrings(prefs.lang)

  // ───────────────────────────────────────────────────────────────────────────
  // This Area Of Code Is: Accessibility preferences state management.
  // Explanation: I load saved preferences on mount and apply them whenever
  //   they change. The setPrefs function updates state and persists to
  //   localStorage so choices survive page reloads.
  // In Other Words: I remember your settings so you don't have to set them
  //   again every time you open the app.
  // ───────────────────────────────────────────────────────────────────────────

  function setPrefs(next: A11yPrefs) {
    setPrefsState(next)
    savePrefs(next)
  }
  useEffect(() => { applyPrefs(prefs) }, [prefs])

  // ───────────────────────────────────────────────────────────────────────────
  // This Area Of Code Is: Video autoplay with graceful fallback for browser policies.
  // Explanation: I attempt to play with sound immediately. If the browser blocks
  //   autoplay with sound (common on first visit), I mute the video and try
  //   again. I then arm one-time listeners on pointer, touch, scroll, and key
  //   events to unmute at the first interaction — no button hunting required.
  // In Other Words: I try to play music right away. If the browser says no,
  //   I wait for you to touch the screen, then the sound turns on automatically.
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const arm = () => {
      const unmute = () => {
        if (v.muted) { v.muted = false; v.volume = 1; v.play().catch(() => {}) }
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
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); arm() })
  }, [])

  return (
    <div className="min-h-dvh">
      <div className="grain" aria-hidden />
      
      {/* ───────────────────────────────────────────────────────────────────────
          This Area Of Code Is: The main content container with responsive width.
          Explanation: I use max-w-2xl for phones, md:max-w-4xl for iPad, and
            lg:max-w-6xl for desktop. This ensures the content uses available
            screen space without becoming unreadably wide on large monitors.
          In Other Words: I made the page stretch to fit your screen, whether
            it's a phone, iPad, or big computer.
          ─────────────────────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
        
        {/* Header */}
        <header className="relative flex items-center justify-center border-b border-border py-4 md:py-5">
          <div className="absolute left-0 hidden items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-2.5 py-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">{t.offlineReady}</span>
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

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          
          {/* ─────────────────────────────────────────────────────────────────────
              This Area Of Code Is: Decorative animated background elements.
              Explanation: I render a slow-panning gradient and floating musical
                notes purely for visual appeal. The aria-hidden ensures screen
                readers skip these. The kenburns and float-note CSS classes
                handle the animations.
              In Other Words: I added pretty moving backgrounds and floating
                music notes to make the page feel alive.
              ───────────────────────────────────────────────────────────────────── */}
          <div aria-hidden className="kenburns pointer-events-none absolute -inset-10"
            style={{ background: 'radial-gradient(42% 55% at 22% 18%, hsl(223 90% 88% / 0.9), transparent 70%), radial-gradient(38% 48% at 82% 30%, hsl(221 96% 31% / 0.14), transparent 70%), radial-gradient(50% 42% at 50% 88%, hsl(41 60% 80% / 0.55), transparent 72%)' }} />
          {[{left:'6%',size:20,dur:'11s',delay:'0s'},{left:'26%',size:14,dur:'14s',delay:'3.5s'},{left:'72%',size:24,dur:'12s',delay:'1.2s'},{left:'88%',size:15,dur:'15s',delay:'5s'},{left:'48%',size:12,dur:'13s',delay:'7s'}].map((n,i) => (
            <svg key={i} aria-hidden className="float-note" style={{left:n.left,width:n.size,height:n.size*1.35,animationDuration:n.dur,animationDelay:n.delay}} viewBox="0 0 24 32" fill="none">
              <path d="M9 26V6l12-2.5V22" stroke="hsl(38 60% 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="6.5" cy="26" rx="4" ry="3" fill="hsl(38 60% 45%)" />
              <ellipse cx="18.5" cy="22" rx="4" ry="3" fill="hsl(38 60% 45%)" />
            </svg>
          ))}

          {/* ─────────────────────────────────────────────────────────────────────
              This Area Of Code Is: The two-column hero grid for iPad and desktop.
              Explanation: On md+ screens, I split the hero into two columns:
                text content on the left, video on the right. This eliminates
                vertical scrolling on iPad. On mobile, they stack vertically.
                The Reveal component adds scroll-triggered fade-in animations.
              In Other Words: On big screens, I put the words on the left and
                the video on the right so you see everything without scrolling.
              ───────────────────────────────────────────────────────────────────── */}
          <div className="relative grid gap-8 pb-8 pt-6 sm:pb-10 sm:pt-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
            
            {/* Left column: Text content */}
            <Reveal className="text-center md:text-left">
              <p className="note-display text-[11px] font-bold uppercase tracking-[0.22em] text-primary">{t.landingKicker}</p>
              <h1 className="mx-auto mt-3 max-w-md font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:mx-0 lg:text-5xl">{t.landingLine}</h1>
              <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted-foreground md:mx-0 lg:text-lg">{t.landingSub}</p>
              
              {/* CTA Button */}
              <div className="mt-6 flex flex-col items-center gap-2 md:items-start">
                <button type="button" onClick={() => navigate('/app')}
                  className="focus-ring hint-glow h-14 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-150 hover:brightness-110 active:scale-95">
                  {t.getStarted} →
                </button>
                <p className="text-xs text-muted-foreground">{t.tourHint}</p>
              </div>
            </Reveal>

            {/* Right column: Video */}
            <Reveal delay={150} className="mx-auto w-full max-w-sm md:max-w-none">
              <div className="relative">
                <video ref={videoRef} className="w-full rounded-xl border border-primary/25 bg-card object-contain shadow-lg shadow-primary/10"
                  src="./demo.mp4" autoPlay loop playsInline preload="auto" aria-label={t.tourAria} />
                <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{t.songCredit}</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer */}
        <Reveal className="mt-6 text-center md:mt-10" delay={100}>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground md:max-w-lg">{t.footerText}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">{t.footerMark}</p>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{t.copyright}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/80">{t.companies}</p>
        </Reveal>
      </div>
      <MenuFab onOpen={() => setMenuOpen(true)} label={t.menuOpen} />
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} isHome={false} />
    </div>
  )
}

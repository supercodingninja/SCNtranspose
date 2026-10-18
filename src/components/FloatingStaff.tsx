import { useEffect, useRef, useState } from 'react'

/**
 * Wraps any content (the staff) and lets it float as a translucent,
 * draggable overlay. Drag by the header; pinch / buttons zoom. Position
 * persists on this device. Dock it back inline any time.
 */
export function FloatingStaff({
  children,
  title,
  dockLabel,
  floatLabel,
  closeLabel,
}: {
  children: (scale: number) => React.ReactNode
  title: string
  dockLabel: string
  floatLabel: string
  closeLabel: string
}) {
  const [floating, setFloating] = useState(false)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 16, y: 90 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)
  const pinchRef = useRef<{ d0: number; s0: number } | null>(null)

  // restore last position
  useEffect(() => {
    try {
      const raw = localStorage.getItem('transpose-staff-pos')
      if (raw) setPos(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])
  useEffect(() => {
    if (!floating) return
    try { localStorage.setItem('transpose-staff-pos', JSON.stringify(pos)) } catch { /* ignore */ }
  }, [pos, floating])

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'touch' && e.isPrimary === false) return
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    dragRef.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 60
    setPos({
      x: Math.min(Math.max(0, e.clientX - d.dx), maxX),
      y: Math.min(Math.max(0, e.clientY - d.dy), maxY),
    })
  }
  function onPointerUp() {
    dragRef.current = null
    pinchRef.current = null
  }

  // pinch to zoom
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length !== 2) return
    const [a, b] = [e.touches[0], e.touches[1]]
    const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    if (!pinchRef.current) {
      pinchRef.current = { d0: d, s0: scale }
      return
    }
    const { d0, s0 } = pinchRef.current
    setScale(Math.min(1.8, Math.max(0.6, s0 * (d / d0))))
  }

  if (!floating) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setFloating(true)}
          className="focus-ring absolute right-2 top-2 z-10 flex h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-card/80 px-3 text-[11px] font-bold text-primary shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          ⤢ {floatLabel}
        </button>
        {children(1)}
      </div>
    )
  }

  return (
    <>
      {/* placeholder keeps page layout stable */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/40 px-4 py-6 text-center">
        <button
          type="button"
          onClick={() => setFloating(false)}
          className="focus-ring text-xs font-bold text-primary underline underline-offset-2"
        >
          {dockLabel}
        </button>
      </div>
      <div
        ref={wrapRef}
        role="dialog"
        aria-label={title}
        className="fixed z-[70] w-[min(92vw,420px)] rounded-xl border border-primary/25 bg-card/75 shadow-2xl shadow-primary/20 backdrop-blur-md"
        style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
        onTouchMove={onTouchMove}
      >
        <div
          className="flex cursor-grab touch-none items-center justify-between gap-2 rounded-t-xl border-b border-border/60 bg-primary/90 px-3 py-2 text-primary-foreground active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="text-[11px] font-bold uppercase tracking-widest">⠿ {title}</span>
          <span className="flex items-center gap-1">
            <button
              type="button"
              aria-label="zoom out"
              onClick={() => setScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)))}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-bold"
            >
              −
            </button>
            <button
              type="button"
              aria-label="zoom in"
              onClick={() => setScale((s) => Math.min(1.8, +(s + 0.15).toFixed(2)))}
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-bold"
            >
              +
            </button>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setFloating(false)}
              className="focus-ring ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        </div>
        <div className="overflow-hidden p-2">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%` }}>
            {children(scale)}
          </div>
        </div>
      </div>
    </>
  )
}

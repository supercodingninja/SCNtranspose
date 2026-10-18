import { FLAT_LETTER, INTERVAL_STEPS } from '@/lib/music'

/** True treble clef outline (from the Noto Music font), normalized: the G line
 *  (2nd staff line from the bottom) passes through svg y = 0. */
const CLEF_D =
  'M31.4 -55.1Q30 -60.4 29.1 -65.6Q28.2 -70.8 28.2 -76.2Q28.2 -80.9 28.9 -85.1Q29.5 -89.2 30.7 -92.7Q32 -96.7 34.1 -100.2Q36.2 -103.8 38.6 -106.1Q40.9 -108.4 42.7 -108.4Q45.1 -108.4 49.3 -99.9Q51.4 -95.6 52.4 -90.6Q53.4 -85.6 53.4 -79.9Q53.4 -72.8 51.5 -65.8Q49.6 -58.7 46 -52.5Q42.3 -46.3 37.2 -41.6L40.7 -24.8Q42.2 -25 43.2 -25.1Q44.2 -25.2 44.7 -25.2Q50.8 -25.2 55.6 -21.8Q60.4 -18.3 63.3 -12.7Q66.1 -7.1 66.1 -0.4Q66.1 7.3 62.2 13.5Q58.2 19.6 50.3 22.5Q50.8 24.2 53.2 36.7Q53.8 39.7 54.1 41.5Q54.4 43.2 54.5 44.5Q54.6 45.8 54.6 47.5Q54.6 52.5 52.2 56.5Q49.7 60.4 45.6 62.6Q41.4 64.8 36.3 64.8Q31.1 64.8 27.1 62.9Q23.1 60.9 20.8 57.5Q18.5 54 18.5 49.5Q18.5 44.7 21.1 41.5Q23.8 38.3 28.7 38.3Q32.9 38.3 35.5 41.4Q38.2 44.4 38.2 48.6Q38.2 52.2 35.7 54.9Q33.2 57.6 29.2 57.6H28.2Q30.8 61.5 36.4 61.5Q43.3 61.5 47.2 57Q51.1 52.5 51.1 45.5Q51.1 43.8 50.7 41Q50.3 38.1 49.3 34.1Q48.3 30.1 47.8 27.5Q47.2 24.9 47 23.8Q43.6 24.8 39 24.8Q30.4 24.8 22.2 19.8Q14.2 14.8 9.6 6.6Q5 -1.6 5 -11.1Q5 -20.1 9.1 -28Q13.2 -35.9 19.2 -42.5Q25.3 -49.1 31.4 -55.1ZM34.1 -57.6Q36.4 -58.8 39 -62.1Q41.6 -65.3 44 -69.5Q46.4 -73.7 47.9 -78Q49.4 -82.2 49.4 -85.6Q49.4 -89.2 48.3 -91.3Q47.2 -93.4 44.5 -93.4Q42.1 -93.4 39.9 -91.2Q37.6 -89 35.9 -85.3Q34.1 -81.7 33.1 -77.2Q32.1 -72.7 32.1 -68Q32.1 -64.8 32.8 -62.2Q33.4 -59.6 34.1 -57.6ZM39.8 -12.9Q37.1 -12.3 34.7 -10.4Q32.3 -8.4 30.9 -5.7Q29.4 -2.9 29.4 0.2Q29.4 2.7 30.7 5.3Q32 8 33.9 9.6Q35.2 10.8 36.5 11.4Q38 12.1 38 12.7Q38 13 37 13.3Q33.2 12.4 30.2 9.9Q27.1 7.4 25.4 3.8Q23.6 0.3 23.6 -3.7Q23.6 -8 25.4 -12Q27.1 -16 30.2 -19.2Q33.4 -22.4 37.4 -24L34.5 -39.1Q22.9 -29.7 17.5 -20.7Q12 -11.6 12 -2.7Q12 3.8 15.4 9.4Q18.8 15 24.7 18.4Q30.6 21.9 38 21.9Q40 21.9 42 21.5Q44.1 21.1 46.4 20.5ZM49.5 19.5Q59.3 15.3 59.3 2.3Q59.3 -2 57.1 -5.6Q54.9 -9.1 51.2 -11.2Q47.5 -13.3 42.9 -13.3Z'

export interface StaffTone {
  semitones: number // interval above root
  color: string // owner player's color (or neutral)
  label: string // legend label, e.g. "Tenor Saxophone"
}

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

interface Placed {
  pos: number // absolute diatonic position (C4 = 28)
  acc: string // '', '♭', '♯', '♭♭'…
  color: string
  label: string
}

/**
 * Draws the band's chord on a treble-clef staff. Each notehead takes the color
 * of the player who owns that tone; chord players get the bracket in the legend.
 */
export function StaffChord({
  rootPc,
  intervals,
  tones,
  bracketColor,
  bracketLabel,
  t,
}: {
  rootPc: number
  intervals: number[]
  tones: StaffTone[]
  bracketColor?: string
  bracketLabel?: string
  t: { staffTitle: string; playsWholeChord: string; concertNote: string }
}) {
  const rootLetter = LETTERS.indexOf(FLAT_LETTER[((rootPc % 12) + 12) % 12])
  const rootOctave = rootLetter >= 4 ? 3 : 4 // keep tall chords on the staff
  const rootAbs = rootOctave * 7 + rootLetter

  const placed: Placed[] = intervals.map((s, i) => {
    const pos = rootAbs + Math.floor(s / 12) * 7 + INTERVAL_STEPS[s % 12]
    const naturalPc = LETTER_PC[LETTERS[pos % 7]]
    let diff = (((rootPc + s) % 12) - naturalPc) % 12
    if (diff > 6) diff -= 12
    if (diff < -6) diff += 12
    const acc = diff === 0 ? '' : diff > 0 ? '♯'.repeat(diff) : '♭'.repeat(-diff)
    const tone = tones[i]
    return { pos, acc, color: tone?.color ?? 'hsl(var(--foreground))', label: tone?.label ?? '' }
  })

  // ── Geometry ──
  const STEP = 5 // px per diatonic step
  const BOTTOM = 30 // diatonic pos of the bottom staff line (E4)
  const minPos = Math.min(...placed.map((p) => p.pos))
  const maxPos = Math.max(...placed.map((p) => p.pos))
  const topPad = Math.max(0, maxPos - (BOTTOM + 8)) * STEP + 14
  const botPad = Math.max(0, BOTTOM - 2 - minPos) * STEP + 14
  const staffH = 8 * STEP
  const H = topPad + staffH + botPad
  const yOf = (pos: number) => topPad + staffH - (pos - BOTTOM) * STEP

  const X_LINES = 66
  const X_NOTE = 150
  const W = 340

  // seconds (pos diff 1) get left/right notehead offsets
  const sorted = [...placed].sort((a, b) => a.pos - b.pos)
  const xOf = new Map<Placed, number>()
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1]
    xOf.set(p, prev && p.pos - prev.pos === 1 && xOf.get(prev) === X_NOTE ? X_NOTE + 11 : X_NOTE)
  })

  // ledger lines needed
  const ledgers: { y: number; x: number }[] = []
  for (const p of placed) {
    const x = xOf.get(p)!
    if (p.pos <= BOTTOM - 2) {
      for (let lp = BOTTOM - 2; lp >= p.pos; lp -= 2) ledgers.push({ y: yOf(lp), x })
    }
    if (p.pos >= BOTTOM + 10) {
      for (let lp = BOTTOM + 10; lp <= p.pos; lp += 2) ledgers.push({ y: yOf(lp), x })
    }
  }

  // legend entries (unique colors in chord order)
  const seen = new Set<string>()
  const legend = placed
    .filter((p) => p.label)
    .filter((p) => (seen.has(p.label) ? false : (seen.add(p.label), true)))

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${t.staffTitle}: ${t.concertNote}`}
      >
        {/* staff lines */}
        {[0, 2, 4, 6, 8].map((s) => (
          <line
            key={s}
            x1={X_LINES - 34}
            x2={W - 14}
            y1={yOf(BOTTOM + s)}
            y2={yOf(BOTTOM + s)}
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            opacity="0.75"
          />
        ))}
        {/* treble clef — G line (pos BOTTOM+2) through the spiral */}
        <g transform={`translate(8, ${yOf(BOTTOM + 2)}) scale(${(staffH * 1.72) / 173.2})`}>
          <path d={CLEF_D} fill="hsl(var(--foreground))" />
        </g>
        {/* ledger lines */}
        {ledgers.map((l, i) => (
          <line
            key={i}
            x1={l.x - 11}
            x2={l.x + 11}
            y1={l.y}
            y2={l.y}
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            opacity="0.75"
          />
        ))}
        {/* noteheads + accidentals */}
        {placed.map((p, i) => {
          const x = xOf.get(p)!
          const y = yOf(p.pos)
          return (
            <g key={i}>
              {p.acc && (
                <text
                  x={x - 16}
                  y={y + 5}
                  fontSize="15"
                  fontWeight="700"
                  fill="hsl(var(--foreground))"
                  className="note-display"
                >
                  {p.acc}
                </text>
              )}
              <ellipse
                cx={x}
                cy={y}
                rx="6.2"
                ry="4.4"
                transform={`rotate(-18 ${x} ${y})`}
                fill={p.color}
                stroke="hsl(var(--foreground))"
                strokeWidth="0.75"
              />
            </g>
          )
        })}
        {/* whole-chord bracket for keys/guitar players */}
        {bracketColor && (
          <path
            d={`M ${W - 40} ${yOf(maxPos) - 10} q 8 0 8 8 l 0 ${Math.max(10, yOf(minPos) - yOf(maxPos) + 4)} q 0 8 -8 8`}
            fill="none"
            stroke={bracketColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* legend — who plays what */}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {bracketColor && bracketLabel && (
          <li className="flex items-center gap-1.5 text-xs text-foreground/80">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: bracketColor }} aria-hidden />
            <span className="font-semibold">{bracketLabel}</span>
            <span className="text-muted-foreground">· {t.playsWholeChord}</span>
          </li>
        )}
        {legend.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5 text-xs text-foreground/80">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} aria-hidden />
            <span className="font-semibold">{p.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

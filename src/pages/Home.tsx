import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  CHORDS,
  INSTRUMENTS,
  FAMILIES,
  chordName,
  fifthsLabel,
  keySpelling,
  minorKeySpelling,
  noteName,
  spellChordTones,
  transpose,
  writtenMidiForTone,
  pianoMidiForTone,
  TONE_LABELS,
  type Instrument,
  type Spelling,
} from '@/lib/music'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/Reveal'
import { A11yPanel } from '@/components/A11yPanel'
import { FloatingStaff } from '@/components/FloatingStaff'
import { SlideMenu, MenuFab } from '@/components/SlideMenu'
import { StaffChord } from '@/components/StaffChord'
import { applyPrefs, loadPrefs, savePrefs, type A11yPrefs, type Strings } from '@/lib/a11y'
import { useStrings } from '@/lib/useStrings'

type Mode = 'major' | 'minor' | 'chord' | 'note'

const CHORD_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'The basics', ids: ['power5', 'maj', 'min', 'sus2', 'sus4', 'aug'] },
  { label: 'Sevenths', ids: ['dom7', 'maj7', 'min7', 'min7b5', 'dim7'] },
  { label: 'Color chords', ids: ['six', 'add9', 'nine', 'min9', 'sevenflat9', 'thirteen'] },
]

function chordById(id: string) {
  return CHORDS.find((c) => c.id === id) ?? CHORDS[0]
}

function instById(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id)
}

/** Player colors — first come, first served, in the order players join the band. */
const PLAYER_COLORS = [
  '#b0551c', // burnt orange
  '#2e7d52', // green
  '#6b4fa1', // purple
  '#a12626', // red
  '#0f7b7b', // teal
  '#96711a', // gold-brown
  '#a13b72', // magenta
  '#465a8a', // steel blue
  '#7a4b1e', // brown
  '#3f7a3a', // olive
]
const SOURCE_COLOR = '#03339b' // royal blue — whoever leads

/** Colorblind-safe member marks: a distinct shape per join order, filled with the player's color. */
function MemberMark({ index, color }: { index: number; color: string }) {
  const cls = 'h-2.5 w-2.5 shrink-0'
  switch (index % 5) {
    case 0:
      return <span aria-hidden className={cn(cls, 'rounded-full')} style={{ backgroundColor: color }} />
    case 1:
      return <span aria-hidden className={cls} style={{ backgroundColor: color }} />
    case 2:
      return (
        <svg aria-hidden className={cls} viewBox="0 0 10 10">
          <path d="M5 0 10 10H0Z" fill={color} />
        </svg>
      )
    case 3:
      return (
        <svg aria-hidden className={cls} viewBox="0 0 10 10">
          <path d="M5 0 10 5 5 10 0 5Z" fill={color} />
        </svg>
      )
    default:
      return (
        <svg aria-hidden className={cls} viewBox="0 0 10 10">
          <path d="M0 8 5 0l5 8Z" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      )
  }
}

// ── Small building blocks ─────────────────────────────────────────────

function NoteGrid({
  value,
  onChange,
  spelling,
}: {
  value: number
  onChange: (pc: number) => void
  spelling: Spelling
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {Array.from({ length: 12 }, (_, pc) => {
        const active = pc === value
        return (
          <button
            key={pc}
            type="button"
            onClick={() => onChange(pc)}
            aria-pressed={active}
            className={cn(
              'note-display focus-ring flex h-14 items-center justify-center rounded-md border text-lg font-semibold transition-all duration-150 active:scale-95',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground/80 hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {noteName(pc, spelling)}
          </button>
        )
      })}
    </div>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-md border border-border bg-card p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'focus-ring flex h-12 flex-1 items-center justify-center whitespace-nowrap rounded px-2 text-sm font-medium transition-all duration-150 active:scale-[0.97]',
            value === o.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </label>
  )
}

/** Tiny parenthetical that marks a tappable choice. */
function TapToChange({ t }: { t: Strings }) {
  return (
    <span aria-hidden className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
      {t.tapToChange}
    </span>
  )
}

/** Numbered first-time instructions under a section heading. */
function HintSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mb-4 flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-secondary/60 px-4 py-3">
      {steps.map((s, i) => (
        <li key={i} className="flex items-baseline gap-2 text-xs text-foreground/75">
          <span className="note-display shrink-0 text-[11px] font-bold text-primary">{i + 1}.</span>
          <span className="leading-snug">{s}</span>
        </li>
      ))}
    </ol>
  )
}

/** The leader's picker — sits inside the sentence. */
function InlineInstrumentSelect({
  id,
  value,
  onChange,
  t,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  t: Strings
}) {
  return (
    <span className="inline-flex max-w-full flex-col items-center">
      <select
        id={id}
        aria-label={t.chooseInst}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring select-chevron tap-select hint-glow h-12 max-w-full cursor-pointer rounded-md border px-3 text-base font-semibold transition-colors"
      >
        <option value="concert">Piano</option>
        {FAMILIES.map((f) => (
          <optgroup key={f.id} label={f.label}>
            {INSTRUMENTS.filter((i) => i.family === f.id).map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
                {i.key !== 'C' ? ` (${i.key})` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <TapToChange t={t} />
    </span>
  )
}

/** A band member's own instrument picker — same tappable treatment. */
function MemberSelect({
  id,
  value,
  onChange,
  t,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  t: Strings
}) {
  return (
    <span className="inline-flex max-w-full flex-col">
      <select
        id={id}
        aria-label={t.chooseInst}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring select-chevron tap-select h-11 max-w-full cursor-pointer rounded-md border px-3 text-sm font-semibold transition-colors"
      >
        {FAMILIES.map((f) => (
          <optgroup key={f.id} label={f.label}>
            {INSTRUMENTS.filter((i) => i.family === f.id).map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
                {i.key !== 'C' ? ` (${i.key})` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <TapToChange t={t} />
    </span>
  )
}

function ChordSelect({
  id,
  label,
  value,
  onChange,
  groups,
  t,
}: {
  id: string
  label?: string
  value: string
  onChange: (v: string) => void
  groups: { label: string; ids: string[] }[]
  t: Strings
}) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <select
        id={id}
        aria-label={label ?? t.chordType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring select-chevron tap-select h-12 cursor-pointer rounded-md border px-3 text-base font-semibold transition-colors"
      >
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.ids.map((cid) => {
              if (cid === 'key-major') return <option key={cid} value={cid}>Major key</option>
              if (cid === 'key-minor') return <option key={cid} value={cid}>Minor key</option>
              const c = chordById(cid)
              return (
                <option key={cid} value={cid}>
                  {c.label}
                  {c.suffix ? ` (${c.suffix})` : ''}
                </option>
              )
            })}
          </optgroup>
        ))}
      </select>
      {label && <TapToChange t={t} />}
    </div>
  )
}

function SpellingToggle({
  spelling,
  onChange,
  t,
}: {
  spelling: Spelling
  onChange: (s: Spelling) => void
  t: Strings
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={t.accidentalSpelling}>
      {(['flat', 'sharp'] as const).map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={spelling === s}
          onClick={() => onChange(s)}
          className={cn(
            'note-display focus-ring flex h-9 w-9 items-center justify-center rounded border text-sm font-bold transition-colors active:scale-95',
            spelling === s
              ? 'border-foreground/50 bg-secondary text-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          {s === 'flat' ? '♭' : '♯'}
        </button>
      ))}
    </div>
  )
}

function SectionHeading({ index, title, hint }: { index: string; title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="note-display text-xs font-semibold text-primary">{index}</span>
      <h2 className="font-serif text-xl font-semibold tracking-tight">{title}</h2>
      {hint && <p className="hidden text-xs text-muted-foreground sm:block">{hint}</p>}
    </div>
  )
}

/** Big answer display for any mode. */
function ResultText({
  pc,
  mode,
  chordId,
  spelling,
  big = false,
  t,
}: {
  pc: number
  mode: Mode
  chordId: string
  spelling: Spelling
  big?: boolean
  t: Strings
}) {
  if (mode === 'chord') {
    const c = chordById(chordId)
    return (
      <>
        <p className={cn('note-display font-extrabold leading-none tracking-tight', big ? 'text-6xl sm:text-7xl' : 'text-2xl')}>
          {chordName(pc, c, spelling)}
        </p>
        <p className={cn('note-display mt-2 text-muted-foreground', big ? 'text-base' : 'text-xs')}>
          {spellChordTones(pc, c, spelling).join(' · ')}
        </p>
      </>
    )
  }
  if (mode === 'note') {
    return (
      <p className={cn('note-display font-extrabold leading-none tracking-tight', big ? 'text-6xl sm:text-7xl' : 'text-2xl')}>
        {noteName(pc, spelling)}
      </p>
    )
  }
  const k = mode === 'major' ? keySpelling(pc) : minorKeySpelling(pc)
  return (
    <>
      <p className={cn('note-display font-extrabold leading-none tracking-tight', big ? 'text-6xl sm:text-7xl' : 'text-2xl')}>
        {k.name}
      </p>
      <p className={cn('note-display mt-2 text-muted-foreground', big ? 'text-base' : 'text-xs')}>
        {mode === 'major' ? t.majorKeyWord : t.minorKeyWord} {t.keyWord} · {'tie' in k && k.tie ? t.tieLabel : fifthsLabel(k.fifths)}
      </p>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

interface Player {
  uid: number
  instrumentId: string
}

const CHORD_TONE_LABELS: Record<number, string> = {
  0: 'root', 2: '2nd / 9th', 3: 'minor 3rd', 4: 'major 3rd', 5: '4th / 11th',
  6: '♭5 / ♯11', 7: '5th', 8: '♯5 / ♭13', 9: '6th / 13th', 10: '♭7', 11: 'major 7',
}

const TONE_SHORT: Record<number, string> = {
  0: 'R', 2: '2', 3: '♭3', 4: '3', 5: '4', 6: '♭5', 7: '5', 8: '♭6', 9: '6', 10: '♭7', 11: '7',
}

/** Can this player actually play a stacked chord, or do they take one note? */
function isChordPlayer(inst: Instrument): boolean {
  return inst.family === 'keys' || inst.family === 'strings'
}

function defaultToneFor(inst: Instrument): number {
  if (inst.id === 'vox-lead' || inst.id === 'vox-s') return 0
  if (inst.id === 'vox-a' || inst.id === 'sax-alto' || inst.id === 'tpt-bb') return 4
  if (inst.id === 'sax-tenor') return 7
  if (inst.id === 'sax-bari' || inst.id === 'vox-b' || inst.id === 'bass-gtr') return 10
  return 4
}

export default function Home() {
  const [prefs, setPrefsState] = useState<A11yPrefs>(() => loadPrefs())
  const { t, translating } = useStrings(prefs.lang)
  function setPrefs(next: A11yPrefs) {
    setPrefsState(next)
    savePrefs(next)
  }
  useEffect(() => {
    applyPrefs(prefs)
  }, [prefs])

  const [spelling, setSpelling] = useState<Spelling>('flat')

  // ── 01 The source: whoever leads (piano by default) sets the key ──
  const [sourceId, setSourceId] = useState('concert')
  const [pc, setPc] = useState(9) // A
  const [mode, setMode] = useState<Mode>('major')
  const [chordId, setChordId] = useState('nine')

  // ── 02 The band — first member is the tenor sax, add without limit ──
  const [members, setMembers] = useState<Player[]>([{ uid: 1, instrumentId: 'sax-tenor' }])
  const uidRef = useRef(2)
  const [addId, setAddId] = useState('vox-lead')
  const [tones, setTones] = useState<Record<number, number>>({})
  const [menuOpen, setMenuOpen] = useState(false)

  const sourceInst = sourceId === 'concert' ? undefined : instById(sourceId)
  const concertPc = sourceInst ? transpose(pc, sourceInst, false) : pc

  // Effective chord for this mode (note mode = single tone, key modes = triad on the staff)
  const bandChord = mode === 'chord' ? chordById(chordId) : mode === 'minor'
    ? chordById('min') : mode === 'major' ? chordById('maj') : chordById('maj')
  const intervals = mode === 'note' ? [0] : bandChord.intervals
  const toneOptions = intervals.map((i) => i % 12)

  function toneFor(uid: number, inst: Instrument): number {
    const assigned = tones[uid]
    if (assigned !== undefined && toneOptions.includes(assigned)) return assigned
    const def = defaultToneFor(inst)
    return toneOptions.includes(def) ? def : toneOptions[0]
  }

  const nameCounts = useMemo(() => {
    const counts = new Map<string, number>()
    members.forEach((p) => counts.set(p.instrumentId, (counts.get(p.instrumentId) ?? 0) + 1))
    return counts
  }, [members])

  function memberLabel(p: Player): string {
    const inst = instById(p.instrumentId)
    const base = inst?.name ?? p.instrumentId
    if ((nameCounts.get(p.instrumentId) ?? 0) <= 1) return base
    const idx = members.filter((q) => q.instrumentId === p.instrumentId).findIndex((q) => q.uid === p.uid)
    return `${base} #${idx + 1}`
  }

  const colorFor = (index: number) => PLAYER_COLORS[index % PLAYER_COLORS.length]

  function addMember() {
    setMembers((ps) => [...ps, { uid: uidRef.current++, instrumentId: addId }])
  }

  function removeMember(uid: number) {
    setMembers((ps) => ps.filter((p) => p.uid !== uid))
  }

  function changeMember(uid: number, instrumentId: string) {
    setMembers((ps) => ps.map((p) => (p.uid === uid ? { ...p, instrumentId } : p)))
  }

  // ── Staff data: concert chord, each tone colored by its owner ──
  const staffTones = intervals.map((s) => {
    const ownerIdx = members.findIndex((p) => {
      const inst = instById(p.instrumentId)
      return inst && !isChordPlayer(inst) && toneFor(p.uid, inst) === s % 12
    })
    if (ownerIdx >= 0) {
      return { semitones: s, color: colorFor(ownerIdx), label: memberLabel(members[ownerIdx]) }
    }
    return { semitones: s, color: 'hsl(var(--muted-foreground))', label: '' }
  })
  const chordPlayersInBand = members.filter((p) => {
    const inst = instById(p.instrumentId)
    return inst && isChordPlayer(inst)
  })
  const staffBracketLabel = [
    sourceInst ? undefined : 'Piano',
    ...chordPlayersInBand.map((p) => memberLabel(p)),
  ].filter(Boolean).join(' · ') || undefined

  return (
    <div className="min-h-dvh">
      <div className="grain" aria-hidden />
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-5xl lg:px-8">
        {/* Header */}
        <header className="relative flex items-center justify-center border-b border-border py-5">
          <div className="absolute left-0 flex items-center gap-2">
            <Link
              to="/"
              className="focus-ring flex h-11 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
              aria-label="Back to home"
            >
              ← <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-2.5 py-1 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">{t.offlineReady}</span>
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

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="kenburns pointer-events-none absolute -inset-10"
            style={{
              background:
                'radial-gradient(42% 55% at 22% 18%, hsl(223 90% 88% / 0.9), transparent 70%), radial-gradient(38% 48% at 82% 30%, hsl(221 96% 31% / 0.14), transparent 70%), radial-gradient(50% 42% at 50% 88%, hsl(41 60% 80% / 0.55), transparent 72%)',
            }}
          />
          <Reveal className="relative pb-6 pt-8 text-center">
            <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {t.heroTitleA}
              <br />
              {t.heroTitleB}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t.heroSub}
            </p>
          </Reveal>
        </div>

        {/* ── 01 Set the key ── */}
        <section id="source" aria-labelledby="source" className="mb-12">
          <Reveal>
            <SectionHeading index="01" title={t.s1Title} hint={t.s1Hint} />
            <HintSteps steps={t.s1Steps} />
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-serif text-xl font-medium sm:text-2xl">{t.ifThe}</span>
                <InlineInstrumentSelect id="source-inst" value={sourceId} onChange={setSourceId} t={t} />
                <span className="font-serif text-xl font-medium sm:text-2xl">
                  {sourceInst && sourceInst.family === 'voice' ? t.isSinging : t.isPlaying}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <Segmented
                  label={t.whatPlaying}
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'major', label: t.majorKey },
                    { value: 'minor', label: t.minorKey },
                    { value: 'chord', label: t.chord },
                    { value: 'note', label: t.note },
                  ]}
                />

                {mode === 'chord' && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-serif text-xl font-medium sm:text-2xl">{t.a}</span>
                    <ChordSelect id="chord-quality" value={chordId} onChange={setChordId} groups={CHORD_GROUPS} t={t} />
                    <span className="font-serif text-xl font-medium sm:text-2xl">{t.on}</span>
                  </div>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {sourceInst
                        ? `${sourceInst.name}${mode === 'note' ? t.writtenNoteLabel : t.writtenRoot}`
                        : mode === 'note'
                          ? t.theNote
                          : t.rootKeyOfMusic}
                    </span>
                    <SpellingToggle spelling={spelling} onChange={setSpelling} t={t} />
                  </div>
                  <NoteGrid value={pc} onChange={setPc} spelling={spelling} />
                </div>
              </div>

              {/* Source banner */}
              <div className="mt-5 flex items-center gap-3 rounded-md bg-primary px-4 py-3 text-primary-foreground">
                <MemberMark index={0} color="hsl(var(--primary-foreground))" />
                <p className="text-sm font-semibold">
                  {t.sourcePrefix}{' '}
                  {sourceInst
                    ? `${sourceInst.name}${sourceInst.key !== 'C' ? ` · ${t.inKey} ${sourceInst.key}` : ''}${t.sourcePlayerSuffix}`
                    : t.sourcePianoText}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── 02 The band plays ── */}
        <section id="band" aria-labelledby="band">
          <Reveal>
            <SectionHeading index="02" title={t.s2Title} hint={t.s2Hint} />
            <HintSteps steps={t.s2Steps} />
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
              {/* Members */}
              <div>
                {members.map((p, index) => {
                  const inst = instById(p.instrumentId)
                  if (!inst) return null
                  const color = colorFor(index)
                  const chordPlayer = isChordPlayer(inst)
                  const singleNote = !chordPlayer
                  const tone = toneFor(p.uid, inst)
                  const noteOut = transpose((concertPc + tone) % 12, inst, true)
                  const chordOut = transpose(concertPc, inst, true)
                  return (
                    <div key={p.uid} className="border-b border-border/60 py-4 first:pt-0 last:border-b-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5">
                            <MemberMark index={index} color={color} />
                            <MemberSelect
                              id={`member-${p.uid}`}
                              value={p.instrumentId}
                              onChange={(v) => changeMember(p.uid, v)}
                              t={t}
                            />
                            {inst.key !== 'C' && (
                              <span className="note-display shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                {inst.key}
                              </span>
                            )}
                          </div>
                          <div
                            key={`${p.instrumentId}-${concertPc}-${mode}-${chordId}-${tone}-${spelling}`}
                            className={cn('answer-pop mt-2 pl-[18px]', inst.offset % 12 === 0 ? 'text-foreground/70' : 'text-primary')}
                          >
                            {singleNote && mode === 'chord' ? (
                              (() => {
                                // Horn language: ONE written note in the player's real register,
                                // said as a chord tone, cross-referenced to the piano key.
                                const wm = writtenMidiForTone(concertPc, tone, inst)
                                const pm = pianoMidiForTone(concertPc, tone, inst)
                                const writtenName = wm ? wm.name : noteName(noteOut, spelling)
                                const pianoName = pm ? pm.name : noteName((concertPc + tone) % 12, spelling)
                                return (
                                  <>
                                    <p className="note-display text-2xl font-extrabold leading-none tracking-tight">
                                      {writtenName}
                                    </p>
                                    <p className="note-display mt-2 text-xs text-muted-foreground">
                                      {t.yourNoteLineA} {writtenName} — {t.theWord} {TONE_LABELS[tone] ?? TONE_SHORT[tone] ?? tone}{' '}
                                      {t.ofTheChord} {chordName(concertPc, chordById(chordId), spelling)}
                                    </p>
                                    <p className="note-display mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                                      🎹 {t.pianoPlays} {pianoName}
                                    </p>
                                  </>
                                )
                              })()
                            ) : (
                              <ResultText pc={chordOut} mode={mode} chordId={chordId} spelling={spelling} t={t} />
                            )}
                            {singleNote && mode !== 'chord' && mode !== 'note' && (
                              (() => {
                                const wm = writtenMidiForTone(concertPc, tone, inst)
                                const pm = pianoMidiForTone(concertPc, tone, inst)
                                if (!wm || !pm) {
                                  return (
                                    <p className="note-display mt-1 text-xs text-muted-foreground">
                                      {t.writtenNoteOfChord}: {noteName(noteOut, spelling)} · {TONE_SHORT[tone] ?? tone} {t.ofTheChord} ·{' '}
                                      {t.pianoPlays} {noteName((concertPc + tone) % 12, spelling)}
                                    </p>
                                  )
                                }
                                return (
                                  <p className="note-display mt-1 text-xs text-muted-foreground">
                                    {t.writtenNoteOfChord}: {wm.name} · {TONE_LABELS[tone] ?? TONE_SHORT[tone] ?? tone} {t.ofTheChord} ·{' '}
                                    🎹 {t.pianoPlays} {pm.name}
                                  </p>
                                )
                              })()
                            )}
                          </div>
                          {singleNote && toneOptions.length > 1 && (
                            <div className="mt-2 pl-[18px]">
                              <label htmlFor={`tone-${p.uid}`} className="sr-only">
                                {memberLabel(p)}
                              </label>
                              <select
                                id={`tone-${p.uid}`}
                                value={tone}
                                onChange={(e) => setTones((tt) => ({ ...tt, [p.uid]: Number(e.target.value) }))}
                                className="focus-ring select-chevron tap-select h-11 cursor-pointer rounded-md border px-3 text-sm font-medium transition-colors"
                              >
                                {toneOptions.map((tonePc) => (
                                  <option key={tonePc} value={tonePc}>
                                    {t.playsThe} {CHORD_TONE_LABELS[tonePc] ?? tonePc}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(p.uid)}
                          aria-label={`Remove ${memberLabel(p)}`}
                          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-all duration-150 hover:border-destructive hover:text-destructive active:scale-95"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add member */}
              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <FieldLabel htmlFor="add-player">{t.addLabel}</FieldLabel>
                  <select
                    id="add-player"
                    value={addId}
                    onChange={(e) => setAddId(e.target.value)}
                    className="focus-ring select-chevron tap-select h-14 w-full cursor-pointer rounded-md border px-4 text-base font-medium transition-colors"
                  >
                    {FAMILIES.map((f) => (
                      <optgroup key={f.id} label={f.label}>
                        {INSTRUMENTS.filter((i) => i.family === f.id).map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name}
                            {i.key !== 'C' ? ` (${i.key})` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <TapToChange t={t} />
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="focus-ring hint-glow h-14 shrink-0 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-150 hover:brightness-110 active:scale-95"
                >
                  {t.addPlayer}
                </button>
              </div>

              {/* The band on the staff — docked here, or floated as a translucent overlay */}
              <div id="staff-block" className="mt-6 rounded-lg border border-primary/20 bg-background p-4 sm:p-5">
                <p className="mb-3 font-serif text-base font-semibold tracking-tight">{t.staffTitle}</p>
                <FloatingStaff
                  title={t.staffTitle}
                  floatLabel={t.staffFloat}
                  dockLabel={t.staffDock}
                  closeLabel={t.staffClose}
                >
                  {() => (
                    <StaffChord
                      rootPc={concertPc}
                      intervals={intervals}
                      tones={staffTones}
                      bracketColor={SOURCE_COLOR}
                      bracketLabel={staffBracketLabel}
                      t={t}
                    />
                  )}
                </FloatingStaff>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <Reveal className="mt-10 text-center" delay={100}>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">{t.footerText}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            {t.footerMark}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{t.copyright}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/80">{t.companies}</p>
        </Reveal>
      </div>
      <MenuFab onOpen={() => setMenuOpen(true)} label={t.menuOpen} />
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} t={t} isHome />
    </div>
  )
}

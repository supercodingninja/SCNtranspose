// ── Transposition engine ──────────────────────────────────────────────
// Convention: written pitch class = (concert pitch class + offset) mod 12.
// Pitch classes: C=0, C#/Db=1, D=2, D#/Eb=3, E=4, F=5,
// F#/Gb=6, G=7, G#/Ab=8, A=9, A#/Bb=10, B=11

export type FamilyId =
  | 'voice'
  | 'sax'
  | 'brass'
  | 'woodwind'
  | 'strings'
  | 'keys'

export interface Family {
  id: FamilyId
  label: string
  color: string // hex accent used for chips
}

export const FAMILIES: Family[] = [
  { id: 'voice', label: 'Voice (SATB)', color: '#9a6b2f' },
  { id: 'sax', label: 'Saxophones', color: '#2550c4' },
  { id: 'brass', label: 'Brass', color: '#b0551c' },
  { id: 'woodwind', label: 'Woodwinds', color: '#6b4fa1' },
  { id: 'strings', label: 'Strings & Fretted', color: '#96711a' },
  { id: 'keys', label: 'Keys & Mallets', color: '#2a7d7d' },
]

export interface Instrument {
  id: string
  name: string
  key: string // 'C', 'B♭', 'E♭', 'F', 'A', 'G', 'D', 'E♭'…
  family: FamilyId
  offset: number // written = concert + offset (mod 12)
  sounds: string // plain-language rule
  /**
   * Register anchors for horn-language display (real octaves).
   * concertRefMidi: the concert pitch this instrument sounds when it plays
   * writtenRefMidi. From these: written = concert + (writtenRef - concertRef).
   * Omit for chord instruments and voices (they follow the piano directly).
   */
  concertRefMidi?: number
  writtenRefMidi?: number
}

// MIDI reference: middle C = C4 = 60.
export const midiName = (midi: number, spelling: Spelling = 'flat'): string =>
  `${noteName(((midi % 12) + 12) % 12, spelling)}${Math.floor(midi / 12) - 1}`

export const INSTRUMENTS: Instrument[] = [
  // ── Voice ──
  { id: 'vox-lead', name: 'Lead Vocal / Melody', key: 'C', family: 'voice', offset: 0, sounds: 'Non-transposing — sings at concert pitch.' },
  { id: 'vox-s', name: 'Soprano', key: 'C', family: 'voice', offset: 0, sounds: 'Non-transposing — reads treble clef at concert pitch.' },
  { id: 'vox-a', name: 'Alto', key: 'C', family: 'voice', offset: 0, sounds: 'Non-transposing — reads treble clef at concert pitch.' },
  { id: 'vox-t', name: 'Tenor', key: 'C', family: 'voice', offset: 0, sounds: 'Same note names, but sounds an octave below the treble staff (8vb).' },
  { id: 'vox-b', name: 'Bass', key: 'C', family: 'voice', offset: 0, sounds: 'Non-transposing — reads bass clef at concert pitch.' },

  // ── Saxophones ──
  { id: 'sax-sop', name: 'Soprano Saxophone', key: 'B♭', family: 'sax', offset: 2, sounds: 'Sounds a major 2nd lower than written.', concertRefMidi: 70, writtenRefMidi: 72  },
  { id: 'sax-alto', name: 'Alto Saxophone', key: 'E♭', family: 'sax', offset: 9, sounds: 'Sounds a major 6th lower than written.', concertRefMidi: 63, writtenRefMidi: 72  },
  { id: 'sax-tenor', name: 'Tenor Saxophone', key: 'B♭', family: 'sax', offset: 2, sounds: 'Sounds a major 9th (octave + step) lower than written.', concertRefMidi: 58, writtenRefMidi: 72  },
  { id: 'sax-bari', name: 'Baritone Saxophone', key: 'E♭', family: 'sax', offset: 9, sounds: 'Sounds an octave + major 6th lower than written.', concertRefMidi: 51, writtenRefMidi: 72  },
  { id: 'sax-cmel', name: 'C Melody Saxophone', key: 'C', family: 'sax', offset: 0, sounds: 'Non-transposing — plays at concert pitch.', concertRefMidi: 72, writtenRefMidi: 72  },

  // ── Brass ──
  { id: 'tpt-c', name: 'Trumpet in C', key: 'C', family: 'brass', offset: 0, sounds: 'Non-transposing — plays at concert pitch.', concertRefMidi: 71, writtenRefMidi: 71  },
  { id: 'tpt-bb', name: 'Trumpet in B♭', key: 'B♭', family: 'brass', offset: 2, sounds: 'Sounds a major 2nd lower than written.', concertRefMidi: 70, writtenRefMidi: 72  },
  { id: 'tpt-d', name: 'Trumpet in D', key: 'D', family: 'brass', offset: 10, sounds: 'Sounds a major 2nd higher than written.', concertRefMidi: 73, writtenRefMidi: 71  },
  { id: 'tpt-eb', name: 'Trumpet in E♭', key: 'E♭', family: 'brass', offset: 9, sounds: 'Sounds a minor 3rd higher than written.', concertRefMidi: 74, writtenRefMidi: 71  },
  { id: 'cornet', name: 'Cornet in B♭', key: 'B♭', family: 'brass', offset: 2, sounds: 'Sounds a major 2nd lower than written.', concertRefMidi: 70, writtenRefMidi: 72  },
  { id: 'flugel', name: 'Flugelhorn in B♭', key: 'B♭', family: 'brass', offset: 2, sounds: 'Sounds a major 2nd lower than written.', concertRefMidi: 70, writtenRefMidi: 72  },
  { id: 'horn-f', name: 'French Horn in F', key: 'F', family: 'brass', offset: 7, sounds: 'Sounds a perfect 5th lower than written.', concertRefMidi: 65, writtenRefMidi: 72  },
  { id: 'alto-horn', name: 'Alto / Tenor Horn in E♭', key: 'E♭', family: 'brass', offset: 9, sounds: 'Sounds a major 6th lower than written.', concertRefMidi: 63, writtenRefMidi: 72  },
  { id: 'trombone', name: 'Trombone', key: 'C', family: 'brass', offset: 0, sounds: 'Non-transposing — bass clef concert pitch.' },
  { id: 'bass-tbn', name: 'Bass Trombone', key: 'C', family: 'brass', offset: 0, sounds: 'Non-transposing — bass clef concert pitch.' },
  { id: 'euph-tc', name: 'Euphonium / Baritone (treble clef)', key: 'B♭', family: 'brass', offset: 2, sounds: 'Sounds a major 9th lower than written.', concertRefMidi: 58, writtenRefMidi: 72  },
  { id: 'euph-bc', name: 'Euphonium (bass clef)', key: 'C', family: 'brass', offset: 0, sounds: 'Non-transposing — bass clef concert pitch.' },
  { id: 'tuba', name: 'Tuba', key: 'C', family: 'brass', offset: 0, sounds: 'Non-transposing — reads concert pitch regardless of tuba size.' },

  // ── Woodwinds ──
  { id: 'flute', name: 'Flute', key: 'C', family: 'woodwind', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'piccolo', name: 'Piccolo', key: 'C', family: 'woodwind', offset: 0, sounds: 'Same note names — sounds an octave above written.' },
  { id: 'alto-flute', name: 'Alto Flute in G', key: 'G', family: 'woodwind', offset: 5, sounds: 'Sounds a perfect 4th lower than written.', concertRefMidi: 67, writtenRefMidi: 72  },
  { id: 'bass-flute', name: 'Bass Flute', key: 'C', family: 'woodwind', offset: 0, sounds: 'Same note names — sounds an octave below written.' },
  { id: 'oboe', name: 'Oboe', key: 'C', family: 'woodwind', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'oboe-amore', name: "Oboe d'amore in A", key: 'A', family: 'woodwind', offset: 3, sounds: 'Sounds a minor 3rd lower than written.' },
  { id: 'eng-horn', name: 'English Horn in F', key: 'F', family: 'woodwind', offset: 7, sounds: 'Sounds a perfect 5th lower than written.' },
  { id: 'clar-bb', name: 'Clarinet in B♭', key: 'B♭', family: 'woodwind', offset: 2, sounds: 'Sounds a major 2nd lower than written.', concertRefMidi: 70, writtenRefMidi: 72  },
  { id: 'clar-a', name: 'Clarinet in A', key: 'A', family: 'woodwind', offset: 3, sounds: 'Sounds a minor 3rd lower than written.', concertRefMidi: 69, writtenRefMidi: 72  },
  { id: 'clar-eb', name: 'Clarinet in E♭', key: 'E♭', family: 'woodwind', offset: 9, sounds: 'Sounds a minor 3rd higher than written.', concertRefMidi: 74, writtenRefMidi: 71  },
  { id: 'bass-clar', name: 'Bass Clarinet in B♭', key: 'B♭', family: 'woodwind', offset: 2, sounds: 'Sounds a major 9th lower than written.', concertRefMidi: 58, writtenRefMidi: 72  },
  { id: 'alto-clar', name: 'Alto Clarinet in E♭', key: 'E♭', family: 'woodwind', offset: 9, sounds: 'Sounds a major 6th lower than written.', concertRefMidi: 63, writtenRefMidi: 72  },
  { id: 'bassoon', name: 'Bassoon', key: 'C', family: 'woodwind', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'contra-bsn', name: 'Contrabassoon', key: 'C', family: 'woodwind', offset: 0, sounds: 'Same note names — sounds an octave below written.' },
  { id: 'recorder', name: 'Recorder', key: 'C', family: 'woodwind', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },

  // ── Strings & fretted ──
  { id: 'violin', name: 'Violin', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'viola', name: 'Viola', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — alto clef at concert pitch.' },
  { id: 'cello', name: 'Cello', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — bass clef at concert pitch.' },
  { id: 'bass', name: 'Double Bass', key: 'C', family: 'strings', offset: 0, sounds: 'Same note names — sounds an octave below written.' },
  { id: 'guitar', name: 'Guitar', key: 'C', family: 'strings', offset: 0, sounds: 'Same note names — sounds an octave below written.' },
  { id: 'bass-gtr', name: 'Bass Guitar', key: 'C', family: 'strings', offset: 0, sounds: 'Same note names — sounds an octave below written.' },
  { id: 'ukulele', name: 'Ukulele', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'mandolin', name: 'Mandolin', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'banjo', name: 'Banjo', key: 'C', family: 'strings', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },

  // ── Keys & mallets ──
  { id: 'piano', name: 'Piano', key: 'C', family: 'keys', offset: 0, sounds: 'Concert pitch — the reference for everyone else.' },
  { id: 'organ', name: 'Organ', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'harp', name: 'Harp', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'accordion', name: 'Accordion', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'celesta', name: 'Celesta', key: 'C', family: 'keys', offset: 0, sounds: 'Same note names — sounds an octave above written.' },
  { id: 'glock', name: 'Glockenspiel', key: 'C', family: 'keys', offset: 0, sounds: 'Same note names — sounds two octaves above written.' },
  { id: 'xylo', name: 'Xylophone', key: 'C', family: 'keys', offset: 0, sounds: 'Same note names — sounds an octave above written.' },
  { id: 'marimba', name: 'Marimba', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'vibes', name: 'Vibraphone', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — plays at concert pitch.' },
  { id: 'timpani', name: 'Timpani', key: 'C', family: 'keys', offset: 0, sounds: 'Non-transposing — concert pitch.' },
]

// ── Spelling ──────────────────────────────────────────────────────────

const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']

/** Natural letter of each pitch class (flat spelling) — for staff placement. */
export const FLAT_LETTER = ['C', 'D', 'D', 'E', 'E', 'F', 'G', 'G', 'A', 'A', 'B', 'B']
const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

/** Diatonic letter-steps each chord interval sits above the root (shared by staff + horn language). */
export const INTERVAL_STEPS: Record<number, number> = {
  0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 4, 8: 4, 9: 5, 10: 6,
  11: 6, 12: 0, 13: 1, 14: 1, 15: 2, 16: 2, 17: 3, 18: 4, 19: 4, 20: 5, 21: 5,
}
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/**
 * Spell a chord tone (root pitch class + semitone interval) with the correct
 * letter, e.g. root A + 7 → "E", root A + 4 → "C♯". This is the guardrail that
 * keeps horn parts in the right language (F♯ in an A chord, never G♭).
 */
export function spellToneName(rootPc: number, semi: number): string {
  const rootName = FLAT_NAMES[((rootPc % 12) + 12) % 12]
  const rootLetterIdx = LETTERS.indexOf(rootName[0])
  const letterIdx = (rootLetterIdx + (INTERVAL_STEPS[semi] ?? 0)) % 7
  const naturalPc = LETTER_PC[LETTERS[letterIdx]]
  let acc = ((((rootPc + semi) % 12) + 12) % 12 - naturalPc) % 12
  if (acc > 6) acc -= 12
  if (acc < -6) acc += 12
  return LETTERS[letterIdx] + (acc === 0 ? '' : acc > 0 ? '♯'.repeat(acc) : '♭'.repeat(-acc))
}

// Fifths value for each preferred major-key spelling (negative = flats)
// pc:    C  Db  D  Eb  E  F  F#  G  Ab  A  Bb  B
const MAJOR_FIFTHS = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5]
// pc 6 is a tie: F♯ (+6) and G♭ (−6) are equally valid.

export type Spelling = 'flat' | 'sharp'

export function noteName(pc: number, pref: Spelling = 'flat'): string {
  const p = ((pc % 12) + 12) % 12
  return (pref === 'flat' ? FLAT_NAMES : SHARP_NAMES)[p]
}

/** Preferred major-key spelling for a pitch class (fewest accidentals). */
export function keySpelling(pc: number): { name: string; fifths: number; tie?: string } {
  const p = ((pc % 12) + 12) % 12
  if (p === 6) return { name: 'F♯ / G♭', fifths: 6, tie: '6♯ = 6♭' }
  return { name: FLAT_NAMES[p], fifths: MAJOR_FIFTHS[p] }
}

/** Preferred minor-key spelling, indexed by tonic pitch class. */
// pc:      C   C♯   D  E♭  E   F  F♯   G  G♯  A  B♭   B
const MINOR_FIFTHS = [-3, 4, -1, -6, 1, -4, 3, -2, 5, 0, -5, 2]

export function minorKeySpelling(pc: number): { name: string; fifths: number } {
  const p = ((pc % 12) + 12) % 12
  const fifths = MINOR_FIFTHS[p]
  const name = fifths > 0 ? SHARP_NAMES[p] : FLAT_NAMES[p]
  return { name, fifths }
}

export function fifthsLabel(fifths: number): string {
  if (fifths === 0) return 'no sharps or flats'
  const n = Math.abs(fifths)
  return `${n} ${fifths > 0 ? (n === 1 ? 'sharp' : 'sharps') : n === 1 ? 'flat' : 'flats'}`
}

const INTERVALS: Record<number, string> = {
  0: 'perfect unison', 1: 'minor 2nd', 2: 'major 2nd', 3: 'minor 3rd',
  4: 'major 3rd', 5: 'perfect 4th', 6: 'tritone', 7: 'perfect 5th',
  8: 'minor 6th', 9: 'major 6th', 10: 'minor 7th', 11: 'major 7th',
}

/** How far the written part sits from concert pitch for this instrument. */
export function writtenIntervalLabel(inst: Instrument): string {
  const o = ((inst.offset % 12) + 12) % 12
  if (o === 0) return 'Written part = concert pitch'
  if (o <= 6) return `Written part = a ${INTERVALS[o]} above concert`
  return `Written part = a ${INTERVALS[12 - o]} below concert`
}

/** Transpose a pitch class for an instrument. */
export function transpose(pc: number, inst: Instrument, toWritten: boolean): number {
  const o = toWritten ? inst.offset : -inst.offset
  return (((pc + o) % 12) + 12) % 12
}

/** Transpose a pitch class from one instrument's written pitch to another's. */
export function transposeBetween(pc: number, from: Instrument, to: Instrument): number {
  return (((pc - from.offset + to.offset) % 12) + 12) % 12
}

// ── Chords ────────────────────────────────────────────────────────────

export interface ChordQuality {
  id: string
  suffix: string // '' for major
  label: string
  intervals: number[] // semitones from root
}

export const CHORDS: ChordQuality[] = [
  { id: 'power5', suffix: '5', label: 'Power chord (5)', intervals: [0, 7] },
  { id: 'maj', suffix: '', label: 'Major', intervals: [0, 4, 7] },
  { id: 'min', suffix: 'm', label: 'Minor', intervals: [0, 3, 7] },
  { id: 'dom7', suffix: '7', label: 'Dominant 7', intervals: [0, 4, 7, 10] },
  { id: 'maj7', suffix: 'maj7', label: 'Major 7', intervals: [0, 4, 7, 11] },
  { id: 'min7', suffix: 'm7', label: 'Minor 7', intervals: [0, 3, 7, 10] },
  { id: 'min7b5', suffix: 'm7♭5', label: 'Half-diminished', intervals: [0, 3, 6, 10] },
  { id: 'dim7', suffix: '°7', label: 'Diminished 7', intervals: [0, 3, 6, 9] },
  { id: 'aug', suffix: 'aug', label: 'Augmented', intervals: [0, 4, 8] },
  { id: 'sus4', suffix: 'sus4', label: 'Sus 4', intervals: [0, 5, 7] },
  { id: 'sus2', suffix: 'sus2', label: 'Sus 2', intervals: [0, 2, 7] },
  { id: 'add9', suffix: 'add9', label: 'Add 9', intervals: [0, 4, 7, 14] },
  { id: 'six', suffix: '6', label: 'Sixth', intervals: [0, 4, 7, 9] },
  { id: 'nine', suffix: '9', label: 'Ninth', intervals: [0, 4, 7, 10, 14] },
  { id: 'min9', suffix: 'm9', label: 'Minor 9', intervals: [0, 3, 7, 10, 14] },
  { id: 'thirteen', suffix: '13', label: 'Thirteenth', intervals: [0, 4, 7, 10, 14, 17, 21] },
  { id: 'sevenflat9', suffix: '7♭9', label: '7 flat 9', intervals: [0, 4, 7, 10, 13] },
]

/** Spell a chord's notes for a given instrument's written part. */
export function chordNotes(rootPc: number, chord: ChordQuality, inst: Instrument): number[] {
  return chord.intervals.map((i) => transpose((rootPc + i) % 12, inst, true))
}

// ── Chord spelling (real note names, not just pitch classes) ─────────

/** Root name for a pitch class; the F♯/G♭ tie follows the user's spelling toggle. */
export function rootNameFor(pc: number, spelling: Spelling = 'flat'): string {
  const p = ((pc % 12) + 12) % 12
  if (p === 6) return spelling === 'sharp' ? 'F♯' : 'G♭'
  return FLAT_NAMES[p]
}

/** Full chord symbol, e.g. "C9", "F♯m7", "B♭maj7". */
export function chordName(rootPc: number, chord: ChordQuality, spelling: Spelling = 'flat'): string {
  return rootNameFor(rootPc, spelling) + chord.suffix
}

/**
 * Spell every tone of a chord with correct note letters, e.g.
 * C dominant 9 → ["C", "E", "G", "B♭", "D"].
 */
export function spellChordTones(rootPc: number, chord: ChordQuality, spelling: Spelling = 'flat'): string[] {
  const root = rootNameFor(rootPc, spelling)
  const rootLetterIdx = LETTERS.indexOf(root[0])
  return chord.intervals.map((semi) => {
    const steps = INTERVAL_STEPS[semi] ?? 0
    const letterIdx = (rootLetterIdx + steps) % 7
    const naturalPc = LETTER_PC[LETTERS[letterIdx]]
    let acc = (((rootPc + semi) % 12) - naturalPc) % 12
    if (acc > 6) acc -= 12
    if (acc < -6) acc += 12
    const accStr = acc === 0 ? '' : acc > 0 ? '♯'.repeat(acc) : '♭'.repeat(-acc)
    return LETTERS[letterIdx] + accStr
  })
}

/** Spell a chord's notes mapped from one instrument's written chord to another's. */
export function chordNotesBetween(rootPc: number, chord: ChordQuality, from: Instrument, to: Instrument): number[] {
  return chord.intervals.map((i) => transposeBetween((rootPc + i) % 12, from, to))
}

export function familyOf(inst: Instrument): Family {
  return FAMILIES.find((f) => f.id === inst.family)!
}

// ── Horn language (real registers, not just pitch classes) ───────────

/** Enharmonic guardrail: prefer the spelling a working player actually reads. */
export function playerNoteName(pc: number, inst: Instrument | undefined, spelling: Spelling = 'flat'): string {
  const p = ((pc % 12) + 12) % 12
  if (p === 1 && inst && (inst.key === 'B♭' || inst.key === 'F')) return 'D♭'
  return noteName(p, spelling)
}

/**
 * Map a concert chord tone to this instrument's written note WITH a real octave,
 * anchored to the instrument's register (concertRefMidi/writtenRefMidi).
 * Falls back to octave-less when the instrument has no register anchors.
 */
export function writtenMidiForTone(
  concertRootPc: number,
  toneSemi: number,
  inst: Instrument,
): { midi: number; name: string } | null {
  if (inst.concertRefMidi === undefined || inst.writtenRefMidi === undefined) return null
  const tonePc = (((concertRootPc + toneSemi) % 12) + 12) % 12
  // sounding reference for the exact concert pitch class
  let concertMidi = inst.concertRefMidi + (((tonePc - inst.concertRefMidi % 12) % 12) + 12) % 12
  if (concertMidi - inst.concertRefMidi > 6) concertMidi -= 12
  const writtenMidi = concertMidi + (inst.writtenRefMidi - inst.concertRefMidi)
  // Name the written note as the same chord tone of the WRITTEN root — that
  // keeps it in the player's language (F♯ in a B chord, never G♭).
  const writtenRootPc = (((concertRootPc + inst.offset) % 12) + 12) % 12
  const octave = Math.floor(writtenMidi / 12) - 1
  return { midi: writtenMidi, name: spellToneName(writtenRootPc, toneSemi) + octave }
}

/** Where that same chord tone sits on the piano — the shared reference, also chord-spelled. */
export function pianoMidiForTone(concertRootPc: number, toneSemi: number, inst: Instrument): { midi: number; name: string } | null {
  if (inst.concertRefMidi === undefined) return null
  const tonePc = (((concertRootPc + toneSemi) % 12) + 12) % 12
  let concertMidi = inst.concertRefMidi + (((tonePc - inst.concertRefMidi % 12) % 12) + 12) % 12
  if (concertMidi - inst.concertRefMidi > 6) concertMidi -= 12
  const octave = Math.floor(concertMidi / 12) - 1
  return { midi: concertMidi, name: spellToneName(concertRootPc, toneSemi) + octave }
}

/** Human label for a chord tone (root, major 3rd, …). */
export const TONE_LABELS: Record<number, string> = {
  0: 'root', 1: '♭9', 2: '2nd / 9th', 3: 'minor 3rd', 4: 'major 3rd', 5: '4th / 11th',
  6: '♭5 / ♯11', 7: '5th', 8: '♯5 / ♭13', 9: '6th / 13th', 10: '♭7', 11: 'major 7',
}

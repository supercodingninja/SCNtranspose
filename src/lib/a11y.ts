// ── SCN Technologies signature accessibility + language layer ───────

export type ColorVision =
  | 'none'
  | 'deuteranomaly'
  | 'deuteranopia'
  | 'protanomaly'
  | 'protanopia'
  | 'tritanomaly'
  | 'tritanopia'
  | 'achromatopsia'

export interface A11yPrefs {
  lang: string // any of 56 language codes (see i18n.ts)
  colorblind: boolean // shapes + outlines, never color alone
  calm: boolean // stop motion / floating notes
  largeText: boolean
  dark: boolean
  // Neurodivergent
  autism: boolean
  adhd: boolean
  dyslexia: boolean
  // Mental health
  anxiety: boolean
  ptsd: boolean
  bipolar: boolean
  cognitive: boolean
  // Vision
  highContrast: boolean
  colorVision: ColorVision
  // Motor & physical
  largeTargets: boolean
  keyboardOnly: boolean
  // Speech & communication
  simpleLanguage: boolean
}

export const DEFAULT_PREFS: A11yPrefs = {
  lang: 'en',
  colorblind: false,
  calm: false,
  largeText: false,
  dark: false,
  autism: false,
  adhd: false,
  dyslexia: false,
  anxiety: false,
  ptsd: false,
  bipolar: false,
  cognitive: false,
  highContrast: false,
  colorVision: 'none',
  largeTargets: false,
  keyboardOnly: false,
  simpleLanguage: false,
}

const KEY = 'transpose-a11y'

export function loadPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(p: A11yPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* private mode etc. — preferences just won't persist */
  }
}

/** Apply prefs to the document root as classes. */
export function applyPrefs(p: A11yPrefs) {
  const el = document.documentElement
  el.classList.toggle('a11y-cb', p.colorblind)
  el.classList.toggle('calm', p.calm)
  el.classList.toggle('large-text', p.largeText)
  el.classList.toggle('dark', p.dark)
  el.classList.toggle('autism-mode', p.autism)
  el.classList.toggle('adhd-mode', p.adhd)
  el.classList.toggle('dyslexia-mode', p.dyslexia)
  el.classList.toggle('anxiety-mode', p.anxiety)
  el.classList.toggle('ptsd-mode', p.ptsd)
  el.classList.toggle('mania-mode', p.bipolar)
  el.classList.toggle('cognitive-mode', p.cognitive)
  el.classList.toggle('high-contrast', p.highContrast)
  el.classList.toggle('large-targets', p.largeTargets)
  el.classList.toggle('keyboard-only', p.keyboardOnly)
  el.classList.toggle('simple-language', p.simpleLanguage)
  // color-vision SVG filters
  el.classList.remove(
    'filter-deuteranomaly', 'filter-deuteranopia', 'filter-protanomaly', 'filter-protanopia',
    'filter-tritanomaly', 'filter-tritanopia', 'filter-achromatopsia',
  )
  if (p.colorVision !== 'none') el.classList.add(`filter-${p.colorVision}`)
  el.lang = p.lang
  el.dir = ['ar', 'he', 'ur', 'fa'].includes(p.lang) ? 'rtl' : 'ltr'
}

const en = {
  appName: 'Transpose',
  heroTitleA: 'The piano is a C instrument.',
  heroTitleB: 'Its key is the key of the music.',
  heroSub: "Here's what every instrument and voice plays from there.",
  tourBanner: 'New here? Watch the quick tour — it shows the app being used.',
  tourCaption: 'Watch the quick tour.',
  tourHint: 'Tap anything blue with a ▾, tap a note — the answer appears.',
  tourAria: 'Short demo: tap an instrument, tap a note, read the answer',
  offlineReady: 'Offline ready — works without internet once loaded',
  a11yOpen: 'Accessibility & language options',
  a11yTitle: 'Accessibility & Language',
  a11yIntro: 'SCN Technologies signature options — set once, remembered on this device.',
  optColorblind: 'Colorblind-friendly',
  optColorblindSub: 'Shapes on the colored dots, bold outlines on selections — never color alone',
  optCalm: 'Calm mode',
  optCalmSub: 'Stops floating notes, glows, and motion',
  optLargeText: 'Large text',
  optLargeTextSub: 'Bigger type throughout the app',
  optDark: 'Dark mode',
  optDarkSub: 'Easy on the eyes in a dark sanctuary',
  optLang: 'Language / Idioma',
  a11yLangNote: 'Auto-translated by free APIs for 44 languages • may contain errors',
  a11yTranslating: 'Translating… one moment.',
  close: 'Done',
  s1Title: 'Set the key',
  s1Hint: 'the source — piano by default',
  s1Steps: [
    'Tap the blue box with a ▾ to change who is leading — the piano by default.',
    'Tap Major, Minor, Chord, or Note — then tap a key below.',
    'The whole band below follows whatever you set here.',
  ],
  s2Title: 'The band plays',
  s2Hint: 'no limit — add everybody',
  s2Steps: [
    'The first player is the tenor sax — tap its blue box to make it anybody.',
    'Press + Add player for more — two altos, a singer and a banjo, anything. Each new player gets their own color.',
    'Horns and voices each take one note (tap “Plays the…” to choose which); keys and guitar take the whole chord. See everyone on the staff below.',
  ],
  tapToChange: '( tap to change )',
  ifThe: 'If the',
  isPlaying: 'is playing',
  isSinging: 'is singing',
  plays: 'plays',
  sings: 'sings',
  a: 'a',
  on: 'on',
  the: 'the',
  majorKey: 'Major key',
  minorKey: 'Minor key',
  chord: 'Chord',
  note: 'Note',
  theNote: 'the note',
  rootKeyOfMusic: 'the root — the key of the music',
  writtenRoot: "'s written root",
  writtenNoteLabel: "'s written note",
  pianoCInst: 'Piano — C instrument',
  whichIsConcert: 'which is concert',
  majorKeyWord: 'major',
  minorKeyWord: 'minor',
  keyWord: 'key',
  tieLabel: '6 sharps = 6 flats',
  addLabel: 'Add an instrument or voice',
  addPlayer: '+ Add player',
  sourceLabel: 'The key / chord comes from',
  sourceDefault: 'The piano — C instrument (default)',
  theirPart: ' — their written part',
  qualityLabel: 'Key or chord type',
  bandRootPiano: 'The key of the music (what the piano plays)',
  bandRootSource: "'s written root",
  sourcePrefix: 'Source:',
  sourcePianoText: 'Piano — C instrument · the key of the music',
  sourcePlayerSuffix: ' — everything below is their transposed part',
  actualChord: 'Piano / guitar — the actual chord',
  writtenNoteOfChord: 'written note',
  ofTheChord: 'of the chord',
  ofThePianos: "of the piano's",
  pianoKey: 'piano key',
  octaveWord: 'octave',
  playsThe: 'Plays the',
  emptyBand: 'Nobody in the band yet — pick an instrument or voice above and hit “Add player”.',
  footerText:
    "The piano is a C instrument — its key is the key of the music, and everyone else transposes from there. Horns and voices each take one note of the chord; keys and fretted instruments can play the whole thing. Guitar, bass, piccolo, and tenor voices share the piano's note names and only shift an octave.",
  footerMark: 'Built by SCN Technologies — accessible by design.',
  copyright: '© 2026 SCN Holdings. All rights reserved. "Every Voice, One Answer" — SCNܫܘܐ™, presented by SCNmedia™.',
  companies: 'SCN Technologies and SCNmedia™ are SCN Holdings companies.',
  songCredit: '♪ “Every Voice, One Answer” — SCNܫܘܐ™, presented by SCNmedia™',
  yourNoteLineA: 'You play',
  theWord: 'the',
  pianoPlays: 'Piano plays',
  inKey: 'in',
  accidentalSpelling: 'Accidental spelling',
  whatPlaying: 'What are they playing',
  chordType: 'Chord type',
  chooseInst: 'Choose an instrument or voice',
  getStarted: 'Get started',
  landingKicker: 'The 60-second tour',
  landingLine: 'Every instrument. Every voice. One answer.',
  landingSub: 'Watch it work, then jump in — free, no sign-up, works offline.',
  staffTitle: 'The band on the staff',
  staffFloat: 'Float it',
  staffDock: 'Dock the staff back here',
  staffClose: 'Close the floating staff',
  menuTitle: 'Quick menu',
  menuClose: 'Close menu',
  menuOpen: 'Open quick menu',
  menuHome: 'Home — the tour & music',
  menuHint: 'Jump anywhere without scrolling. The staff can also float — press “Float it” on the staff and drag it wherever you like.',
  playsWholeChord: 'plays the whole chord',
  concertNote: 'the actual chord at concert pitch',
  soundOn: 'Sound on',
  soundOff: 'Tap for sound',
}

const es: typeof en = {
  appName: 'Transpose',
  heroTitleA: 'El piano es un instrumento en Do.',
  heroTitleB: 'Su tono es el tono de la música.',
  heroSub: 'Esto es lo que toca cada instrumento y voz a partir de ahí.',
  tourBanner: '¿Primera vez? Mira el recorrido rápido — muestra la app en uso.',
  tourCaption: 'Mira el recorrido rápido.',
  tourHint: 'Toca cualquier caja azul con ▾, toca una nota — la respuesta aparece.',
  tourAria: 'Demo corta: toca un instrumento, toca una nota, lee la respuesta',
  offlineReady: 'Lista sin internet — funciona sin conexión una vez cargada',
  a11yOpen: 'Opciones de accesibilidad e idioma',
  a11yTitle: 'Accesibilidad e Idioma',
  a11yIntro: 'Opciones insignia de SCN Technologies — se guardan en este dispositivo.',
  optColorblind: 'Para daltónicos',
  optColorblindSub: 'Formas en los puntos de color, contornos en la selección — nunca solo color',
  optCalm: 'Modo tranquilo',
  optCalmSub: 'Detiene las notas flotantes y el movimiento',
  optLargeText: 'Texto grande',
  optLargeTextSub: 'Letra más grande en toda la app',
  optDark: 'Modo oscuro',
  optDarkSub: 'Suave para los ojos en un santuario oscuro',
  optLang: 'Idioma / Language',
  a11yLangNote: 'Traducido automáticamente por APIs gratuitas para 44 idiomas • puede contener errores',
  a11yTranslating: 'Traduciendo… un momento.',
  close: 'Listo',
  s1Title: 'Fija el tono',
  s1Hint: 'la fuente — piano por defecto',
  s1Steps: [
    'Toca la caja azul con ▾ para cambiar quién guía — el piano por defecto.',
    'Toca Mayor, Menor, Acorde o Nota — luego toca un tono abajo.',
    'Toda la banda abajo sigue lo que fijes aquí.',
  ],
  s2Title: 'La banda toca',
  s2Hint: 'sin límite — agrega a todos',
  s2Steps: [
    'El primer músico es el sax tenor — toca su caja azul para cambiarlo.',
    'Pulsa + Agregar para más — cada músico nuevo recibe su propio color.',
    'Metales y voces tocan una nota (toca “Toca el…” para elegir cuál); piano y guitarra tocan el acorde completo. Mira a todos en el pentagrama abajo.',
  ],
  tapToChange: '( toca para cambiar )',
  ifThe: 'Si el',
  isPlaying: 'está tocando',
  isSinging: 'está cantando',
  plays: 'toca',
  sings: 'canta',
  a: 'un',
  on: 'en',
  the: 'el',
  majorKey: 'Tono mayor',
  minorKey: 'Tono menor',
  chord: 'Acorde',
  note: 'Nota',
  theNote: 'la nota',
  rootKeyOfMusic: 'la tónica — el tono de la música',
  writtenRoot: ' — tónica escrita de ',
  writtenNoteLabel: ' — nota escrita de ',
  pianoCInst: 'Piano — instrumento en Do',
  whichIsConcert: 'que en concierto es',
  majorKeyWord: 'mayor',
  minorKeyWord: 'menor',
  keyWord: 'tono',
  tieLabel: '6 sostenidos = 6 bemoles',
  addLabel: 'Agrega un instrumento o voz',
  addPlayer: '+ Agregar',
  sourceLabel: 'El tono / acorde viene de',
  sourceDefault: 'El piano — instrumento en Do (por defecto)',
  theirPart: ' — su partitura',
  qualityLabel: 'Tono o tipo de acorde',
  bandRootPiano: 'El tono de la música (lo que toca el piano)',
  bandRootSource: ' — tónica escrita',
  sourcePrefix: 'Origen:',
  sourcePianoText: 'Piano — instrumento en Do · el tono de la música',
  sourcePlayerSuffix: ' — todo lo de abajo es su parte transportada',
  actualChord: 'Piano / guitarra — el acorde real',
  writtenNoteOfChord: 'nota escrita',
  ofTheChord: 'del acorde',
  ofThePianos: 'del piano —',
  pianoKey: 'tecla del piano',
  octaveWord: 'octava',
  playsThe: 'Toca el',
  emptyBand: 'Aún no hay nadie en la banda — elige arriba y pulsa “Agregar”.',
  footerText:
    'El piano es un instrumento en Do — su tono es el tono de la música, y todos los demás transportan a partir de ahí. Metales y voces tocan una nota del acorde; teclas y cuerdas pulsadas pueden tocarlo completo. Guitarra, bajo, flautín y tenores comparten los nombres de las notas del piano y solo cambian de octava.',
  footerMark: 'Hecho por SCN Technologies — accesible por diseño.',
  copyright: '© 2026 SCN Holdings. Todos los derechos reservados. "Every Voice, One Answer" — SCNܫܘܐ™, presentado por SCNmedia™.',
  companies: 'SCN Technologies y SCNmedia™ son empresas de SCN Holdings.',
  songCredit: '♪ “Every Voice, One Answer” — SCNܫܘܐ™, presentada por SCNmedia™',
  yourNoteLineA: 'Tocas',
  theWord: 'el',
  pianoPlays: 'El piano toca',
  inKey: 'en',
  accidentalSpelling: 'Escritura de alteraciones',
  whatPlaying: 'Qué están tocando',
  chordType: 'Tipo de acorde',
  chooseInst: 'Elige un instrumento o voz',
  getStarted: 'Comenzar',
  landingKicker: 'El recorrido de 60 segundos',
  landingLine: 'Cada instrumento. Cada voz. Una respuesta.',
  landingSub: 'Míralo funcionar y entra — gratis, sin registro, funciona sin internet.',
  staffTitle: 'La banda en el pentagrama',
  staffFloat: 'Flotar',
  staffDock: 'Volver a fijar el pentagrama aquí',
  staffClose: 'Cerrar el pentagrama flotante',
  menuTitle: 'Menú rápido',
  menuClose: 'Cerrar menú',
  menuOpen: 'Abrir menú rápido',
  menuHome: 'Inicio — el recorrido y la música',
  menuHint: 'Salta a cualquier parte sin desplazarte. El pentagrama también puede flotar — pulsa “Flotar” y arrástralo donde quieras.',
  playsWholeChord: 'toca el acorde completo',
  concertNote: 'el acorde real en concierto',
  soundOn: 'Con sonido',
  soundOff: 'Toca para sonido',
}

const fr: typeof en = {
  appName: 'Transpose',
  heroTitleA: 'Le piano est un instrument en Do.',
  heroTitleB: 'Sa tonalité est la tonalité de la musique.',
  heroSub: 'Voici ce que joue chaque instrument et chaque voix à partir de là.',
  tourBanner: 'Nouveau ? Regardez le tour rapide — il montre l\'app en action.',
  tourCaption: 'Regardez le tour rapide.',
  tourHint: 'Touchez une case bleue avec ▾, touchez une note — la réponse apparaît.',
  tourAria: 'Démo courte : touchez un instrument, une note, lisez la réponse',
  offlineReady: 'Prête hors ligne — fonctionne sans internet une fois chargée',
  a11yOpen: 'Options d\'accessibilité et de langue',
  a11yTitle: 'Accessibilité et Langue',
  a11yIntro: 'Options signature de SCN Technologies — enregistrées sur cet appareil.',
  optColorblind: 'Pour daltoniens',
  optColorblindSub: 'Formes sur les points de couleur, contours sur la sélection — jamais la couleur seule',
  optCalm: 'Mode calme',
  optCalmSub: 'Arrête les notes flottantes et le mouvement',
  optLargeText: 'Texte grand',
  optLargeTextSub: 'Texte plus grand dans toute l\'app',
  optDark: 'Mode sombre',
  optDarkSub: 'Doux pour les yeux dans un sanctuaire sombre',
  optLang: 'Langue / Language',
  a11yLangNote: 'Traduit automatiquement par des API gratuites pour 44 langues • peut contenir des erreurs',
  a11yTranslating: 'Traduction en cours… un instant.',
  close: 'Terminé',
  s1Title: 'Choisissez la tonalité',
  s1Hint: 'la source — le piano par défaut',
  s1Steps: [
    'Touchez la case bleue avec ▾ pour changer qui guide — le piano par défaut.',
    'Touchez Majeur, Mineur, Accord ou Note — puis une touche ci-dessous.',
    'Tout le groupe ci-dessous suit ce que vous réglez ici.',
  ],
  s2Title: 'Le groupe joue',
  s2Hint: 'sans limite — ajoutez tout le monde',
  s2Steps: [
    'Le premier musicien est le saxo ténor — touchez sa case bleue pour le changer.',
    'Appuyez sur + Ajouter pour plus — chaque nouveau musicien a sa propre couleur.',
    'Cuivres et voix jouent une note (touchez « Joue le… » pour choisir) ; piano et guitare jouent l\'accord complet. Voyez tous sur la portée ci-dessous.',
  ],
  tapToChange: '( toucher pour changer )',
  ifThe: 'Si le',
  isPlaying: 'joue',
  isSinging: 'chante',
  plays: 'joue',
  sings: 'chante',
  a: 'un',
  on: 'en',
  the: 'le',
  majorKey: 'Tonalité majeure',
  minorKey: 'Tonalité mineure',
  chord: 'Accord',
  note: 'Note',
  theNote: 'la note',
  rootKeyOfMusic: 'la tonique — la tonalité de la musique',
  writtenRoot: ' — tonique écrite de ',
  writtenNoteLabel: ' — note écrite de ',
  pianoCInst: 'Piano — instrument en Do',
  whichIsConcert: 'qui en concert est',
  majorKeyWord: 'majeur',
  minorKeyWord: 'mineur',
  keyWord: 'tonalité',
  tieLabel: '6 dièses = 6 bémols',
  addLabel: 'Ajoutez un instrument ou une voix',
  addPlayer: '+ Ajouter',
  sourceLabel: 'La tonalité / l\'accord vient de',
  sourceDefault: 'Le piano — instrument en Do (par défaut)',
  theirPart: ' — sa partition',
  qualityLabel: 'Tonalité ou type d\'accord',
  bandRootPiano: 'La tonalité de la musique (ce que joue le piano)',
  bandRootSource: ' — tonique écrite',
  sourcePrefix: 'Source :',
  sourcePianoText: 'Piano — instrument en Do · la tonalité de la musique',
  sourcePlayerSuffix: ' — tout ci-dessous est sa partie transposée',
  actualChord: 'Piano / guitare — l\'accord réel',
  writtenNoteOfChord: 'note écrite',
  ofTheChord: 'de l\'accord',
  ofThePianos: 'du piano —',
  pianoKey: 'touche du piano',
  octaveWord: 'octave',
  playsThe: 'Joue le',
  emptyBand: 'Personne dans le groupe — choisissez ci-dessus et appuyez sur « Ajouter ».',
  footerText:
    'Le piano est un instrument en Do — sa tonalité est la tonalité de la musique, et tous les autres transposent à partir de là. Cuivres et voix jouent une note de l\'accord ; claviers et cordes pincées peuvent tout jouer. Guitare, basse, piccolo et ténors partagent les noms de notes du piano et changent seulement d\'octave.',
  footerMark: 'Conçu par SCN Technologies — accessible par conception.',
  copyright: '© 2026 SCN Holdings. Tous droits réservés. « Every Voice, One Answer » — SCNܫܘܐ™, présenté par SCNmedia™.',
  companies: 'SCN Technologies et SCNmedia™ sont des sociétés de SCN Holdings.',
  songCredit: '♪ « Every Voice, One Answer » — SCNܫܘܐ™, présentée par SCNmedia™',
  yourNoteLineA: 'Vous jouez',
  theWord: 'le',
  pianoPlays: 'Le piano joue',
  inKey: 'en',
  accidentalSpelling: 'Écriture des altérations',
  whatPlaying: 'Que jouent-ils',
  chordType: 'Type d\'accord',
  chooseInst: 'Choisissez un instrument ou une voix',
  getStarted: 'Commencer',
  landingKicker: 'Le tour de 60 secondes',
  landingLine: 'Chaque instrument. Chaque voix. Une réponse.',
  landingSub: 'Regardez-le fonctionner, puis entrez — gratuit, sans inscription, hors ligne.',
  staffTitle: 'Le groupe sur la portée',
  staffFloat: 'Faire flotter',
  staffDock: 'Refixer la portée ici',
  staffClose: 'Fermer la portée flottante',
  menuTitle: 'Menu rapide',
  menuClose: 'Fermer le menu',
  menuOpen: 'Ouvrir le menu rapide',
  menuHome: 'Accueil',
  menuHint: 'Aller directement à une section',
  playsWholeChord: 'joue l\'accord complet',
  concertNote: 'l\'accord réel en concert',
  soundOn: 'Avec son',
  soundOff: 'Toucher pour le son',
}

const pt: typeof en = {
  appName: 'Transpose',
  heroTitleA: 'O piano é um instrumento em Dó.',
  heroTitleB: 'Seu tom é o tom da música.',
  heroSub: 'Veja o que cada instrumento e voz toca a partir daí.',
  tourBanner: 'Novo aqui? Assista ao tour rápido — mostra o app em uso.',
  tourCaption: 'Assista ao tour rápido.',
  tourHint: 'Toque numa caixa azul com ▾, toque numa nota — a resposta aparece.',
  tourAria: 'Demonstração curta: toque num instrumento, numa nota, leia a resposta',
  offlineReady: 'Pronta offline — funciona sem internet depois de carregada',
  a11yOpen: 'Opções de acessibilidade e idioma',
  a11yTitle: 'Acessibilidade e Idioma',
  a11yIntro: 'Opções assinatura da SCN Technologies — guardadas neste dispositivo.',
  optColorblind: 'Para daltónicos',
  optColorblindSub: 'Formas nos pontos coloridos, contornos na seleção — nunca só a cor',
  optCalm: 'Modo calmo',
  optCalmSub: 'Para as notas flutuantes e o movimento',
  optLargeText: 'Texto grande',
  optLargeTextSub: 'Letra maior em todo o app',
  optDark: 'Modo escuro',
  optDarkSub: 'Suave para os olhos num santuário escuro',
  optLang: 'Idioma / Language',
  a11yLangNote: 'Traduzido automaticamente por APIs gratuitas para 44 idiomas • pode conter erros',
  a11yTranslating: 'A traduzir… um momento.',
  close: 'Concluído',
  s1Title: 'Defina o tom',
  s1Hint: 'a fonte — o piano por defeito',
  s1Steps: [
    'Toque na caixa azul com ▾ para mudar quem lidera — o piano por defeito.',
    'Toque em Maior, Menor, Acorde ou Nota — depois numa tecla abaixo.',
    'Toda a banda abaixo segue o que definir aqui.',
  ],
  s2Title: 'A banda toca',
  s2Hint: 'sem limite — adicione todos',
  s2Steps: [
    'O primeiro músico é o sax tenor — toque na sua caixa azul para o mudar.',
    'Prima + Adicionar para mais — cada novo músico tem a sua própria cor.',
    'Metais e vozes tocam uma nota (toque em «Toca o…» para escolher); piano e guitarra tocam o acorde completo. Veja todos na pauta abaixo.',
  ],
  tapToChange: '( tocar para mudar )',
  ifThe: 'Se o',
  isPlaying: 'está a tocar',
  isSinging: 'está a cantar',
  plays: 'toca',
  sings: 'canta',
  a: 'um',
  on: 'em',
  the: 'o',
  majorKey: 'Tom maior',
  minorKey: 'Tom menor',
  chord: 'Acorde',
  note: 'Nota',
  theNote: 'a nota',
  rootKeyOfMusic: 'a tónica — o tom da música',
  writtenRoot: ' — tónica escrita de ',
  writtenNoteLabel: ' — nota escrita de ',
  pianoCInst: 'Piano — instrumento em Dó',
  whichIsConcert: 'que em concerto é',
  majorKeyWord: 'maior',
  minorKeyWord: 'menor',
  keyWord: 'tom',
  tieLabel: '6 sustenidos = 6 bemóis',
  addLabel: 'Adicione um instrumento ou voz',
  addPlayer: '+ Adicionar',
  sourceLabel: 'O tom / acorde vem de',
  sourceDefault: 'O piano — instrumento em Dó (por defeito)',
  theirPart: ' — a sua partitura',
  qualityLabel: 'Tom ou tipo de acorde',
  bandRootPiano: 'O tom da música (o que o piano toca)',
  bandRootSource: ' — tónica escrita',
  sourcePrefix: 'Origem:',
  sourcePianoText: 'Piano — instrumento em Dó · o tom da música',
  sourcePlayerSuffix: ' — tudo abaixo é a sua parte transposta',
  actualChord: 'Piano / guitarra — o acorde real',
  writtenNoteOfChord: 'nota escrita',
  ofTheChord: 'do acorde',
  ofThePianos: 'do piano —',
  pianoKey: 'tecla do piano',
  octaveWord: 'oitava',
  playsThe: 'Toca o',
  emptyBand: 'Ainda não há ninguém na banda — escolha acima e prima «Adicionar».',
  footerText:
    'O piano é um instrumento em Dó — o seu tom é o tom da música, e todos os outros transpõem a partir daí. Metais e vozes tocam uma nota do acorde; teclas e cordas dedilhadas podem tocá-lo completo. Guitarra, baixo, flautim e tenores partilham os nomes das notas do piano e mudam apenas de oitava.',
  footerMark: 'Feito pela SCN Technologies — acessível por conceção.',
  copyright: '© 2026 SCN Holdings. Todos os direitos reservados. "Every Voice, One Answer" — SCNܫܘܐ™, apresentado por SCNmedia™.',
  companies: 'SCN Technologies e SCNmedia™ são empresas da SCN Holdings.',
  songCredit: '♪ “Every Voice, One Answer” — SCNܫܘܐ™, apresentada por SCNmedia™',
  yourNoteLineA: 'Toca',
  theWord: 'o',
  pianoPlays: 'O piano toca',
  inKey: 'em',
  accidentalSpelling: 'Escrita das alterações',
  whatPlaying: 'O que estão a tocar',
  chordType: 'Tipo de acorde',
  chooseInst: 'Escolha um instrumento ou voz',
  getStarted: 'Começar',
  landingKicker: 'O tour de 60 segundos',
  landingLine: 'Cada instrumento. Cada voz. Uma resposta.',
  landingSub: 'Veja-o funcionar e entre — grátis, sem registo, offline.',
  staffTitle: 'A banda na pauta',
  staffFloat: 'Fazer flutuar',
  staffDock: 'Fixar a pauta aqui de novo',
  staffClose: 'Fechar a pauta flutuante',
  menuTitle: 'Menu rápido',
  menuClose: 'Fechar o menu',
  menuOpen: 'Abrir o menu rápido',
  menuHome: 'Início',
  menuHint: 'Ir diretamente para uma secção',
  playsWholeChord: 'toca o acorde completo',
  concertNote: 'o acorde real em concerto',
  soundOn: 'Com som',
  soundOff: 'Tocar para som',
}

export const BUILTIN_STRINGS = { en, es, fr, pt }
export type Strings = typeof en

export interface BlockOption {
  text: string
  ok: boolean
  /** Why this block is wrong, in English: shown in the feedback when it is picked. */
  why: string
}

export interface Slot {
  label: string
  gloss: string
  options: BlockOption[]
}

export interface Situation {
  id: string
  title: string
  recipient: string
  register: 'formeel' | 'informeel'
  /** What the message has to achieve, like the bullet points in the exam. */
  brief: string[]
  slots: Slot[]
}

export const STRUCTURE_RULE =
  'A message has four parts in a fixed order: opening, reason, request or statement, closing. All four have to fit the same recipient.'

export const situations: Situation[] = [
  {
    id: 'b1',
    title: 'Ziekmelden bij je werk',
    recipient: 'Meneer De Vries, je leidinggevende',
    register: 'formeel',
    brief: ['Zeg dat je ziek bent', 'Zeg dat je niet kunt komen', 'Zeg wanneer je weer contact opneemt'],
    slots: [
      {
        label: 'Aanhef',
        gloss: 'opening',
        options: [
          { text: 'Geachte heer De Vries,', ok: true, why: '' },
          { text: 'Hoi Jan,', ok: false, why: 'Too informal: you address your boss as meneer and u.' },
          { text: 'Beste klant,', ok: false, why: 'Wrong recipient: this message goes to your manager.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik ben vandaag ziek. Ik heb griep en koorts.', ok: true, why: '' },
          { text: 'Ik heb vandaag geen zin om te komen.', ok: false, why: 'This is not a sick note, and it is not polite.' },
          { text: 'Ik wil graag een nieuwe afspraak maken.', ok: false, why: 'This belongs in a message that moves an appointment, not in a sick note.' },
        ],
      },
      {
        label: 'Mededeling',
        gloss: 'what happens next',
        options: [
          { text: 'Ik kan daarom niet naar mijn werk komen. Morgenochtend bel ik u weer.', ok: true, why: '' },
          { text: 'Kun je mijn werk vandaag overnemen?', ok: false, why: 'This uses "je" in a formal message; with your boss you use u.' },
          { text: 'Ik kom vanmiddag toch even langs.', ok: false, why: 'This contradicts the sick note.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: true, why: '' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Too informal for a message to your manager.' },
          { text: 'Doei!', ok: false, why: 'This is spoken language and does not belong in a formal message.' },
        ],
      },
    ],
  },
  {
    id: 'b2',
    title: 'Een afspraak verzetten bij de tandarts',
    recipient: 'Tandartspraktijk Centrum',
    register: 'formeel',
    brief: ['Noem je afspraak', 'Zeg dat je niet kunt komen en waarom', 'Vraag om een nieuwe afspraak'],
    slots: [
      {
        label: 'Aanhef',
        gloss: 'opening',
        options: [
          { text: 'Geachte heer/mevrouw,', ok: true, why: '' },
          { text: 'Hoi allemaal,', ok: false, why: 'Too informal for a practice you do not know personally.' },
          { text: 'Lieve tandarts,', ok: false, why: 'You only use "Lieve" with family and friends.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik heb donderdag 12 maart om 14.00 uur een afspraak bij u. Ik kan helaas niet komen, omdat ik die dag moet werken.', ok: true, why: '' },
          { text: 'Ik kom niet.', ok: false, why: 'Too short: the date and the reason are missing.' },
          { text: 'Mijn kies doet al een week pijn.', ok: false, why: 'That is a reason for an appointment, not for cancelling one.' },
        ],
      },
      {
        label: 'Verzoek',
        gloss: 'request',
        options: [
          { text: 'Kunt u mij een nieuwe afspraak geven? Volgende week donderdag komt het mij goed uit.', ok: true, why: '' },
          { text: 'Kun je me even bellen?', ok: false, why: 'This uses "je"; in a formal message you use u.' },
          { text: 'Ik hoop dat het goed met u gaat.', ok: false, why: 'This is not a request, so the question about a new appointment is missing.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: true, why: '' },
          { text: 'Tot snel!', ok: false, why: 'Too informal, and you do not know yet when you are coming.' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Too informal for a practice.' },
        ],
      },
    ],
  },
  {
    id: 'b3',
    title: 'Je buurvrouw bedanken',
    recipient: 'Anna, je buurvrouw',
    register: 'informeel',
    brief: ['Bedank haar', 'Zeg waarvoor', 'Bied iets terug aan'],
    slots: [
      {
        label: 'Aanhef',
        gloss: 'opening',
        options: [
          { text: 'Hoi Anna,', ok: true, why: '' },
          { text: 'Geachte mevrouw,', ok: false, why: 'Too formal for a neighbour you know well.' },
          { text: 'Aan de bewoner van nummer 14,', ok: false, why: 'That is an address line, not an opening for a neighbour.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Heel erg bedankt dat je vorige week op de planten hebt gepast.', ok: true, why: '' },
          { text: 'Hierbij bevestig ik de ontvangst van uw diensten.', ok: false, why: 'Far too formal and unnatural for a neighbour.' },
          { text: 'Kun je volgende week weer op de planten passen?', ok: false, why: 'That is a new request, not a thank-you.' },
        ],
      },
      {
        label: 'Aanbod',
        gloss: 'offer',
        options: [
          { text: 'Als jij een keer weg bent, doe ik het graag voor jou.', ok: true, why: '' },
          { text: 'Als u een keer weg bent, doe ik het graag voor u.', ok: false, why: 'This uses "u" while the rest is informal; keep one register throughout.' },
          { text: 'Ik verwacht uw antwoord binnen veertien dagen.', ok: false, why: 'This belongs in a business letter, not in a thank-you.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Groetjes,\nAnish', ok: true, why: '' },
          { text: 'Hoogachtend,\nA. Nalabanda', ok: false, why: 'Far too formal for your neighbour.' },
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: false, why: 'Polite, but too businesslike next to an informal opening like "Hoi Anna".' },
        ],
      },
    ],
  },
  {
    id: 'b4',
    title: 'Uitnodiging voor je verjaardag',
    recipient: 'Sam, een vriend',
    register: 'informeel',
    brief: ['Nodig hem uit', 'Zeg wanneer en waar', 'Vraag om een antwoord'],
    slots: [
      {
        label: 'Aanhef',
        gloss: 'opening',
        options: [
          { text: 'Hoi Sam,', ok: true, why: '' },
          { text: 'Geachte heer,', ok: false, why: 'Far too formal for a friend.' },
          { text: 'Beste meneer Sam,', ok: false, why: 'You do not use "Meneer" with a friend.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik ben zaterdag jarig en ik geef een klein feestje.', ok: true, why: '' },
          { text: 'Hierbij nodig ik u uit voor een bijeenkomst.', ok: false, why: 'This is business language; to a friend you write plainly.' },
          { text: 'Ik kan zaterdag helaas niet komen.', ok: false, why: 'That is a cancellation, not an invitation.' },
        ],
      },
      {
        label: 'Informatie',
        gloss: 'the details',
        options: [
          { text: 'Kom je ook? Het begint om 20.00 uur bij mij thuis.', ok: true, why: '' },
          { text: 'Komt u ook? Het begint om 20.00 uur.', ok: false, why: 'This uses "u" in an informal message to a friend.' },
          { text: 'Het feest is ergens in het weekend.', ok: false, why: 'Too vague: the time and the place have to be in there.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Laat je even weten of je komt?\n\nGroetjes,\nAnish', ok: true, why: '' },
          { text: 'Ik zie uw reactie graag tegemoet.\n\nHoogachtend,\nA. Nalabanda', ok: false, why: 'Business language in a message to a friend.' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'The closing is fine, but the brief asked you to request a reply.' },
        ],
      },
    ],
  },
  {
    id: 'b5',
    title: 'Klacht over de verwarming',
    recipient: 'De verhuurder',
    register: 'formeel',
    brief: ['Zeg wat er kapot is', 'Zeg sinds wanneer', 'Vraag om een monteur'],
    slots: [
      {
        label: 'Aanhef',
        gloss: 'opening',
        options: [
          { text: 'Geachte heer/mevrouw,', ok: true, why: '' },
          { text: 'Hallo,', ok: false, why: 'Too informal for your landlord.' },
          { text: 'Beste buren,', ok: false, why: 'Wrong recipient.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'De verwarming in mijn woning is kapot. Het is sinds maandag koud in huis.', ok: true, why: '' },
          { text: 'Er is iets aan de hand met het huis.', ok: false, why: 'Too vague: say exactly what is broken.' },
          { text: 'Ik wil de huur opzeggen.', ok: false, why: 'That is an entirely different message.' },
        ],
      },
      {
        label: 'Verzoek',
        gloss: 'request',
        options: [
          { text: 'Kunt u een monteur sturen? Ik ben op werkdagen na 17.00 uur thuis.', ok: true, why: '' },
          { text: 'Stuur snel iemand.', ok: false, why: 'Too short and impolite for a formal message.' },
          { text: 'Kun je even langskomen?', ok: false, why: 'This uses "je"; with your landlord you use u.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda\nKerkstraat 12, Utrecht', ok: true, why: '' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Too informal, and a complaint about your home needs your address.' },
          { text: 'Bedankt alvast!', ok: false, why: 'Friendly, but a closing with your name is missing.' },
        ],
      },
    ],
  },
]

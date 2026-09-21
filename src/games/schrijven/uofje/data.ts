export type Register = 'formeel' | 'informeel'

export interface Toggle {
  label: string
  formeel: string
  informeel: string
}

export type MessagePart = string | Toggle

export interface RegisterMessage {
  id: string
  recipient: string
  /** Why this recipient gets this register, in English: shown with the feedback. */
  relation: string
  register: Register
  subject: string
  parts: MessagePart[]
}

export const REGISTER_RULES: Record<Register, string> = {
  formeel:
    'You write formally to an organisation, a boss, a school, a landlord or anyone you do not know: u and uw, "Geachte heer/mevrouw" and "Met vriendelijke groet".',
  informeel:
    'You write informally to family, friends and neighbours you know: je, jij and jouw, "Hoi" or "Beste" with the first name, and "Groetjes".',
}

export const CONSISTENCY_RULE =
  'Pick one register and keep it for the whole text. Mixing u and je counts as a mistake at DUO.'

export function isToggle(part: MessagePart): part is Toggle {
  return typeof part !== 'string'
}

export const messages: RegisterMessage[] = [
  {
    id: 'r1',
    recipient: 'Gemeente Utrecht',
    relation: 'an organisation you do not know personally',
    register: 'formeel',
    subject: 'Vraag over een brief',
    parts: [
      { label: 'opening', formeel: 'Geachte heer/mevrouw', informeel: 'Hoi' },
      ',\n\nIk heb ',
      { label: 'possessive pronoun', formeel: 'uw', informeel: 'je' },
      ' brief van 3 maart ontvangen. Ik begrijp niet welke papieren ik mee moet nemen. Kan ',
      { label: 'subject pronoun', formeel: 'u', informeel: 'je' },
      ' mij dat uitleggen? Ik hoor graag van ',
      { label: 'object pronoun', formeel: 'u', informeel: 'jou' },
      '.\n\n',
      { label: 'closing', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
  {
    id: 'r2',
    recipient: 'Anna, je buurvrouw',
    relation: 'a neighbour you know well',
    register: 'informeel',
    subject: 'Planten water geven',
    parts: [
      { label: 'opening', formeel: 'Geachte mevrouw', informeel: 'Hoi Anna' },
      ',\n\nIk ben volgende week op vakantie. ',
      { label: 'question', formeel: 'Kunt u', informeel: 'Kun je' },
      ' de planten water geven? Ik breng de sleutel donderdag naar ',
      { label: 'possessive pronoun', formeel: 'uw', informeel: 'jouw' },
      ' huis. Alvast bedankt!\n\n',
      { label: 'closing', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r3',
    recipient: 'Meneer De Vries, je leidinggevende',
    relation: 'your boss at work',
    register: 'formeel',
    subject: 'Ziekmelding',
    parts: [
      { label: 'opening', formeel: 'Geachte heer De Vries', informeel: 'Hoi Jan' },
      ',\n\nIk ben vandaag ziek. Ik heb koorts en kan daarom niet naar mijn werk komen. Ik bel ',
      { label: 'object pronoun', formeel: 'u', informeel: 'je' },
      ' morgenochtend om te zeggen hoe het gaat. Mijn collega weet waar ',
      { label: 'subject pronoun', formeel: 'u', informeel: 'je' },
      ' mijn sleutels kunt vinden.\n\n',
      { label: 'closing', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r4',
    recipient: 'Sam, een vriend',
    relation: 'a friend',
    register: 'informeel',
    subject: 'Afspraak verzetten',
    parts: [
      { label: 'opening', formeel: 'Geachte heer', informeel: 'Hoi Sam' },
      ',\n\nSorry, ik kan zaterdag niet. Mijn zus komt logeren. Kunnen we het naar zondag verzetten? Komt dat ',
      { label: 'object pronoun', formeel: 'u', informeel: 'jou' },
      ' goed uit? Laat ',
      { label: 'subject pronoun', formeel: 'u', informeel: 'je' },
      ' het even weten.\n\n',
      { label: 'closing', formeel: 'Hoogachtend', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r5',
    recipient: 'De school van je dochter',
    relation: 'the school, an organisation',
    register: 'formeel',
    subject: 'Afwezigheid melden',
    parts: [
      { label: 'opening', formeel: 'Geachte heer/mevrouw', informeel: 'Hoi' },
      ',\n\nMijn dochter Leila is ziek. Zij kan vandaag niet naar school komen. Ik wil ',
      { label: 'object pronoun', formeel: 'u', informeel: 'je' },
      ' vragen of zij het huiswerk van deze week kan krijgen. Kan ',
      { label: 'subject pronoun', formeel: 'u', informeel: 'je' },
      ' mij dat per e-mail sturen?\n\n',
      { label: 'closing', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
  {
    id: 'r6',
    recipient: 'De huisarts',
    relation: 'a doctor, formal even if you go there often',
    register: 'formeel',
    subject: 'Afspraak afzeggen',
    parts: [
      { label: 'opening', formeel: 'Geachte mevrouw Jansen', informeel: 'Hoi' },
      ',\n\nIk heb morgen om 10.00 uur een afspraak. Het spijt me, maar ik kan niet komen omdat ik moet werken. Kan ',
      { label: 'subject pronoun', formeel: 'u', informeel: 'je' },
      ' mij een nieuwe afspraak geven? Volgende week donderdag komt het mij goed uit. Ik hoor graag van ',
      { label: 'object pronoun', formeel: 'u', informeel: 'jou' },
      '.\n\n',
      { label: 'closing', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
]

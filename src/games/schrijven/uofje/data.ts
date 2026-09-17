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
  /** Why this recipient gets this register: shown with the feedback. */
  relation: string
  register: Register
  subject: string
  parts: MessagePart[]
}

export const REGISTER_RULES: Record<Register, string> = {
  formeel:
    'Formeel schrijf je aan een instantie, een baas, een school, een verhuurder of iemand die je niet kent: u en uw, "Geachte heer/mevrouw" en "Met vriendelijke groet".',
  informeel:
    'Informeel schrijf je aan familie, vrienden en buren die je kent: je, jij en jouw, "Hoi" of "Beste" met de voornaam, en "Groetjes".',
}

export const CONSISTENCY_RULE =
  'Kies één register en houd dat de hele tekst vol. Half u en half je door elkaar is een fout die bij DUO meetelt.'

export function isToggle(part: MessagePart): part is Toggle {
  return typeof part !== 'string'
}

export const messages: RegisterMessage[] = [
  {
    id: 'r1',
    recipient: 'Gemeente Utrecht',
    relation: 'een instantie die je niet persoonlijk kent',
    register: 'formeel',
    subject: 'Vraag over een brief',
    parts: [
      { label: 'aanhef', formeel: 'Geachte heer/mevrouw', informeel: 'Hoi' },
      ',\n\nIk heb ',
      { label: 'bezittelijk voornaamwoord', formeel: 'uw', informeel: 'je' },
      ' brief van 3 maart ontvangen. Ik begrijp niet welke papieren ik mee moet nemen. Kan ',
      { label: 'onderwerp', formeel: 'u', informeel: 'je' },
      ' mij dat uitleggen? Ik hoor graag van ',
      { label: 'voorwerp', formeel: 'u', informeel: 'jou' },
      '.\n\n',
      { label: 'afsluiting', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
  {
    id: 'r2',
    recipient: 'Anna, je buurvrouw',
    relation: 'een buurvrouw die je goed kent',
    register: 'informeel',
    subject: 'Planten water geven',
    parts: [
      { label: 'aanhef', formeel: 'Geachte mevrouw', informeel: 'Hoi Anna' },
      ',\n\nIk ben volgende week op vakantie. ',
      { label: 'vraag', formeel: 'Kunt u', informeel: 'Kun je' },
      ' de planten water geven? Ik breng de sleutel donderdag naar ',
      { label: 'bezittelijk voornaamwoord', formeel: 'uw', informeel: 'jouw' },
      ' huis. Alvast bedankt!\n\n',
      { label: 'afsluiting', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r3',
    recipient: 'Meneer De Vries, je leidinggevende',
    relation: 'je baas op het werk',
    register: 'formeel',
    subject: 'Ziekmelding',
    parts: [
      { label: 'aanhef', formeel: 'Geachte heer De Vries', informeel: 'Hoi Jan' },
      ',\n\nIk ben vandaag ziek. Ik heb koorts en kan daarom niet naar mijn werk komen. Ik bel ',
      { label: 'voorwerp', formeel: 'u', informeel: 'je' },
      ' morgenochtend om te zeggen hoe het gaat. Mijn collega weet waar ',
      { label: 'onderwerp', formeel: 'u', informeel: 'je' },
      ' mijn sleutels kunt vinden.\n\n',
      { label: 'afsluiting', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r4',
    recipient: 'Sam, een vriend',
    relation: 'een vriend',
    register: 'informeel',
    subject: 'Afspraak verzetten',
    parts: [
      { label: 'aanhef', formeel: 'Geachte heer', informeel: 'Hoi Sam' },
      ',\n\nSorry, ik kan zaterdag niet. Mijn zus komt logeren. Kunnen we het naar zondag verzetten? Komt dat ',
      { label: 'voorwerp', formeel: 'u', informeel: 'jou' },
      ' goed uit? Laat ',
      { label: 'onderwerp', formeel: 'u', informeel: 'je' },
      ' het even weten.\n\n',
      { label: 'afsluiting', formeel: 'Hoogachtend', informeel: 'Groetjes' },
      ',\nAnish',
    ],
  },
  {
    id: 'r5',
    recipient: 'De school van je dochter',
    relation: 'de school, een instantie',
    register: 'formeel',
    subject: 'Afwezigheid melden',
    parts: [
      { label: 'aanhef', formeel: 'Geachte heer/mevrouw', informeel: 'Hoi' },
      ',\n\nMijn dochter Leila is ziek. Zij kan vandaag niet naar school komen. Ik wil ',
      { label: 'voorwerp', formeel: 'u', informeel: 'je' },
      ' vragen of zij het huiswerk van deze week kan krijgen. Kan ',
      { label: 'onderwerp', formeel: 'u', informeel: 'je' },
      ' mij dat per e-mail sturen?\n\n',
      { label: 'afsluiting', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
  {
    id: 'r6',
    recipient: 'De huisarts',
    relation: 'een arts, formeel, ook als je er vaak komt',
    register: 'formeel',
    subject: 'Afspraak afzeggen',
    parts: [
      { label: 'aanhef', formeel: 'Geachte mevrouw Jansen', informeel: 'Hoi' },
      ',\n\nIk heb morgen om 10.00 uur een afspraak. Het spijt me, maar ik kan niet komen omdat ik moet werken. Kan ',
      { label: 'onderwerp', formeel: 'u', informeel: 'je' },
      ' mij een nieuwe afspraak geven? Volgende week donderdag komt het mij goed uit. Ik hoor graag van ',
      { label: 'voorwerp', formeel: 'u', informeel: 'jou' },
      '.\n\n',
      { label: 'afsluiting', formeel: 'Met vriendelijke groet', informeel: 'Groetjes' },
      ',\nAnish Nalabanda',
    ],
  },
]

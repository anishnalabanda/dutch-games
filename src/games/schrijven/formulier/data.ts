/**
 * How a personal field is checked. There is no source text to copy from, as on
 * the exam: the owner fills in their own details (or made-up ones), so a field
 * is checked for its format, never against an expected value.
 */
export type FieldKind =
  | 'name'
  | 'fullname'
  | 'place'
  | 'street'
  | 'birthdate'
  | 'date'
  | 'today'
  | 'postcode'
  | 'bsn'
  | 'tel'
  | 'email'
  | 'nationality'
  | 'gender'
  | 'number'

export interface FormField {
  id: string
  label: string
  gloss: string
  kind: FieldKind
}

export interface OpenQuestion {
  id: string
  /** The question as printed on the form, in Dutch. */
  question: string
  /**
   * Regex fragments, each matched from a word start: an answer to this question
   * almost always contains one of them. A hint that the question was answered,
   * not a grade.
   */
  keywords: string[]
  /** What the keywords look for, in English, for the feedback. */
  expects: string
  model: string
}

export interface DutchForm {
  id: string
  title: string
  /** The exam-style task line, in Dutch. */
  situation: string
  fields: FormField[]
  questions: OpenQuestion[]
}

// --- Fields ------------------------------------------------------------------

const voornaam: FormField = { id: 'voornaam', label: 'Voornaam', gloss: 'first name', kind: 'name' }
const achternaam: FormField = { id: 'achternaam', label: 'Achternaam', gloss: 'surname', kind: 'name' }
const geboortedatum: FormField = {
  id: 'geboortedatum',
  label: 'Geboortedatum',
  gloss: 'date of birth',
  kind: 'birthdate',
}
const geslacht: FormField = {
  id: 'geslacht',
  label: 'Geslacht',
  gloss: 'sex: man, vrouw or X',
  kind: 'gender',
}
const nationaliteit: FormField = {
  id: 'nationaliteit',
  label: 'Nationaliteit',
  gloss: 'nationality',
  kind: 'nationality',
}
const bsn: FormField = {
  id: 'bsn',
  label: 'Burgerservicenummer',
  gloss: 'citizen service number (BSN)',
  kind: 'bsn',
}
const adres: FormField = {
  id: 'adres',
  label: 'Straat en huisnummer',
  gloss: 'street and house number',
  kind: 'street',
}
const postcode: FormField = { id: 'postcode', label: 'Postcode', gloss: 'postal code', kind: 'postcode' }
const woonplaats: FormField = {
  id: 'woonplaats',
  label: 'Woonplaats',
  gloss: 'town you live in',
  kind: 'place',
}
const telefoonnummer: FormField = {
  id: 'telefoonnummer',
  label: 'Telefoonnummer',
  gloss: 'phone number',
  kind: 'tel',
}
const email: FormField = { id: 'email', label: 'E-mailadres', gloss: 'email address', kind: 'email' }
const datum: FormField = {
  id: 'datum',
  label: 'Datum',
  gloss: "date: today's, the day you fill it in",
  kind: 'today',
}
const handtekening: FormField = {
  id: 'handtekening',
  label: 'Handtekening',
  gloss: 'signature: type your full name',
  kind: 'fullname',
}

// --- What an answer to a question type contains ------------------------------

const DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag', 'weekend', 'werkdag', 'elke']
const TIME = [
  ...DAYS,
  'ochtend', 'middag', 'avond', 'nacht', 'morgen', 'vandaag', 'gister', 'overmorgen', 'vanavond',
  'vanmiddag', 'vanochtend', 'vanmorgen', 'week', 'weken', 'maand', 'jaar', 'uur', '[0-9]', 'sinds',
  'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober',
  'november', 'december', 'meestal', 'altijd', 'vaak', 'soms', 'straks', 'na\\b',
]
const REASON = ['omdat', 'want', 'graag', 'wil', 'daarom', 'om\\b', 'leuk', 'belangrijk', 'nodig']
const AMOUNT = ['[0-9]', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'twintig', 'dertig', 'veertig', 'half']
const COLOURS = ['zwart', 'blauw', 'rood', 'rode', 'bruin', 'groen', 'grijs', 'wit', 'geel', 'gele', 'roze', 'paars', 'kleur']
const YES_NO = ['ja\\b', 'nee\\b', 'geen', 'niet', 'nooit']

// --- The forms ---------------------------------------------------------------

export const forms: DutchForm[] = [
  {
    id: 'fo-bibliotheek',
    title: 'Inschrijfformulier bibliotheek',
    situation: 'U wilt lid worden van de bibliotheek in uw wijk. Vul het formulier in.',
    fields: [voornaam, achternaam, geboortedatum, adres, postcode, woonplaats, email, datum],
    questions: [
      {
        id: 'waarom',
        question: 'Waarom wilt u lid worden van de bibliotheek?',
        keywords: [...REASON, 'lezen', 'lees', 'boek', 'leren', 'taal'],
        expects: 'a reason',
        model: 'Ik wil lid worden, omdat ik graag Nederlandse boeken lees.',
      },
      {
        id: 'boeken',
        question: 'Wat voor boeken leest u graag?',
        keywords: ['boek', 'roman', 'verhal', 'strip', 'kookboek', 'tijdschrift', 'krant', 'detective', 'makkelijk', 'kinderboek', 'lees'],
        expects: 'a kind of book',
        model: 'Ik lees graag makkelijke romans en kookboeken.',
      },
      {
        id: 'wanneer',
        question: 'Wanneer komt u meestal naar de bibliotheek?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik kom meestal op zaterdagochtend naar de bibliotheek.',
      },
    ],
  },
  {
    id: 'fo-sport',
    title: 'Aanmelding groepsles Sportcentrum De Linde',
    situation: 'U wilt een groepsles yoga volgen bij Sportcentrum De Linde. Vul het formulier in.',
    fields: [voornaam, achternaam, geslacht, geboortedatum, telefoonnummer, email],
    questions: [
      {
        id: 'waarom',
        question: 'Waarom kiest u voor yoga?',
        keywords: [...REASON, 'rust', 'stress', 'gezond', 'sport', 'fit', 'rug', 'ontspan'],
        expects: 'a reason',
        model: 'Ik kies voor yoga, omdat ik veel stress heb.',
      },
      {
        id: 'gezondheid',
        question: 'Hoe is uw gezondheid?',
        keywords: ['goed', 'gezond', 'ziek', 'pijn', 'last', 'rug', 'knie', 'allergi', 'astma', 'probleem', 'problemen', 'fit', 'prima', 'slecht'],
        expects: 'something about your health',
        model: 'Mijn gezondheid is goed, maar ik heb soms last van mijn rug.',
      },
      {
        id: 'dagen',
        question: 'Op welke dagen kunt u sporten?',
        keywords: [...DAYS, 'ochtend', 'middag', 'avond'],
        expects: 'a day',
        model: 'Ik kan op dinsdagavond en op zaterdag sporten.',
      },
    ],
  },
  {
    id: 'fo-cursus',
    title: 'Aanmelding taalcursus Buurthuis De Brug',
    situation: 'U wilt Nederlandse les volgen in het buurthuis. Vul het formulier in.',
    fields: [voornaam, achternaam, nationaliteit, telefoonnummer, email, datum],
    questions: [
      {
        id: 'waarom',
        question: 'Waarom wilt u deze cursus volgen?',
        keywords: [...REASON, 'leren', 'spreken', 'praten', 'werk', 'examen'],
        expects: 'a reason',
        model: 'Ik wil deze cursus volgen, omdat ik beter Nederlands wil spreken.',
      },
      {
        id: 'hoelang',
        question: 'Hoe lang woont u al in Nederland?',
        keywords: [...AMOUNT, 'jaar', 'jaren', 'maand', 'week', 'weken', 'sinds'],
        expects: 'how long',
        model: 'Ik woon al twee jaar in Nederland.',
      },
      {
        id: 'wanneer',
        question: 'Wanneer kunt u naar de les komen?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik kan op maandagavond en woensdagavond naar de les komen.',
      },
    ],
  },
  {
    id: 'fo-huisarts',
    title: 'Inschrijving nieuwe patiënt Huisartsenpraktijk Oost',
    situation: 'U bent verhuisd en u zoekt een nieuwe huisarts. Vul het inschrijfformulier in.',
    fields: [voornaam, achternaam, geboortedatum, geslacht, bsn, adres, postcode, telefoonnummer],
    questions: [
      {
        id: 'waarom',
        question: 'Waarom wilt u zich inschrijven bij onze praktijk?',
        keywords: [...REASON, 'verhuis', 'woon', 'dichtbij', 'buurt', 'nieuw', 'geen'],
        expects: 'a reason',
        model: 'Ik ben net verhuisd en ik heb nog geen huisarts.',
      },
      {
        id: 'medicijnen',
        question: 'Gebruikt u medicijnen? Zo ja, welke?',
        keywords: [...YES_NO, 'medicijn', 'pil', 'paracetamol', 'tablet', 'insuline', 'puffer'],
        expects: 'yes or no, and which ones',
        model: 'Nee, ik gebruik geen medicijnen.',
      },
      {
        id: 'allergie',
        question: 'Bent u ergens allergisch voor?',
        keywords: [...YES_NO, 'allergi', 'nergens', 'noten', 'pinda', 'gras', 'hooikoorts', 'penicilline'],
        expects: 'yes or no, and what to',
        model: 'Ja, ik ben allergisch voor noten.',
      },
    ],
  },
  {
    id: 'fo-verloren',
    title: 'Verliesformulier gevonden voorwerpen',
    situation: 'U bent gisteren iets verloren in de trein. Vul het verliesformulier in.',
    fields: [voornaam, achternaam, telefoonnummer, email, datum],
    questions: [
      {
        id: 'wat',
        question: 'Wat bent u verloren? Beschrijf het.',
        keywords: [...COLOURS, 'tas', 'portemonnee', 'telefoon', 'jas', 'sleutel', 'paraplu', 'rugzak', 'laptop', 'bril', 'klein', 'groot', 'oud', 'nieuw'],
        expects: 'the thing and what it looks like',
        model: 'Ik ben mijn zwarte rugzak verloren. Er zit een laptop in.',
      },
      {
        id: 'waar',
        question: 'Waar en wanneer bent u het verloren?',
        keywords: [...TIME, 'trein', 'station', 'bus', 'perron', 'tram', 'metro'],
        expects: 'a place or a time',
        model: 'Ik ben het gisteren om 17.00 uur in de trein naar Utrecht verloren.',
      },
      {
        id: 'bereiken',
        question: 'Hoe kunnen wij u het beste bereiken?',
        keywords: ['bel', 'mail', 'e-mail', 'telefo', 'sms', 'whatsapp', 'app', 'ochtend', 'middag', 'avond', 'na\\b', '[0-9]'],
        expects: 'how or when to reach you',
        model: 'U kunt mij het beste na 18.00 uur bellen.',
      },
    ],
  },
  {
    id: 'fo-verhuizing',
    title: 'Verhuizing doorgeven aan de gemeente',
    situation: 'U gaat verhuizen naar een andere straat in dezelfde stad. Geef uw nieuwe adres door aan de gemeente.',
    fields: [
      voornaam,
      achternaam,
      geboortedatum,
      bsn,
      { id: 'nieuwadres', label: 'Nieuw adres', gloss: 'new address: street and house number', kind: 'street' },
      postcode,
      { id: 'verhuisdatum', label: 'Verhuisdatum', gloss: 'date of the move', kind: 'date' },
      handtekening,
    ],
    questions: [
      {
        id: 'wie',
        question: 'Met wie verhuist u?',
        keywords: ['alleen', 'partner', 'man\\b', 'vrouw', 'kind', 'zoon', 'dochter', 'gezin', 'familie', 'moeder', 'vader', 'vriend'],
        expects: 'who moves with you',
        model: 'Ik verhuis met mijn partner en onze twee kinderen.',
      },
      {
        id: 'waarom',
        question: 'Waarom verhuist u?',
        keywords: [...REASON, 'groter', 'groot', 'klein', 'werk', 'tuin', 'dichtbij', 'duur', 'goedkoper'],
        expects: 'a reason',
        model: 'Wij verhuizen, omdat ons huis te klein is.',
      },
      {
        id: 'oudadres',
        question: 'Wat is uw oude adres?',
        keywords: ['[0-9]', 'straat', 'weg', 'laan', 'plein', 'gracht', 'kade', 'singel', 'dijk'],
        expects: 'a street and a house number',
        model: 'Mijn oude adres is Kerkstraat 12 in Utrecht.',
      },
    ],
  },
  {
    id: 'fo-werk',
    title: 'Sollicitatieformulier Supermarkt Vers',
    situation: 'U wilt werken bij een supermarkt in uw buurt. Vul het sollicitatieformulier in.',
    fields: [voornaam, achternaam, geboortedatum, adres, woonplaats, telefoonnummer, email],
    questions: [
      {
        id: 'eerder',
        question: 'Welk werk heeft u eerder gedaan?',
        keywords: ['werk', 'gewerkt', 'winkel', 'restaurant', 'fabriek', 'kassa', 'magazijn', 'kok', 'chauffeur', 'schoonma', 'ervaring', 'jaar', 'als\\b', 'geen'],
        expects: 'a job or a place you worked',
        model: 'Ik heb drie jaar in een restaurant gewerkt.',
      },
      {
        id: 'waarom',
        question: 'Waarom wilt u bij ons werken?',
        keywords: [...REASON, 'dichtbij', 'mensen', 'klant'],
        expects: 'a reason',
        model: 'Ik wil graag bij u werken, omdat ik het leuk vind om met klanten te praten.',
      },
      {
        id: 'uren',
        question: 'Hoeveel uur per week wilt u werken?',
        keywords: [...AMOUNT, 'uur', 'fulltime', 'parttime', 'dag'],
        expects: 'a number of hours',
        model: 'Ik wil graag 24 uur per week werken.',
      },
    ],
  },
  {
    id: 'fo-zwemles',
    title: 'Aanmelding zwemles Zwembad De Wetering',
    situation: 'Uw zoon is zes jaar. U wilt hem aanmelden voor zwemles. Vul het formulier in.',
    fields: [
      { id: 'naamkind', label: 'Naam van uw kind', gloss: "your child's full name", kind: 'fullname' },
      { id: 'geboortedatumkind', label: 'Geboortedatum van uw kind', gloss: "your child's date of birth", kind: 'birthdate' },
      { id: 'naamouder', label: 'Naam ouder', gloss: 'name of the parent: yours, in full', kind: 'fullname' },
      telefoonnummer,
      email,
    ],
    questions: [
      {
        id: 'zwemmen',
        question: 'Kan uw kind al een beetje zwemmen?',
        keywords: [...YES_NO, 'nog', 'al\\b', 'beetje', 'zwem'],
        expects: 'yes or no',
        model: 'Nee, mijn zoon kan nog niet zwemmen.',
      },
      {
        id: 'gezondheid',
        question: 'Heeft uw kind een allergie of een ziekte?',
        keywords: [...YES_NO, 'allergi', 'astma', 'ziek', 'gezond'],
        expects: 'yes or no, and which one',
        model: 'Nee, mijn zoon is gezond en heeft geen allergie.',
      },
      {
        id: 'dag',
        question: 'Op welke dag kan uw kind zwemles krijgen?',
        keywords: [...DAYS, 'ochtend', 'middag', 'avond'],
        expects: 'a day',
        model: 'Hij kan op woensdagmiddag zwemles krijgen.',
      },
    ],
  },
  {
    id: 'fo-reparatie',
    title: 'Reparatieverzoek woningcorporatie',
    situation: 'Er is iets kapot in uw huurhuis. Vul het reparatieformulier van de woningcorporatie in.',
    fields: [voornaam, achternaam, adres, postcode, telefoonnummer, datum],
    questions: [
      {
        id: 'wat',
        question: 'Wat is er kapot?',
        keywords: ['kapot', 'lek', 'werkt', 'verwarming', 'kraan', 'deur', 'raam', 'douche', 'toilet', 'wc', 'lamp', 'slot', 'schimmel', 'keuken', 'badkamer'],
        expects: 'what is broken',
        model: 'De kraan in de keuken lekt.',
      },
      {
        id: 'sinds',
        question: 'Sinds wanneer is het kapot?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Het is sinds vorige week maandag kapot.',
      },
      {
        id: 'thuis',
        question: 'Wanneer bent u thuis voor de monteur?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik ben op werkdagen na 17.00 uur thuis.',
      },
    ],
  },
  {
    id: 'fo-vrijwilliger',
    title: 'Aanmelding vrijwilligerswerk',
    situation: 'U wilt vrijwilligerswerk doen in het buurthuis. Vul het aanmeldformulier in.',
    fields: [voornaam, achternaam, geboortedatum, telefoonnummer, email],
    questions: [
      {
        id: 'wat',
        question: 'Wat voor vrijwilligerswerk wilt u doen?',
        keywords: ['help', 'kook', 'koken', 'ouderen', 'kinderen', 'tuin', 'winkel', 'voedselbank', 'taal', 'sport', 'schoonma', 'organis', 'boodschappen'],
        expects: 'a kind of work',
        model: 'Ik wil graag ouderen helpen met boodschappen.',
      },
      {
        id: 'goed',
        question: 'Wat kunt u goed?',
        keywords: ['goed', 'kan\\b', 'kook', 'koken', 'praten', 'help', 'organis', 'computer', 'talen', 'spreek', 'sport', 'luister'],
        expects: 'something you are good at',
        model: 'Ik kan goed koken en ik spreek drie talen.',
      },
      {
        id: 'tijd',
        question: 'Hoeveel tijd heeft u per week?',
        keywords: [...AMOUNT, ...TIME],
        expects: 'an amount of time',
        model: 'Ik heb ongeveer vier uur per week tijd.',
      },
    ],
  },
  {
    id: 'fo-buurtfeest',
    title: 'Aanmelding buurtfeest',
    situation: 'Op zaterdag 14 juni is er een buurtfeest in uw straat. U wilt komen. Vul het formulier in.',
    fields: [voornaam, achternaam, adres, telefoonnummer],
    questions: [
      {
        id: 'personen',
        question: 'Met hoeveel personen komt u?',
        keywords: [...AMOUNT, 'alleen', 'personen', 'kind', 'partner', 'gezin'],
        expects: 'a number of people',
        model: 'Wij komen met vier personen.',
      },
      {
        id: 'buffet',
        question: 'Wat neemt u mee voor het buffet?',
        keywords: ['mee\\b', 'salade', 'taart', 'soep', 'cake', 'koek', 'brood', 'eten', 'drinken', 'fruit', 'hapjes', 'rijst', 'gerecht'],
        expects: 'something to eat or drink',
        model: 'Ik neem een salade en een appeltaart mee.',
      },
      {
        id: 'opruimen',
        question: 'Kunt u helpen met opruimen?',
        keywords: [...YES_NO, 'help', 'graag', 'kan\\b'],
        expects: 'yes or no',
        model: 'Ja, ik kan na het feest helpen met opruimen.',
      },
    ],
  },
  {
    id: 'fo-dierenarts',
    title: 'Inschrijving Dierenkliniek Noord',
    situation: 'U heeft een huisdier en u zoekt een dierenarts. Vul het formulier in.',
    fields: [voornaam, achternaam, adres, postcode, woonplaats, telefoonnummer],
    questions: [
      {
        id: 'dier',
        question: 'Wat voor dier heeft u?',
        keywords: ['hond', 'kat\\b', 'poes', 'konijn', 'vogel', 'cavia', 'vis\\b', 'hamster', 'dier'],
        expects: 'a kind of animal',
        model: 'Ik heb een kat van drie jaar oud.',
      },
      {
        id: 'probleem',
        question: 'Is uw dier op dit moment ziek? Wat is het probleem?',
        keywords: [...YES_NO, 'ziek', 'gezond', 'eet', 'pijn', 'hoest', 'probleem', 'moe\\b', 'poot'],
        expects: 'yes or no, and what is wrong',
        model: 'Ja, mijn kat eet sinds twee dagen niet goed.',
      },
      {
        id: 'wanneer',
        question: 'Wanneer kunt u langskomen?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik kan morgenochtend om 9.00 uur langskomen.',
      },
    ],
  },
  {
    id: 'fo-aangifte',
    title: 'Aangifte fietsdiefstal',
    situation: 'Uw fiets is gestolen. U doet aangifte bij de politie met een formulier.',
    fields: [voornaam, achternaam, geboortedatum, adres, postcode, woonplaats, telefoonnummer, datum],
    questions: [
      {
        id: 'fiets',
        question: 'Beschrijf uw fiets.',
        keywords: [...COLOURS, 'fiets', 'merk', 'oud', 'nieuw', 'mand', 'tas', 'dames', 'heren', 'elektrisch'],
        expects: 'what the bike looks like',
        model: 'Het is een zwarte damesfiets met een rode tas.',
      },
      {
        id: 'waar',
        question: 'Waar en wanneer is uw fiets gestolen?',
        keywords: [...TIME, 'station', 'straat', 'school', 'winkel', 'huis', 'thuis', 'werk'],
        expects: 'a place or a time',
        model: 'Mijn fiets is gisteravond bij het station gestolen.',
      },
      {
        id: 'gezien',
        question: 'Heeft u iets gezien?',
        keywords: [...YES_NO, 'niets', 'niks', 'gezien', 'iemand', 'man\\b', 'vrouw', 'jongen'],
        expects: 'yes or no, and what',
        model: 'Nee, ik heb niets gezien.',
      },
    ],
  },
  {
    id: 'fo-ziekmelding',
    title: 'Ziekmelding personeel',
    situation: 'U bent ziek en u kunt niet werken. Vul het ziekmeldingsformulier van uw werk in.',
    fields: [
      voornaam,
      achternaam,
      { id: 'personeelsnummer', label: 'Personeelsnummer', gloss: 'staff number: digits only', kind: 'number' },
      telefoonnummer,
      datum,
    ],
    questions: [
      {
        id: 'sinds',
        question: 'Sinds wanneer bent u ziek?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik ben sinds maandagochtend ziek.',
      },
      {
        id: 'klachten',
        question: 'Wat zijn uw klachten?',
        keywords: ['koorts', 'griep', 'pijn', 'hoofdpijn', 'buikpijn', 'keelpijn', 'hoest', 'verkouden', 'ziek', 'misselijk', 'rug', 'moe\\b', 'last'],
        expects: 'what is wrong with you',
        model: 'Ik heb hoge koorts en veel hoofdpijn.',
      },
      {
        id: 'weer',
        question: 'Wanneer kunt u weer werken, denkt u?',
        keywords: TIME,
        expects: 'a day or a time',
        model: 'Ik denk dat ik volgende week maandag weer kan werken.',
      },
    ],
  },
]

// --- Checking a personal field ------------------------------------------------

export const FORMAT_HELP: Record<FieldKind, string> = {
  name: 'Start a name with a capital letter: Sara, Haddad. A tussenvoegsel like van or de may stay small.',
  fullname: 'Write first name and surname, each with a capital letter: Sara Haddad.',
  place: 'A place name starts with a capital letter: Utrecht.',
  street: 'Street name first, with a capital letter, then the house number: Kerkstraat 12.',
  birthdate: 'Write a date as dd-mm-jjjj, day first: 03-03-1990. A date of birth is in the past.',
  date: 'Write a date as dd-mm-jjjj, day first: 15-05-2026.',
  today: "Here a form wants today's date, written as dd-mm-jjjj, day first.",
  postcode: 'A Dutch postcode is 4 digits, a space and 2 capital letters: 3512 AB.',
  bsn: 'A burgerservicenummer has exactly 9 digits. Make one up for practice.',
  tel: 'A Dutch phone number has 10 digits and starts with 0: 06-12345678.',
  email: 'An email address has one @ and a dot after it, in small letters: naam@mail.nl.',
  nationality: 'Write the nationality as an adjective with a capital letter: Nederlandse, Indiase.',
  gender: 'Write man, vrouw or X.',
  number: 'Write the number in digits only.',
}

const TUSSENVOEGSEL = /^(van|de|der|den|te|ter|ten|het|'t|in|op|von|el|al)\s+/i
const CAPITALISED = /^[A-ZÀ-Þ'][A-Za-zÀ-ÿ'’-]*$/

/** Each word of a name capitalised, after any tussenvoegsel at the front. */
function isName(value: string): boolean {
  let rest = value
  while (TUSSENVOEGSEL.test(rest)) rest = rest.replace(TUSSENVOEGSEL, '')
  const parts = rest.split(/\s+/).filter(Boolean)
  return parts.length > 0 && parts.every((part) => CAPITALISED.test(part) || TUSSENVOEGSEL.test(`${part} `))
}

/** Reads dd-mm-jjjj (one-digit day and month allowed) into a date, or null. */
export function parseDate(value: string): Date | null {
  const match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(value)
  if (!match) return null
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)
  const real = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  return real && year >= 1900 ? date : null
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Checks a typed personal field for its format. `today` is the device's date. */
export function fieldValid(kind: FieldKind, input: string, today: Date): boolean {
  const value = input.trim().replace(/\s+/g, ' ')
  if (value === '') return false
  switch (kind) {
    case 'name':
      return isName(value)
    case 'fullname':
      return value.split(' ').length >= 2 && isName(value.split(' ')[0]) && isName(value.split(' ').slice(1).join(' '))
    case 'place':
      return /^('s-)?[A-ZÀ-Þ][A-Za-zÀ-ÿ'’ -]*$/.test(value)
    case 'street':
      return /^[A-ZÀ-Þ'][A-Za-zÀ-ÿ'’. -]* \d+ ?[a-zA-Z]?(-\d+)?$/.test(value)
    case 'birthdate': {
      const date = parseDate(value)
      return date !== null && date < today
    }
    case 'date':
      return parseDate(value) !== null
    case 'today': {
      const date = parseDate(value)
      return date !== null && sameDay(date, today)
    }
    case 'postcode':
      return /^[1-9]\d{3} [A-Z]{2}$/.test(value)
    case 'bsn':
      return /^\d{9}$/.test(value.replace(/ /g, ''))
    case 'tel': {
      if (!/^[0-9 +-]+$/.test(value)) return false
      const digits = value.replace(/\D/g, '')
      return (digits.length === 10 && digits.startsWith('0')) || (digits.length === 11 && digits.startsWith('31'))
    }
    case 'email':
      return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
    case 'nationality':
      return CAPITALISED.test(value)
    case 'gender':
      return /^(man|vrouw|x|m|v)$/i.test(value)
    case 'number':
      return /^\d+$/.test(value)
  }
}

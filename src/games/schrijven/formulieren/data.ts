import { COLOURS, FOOD, REASON, TIME, WEEKDAYS } from '../taken/keywords'
import type { Picture } from '../taken/types'
import {
  adres,
  bsn,
  datum,
  email,
  geboortedatum,
  naam,
  nationaliteit,
  postcode,
  telefoon,
  woonplaats,
  type FormField,
} from './fields'

/**
 * Forms, as the exam sets them: personal details (made up, checked for format
 * only), sometimes a choice to tick, and two to four open questions about the
 * situation, often taken from pictures. The three marked `exam` follow the
 * DUO oefenexamens, reworded, with emoji standing in for the photos.
 */

export interface OpenQuestion {
  id: string
  /** Dutch, as printed on the form. */
  question: string
  /**
   * Groups of regex fragments, each matched from a word start. Every group
   * needs one hit: "Wat zijn de problemen?" needs the rubbish and the tiles.
   */
  needs: string[][]
  /** English: what the groups look for, for the hint. */
  expects: string
  /** Dutch: how the answer can begin. */
  starter: string
  /** Dutch: one whole answer. */
  example: string
}

export interface Choice {
  id: string
  /** Dutch, as printed above the options. */
  heading: string
  options: string[]
}

export type FormSection =
  | { kind: 'fields'; heading: string; fields: FormField[] }
  | { kind: 'choice'; choice: Choice }
  | { kind: 'question'; question: OpenQuestion }

export interface FormTask {
  id: string
  /** Dutch: the task title above the brief. */
  title: string
  exam?: 1 | 2 | 3
  situation: string
  pictures?: Picture[]
  instructions: string[]
  /** Dutch: the heading printed on the form itself. */
  formTitle: string
  sections: FormSection[]
}

const FILL_IN = 'Vul het formulier in. Sommige gegevens moet u zelf bedenken.'
const FILL_IN_PICTURES = 'Vul het formulier in. Kijk naar de plaatjes. Sommige gegevens moet u zelf bedenken.'

function fields(heading: string, list: FormField[]): FormSection {
  return { kind: 'fields', heading, fields: list }
}
function choice(id: string, heading: string, options: string[]): FormSection {
  return { kind: 'choice', choice: { id, heading, options } }
}
function question(q: OpenQuestion): FormSection {
  return { kind: 'question', question: q }
}

export const forms: FormTask[] = [
  {
    id: 'koken',
    title: 'Cursus koken',
    exam: 1,
    situation: 'U wilt een cursus gezond koken volgen. U vult een aanmeldformulier in.',
    instructions: [FILL_IN],
    formTitle: 'Aanmeldformulier Gezond koken',
    sections: [
      fields('Persoonlijke gegevens', [naam, adres, postcode, woonplaats, telefoon, email]),
      choice('groep', 'Ik wil meedoen met de volgende groep:', [
        'Maandagavond 18.00 - 20.00 uur',
        'Woensdagavond 19.00 - 21.00 uur',
        'Vrijdagavond 18.30 - 20.30 uur',
      ]),
      question({
        id: 'gerecht',
        question: 'Welk gerecht wilt u graag leren koken?',
        needs: [[...FOOD, 'koken']],
        expects: 'a dish',
        starter: 'Ik wil graag … leren koken.',
        example: 'Ik wil graag een gezonde groentesoep leren koken.',
      }),
      question({
        id: 'waarom',
        question: 'Waarom wilt u naar de cursus?',
        needs: [[...REASON, 'gezond', 'leren', 'lekker', 'afvallen']],
        expects: 'a reason',
        starter: 'Ik wil naar de cursus, omdat …',
        example: 'Ik wil naar de cursus, omdat ik gezonder wil eten.',
      }),
    ],
  },
  {
    id: 'aangifte',
    title: 'Aangifte doen',
    exam: 2,
    situation:
      'U bent in de stad aan het winkelen. Iemand steelt uw tas met spullen. U gaat naar de politie en doet aangifte. U vult een formulier in.',
    pictures: [
      { icons: '💻', shows: 'a laptop' },
      { icons: '⌚', shows: 'a wristwatch' },
    ],
    instructions: [FILL_IN_PICTURES],
    formTitle: 'Aangifteformulier',
    sections: [
      question({
        id: 'gebeurd',
        question: 'Wat is er gebeurd?',
        needs: [['gestolen', 'steel', 'stal', 'dief', 'gepakt', 'afgepakt', 'beroofd']],
        expects: 'what happened: that something was stolen',
        starter: 'Iemand heeft …',
        example: 'Iemand heeft in een winkel mijn tas gestolen.',
      }),
      question({
        id: 'spullen',
        question: 'Welke spullen bent u kwijt?',
        needs: [['laptop', 'computer'], ['horloge']],
        expects: 'both things in the pictures',
        starter: 'Ik ben mijn … en mijn … kwijt.',
        example: 'Ik ben mijn laptop en mijn horloge kwijt.',
      }),
      question({
        id: 'eruit',
        question: 'Hoe zien uw spullen eruit?',
        needs: [[...COLOURS, 'groot', 'klein', 'nieuw', 'oud', 'dun', 'dik', 'leer', 'metaal', 'merk']],
        expects: 'a colour, a size or what they are made of',
        starter: 'Mijn laptop is … en mijn horloge is …',
        example: 'Mijn laptop is grijs en nieuw. Mijn horloge is zilver.',
      }),
      question({
        id: 'wanneer',
        question: 'Wanneer is het gebeurd?',
        needs: [TIME],
        expects: 'a day or a time',
        starter: 'Het is … gebeurd.',
        example: 'Het is gisteren om 15.00 uur gebeurd.',
      }),
      fields('Uw gegevens', [
        naam,
        adres,
        postcode,
        woonplaats,
        telefoon,
        { id: 'datum', label: 'Datum aangifte', gloss: "date of the report: today's", kind: 'today' },
      ]),
    ],
  },
  {
    id: 'melding',
    title: 'Problemen in de straat',
    exam: 3,
    situation:
      'In de straat waar u woont, zijn twee problemen. Op de plaatjes ziet u welke problemen. U meldt de problemen bij de gemeente.',
    pictures: [
      { icons: '🗑️🛍️', shows: 'rubbish bags piled up on the pavement' },
      { icons: '🧱', shows: 'loose and broken paving stones' },
    ],
    instructions: ['Vul het meldingsformulier van de gemeente in. Sommige gegevens moet u zelf bedenken.'],
    formTitle: 'Meldingsformulier',
    sections: [
      fields('Persoonsgegevens', [naam, adres, postcode, woonplaats, telefoon, email]),
      question({
        id: 'straat',
        question: 'In welke straat zijn er problemen?',
        needs: [['\\w*(straat|laan|weg|plein|gracht|kade|singel|dreef|hof|pad)']],
        expects: 'a street name',
        starter: 'De problemen zijn in de …',
        example: 'De problemen zijn in de Molenstraat, bij nummer 20.',
      }),
      question({
        id: 'problemen',
        question: 'Wat zijn de problemen?',
        needs: [
          ['afval', 'vuil', 'vuilnis', 'zakken', 'rommel', 'troep'],
          ['tegel', 'stoep', 'gat', 'kapot', 'los'],
        ],
        expects: 'both problems in the pictures',
        starter: 'Er ligt veel … Ook liggen er …',
        example: 'Er ligt veel afval op de stoep. Ook liggen er losse tegels op de stoep.',
      }),
    ],
  },
  {
    id: 'bibliotheek',
    title: 'Lid worden van de bibliotheek',
    situation: 'U wilt lid worden van de bibliotheek in uw wijk. U vult een formulier in.',
    instructions: [FILL_IN],
    formTitle: 'Inschrijfformulier bibliotheek',
    sections: [
      fields('Persoonlijke gegevens', [naam, geboortedatum, adres, postcode, woonplaats, email]),
      choice('abonnement', 'Welk abonnement wilt u?', [
        'Basis: 5 boeken per maand',
        'Plus: zoveel boeken als u wilt',
        'Jeugd: tot 18 jaar',
      ]),
      question({
        id: 'boeken',
        question: 'Wat voor boeken leest u graag?',
        needs: [['boek', 'roman', 'verhal', 'strip', 'tijdschrift', 'krant', 'detective', 'makkelijk', 'lees']],
        expects: 'a kind of book',
        starter: 'Ik lees graag …',
        example: 'Ik lees graag makkelijke Nederlandse romans.',
      }),
      question({
        id: 'wanneer',
        question: 'Wanneer komt u meestal naar de bibliotheek?',
        needs: [TIME],
        expects: 'a day or a time',
        starter: 'Ik kom meestal op … naar de bibliotheek.',
        example: 'Ik kom meestal op zaterdagochtend naar de bibliotheek.',
      }),
    ],
  },
  {
    id: 'sportschool',
    title: 'Aanmelden bij de sportschool',
    situation: 'U wilt gaan sporten bij een sportschool in uw buurt. U vult een aanmeldformulier in.',
    instructions: [FILL_IN],
    formTitle: 'Aanmelding Sportschool Fit',
    sections: [
      fields('Persoonlijke gegevens', [naam, geboortedatum, telefoon, email]),
      choice('tijd', 'Wanneer wilt u sporten?', [
        'Ochtend: 7.00 - 12.00 uur',
        'Middag: 12.00 - 17.00 uur',
        'Avond: 17.00 - 22.00 uur',
      ]),
      question({
        id: 'sport',
        question: 'Welke sport wilt u doen?',
        needs: [['fitness', 'yoga', 'zwem', 'dans', 'sport', 'hardlo', 'fiets', 'boks', 'gewicht']],
        expects: 'a sport',
        starter: 'Ik wil graag … doen.',
        example: 'Ik wil graag fitness en yoga doen.',
      }),
      question({
        id: 'gezondheid',
        question: 'Heeft u last van uw gezondheid?',
        needs: [['ja', 'nee', 'geen', 'niet', 'last', 'pijn', 'rug', 'knie', 'astma', 'gezond', 'goed']],
        expects: 'yes or no, and what',
        starter: 'Nee, ik heb …',
        example: 'Nee, ik heb geen last van mijn gezondheid.',
      }),
      question({
        id: 'waarom',
        question: 'Waarom wilt u sporten?',
        needs: [[...REASON, 'gezond', 'fit', 'afvallen', 'sterk', 'stress', 'leuk', 'conditie']],
        expects: 'a reason',
        starter: 'Ik wil sporten, omdat …',
        example: 'Ik wil sporten, omdat ik fitter wil worden.',
      }),
    ],
  },
  {
    id: 'taalcursus',
    title: 'Inschrijven voor een taalcursus',
    situation: 'U wilt Nederlandse les volgen in het buurthuis. U vult een inschrijfformulier in.',
    instructions: [FILL_IN],
    formTitle: 'Inschrijving taalcursus Nederlands',
    sections: [
      fields('Persoonlijke gegevens', [naam, nationaliteit, adres, postcode, woonplaats, telefoon]),
      choice('niveau', 'Welk niveau heeft u nu?', ['A1', 'A2', 'B1']),
      question({
        id: 'waarom',
        question: 'Waarom wilt u Nederlands leren?',
        needs: [[...REASON, 'leren', 'spreken', 'praten', 'werk', 'woon', 'kinderen', 'buren']],
        expects: 'a reason',
        starter: 'Ik wil Nederlands leren, omdat …',
        example: 'Ik wil Nederlands leren, omdat ik in Nederland woon en werk.',
      }),
      question({
        id: 'hoelang',
        question: 'Hoe lang woont u al in Nederland?',
        needs: [['[0-9]', 'jaar', 'maand', 'week', 'sinds', 'een', 'twee', 'drie', 'vier', 'vijf', 'half']],
        expects: 'how long',
        starter: 'Ik woon al … in Nederland.',
        example: 'Ik woon al drie jaar in Nederland.',
      }),
      question({
        id: 'wanneer',
        question: 'Wanneer kunt u les volgen?',
        needs: [TIME],
        expects: 'a day or a time',
        starter: 'Ik kan op … les volgen.',
        example: 'Ik kan op maandagavond en woensdagavond les volgen.',
      }),
    ],
  },
  {
    id: 'reparatie',
    title: 'Reparatie melden',
    situation:
      'In uw huurhuis is iets kapot. Kijk naar de plaatjes. U meldt het bij de woningcorporatie. U vult een reparatieformulier in.',
    pictures: [
      { icons: '🚿', shows: 'a shower' },
      { icons: '💧💧', shows: 'water dripping' },
    ],
    instructions: [FILL_IN_PICTURES],
    formTitle: 'Reparatieverzoek',
    sections: [
      fields('Uw gegevens', [naam, adres, postcode, woonplaats, telefoon]),
      question({
        id: 'kapot',
        question: 'Wat is er kapot?',
        needs: [['douche', 'kraan', 'lek', 'water']],
        expects: 'what is broken: the thing in the pictures',
        starter: 'De douche in de badkamer …',
        example: 'De douche in de badkamer lekt.',
      }),
      question({
        id: 'sinds',
        question: 'Sinds wanneer is het kapot?',
        needs: [['sinds', 'gister', 'vorige', 'dag', 'week', 'maand', ...WEEKDAYS]],
        expects: 'since when',
        starter: 'De douche lekt sinds …',
        example: 'De douche lekt sinds vorige week.',
      }),
      question({
        id: 'thuis',
        question: 'Wanneer bent u thuis?',
        needs: [TIME],
        expects: 'a day or a time',
        starter: 'Ik ben … thuis.',
        example: 'Ik ben elke dag na 17.00 uur thuis.',
      }),
      choice('binnen', 'Mag de monteur binnenkomen als u niet thuis bent?', ['Ja', 'Nee']),
    ],
  },
  {
    id: 'buurtfeest',
    title: 'Aanmelden voor het buurtfeest',
    situation: 'In uw straat is een buurtfeest. U wilt meedoen. U vult een aanmeldformulier in.',
    instructions: [FILL_IN],
    formTitle: 'Aanmelding buurtfeest',
    sections: [
      fields('Uw gegevens', [naam, adres, telefoon, email]),
      choice('personen', 'Met hoeveel personen komt u?', ['1 persoon', '2 personen', '3 personen', '4 of meer personen']),
      question({
        id: 'buffet',
        question: 'Wat neemt u mee voor het buffet?',
        needs: [FOOD],
        expects: 'something to eat',
        starter: 'Ik neem … mee.',
        example: 'Ik neem een grote salade en een appeltaart mee.',
      }),
      question({
        id: 'helpen',
        question: 'Wilt u helpen op het feest? Wat wilt u doen?',
        needs: [['help', 'ja', 'nee', 'opruim', 'klaarzet', 'muziek', 'koken', 'tafel', 'stoel', 'afwas', 'kinderen']],
        expects: 'yes or no, and how you would help',
        starter: 'Ja, ik wil graag helpen met …',
        example: 'Ja, ik wil graag helpen met de tafels en de stoelen.',
      }),
    ],
  },
  {
    id: 'gevonden',
    title: 'Jas vergeten',
    situation: 'U bent in de trein uw jas vergeten. Kijk naar het plaatje. U vult een formulier in.',
    pictures: [{ icons: '🧥', shows: 'a long coat with a hood' }],
    instructions: [FILL_IN_PICTURES],
    formTitle: 'Formulier verloren voorwerpen',
    sections: [
      question({
        id: 'wat',
        question: 'Wat bent u kwijt?',
        needs: [['jas', 'winterjas', 'regenjas']],
        expects: 'the thing in the picture',
        starter: 'Ik ben mijn … kwijt.',
        example: 'Ik ben mijn winterjas kwijt.',
      }),
      question({
        id: 'eruit',
        question: 'Hoe ziet het eruit?',
        needs: [[...COLOURS, 'lang', 'kort', 'groot', 'klein', 'capuchon', 'zakken', 'warm', 'dik', 'dun', 'nieuw', 'oud']],
        expects: 'a colour, a size or another detail',
        starter: 'Mijn jas is …',
        example: 'Mijn jas is zwart en lang. Hij heeft een capuchon.',
      }),
      question({
        id: 'waarwanneer',
        question: 'Waar en wanneer bent u het kwijtgeraakt?',
        needs: [['trein', 'station', 'perron'], TIME],
        expects: 'where and when',
        starter: 'Ik ben mijn jas … in de trein …',
        example: 'Ik ben mijn jas gisteren om 17.00 uur in de trein naar Utrecht vergeten.',
      }),
      fields('Uw gegevens', [naam, telefoon, email, datum]),
    ],
  },
  {
    id: 'zwemles',
    title: 'Zwemles voor uw kind',
    situation: 'Uw kind moet leren zwemmen. U meldt uw kind aan bij het zwembad. U vult een formulier in.',
    instructions: [FILL_IN],
    formTitle: 'Aanmelding zwemles',
    sections: [
      fields('Gegevens', [
        { id: 'ouder', label: 'Naam ouder', gloss: "parent's name", kind: 'fullname' },
        { id: 'kind', label: 'Naam kind', gloss: "child's name", kind: 'fullname' },
        { id: 'geboortedatum', label: 'Geboortedatum kind', gloss: "child's date of birth", kind: 'birthdate' },
        telefoon,
        email,
      ]),
      choice('dag', 'Welke dag past het best?', ['Woensdagmiddag', 'Zaterdagochtend', 'Zondagochtend']),
      question({
        id: 'kan',
        question: 'Kan uw kind al een beetje zwemmen?',
        needs: [['ja', 'nee', 'niet', 'een beetje', 'al', 'goed']],
        expects: 'yes or no',
        starter: 'Nee, mijn … kan nog niet …',
        example: 'Nee, mijn dochter kan nog niet zwemmen.',
      }),
      question({
        id: 'waarom',
        question: 'Waarom wilt u dat uw kind zwemles krijgt?',
        needs: [[...REASON, 'veilig', 'water', 'belangrijk', 'diploma', 'leren']],
        expects: 'a reason',
        starter: 'Ik wil dat mijn kind leert zwemmen, omdat …',
        example: 'Ik wil dat mijn kind leert zwemmen, omdat het in Nederland belangrijk is.',
      }),
    ],
  },
  {
    id: 'vrijwilliger',
    title: 'Vrijwilligerswerk',
    situation: 'U wilt vrijwilligerswerk doen in uw buurt. U vult een formulier in.',
    instructions: [FILL_IN],
    formTitle: 'Aanmelding vrijwilligers',
    sections: [
      fields('Persoonlijke gegevens', [naam, geboortedatum, woonplaats, telefoon, email]),
      choice('waar', 'Waar wilt u helpen?', ['In de bibliotheek', 'In het verzorgingshuis', 'Bij de voedselbank']),
      question({
        id: 'waarom',
        question: 'Waarom wilt u vrijwilligerswerk doen?',
        needs: [[...REASON, 'help', 'mensen', 'leren', 'contact', 'leuk', 'buurt']],
        expects: 'a reason',
        starter: 'Ik wil vrijwilligerswerk doen, omdat …',
        example: 'Ik wil vrijwilligerswerk doen, omdat ik graag andere mensen help.',
      }),
      question({
        id: 'talen',
        question: 'Welke talen spreekt u?',
        needs: [['nederlands', 'engels', 'arabisch', 'turks', 'hindi', 'telugu', 'spaans', 'frans', 'duits', 'pools', 'tamil', 'urdu', 'taal', 'talen']],
        expects: 'a language',
        starter: 'Ik spreek …',
        example: 'Ik spreek Engels, Hindi en een beetje Nederlands.',
      }),
      question({
        id: 'uren',
        question: 'Hoeveel uur per week kunt u helpen?',
        needs: [['[0-9]', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'acht', 'tien', 'uur']],
        expects: 'a number of hours',
        starter: 'Ik kan ongeveer … uur per week helpen.',
        example: 'Ik kan ongeveer vier uur per week helpen.',
      }),
    ],
  },
  {
    id: 'huisarts',
    title: 'Inschrijven bij de huisarts',
    situation: 'U bent verhuisd. U wilt zich inschrijven bij een nieuwe huisarts. U vult een formulier in.',
    instructions: [FILL_IN],
    formTitle: 'Inschrijfformulier huisartsenpraktijk',
    sections: [
      fields('Persoonlijke gegevens', [naam, geboortedatum, bsn, adres, postcode, woonplaats, telefoon]),
      choice('geslacht', 'Geslacht', ['Man', 'Vrouw', 'X']),
      question({
        id: 'medicijnen',
        question: 'Gebruikt u medicijnen? Zo ja, welke?',
        needs: [['ja', 'nee', 'geen', 'niet', 'medicijn', 'pil', 'tablet', 'paracetamol', 'insuline']],
        expects: 'yes or no, and which',
        starter: 'Nee, ik gebruik …',
        example: 'Nee, ik gebruik geen medicijnen.',
      }),
      question({
        id: 'waarom',
        question: 'Waarom wilt u zich bij deze huisarts inschrijven?',
        needs: [[...REASON, 'dichtbij', 'woon', 'buurt', 'nieuw']],
        expects: 'a reason',
        starter: 'Ik ben verhuisd en …',
        example: 'Ik ben net verhuisd en ik woon nu dichtbij deze praktijk.',
      }),
      question({
        id: 'allergie',
        question: 'Heeft u een allergie?',
        needs: [['ja', 'nee', 'geen', 'niet', 'allergi', 'noten', 'pinda', 'gras', 'penicilline', 'katten']],
        expects: 'yes or no, and what',
        starter: 'Ja, ik ben allergisch voor …',
        example: 'Ja, ik ben allergisch voor noten.',
      }),
    ],
  },
]

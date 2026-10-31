import { NEW_DATE, REASON, SORRY, WEEKDAYS, WHY_WRITING } from '../taken/keywords'
import type { TextTask } from '../taken/types'

/**
 * Formal e-mails, to someone you say u to: a teacher, a manager, a landlord.
 * The exam prints "Beste meneer/mevrouw + surname," and "Vriendelijke groet,"
 * around the space; the candidate writes the middle and signs it.
 *
 * The three marked `exam` follow the DUO oefenexamens (situation and bullets),
 * reworded and with other names, since those papers are not to be shared.
 */

const INSTRUCTIONS = ['Schrijf de e-mail.', 'Schrijf in hele zinnen.']

function mail(to: string, subject: string, greeting: string) {
  return { kind: 'mail' as const, to, subject, greeting, closing: 'Vriendelijke groet,' }
}

export const tasks: TextTask[] = [
  {
    id: 'verzetten',
    title: 'Afspraak verzetten',
    exam: 1,
    situation:
      'U volgt een opleiding. Morgen heeft u een afspraak met uw docent, maar u kunt niet komen. U wilt een nieuwe afspraak maken. U stuurt uw docent een e-mail.',
    bullets: [
      'Schrijf dat u de afspraak wilt verzetten.',
      'Schrijf waarom. Bedenk zelf een reden.',
      'Stel een nieuwe datum voor.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('a.visser@mail.nl', 'Afspraak verzetten', 'Beste mevrouw Visser,'),
    register: 'u',
    points: [
      {
        id: 'verzetten',
        label: 'Say that you want to move the appointment',
        keywords: ['verzet', 'andere afspraak', 'nieuwe afspraak', 'afzeggen', 'kan .*niet (komen|naar)', 'niet komen'],
        starter: 'Ik wil graag onze afspraak van morgen …',
        example: 'Ik wil graag onze afspraak van morgen verzetten.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: REASON,
        starter: 'Ik kan morgen niet komen, want …',
        example: 'Ik kan morgen niet komen, want ik moet met mijn zoon naar de dokter.',
      },
      {
        id: 'datum',
        label: 'Suggest a new date',
        keywords: NEW_DATE,
        starter: 'Kunnen we op … afspreken?',
        example: 'Kunnen we op donderdag 15 oktober om 10.00 uur afspreken?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil graag onze afspraak van morgen verzetten. Ik kan morgen niet komen, want ik moet met mijn zoon naar de dokter. Kunnen we op donderdag 15 oktober om 10.00 uur afspreken? Ik hoor graag of dat kan.',
  },
  {
    id: 'vrijedag',
    title: 'Vrije dag vragen',
    exam: 2,
    situation: 'U wilt volgende week een dag vrij hebben. U stuurt een e-mail aan uw chef, meneer de Boer.',
    bullets: [
      'Schrijf welke dag u vrij wilt hebben. Bedenk zelf een dag en datum.',
      'Schrijf waarom u vrij wilt hebben. Bedenk zelf een reden.',
      'Schrijf welke collega uw werk kan overnemen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('m.deboer@werk.nl', 'Vrije dag vragen', 'Beste meneer de Boer,'),
    register: 'u',
    points: [
      {
        id: 'dag',
        label: 'Say which day you want off',
        keywords: NEW_DATE,
        starter: 'Ik wil graag op … vrij hebben.',
        example: 'Ik wil graag op vrijdag 16 oktober vrij hebben.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: REASON,
        starter: 'Ik wil die dag vrij, want …',
        example: 'Mijn zus gaat die dag trouwen en ik wil graag naar de bruiloft.',
      },
      {
        id: 'collega',
        label: 'Say which colleague can take over your work',
        keywords: ['collega', 'overnemen', 'neemt .*over', 'vervang', 'werkt .*voor mij', 'kan .*voor mij'],
        starter: 'Mijn collega … kan mijn werk overnemen.',
        example: 'Mijn collega Sanne kan mijn werk die dag overnemen.',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil graag op vrijdag 16 oktober vrij hebben. Mijn zus gaat die dag trouwen en ik wil graag naar de bruiloft. Mijn collega Sanne kan mijn werk die dag overnemen. Is dat goed voor u?',
  },
  {
    id: 'toets',
    title: 'De toets morgen',
    exam: 3,
    situation:
      'U volgt een computercursus. Morgen is er een toets, maar u kunt niet naar de les komen. U stuurt uw docent een e-mail.',
    bullets: [
      'Schrijf waarom u de e-mail stuurt.',
      'Schrijf waarom u niet kunt komen. Bedenk het zelf.',
      'Bied uw excuses aan.',
      'Vraag wanneer u de toets kunt maken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('p.smit@mail.nl', 'De toets morgen', 'Beste meneer Smit,'),
    register: 'u',
    points: [
      {
        id: 'waarom',
        label: 'Say why you are writing',
        keywords: [...WHY_WRITING, 'toets'],
        starter: 'Ik stuur u deze e-mail, omdat …',
        example: 'Ik stuur u deze e-mail, omdat ik morgen niet bij de toets kan zijn.',
      },
      {
        id: 'reden',
        label: "Give the reason you can't come",
        keywords: REASON,
        starter: 'Ik kan niet komen, want …',
        example: 'Ik kan niet komen, want ik heb hoge koorts.',
      },
      {
        id: 'excuses',
        label: 'Apologise',
        keywords: SORRY,
        starter: 'Het spijt me …',
        example: 'Het spijt me heel erg.',
      },
      {
        id: 'wanneer',
        label: 'Ask when you can take the test',
        keywords: ['wanneer', 'welke dag', 'andere dag', 'ander moment', 'inhalen', 'later maken'],
        starter: 'Wanneer kan ik …?',
        example: 'Wanneer kan ik de toets maken?',
      },
    ],
    minSentences: 4,
    model:
      'Ik stuur u deze e-mail, omdat ik morgen niet bij de toets kan zijn. Ik kan niet komen, want ik heb hoge koorts. Het spijt me heel erg. Wanneer kan ik de toets maken?',
  },
  {
    id: 'huisarts',
    title: 'Afspraak bij de huisarts',
    situation:
      'U heeft morgen om 9.00 uur een afspraak bij de huisarts. U kunt niet komen. U stuurt een e-mail aan de assistente, mevrouw Bakker.',
    bullets: [
      'Schrijf dat u morgen niet kunt komen.',
      'Schrijf waarom niet. Bedenk zelf een reden.',
      'Vraag om een nieuwe afspraak.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('assistente@huisartsdewit.nl', 'Afspraak morgen', 'Beste mevrouw Bakker,'),
    register: 'u',
    points: [
      {
        id: 'niet',
        label: "Say that you can't come tomorrow",
        keywords: ['niet (komen|kan)', 'kan .*niet', 'afzeggen'],
        starter: 'Ik heb morgen een afspraak, maar …',
        example: 'Ik heb morgen om 9.00 uur een afspraak, maar ik kan niet komen.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: [...REASON, 'werk', 'collega'],
        starter: 'Ik kan niet komen, want …',
        example: 'Ik moet morgen werken, want een collega is ziek.',
      },
      {
        id: 'nieuw',
        label: 'Ask for a new appointment',
        keywords: ['nieuwe afspraak', 'andere afspraak', 'andere dag', 'ander moment', 'wanneer', ...WEEKDAYS, 'volgende week'],
        starter: 'Kan ik een nieuwe afspraak …?',
        example: 'Kan ik een nieuwe afspraak maken?',
      },
    ],
    minSentences: 3,
    model:
      'Ik heb morgen om 9.00 uur een afspraak bij de huisarts, maar ik kan niet komen. Ik moet morgen werken, want een collega is ziek. Kan ik een nieuwe afspraak maken? Volgende week kan ik op dinsdag of woensdag.',
  },
  {
    id: 'ziekmelden',
    title: 'Ziek melden',
    situation:
      'U bent ziek en u kunt vandaag niet werken. U stuurt een e-mail aan uw leidinggevende, mevrouw Jansen.',
    bullets: [
      'Schrijf dat u vandaag niet kunt werken.',
      'Schrijf wat u heeft.',
      'Schrijf wanneer u denkt dat u weer komt werken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('l.jansen@werk.nl', 'Ziekmelding', 'Beste mevrouw Jansen,'),
    register: 'u',
    points: [
      {
        id: 'niet',
        label: "Say that you can't work today",
        keywords: ['niet (werken|komen)', 'kan .*niet'],
        starter: 'Ik kan vandaag …',
        example: 'Ik kan vandaag helaas niet werken.',
      },
      {
        id: 'wat',
        label: 'Say what is wrong with you',
        keywords: ['ziek', 'griep', 'koorts', 'pijn', 'verkouden', 'misselijk', 'hoest', 'migraine'],
        starter: 'Ik ben ziek: ik heb …',
        example: 'Ik heb griep en hoge koorts.',
      },
      {
        id: 'terug',
        label: 'Say when you think you will be back',
        keywords: ['weer', 'terug', 'beter', 'overmorgen', ...NEW_DATE],
        starter: 'Ik denk dat ik op … weer kan werken.',
        example: 'Ik denk dat ik op donderdag weer kan werken.',
      },
    ],
    minSentences: 3,
    model:
      'Ik kan vandaag helaas niet werken. Ik ben ziek. Ik heb griep en hoge koorts. Ik denk dat ik op donderdag weer kan werken. Morgen bel ik u om te zeggen hoe het gaat.',
  },
  {
    id: 'school',
    title: 'Mijn dochter is ziek',
    situation:
      'Uw dochter Noor zit in groep 4. Zij is ziek en kan vandaag niet naar school. U stuurt een e-mail aan de juf, mevrouw Peters.',
    bullets: [
      'Schrijf dat Noor vandaag niet naar school komt.',
      'Schrijf wat zij heeft.',
      'Vraag of zij het huiswerk kan krijgen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('m.peters@basisschool.nl', 'Noor is ziek', 'Beste mevrouw Peters,'),
    register: 'u',
    points: [
      {
        id: 'niet',
        label: "Say that Noor won't come to school today",
        keywords: ['niet naar school', 'niet .*school', 'thuis', 'komt .*niet', 'kan .*niet'],
        starter: 'Mijn dochter Noor komt vandaag …',
        example: 'Mijn dochter Noor komt vandaag niet naar school.',
      },
      {
        id: 'wat',
        label: 'Say what is wrong with her',
        keywords: ['ziek', 'griep', 'koorts', 'pijn', 'verkouden', 'misselijk', 'hoest', 'waterpokken'],
        starter: 'Zij is ziek: zij heeft …',
        example: 'Zij heeft koorts en buikpijn.',
      },
      {
        id: 'huiswerk',
        label: 'Ask whether she can get her homework',
        keywords: ['huiswerk', 'opdracht', 'lesstof', 'werkblad'],
        starter: 'Kan zij het huiswerk …?',
        example: 'Kan zij het huiswerk van deze week krijgen?',
      },
    ],
    minSentences: 3,
    model:
      'Mijn dochter Noor komt vandaag niet naar school. Zij is ziek. Zij heeft koorts en buikpijn. Kan zij het huiswerk van deze week krijgen? Dan kan zij thuis een beetje werken.',
  },
  {
    id: 'verwarming',
    title: 'Verwarming kapot',
    situation:
      'De verwarming in uw huurhuis is kapot. Het is koud in huis. U stuurt een e-mail aan de verhuurder, meneer Koster.',
    bullets: [
      'Schrijf wat er kapot is.',
      'Schrijf sinds wanneer het kapot is.',
      'Vraag of er iemand kan komen om het te maken.',
      'Schrijf wanneer u thuis bent.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('verhuur@koster.nl', 'Verwarming kapot', 'Beste meneer Koster,'),
    register: 'u',
    points: [
      {
        id: 'kapot',
        label: 'Say what is broken',
        keywords: ['verwarming', 'kapot', 'stuk', 'werkt niet', 'radiator'],
        starter: 'De verwarming in mijn huis …',
        example: 'De verwarming in mijn huis is kapot.',
      },
      {
        id: 'sinds',
        label: 'Say since when',
        keywords: ['sinds', 'gisteren', 'vorige', 'al .*dag', 'dagen', ...WEEKDAYS],
        starter: 'Sinds … is de verwarming kapot.',
        example: 'Sinds zaterdag wordt het niet meer warm in huis.',
      },
      {
        id: 'monteur',
        label: 'Ask for someone to come and fix it',
        keywords: ['monteur', 'iemand', 'repar', 'maken', 'langs'],
        starter: 'Kunt u een monteur …?',
        example: 'Kunt u een monteur sturen?',
      },
      {
        id: 'thuis',
        label: 'Say when you are at home',
        keywords: ['thuis'],
        starter: 'Ik ben … thuis.',
        example: 'Ik ben elke dag na 17.00 uur thuis.',
      },
    ],
    minSentences: 4,
    model:
      'De verwarming in mijn huis is kapot. Sinds zaterdag wordt het niet meer warm in huis. Kunt u een monteur sturen om de verwarming te maken? Ik ben elke dag na 17.00 uur thuis.',
  },
  {
    id: 'bestelling',
    title: 'Bestelling kapot',
    situation:
      'U heeft in een webwinkel een lamp gekocht. Vandaag krijgt u het pakket, maar de lamp is kapot. U stuurt een e-mail aan de klantenservice.',
    bullets: [
      'Schrijf wat u heeft gekocht.',
      'Schrijf wat het probleem is.',
      'Schrijf wat u wilt: een nieuwe lamp of uw geld terug.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('klantenservice@lampenwinkel.nl', 'Lamp kapot', 'Beste meneer, mevrouw,'),
    register: 'u',
    points: [
      {
        id: 'gekocht',
        label: 'Say what you bought',
        keywords: ['lamp', 'gekocht', 'besteld', 'bestelling'],
        starter: 'Vorige week heb ik bij u …',
        example: 'Vorige week heb ik bij u een lamp besteld.',
      },
      {
        id: 'probleem',
        label: 'Say what the problem is',
        keywords: ['kapot', 'stuk', 'gebroken', 'werkt niet', 'beschadigd'],
        starter: 'Vandaag heb ik het pakket gekregen, maar …',
        example: 'Vandaag heb ik het pakket gekregen, maar de lamp is kapot.',
      },
      {
        id: 'wens',
        label: 'Say what you want: a new lamp or your money back',
        keywords: ['nieuwe', 'geld terug', 'terugbetal', 'ruilen', 'vervang'],
        starter: 'Ik wil graag …',
        example: 'Ik wil graag een nieuwe lamp.',
      },
    ],
    minSentences: 3,
    model:
      'Vorige week heb ik bij u een lamp besteld. Vandaag heb ik het pakket gekregen, maar de lamp is kapot. Het glas is gebroken. Ik wil graag een nieuwe lamp. Kunt u mij laten weten wat ik moet doen?',
  },
  {
    id: 'sportschool',
    title: 'Lidmaatschap opzeggen',
    situation: 'U bent lid van een sportschool. U wilt stoppen. U stuurt een e-mail aan de manager, mevrouw de Wit.',
    bullets: [
      'Schrijf dat u wilt stoppen.',
      'Schrijf waarom. Bedenk zelf een reden.',
      'Vraag vanaf wanneer u niet meer hoeft te betalen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('info@sportschoolfit.nl', 'Lidmaatschap opzeggen', 'Beste mevrouw de Wit,'),
    register: 'u',
    points: [
      {
        id: 'stoppen',
        label: 'Say that you want to stop',
        keywords: ['stop', 'opzeg', 'lidmaatschap', 'niet meer'],
        starter: 'Ik wil mijn lidmaatschap …',
        example: 'Ik wil mijn lidmaatschap van de sportschool opzeggen.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: [...REASON, 'duur', 'geld', 'tijd', 'druk', 'blessure', 'ver weg'],
        starter: 'Ik stop, want …',
        example: 'Ik ga volgende maand verhuizen naar Rotterdam.',
      },
      {
        id: 'betalen',
        label: 'Ask from when you no longer have to pay',
        keywords: ['betal', 'vanaf wanneer', 'wanneer'],
        starter: 'Vanaf wanneer …?',
        example: 'Vanaf wanneer hoef ik niet meer te betalen?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil mijn lidmaatschap van de sportschool opzeggen. Ik ga volgende maand verhuizen naar Rotterdam. Dan woon ik te ver weg. Vanaf wanneer hoef ik niet meer te betalen?',
  },
  {
    id: 'cursus',
    title: 'Informatie over een cursus',
    situation:
      'U wilt een cursus Engels volgen in het buurthuis. U wilt meer informatie. U stuurt een e-mail aan meneer Dekker van het buurthuis.',
    bullets: [
      'Schrijf welke cursus u wilt volgen.',
      'Vraag wanneer de cursus begint.',
      'Vraag hoeveel de cursus kost.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('j.dekker@buurthuis.nl', 'Cursus Engels', 'Beste meneer Dekker,'),
    register: 'u',
    points: [
      {
        id: 'cursus',
        label: 'Say which course you want to take',
        keywords: ['engels', 'cursus'],
        starter: 'Ik wil graag de cursus …',
        example: 'Ik wil graag de cursus Engels volgen.',
      },
      {
        id: 'begin',
        label: 'Ask when the course starts',
        keywords: ['wanneer', 'begin', 'start'],
        starter: 'Wanneer …?',
        example: 'Wanneer begint de cursus?',
      },
      {
        id: 'kosten',
        label: 'Ask what the course costs',
        keywords: ['kost', 'prijs', 'hoeveel', 'betal', 'euro'],
        starter: 'Hoeveel …?',
        example: 'Hoeveel kost de cursus?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil graag de cursus Engels in het buurthuis volgen. Wanneer begint de cursus? En hoeveel kost de cursus? Ik hoor graag van u.',
  },
  {
    id: 'lawaai',
    title: 'Lawaai van de buren',
    situation:
      'Uw bovenburen maken elke nacht veel lawaai. U stuurt een e-mail aan de woningcorporatie, mevrouw Hendriks.',
    bullets: [
      'Schrijf wat het probleem is.',
      'Schrijf hoe lang het probleem er al is.',
      'Vraag of zij u kan helpen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('s.hendriks@woonstad.nl', 'Lawaai van de buren', 'Beste mevrouw Hendriks,'),
    register: 'u',
    points: [
      {
        id: 'probleem',
        label: 'Say what the problem is',
        keywords: ['lawaai', 'herrie', 'geluid', 'muziek', 'overlast'],
        starter: 'Mijn bovenburen maken …',
        example: 'Mijn bovenburen maken elke nacht veel lawaai.',
      },
      {
        id: 'hoelang',
        label: 'Say how long it has been going on',
        keywords: ['sinds', 'al .*(dag|week|weken|maand)', 'weken', 'maanden'],
        starter: 'Dat probleem is er al …',
        example: 'Dat probleem is er al drie weken.',
      },
      {
        id: 'help',
        label: 'Ask whether she can help',
        keywords: ['help', 'oplossen', 'iets doen', 'praten'],
        starter: 'Kunt u mij …?',
        example: 'Kunt u mij helpen?',
      },
    ],
    minSentences: 3,
    model:
      'Mijn bovenburen maken elke nacht veel lawaai. Ze draaien harde muziek tot 2.00 uur. Dat probleem is er al drie weken. Ik kan daardoor niet goed slapen. Kunt u mij helpen?',
  },
  {
    id: 'ouderavond',
    title: 'Ouderavond',
    situation:
      'Volgende week is er een ouderavond op de school van uw zoon. U kunt niet komen. U stuurt een e-mail aan de leraar, meneer Mulder.',
    bullets: [
      'Schrijf dat u niet naar de ouderavond kunt komen.',
      'Schrijf waarom niet. Bedenk zelf een reden.',
      'Vraag om een gesprek op een andere dag.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('r.mulder@basisschool.nl', 'Ouderavond', 'Beste meneer Mulder,'),
    register: 'u',
    points: [
      {
        id: 'niet',
        label: "Say that you can't come to the parents' evening",
        keywords: ['niet (komen|kan)', 'kan .*niet'],
        starter: 'Ik kan volgende week niet …',
        example: 'Ik kan volgende week niet naar de ouderavond komen.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: [...REASON, 'werk', 'dienst'],
        starter: 'Ik moet die avond …',
        example: 'Ik moet die avond werken, want ik heb een avonddienst.',
      },
      {
        id: 'gesprek',
        label: 'Ask for a meeting on another day',
        keywords: ['gesprek', 'andere dag', 'afspraak', 'praten', ...WEEKDAYS],
        starter: 'Kunnen we op een andere dag …?',
        example: 'Kunnen we op een andere dag een gesprek hebben?',
      },
    ],
    minSentences: 3,
    model:
      'Ik kan volgende week niet naar de ouderavond komen. Ik moet die avond werken, want ik heb een avonddienst. Kunnen we op een andere dag een gesprek hebben? Ik kan op maandag of woensdag na 16.00 uur.',
  },
  {
    id: 'telaat',
    title: 'Te laat op het werk',
    situation: 'Vandaag rijden er geen treinen. U komt te laat op uw werk. U stuurt een e-mail aan uw chef, mevrouw Jansen.',
    bullets: ['Schrijf dat u te laat komt.', 'Schrijf waarom.', 'Schrijf hoe laat u er bent.'],
    instructions: INSTRUCTIONS,
    frame: mail('l.jansen@werk.nl', 'Te laat', 'Beste mevrouw Jansen,'),
    register: 'u',
    points: [
      {
        id: 'telaat',
        label: 'Say that you will be late',
        keywords: ['te laat', 'later', 'laat'],
        starter: 'Ik kom vandaag …',
        example: 'Ik kom vandaag te laat op mijn werk.',
      },
      {
        id: 'waarom',
        label: 'Say why',
        keywords: [...REASON, 'trein', 'bus', 'staking', 'file', 'storing', 'vertraging'],
        starter: 'Er rijden geen treinen, want …',
        example: 'Er rijden vandaag geen treinen door een storing.',
      },
      {
        id: 'tijd',
        label: 'Say what time you will be there',
        keywords: ['[0-9]', 'uur', 'half', 'kwart'],
        starter: 'Ik ben om … op kantoor.',
        example: 'Ik ben om 10.30 uur op kantoor.',
      },
    ],
    minSentences: 3,
    model:
      'Ik kom vandaag te laat op mijn werk. Er rijden vandaag geen treinen door een storing. Ik neem nu de bus. Ik ben om 10.30 uur op kantoor. Het spijt me.',
  },
  {
    id: 'vacature',
    title: 'Reageren op een vacature',
    situation:
      'De supermarkt in uw buurt zoekt een vakkenvuller. U wilt daar graag werken. U stuurt een e-mail aan meneer Visser van de supermarkt.',
    bullets: [
      'Schrijf waarom u de e-mail stuurt.',
      'Schrijf welke ervaring u heeft. Bedenk het zelf.',
      'Schrijf wanneer u kunt werken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('j.visser@supermarkt.nl', 'Vacature vakkenvuller', 'Beste meneer Visser,'),
    register: 'u',
    points: [
      {
        id: 'waarom',
        label: 'Say why you are writing',
        keywords: [...WHY_WRITING, 'vacature', 'solliciteer', 'reageer'],
        starter: 'Ik reageer op …',
        example: 'Ik reageer op de vacature voor vakkenvuller.',
      },
      {
        id: 'ervaring',
        label: 'Say what experience you have',
        keywords: ['ervaring', 'gewerkt', 'werkte', 'jaar', 'winkel', 'supermarkt', 'magazijn'],
        starter: 'Ik heb … in een … gewerkt.',
        example: 'Ik heb twee jaar in een winkel gewerkt.',
      },
      {
        id: 'wanneer',
        label: 'Say when you can work',
        keywords: [...NEW_DATE, 'avond', 'ochtend', 'middag', 'altijd', 'dagen'],
        starter: 'Ik kan op … werken.',
        example: 'Ik kan op maandag, woensdag en zaterdag werken.',
      },
    ],
    minSentences: 3,
    model:
      'Ik reageer op de vacature voor vakkenvuller. Ik heb twee jaar in een winkel in India gewerkt. Ik werk graag en ik ben altijd op tijd. Ik kan op maandag, woensdag en zaterdag werken. Ik hoor graag van u.',
  },
  {
    id: 'verlof',
    title: 'Vrij van school',
    situation:
      'Uw familie in India viert een bruiloft. U wilt met uw zoon Sem naar de bruiloft. Dan mist hij twee dagen school. U stuurt een e-mail aan mevrouw Peters, de directeur van zijn school.',
    bullets: [
      'Schrijf waarom u de e-mail stuurt.',
      'Schrijf welke dagen Sem niet op school is.',
      'Vraag of dat mag.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('m.peters@basisschool.nl', 'Verlof voor Sem', 'Beste mevrouw Peters,'),
    register: 'u',
    points: [
      {
        id: 'waarom',
        label: 'Say why you are writing',
        keywords: [...WHY_WRITING, 'bruiloft', 'verlof', 'vrij'],
        starter: 'Ik stuur u deze e-mail, omdat …',
        example: 'Ik stuur u deze e-mail, omdat mijn familie een bruiloft viert.',
      },
      {
        id: 'dagen',
        label: 'Say which days Sem is not at school',
        keywords: NEW_DATE,
        starter: 'Sem is op … niet op school.',
        example: 'Sem is op donderdag 26 en vrijdag 27 november niet op school.',
      },
      {
        id: 'mag',
        label: 'Ask whether that is allowed',
        keywords: ['mag', 'goed', 'toestemming', 'kan dat', 'akkoord'],
        starter: 'Mag Sem …?',
        example: 'Mag Sem die twee dagen vrij hebben?',
      },
    ],
    minSentences: 3,
    model:
      'Ik stuur u deze e-mail, omdat mijn familie in India een bruiloft viert. Ik wil graag met Sem naar de bruiloft. Sem is op donderdag 26 en vrijdag 27 november niet op school. Mag hij die twee dagen vrij hebben? Hij neemt zijn huiswerk mee.',
  },
  {
    id: 'huur',
    title: 'Huur opzeggen',
    situation:
      'U huurt een appartement van meneer Koster. U gaat verhuizen naar een andere stad. U stuurt meneer Koster een e-mail.',
    bullets: [
      'Schrijf dat u de huur wilt opzeggen.',
      'Schrijf waarom u verhuist.',
      'Schrijf wanneer u de sleutels teruggeeft.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('verhuur@koster.nl', 'Huur opzeggen', 'Beste meneer Koster,'),
    register: 'u',
    points: [
      {
        id: 'opzeggen',
        label: 'Say that you want to end the rent',
        keywords: ['opzeg', 'zeg .*op', 'stop', 'huur'],
        starter: 'Ik wil de huur van …',
        example: 'Ik wil de huur van mijn appartement opzeggen.',
      },
      {
        id: 'waarom',
        label: 'Say why you are moving',
        keywords: [...REASON, 'werk', 'baan', 'groter', 'kleiner', 'samenwonen'],
        starter: 'Ik verhuis naar …, want …',
        example: 'Ik verhuis naar Rotterdam, want ik heb daar een nieuwe baan.',
      },
      {
        id: 'sleutels',
        label: 'Say when you give the keys back',
        keywords: ['sleutel', 'terug', ...NEW_DATE],
        starter: 'Ik geef de sleutels op … terug.',
        example: 'Ik geef de sleutels op maandag 30 november terug.',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil de huur van mijn appartement opzeggen. Ik verhuis naar Rotterdam, want ik heb daar een nieuwe baan. Ik geef de sleutels op maandag 30 november terug. Wilt u laten weten hoe laat dat kan?',
  },
  {
    id: 'bedankt',
    title: 'Bedankt voor de cursus',
    situation: 'U heeft een cursus Nederlands gevolgd bij meneer Dekker. De cursus is klaar. U stuurt hem een e-mail.',
    bullets: [
      'Bedank meneer Dekker voor de cursus.',
      'Schrijf wat u heeft geleerd.',
      'Schrijf wat u nu gaat doen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('j.dekker@buurthuis.nl', 'Bedankt', 'Beste meneer Dekker,'),
    register: 'u',
    points: [
      {
        id: 'bedanken',
        label: 'Thank him',
        keywords: ['bedank', 'dank'],
        starter: 'Hartelijk bedankt voor …',
        example: 'Hartelijk bedankt voor de fijne cursus.',
      },
      {
        id: 'geleerd',
        label: 'Say what you learned',
        keywords: ['geleerd', 'leer', 'kan nu', 'beter', 'woorden', 'spreken', 'schrijven', 'lezen', 'luisteren'],
        starter: 'Ik heb veel … geleerd.',
        example: 'Ik heb veel nieuwe woorden geleerd.',
      },
      {
        id: 'nu',
        label: 'Say what you will do now',
        keywords: ['ga', 'examen', 'volgende', 'oefen', 'wil'],
        starter: 'Nu ga ik …',
        example: 'Nu ga ik oefenen voor mijn examen.',
      },
    ],
    minSentences: 3,
    model:
      'Hartelijk bedankt voor de fijne cursus. Ik heb veel nieuwe woorden geleerd. Ook kan ik nu beter een e-mail schrijven. Nu ga ik oefenen voor mijn examen in december.',
  },
  {
    id: 'uren',
    title: 'Minder uren werken',
    situation: 'U werkt vijf dagen per week. U wilt vanaf januari vier dagen werken. U stuurt een e-mail aan uw chef, meneer de Boer.',
    bullets: [
      'Schrijf wat u wilt veranderen.',
      'Schrijf waarom. Bedenk zelf een reden.',
      'Vraag of u een afspraak kunt maken om erover te praten.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('m.deboer@werk.nl', 'Minder werken', 'Beste meneer de Boer,'),
    register: 'u',
    points: [
      {
        id: 'veranderen',
        label: 'Say what you want to change',
        keywords: ['vier dagen', 'minder', 'uren', 'dagen'],
        starter: 'Ik wil vanaf … werken.',
        example: 'Ik wil vanaf januari vier dagen per week werken.',
      },
      {
        id: 'waarom',
        label: 'Give a reason',
        keywords: [...REASON, 'kinderen', 'kind', 'cursus', 'studie', 'opleiding', 'zorg', 'rust'],
        starter: 'Ik ga op … een … volgen.',
        example: 'Ik ga op woensdag een opleiding volgen.',
      },
      {
        id: 'afspraak',
        label: 'Ask for a meeting to talk about it',
        keywords: ['afspraak', 'praten', 'gesprek', 'bespreken'],
        starter: 'Kunnen we een afspraak maken …?',
        example: 'Kunnen we een afspraak maken om erover te praten?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil vanaf januari vier dagen per week werken. Ik ga op woensdag een opleiding volgen. Dan kan ik op woensdag niet werken. Kunnen we een afspraak maken om erover te praten?',
  },
  {
    id: 'nietontvangen',
    title: 'Bestelling niet ontvangen',
    situation:
      'U heeft drie weken geleden een jas besteld bij een webwinkel. U heeft de jas nog niet ontvangen. U stuurt de klantenservice een e-mail.',
    bullets: [
      'Schrijf wat u heeft besteld en wanneer.',
      'Schrijf wat het probleem is.',
      'Schrijf wat de winkel moet doen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('klantenservice@kledingwinkel.nl', 'Bestelling niet ontvangen', 'Beste meneer, mevrouw,'),
    register: 'u',
    points: [
      {
        id: 'besteld',
        label: 'Say what you ordered and when',
        keywords: ['besteld', 'bestelling', 'gekocht', 'jas'],
        starter: 'Op … heb ik … besteld.',
        example: 'Op 10 oktober heb ik een zwarte jas besteld.',
      },
      {
        id: 'probleem',
        label: 'Say what the problem is',
        keywords: ['niet ontvangen', 'nog niet', 'niet gekregen', 'niet bezorgd', 'kwijt', 'probleem'],
        starter: 'Ik heb de jas …',
        example: 'Ik heb de jas nog niet ontvangen.',
      },
      {
        id: 'willen',
        label: 'Say what the shop should do',
        keywords: ['geld terug', 'terug', 'sturen', 'stuur', 'opsturen', 'oplossen', 'uitzoeken'],
        starter: 'Wilt u …?',
        example: 'Wilt u de jas zo snel mogelijk sturen?',
      },
    ],
    minSentences: 3,
    model:
      'Op 10 oktober heb ik een zwarte jas besteld. Ik heb al betaald, maar ik heb de jas nog niet ontvangen. Wilt u de jas zo snel mogelijk sturen? Anders wil ik graag mijn geld terug.',
  },
  {
    id: 'kinderopvang',
    title: 'Plek op de kinderopvang',
    situation:
      'U wilt uw dochter Noor naar de kinderopvang brengen. U stuurt een e-mail aan mevrouw Hendriks van kinderopvang De Regenboog.',
    bullets: [
      'Schrijf hoe oud uw dochter is.',
      'Schrijf op welke dagen zij naar de opvang moet.',
      'Vraag wanneer zij kan beginnen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('s.hendriks@regenboog.nl', 'Plek voor mijn dochter', 'Beste mevrouw Hendriks,'),
    register: 'u',
    points: [
      {
        id: 'oud',
        label: 'Say how old your daughter is',
        keywords: ['[0-9]', 'jaar', 'maanden', 'oud'],
        starter: 'Mijn dochter is … oud.',
        example: 'Mijn dochter is twee jaar oud.',
      },
      {
        id: 'dagen',
        label: 'Say which days she needs care',
        keywords: [...WEEKDAYS, 'dagen'],
        starter: 'Ze moet op … naar de opvang.',
        example: 'Ze moet op maandag en donderdag naar de opvang.',
      },
      {
        id: 'beginnen',
        label: 'Ask when she can start',
        keywords: ['begin', 'start', 'wanneer'],
        starter: 'Wanneer kan zij …?',
        example: 'Wanneer kan zij beginnen?',
      },
    ],
    minSentences: 3,
    model:
      'Ik zoek een plek voor mijn dochter Noor op de kinderopvang. Noor is twee jaar oud. Ze moet op maandag en donderdag naar de opvang, want dan werk ik. Wanneer kan zij beginnen? Ik hoor graag van u.',
  },
  {
    id: 'zaal',
    title: 'Zaal huren',
    situation:
      'Uw moeder wordt zeventig. U wilt een feest voor haar geven in het buurthuis. U stuurt een e-mail aan meneer Mulder van het buurthuis.',
    bullets: [
      'Schrijf waarom u een zaal wilt huren.',
      'Schrijf op welke datum en hoe laat.',
      'Vraag hoeveel het kost.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('r.mulder@buurthuis.nl', 'Zaal huren', 'Beste meneer Mulder,'),
    register: 'u',
    points: [
      {
        id: 'waarom',
        label: 'Say why you want to rent a room',
        keywords: [...REASON, 'zaal', 'huren', 'vieren'],
        starter: 'Ik wil graag een zaal huren, omdat …',
        example: 'Ik wil graag een zaal huren, omdat mijn moeder zeventig wordt.',
      },
      {
        id: 'datum',
        label: 'Say the date and time',
        keywords: [...NEW_DATE, 'uur'],
        starter: 'Het feest is op …',
        example: 'Het feest is op zaterdag 12 december van 18.00 tot 23.00 uur.',
      },
      {
        id: 'kosten',
        label: 'Ask what it costs',
        keywords: ['kost', 'prijs', 'betalen', 'hoeveel', 'euro'],
        starter: 'Hoeveel kost …?',
        example: 'Hoeveel kost de zaal?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil graag een zaal huren, omdat mijn moeder zeventig wordt. Het feest is op zaterdag 12 december van 18.00 tot 23.00 uur. Er komen ongeveer veertig gasten. Hoeveel kost de zaal voor die avond?',
  },
  {
    id: 'parkeren',
    title: 'Parkeervergunning',
    situation:
      'U heeft een auto gekocht. In uw straat mag u alleen met een vergunning parkeren. U stuurt een e-mail aan de gemeente, aan mevrouw Bakker.',
    bullets: [
      'Schrijf waarom u de e-mail stuurt.',
      'Schrijf waar u woont.',
      'Vraag hoeveel de vergunning kost.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('parkeren@gemeente.nl', 'Parkeervergunning', 'Beste mevrouw Bakker,'),
    register: 'u',
    points: [
      {
        id: 'waarom',
        label: 'Say why you are writing',
        keywords: [...WHY_WRITING, 'vergunning', 'parkeer', 'aanvragen'],
        starter: 'Ik wil graag een … aanvragen.',
        example: 'Ik wil graag een parkeervergunning aanvragen.',
      },
      {
        id: 'waar',
        label: 'Say where you live',
        keywords: ['woon', 'straat', 'adres', 'laan', 'weg', 'plein', 'nummer'],
        starter: 'Ik woon in de …',
        example: 'Ik woon in de Kerkstraat 12 in Utrecht.',
      },
      {
        id: 'kosten',
        label: 'Ask what the permit costs',
        keywords: ['kost', 'prijs', 'betalen', 'hoeveel', 'euro'],
        starter: 'Hoeveel kost …?',
        example: 'Hoeveel kost een vergunning per jaar?',
      },
    ],
    minSentences: 3,
    model:
      'Ik wil graag een parkeervergunning aanvragen. Ik heb een auto gekocht. Ik woon in de Kerkstraat 12 in Utrecht. Hoeveel kost een vergunning per jaar? Hoe lang duurt het voordat ik de vergunning krijg?',
  },
]

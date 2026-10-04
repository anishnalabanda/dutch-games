import { NEW_DATE, REASON } from '../taken/keywords'
import type { TextTask } from '../taken/types'

/**
 * Informal messages, to someone you say je to: a colleague, a fellow student,
 * a friend, a neighbour. A first name in the greeting means je, even after
 * "Beste" (Boek lenen teaches that trap). Some are e-mails, some are a note
 * left for a colleague, built from pictures instead of bullets.
 *
 * The three marked `exam` follow the DUO oefenexamens, reworded and with
 * other names, since those papers are not to be shared.
 */

const INSTRUCTIONS = ['Schrijf de e-mail.', 'Schrijf in hele zinnen.']

const OTHER_DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'wel']

function mail(to: string, subject: string, greeting: string, closing = 'Groetjes,') {
  return { kind: 'mail' as const, to, subject, greeting, closing }
}

export const tasks: TextTask[] = [
  {
    id: 'ruilen',
    title: 'Dienst ruilen',
    exam: 1,
    situation:
      'U moet zondag werken, maar u wilt graag vrij zijn. U stuurt een e-mail aan uw collega Yasmina. U vraagt of zij met u wil ruilen.',
    bullets: [
      'Schrijf waarom u mailt.',
      'Schrijf waarom u wilt ruilen. Bedenk het zelf.',
      'Schrijf welke dag u wel kunt werken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('yasmina@mail.nl', 'Dienst ruilen', 'Hallo Yasmina,'),
    register: 'je',
    points: [
      {
        id: 'waarom',
        label: 'Say why you are writing',
        keywords: ['ik (mail|schrijf|stuur)', 'vraag', 'ruil'],
        starter: 'Ik mail je, omdat …',
        example: 'Ik mail je, omdat ik een vraag heb.',
      },
      {
        id: 'reden',
        label: 'Say why you want to swap',
        keywords: REASON,
        starter: 'Ik wil graag ruilen, want …',
        example: 'Mijn zus gaat zondag trouwen en ik wil naar de bruiloft.',
      },
      {
        id: 'dag',
        label: 'Say which day you can work',
        keywords: OTHER_DAYS,
        starter: 'Ik kan … wel werken.',
        example: 'Ik kan zaterdag wel voor jou werken.',
      },
    ],
    minSentences: 3,
    model:
      'Ik mail je, omdat ik een vraag heb. Ik moet zondag werken, maar ik wil graag vrij. Mijn zus gaat zondag trouwen en ik wil naar de bruiloft. Wil jij met mij ruilen? Ik kan zaterdag wel voor jou werken.',
  },
  {
    id: 'boek',
    title: 'Boek lenen',
    exam: 2,
    situation:
      'U volgt de opleiding Techniek. U heeft het boek Wiskunde 1 nodig. Een andere studente, Lotte, heeft dat boek. U wilt het boek van haar lenen. U stuurt haar een e-mail.',
    bullets: [
      'Schrijf welk boek u wilt lenen.',
      'Schrijf waarom u het boek van haar wilt lenen.',
      'Schrijf wanneer zij het boek terugkrijgt. Bedenk zelf wanneer.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('lotte@mail.nl', 'Boek lenen', 'Beste Lotte,'),
    register: 'je',
    points: [
      {
        id: 'boek',
        label: 'Say which book you want to borrow',
        keywords: ['wiskunde'],
        starter: 'Mag ik jouw boek … lenen?',
        example: 'Mag ik jouw boek Wiskunde 1 lenen?',
      },
      {
        id: 'waarom',
        label: 'Say why you want to borrow it',
        keywords: [...REASON, 'nodig', 'toets', 'huiswerk', 'opdracht', 'leren', 'studeren', 'kwijt', 'duur'],
        starter: 'Ik heb het boek nodig, want …',
        example: 'Ik heb het boek nodig, want volgende week heb ik een toets.',
      },
      {
        id: 'terug',
        label: 'Say when she gets it back',
        keywords: ['terug', ...NEW_DATE],
        starter: 'Je krijgt het boek op … terug.',
        example: 'Je krijgt het boek op vrijdag 23 oktober terug.',
      },
    ],
    minSentences: 3,
    model:
      'Mag ik jouw boek Wiskunde 1 lenen? Ik heb het boek nodig, want volgende week heb ik een toets. Mijn eigen boek ben ik kwijt. Je krijgt het boek op vrijdag 23 oktober terug. Alvast bedankt!',
  },
  {
    id: 'winkel',
    title: 'Briefje voor een collega',
    exam: 3,
    situation:
      'U werkt in een kledingwinkel. Straks begint uw collega Fatma. Zij moet een paar dingen doen. Kijk naar de plaatjes.',
    pictures: [
      { icons: '🧹', shows: 'cleaning the shop floor (a vacuum cleaner on the exam)' },
      { icons: '👕👖 ➜ 🧥', shows: 'clothes lying on the floor, then hanging on a rail' },
      { icons: '🔑🚪', shows: 'a key in the lock of a door' },
    ],
    bullets: [],
    instructions: [
      'Schrijf een briefje voor Fatma.',
      'Schrijf wat zij moet doen. Schrijf drie dingen op.',
      'Schrijf in hele zinnen.',
    ],
    frame: { kind: 'note', greeting: 'Hallo Fatma,', closing: ['Alvast bedankt!', 'Groeten,'] },
    register: 'je',
    points: [
      {
        id: 'vloer',
        label: 'Picture 1: clean the floor',
        keywords: ['stofzuig', 'veeg', 'vegen', 'schoonma', 'vloer'],
        starter: 'Wil jij de winkel …?',
        example: 'Wil jij de winkel stofzuigen?',
      },
      {
        id: 'kleren',
        label: 'Picture 2: hang up the clothes',
        keywords: ['ophang', 'hang', 'opruim', 'rek', 'vouw'],
        starter: 'Kun jij de kleren …?',
        example: 'Kun jij de kleren ophangen?',
      },
      {
        id: 'deur',
        label: 'Picture 3: lock the door',
        keywords: ['slot', 'sleutel', 'afsluiten', 'sluit', 'deur'],
        starter: 'Doe om 18.00 uur de deur …',
        example: 'Doe om 18.00 uur de deur op slot.',
      },
    ],
    minSentences: 3,
    model:
      'Wil jij vandaag de winkel stofzuigen? Er liggen ook veel kleren op de grond. Kun jij die kleren ophangen? Doe om 18.00 uur de deur goed op slot.',
  },
  {
    id: 'planten',
    title: 'Op vakantie',
    situation:
      'U gaat twee weken op vakantie. U stuurt een e-mail aan uw buurvrouw Anna. U kent haar goed.',
    bullets: [
      'Schrijf dat u op vakantie gaat.',
      'Vraag of zij de planten water wil geven.',
      'Schrijf wanneer u terug bent.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('anna@mail.nl', 'Planten', 'Hoi Anna,'),
    register: 'je',
    points: [
      {
        id: 'vakantie',
        label: 'Say that you are going on holiday',
        keywords: ['vakantie', 'reis', 'weg'],
        starter: 'Volgende week ga ik …',
        example: 'Volgende week ga ik twee weken op vakantie naar Spanje.',
      },
      {
        id: 'planten',
        label: 'Ask whether she will water the plants',
        keywords: ['plant', 'water', 'bloem'],
        starter: 'Wil jij de planten …?',
        example: 'Wil jij de planten water geven?',
      },
      {
        id: 'terug',
        label: 'Say when you are back',
        keywords: ['terug', 'thuis', ...NEW_DATE],
        starter: 'Ik ben op … weer terug.',
        example: 'Ik ben op zondag 25 oktober weer terug.',
      },
    ],
    minSentences: 3,
    model:
      'Volgende week ga ik twee weken op vakantie naar Spanje. Wil jij de planten water geven? De sleutel breng ik zaterdag even bij je. Ik ben op zondag 25 oktober weer terug. Alvast bedankt!',
  },
  {
    id: 'verjaardag',
    title: 'Uitnodiging',
    situation: 'U wordt volgende week 40 jaar. U geeft een feest. U stuurt een e-mail aan uw vriend Daan.',
    bullets: [
      'Nodig Daan uit voor uw feest.',
      'Schrijf wanneer en waar het feest is.',
      'Vraag of hij iets te eten wil meenemen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('daan@mail.nl', 'Mijn feest', 'Hoi Daan,'),
    register: 'je',
    points: [
      {
        id: 'uitnodigen',
        label: 'Invite Daan to your party',
        keywords: ['nodig', 'uitnodig', 'kom je', 'wil je komen', 'feest'],
        starter: 'Ik geef een feest en …',
        example: 'Ik geef een feest en ik nodig je uit!',
      },
      {
        id: 'wanneer',
        label: 'Say when the party is',
        keywords: ['[0-9]', 'uur', ...NEW_DATE],
        starter: 'Het feest is op …',
        example: 'Het feest is op zaterdag 17 oktober om 20.00 uur.',
      },
      {
        id: 'waar',
        label: 'Say where the party is',
        keywords: ['bij mij', 'thuis', 'huis', 'restaurant', 'buurthuis', 'tuin', 'café', 'adres'],
        starter: 'Het feest is bij …',
        example: 'Het feest is bij mij thuis.',
      },
      {
        id: 'meenemen',
        label: 'Ask him to bring something to eat',
        keywords: ['meenemen', 'mee', 'neem', 'eten', 'salade', 'taart', 'hapje'],
        starter: 'Wil jij iets te eten …?',
        example: 'Wil jij een salade meenemen?',
      },
    ],
    minSentences: 4,
    model:
      'Volgende week word ik 40 jaar. Daarom geef ik een feest en ik nodig je uit! Het feest is op zaterdag 17 oktober om 20.00 uur bij mij thuis. Wil jij een salade of iets anders te eten meenemen? Ik hoop dat je komt!',
  },
  {
    id: 'beterschap',
    title: 'Collega ziek',
    situation: 'Uw collega Mark is al een week ziek. U stuurt hem een e-mail.',
    bullets: [
      'Vraag hoe het met hem gaat.',
      'Vertel iets over het werk.',
      'Schrijf wat u voor hem wilt doen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('mark@werk.nl', 'Hoe gaat het?', 'Hoi Mark,'),
    register: 'je',
    points: [
      {
        id: 'hoe',
        label: 'Ask how he is',
        keywords: ['hoe gaat', 'hoe is', 'gaat het', 'beter'],
        starter: 'Hoe …?',
        example: 'Hoe gaat het met je?',
      },
      {
        id: 'werk',
        label: 'Tell him something about work',
        keywords: ['werk', 'druk', 'rustig', 'kantoor', 'collega', 'klant', 'iedereen'],
        starter: 'Op het werk is het …',
        example: 'Op het werk is het heel druk.',
      },
      {
        id: 'doen',
        label: 'Say what you want to do for him',
        keywords: ['langs', 'boodschap', 'breng', 'help', 'bezoek', 'kan ik', 'zal ik'],
        starter: 'Zal ik …?',
        example: 'Zal ik zaterdag even langskomen?',
      },
    ],
    minSentences: 3,
    model:
      'Hoe gaat het met je? Op het werk is het heel druk, maar het gaat goed. Iedereen mist je! Zal ik zaterdag even langskomen? Dan neem ik bloemen mee. Beterschap!',
  },
  {
    id: 'oppas',
    title: 'Oppas gezocht',
    situation:
      'U moet vrijdagavond werken. U zoekt een oppas voor uw zoon. U stuurt een e-mail aan uw vriendin Sara.',
    bullets: [
      'Vraag of Sara op uw zoon kan passen.',
      'Schrijf waarom u een oppas nodig heeft.',
      'Schrijf hoe laat zij moet komen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('sara@mail.nl', 'Oppassen', 'Hoi Sara,'),
    register: 'je',
    points: [
      {
        id: 'oppassen',
        label: 'Ask whether Sara can look after your son',
        keywords: ['oppas', 'passen'],
        starter: 'Kun jij … op mijn zoon passen?',
        example: 'Kun jij vrijdagavond op mijn zoon passen?',
      },
      {
        id: 'waarom',
        label: 'Say why you need a babysitter',
        keywords: [...REASON, 'werk'],
        starter: 'Ik moet die avond …',
        example: 'Ik moet die avond werken, want een collega is ziek.',
      },
      {
        id: 'tijd',
        label: 'Say what time she should come',
        keywords: ['[0-9]', 'uur', 'half', 'kwart'],
        starter: 'Kun je om … bij mij komen?',
        example: 'Kun je om 18.00 uur bij mij komen?',
      },
    ],
    minSentences: 3,
    model:
      'Kun jij vrijdagavond op mijn zoon passen? Ik moet die avond werken, want een collega is ziek. Kun je om 18.00 uur bij mij komen? Ik ben om 23.00 uur weer thuis. Dank je wel!',
  },
  {
    id: 'verhuizen',
    title: 'Hulp bij verhuizen',
    situation: 'U gaat verhuizen. U zoekt hulp. U stuurt een e-mail aan uw collega Tim.',
    bullets: [
      'Schrijf dat u gaat verhuizen.',
      'Vraag of Tim kan helpen.',
      'Schrijf wanneer de verhuizing is.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('tim@werk.nl', 'Verhuizing', 'Hoi Tim,'),
    register: 'je',
    points: [
      {
        id: 'verhuizen',
        label: 'Say that you are moving house',
        keywords: ['verhui[sz]', 'nieuw huis', 'nieuwe woning'],
        starter: 'Ik ga volgende maand …',
        example: 'Ik ga volgende maand verhuizen.',
      },
      {
        id: 'helpen',
        label: 'Ask whether Tim can help',
        keywords: ['help', 'hulp'],
        starter: 'Wil jij mij …?',
        example: 'Wil jij mij helpen met de dozen?',
      },
      {
        id: 'wanneer',
        label: 'Say when the move is',
        keywords: NEW_DATE,
        starter: 'De verhuizing is op …',
        example: 'De verhuizing is op zaterdag 7 november.',
      },
    ],
    minSentences: 3,
    model:
      'Ik ga volgende maand verhuizen naar een nieuw huis in Utrecht. Wil jij mij helpen met de dozen en de kasten? De verhuizing is op zaterdag 7 november. We beginnen om 9.00 uur. Ik zorg voor koffie en lunch!',
  },
  {
    id: 'meerijden',
    title: 'Auto kapot',
    situation:
      'Uw auto is kapot. Morgen moet u naar uw werk. Uw collega Lisa woont bij u in de buurt. U stuurt haar een e-mail.',
    bullets: [
      'Schrijf wat het probleem is.',
      'Vraag of u met haar mee kunt rijden.',
      'Schrijf hoe laat u klaarstaat.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('lisa@werk.nl', 'Morgen meerijden?', 'Hoi Lisa,'),
    register: 'je',
    points: [
      {
        id: 'probleem',
        label: 'Say what the problem is',
        keywords: ['auto', 'kapot', 'stuk', 'garage'],
        starter: 'Mijn auto …',
        example: 'Mijn auto is kapot.',
      },
      {
        id: 'meerijden',
        label: 'Ask whether you can ride with her',
        keywords: ['meerij', 'mee .*rijden', 'rij', 'ophalen', 'haal', 'lift'],
        starter: 'Mag ik morgen met jou …?',
        example: 'Mag ik morgen met jou mee naar het werk rijden?',
      },
      {
        id: 'tijd',
        label: 'Say what time you will be ready',
        keywords: ['[0-9]', 'uur', 'half', 'kwart'],
        starter: 'Ik sta om … klaar.',
        example: 'Ik sta om 7.30 uur klaar voor mijn huis.',
      },
    ],
    minSentences: 3,
    model:
      'Mijn auto is kapot. Hij staat nu bij de garage. Mag ik morgen met jou mee naar het werk rijden? Ik sta om 7.30 uur klaar voor mijn huis. Ik betaal natuurlijk mee voor de benzine.',
  },
  {
    id: 'hardlopen',
    title: 'Samen sporten',
    situation:
      'U gaat elke week hardlopen in het park. U wilt dat uw collega Emma een keer meegaat. U stuurt haar een e-mail.',
    bullets: [
      'Vertel wat u elke week doet.',
      'Vraag of Emma een keer mee wil.',
      'Schrijf waar en wanneer jullie afspreken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('emma@werk.nl', 'Hardlopen', 'Hoi Emma,'),
    register: 'je',
    points: [
      {
        id: 'wat',
        label: 'Say what you do every week',
        keywords: ['hardlo', 'loop', 'ren', 'sport'],
        starter: 'Ik ga elke … hardlopen.',
        example: 'Ik ga elke zaterdag hardlopen in het park.',
      },
      {
        id: 'mee',
        label: 'Ask whether Emma wants to come along',
        keywords: ['mee', 'zin', 'wil je', 'kom je', 'samen'],
        starter: 'Heb jij zin om …?',
        example: 'Heb jij zin om een keer mee te gaan?',
      },
      {
        id: 'afspraak',
        label: 'Say where and when you meet',
        keywords: ['[0-9]', 'uur', 'afspreken', 'ingang', 'station'],
        starter: 'We kunnen … afspreken bij …',
        example: 'We kunnen zaterdag om 9.00 uur afspreken bij de ingang van het park.',
      },
    ],
    minSentences: 3,
    model:
      'Ik ga elke zaterdag hardlopen in het park. Dat is heel leuk en gezond. Heb jij zin om een keer mee te gaan? We kunnen zaterdag om 9.00 uur afspreken bij de ingang van het park.',
  },
  {
    id: 'bedanken',
    title: 'Bedankt!',
    situation: 'Uw vriendin Ilse heeft u geholpen met uw verhuizing. U stuurt haar een e-mail.',
    bullets: [
      'Bedank Ilse voor haar hulp.',
      'Schrijf hoe uw nieuwe huis is.',
      'Nodig haar uit om te komen eten.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('ilse@mail.nl', 'Bedankt!', 'Lieve Ilse,'),
    register: 'je',
    points: [
      {
        id: 'bedanken',
        label: 'Thank Ilse for her help',
        keywords: ['bedankt', 'dank', 'lief'],
        starter: 'Bedankt voor …',
        example: 'Bedankt voor je hulp met de verhuizing!',
      },
      {
        id: 'huis',
        label: 'Say what your new house is like',
        keywords: ['mooi', 'groot', 'klein', 'licht', 'donker', 'ruim', 'tuin', 'balkon', 'kamer'],
        starter: 'Mijn nieuwe huis is …',
        example: 'Mijn nieuwe huis is mooi en licht.',
      },
      {
        id: 'uitnodigen',
        label: 'Invite her to come for a meal',
        keywords: ['eten', 'uitnodig', 'nodig', 'diner'],
        starter: 'Kom je … bij mij eten?',
        example: 'Kom je volgende week bij mij eten?',
      },
    ],
    minSentences: 3,
    model:
      'Bedankt voor je hulp met de verhuizing! Zonder jou was het niet gelukt. Mijn nieuwe huis is mooi en licht. Er is ook een klein balkon. Kom je volgende week bij mij eten?',
  },
  {
    id: 'restaurant',
    title: 'Briefje in het restaurant',
    situation:
      'U werkt in een restaurant. Straks begint uw collega Ruben. Hij moet een paar dingen doen. Kijk naar de plaatjes.',
    pictures: [
      { icons: '🍽️', shows: 'plates, a knife and a fork on a table' },
      { icons: '🗑️', shows: 'rubbish bags that have to go outside' },
      { icons: '🪴💧', shows: 'a plant and a drop of water' },
    ],
    bullets: [],
    instructions: [
      'Schrijf een briefje voor Ruben.',
      'Schrijf wat hij moet doen. Schrijf drie dingen op.',
      'Schrijf in hele zinnen.',
    ],
    frame: { kind: 'note', greeting: 'Hoi Ruben,', closing: ['Bedankt!', 'Groetjes,'] },
    register: 'je',
    points: [
      {
        id: 'tafels',
        label: 'Picture 1: lay the tables',
        keywords: ['tafel', 'dek', 'borden', 'bestek'],
        starter: 'Wil jij de tafels …?',
        example: 'Wil jij de tafels dekken?',
      },
      {
        id: 'afval',
        label: 'Picture 2: put the rubbish outside',
        keywords: ['afval', 'vuilnis', 'prullenbak', 'buiten'],
        starter: 'Zet jij de vuilniszakken …?',
        example: 'Zet jij de vuilniszakken buiten?',
      },
      {
        id: 'planten',
        label: 'Picture 3: water the plants',
        keywords: ['plant', 'water'],
        starter: 'Kun jij de planten …?',
        example: 'Kun jij de planten water geven?',
      },
    ],
    minSentences: 3,
    model:
      'Wil jij straks de tafels dekken? Zet jij daarna de vuilniszakken buiten? En kun jij de planten water geven? Ze zijn erg droog.',
  },
]

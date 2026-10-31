import { NEW_DATE, REASON, TIME } from '../taken/keywords'
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
  {
    id: 'film',
    title: 'Naar de film',
    situation: 'U wilt zaterdag naar de bioscoop. U stuurt een e-mail aan uw vriend Joris. U vraagt of hij meegaat.',
    bullets: [
      'Vraag of Joris mee wil naar de film.',
      'Schrijf welke film u wilt zien.',
      'Stel voor waar en hoe laat jullie afspreken.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('joris@mail.nl', 'Film zaterdag', 'Hoi Joris,'),
    register: 'je',
    points: [
      {
        id: 'mee',
        label: 'Ask whether he wants to come',
        keywords: ['mee', 'zin', 'ga je', 'wil je', 'samen'],
        starter: 'Heb je zin om … mee te gaan?',
        example: 'Heb je zin om zaterdag mee te gaan naar de film?',
      },
      {
        id: 'film',
        label: 'Say which film',
        keywords: ['film', 'komedie', 'actiefilm', 'heet'],
        starter: 'Ik wil graag … zien.',
        example: 'Ik wil graag de nieuwe Nederlandse film zien.',
      },
      {
        id: 'afspraak',
        label: 'Suggest where and what time to meet',
        keywords: ['uur', 'half', 'kwart', 'station', 'bioscoop', 'ingang', 'café', 'afspreken'],
        starter: 'Zullen we om … bij … afspreken?',
        example: 'Zullen we om 19.30 uur bij de bioscoop afspreken?',
      },
    ],
    minSentences: 3,
    model:
      'Heb je zin om zaterdag mee te gaan naar de film? Ik wil graag de nieuwe Nederlandse komedie zien. De film begint om 20.00 uur. Zullen we om 19.30 uur bij de bioscoop afspreken? Laat je het even weten?',
  },
  {
    id: 'huiswerk',
    title: 'Les gemist',
    situation:
      'U volgt een cursus Nederlands. U was vorige week ziek en u heeft de les gemist. U stuurt een e-mail aan Lina. Zij zit ook in uw groep.',
    bullets: [
      'Schrijf waarom u er niet was.',
      'Vraag wat het huiswerk is.',
      'Vraag of u haar aantekeningen mag lenen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('lina@mail.nl', 'Huiswerk', 'Hoi Lina,'),
    register: 'je',
    points: [
      {
        id: 'waarom',
        label: "Say why you weren't there",
        keywords: REASON,
        starter: 'Ik was niet bij de les, want …',
        example: 'Ik was vorige week niet bij de les, want ik had griep.',
      },
      {
        id: 'huiswerk',
        label: 'Ask what the homework is',
        keywords: ['huiswerk', 'opdracht', 'oefening', 'bladzijde', 'hoofdstuk'],
        starter: 'Weet jij wat het … is?',
        example: 'Weet jij wat het huiswerk voor volgende week is?',
      },
      {
        id: 'aantekeningen',
        label: 'Ask to borrow her notes',
        keywords: ['aantekening', 'schrift', 'lenen', 'leen', 'kopie', 'foto'],
        starter: 'Mag ik jouw … lenen?',
        example: 'Mag ik jouw aantekeningen lenen?',
      },
    ],
    minSentences: 3,
    model:
      'Ik was vorige week niet bij de les, want ik had griep. Nu gaat het weer goed met mij. Weet jij wat het huiswerk voor volgende week is? Mag ik ook jouw aantekeningen lenen? Ik geef ze dinsdag terug.',
  },
  {
    id: 'pakketje',
    title: 'Pakketje voor mij',
    situation:
      'U verwacht morgen een pakketje, maar u bent de hele dag op uw werk. U stuurt een e-mail aan uw buurman Ahmed. U kent hem goed.',
    bullets: [
      'Schrijf dat er morgen een pakketje komt.',
      'Vraag of Ahmed het pakketje wil aannemen.',
      'Schrijf wanneer u het pakketje komt halen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('ahmed@mail.nl', 'Pakketje', 'Hoi Ahmed,'),
    register: 'je',
    points: [
      {
        id: 'pakket',
        label: 'Say that a parcel is coming',
        keywords: ['pakket', 'pakje', 'bezorg', 'post', 'doos', 'besteld'],
        starter: 'Morgen komt er …',
        example: 'Morgen komt er een pakketje voor mij.',
      },
      {
        id: 'aannemen',
        label: 'Ask whether he will take it in',
        keywords: ['aanne', 'neem', 'bewaar', 'opendoen', 'thuis'],
        starter: 'Wil jij het pakketje …?',
        example: 'Wil jij het pakketje voor mij aannemen?',
      },
      {
        id: 'halen',
        label: 'Say when you will pick it up',
        keywords: ['haal', 'halen', 'ophalen', ...TIME],
        starter: 'Ik kom het … bij jou halen.',
        example: 'Ik kom het morgenavond om 19.00 uur bij jou halen.',
      },
    ],
    minSentences: 3,
    model:
      'Morgen komt er een pakketje voor mij. Ik ben de hele dag op mijn werk. Wil jij het pakketje voor mij aannemen? Ik kom het morgenavond om 19.00 uur bij jou halen. Alvast bedankt!',
  },
  {
    id: 'afzeggen',
    title: 'Etentje afzeggen',
    situation: 'U heeft vrijdag een etentje met uw vriendin Eva. Maar u kunt niet. U stuurt haar een e-mail.',
    bullets: [
      'Schrijf dat u vrijdag niet kunt komen.',
      'Schrijf waarom niet. Bedenk zelf een reden.',
      'Stel een andere dag voor.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('eva@mail.nl', 'Vrijdag', 'Lieve Eva,', 'Liefs,'),
    register: 'je',
    points: [
      {
        id: 'niet',
        label: "Say that you can't come on Friday",
        keywords: ['kan .*niet', 'niet komen', 'afzeggen', 'lukt .*niet'],
        starter: 'Helaas kan ik …',
        example: 'Helaas kan ik vrijdag niet komen.',
      },
      {
        id: 'reden',
        label: 'Give a reason',
        keywords: REASON,
        starter: 'Ik kan niet, want …',
        example: 'Mijn moeder is jarig en ik ga naar haar feest.',
      },
      {
        id: 'dag',
        label: 'Suggest another day',
        keywords: NEW_DATE,
        starter: 'Kunnen we op … samen eten?',
        example: 'Kunnen we volgende week zaterdag samen eten?',
      },
    ],
    minSentences: 3,
    model:
      'Helaas kan ik vrijdag niet komen. Mijn moeder is jarig en ik ga naar haar feest. Dat was ik vergeten, sorry! Kunnen we volgende week zaterdag samen eten? Ik betaal!',
  },
  {
    id: 'baby',
    title: 'Een baby!',
    situation: 'Uw collega Sandra heeft een baby gekregen. U stuurt haar een e-mail.',
    bullets: [
      'Feliciteer Sandra met de baby.',
      'Vraag hoe het met haar en de baby gaat.',
      'Vraag wanneer u op bezoek mag komen.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('sandra@werk.nl', 'Gefeliciteerd!', 'Hoi Sandra,'),
    register: 'je',
    points: [
      {
        id: 'feliciteren',
        label: 'Congratulate her',
        keywords: ['gefeliciteerd', 'feliciteer', 'proficiat', 'wat leuk', 'wat fijn'],
        starter: 'Gefeliciteerd met …!',
        example: 'Gefeliciteerd met jullie baby!',
      },
      {
        id: 'hoe',
        label: 'Ask how she and the baby are',
        keywords: ['hoe gaat', 'gaat het', 'hoe is', 'goed met'],
        starter: 'Hoe gaat het met …?',
        example: 'Hoe gaat het met jou en de baby?',
      },
      {
        id: 'bezoek',
        label: 'Ask when you can visit',
        keywords: ['bezoek', 'langs', 'kom', 'zien'],
        starter: 'Wanneer mag ik …?',
        example: 'Wanneer mag ik op bezoek komen?',
      },
    ],
    minSentences: 3,
    model:
      'Gefeliciteerd met jullie baby! Ik vind het heel leuk nieuws. Hoe gaat het met jou en de baby? Wanneer mag ik op bezoek komen? Ik neem een klein cadeautje mee.',
  },
  {
    id: 'fiets',
    title: 'Fiets lenen',
    situation:
      'Uw fiets is kapot. Morgen moet u naar een sollicitatiegesprek. U stuurt een e-mail aan uw buurman Kees. U wilt zijn fiets lenen.',
    bullets: [
      'Schrijf wat het probleem is.',
      'Vraag of u zijn fiets mag lenen.',
      'Schrijf wanneer u de fiets terugbrengt.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('kees@mail.nl', 'Fiets lenen', 'Hoi Kees,'),
    register: 'je',
    points: [
      {
        id: 'probleem',
        label: 'Say what the problem is',
        keywords: ['kapot', 'lek', 'band', 'gestolen', 'werkt niet', 'probleem'],
        starter: 'Mijn fiets is …',
        example: 'Mijn fiets is kapot: de band is lek.',
      },
      {
        id: 'lenen',
        label: 'Ask to borrow his bike',
        keywords: ['leen', 'lenen', 'gebruiken'],
        starter: 'Mag ik jouw fiets …?',
        example: 'Mag ik morgen jouw fiets lenen?',
      },
      {
        id: 'terug',
        label: 'Say when you bring it back',
        keywords: ['terug', ...NEW_DATE, 'middag', 'avond', 'uur'],
        starter: 'Ik breng de fiets … terug.',
        example: 'Ik breng de fiets om 14.00 uur terug.',
      },
    ],
    minSentences: 3,
    model:
      'Mijn fiets is kapot: de band is lek. Morgen heb ik een sollicitatiegesprek in de stad. Mag ik morgen jouw fiets lenen? Ik breng de fiets om 14.00 uur terug. Bedankt!',
  },
  {
    id: 'laptop',
    title: 'Hulp met de laptop',
    situation: 'Uw laptop doet het niet goed. Uw vriend Milan weet veel van computers. U stuurt hem een e-mail.',
    bullets: [
      'Schrijf wat het probleem met uw laptop is.',
      'Vraag of Milan u kan helpen.',
      'Schrijf wat u als bedankje voor hem doet.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('milan@mail.nl', 'Laptop', 'Hoi Milan,'),
    register: 'je',
    points: [
      {
        id: 'probleem',
        label: 'Say what is wrong with the laptop',
        keywords: ['traag', 'langzaam', 'start', 'kapot', 'werkt niet', 'doet het niet', 'scherm', 'internet', 'probleem'],
        starter: 'Mijn laptop is …',
        example: 'Mijn laptop is heel traag en het scherm wordt soms zwart.',
      },
      {
        id: 'helpen',
        label: 'Ask whether he can help',
        keywords: ['help', 'kijken', 'kijk', 'repareren', 'maken'],
        starter: 'Kun jij mij …?',
        example: 'Kun jij mij helpen?',
      },
      {
        id: 'bedankje',
        label: 'Say what you will do in return',
        keywords: ['kook', 'koken', 'eten', 'trakteer', 'betaal', 'cadeau', 'drinken', 'taart', 'pizza', 'curry'],
        starter: 'Als bedankje … ik …',
        example: 'Als bedankje kook ik een lekkere curry voor jou.',
      },
    ],
    minSentences: 3,
    model:
      'Mijn laptop is heel traag en het scherm wordt soms zwart. Kun jij mij helpen? Misschien kun je zaterdag even komen kijken. Als bedankje kook ik een lekkere curry voor jou.',
  },
  {
    id: 'terugvanvakantie',
    title: 'Terug van vakantie',
    situation: 'U bent net terug van vakantie. Uw collega Peter vraagt hoe het was. U stuurt hem een e-mail.',
    bullets: [
      'Schrijf waar u op vakantie was.',
      'Schrijf wat u daar gedaan heeft.',
      'Schrijf wanneer u weer op uw werk bent.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('peter@werk.nl', 'Mijn vakantie', 'Hoi Peter,'),
    register: 'je',
    points: [
      {
        id: 'waar',
        label: 'Say where you were',
        keywords: ['spanje', 'frankrijk', 'italië', 'india', 'turkije', 'griekenland', 'zee', 'berg', 'strand'],
        starter: 'Ik was … in …',
        example: 'Ik was twee weken in Italië.',
      },
      {
        id: 'gedaan',
        label: 'Say what you did there',
        keywords: ['gezwommen', 'gewandeld', 'gegeten', 'bezocht', 'gezien', 'gefietst', 'gelezen', 'gedaan', 'gelegen', 'museum', 'strand', 'foto'],
        starter: 'We hebben veel …',
        example: 'We hebben veel pizza gegeten en we hebben oude kerken bezocht.',
      },
      {
        id: 'werk',
        label: 'Say when you are back at work',
        keywords: ['werk', ...NEW_DATE],
        starter: 'Ik ben … weer op mijn werk.',
        example: 'Ik ben maandag weer op mijn werk.',
      },
    ],
    minSentences: 3,
    model:
      "Ik was twee weken in Italië. Het was heel mooi en warm. We hebben veel pizza gegeten en we hebben oude kerken bezocht. Ik ben maandag weer op mijn werk. Dan laat ik je de foto's zien.",
  },
  {
    id: 'feestje',
    title: 'Feest bij mij thuis',
    situation:
      'U geeft zaterdag een feest bij u thuis. Het wordt misschien laat en druk. U stuurt een e-mail aan uw buurvrouw Sara. U kent haar goed.',
    bullets: [
      'Schrijf dat u een feest geeft en waarom.',
      'Schrijf hoe laat het feest stopt.',
      'Nodig Sara uit voor het feest.',
    ],
    instructions: INSTRUCTIONS,
    frame: mail('sara@mail.nl', 'Feest zaterdag', 'Hoi Sara,'),
    register: 'je',
    points: [
      {
        id: 'feest',
        label: 'Say that you are having a party, and why',
        keywords: ['feest', 'verjaardag', 'jarig', 'vier'],
        starter: 'Zaterdag geef ik een feest, want …',
        example: 'Zaterdag geef ik een feest, want ik ben jarig.',
      },
      {
        id: 'stop',
        label: 'Say what time it ends',
        keywords: ['uur', 'stop', 'klaar', 'afgelopen', 'half'],
        starter: 'Het feest stopt om …',
        example: 'Het feest stopt om 24.00 uur.',
      },
      {
        id: 'uitnodigen',
        label: 'Invite her',
        keywords: ['uitnodig', 'nodig .*uit', 'kom', 'welkom'],
        starter: 'Kom jij ook …?',
        example: 'Kom jij ook naar het feest?',
      },
    ],
    minSentences: 3,
    model:
      'Zaterdag geef ik een feest, want ik ben jarig. Het wordt misschien een beetje druk. Het feest stopt om 24.00 uur. Kom jij ook naar het feest? Je bent van harte welkom!',
  },
  {
    id: 'kantoor',
    title: 'Briefje op kantoor',
    situation:
      'U werkt op een kantoor. Morgen bent u vrij. Uw collega Tom moet een paar dingen voor u doen. Kijk naar de plaatjes.',
    pictures: [
      { icons: '📞', shows: 'a phone: someone has to be called back' },
      { icons: '📦✉️', shows: 'a parcel that has to go to the post office' },
      { icons: '💻🔌', shows: 'a computer being switched off' },
    ],
    bullets: [],
    instructions: [
      'Schrijf een briefje voor Tom.',
      'Schrijf wat hij moet doen. Schrijf drie dingen op.',
      'Schrijf in hele zinnen.',
    ],
    frame: { kind: 'note', greeting: 'Hoi Tom,', closing: ['Bedankt!', 'Groetjes,'] },
    register: 'je',
    points: [
      {
        id: 'bellen',
        label: 'Picture 1: call someone back',
        keywords: ['bel', 'terugbellen', 'telefoon'],
        starter: 'Wil jij … terugbellen?',
        example: 'Wil jij meneer De Vries terugbellen?',
      },
      {
        id: 'pakket',
        label: 'Picture 2: take the parcel to the post office',
        keywords: ['pakket', 'post', 'breng', 'verstuur'],
        starter: 'Kun jij het pakket …?',
        example: 'Kun jij het pakket naar het postkantoor brengen?',
      },
      {
        id: 'computer',
        label: 'Picture 3: switch off the computers',
        keywords: ['computer', 'laptop', 'uitzetten', 'zet .*uit'],
        starter: 'Zet jij om … de computers …?',
        example: 'Zet jij om 17.00 uur de computers uit?',
      },
    ],
    minSentences: 3,
    model:
      'Wil jij morgen meneer De Vries terugbellen? Hij heeft een vraag over de rekening. Kun jij ook het pakket naar het postkantoor brengen? Zet jij om 17.00 uur alle computers uit?',
  },
]

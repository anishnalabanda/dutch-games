import { ACTIVITIES, COLOURS, FOOD, PEOPLE, TIME } from '../taken/keywords'
import type { Point, TextTask } from '../taken/types'

/**
 * A short text for the neighbourhood paper, about yourself. The exam frame is
 * identical every time: three "Denk aan" questions, at least three sentences,
 * and a printed lead line above the box. The method: answer each question with
 * one sentence that reuses its words, in the ik-form.
 *
 * The three marked `exam` follow the DUO oefenexamens' topics, reworded.
 */

const PLACES = [
  'thuis', 'park', 'stad', 'centrum', 'bos', 'strand', 'huis', 'zwembad', 'sportschool', 'café',
  'restaurant', 'markt', 'tuin', 'bibliotheek', 'buurthuis', 'bij ', 'zee', 'kerk', 'moskee', 'tempel',
]

/** The wijkkrant frame around a topic: same situation, intro and instructions every time. */
function krant(
  task: Omit<TextTask, 'situation' | 'intro' | 'instructions' | 'frame' | 'register' | 'minSentences'> & {
    about: string
    lead: string
  },
): TextTask {
  const { about, lead, ...rest } = task
  return {
    ...rest,
    situation: `U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over ${about}.`,
    intro: 'Schrijf minimaal drie zinnen op. Denk aan:',
    instructions: ['Schrijf in hele zinnen.'],
    frame: { kind: 'krant', lead },
    register: 'ik',
    minSentences: 3,
  }
}

function point(id: string, label: string, keywords: string[], starter: string, example: string): Point {
  return { id, label, keywords, starter, example }
}

export const tasks: TextTask[] = [
  krant({
    id: 'feest',
    title: 'Feest',
    exam: 1,
    about: 'een feest dat u elk jaar viert',
    lead: 'Dit is mijn tekst over het feest dat ik elk jaar vier:',
    bullets: ['Waarom viert u dit feest?', 'Wie komen er op het feest?', 'Wat doet u op het feest?'],
    points: [
      point('waarom', 'Why you celebrate it', ['omdat', 'want', 'jarig', 'verjaardag', 'geboren', 'einde', 'begin', 'nieuwe jaar', 'geloof', 'traditie'], 'Ik vier het feest, omdat …', 'Ik vier het feest, omdat ik dan een jaar ouder ben.'),
      point('wie', 'Who comes', PEOPLE, '… komen op het feest.', 'Mijn familie en mijn vrienden komen op het feest.'),
      point('wat', 'What you do at the party', [...ACTIVITIES, 'eten', 'taart', 'cadeau', 'bidden', 'versier', 'vuurwerk'], 'We … samen en we …', 'We eten samen en we dansen.'),
    ],
    model:
      'Elk jaar vier ik mijn verjaardag in mei. Ik vier het feest, omdat ik dan een jaar ouder ben. Mijn familie en mijn vrienden komen op het feest. We eten samen en we dansen. Mijn moeder maakt altijd een grote taart.',
  }),
  krant({
    id: 'kleren',
    title: 'Mooiste kleren',
    exam: 2,
    about: 'de kleren die u het liefst draagt',
    lead: 'Dit is mijn tekst over de kleren die ik het liefst draag:',
    bullets: ['Welke kleren draagt u het liefst?', 'Hoe zien deze kleren eruit?', 'Wanneer draagt u ze?'],
    points: [
      point('wat', 'Which clothes you like wearing best', ['broek', 'spijkerbroek', 'jurk', 'trui', 'shirt', 't-shirt', 'jas', 'rok', 'pak', 'overhemd', 'blouse', 'schoenen', 'vest', 'sari', 'kleren', 'kleding'], 'Ik draag het liefst …', 'Ik draag het liefst mijn blauwe spijkerbroek en een witte trui.'),
      point('hoe', 'What they look like', [...COLOURS, 'groot', 'klein', 'lang', 'kort', 'zacht', 'warm', 'mooi', 'oud', 'nieuw', 'wijd', 'strak', 'licht', 'donker', 'strepen', 'bloemen'], 'De trui is …', 'De trui is groot en heel zacht.'),
      point('wanneer', 'When you wear them', [...TIME, 'als ', 'feest', 'werk', 'thuis'], 'Ik draag deze kleren …', 'Ik draag deze kleren vaak in het weekend.'),
    ],
    model:
      'Ik draag het liefst mijn blauwe spijkerbroek en een witte trui. De trui is groot en heel zacht. Ik draag deze kleren vaak in het weekend. Dan zit ik lekker thuis of ga ik wandelen.',
  }),
  krant({
    id: 'weekend',
    title: 'Weekend',
    exam: 3,
    about: 'uw weekend',
    lead: 'Dit is mijn tekst over mijn weekend:',
    bullets: ['Wat doet u graag in het weekend?', 'Met wie doet u dat?', 'Waar doet u dat?'],
    points: [
      point('wat', 'What you like doing at the weekend', ACTIVITIES, 'In het weekend … ik graag.', 'In het weekend wandel ik graag.'),
      point('wie', 'Who with', PEOPLE, 'Ik … met …', 'Ik wandel met mijn buurman en zijn hond.'),
      point('waar', 'Where', PLACES, 'We … meestal in …', 'We lopen meestal in het park bij ons huis.'),
    ],
    model:
      'In het weekend wandel ik graag. Ik wandel met mijn buurman en zijn hond. We lopen meestal in het park bij ons huis. Daarna drinken we samen koffie in de stad.',
  }),
  krant({
    id: 'eten',
    title: 'Lekker eten',
    about: 'uw lievelingseten',
    lead: 'Dit is mijn tekst over mijn lievelingseten:',
    bullets: ['Wat eet u het liefst?', 'Wie maakt het eten?', 'Wanneer eet u dit?'],
    points: [
      point('wat', 'What you like eating best', FOOD, 'Ik eet het liefst …', 'Ik eet het liefst kip met rijst en groente.'),
      point('wie', 'Who makes it', [...PEOPLE, 'zelf', 'ik maak', 'ik kook'], '… maakt het eten.', 'Nu maak ik het zelf.'),
      point('wanneer', 'When you eat it', TIME, 'Ik eet dit meestal …', 'Ik eet dit meestal op vrijdagavond.'),
    ],
    model:
      'Ik eet het liefst kip met rijst en groente. Mijn moeder maakte dit vroeger elke week. Nu maak ik het zelf. Ik eet dit meestal op vrijdagavond met mijn vrienden.',
  }),
  krant({
    id: 'buurt',
    title: 'Mijn buurt',
    about: 'uw buurt',
    lead: 'Dit is mijn tekst over mijn buurt:',
    bullets: ['Waar woont u?', 'Wat vindt u leuk aan uw buurt?', 'Wat kan er beter in uw buurt?'],
    points: [
      point('waar', 'Where you live', ['woon', 'straat', 'wijk', 'stad', 'dorp', 'centrum', 'flat'], 'Ik woon in …', 'Ik woon in een flat in Utrecht.'),
      point('leuk', 'What you like about it', ['leuk', 'fijn', 'mooi', 'gezellig', 'rustig', 'park', 'winkels', 'vriendelijk', 'aardig', 'groen', 'dichtbij'], 'Mijn buurt is …', 'Mijn buurt is rustig en er is een mooi park.'),
      point('beter', 'What could be better', ['beter', 'meer', 'minder', 'jammer', 'vies', 'druk', 'lawaai', 'afval', 'geen'], 'Er mogen meer …', 'Er mogen meer prullenbakken komen.'),
    ],
    model:
      'Ik woon in een flat in Utrecht. Mijn buurt is rustig en er is een mooi park. De buren zijn ook heel vriendelijk. Wel ligt er soms afval op straat. Er mogen meer prullenbakken komen.',
  }),
  krant({
    id: 'hobby',
    title: 'Mijn hobby',
    about: 'uw hobby',
    lead: 'Dit is mijn tekst over mijn hobby:',
    bullets: ['Wat is uw hobby?', 'Waar en wanneer doet u dat?', 'Waarom vindt u het leuk?'],
    points: [
      point('wat', 'What your hobby is', [...ACTIVITIES, 'hobby', 'tennis', 'cricket', 'badminton', 'fotogra'], 'Mijn hobby is …', 'Mijn hobby is zwemmen.'),
      point('waarwanneer', 'Where and when you do it', [...PLACES, ...TIME, 'keer'], 'Ik … twee keer per week in …', 'Ik zwem twee keer per week in het zwembad.'),
      point('waarom', 'Why you like it', ['omdat', 'want', 'leuk', 'gezond', 'fijn', 'ontspan', 'rust', 'fit', 'sterk', 'blij'], 'Ik vind … leuk, omdat …', 'Ik vind zwemmen leuk, omdat ik me daarna rustig en fit voel.'),
    ],
    model:
      'Mijn hobby is zwemmen. Ik zwem twee keer per week in het zwembad bij mij in de buurt. Meestal ga ik op dinsdag en op zaterdag. Ik vind zwemmen leuk, omdat ik me daarna rustig en fit voel.',
  }),
  krant({
    id: 'werk',
    title: 'Mijn werk',
    about: 'uw werk',
    lead: 'Dit is mijn tekst over mijn werk:',
    bullets: ['Wat voor werk doet u?', 'Waar werkt u?', 'Wat vindt u leuk aan uw werk?'],
    points: [
      point('wat', 'What work you do', ['ik ben', 'werk als', 'beroep', 'programmeur', 'monteur', 'kok', 'verpleeg', 'chauffeur', 'schoonma', 'kapper', 'leraar', 'docent', 'student', 'ingenieur', 'computer', 'software'], 'Ik werk als …', 'Ik werk als programmeur.'),
      point('waar', 'Where you work', ['bij', 'kantoor', 'winkel', 'ziekenhuis', 'school', 'bedrijf', 'fabriek', 'restaurant', 'thuis'], 'Ik werk bij …', 'Ik werk bij een groot bedrijf in Amsterdam.'),
      point('leuk', 'What you like about it', ['leuk', 'fijn', 'collega', 'mensen', 'interessant', 'helpen', 'leren', 'leer', 'omdat', 'want'], 'Ik vind mijn werk leuk, omdat …', 'Ik vind mijn werk leuk, omdat ik veel nieuwe dingen leer.'),
    ],
    model:
      'Ik werk als programmeur. Ik werk bij een groot bedrijf in Amsterdam. Meestal werk ik op kantoor, maar soms werk ik thuis. Ik vind mijn werk leuk, omdat ik veel nieuwe dingen leer.',
  }),
  krant({
    id: 'vakantie',
    title: 'Een mooie vakantie',
    about: 'een mooie vakantie',
    lead: 'Dit is mijn tekst over een mooie vakantie:',
    bullets: ['Waar ging u naartoe?', 'Met wie ging u?', 'Wat heeft u daar gedaan?'],
    points: [
      point('waar', 'Where you went', ['naar', 'spanje', 'frankrijk', 'india', 'turkije', 'marokko', 'italië', 'zee', 'strand', 'berg', 'land'], 'Vorig jaar ging ik naar …', 'Vorig jaar ging ik op vakantie naar Spanje.'),
      point('wie', 'Who you went with', PEOPLE, 'Ik ging met …', 'Ik ging met mijn twee beste vrienden.'),
      point('wat', 'What you did there', ['gezwommen', 'gewandeld', 'gegeten', 'bezocht', 'gezien', 'gefietst', 'gelezen', 'gedaan', 'gelegen', 'geslapen', 'museum', 'strand', 'foto'], 'We hebben elke dag …', 'We hebben elke dag aan het strand gelegen.'),
    ],
    model:
      'Vorig jaar ging ik op vakantie naar Spanje. Ik ging met mijn twee beste vrienden. We hebben elke dag aan het strand gelegen en veel gezwommen. Elke avond hebben we lekker gegeten in een klein restaurant.',
  }),
  krant({
    id: 'huis',
    title: 'Mijn huis',
    about: 'uw huis',
    lead: 'Dit is mijn tekst over mijn huis:',
    bullets: ['Hoe ziet uw huis eruit?', 'Welke kamer vindt u het mooist?', 'Wat doet u graag in die kamer?'],
    points: [
      point('hoe', 'What your home looks like', ['groot', 'klein', 'oud', 'nieuw', 'licht', 'donker', 'mooi', 'kamers', 'flat', 'appartement', 'tuin', 'balkon'], 'Ik woon in een … huis met …', 'Ik woon in een klein appartement met twee kamers.'),
      point('kamer', 'Which room you like best', ['kamer', 'keuken', 'woonkamer', 'slaapkamer', 'badkamer', 'zolder', 'balkon', 'tuin'], 'De … vind ik het mooist.', 'De woonkamer vind ik het mooist.'),
      point('doen', 'What you like doing there', [...ACTIVITIES, 'zit'], 'Daar … ik graag …', 'Daar lees ik graag een boek bij het raam.'),
    ],
    model:
      'Ik woon in een klein appartement met twee kamers. Het is licht en er is een balkon. De woonkamer vind ik het mooist. Daar lees ik graag een boek bij het raam.',
  }),
  krant({
    id: 'boodschappen',
    title: 'Boodschappen doen',
    about: 'boodschappen doen',
    lead: 'Dit is mijn tekst over boodschappen doen:',
    bullets: ['Waar doet u boodschappen?', 'Wanneer doet u boodschappen?', 'Wat koopt u meestal?'],
    points: [
      point('waar', 'Where you shop', ['supermarkt', 'markt', 'winkel', 'bakker', 'slager', 'toko', 'online', 'internet'], 'Ik doe mijn boodschappen in …', 'Ik doe mijn boodschappen meestal op de markt.'),
      point('wanneer', 'When you shop', TIME, 'Ik ga elke …', 'Ik ga elke zaterdagochtend.'),
      point('wat', 'What you usually buy', [...FOOD, 'melk', 'koop'], 'Ik koop meestal …', 'Op de markt koop ik groente en fruit.'),
    ],
    model:
      'Ik doe mijn boodschappen meestal op de markt en in de supermarkt. Ik ga elke zaterdagochtend. Op de markt koop ik groente en fruit. In de supermarkt koop ik brood, melk en rijst.',
  }),
  krant({
    id: 'seizoen',
    title: 'Mijn seizoen',
    about: 'het seizoen dat u het mooist vindt',
    lead: 'Dit is mijn tekst over mijn lievelingsseizoen:',
    bullets: ['Welk seizoen vindt u het mooist?', 'Waarom vindt u dat seizoen mooi?', 'Wat doet u graag in dat seizoen?'],
    points: [
      point('welk', 'Which season', ['lente', 'zomer', 'herfst', 'winter', 'voorjaar', 'najaar'], 'Ik vind de … het mooiste seizoen.', 'Ik vind de zomer het mooiste seizoen.'),
      point('waarom', 'Why you like it', ['omdat', 'want', 'warm', 'koud', 'zon', 'sneeuw', 'bladeren', 'licht', 'bloemen', 'kleuren'], 'Ik houd van de …, omdat …', 'Ik houd van de zomer, omdat het dan warm is.'),
      point('doen', 'What you like doing then', [...ACTIVITIES, 'buiten', 'terras', 'strand', 'schaats', 'barbecue'], 'In de … ik graag …', 'In de zomer zit ik graag op een terras.'),
    ],
    model:
      'Ik vind de zomer het mooiste seizoen. Ik houd van de zomer, omdat het dan warm en lang licht is. In de zomer zit ik graag op een terras. Ook ga ik vaak met vrienden naar het strand.',
  }),
  krant({
    id: 'ochtend',
    title: 'Mijn ochtend',
    about: 'uw ochtend',
    lead: 'Dit is mijn tekst over mijn ochtend:',
    bullets: ['Hoe laat staat u op?', 'Wat doet u in de ochtend?', 'Hoe gaat u naar uw werk of school?'],
    points: [
      point('tijd', 'What time you get up', ['[0-9]', 'uur', 'half', 'kwart', 'vroeg', 'laat'], 'Ik sta elke dag om … op.', 'Ik sta elke dag om 7.00 uur op.'),
      point('ochtend', 'What you do in the morning', ['ontbijt', 'douche', 'eet', 'drink', 'koffie', 'thee', 'aankleden', 'kleed', 'brood', 'boterham', 'krant', 'sport'], 'Eerst … ik en daarna …', 'Eerst douche ik en daarna eet ik een boterham.'),
      point('vervoer', 'How you get to work or school', ['fiets', 'bus', 'trein', 'auto', 'tram', 'metro', 'lopen', 'loop', 'lopend', 'scooter'], 'Ik ga met de … naar mijn werk.', 'Ik ga met de fiets naar mijn werk.'),
    ],
    model:
      'Ik sta elke dag om 7.00 uur op. Eerst douche ik en daarna eet ik een boterham. Ik drink ook een kop koffie. Om 8.15 uur ga ik met de fiets naar mijn werk.',
  }),
  krant({
    id: 'familie',
    title: 'Mijn familie',
    about: 'uw familie',
    lead: 'Dit is mijn tekst over mijn familie:',
    bullets: ['Hoe groot is uw familie?', 'Waar woont uw familie?', 'Wat doet u graag samen?'],
    points: [
      point('groot', 'How big your family is', ['groot', 'klein', 'broer', 'zus', 'kinderen', 'ouders', '[0-9]', 'twee', 'drie', 'vier', 'vijf', 'personen'], 'Mijn familie is …', 'Mijn familie is groot: ik heb twee broers en een zus.'),
      point('waar', 'Where they live', ['woon', 'wonen', 'india', 'nederland', 'stad', 'land', 'dorp', 'ver', 'dichtbij'], 'Mijn familie woont in …', 'Mijn ouders wonen in India, maar mijn zus woont ook in Nederland.'),
      point('samen', 'What you like doing together', [...ACTIVITIES, 'bel', 'samen'], 'We … graag samen.', 'We bellen elke zondag en we eten graag samen.'),
    ],
    model:
      'Mijn familie is groot: ik heb twee broers en een zus. Mijn ouders wonen in India, maar mijn zus woont ook in Nederland. We bellen elke zondag met mijn ouders. Met mijn zus eet ik graag samen in het weekend.',
  }),
  krant({
    id: 'vriend',
    title: 'Mijn beste vriend',
    about: 'uw beste vriend of vriendin',
    lead: 'Dit is mijn tekst over mijn beste vriend of vriendin:',
    bullets: ['Wie is uw beste vriend of vriendin?', 'Hoe kent u elkaar?', 'Wat doet u samen?'],
    points: [
      point('wie', 'Who your best friend is', ['vriend', 'vriendin', 'heet', 'naam'], 'Mijn beste vriend heet …', 'Mijn beste vriendin heet Sara.'),
      point('kennen', 'How you know each other', ['ken', 'leerde', 'ontmoet', 'school', 'werk', 'cursus', 'buren', 'buurvrouw', 'buurman', 'collega', 'sinds'], 'We kennen elkaar van …', 'We kennen elkaar van de taalcursus.'),
      point('samen', 'What you do together', [...ACTIVITIES, 'samen'], 'Samen … we graag …', 'Samen drinken we graag koffie in de stad.'),
    ],
    model:
      'Mijn beste vriendin heet Sara. We kennen elkaar van de taalcursus. Ze woont ook in Utrecht. Samen drinken we graag koffie in de stad. Soms gaan we samen naar de film.',
  }),
  krant({
    id: 'land',
    title: 'Mijn land',
    about: 'het land waar u vandaan komt',
    lead: 'Dit is mijn tekst over mijn land:',
    bullets: ['Uit welk land komt u?', 'Wat is mooi in uw land?', 'Wat mist u in Nederland?'],
    points: [
      point('land', 'Which country you come from', ['kom uit', 'geboren', 'land', 'india', 'marokko', 'turkije', 'syrië', 'polen', 'china', 'eritrea', 'oekraïne'], 'Ik kom uit …', 'Ik kom uit India.'),
      point('mooi', 'What is beautiful there', ['mooi', 'natuur', 'berg', 'zee', 'strand', 'eten', 'weer', 'zon', 'warm', 'tempel', 'mensen', 'feest'], 'In mijn land is … mooi.', 'In mijn land zijn de bergen en de zee heel mooi.'),
      point('missen', 'What you miss in the Netherlands', ['mis', 'jammer', 'familie', 'eten', 'zon', 'warm', 'weer'], 'In Nederland mis ik …', 'In Nederland mis ik vooral mijn familie en de zon.'),
    ],
    model:
      'Ik kom uit India. Ik woon nu drie jaar in Nederland. In mijn land zijn de bergen en de zee heel mooi. Het eten is ook erg lekker. In Nederland mis ik vooral mijn familie en de zon.',
  }),
  krant({
    id: 'nederlands',
    title: 'Nederlands leren',
    about: 'hoe u Nederlands leert',
    lead: 'Dit is mijn tekst over Nederlands leren:',
    bullets: ['Hoe leert u Nederlands?', 'Wat vindt u moeilijk?', 'Waarom leert u Nederlands?'],
    points: [
      point('hoe', 'How you learn Dutch', ['cursus', 'les', 'school', 'app', 'boek', 'lees', 'luister', 'praat', 'oefen', 'docent', 'leraar', 'tv', 'televisie', 'radio', 'kijk'], 'Ik leer Nederlands met …', 'Ik leer Nederlands op een cursus en met een app.'),
      point('moeilijk', 'What you find hard', ['moeilijk', 'lastig', 'snel', 'uitspraak', 'woorden', 'grammatica', 'schrijven', 'luisteren', 'spreken'], 'Ik vind … moeilijk.', 'Ik vind luisteren moeilijk, want mensen praten snel.'),
      point('waarom', 'Why you learn it', ['omdat', 'want', 'werk', 'examen', 'inburger', 'wonen', 'woon', 'buren', 'kinderen'], 'Ik leer Nederlands, omdat …', 'Ik leer Nederlands, omdat ik hier wil blijven wonen.'),
    ],
    model:
      'Ik leer Nederlands op een cursus en met een app. Elke avond kijk ik ook naar het nieuws. Ik vind luisteren moeilijk, want mensen praten snel. Ik leer Nederlands, omdat ik hier wil blijven wonen.',
  }),
  krant({
    id: 'dier',
    title: 'Een dier',
    about: 'een dier dat u leuk vindt',
    lead: 'Dit is mijn tekst over een dier dat ik leuk vind:',
    bullets: ['Welk dier vindt u leuk?', 'Hoe ziet het dier eruit?', 'Waarom vindt u dit dier leuk?'],
    points: [
      point('welk', 'Which animal', ['hond', 'kat', 'poes', 'konijn', 'vogel', 'paard', 'vis', 'olifant', 'dier', 'koe', 'schaap', 'geit'], 'Ik vind … leuk.', 'Ik vind katten het leukste dier.'),
      point('eruit', 'What it looks like', [...COLOURS, 'groot', 'klein', 'zacht', 'lang', 'kort', 'haar', 'ogen', 'oren', 'staart', 'dik', 'dun'], 'Mijn … is …', 'Mijn kat is klein en grijs, met groene ogen.'),
      point('waarom', 'Why you like it', ['omdat', 'want', 'lief', 'grappig', 'rustig', 'slim', 'gezellig', 'mooi', 'zacht'], 'Ik vind … leuk, omdat …', 'Ik vind katten leuk, omdat ze rustig en lief zijn.'),
    ],
    model:
      'Ik vind katten het leukste dier. Ik heb zelf ook een kat. Mijn kat is klein en grijs, met groene ogen. Ik vind katten leuk, omdat ze rustig en lief zijn. Na mijn werk zit ze vaak bij mij op de bank.',
  }),
  krant({
    id: 'muziek',
    title: 'Muziek',
    about: 'muziek',
    lead: 'Dit is mijn tekst over muziek:',
    bullets: ['Naar welke muziek luistert u graag?', 'Wanneer luistert u naar muziek?', 'Speelt u zelf muziek?'],
    points: [
      point('welke', 'Which music you like', ['pop', 'rock', 'jazz', 'klassiek', 'hiphop', 'rap', 'dance', 'indiase', 'nederlandse', 'liedjes', 'zanger', 'zangeres', 'band'], 'Ik luister graag naar …', 'Ik luister graag naar popmuziek en oude Indiase liedjes.'),
      point('wanneer', 'When you listen to it', [...TIME, 'als ', 'tijdens', 'onderweg', 'trein', 'fiets', 'koken'], 'Ik luister vooral naar muziek …', 'Ik luister vooral naar muziek in de trein.'),
      point('spelen', 'Whether you play music yourself', ['speel', 'spelen', 'gitaar', 'piano', 'zing', 'instrument', 'drum', 'viool', 'nee', 'niet', 'geen'], 'Ik speel zelf …', 'Ik speel zelf een beetje gitaar.'),
    ],
    model:
      'Ik luister graag naar popmuziek en oude Indiase liedjes. Ik luister vooral naar muziek in de trein en bij het koken. Ik speel zelf een beetje gitaar. Ik wil ook graag piano leren spelen.',
  }),
  krant({
    id: 'plek',
    title: 'Mijn lievelingsplek',
    about: 'een plek in uw stad waar u graag bent',
    lead: 'Dit is mijn tekst over mijn lievelingsplek:',
    bullets: ['Wat is uw lievelingsplek in de stad?', 'Wat doet u daar?', 'Waarom vindt u het daar fijn?'],
    points: [
      point('plek', 'Your favourite place', [...PLACES, 'plek', 'plein', 'haven', 'water', 'brug', 'museum'], 'Mijn lievelingsplek is …', 'Mijn lievelingsplek is het park bij het station.'),
      point('doen', 'What you do there', [...ACTIVITIES, 'zit', 'kijk'], 'Daar … ik …', 'Daar lees ik een boek of ik kijk naar de eenden.'),
      point('waarom', 'Why you like it there', ['omdat', 'want', 'rustig', 'mooi', 'groen', 'stil', 'fijn', 'gezellig', 'water', 'natuur', 'bomen'], 'Ik vind het daar fijn, omdat …', 'Ik vind het daar fijn, omdat het er rustig en groen is.'),
    ],
    model:
      'Mijn lievelingsplek is het park bij het station. Er is een grote vijver met eenden. Daar lees ik een boek of ik kijk naar de eenden. Ik vind het daar fijn, omdat het er rustig en groen is.',
  }),
  krant({
    id: 'nederland',
    title: 'Wonen in Nederland',
    about: 'wat u van Nederland vindt',
    lead: 'Dit is mijn tekst over wonen in Nederland:',
    bullets: ['Hoe lang woont u al in Nederland?', 'Wat vindt u leuk aan Nederland?', 'Wat vindt u moeilijk in Nederland?'],
    points: [
      point('hoelang', 'How long you have lived here', ['[0-9]', 'jaar', 'jaren', 'maand', 'sinds', 'twee', 'drie', 'vier', 'vijf', 'lang', 'kort'], 'Ik woon al … in Nederland.', 'Ik woon al drie jaar in Nederland.'),
      point('leuk', 'What you like about it', ['leuk', 'fijn', 'mooi', 'fiets', 'veilig', 'rustig', 'vriendelijk', 'goed', 'groen', 'natuur', 'op tijd'], 'Ik vind het leuk dat …', 'Ik vind het leuk dat iedereen hier fietst.'),
      point('moeilijk', 'What you find hard', ['moeilijk', 'lastig', 'weer', 'regen', 'koud', 'taal', 'mis', 'alleen', 'duur'], '… vind ik moeilijk.', 'Het weer vind ik moeilijk, want het regent vaak.'),
    ],
    model:
      'Ik woon al drie jaar in Nederland. Ik vind het leuk dat iedereen hier fietst. Ook zijn de mensen vriendelijk. Het weer vind ik moeilijk, want het regent vaak. Een huis vinden is ook lastig.',
  }),
  krant({
    id: 'school',
    title: 'Mijn school vroeger',
    about: 'uw school van vroeger',
    lead: 'Dit is mijn tekst over mijn school van vroeger:',
    bullets: ['Waar ging u naar school?', 'Welk vak vond u leuk?', 'Wat deed u in de pauze?'],
    points: [
      point('waar', 'Where you went to school', ['school', 'stad', 'dorp', 'india', 'land', 'ging', 'dichtbij', 'ver'], 'Ik ging naar school in …', 'Ik ging naar school in een kleine stad in India.'),
      point('vak', 'Which subject you liked', ['vak', 'wiskunde', 'rekenen', 'engels', 'taal', 'geschiedenis', 'aardrijkskunde', 'biologie', 'tekenen', 'gym', 'sport', 'muziek'], '… vond ik het leukste vak.', 'Wiskunde vond ik het leukste vak.'),
      point('pauze', 'What you did in the break', ['speel', 'speelde', 'aten', 'praat', 'voetbal', 'cricket', 'buiten', 'vrienden', 'pauze'], 'In de pauze … we …', 'In de pauze speelden we cricket op het plein.'),
    ],
    model:
      'Ik ging naar school in een kleine stad in India. De school was groot en oud. Wiskunde vond ik het leukste vak. In de pauze speelden we cricket op het plein.',
  }),
  krant({
    id: 'plannen',
    title: 'Mijn plannen',
    about: 'uw plannen voor de toekomst',
    lead: 'Dit is mijn tekst over mijn plannen:',
    bullets: ['Wat wilt u volgend jaar doen?', 'Waar wilt u later wonen?', 'Wat wilt u nog leren?'],
    points: [
      point('volgend', 'What you want to do next year', ['volgend jaar', 'wil', 'ga', 'plan', 'examen', 'werk', 'reis', 'verhuis'], 'Volgend jaar wil ik …', 'Volgend jaar wil ik mijn examen halen.'),
      point('wonen', 'Where you want to live later', ['woon', 'wonen', 'huis', 'stad', 'dorp', 'nederland', 'utrecht', 'amsterdam', 'buiten', 'tuin'], 'Later wil ik in … wonen.', 'Later wil ik in een huis met een tuin wonen.'),
      point('leren', 'What you still want to learn', ['leren', 'leer', 'cursus', 'opleiding', 'studie', 'rijbewijs', 'auto', 'zwemmen', 'koken', 'taal', 'nederlands', 'piano', 'gitaar'], 'Ik wil nog … leren.', 'Ik wil nog autorijden leren.'),
    ],
    model:
      'Volgend jaar wil ik mijn examen halen. Ook wil ik dan beter Nederlands spreken. Later wil ik in een huis met een tuin wonen. Ik wil nog autorijden leren, want ik heb nog geen rijbewijs.',
  }),
]

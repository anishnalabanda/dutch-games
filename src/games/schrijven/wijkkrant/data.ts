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
]

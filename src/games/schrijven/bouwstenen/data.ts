export interface BlockOption {
  text: string
  ok: boolean
  /** Why this block is wrong: shown in the feedback when it is picked. */
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
  'Een bericht heeft vier delen in vaste volgorde: aanhef, reden, verzoek of mededeling, afsluiting. Alle vier moeten bij dezelfde ontvanger passen.'

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
          { text: 'Hoi Jan,', ok: false, why: 'Te informeel: je baas spreek je aan met meneer en u.' },
          { text: 'Beste klant,', ok: false, why: 'Verkeerde ontvanger, dit bericht gaat naar je leidinggevende.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik ben vandaag ziek. Ik heb griep en koorts.', ok: true, why: '' },
          { text: 'Ik heb vandaag geen zin om te komen.', ok: false, why: 'Dit is geen ziekmelding en niet beleefd.' },
          { text: 'Ik wil graag een nieuwe afspraak maken.', ok: false, why: 'Dit hoort bij een afspraak verzetten, niet bij een ziekmelding.' },
        ],
      },
      {
        label: 'Mededeling',
        gloss: 'what happens next',
        options: [
          { text: 'Ik kan daarom niet naar mijn werk komen. Morgenochtend bel ik u weer.', ok: true, why: '' },
          { text: 'Kun je mijn werk vandaag overnemen?', ok: false, why: 'Hier staat "je" in een formeel bericht; bij je baas gebruik je u.' },
          { text: 'Ik kom vanmiddag toch even langs.', ok: false, why: 'Dit spreekt de ziekmelding tegen.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: true, why: '' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Te informeel voor een bericht aan je leidinggevende.' },
          { text: 'Doei!', ok: false, why: 'Dit is spreektaal en hoort niet in een formeel bericht.' },
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
          { text: 'Hoi allemaal,', ok: false, why: 'Te informeel voor een praktijk die je niet persoonlijk kent.' },
          { text: 'Lieve tandarts,', ok: false, why: '"Lieve" gebruik je alleen bij familie en vrienden.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik heb donderdag 12 maart om 14.00 uur een afspraak bij u. Ik kan helaas niet komen, omdat ik die dag moet werken.', ok: true, why: '' },
          { text: 'Ik kom niet.', ok: false, why: 'Te kort: de datum en de reden ontbreken.' },
          { text: 'Mijn kies doet al een week pijn.', ok: false, why: 'Dat is een reden voor een afspraak, niet voor het afzeggen ervan.' },
        ],
      },
      {
        label: 'Verzoek',
        gloss: 'request',
        options: [
          { text: 'Kunt u mij een nieuwe afspraak geven? Volgende week donderdag komt het mij goed uit.', ok: true, why: '' },
          { text: 'Kun je me even bellen?', ok: false, why: 'Hier staat "je"; in een formeel bericht gebruik je u.' },
          { text: 'Ik hoop dat het goed met u gaat.', ok: false, why: 'Dit is geen verzoek, de vraag om een nieuwe afspraak ontbreekt dan.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: true, why: '' },
          { text: 'Tot snel!', ok: false, why: 'Te informeel, en je weet nog niet wanneer je komt.' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Te informeel voor een praktijk.' },
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
          { text: 'Geachte mevrouw,', ok: false, why: 'Te formeel voor een buurvrouw die je goed kent.' },
          { text: 'Aan de bewoner van nummer 14,', ok: false, why: 'Dat is een adressering, geen aanhef voor een buurvrouw.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Heel erg bedankt dat je vorige week op de planten hebt gepast.', ok: true, why: '' },
          { text: 'Hierbij bevestig ik de ontvangst van uw diensten.', ok: false, why: 'Veel te formeel en onnatuurlijk voor een buurvrouw.' },
          { text: 'Kun je volgende week weer op de planten passen?', ok: false, why: 'Dat is een nieuw verzoek, geen bedankje.' },
        ],
      },
      {
        label: 'Aanbod',
        gloss: 'offer',
        options: [
          { text: 'Als jij een keer weg bent, doe ik het graag voor jou.', ok: true, why: '' },
          { text: 'Als u een keer weg bent, doe ik het graag voor u.', ok: false, why: 'Hier staat "u" terwijl de rest informeel is; houd één register vol.' },
          { text: 'Ik verwacht uw antwoord binnen veertien dagen.', ok: false, why: 'Dit hoort in een zakelijke brief, niet in een bedankje.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Groetjes,\nAnish', ok: true, why: '' },
          { text: 'Hoogachtend,\nA. Nalabanda', ok: false, why: 'Veel te formeel voor je buurvrouw.' },
          { text: 'Met vriendelijke groet,\nAnish Nalabanda', ok: false, why: 'Netjes, maar te zakelijk naast een informele aanhef als "Hoi Anna".' },
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
          { text: 'Geachte heer,', ok: false, why: 'Veel te formeel voor een vriend.' },
          { text: 'Beste meneer Sam,', ok: false, why: '"Meneer" gebruik je niet bij een vriend.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'Ik ben zaterdag jarig en ik geef een klein feestje.', ok: true, why: '' },
          { text: 'Hierbij nodig ik u uit voor een bijeenkomst.', ok: false, why: 'Dit is zakelijke taal; bij een vriend schrijf je gewoon.' },
          { text: 'Ik kan zaterdag helaas niet komen.', ok: false, why: 'Dat is een afzegging, geen uitnodiging.' },
        ],
      },
      {
        label: 'Informatie',
        gloss: 'the details',
        options: [
          { text: 'Kom je ook? Het begint om 20.00 uur bij mij thuis.', ok: true, why: '' },
          { text: 'Komt u ook? Het begint om 20.00 uur.', ok: false, why: 'Hier staat "u" in een informeel bericht aan een vriend.' },
          { text: 'Het feest is ergens in het weekend.', ok: false, why: 'Te vaag: tijd en plaats moeten erin staan.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Laat je even weten of je komt?\n\nGroetjes,\nAnish', ok: true, why: '' },
          { text: 'Ik zie uw reactie graag tegemoet.\n\nHoogachtend,\nA. Nalabanda', ok: false, why: 'Zakelijke taal in een bericht aan een vriend.' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'De afsluiting is goed, maar de gevraagde reactie ontbreekt.' },
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
          { text: 'Hallo,', ok: false, why: 'Te informeel voor je verhuurder.' },
          { text: 'Beste buren,', ok: false, why: 'Verkeerde ontvanger.' },
        ],
      },
      {
        label: 'Reden',
        gloss: 'reason',
        options: [
          { text: 'De verwarming in mijn woning is kapot. Het is sinds maandag koud in huis.', ok: true, why: '' },
          { text: 'Er is iets aan de hand met het huis.', ok: false, why: 'Te vaag: zeg precies wat er kapot is.' },
          { text: 'Ik wil de huur opzeggen.', ok: false, why: 'Dat is een heel ander bericht.' },
        ],
      },
      {
        label: 'Verzoek',
        gloss: 'request',
        options: [
          { text: 'Kunt u een monteur sturen? Ik ben op werkdagen na 17.00 uur thuis.', ok: true, why: '' },
          { text: 'Stuur snel iemand.', ok: false, why: 'Te kort en onbeleefd voor een formeel bericht.' },
          { text: 'Kun je even langskomen?', ok: false, why: 'Hier staat "je"; bij je verhuurder gebruik je u.' },
        ],
      },
      {
        label: 'Afsluiting',
        gloss: 'closing',
        options: [
          { text: 'Met vriendelijke groet,\nAnish Nalabanda\nKerkstraat 12, Utrecht', ok: true, why: '' },
          { text: 'Groetjes,\nAnish', ok: false, why: 'Te informeel, en je adres ontbreekt bij een klacht over je woning.' },
          { text: 'Bedankt alvast!', ok: false, why: 'Vriendelijk, maar een afsluiting met je naam ontbreekt.' },
        ],
      },
    ],
  },
]

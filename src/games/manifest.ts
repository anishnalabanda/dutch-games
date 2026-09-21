import type { ComponentType } from 'react'
import type { GameMeta } from './types'
import { ZinnenBouwen } from './schrijven/zinnen/ZinnenBouwen'
import { WerkwoordenNu } from './schrijven/werkwoorden/WerkwoordenNu'
import { GisterenGedaan } from './schrijven/voltooid/GisterenGedaan'
import { Spellingmachine } from './schrijven/spelling/Spellingmachine'
import { NietOfGeen } from './schrijven/nietgeen/NietOfGeen'
import { Verbindingswoorden } from './schrijven/voegwoorden/Verbindingswoorden'
import { VragenStellen } from './schrijven/vragen/VragenStellen'
import { UofJe } from './schrijven/uofje/UofJe'
import { FormulierInvullen } from './schrijven/formulier/FormulierInvullen'
import { BerichtBouwstenen } from './schrijven/bouwstenen/BerichtBouwstenen'
import { Woordenschat } from './schrijven/woorden/Woordenschat'
import { Voorzetsels } from './schrijven/voorzetsels/Voorzetsels'
import { DeOfHet } from './schrijven/dehet/DeOfHet'
import { Schrijfopdracht } from './schrijven/examen/Schrijfopdracht'

// Item counts come from the games' own data, so the hub and the exam page can
// never quote a total the game does not actually have.
import { sentences } from './schrijven/zinnen/data'
import { items as werkwoorden } from './schrijven/werkwoorden/data'
import { items as voltooid } from './schrijven/voltooid/data'
import { items as spelling } from './schrijven/spelling/data'
import { items as nietgeen } from './schrijven/nietgeen/data'
import { items as voegwoorden } from './schrijven/voegwoorden/data'
import { items as vragen } from './schrijven/vragen/data'
import { messages } from './schrijven/uofje/data'
import { personas } from './schrijven/formulier/data'
import { situations } from './schrijven/bouwstenen/data'
import { items as woorden } from './schrijven/woorden/data'
import { items as voorzetsels } from './schrijven/voorzetsels/data'
import { items as dehet } from './schrijven/dehet/data'
import { stems, tasks } from './schrijven/examen/data'

export interface RegisteredGame extends GameMeta {
  component: ComponentType
}

// Central manifest: every game registers itself here, and the hub / per-exam
// pages derive their "X of Y done" counters and routes from this list.
export const games: RegisteredGame[] = [
  {
    id: 'nl.schrijven.zinnen',
    exam: 'schrijven',
    title: 'Zinnen bouwen',
    subtitle: 'Sentence word order',
    core: true,
    total: sentences.length,
    component: ZinnenBouwen,
  },
  {
    id: 'nl.schrijven.werkwoorden',
    exam: 'schrijven',
    title: 'Werkwoorden nu',
    subtitle: 'Present tense',
    core: true,
    total: werkwoorden.length,
    component: WerkwoordenNu,
  },
  {
    id: 'nl.schrijven.voltooid',
    exam: 'schrijven',
    title: 'Gisteren gedaan',
    subtitle: 'Perfect tense',
    core: true,
    total: voltooid.length,
    component: GisterenGedaan,
  },
  {
    id: 'nl.schrijven.spelling',
    exam: 'schrijven',
    title: 'Spellingmachine',
    subtitle: 'Spelling rules',
    core: true,
    total: spelling.length,
    component: Spellingmachine,
  },
  {
    id: 'nl.schrijven.nietgeen',
    exam: 'schrijven',
    title: 'Niet of geen',
    subtitle: 'Negation',
    core: true,
    total: nietgeen.length,
    component: NietOfGeen,
  },
  {
    id: 'nl.schrijven.voegwoorden',
    exam: 'schrijven',
    title: 'Verbindingswoorden',
    subtitle: 'Connectors',
    core: true,
    total: voegwoorden.length,
    component: Verbindingswoorden,
  },
  {
    id: 'nl.schrijven.vragen',
    exam: 'schrijven',
    title: 'Vragen stellen',
    subtitle: 'Asking questions',
    core: true,
    total: vragen.length,
    component: VragenStellen,
  },
  {
    id: 'nl.schrijven.uofje',
    exam: 'schrijven',
    title: 'U of je',
    subtitle: 'Register',
    core: true,
    total: messages.length,
    component: UofJe,
  },
  {
    id: 'nl.schrijven.formulier',
    exam: 'schrijven',
    title: 'Formulier invullen',
    subtitle: 'Filling in forms',
    core: true,
    total: personas.length,
    component: FormulierInvullen,
  },
  {
    id: 'nl.schrijven.bouwstenen',
    exam: 'schrijven',
    title: 'Bericht bouwstenen',
    subtitle: 'Message building blocks',
    core: true,
    total: situations.length,
    component: BerichtBouwstenen,
  },
  {
    id: 'nl.schrijven.woorden',
    exam: 'schrijven',
    title: 'Woordenschat per thema',
    subtitle: 'Productive vocabulary',
    core: true,
    total: woorden.length,
    component: Woordenschat,
  },
  {
    id: 'nl.schrijven.voorzetsels',
    exam: 'schrijven',
    title: 'Op maandag om negen uur',
    subtitle: 'Prepositions, dates and times',
    core: true,
    total: voorzetsels.length,
    component: Voorzetsels,
  },
  {
    id: 'nl.schrijven.dehet',
    exam: 'schrijven',
    title: 'De of het',
    subtitle: 'Articles and adjectives',
    core: false,
    total: dehet.length,
    component: DeOfHet,
  },
  {
    id: 'nl.schrijven.examen',
    exam: 'schrijven',
    title: 'Schrijfopdracht',
    subtitle: 'Full writing task',
    core: true,
    total: stems.length + tasks.length,
    component: Schrijfopdracht,
  },
]

export function gameSlug(id: string): string {
  return id.split('.').pop() ?? id
}

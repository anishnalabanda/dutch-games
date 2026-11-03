import type { GlossEntry } from '../glossary'
import * as geografie from './gloss/geografie'
import * as gezondheid from './gloss/gezondheid'
import * as instanties from './gloss/instanties'
import * as staat from './gloss/staat'
import * as onderwijs from './gloss/onderwijs'
import * as wonen from './gloss/wonen'
import * as werk from './gloss/werk'
import * as omgang from './gloss/omgang'

const parts = [geografie, gezondheid, instanties, staat, onderwijs, wonen, werk, omgang]

/**
 * The KNM questions' own words, kept apart from the main glossary only for
 * size: `lookupWord` reads both, so they behave as one glossary. A word the
 * main glossary already has is never repeated here.
 */
export const knmGlossary: Record<string, GlossEntry> = Object.assign({}, ...parts.map((p) => p.gloss))

/** Names of people, places and organisations in the questions: shown without a gloss. */
export const knmNames: ReadonlySet<string> = new Set(parts.flatMap((p) => p.names.map((n) => n.toLowerCase())))

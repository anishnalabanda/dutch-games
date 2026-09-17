export type Theme = 'werk' | 'gezondheid' | 'wonen' | 'school' | 'afspraken' | 'winkelen'

export interface VocabItem {
  id: string
  theme: Theme
  /** English cue: the Dutch is what the owner has to produce. */
  en: string
  /** Model answer, article included where the word takes one. */
  nl: string
  /** Set for nouns, so a bare answer is accepted with a nudge about the article. */
  article?: 'de' | 'het'
  /** Bare form without the article, for nouns. */
  bare?: string
}

export const THEME_LABELS: Record<Theme, string> = {
  werk: 'Werk',
  gezondheid: 'Gezondheid',
  wonen: 'Wonen en buren',
  school: 'School en kinderen',
  afspraken: 'Afspraken',
  winkelen: 'Winkelen',
}

export const items: VocabItem[] = [
  // Werk
  { id: 'v1', theme: 'werk', en: 'the job', nl: 'de baan', article: 'de', bare: 'baan' },
  { id: 'v2', theme: 'werk', en: 'the colleague', nl: 'de collega', article: 'de', bare: 'collega' },
  { id: 'v3', theme: 'werk', en: 'the boss', nl: 'de baas', article: 'de', bare: 'baas' },
  { id: 'v4', theme: 'werk', en: 'the salary', nl: 'het salaris', article: 'het', bare: 'salaris' },
  { id: 'v5', theme: 'werk', en: 'the meeting', nl: 'de vergadering', article: 'de', bare: 'vergadering' },
  { id: 'v6', theme: 'werk', en: 'the contract', nl: 'het contract', article: 'het', bare: 'contract' },
  { id: 'v7', theme: 'werk', en: 'to work overtime', nl: 'overwerken' },
  { id: 'v8', theme: 'werk', en: 'to report sick', nl: 'ziek melden' },

  // Gezondheid
  { id: 'v9', theme: 'gezondheid', en: 'the GP, family doctor', nl: 'de huisarts', article: 'de', bare: 'huisarts' },
  { id: 'v10', theme: 'gezondheid', en: 'the appointment', nl: 'de afspraak', article: 'de', bare: 'afspraak' },
  { id: 'v11', theme: 'gezondheid', en: 'the pain', nl: 'de pijn', article: 'de', bare: 'pijn' },
  { id: 'v12', theme: 'gezondheid', en: 'the fever', nl: 'de koorts', article: 'de', bare: 'koorts' },
  { id: 'v13', theme: 'gezondheid', en: 'the medicine', nl: 'het medicijn', article: 'het', bare: 'medicijn' },
  { id: 'v14', theme: 'gezondheid', en: 'the pharmacy', nl: 'de apotheek', article: 'de', bare: 'apotheek' },
  { id: 'v15', theme: 'gezondheid', en: 'the hospital', nl: 'het ziekenhuis', article: 'het', bare: 'ziekenhuis' },
  { id: 'v16', theme: 'gezondheid', en: 'ill, sick', nl: 'ziek' },

  // Wonen en buren
  { id: 'v17', theme: 'wonen', en: 'the home, dwelling', nl: 'de woning', article: 'de', bare: 'woning' },
  { id: 'v18', theme: 'wonen', en: 'the rent', nl: 'de huur', article: 'de', bare: 'huur' },
  { id: 'v19', theme: 'wonen', en: 'the landlord', nl: 'de verhuurder', article: 'de', bare: 'verhuurder' },
  { id: 'v20', theme: 'wonen', en: 'the female neighbour', nl: 'de buurvrouw', article: 'de', bare: 'buurvrouw' },
  { id: 'v21', theme: 'wonen', en: 'the heating', nl: 'de verwarming', article: 'de', bare: 'verwarming' },
  { id: 'v22', theme: 'wonen', en: 'the key', nl: 'de sleutel', article: 'de', bare: 'sleutel' },
  { id: 'v23', theme: 'wonen', en: 'the letterbox', nl: 'de brievenbus', article: 'de', bare: 'brievenbus' },
  { id: 'v24', theme: 'wonen', en: 'to move house', nl: 'verhuizen' },

  // School en kinderen
  { id: 'v25', theme: 'school', en: 'the homework', nl: 'het huiswerk', article: 'het', bare: 'huiswerk' },
  { id: 'v26', theme: 'school', en: 'the class', nl: 'de klas', article: 'de', bare: 'klas' },
  { id: 'v27', theme: 'school', en: 'the teacher', nl: 'de leraar', article: 'de', bare: 'leraar' },
  { id: 'v28', theme: 'school', en: 'the parents evening', nl: 'de ouderavond', article: 'de', bare: 'ouderavond' },
  { id: 'v29', theme: 'school', en: 'the child', nl: 'het kind', article: 'het', bare: 'kind' },
  { id: 'v30', theme: 'school', en: 'the lesson', nl: 'de les', article: 'de', bare: 'les' },
  { id: 'v31', theme: 'school', en: 'the report card', nl: 'het rapport', article: 'het', bare: 'rapport' },
  { id: 'v32', theme: 'school', en: 'to pick up (a child)', nl: 'ophalen' },

  // Afspraken
  { id: 'v33', theme: 'afspraken', en: 'to cancel', nl: 'afzeggen' },
  { id: 'v34', theme: 'afspraken', en: 'to reschedule, to move', nl: 'verzetten' },
  { id: 'v35', theme: 'afspraken', en: 'on time', nl: 'op tijd' },
  { id: 'v36', theme: 'afspraken', en: 'too late', nl: 'te laat' },
  { id: 'v37', theme: 'afspraken', en: 'to confirm', nl: 'bevestigen' },
  { id: 'v38', theme: 'afspraken', en: 'the conversation', nl: 'het gesprek', article: 'het', bare: 'gesprek' },
  { id: 'v39', theme: 'afspraken', en: 'the diary, calendar', nl: 'de agenda', article: 'de', bare: 'agenda' },
  { id: 'v40', theme: 'afspraken', en: 'to drop by', nl: 'langskomen' },

  // Winkelen
  { id: 'v41', theme: 'winkelen', en: 'the groceries', nl: 'de boodschappen', article: 'de', bare: 'boodschappen' },
  { id: 'v42', theme: 'winkelen', en: 'the price', nl: 'de prijs', article: 'de', bare: 'prijs' },
  { id: 'v43', theme: 'winkelen', en: 'the checkout', nl: 'de kassa', article: 'de', bare: 'kassa' },
  { id: 'v44', theme: 'winkelen', en: 'the receipt', nl: 'de bon', article: 'de', bare: 'bon' },
  { id: 'v45', theme: 'winkelen', en: 'to pay', nl: 'betalen' },
  { id: 'v46', theme: 'winkelen', en: 'the discount', nl: 'de korting', article: 'de', bare: 'korting' },
  { id: 'v47', theme: 'winkelen', en: 'the money', nl: 'het geld', article: 'het', bare: 'geld' },
  { id: 'v48', theme: 'winkelen', en: 'to exchange', nl: 'ruilen' },
]

/** Seconds on the clock before the row flips and shows the answer. */
export const SECONDS_PER_ITEM = 25

/**
 * One fixed frame per exam task type, the way people who passed prepared:
 * learn it by heart, then fit each task's bullets into its gaps. Shown as a
 * card above the writing space in the four exam-task games.
 */

export interface TemplateLine {
  /** Dutch, with … for the gap. */
  nl: string
  /** English: what the line is for. */
  role: string
}

export interface Template {
  /** English: the card's heading. */
  title: string
  lines: TemplateLine[]
  /** English: how to use it. */
  note: string
}

export const FORMAL_TEMPLATE: Template = {
  title: 'Your template for every formal e-mail',
  lines: [
    { nl: 'Ik stuur u deze e-mail, omdat …', role: 'why you write' },
    { nl: 'Ik kan … niet komen, want …', role: 'what happens, and the reason' },
    { nl: 'Het spijt me.', role: 'when the task asks you to apologise' },
    { nl: 'Kunt u …?', role: 'what you ask for' },
    { nl: 'Kunnen we op … afspreken?', role: 'a new day and date' },
    { nl: 'Ik hoor graag van u.', role: 'a polite last line' },
  ],
  note: 'Use the lines the bullets need and drop the rest: every bullet still needs its own sentence. Write u and uw throughout.',
}

export const INFORMAL_TEMPLATE: Template = {
  title: 'Your template for every informal message',
  lines: [
    { nl: 'Ik mail je, omdat …', role: 'why you write' },
    { nl: 'Ik wil graag …, want …', role: 'what you want, and the reason' },
    { nl: 'Kun jij …?', role: 'what you ask' },
    { nl: 'Wil jij …?', role: 'a task, in a note from pictures: one line per picture' },
    { nl: 'Ik kan … wel …', role: 'what you offer instead' },
    { nl: 'Alvast bedankt!', role: 'a friendly last line, unless it is printed already' },
  ],
  note: 'Use the lines the bullets need and drop the rest: every bullet still needs its own sentence. Write je and jij throughout.',
}

export const KRANT_TEMPLATE: Template = {
  title: 'Your template for every wijkkrant text',
  lines: [
    { nl: 'In het weekend … ik graag …', role: 'question 1, with its own words; the verb comes before ik' },
    { nl: 'Ik … dat met …', role: 'who' },
    { nl: 'Ik … dat in …', role: 'where' },
    { nl: 'Ik vind het leuk, omdat …', role: 'why; after omdat the verb goes last' },
  ],
  note: 'One sentence per question, made from the question\'s own words: "Wat doet u graag?" becomes "Ik … graag …". Always ik, never u.',
}

export const FORM_TEMPLATE: Template = {
  title: 'Your template for every open question on a form',
  lines: [
    { nl: 'Ik wil …, omdat …', role: 'Waarom …?' },
    { nl: 'Ik kan op … om … uur.', role: 'Wanneer …?' },
    { nl: 'Mijn … is … en …', role: 'Hoe ziet het eruit? A colour, a size' },
    { nl: 'Het is … om … uur gebeurd.', role: 'Wanneer is het gebeurd?' },
    { nl: 'Ja, ik … / Nee, ik … geen …', role: 'a yes/no question' },
  ],
  note: 'Repeat the words of the question in your answer: then the sentence almost writes itself, with the verb in the right place.',
}

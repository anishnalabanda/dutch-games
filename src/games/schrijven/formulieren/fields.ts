/**
 * How a personal field on a form is checked. There is no source text to copy
 * from, as on the exam: the owner fills in their own details (or made-up ones),
 * so a field is checked for its format, never against an expected value.
 */
export type FieldKind =
  | 'name'
  | 'fullname'
  | 'place'
  | 'street'
  | 'birthdate'
  | 'today'
  | 'postcode'
  | 'bsn'
  | 'tel'
  | 'email'
  | 'nationality'

export interface FormField {
  id: string
  /** Dutch, as printed on the form. */
  label: string
  /** English, as its tooltip. */
  gloss: string
  kind: FieldKind
}

export const FORMAT_HELP: Record<FieldKind, string> = {
  name: 'Start a name with a capital letter. A tussenvoegsel like van or de may stay small.',
  fullname: 'Write first name and surname, each with a capital letter.',
  place: 'A place name starts with a capital letter.',
  street: 'Street name first, with a capital letter, then the house number.',
  birthdate: 'Write a date as dd-mm-jjjj, day first. A date of birth is in the past.',
  today: "Here the form wants today's date, written as dd-mm-jjjj, day first.",
  postcode: 'A Dutch postcode is 4 digits, a space and 2 capital letters.',
  bsn: 'A burgerservicenummer has exactly 9 digits. Make one up for practice.',
  tel: 'A Dutch phone number has 10 digits and starts with 0.',
  email: 'An email address has one @ and a dot after it, in small letters.',
  nationality: 'Write the nationality as an adjective with a capital letter.',
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export function formatDate(date: Date): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`
}

/** A value in the right format, for the last hint step. */
export function sampleValue(kind: FieldKind, today: Date): string {
  switch (kind) {
    case 'name':
      return 'Sara'
    case 'fullname':
      return 'Sara Haddad'
    case 'place':
      return 'Utrecht'
    case 'street':
      return 'Kerkstraat 12'
    case 'birthdate':
      return '03-03-1990'
    case 'today':
      return formatDate(today)
    case 'postcode':
      return '3512 AB'
    case 'bsn':
      return '123456782'
    case 'tel':
      return '06-12345678'
    case 'email':
      return 'sara.haddad@mail.nl'
    case 'nationality':
      return 'Indiase'
  }
}

const TUSSENVOEGSEL = /^(van|de|der|den|te|ter|ten|het|'t|in|op|von|el|al)\s+/i
const CAPITALISED = /^[A-ZÀ-Þ'][A-Za-zÀ-ÿ'’-]*$/

/** Each word of a name capitalised, after any tussenvoegsel at the front. */
function isName(value: string): boolean {
  let rest = value
  while (TUSSENVOEGSEL.test(rest)) rest = rest.replace(TUSSENVOEGSEL, '')
  const parts = rest.split(/\s+/).filter(Boolean)
  return parts.length > 0 && parts.every((part) => CAPITALISED.test(part) || TUSSENVOEGSEL.test(`${part} `))
}

/** Reads dd-mm-jjjj (one-digit day and month allowed) into a date, or null. */
export function parseDate(value: string): Date | null {
  const match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(value)
  if (!match) return null
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)
  const real = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  return real && year >= 1900 ? date : null
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Checks a typed personal field for its format. `today` is the device's date. */
export function fieldValid(kind: FieldKind, input: string, today: Date): boolean {
  const value = input.trim().replace(/\s+/g, ' ')
  if (value === '') return false
  switch (kind) {
    case 'name':
      return isName(value)
    case 'fullname':
      return value.split(' ').length >= 2 && isName(value.split(' ')[0]) && isName(value.split(' ').slice(1).join(' '))
    case 'place':
      return /^('s-)?[A-ZÀ-Þ][A-Za-zÀ-ÿ'’ -]*$/.test(value)
    case 'street':
      return /^[A-ZÀ-Þ'][A-Za-zÀ-ÿ'’. -]* \d+ ?[a-zA-Z]?(-\d+)?$/.test(value)
    case 'birthdate': {
      const date = parseDate(value)
      return date !== null && date < today
    }
    case 'today': {
      const date = parseDate(value)
      return date !== null && sameDay(date, today)
    }
    case 'postcode':
      return /^[1-9]\d{3} [A-Z]{2}$/.test(value)
    case 'bsn':
      return /^\d{9}$/.test(value.replace(/ /g, ''))
    case 'tel': {
      if (!/^[0-9 +-]+$/.test(value)) return false
      const digits = value.replace(/\D/g, '')
      return (digits.length === 10 && digits.startsWith('0')) || (digits.length === 11 && digits.startsWith('31'))
    }
    case 'email':
      return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
    case 'nationality':
      return CAPITALISED.test(value)
  }
}

// --- The fields forms share -------------------------------------------------

export const naam: FormField = { id: 'naam', label: 'Voor- en achternaam', gloss: 'first name and surname', kind: 'fullname' }
export const adres: FormField = { id: 'adres', label: 'Adres', gloss: 'address: street and house number', kind: 'street' }
export const postcode: FormField = { id: 'postcode', label: 'Postcode', gloss: 'postal code', kind: 'postcode' }
export const woonplaats: FormField = { id: 'woonplaats', label: 'Woonplaats', gloss: 'town you live in', kind: 'place' }
export const telefoon: FormField = { id: 'telefoon', label: 'Telefoonnummer', gloss: 'phone number', kind: 'tel' }
export const email: FormField = { id: 'email', label: 'E-mail', gloss: 'email address', kind: 'email' }
export const geboortedatum: FormField = { id: 'geboortedatum', label: 'Geboortedatum', gloss: 'date of birth', kind: 'birthdate' }
export const nationaliteit: FormField = { id: 'nationaliteit', label: 'Nationaliteit', gloss: 'nationality', kind: 'nationality' }
export const bsn: FormField = { id: 'bsn', label: 'Burgerservicenummer', gloss: 'citizen service number (BSN)', kind: 'bsn' }
export const datum: FormField = { id: 'datum', label: 'Datum', gloss: "date: today's", kind: 'today' }

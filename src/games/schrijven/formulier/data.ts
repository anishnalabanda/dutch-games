export type FieldType = 'text' | 'date' | 'postcode' | 'bsn' | 'tel' | 'email'

export interface FormField {
  id: string
  label: string
  gloss: string
  placeholder: string
  type: FieldType
}

export interface Persona {
  id: string
  /** Everything the form asks for, written out in Dutch prose. */
  intro: string[]
  values: Record<string, string>
}

/** The field set DUO forms keep coming back to. */
export const fields: FormField[] = [
  { id: 'voornaam', label: 'Voornaam', gloss: 'first name', placeholder: 'Sara', type: 'text' },
  {
    id: 'achternaam',
    label: 'Achternaam',
    gloss: 'surname',
    placeholder: 'Haddad',
    type: 'text',
  },
  {
    id: 'geboortedatum',
    label: 'Geboortedatum',
    gloss: 'date of birth',
    placeholder: 'dd-mm-jjjj',
    type: 'date',
  },
  {
    id: 'geboorteplaats',
    label: 'Geboorteplaats',
    gloss: 'place of birth',
    placeholder: 'Casablanca',
    type: 'text',
  },
  {
    id: 'nationaliteit',
    label: 'Nationaliteit',
    gloss: 'nationality',
    placeholder: 'Nederlandse',
    type: 'text',
  },
  {
    id: 'bsn',
    label: 'Burgerservicenummer',
    gloss: 'citizen service number, 9 digits',
    placeholder: '123456789',
    type: 'bsn',
  },
  {
    id: 'adres',
    label: 'Straat en huisnummer',
    gloss: 'street and house number',
    placeholder: 'Kerkstraat 12',
    type: 'text',
  },
  {
    id: 'postcode',
    label: 'Postcode',
    gloss: 'postal code, 4 digits and 2 letters',
    placeholder: '1234 AB',
    type: 'postcode',
  },
  { id: 'woonplaats', label: 'Woonplaats', gloss: 'town of residence', placeholder: 'Utrecht', type: 'text' },
  {
    id: 'telefoonnummer',
    label: 'Telefoonnummer',
    gloss: 'phone number',
    placeholder: '06-12345678',
    type: 'tel',
  },
  {
    id: 'email',
    label: 'E-mailadres',
    gloss: 'email address',
    placeholder: 'naam@mail.nl',
    type: 'email',
  },
  {
    id: 'datum',
    label: 'Datum van vandaag',
    gloss: "today's date",
    placeholder: 'dd-mm-jjjj',
    type: 'date',
  },
  {
    id: 'handtekening',
    label: 'Handtekening',
    gloss: 'signature, type your full name',
    placeholder: 'Sara Haddad',
    type: 'text',
  },
]

export const FORMAT_HELP: Record<FieldType, string> = {
  text: 'Copy the word exactly, with a capital letter.',
  date: 'On a form a date is written as dd-mm-yyyy: 03-03-1990.',
  postcode: 'A Dutch postcode is 4 digits and 2 letters: 3512 AB.',
  bsn: 'A burgerservicenummer has exactly 9 digits, with no spaces.',
  tel: 'A mobile number starts with 06 and has 10 digits.',
  email: 'An email address is written with an @ and without capitals.',
}

/** Fictional people: the data is invented for practice, not real. */
export const personas: Persona[] = [
  {
    id: 'f1',
    intro: [
      'Je heet Sara Haddad. Je bent geboren op 3 maart 1990 in Casablanca en je hebt de Marokkaanse nationaliteit.',
      'Je burgerservicenummer is 123456782. Je woont op de Kerkstraat 12 in Utrecht, postcode 3512 AB.',
      'Je telefoonnummer is 06-12345678 en je e-mailadres is sara.haddad@mail.nl.',
      'Vandaag is het 12 maart 2026.',
    ],
    values: {
      voornaam: 'Sara',
      achternaam: 'Haddad',
      geboortedatum: '03-03-1990',
      geboorteplaats: 'Casablanca',
      nationaliteit: 'Marokkaanse',
      bsn: '123456782',
      adres: 'Kerkstraat 12',
      postcode: '3512 AB',
      woonplaats: 'Utrecht',
      telefoonnummer: '06-12345678',
      email: 'sara.haddad@mail.nl',
      datum: '12-03-2026',
      handtekening: 'Sara Haddad',
    },
  },
  {
    id: 'f2',
    intro: [
      'Je heet Ahmed Yilmaz. Je bent geboren op 21 juni 1985 in Ankara en je hebt de Turkse nationaliteit.',
      'Je burgerservicenummer is 987654321. Je woont op de Molenweg 5b in Rotterdam, postcode 3011 CD.',
      'Je telefoonnummer is 06-87654321 en je e-mailadres is a.yilmaz@mail.nl.',
      'Vandaag is het 4 april 2026.',
    ],
    values: {
      voornaam: 'Ahmed',
      achternaam: 'Yilmaz',
      geboortedatum: '21-06-1985',
      geboorteplaats: 'Ankara',
      nationaliteit: 'Turkse',
      bsn: '987654321',
      adres: 'Molenweg 5b',
      postcode: '3011 CD',
      woonplaats: 'Rotterdam',
      telefoonnummer: '06-87654321',
      email: 'a.yilmaz@mail.nl',
      datum: '04-04-2026',
      handtekening: 'Ahmed Yilmaz',
    },
  },
  {
    id: 'f3',
    intro: [
      'Je heet Olena Kovalenko. Je bent geboren op 9 december 1994 in Lviv en je hebt de Oekraïense nationaliteit.',
      'Je burgerservicenummer is 246813579. Je woont op het Stationsplein 103 in Amersfoort, postcode 3818 LE.',
      'Je telefoonnummer is 06-24681357 en je e-mailadres is o.kovalenko@mail.nl.',
      'Vandaag is het 30 september 2026.',
    ],
    values: {
      voornaam: 'Olena',
      achternaam: 'Kovalenko',
      geboortedatum: '09-12-1994',
      geboorteplaats: 'Lviv',
      nationaliteit: 'Oekraïense',
      bsn: '246813579',
      adres: 'Stationsplein 103',
      postcode: '3818 LE',
      woonplaats: 'Amersfoort',
      telefoonnummer: '06-24681357',
      email: 'o.kovalenko@mail.nl',
      datum: '30-09-2026',
      handtekening: 'Olena Kovalenko',
    },
  },
]

/** Compares a typed field against the expected value, per field type. */
export function fieldMatches(type: FieldType, input: string, expected: string): boolean {
  const typed = input.trim()
  if (typed === '') return false
  switch (type) {
    case 'date': {
      const a = typed.split(/[-/. ]+/).filter(Boolean).map((n) => n.replace(/^0+(?=\d)/, ''))
      const b = expected.split('-').map((n) => n.replace(/^0+(?=\d)/, ''))
      return a.length === 3 && a.every((part, i) => part === b[i])
    }
    case 'postcode':
      return typed.replace(/\s+/g, '').toUpperCase() === expected.replace(/\s+/g, '').toUpperCase()
    case 'bsn':
    case 'tel':
      return typed.replace(/\D/g, '') === expected.replace(/\D/g, '')
    case 'email':
      return typed.toLowerCase() === expected.toLowerCase()
    case 'text':
      return typed.toLowerCase().replace(/\s+/g, ' ') === expected.toLowerCase()
  }
}

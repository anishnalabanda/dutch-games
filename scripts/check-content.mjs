/**
 * Checks the games' Dutch content for self-consistency: answers that are not
 * among their own options, dates whose weekday is wrong, decoys without an
 * explanation, model answers that fail the app's own checker. Run with
 * `npm run check:content`. It reads the TypeScript sources directly.
 */
import { register } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

register('./content-hooks.mjs', import.meta.url)

const base = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'games')
const problems = []
const ok = (cond, msg) => { if (!cond) problems.push(msg) }

const w = await import(`${base}/schrijven/werkwoorden/data.ts`)
for (const it of w.items) {
  ok(it.options.includes(it.answer), `werkwoorden ${it.id}: answer "${it.answer}" not among options`)
  ok(it.sentence.includes('___'), `werkwoorden ${it.id}: no gap`)
  for (const a of it.accept ?? []) ok(it.options.includes(a), `werkwoorden ${it.id}: accept "${a}" not an option`)
  // The table shown after a right answer has to agree with the item itself.
  const conj = w.CONJUGATIONS[it.infinitive]
  ok(conj !== undefined, `werkwoorden ${it.id}: no conjugation table for "${it.infinitive}"`)
  if (conj === undefined) continue
  const forms = w.FORM_ROWS.map(row => conj[row.key].toLowerCase())
  for (const given of [it.answer, ...(it.accept ?? [])]) {
    ok(forms.includes(given.toLowerCase()), `werkwoorden ${it.id}: "${given}" is not a form in the ${it.infinitive} table`)
  }
}
for (const [inf, conj] of Object.entries(w.CONJUGATIONS)) {
  for (const row of w.FORM_ROWS) ok(conj[row.key]?.length > 0, `werkwoorden: ${inf} has no ${row.key} form`)
  ok(conj.vraag.endsWith('jij?'), `werkwoorden: ${inf} question form "${conj.vraag}" should end in "jij?"`)
  ok(conj.note.length > 10, `werkwoorden: ${inf} has no note`)
  ok(w.items.some(it => it.infinitive === inf), `werkwoorden: ${inf} has a table but no item`)
}
console.log(`werkwoorden: ${w.items.length} items, ${Object.keys(w.CONJUGATIONS).length} conjugation tables`)

const v = await import(`${base}/schrijven/voltooid/data.ts`)
for (const it of v.items) {
  ok(it.auxOptions.includes(it.aux), `voltooid ${it.id}: aux "${it.aux}" not among options`)
  ok(it.auxOptions.length === 2, `voltooid ${it.id}: expected 2 aux options`)
  ok(/^[a-zäëïöü]/.test(it.participle), `voltooid ${it.id}: participle looks odd`)
}
console.log(`voltooid: ${v.items.length} items`)

const s = await import(`${base}/schrijven/spelling/data.ts`)
for (const it of s.items) ok(it.from !== it.to, `spelling ${it.id}: from equals to`)
console.log(`spelling: ${s.items.length} items`)

const n = await import(`${base}/schrijven/nietgeen/data.ts`)
for (const it of n.items) {
  ok(it.position >= 0 && it.position <= it.tokens.length, `nietgeen ${it.id}: position out of range`)
  ok(!it.tokens.some(t => t === 'niet' || t === 'geen' || t === 'een'), `nietgeen ${it.id}: tokens still contain a negation or "een"`)
}
console.log(`nietgeen: ${n.items.length} items`)

const vw = await import(`${base}/schrijven/voegwoorden/data.ts`)
for (const it of vw.items) {
  ok(it.options.includes(it.connector), `voegwoorden ${it.id}: connector not among options`)
  ok(it.verbIndex >= 0 && it.verbIndex < it.clause2.length, `voegwoorden ${it.id}: verbIndex out of range`)
  const subs = it.options.filter(o => vw.SUBORDINATING.includes(o))
  const mains = it.options.filter(o => !vw.SUBORDINATING.includes(o))
  ok(subs.length > 0 && mains.length > 0, `voegwoorden ${it.id}: options don't mix both orders (too easy)`)
  if (it.connector === 'want' || it.connector === 'omdat') {
    const twin = it.connector === 'want' ? 'omdat' : 'want'
    ok(!it.options.includes(twin), `voegwoorden ${it.id}: "${twin}" offered alongside the correct "${it.connector}" — both would be right`)
  }
}
console.log(`voegwoorden: ${vw.items.length} items`)

const q = await import(`${base}/schrijven/vragen/data.ts`)
for (const it of q.items) {
  ok(it.question.endsWith('?'), `vragen ${it.id}: model question has no question mark`)
  ok(!it.accept.includes(it.question), `vragen ${it.id}: accept duplicates the model answer`)
}
console.log(`vragen: ${q.items.length} items`)

const r = await import(`${base}/schrijven/uofje/data.ts`)
for (const m of r.messages) {
  const toggles = m.parts.filter(r.isToggle)
  ok(toggles.length >= 3, `uofje ${m.id}: fewer than 3 toggles`)
  for (const t of toggles) ok(t.formeel !== t.informeel, `uofje ${m.id}: toggle "${t.label}" has identical variants`)
}
console.log(`uofje: ${r.messages.length} messages`)

const b = await import(`${base}/schrijven/bouwstenen/data.ts`)
for (const sit of b.situations) {
  ok(sit.slots.length === 4, `bouwstenen ${sit.id}: expected 4 slots`)
  for (const slot of sit.slots) {
    const good = slot.options.filter(o => o.ok)
    ok(good.length === 1, `bouwstenen ${sit.id}/${slot.label}: ${good.length} correct options (want exactly 1)`)
    for (const o of slot.options) ok(o.ok ? o.why === '' : o.why.length > 10, `bouwstenen ${sit.id}/${slot.label}: missing explanation for a decoy`)
  }
}
console.log(`bouwstenen: ${b.situations.length} situations`)

// --- The four exam-task games ------------------------------------------------
const tc = await import(`${base}/schrijven/taken/checks.ts`)
const textGames = [
  ['formeel', (await import(`${base}/schrijven/formeel/data.ts`)).tasks],
  ['informeel', (await import(`${base}/schrijven/informeel/data.ts`)).tasks],
  ['wijkkrant', (await import(`${base}/schrijven/wijkkrant/data.ts`)).tasks],
]
const fo = await import(`${base}/schrijven/formulieren/data.ts`)
const fc = await import(`${base}/schrijven/formulieren/checks.ts`)
const ff = await import(`${base}/schrijven/formulieren/fields.ts`)

// A weekday next to a date has to be that date's weekday (in 2026).
const WEEKDAY_NAMES = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MONTH_NAMES = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
function datesAgree(where, text) {
  for (const m of text.matchAll(/\b(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag) (\d{1,2}) (januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\b/g)) {
    const real = WEEKDAY_NAMES[new Date(Date.UTC(2026, MONTH_NAMES.indexOf(m[3]), Number(m[2]))).getUTCDay()]
    ok(real === m[1], `${where}: "${m[0]}" is a ${real} in 2026`)
  }
}

for (const [game, tasks] of textGames) {
  const ids = new Set()
  for (const t of tasks) {
    ok(!ids.has(t.id), `${game}: duplicate id ${t.id}`)
    ids.add(t.id)
    ok(t.points.length >= 3, `${game} ${t.id}: fewer than 3 points`)
    // The model is what the owner copies the habits of: no issue at all, advice included.
    for (const issue of tc.textIssues({ task: t, body: t.model, name: 'Anish', covered: new Set() })) {
      ok(false, `${game} ${t.id}: model answer gets "${issue.title}": ${issue.explain}`)
    }
    for (const p of t.points) {
      ok(tc.hasKeyword(p.example, p.keywords), `${game} ${t.id}/${p.id}: the example doesn't match its own point`)
      for (const issue of tc.grammarAdvice(p.example)) ok(false, `${game} ${t.id}/${p.id}: example gets "${issue.title}"`)
      datesAgree(`${game} ${t.id}/${p.id}`, p.example)
    }
    datesAgree(`${game} ${t.id}`, t.model)
  }
  console.log(`${game}: ${tasks.length} tasks, ${tasks.filter(t => t.exam).length} from the practice exams, model answers pass`)
}

// The text checker must catch the classic slips.
const formal = textGames[0][1][0]
const informal = textGames[1][1][0]
const flaggedText = (task, body, name = 'Anish') =>
  tc.textIssues({ task, body, name, covered: new Set() }).map(i => i.id)
ok(flaggedText(formal, '').includes('leeg'), 'taken: empty text should give "leeg"')
ok(flaggedText(formal, 'Ik ben ziek.').some(id => id.startsWith('punt-')), 'taken: a one-line text should miss points')
ok(flaggedText(formal, 'Kun jij mij helpen?').includes('register'), 'taken: je in a formal e-mail should fail register')
ok(flaggedText(informal, 'Kunt u mij helpen?').includes('register'), 'taken: u in an informal e-mail should fail register')
ok(flaggedText(formal, 'ik ben ziek.').includes('hoofdletter'), 'taken: a small letter should fail "hoofdletter"')
ok(flaggedText(formal, 'Ik ben ziek').includes('punt'), 'taken: no full stop should fail "punt"')
ok(flaggedText(formal, formal.model, '').includes('naam'), 'taken: a missing name should fail "naam"')
ok(flaggedText(formal, 'Morgen ik kom niet.').includes('inversie'), 'taken: "Morgen ik kom" should warn on inversion')
ok(flaggedText(formal, 'Op maandag ik kan niet.').includes('inversie'), 'taken: "Op maandag ik kan" should warn on inversion')
ok(flaggedText(formal, 'Ik kom niet, omdat ik ben ziek.').includes('omdat'), 'taken: "omdat ik ben ziek" should warn')
ok(!flaggedText(formal, 'Ik kom niet, omdat ik ziek ben.').includes('omdat'), 'taken: "omdat ik ziek ben" is right')
ok(!flaggedText(formal, 'Ik kom niet, omdat ik moet werken.').includes('omdat'), 'taken: "omdat ik moet werken" is right')
ok(flaggedText(formal, 'Ik kom niet, want ik ziek ben.').includes('want'), 'taken: "want ik ziek ben" should warn')
ok(!flaggedText(formal, 'Ik kom niet, want mijn zus gaat trouwen.').includes('want'), 'taken: "want mijn zus gaat trouwen" is right')
ok(flaggedText(formal, 'Hij word morgen beter.').includes('dt'), 'taken: "hij word" should warn on -dt')
ok(flaggedText(formal, 'Beste meneer, ik ben ziek.').includes('aanhef'), 'taken: a repeated greeting should be pointed out')
ok(flaggedText(formal, 'Schrijf dat u de afspraak wilt verzetten.').includes('opdracht'), 'taken: a copied instruction should be pointed out')

// Forms: every example answer passes; the field formats hold.
const today = new Date(2026, 9, 4)
let questionCount = 0
for (const form of fo.forms) {
  for (const section of form.sections) {
    if (section.kind === 'choice') ok(section.choice.options.length >= 2, `formulieren ${form.id}: a choice with one option`)
    if (section.kind !== 'question') continue
    const q = section.question
    questionCount += 1
    for (const issue of fc.answerIssues(q, q.example, false)) ok(false, `formulieren ${form.id}/${q.id}: example gets "${issue.title}": ${issue.explain}`)
    datesAgree(`formulieren ${form.id}/${q.id}`, q.example)
  }
  // A form filled in with the sample values and the examples has nothing left to fix.
  const values = {}
  for (const section of form.sections) {
    if (section.kind === 'fields') for (const field of section.fields) values[field.id] = ff.sampleValue(field.kind, today)
    else if (section.kind === 'choice') values[section.choice.id] = section.choice.options[0]
    else values[section.question.id] = section.question.example
  }
  for (const issue of fc.formIssues({ form, values, covered: new Set(), today })) ok(false, `formulieren ${form.id}: a filled-in form still gets "${issue.title}"`)
}
const someQ = fo.forms[0].sections.find(s => s.kind === 'question').question
const flaggedAnswer = (text) => fc.answerIssues(someQ, text, false).map(i => i.id.replace(`${someQ.id}-`, ''))
ok(flaggedAnswer('Soep.').includes('lengte'), 'formulieren: a one-word answer should fail "lengte"')
ok(flaggedAnswer('ik wil soep leren koken').includes('hoofdletter'), 'formulieren: no capital should fail')
ok(flaggedAnswer('Ik wil graag iets nieuws doen.').includes('antwoord'), 'formulieren: an answer without a dish should fail "antwoord"')
ok(flaggedAnswer('Ik wil soep koken, als je wilt.').includes('register'), 'formulieren: je on a form should fail register')
const fieldCases = [
  ['birthdate', '03-03-1990', true], ['birthdate', '3-3-1990', true], ['birthdate', '1990-03-03', false],
  ['birthdate', '31-02-1990', false], ['birthdate', '03-03-2030', false],
  ['today', '04-10-2026', true], ['today', '05-10-2026', false],
  ['postcode', '3512 AB', true], ['postcode', '3512 ab', false], ['postcode', '0512 AB', false],
  ['bsn', '123456782', true], ['bsn', '12345678', false],
  ['tel', '06-12345678', true], ['tel', '0612345678', true], ['tel', '612345678', false],
  ['email', 'sara.haddad@mail.nl', true], ['email', 'sara.haddad@mail', false],
  ['fullname', 'Sara Haddad', true], ['fullname', 'Sara', false], ['fullname', 'Sara van der Berg', true],
  ['street', 'Kerkstraat 12', true], ['street', 'Molenweg 5b', true], ['street', 'kerkstraat 12', false], ['street', 'Kerkstraat', false],
  ['place', 'Utrecht', true], ['place', "'s-Hertogenbosch", true], ['place', 'utrecht', false],
]
for (const [kind, value, expected] of fieldCases) {
  ok(ff.fieldValid(kind, value, today) === expected, `formulieren: ${kind} "${value}" should be ${expected ? 'accepted' : 'rejected'}`)
}
console.log(`formulieren: ${fo.forms.length} forms, ${questionCount} open questions, examples pass, filled-in forms pass`)

// Every Dutch word these games show must have a gloss, or it renders without a
// tooltip (AGENTS.md section 7). Names and places are not glossed.
const glossary = await import(`${base}/glossary.ts`)
const NOT_GLOSSED = new Set([
  'anish', 'nalabanda', 'anna', 'sam', 'jan', 'vries', 'linde', 'brug', 'oost', 'vers', 'wetering',
  'noord', 'utrecht', 'kerkstraat', 'yoga', 'a',
  'visser', 'boer', 'sanne', 'smit', 'bakker', 'jansen', 'noor', 'peters', 'koster', 'dekker', 'hendriks',
  'mulder', 'yasmina', 'lotte', 'fatma', 'daan', 'mark', 'sara', 'tim', 'lisa', 'emma', 'ilse', 'ruben',
  'rotterdam', 'amsterdam', 'molenstraat', 'b', 'x',
])
const unglossed = new Map()
function needsGloss(where, text) {
  for (const word of text.match(/[A-Za-zÀ-ÿ]+(?:['’-][A-Za-zÀ-ÿ]+)*/g) ?? []) {
    if (NOT_GLOSSED.has(word.toLowerCase()) || glossary.lookupWord(word)) continue
    if (!unglossed.has(word.toLowerCase())) unglossed.set(word.toLowerCase(), where)
  }
}
for (const sit of b.situations) {
  for (const point of sit.brief) needsGloss(`bouwstenen ${sit.id}`, point)
  for (const slot of sit.slots) for (const o of slot.options) needsGloss(`bouwstenen ${sit.id}`, o.text)
}
for (const [game, tasks] of textGames) {
  for (const t of tasks) {
    const frame = t.frame.kind === 'mail' ? [t.frame.subject, t.frame.greeting, t.frame.closing]
      : t.frame.kind === 'note' ? [t.frame.greeting, ...t.frame.closing] : [t.frame.lead]
    const texts = [t.title, t.situation, t.intro ?? '', ...t.bullets, ...t.instructions, ...frame, t.model,
      ...t.points.flatMap(p => [p.starter, p.example])]
    for (const text of texts) needsGloss(`${game} ${t.id}`, text)
  }
}
for (const form of fo.forms) {
  const texts = [form.title, form.situation, form.formTitle, ...form.instructions]
  for (const section of form.sections) {
    if (section.kind === 'fields') texts.push(section.heading, ...section.fields.map(f => f.label))
    else if (section.kind === 'choice') texts.push(section.choice.heading, ...section.choice.options)
    else texts.push(section.question.question, section.question.starter, section.question.example)
  }
  for (const text of texts) needsGloss(`formulieren ${form.id}`, text)
}
needsGloss('frame', 'Van Aan Onderwerp')
const tpl = await import(`${base}/schrijven/taken/templates.ts`)
for (const [name, template] of Object.entries(tpl)) for (const line of template.lines) needsGloss(`template ${name}`, line.nl)
for (const [word, where] of unglossed) ok(false, `${where}: "${word}" has no glossary entry`)
console.log(`glossary: bouwstenen and the four exam-task games checked for missing words`)

const d = await import(`${base}/schrijven/voorzetsels/data.ts`)
const names = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag']
for (const it of d.items) {
  if (it.kind === 'klok') {
    ok(it.hour >= 1 && it.hour <= 12, `voorzetsels ${it.id}: hour out of range`)
    ok(it.minute >= 0 && it.minute < 60, `voorzetsels ${it.id}: minute out of range`)
    ok(it.answer.startsWith('om '), `voorzetsels ${it.id}: a clock time should take "om"`)
  } else if (it.kind === 'kalender') {
    ok(it.month >= 1 && it.month <= 12, `voorzetsels ${it.id}: month out of range`)
    ok(it.answer.includes(d.MONTHS[it.month - 1]), `voorzetsels ${it.id}: answer doesn't name the month`)
    ok(it.answer.startsWith('op '), `voorzetsels ${it.id}: a date should take "op"`)
    const real = new Date(Date.UTC(it.year, it.month - 1, it.day))
    ok(names[real.getUTCDay()] === it.weekday, `voorzetsels ${it.id}: ${it.day}-${it.month}-${it.year} is a ${names[real.getUTCDay()]}, not ${it.weekday}`)
  } else {
    ok(it.options.includes(it.answer), `voorzetsels ${it.id}: answer not among options`)
    ok(new Set(it.options).size === it.options.length, `voorzetsels ${it.id}: duplicate options`)
  }
}
console.log(`voorzetsels: ${d.items.length} items`)

const wd = await import(`${base}/schrijven/woorden/data.ts`)
const seen = new Set()
for (const it of wd.items) {
  ok(!seen.has(it.id), `woorden: duplicate id ${it.id}`)
  seen.add(it.id)
  if (it.article) {
    ok(it.nl === `${it.article} ${it.bare}`, `woorden ${it.id}: "${it.nl}" doesn't match article + bare form`)
  } else {
    ok(!it.bare, `woorden ${it.id}: bare form without an article`)
  }
}
console.log(`woorden: ${wd.items.length} items`)

const dh = await import(`${base}/schrijven/dehet/data.ts`)
for (const it of dh.items) {
  if (!it.follow) continue
  ok(it.follow.options.includes(it.follow.answer), `dehet ${it.id}: follow-up answer not among options`)
  const expectE = it.article === 'de' || ['het','dit','dat','mijn','deze'].includes(it.follow.before)
  ok(expectE === it.follow.answer.endsWith('e'), `dehet ${it.id}: adjective ending contradicts the rule`)
}
console.log(`dehet: ${dh.items.length} items`)

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('\nAll content checks passed.')

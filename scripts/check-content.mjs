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

const f = await import(`${base}/schrijven/formulier/data.ts`)
const fc = await import(`${base}/schrijven/formulier/checks.ts`)
const formIds = new Set()
let questionCount = 0
for (const form of f.forms) {
  ok(!formIds.has(form.id), `formulier: duplicate id ${form.id}`)
  formIds.add(form.id)
  ok(form.questions.length === 3, `formulier ${form.id}: expected 3 open questions`)
  ok(new Set(form.fields.map(x => x.id)).size === form.fields.length, `formulier ${form.id}: duplicate field id`)
  for (const q of form.questions) {
    questionCount += 1
    // Model answers are what the owner copies the habits of: no warnings either.
    for (const r of fc.checkAnswer(q, q.model)) {
      ok(r.status === 'ok', `formulier ${form.id}/${q.id}: model answer gets "${r.label}" ${r.status}: ${r.detail}`)
    }
  }
}
// The answer checker must catch the classic slips.
const someQ = f.forms[0].questions[2]
const flagged = (text) => fc.checkAnswer(someQ, text).filter(r => r.status !== 'ok').map(r => r.id)
ok(flagged('zaterdag').includes('lengte'), 'formulier: a one-word answer should fail "lengte"')
ok(flagged('ik kom op zaterdag').includes('zin'), 'formulier: no capital and no full stop should fail "zin"')
ok(flagged('Ik vind boeken heel mooi.').includes('antwoord'), 'formulier: an answer with no time should fail "antwoord"')
ok(flagged('Op zaterdag ik kom naar de bibliotheek.').includes('inversie'), 'formulier: "Op zaterdag ik kom" should warn on inversion')
ok(flagged('Ik kom op zaterdag, als je wilt.').includes('register'), 'formulier: "je" on a form should fail register')
// Field formats: the right one passes, the usual wrong ones do not.
const now = new Date(2026, 9, 3)
const fieldCases = [
  ['birthdate', '03-03-1990', true], ['birthdate', '3-3-1990', true], ['birthdate', '1990-03-03', false],
  ['birthdate', '31-02-1990', false], ['birthdate', '03-03-2030', false],
  ['today', '03-10-2026', true], ['today', '04-10-2026', false],
  ['postcode', '3512 AB', true], ['postcode', '3512 ab', false], ['postcode', '0512 AB', false],
  ['bsn', '123456782', true], ['bsn', '12345678', false],
  ['tel', '06-12345678', true], ['tel', '0612345678', true], ['tel', '612345678', false],
  ['email', 'sara.haddad@mail.nl', true], ['email', 'sara.haddad@mail', false],
  ['name', 'Sara', true], ['name', 'sara', false], ['name', 'van der Berg', true],
  ['fullname', 'Sara Haddad', true], ['fullname', 'Sara', false],
  ['street', 'Kerkstraat 12', true], ['street', 'Molenweg 5b', true], ['street', 'kerkstraat 12', false], ['street', 'Kerkstraat', false],
  ['place', 'Utrecht', true], ['place', "'s-Hertogenbosch", true], ['place', 'utrecht', false],
  ['gender', 'vrouw', true], ['gender', 'female', false],
]
for (const [kind, value, expected] of fieldCases) {
  ok(f.fieldValid(kind, value, now) === expected, `formulier: ${kind} "${value}" should be ${expected ? 'accepted' : 'rejected'}`)
}
console.log(`formulier: ${f.forms.length} forms, ${questionCount} open questions, model answers pass`)

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

// Every Dutch word these games show must have a gloss, or it renders without a
// tooltip (AGENTS.md section 7). Names and places are not glossed.
const glossary = await import(`${base}/glossary.ts`)
const NOT_GLOSSED = new Set([
  'anish', 'nalabanda', 'anna', 'sam', 'jan', 'vries', 'linde', 'brug', 'oost', 'vers', 'wetering',
  'noord', 'utrecht', 'kerkstraat', 'yoga', 'a',
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
for (const form of f.forms) {
  needsGloss(`formulier ${form.id}`, `${form.title} ${form.situation}`)
  for (const q of form.questions) needsGloss(`formulier ${form.id}`, `${q.question} ${q.model}`)
}
for (const [word, where] of unglossed) ok(false, `${where}: "${word}" has no glossary entry`)
console.log(`glossary: bouwstenen and formulier checked for missing words`)

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

const ex = await import(`${base}/schrijven/examen/data.ts`)
const checks = await import(`${base}/schrijven/examen/checks.ts`)
for (const task of ex.tasks) {
  const results = checks.runChecks(task, task.model)
  for (const res of results) {
    ok(res.status !== 'fail', `examen ${task.id}: own model answer fails check "${res.label}" — ${res.detail}`)
  }
}
// The checker must actually catch a bad message.
const bad = 'hoi,\n\nik ben ziek. morgen ik bel je. hij word beter.\n'
const badResults = checks.runChecks(ex.tasks[0], bad)
const failing = badResults.filter(r => r.status !== 'ok').map(r => r.id)
for (const id of ['punten', 'register', 'dt', 'hoofdletters', 'inversie', 'afsluiting', 'lengte']) {
  ok(failing.includes(id), `examen: deliberately bad text was not flagged by "${id}"`)
}
console.log(`examen: ${ex.tasks.length} tasks, model answers pass, bad text flagged by ${failing.length} checks`)

for (const stem of ex.stems) {
  for (const model of stem.models) {
    const res = checks.checkCompletion(stem.rule, model)
    for (const r of res) {
      ok(r.status !== 'fail', `examen stem ${stem.id}: model "${model}" fails its own check "${r.label}" — ${r.detail}`)
    }
  }
}
console.log(`examen: ${ex.stems.length} stems, model completions pass their own rule check`)

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('\nAll content checks passed.')

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
for (const p of f.personas) {
  for (const field of f.fields) {
    const expected = p.values[field.id]
    ok(expected !== undefined, `formulier ${p.id}: missing value for ${field.id}`)
    if (expected === undefined) continue
    ok(f.fieldMatches(field.type, expected, expected), `formulier ${p.id}: ${field.id} fails its own validator`)
    const prose = p.intro.join(' ')
    if (field.type === 'text' && field.id !== 'handtekening' && field.id !== 'datum') {
      ok(prose.toLowerCase().includes(expected.toLowerCase()), `formulier ${p.id}: "${expected}" (${field.id}) not findable in the intro text`)
    }
  }
}
// A wrongly formatted date must be rejected, and a loose one accepted.
ok(f.fieldMatches('date', '3-3-1990', '03-03-1990'), 'formulier: 3-3-1990 should be accepted')
ok(!f.fieldMatches('date', '1990-03-03', '03-03-1990'), 'formulier: reversed date should be rejected')
ok(f.fieldMatches('postcode', '3512ab', '3512 AB'), 'formulier: postcode without space should be accepted')
ok(!f.fieldMatches('bsn', '12345678', '123456782'), 'formulier: 8-digit BSN should be rejected')
console.log(`formulier: ${f.personas.length} personas x ${f.fields.length} fields`)

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

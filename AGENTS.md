# AGENTS.md: Dutch Inburgering A2 Games

Guidance for any AI agent (Claude Code) working in this repository.
Read this file fully before scaffolding or changing anything.

---

## 1. What this is

A web app of small **games** that help the owner pass the Dutch **DUO inburgering A2**
exams. Each game teaches or drills one thing. The app is hosted on **GitHub Pages**
(repo: `dutch-games`, public, live at `https://anishnalabanda.github.io/dutch-games/`).

The owner has cleared **Lezen (Reading) A2**: assume A2 reading comprehension as the
baseline. Learning happens through **playing games**, not reading lessons.

### Current exam status (keep updated as games are completed)
- Lezen: cleared (no games needed)
- Luisteren: in progress (baseline practice exam: 18/25)
- Schrijven: in progress (all 16 games built, roadmap in section 13; done now means
  every item right first time, so older right-eventually saves no longer count)
- KNM: question source is the owner's *NT2 KNM 1000 vragen* book
- Spreken: not started, no date
- ONA: portfolio + interview, not a knowledge test (a task checklist, not games)

---

## 2. Learning model (the core concept)

- **One assignment = one game.** An exam is "ready" when all its games are done.
- The app shows a **progress counter per exam** ("X of Y games done") on the hub and
  on each exam's page.
- Games use **fresh, varied mechanics**: do NOT reproduce a generic tap-to-build /
  sort / plain multiple-choice feel across everything. Each game may have a new
  interaction, but all share one visual design system (see section 6).
- Grading/feedback follows **DUO criteria**: word order (finite verb in position 2,
  verb-to-end after `omdat`, inversion after a fronted time/place phrase), register
  (`u` vs `je`), spelling, and whether all required points are covered. Give the
  specific fix, never vague praise. Be honest about difficulty and readiness.

---

## 3. Tech stack (decided: do not substitute)

- **React + Vite + TypeScript**, built to static files. (GitHub Pages is static-only;
  no server runtime. Do NOT use Next.js SSR/API routes: they won't run here.)
- **Routing: `HashRouter`** (react-router-dom). Hash routes avoid 404s on deep links /
  refresh on GitHub Pages.
- **Styling: plain CSS with CSS custom properties (design tokens)** + small reusable
  components. Keep dependencies minimal; no heavy UI framework. No Tailwind unless later
  requested.
- **Cloud sync: Supabase** (`@supabase/supabase-js`), see section 5.
- Package manager: npm. Node: LTS, pinned in the Actions workflow.

### Vite config
- Set `base: '/dutch-games/'` in `vite.config.ts` (required for a GitHub project page).
- Build output: `dist/`.

---

## 4. Repository & deployment

- Source lives on `main`. The built site deploys to GitHub Pages **via GitHub Actions**
  (Pages "Build and deployment -> Source" must be set to **GitHub Actions**, not
  "Deploy from a branch"). Add `.github/workflows/deploy.yml` that installs deps, runs
  `vite build`, and deploys `dist/` using `actions/configure-pages`,
  `actions/upload-pages-artifact`, `actions/deploy-pages`.
- On every push to `main`, the site rebuilds and redeploys automatically.
- Claude Code MAY commit and push in this repo. (The owner also works with Claude in a
  chat Project that CANNOT push; there Claude hands over full files. This repo's agent
  commits directly.)
- Keep the app working offline once loaded, and mobile-friendly.

---

## 5. Data & persistence

Two layers behind ONE abstraction, so game code never touches storage details directly.

### Interface
```ts
interface ProgressStore {
  get(key: string): Promise<any | null>;
  set(key: string, value: any): Promise<void>;
  all(): Promise<Record<string, any>>;   // every nl.* key, for the hub counters
}
```

### Key convention
All progress keys are namespaced `nl.<exam>.<game>` (e.g. `nl.schrijven.zinnen`,
`nl.knm.overheid`). One value per game holds its state (done flag, best score, streak,
flagged items, etc.).

### Identity: an email address, not an account
Sign-in is required, and it is one field. The owner types an email address, the app
stores it, and that address is the key their rows are filed under. There is **no
password, no confirmation mail, and no Supabase Auth**: `src/auth/identity.ts` is the
whole of it, and it just reads and writes `__nl_email__` in localStorage. The address
is normalised to lowercase so one person is one row set however they type it.

This is a deliberate trade, made by the owner, of security for a one-field sign-in:
**anyone who knows an address can read or overwrite that address's progress**, because
the publishable key is public in a public repo and the policies have to let it through.
Never put anything sensitive in the `progress` table, and do not add a feature that
assumes the address has been verified, because it has not been.

The identity key deliberately avoids the `nl.` prefix. `LocalStore` treats every `nl.*`
key as progress, so an address stored under that prefix would be uploaded to the cloud
as if it were game state.

### Layer 1: local (always on)
`LocalStore` wraps `localStorage`: instant, offline, per-device. Wrap every access in
try/catch; degrade to in-memory if unavailable. It is the working copy for a signed-in
user, which is what keeps the app usable offline. `clear()` wipes every `nl.*` key and
is called on sign out, so the next address to use the browser cannot inherit the
previous one's progress, nor upload it as their own on the next merge.

### Layer 2: cloud (Supabase, cross-device sync)
- Free tier: Postgres + a client ("anon"/publishable) key that ships in the browser. Put
  the Supabase **URL** and **publishable key** in `src/config.ts`; they are not secrets.
  NEVER put the service-role key in the client.
- **Schema:** table `progress` with columns `email text`, `key text`, `value jsonb`,
  `updated_at timestamptz default now()`, primary key `(email, key)`. RLS is enabled,
  but the select/insert/update policies are `using (true)`: there is no verified
  identity to scope them to. Delete is deliberately not granted. The authoritative copy
  is `supabase/schema.sql`.
- **`SupabaseStore`** implements `ProgressStore` against that table for one address.
- **Sync strategy:** local is the working copy; cloud is the sync copy.
  - On sign-in: pull cloud rows, **merge** with local by `updated_at` (last-write-wins per
    key), write the merged result to both. Never silently wipe one side.
  - On each `set`: write local immediately (optimistic), then upsert to cloud; if offline,
    queue and flush on reconnect.
- Selecting the store lives in ONE provider/context (`StoreProvider`): an address plus
  cloud sync enabled gives the synced store, otherwise local only. Games are unaware
  which is active.

### No export / import
There was an export/import pair for moving a snapshot between devices by hand. It was
removed when sign-in became mandatory: typing the same address on the other device is
the transfer. Do not reintroduce it without being asked.


### Local development never writes to the database
`CLOUD_SYNC_ENABLED` in `src/config.ts` is false under `npm run dev`, so a dev
session uses `LocalStore` only: playing through a game locally never touches the
Supabase `progress` table. The `AuthBar` says "Lokaal, geen cloud-sync" so it is clear
nothing is syncing. Set `VITE_CLOUD_SYNC=on` in a local `.env` to test sync for real.
Production builds are unaffected.

### Honest caveats to surface in-app where relevant
- The publishable key is safe to ship, but here it fronts an open table, because sign-in
  is an unverified email address. Say plainly that progress is not private.
- Supabase free projects pause after ~1 week of total inactivity; first request after a
  pause may be slow or need a dashboard restore. Fine for regular use.
- Cross-device sync means typing the same address on each device.

---

## 6. Design system (one house style, no drift)

All games look and feel like one suite. Centralize tokens and components; games compose
them, never re-style from scratch.

### Visual identity (existing house style: keep it)
- Dark "departure board" theme. Tokens (CSS variables):
  `--board:#101822; --panel:#18222f; --line:#243244; --amber:#ffc917; --paper:#f3f2ee;
   --ink:#0d1219; --muted:#8b98a8; --ok:#3ec98a; --alert:#e8523a; --verb:#5aa9ff;`
- Fonts: `Barlow Condensed` (uppercase headings/labels, numerals), `Inter` (UI/body),
  `Source Serif 4` (reading/lesson text on light "worksheet" surfaces).
- Amber is the single primary accent. Verbs are highlighted with an amber marker.
- Reading-heavy lesson screens use a warm cream "worksheet" card (`#f5f2ea`, dark text)
  for legibility, not the dark surface.

### Shared components to build
`Button`, `Card`, `ProgressBar`, `StreakBadge`/score display, `WordTile` (Dutch word with
per-word English gloss on hover/focus: section 7), `FeedbackBox` (correct/incorrect with
explanation), `Tag`/`Chip`, `Tooltip`, `ExamCard` (hub), a game `Shell` (header: title,
streak, correct count, progress bar), and an `AuthBar` / account menu (current address,
sync status, switch address).

---

## 7. Dutch display rule (strict)

- Show **clean Dutch first**, at full size.
- English meaning appears as a **per-word tooltip on hover/focus** (preferred), or a
  smaller line beneath: NEVER one translation mashed inline into the Dutch line, and
  never a parenthetical after every word crammed on one line.
- Tooltips must be keyboard-focusable (tap works on mobile).
- Verbs get the amber highlighter; other translatable words a subtle dotted underline to
  signal hoverability; pure punctuation is not interactive.

### How this is implemented
`src/games/glossary.ts` holds one Dutch → English entry per word (`verb: true` drives the
amber marker), and `<GlossedText text="..." />` tokenises any Dutch string and wraps known
words in `WordTile`, so a whole sentence or message gets per-word tooltips without a gloss
being written next to it. Use it for every Dutch sentence a game shows: **not** inside a
`<button>`, since the word tooltips are focusable themselves. A choice made of Dutch text
(a block, an option) is a `role="radio"` element with `tabIndex={0}` and Enter/Space
handling instead, so it can hold `GlossedText` (see Bericht bouwstenen). Words that are a
noun in one reading and a verb form in another (`werk`, `vraag`, `fiets`) are deliberately
not flagged as verbs. When a game adds new Dutch text, add its new words to the glossary;
`npm run check:content` lists the missing ones for the games it covers.

### Which language each string is in (strict)
The split is by role, not by screen:

- **Dutch**: everything the exam itself is made of. Sentences to build, words to type,
  options and chips, model answers, form fields and their values, the task brief, game
  titles. Run every Dutch sentence through `GlossedText`, including a Dutch task brief.
- **English**: everything the app says *about* that content. Feedback and rule
  explanations, hints, rule/tag labels, section labels, input placeholders, aria-labels,
  buttons, counters and the done screens.

The owner is learning from the explanations, so an explanation in Dutch has to be decoded
before it can teach anything: that is why `FeedbackBox` writes "Correct" / "Not quite" and
takes an English `message`. Never wrap an English string in `GlossedText`: it would gloss
words like *in*, *op* and *je* as Dutch.

---

## 8. Game architecture

- Each game is a self-contained module under `src/games/<exam>/<game>/`, exporting a React
  component plus metadata:
  ```ts
  interface GameMeta {
    id: string;            // matches nl.<exam>.<game>
    exam: 'luisteren'|'schrijven'|'knm'|'spreken';
    title: string;         // Dutch
    subtitle: string;      // short English: required, it is the game's hover gloss
    core: boolean;         // core vs optional (affects "ready" honesty)
    total: number;         // items the game's bar counts, from its own data module
  }
  ```
- A central **manifest** registers all games and drives the hub and per-exam counters. It
  imports each game's `data.ts` for `total`, so a card can never quote a number of items
  the game does not have.
- The game title in the `Shell` header stays Dutch and carries its English `subtitle` as a
  hover/focus tooltip, like a glossed word. `GamePage` publishes the manifest entry through
  `CurrentGameProvider` (`src/games/currentGame.tsx`) and `Shell` reads it, so a game never
  repeats its own metadata and `Shell` never imports the manifest (that would be a cycle).
- The per-exam page shows a bar per game: `countFinished` (`src/games/progress.ts`) counts
  `mastered` for drill games, and `finished` for the four Schrijven exam-task games
  (`useTasks`, the only games that are not drills: see below and section 13). A save with
  only `completedIds` predates `useDrill` (right *eventually*, not first time) and counts
  as zero. `isDone` checks the count against the game's current `total`, so adding items
  to a finished game reopens it. A new drill game needs no change there.
- **Hub = home route** (`/`): lists exams as cards, each showing its per-exam progress
  ("X of Y games done", core vs optional distinguished), linking into that exam's games.
- Every game reads/writes only its own `nl.<exam>.<game>` key via the store.
- **Use `useDrill(key, items)` (`src/games/useDrill.ts`) for any item-by-item game.** It owns
  the queue and the saved `DrillState`, so completion behaves the same everywhere:
  - the queue is **shuffled every run**, so the order is never memorised;
  - an item is **mastered only when answered correctly on the first attempt** of a
    presentation: miss it and it goes back into the queue (`REQUEUE_GAP` items later)
    to be asked again;
  - `done` means *every item mastered*, not *every item eventually answered right*;
  - the progress bar shows mastered / total, so the counter cannot overstate readiness.
  Games supply only the interaction and call `miss()`, `hit()` and `advance()`. Do NOT
  hand-roll a `completedIds` list in a new game: that was the old, weaker rule.
- **The one exception: the four exam-task games** (`src/games/schrijven/taken/useTasks.ts`).
  A whole e-mail or form is not a drill item, and the owner chose a completion rule for
  them: a task is `finished` once it is submitted with every point covered, however many
  hints it took. They have no wrong answers, only "not finished yet". Drafts are saved
  (debounced) so a half-written e-mail survives leaving the page, except in the form game,
  where the owner types personal details and nothing is kept.

---

## 9. Content rules

- **KNM**: questions come from the owner's book or official DUO practice: do NOT invent
  KNM facts and present them as exam-accurate. A small set of verified sample questions is
  acceptable only if clearly labelled as replaceable. Question data lives in an editable
  data file the owner pastes batches into.
- Do not reproduce copyrighted material wholesale; the owner supplies their own book's
  questions for personal use.
- **Luisteren**: browser TTS (`speechSynthesis`, Dutch voice) is acceptable for
  word/number/sentence drills, but note in-app that real audio (DUO oefenexamens,
  Jeugdjournaal) is still needed.
- **Spreken**: the browser cannot reliably grade pronunciation; build recognition/response
  drills and flag that real speaking practice with a person is still required.

---

## 10. Definition of done (per game)

Compiles and builds clean; `npm run check:content` passes (it validates the game data
against itself: answers present in their own option lists, weekdays matching their dates,
every decoy carrying an explanation, model answers surviving the app's own checker); persists via the store under the right key; **uses `useDrill`
so completion means mastery, not exposure** (section 8; the four exam-task games use
`useTasks` instead); matches the design system and the
Dutch display rule; keyboard- and mobile-usable; respects `prefers-reduced-motion`;
registered in the manifest so the hub counts it. Aim for **40+ items** per game, spread
evenly across the rules it teaches, a dozen items is memorised, not learned. Update
section 1 status when an exam's games change.

---

## 11. Do NOT

- Do not use Next.js server features, or any server/database needing a runtime on Pages.
- Do not use `window.storage` (a Claude-artifact-only API; absent on GitHub Pages). Use
  the `ProgressStore` abstraction.
- Do not put the Supabase **service-role** key in the client. Only the anon/publishable
  key, with RLS enabled.
- Do not invent KNM/society facts or Dutch exam answers.
- Do not fragment the visual style, one design system.
- Do not add heavy dependencies without reason.

---

## 12. Suggested build order

1. Scaffold Vite + React + TS, `base` path, HashRouter, design tokens + core components.
2. `ProgressStore` + `LocalStore`, Export/Import, provider/context. Hub with empty roster
   ("0 of 0" per exam). GitHub Actions Pages deploy. **Ship and confirm the live URL
   before building games.**
3. Add Supabase: config, `auth` module (method per owner), `SupabaseStore`, merge-sync,
   `AuthBar`. Confirm sign-in + cross-device sync with a throwaway progress value.
4. Build games one at a time, each registered in the manifest.

---

## 13. Schrijven: game roadmap

**Exam shape (verified against DUO, September 2026).** The A2 Schrijven exam is
**handwritten, with pen and paper**, the only A2 language exam that is not computer-based
(the B1/B2 writing exams are). It lasts **40 minutes** and contains **4 opdrachten**:
filling in a **formulier**, one or two **korte berichten**, and one or two longer open
writing tasks (a note, card, e-mail or brief that must cover given points).
Source: <https://www.inburgeren.nl/examen-doen/inhoud-taalexamens-a2-b1-b2.jsp>

**What the three DUO oefenexamens actually set (checked October 2026).** Every one has the
same four task types, one each:
- a **formal e-mail** (u) to a docent or chef: 3 or 4 bullets, one of them "Bedenk zelf";
- an **informal message** (je) to a colleague or fellow student: an e-mail with bullets,
  or a *briefje* built from pictures instead of bullets;
- a **formulier**: personal details plus 2 to 4 open questions, often about photos;
- a **wijkkrant text** about yourself: "Schrijf minimaal drie zinnen op. Denk aan:" and
  three questions.

The greeting and the closing are printed on the page; the candidate writes the middle and
signs it. The printed greeting decides the register: meneer/mevrouw + surname means u, a
first name means je, even after "Beste". The brief says u to the candidate throughout, so
every bullet has to be turned into ik before it is written. There is no "finish the
sentence" part, which is why the old capstone's level 1 was dropped.

Because it is handwritten:
- **Spelling carries more weight** than in a typed exam: no spellcheck, no free
  backspacing. The spelling game is therefore built early, not fourth-from-last.
- **The exam-task games are typed practice, and say so.** Typing with hints is how the
  owner learns what each task needs; every done screen then suggests writing the same
  task once more on paper.
- Handwriting speed across 4 tasks in 40 minutes is itself worth rehearsing.

Scoring follows the criteria in section 2: all required points covered, word order,
register (`u` vs `je`), spelling, punctuation.

**Roadmap (16 games: 15 core, 1 optional).** The drills come first; the four exam-task
games, one per task type the exam sets, come last. The manifest order is what the app shows
and differs from these numbers. Every entry is one `nl.schrijven.*` key, registered in the
manifest when built.

1. `nl.schrijven.zinnen`: **Zinnen bouwen**, core, *built*
   - Drills: word order across five rules, persoonsvorm op plaats 2, inversie na een
     bepaling, werkwoord naar het eind na `omdat`, **modaal werkwoord + hele werkwoord
     aan het eind**, and **scheidbare werkwoorden die in de hoofdzin uit elkaar vallen**
     (`ik bel u morgen op`).
   - Mechanic: tap/drag word tiles onto a departure-board line.
   - 45 sentences, 9 per rule.
2. `nl.schrijven.werkwoorden`: **Werkwoorden nu**, core, *built*
   - Drills: present tense (`ik werk` / `jij werkt` / `hij werkt` / plural = infinitief),
     and the `-t` that disappears in `werk jij?`. Stem spelling (`maken` → `ik maak`).
   - Mechanic: a drum of candidate forms, stepped with ▲/▼ or the arrow keys and locked in.
   - A right answer opens the verb's whole present tense (`CONJUGATIONS` in its `data.ts`,
     the pronouns in `FORM_ROWS`), with the form this sentence needed marked, so one item
     teaches a paradigm and not a fact. `npm run check:content` holds the table and the
     items to each other.
   - 25 items.
3. `nl.schrijven.voltooid`: **Gisteren gedaan**, core, *built*
   - Drills: perfectum, `hebben` vs `zijn`, `ge-` + stam + `-d`/`-t` via 't kofschip,
     the frequent irregulars, **scheidbare deelwoorden waar `ge-` in het midden komt**
     (`opgebeld`, `meegenomen`), participle at the end of the sentence.
   - Mechanic: two-slot boarding pass, pick the hulpwerkwoord, then type the voltooid
     deelwoord. Also covers separable verbs (opbellen → opgebeld).
   - A reference card stays on screen: the recipe (`ge + stem + t/d`) and both decisions
     that fill it in, each written as the case on the left and what to do on the right
     (`ENDING_RULES` and `GE_RULES` in its `data.ts`). It replaced a single sentence that
     named the six letters without ever showing the decision.
   - **Give up** reveals the answer and counts the item as missed, so it comes round again.
   - 33 items.
4. `nl.schrijven.spelling`: **Spellingmachine**, core, *built*
   - Drills: open/closed syllables (`man`/`mannen`, `boom`/`bomen`), `-d`/`-t`/`-dt`
     (`hij wordt`, `jij vindt`), `ij`/`ei`, plural `-s`/`-en`.
   - Mechanic: a stretch slider that pulls a word singular → plural (or ik-vorm →
     infinitief); the owner types the result before the slider snaps.
   - Raised in priority: the exam is handwritten, so spelling is unassisted.
5. `nl.schrijven.formulieren`: **Formulier invullen**, core, *built*, exam-task game
   - Replaces the old `nl.schrijven.formulier` drill (a new key, so its old `mastered`
     save cannot count for the new game).
   - The exam's form: personal details (the owner's own or made up, checked for format
     only, never saved), sometimes a choice to tick, and 2 to 4 open questions answered in
     a whole sentence. Some forms take their content from pictures (emoji stand in for
     the exam's photos), and a question can need two things at once (`needs` groups:
     the laptop *and* the watch).
   - Field formats and samples in `formulieren/fields.ts`, checks in `formulieren/checks.ts`.
   - 12 forms, 32 open questions; 3 follow the oefenexamens.
6. `nl.schrijven.uofje`: **U of je**, core, *built*
   - Drills: register, `u/uw` vs `je/jij/jouw`, formal vs informal aanhef and afsluiting
     (`Geachte heer/mevrouw` … `Met vriendelijke groet` vs `Hoi` … `Groetjes`), staying
     consistent within one message.
   - Mechanic: inbox triage, sort messages by recipient (baas, buurvrouw, gemeente),
     then fix the pronouns and greeting that don't fit.
7. `nl.schrijven.bouwstenen`: **Bericht bouwstenen**, core, *built*
   - Drills: the standard phrases per situation, ziekmelden, een afspraak afzeggen of
     verzetten, bedanken, uitnodigen, een klacht: and the order aanhef → reden →
     verzoek → afsluiting.
   - Mechanic: assemble a message from labelled blocks, with wrong-register decoys mixed
     into the pile.
8. `nl.schrijven.voegwoorden`: **Verbindingswoorden**, core, *built*
   - Drills: `en`, `maar`, `want`, `dus`, `omdat`, `als`, `dat`, meaning *and* the word
     order each one forces (`want` keeps it, `omdat` sends the verb to the end).
   - Mechanic: splice two sentence strips with a connector; the strip visibly re-orders
     so the verb move is the feedback.
9. `nl.schrijven.woorden`: **Woordenschat per thema**, core, *built*
   - Drills: **productive** vocabulary (type the Dutch, don't just recognise it) for the
     themes DUO actually sets: werk, gezondheid/dokter, wonen/buren, school/kinderen,
     afspraken, winkelen.
   - Mechanic: a themed departure board where the English rolls in and the Dutch must be
     typed before the row flips.
   - Rationale: the rest of the roadmap is grammar. At A2 the more common failure is not
     having the words for the topic at all, and writing needs them productively.
10. `nl.schrijven.voorzetsels`: **Op maandag om negen uur**, core, *built*
    - Drills: prepositions of time and place, `op maandag`, `om 9.00 uur`, `in januari`,
      `naar de dokter`, `bij de gemeente`, `van … tot`: together with writing dates,
      times and numbers as a message needs them (`half drie`, `kwart over acht`, `3 maart`).
    - Mechanic: read a clock/calendar widget, then type the full Dutch phrase, preposition
      included.
    - Absorbs the former optional `datumtijd` game and is promoted to core: preposition
      choice is high-frequency and high-error in exactly the appointment and message tasks
      the exam sets.
11. `nl.schrijven.vragen`: **Vragen stellen**, core, *built*
    - Drills: `wie/wat/waar/wanneer/hoe/waarom/hoeveel`, and yes/no questions by inversion.
    - Mechanic: reverse quiz, the answer is given with one part underlined; build the
      question that fits it.
12. `nl.schrijven.nietgeen`: **Niet of geen**, core, *built*
    - Drills: `niet` vs `geen`, and *where* the negation goes in the sentence.
    - Mechanic: one chip, several highlighted gaps in a live sentence, drop it in the
      right slot.
13. `nl.schrijven.dehet`: **De of het**, optional, *built*
    - Drills: article choice and the adjective `-e` (`het grote huis` / `een groot huis`).
    - Mechanic: sort nouns into two lanes, then the adjective ending follows.
14. `nl.schrijven.wijkkrant`: **Wijkkrant**, core, *built*, exam-task game
    - A short text about yourself: three "Denk aan" questions, at least three sentences,
      written in the ik-form. 12 topics; 3 follow the oefenexamens.
15. `nl.schrijven.informeel`: **Informeel bericht**, core, *built*, exam-task game
    - An e-mail or a note to someone you say je to. Two of the 12 are picture notes
      (*Briefje voor een collega*), and *Boek lenen* keeps the "Beste + first name = je"
      trap. 3 follow the oefenexamens.
16. `nl.schrijven.formeel`: **Formele e-mail**, core, *built*, exam-task game
    - An e-mail to someone you say u to: a teacher, a manager, a landlord, a webshop.
      12 tasks; 3 follow the oefenexamens.

The former capstone, `nl.schrijven.examen` (**Schrijfopdracht**), was removed: its level 1
(finishing a bare sentence stem) matched nothing in the real exam, and the four exam-task
games cover its level 2 task by task.

### Things deliberately NOT separate games

- **Modale werkwoorden** and **scheidbare werkwoorden** were considered as standalone
  games. Their word order now lives in game 1 and their perfectum forms in game 3, which
  covers the gap without two more mechanics to design. Modal conjugation
  (`kan`/`kunt`/`kunnen`) sits in game 2.
- **Zinnen afmaken** was level 1 of the old capstone and was dropped with it: the exam has
  no such part.
- **Imperfectum** (`was`, `had`, `waren`, `hadden`) belongs as a second mode inside game 3,
  not as a fourteenth mechanic. A2 writing uses the perfectum for the past; only these
  few forms are genuinely unavoidable.

### The exam-task games (14 to 16, and 5)

They share one engine in `src/games/schrijven/taken/` (`TextTaskGame`, `checks.ts`,
`useTasks.ts`, `parts.tsx`); each game folder holds only its `data.ts` and a thin
component. The screen mirrors the exam page: the brief and its bullets, then the e-mail
window, note, newspaper box or form, with the greeting and closing already printed.

- **There are no wrong answers.** A task is either finished or not finished yet.
- **A template card** (`taken/templates.ts`) sits above the writing space: one fixed frame
  per task type, with gaps, to learn by heart and fit each task's bullets into. It is how
  people the owner knows who passed prepared, and it replaced a planned separate
  template game (the owner chose the card, October 2026).
- **Hint** works at any time: it reads the text so far and shows the most useful next
  step. Pressed again on the same problem it goes deeper: what is missing (English), then
  a Dutch sentence starter, then a whole Dutch example sentence.
- **Submit** finishes the task when nothing blocking is left, and shows a model answer;
  otherwise it lists what is still missing.
- **Blocking:** every point from the brief, the register the printed greeting demands,
  the minimum number of sentences, a capital and a full stop on every sentence, and the
  name under the closing. **Advice, never blocking:** inversion after a fronted time or
  place, the verb after `omdat` and after `want`, `-d`/`-dt`, a greeting or closing
  written a second time, a line copied from the instructions.
- **Honesty.** There is no server or LLM on GitHub Pages, so the checks are patterns, not
  understanding: a point is "found" when one of its typical words appears. Every point
  the checker cannot find gets an **I covered this** tick, so an answer in unexpected
  words is never blocked. The app says this under the buttons. Never report a text as
  good Dutch on the strength of these checks.
- **Exam content.** The oefenexamens say "Het examen is geheim" and are (c) Ministerie van
  SZW, and this repo is public, so the 3 tasks per game that follow them keep the
  situation and the bullets but are reworded, with other names; photos are emoji.
- `npm run check:content` holds every model answer and example to the app's own checker
  (no issue at all, advice included), checks that each point's example matches its own
  keywords, that weekdays agree with dates, that a form filled with the sample values
  passes, and that the checker still catches a set of deliberate slips.

### Counting

Schrijven is "ready" when the 15 core games are done. The one optional game sharpens
accuracy but nothing in the exam depends on it alone: keep that distinction visible in
the per-exam counter so "ready" stays honest. Note also that a drill counts as done only
when every item has been answered correctly *first time* (section 8), so the counter
reflects mastery rather than exposure; the four exam-task games count tasks finished.

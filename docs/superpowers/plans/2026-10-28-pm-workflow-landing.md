# PM workflow landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить лендинг под процесс продакта «созвон → транскрипт в хранилище → агент», со сквозным примером «Смена», скачиваемым стартовым набором, двумя маршрутами настройки и исправленными фактами.

**Architecture:** Лендинг остаётся одной страницей Vite + React; `src/App.tsx` превращается в композицию секций `src/sections/*.tsx`. Контент-константы живут в `src/site-content.mjs` (ссылки, факты релиза) и новом `src/demo-content.mjs` (дословные фрагменты набора как структурированные блоки, рендер через `src/DemoDoc.tsx`). Вкладки — свой `src/Tabs.tsx` без библиотек. Документация получает страницу `docs/workflow.md`. Набор уходит zip-ассетом релиза `starter-kit` публичного `mac-transcribe-releases`, архив собирает `tools/pack-kit.sh`.

**Tech Stack:** React 19, Vite 8, TypeScript 5.9, VitePress 1.6, `node --test`, bash + zip, `gh`.

**Spec:** `docs/superpowers/specs/2026-10-28-pm-workflow-landing-design.md` — тексты блоков берутся оттуда дословно (разделы 1–8), здесь повторены только значения, попадающие в тесты.

## Global Constraints

- Репозиторий `/Users/artem/projects/mac-transcribe-site`, ветка `pm-workflow-landing` от `master` 7112296. Набор — `/Users/artem/projects/product-ai/lite` на коммите `bd03ed2` (читать через `git -C /Users/artem/projects/product-ai show bd03ed2:lite/<файл>`; рабочее дерево product-ai не трогать, кроме Task 7).
- Никаких новых зависимостей в `package.json`.
- Запрещённые слова в `src/`, `index.html`, `docs/*.md`: «нотариз», «xattr», «суммаризац», «В вольт», «626», «26.4», «60 МБ». Кнопка приложения — «В хранилище» (EN «To vault»). Слово «вольт» как термин допустимо.
- Никаких ссылок на `github.com/art-ps/mac-transcribe/` и `github.com/art-ps/product-ai`. Никаких реальных разговоров: фрагменты только из `lite/` «Смены», копируются дословно, без редактуры.
- Факты: macOS 26.0+, Apple Silicon; DMG 40 МБ; модель 483–947 МБ; GigaAM v3 326 МБ; 13 языков; набор ~70 КБ; Claude Code 2.1.309 — три сценария, Codex 0.153.4 — сценарий 1.
- Umami: `data-umami-event="download"` места `header|hero|final`; `data-umami-event="kit"` места `kit|final`; `data-umami-event="example"` место `hero`. Без `umami.track`.
- Коммиты без трейлеров `Co-Authored-By` / `Claude-Session`. Никаких `git push`, `gh release`, правок README чужих репозиториев — только по явному «да» владельца (Task 7 готовит, не публикует). Не читать `~/Library/Application Support/mac-transcribe/` и `~/Obsidian`.
- Scratchpad для временных файлов: `/private/tmp/claude-501/-Users-artem-projects-mac-transcribe/7becc1de-0c99-4cc7-b66a-ccd314b8a711/scratchpad/site/`.
- Проверки проекта: `npm test`, `npm run lint`, `npm run build` (всё из корня сайта, `npm ci` уже выполнен — `node_modules` на месте).

## Review Focus

1. Посетитель с телефона 390 px: вкладки примера с длинными цитатами не должны давать горизонтальную прокрутку — Task 4 проверяет в браузере, CSS `overflow-wrap:anywhere` на блоках `DemoDoc`.
2. Клавиатурный пользователь: стрелки/Home/End по вкладкам, фокус на активной — Task 2 реализует, Task 7 проверяет руками.
3. Кнопка набора до загрузки ассета отдаёт 404 — порядок публикации в Task 7 (сначала релиз `starter-kit`, потом пуш сайта).
4. Старые якоря `#features`, `#privacy`, `#install` из внешних ссылок/документации: `#features` остаётся, `#privacy` остаётся на блоке доверия, `#install` → Task 5 ставит `id="install"` на колонку «Начинаю с нуля» — `docs/*.md` ссылки на лендинг проверить grep'ом в Task 5.
5. Тест ссылок читает только `App.tsx`, а кнопки разъезжаются по секциям — Task 1 переводит тест на все `src/**/*.tsx`.

---

### Task 1: Факты, ссылки и тесты-предохранители

**Files:**
- Modify: `src/site-content.mjs`, `src/site-content.d.mts`, `index.html`, `docs/index.md`
- Modify: `tests/site-content.test.mjs`, `tests/docs.test.mjs`

**Interfaces (produces):** `release.macOS = "macOS 26.0+, Apple Silicon"`, `release.sizeLabel = "40 МБ"`, `kitUrl`, `kitSizeLabel = "около 70 КБ"`, `contactUrl = "https://github.com/art-ps/mac-transcribe-releases/issues"`, `authorUrl = "https://vibecoded.ru"`; хелпер в тесте `readSources()` — конкатенация всех `src/**/*.tsx` + `index.html`.

- [ ] **Step 1:** в `tests/site-content.test.mjs` заменить чтение `App.tsx` на рекурсивный сбор `src/**/*.tsx` (`readdirSync(…, {recursive:true})`) и добавить тесты:

```js
test("release facts match the shipped app", () => {
  assert.equal(release.macOS, "macOS 26.0+, Apple Silicon");
  assert.equal(release.sizeLabel, "40 МБ");
});
test("kit and contact links point at the public releases repo", () => {
  assert.equal(kitUrl, "https://github.com/art-ps/mac-transcribe-releases/releases/download/starter-kit/mactranscribe-starter-kit.zip");
  assert.equal(contactUrl, "https://github.com/art-ps/mac-transcribe-releases/issues");
  for (const url of [downloadUrl, releasesUrl, kitUrl, contactUrl, authorUrl]) {
    assert.doesNotMatch(url, /github\.com\/art-ps\/(mac-transcribe\/|product-ai)/);
  }
});
test("site copy has no stale or forbidden wording", () => {
  const text = sources + indexHtml + docsPages; // docs/*.md верхнего уровня
  for (const bad of ["нотариз", "xattr", "суммаризац", "В вольт", "626", "26.4", "60 МБ"]) {
    assert.doesNotMatch(text, new RegExp(bad, "iu"), bad);
  }
});
```
  Существующий тест umami: ссылки `href={downloadUrl}` по-прежнему 3 с местами `header, hero, final` (порядок — порядок файлов `App.tsx` → секции по алфавиту; если порядок ломается, сравнивать как множество через `sort`).
- [ ] **Step 2:** `npm test` → FAIL (нет `kitUrl`, «26.4», «60 МБ»).
- [ ] **Step 3:** `src/site-content.mjs`: `macOS`, `sizeLabel`, добавить `kitUrl`, `kitSizeLabel`, `contactUrl`, `authorUrl`; продублировать в `.d.mts`. `docs/index.md`: «macOS 26.0 и новее», «DMG ~40 МБ». `index.html`: `<title>` и og/twitter title «MacTranscribe — от созвона к продуктовым решениям», description = подзаголовок hero из спеки (раздел 1).
- [ ] **Step 4:** `tests/docs.test.mjs`: в тесте «docs never mention what the site dropped» регулярка `/суммариз|нотариз|claude/iu` → `/суммариз|нотариз/iu`, комментарий: «claude» снят — Claude Code теперь часть описанного процесса (спека, приёмка п. 6).
- [ ] **Step 5:** `npm test` и `npm run lint` → PASS.
- [ ] **Step 6:** Commit `fix: real macOS floor and DMG size, kit and contact links, wording guards`.

### Task 2: Фрагменты демо, рендер документа и вкладки

**Files:**
- Create: `src/demo-content.mjs`, `src/demo-content.d.mts`, `src/DemoDoc.tsx`, `src/Tabs.tsx`
- Test: `tests/demo-content.test.mjs`

**Interfaces (produces):**
```ts
type DemoBlock =
  | { kind: "h"; text: string }            // подзаголовок (### в файле)
  | { kind: "p"; text: string }            // абзац, **жирный** допускается
  | { kind: "li"; text: string }           // пункт списка
  | { kind: "source"; file: string; time: string } // Источник: [[file]] [time]
  | { kind: "quote"; text: string }        // строка > цитата
  | { kind: "reply"; time: string; who: string; text: string } // **[t] who:** text
  | { kind: "meta"; text: string };        // строка frontmatter
export const demoFileNames: readonly string[]; // четыре MT-имени без .md
export const demoDocs: Readonly<Record<"transcript"|"analysis"|"synthesis"|"requirements", { title: string; path: string; blocks: DemoBlock[] }>>;
export const chainCards: readonly { label: string; blocks: DemoBlock[] }[]; // 4 карточки для hero
// DemoDoc: (props: { blocks: DemoBlock[] }) => JSX — article.demo-doc, source → <p class="demo-source">, quote → <blockquote>, reply → <p class="demo-reply"><time>…</time> <b>who:</b> text</p>
// Tabs: (props: { label: string; tabs: { id: string; title: string; content: ReactNode }[]; defaultId?: string }) => JSX — role=tablist/tab/tabpanel, aria-selected, aria-controls, стрелки ←/→, Home/End, roving tabindex
```

- [ ] **Step 1:** `tests/demo-content.test.mjs`:
```js
test("every source block points at a demo transcript with a timecode", () => {
  for (const b of allBlocks().filter((b) => b.kind === "source")) {
    assert.ok(demoFileNames.includes(b.file), b.file);
    assert.match(b.time, /^\d{2}:\d{2}:\d{2}$/);
  }
});
test("demo content never invents money", () => {
  assert.doesNotMatch(JSON.stringify([demoDocs, chainCards]), /₽|руб|\$/u);
});
test("every demo doc has blocks and names its source path", () => {
  for (const [key, doc] of Object.entries(demoDocs)) {
    assert.ok(doc.blocks.length >= 4, key);
    assert.match(doc.path, /^(Встречи|Исследования|Требования)\//u);
  }
  assert.equal(chainCards.length, 4);
});
```
- [ ] **Step 2:** `node --test tests/demo-content.test.mjs` → FAIL (модуля нет).
- [ ] **Step 3:** `src/demo-content.mjs` — шапка-комментарий «Дословные фрагменты набора product-ai/lite @ bd03ed2, без редактуры». Содержимое (строки — по `git show bd03ed2:lite/<файл>`):
  - `demoFileNames`: четыре имени из `lite/Встречи/` без `.md`.
  - `transcript` (`Встречи/MT-2026-10-06-1100 Интервью — кофейня «Точка», Марина.md`): `meta` × 9 строк frontmatter (`type`…`tags`), `h` «Полный транскрипт», `reply` × 6 первых реплик ([00:00:02] … [00:00:43]) и седьмую «[00:01:00] Я: Голосовым?».
  - `analysis` (`Исследования/… Марина — разбор.md`): «## Проблемы» пункты 1 и 2 целиком (`h` заголовок, `source`+`quote` пары: 00:00:43, 00:01:02, 00:01:19); «## Гипотезы» — `p` «Собеседник словами не подтвердил, выводы интервьюера.» и `li` пункт 1; «## Данных недостаточно» — `li` первый пункт (должность Марины). Заголовки разделов — `h` «Проблемы», «Гипотезы», «Данных недостаточно».
  - `synthesis` (`Исследования/Синтез — Почему управляющие ведут график в мессенджере.md`): `h` «Противоречия» + пункт 1 целиком (`p` жирный заголовок, три `source`/`quote` 00:03:19 Марина, 00:02:17 Антон, 00:08:44 Сергей, `p` «Мотивы называют противоположные…», `source`/`quote` 00:08:44 Антон); `h` «Гипотезы» + `p` «Утверждения собеседников без примеров и цифр, поданные как факт:» + пункт 1 (`li` текст, два `source`/`quote` 00:05:19, 00:05:34); `h` «Не проверено» + `li` «**Потери в деньгах от незакрытой смены.** Никто не считал (тема 9).» + `p` строка «Вопрос: …».
  - `requirements` (`Требования/Замены смен.md`): `h` «Что известно» + первые три `li` с их `source`/`quote`; `h` «Чего не хватает» + первые три `li` (с источниками, если они есть в файле).
  - `chainCards`: «Встреча» → `p` «Интервью — кофейня «Точка», Марина», `p` «11 минут 17 секунд, 2 участника»; «Транскрипт» → `reply` 00:00:24 и 00:00:43; «Файл в хранилище» → `p` имя файла, `meta` `source: mac-transcribe`, `meta` `speakers: [Я, Марина]`, `meta` `duration: 00:11:17`; «Выводы с цитатами» → `p` «**Работает ли общий чат для поиска замены.** Марина говорит «да», Антон — «нет вообще», у Сергея чат промолчал 15 минут.», `source`/`quote` Антон 00:02:17.
- [ ] **Step 4:** `src/DemoDoc.tsx` и `src/Tabs.tsx` по интерфейсу выше; `Tabs` хранит активную вкладку в `useState`, панели неактивных вкладок не рендерятся (`hidden` не нужен).
- [ ] **Step 5:** `npm test` и `npm run lint` → PASS.
- [ ] **Step 6:** Commit `feat: demo fragments from the starter kit, document renderer and accessible tabs`.

### Task 3: Первый экран и сценарии

**Files:**
- Create: `src/sections/Hero.tsx`, `src/sections/Scenarios.tsx`
- Modify: `src/App.tsx` (шапка, навигация, подключение секций вместо старого hero), `src/styles.css`
- Test: `tests/site-content.test.mjs` (дописать)

**Interfaces (consumes):** `release`, `downloadUrl` из Task 1; `chainCards`, `DemoDoc`, `Tabs` из Task 2.

- [ ] **Step 1:** тесты:
```js
test("hero states the outcome and offers the example", () => {
  assert.match(sources, /Ваши встречи — основа для исследований, решений и требований/u);
  const example = sources.match(/<a\b[^>]*href="#example"[^>]*>/g) ?? [];
  assert.ok(example.some((a) => /data-umami-event="example"/.test(a) && /data-umami-event-place="hero"/.test(a)));
});
test("header navigation covers the new sections", () => {
  for (const id of ["#scenarios", "#example", "#kit", "#setup", "#faq"]) assert.match(sources, new RegExp(`href="${id}"`));
});
```
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `Hero.tsx` по спеке, раздел 1: eyebrow, H1, подзаголовок, две кнопки (`download`/`hero` и якорь `#example` с `example`/`hero`), строка фактов из `release` + «бесплатно, без регистрации», лента `chainCards` (`ol.chain` → `li` с `label` и `DemoDoc`), полоска ответственности (три подписи). Анимация появления карточек — CSS `@keyframes` с `animation-delay` по индексу, отключена в `@media (prefers-reduced-motion: reduce)`.
- [ ] **Step 4:** `Scenarios.tsx` (`section#scenarios`) — `Tabs` с тремя вкладками из таблицы спеки (раздел 2), `defaultId="synthesis"`; в каждой панели «Что подаём на вход», «Что помогает подготовить агент», имя промпта (`_prompts/интервью.md` / `сопоставление.md` / `договорённости.md`), ссылка «Пример ниже» на `#example`; строка про «чего не хватает» под вкладками.
- [ ] **Step 5:** `App.tsx`: навигация «Сценарии · Пример · Набор · Настройка · FAQ · Документация»; старый hero удалить, подключить `Hero`, `Scenarios`; остальные старые секции пока остаются. CSS новых блоков в `styles.css` в существующих токенах (`--bg-raised`, `--line`, `--ink-soft`, `--s2`, `--rec`).
- [ ] **Step 6:** `npm test`, `npm run lint`, `npm run build` → PASS. `npm run dev` и скриншот в браузере на 1280 px: карточки ленты читаются, ничего не вылезает.
- [ ] **Step 7:** Commit `feat: outcome-first hero with the workflow chain and PM scenarios`.

### Task 4: Сквозной пример и стартовый набор

**Files:**
- Create: `src/sections/Example.tsx`, `src/sections/Kit.tsx`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `tests/site-content.test.mjs` (дописать)

**Interfaces (consumes):** `demoDocs`, `DemoDoc`, `Tabs` (Task 2); `kitUrl`, `kitSizeLabel` (Task 1).

- [ ] **Step 1:** тест:
```js
test("example viewer shows all four demo documents", () => {
  for (const key of ["transcript", "analysis", "synthesis", "requirements"]) assert.match(sources, new RegExp(`demoDocs\\.${key}\\b`));
});
```
  и расширить umami-тест: `href={kitUrl}` — пока 1 ссылка с `data-umami-event="kit"` и местом `kit` (Task 6 доведёт до двух).
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `Example.tsx` (`section#example`): заголовок, шесть шагов `ol`, `Tabs` с четырьмя вкладками (`title` из `demoDocs.*.title`, панель = имя файла `code` + `DemoDoc`), рядом `aside` «Что здесь видно» с пятью маркерами качества и подпись про Claude Code и вымышленные имена (спека, раздел 3). Вкладки сценариев из Task 3 ссылаются сюда якорями `#example`.
- [ ] **Step 4:** `Kit.tsx` (`section#kit`): заголовок, структура папок как `pre`, список содержимого, абзац про контекст продукта, строка про любую папку/Obsidian, кнопка «Скачать набор (zip)» `href={kitUrl}` `data-umami-event="kit" data-umami-event-place="kit"`, подпись «без регистрации, {kitSizeLabel}».
- [ ] **Step 5:** CSS: `.demo-doc` с `overflow-wrap:anywhere`, цитаты и источники визуально отделены; на `max-width: 900px` `aside` под просмотрщиком.
- [ ] **Step 6:** `npm test`, `npm run lint`, `npm run build` → PASS; браузер 390 px: вкладка «Сопоставление» без горизонтальной прокрутки (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 7:** Commit `feat: end-to-end «Смена» example and the starter kit block`.

### Task 5: Два маршрута настройки и страница документации

**Files:**
- Create: `src/sections/Setup.tsx`, `docs/workflow.md`
- Modify: `src/App.tsx`, `src/styles.css`, `docs/sidebar.mjs`, `docs/install.md` (ссылка на новую страницу одной строкой в конце)
- Test: `tests/docs.test.mjs` (существующие тесты сайдбара покрывают новую страницу), `tests/site-content.test.mjs`

- [ ] **Step 1:** тест: `assert.match(sources, /href="\.\/docs\/workflow"/)` (ссылка из блока настройки) и `assert.match(sources, /кнопкой «В хранилище»/u)`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `Setup.tsx` (`section#setup`): две колонки по спеке, раздел 5; колонка «Начинаю с нуля» получает `id="install"` (старый якорь); под колонками фраза про кнопку «В хранилище» и ссылка `./docs/workflow`. Старые секции `install` и `final-cta` из `App.tsx` удалить (финал вернётся в Task 6).
- [ ] **Step 4:** `docs/workflow.md` «Встречи → хранилище → агент» по спеке (раздел 5, абзац про страницу): оба маршрута развёрнуто; подразделы «Claude Code» (запуск в папке, `CLAUDE.md` = `@AGENTS.md`, подтверждение правок в чате или `--permission-mode acceptEdits`, в этом режиме дубликат ищется по имени файла) и «Codex» (`codex` в папке, `AGENTS.md`, `workspace-write`); «Чем проверено» с версиями; «Как проверить цитату» (таймкод → клик по реплике в приложении); «Где лежат файлы». Ссылка на набор — `kitUrl` текстом; на лендинг — полный URL (тест). В `docs/sidebar.mjs` — в группу «Как это работает» после «Работа с записями».
- [ ] **Step 5:** `grep -rn "#install\|#privacy\|#features" docs/*.md` — якоря остаются рабочими (`#install` на колонке, `#privacy` поставит Task 6, `#features` — Task 6).
- [ ] **Step 6:** `npm test`, `npm run lint`, `npm run build` (включая VitePress) → PASS.
- [ ] **Step 7:** Commit `feat: two setup routes on the landing and a workflow page in the docs`.

### Task 6: Возможности, доверие, FAQ, финал

**Files:**
- Create: `src/sections/Features.tsx`, `src/sections/Trust.tsx`, `src/sections/FinalCta.tsx`
- Modify: `src/App.tsx` (удалить оставшиеся старые секции `features`, `engine`, `privacy`; подвал с контактом), `src/styles.css`
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1:** тесты: umami — `href={kitUrl}` ровно 2 с местами `kit, final` (как множество); `href={downloadUrl}` ровно 3 с `header, hero, final`; `assert.match(sources, /<details/)` (FAQ и «Под капотом»); `assert.match(sources, /href=\{contactUrl\}/)`; семь вопросов FAQ присутствуют текстом («Нужен ли Obsidian», «подписка», «без интернета», «ошибку в расшифровке», «Где лежат файлы», «готовую запись», «делает само»).
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `Features.tsx` (`section#features`): таблица «Возможность | Польза для продакта» из спеки (раздел 6) + скриншот `app-screenshot.webp` с прежним `alt`; `<details>` «Под капотом: модели и размеры» с текстом и цифрами прежнего блока `engine` (Whisper/WhisperKit, GigaAM v3, pyannote, 13 языков, до 947 МБ, 326 МБ, аудиокодек Opus).
- [ ] **Step 4:** `Trust.tsx` (`section#faq`, внутри `div#privacy` для старого якоря): три карточки приватности по этапам; FAQ — семь `<details><summary>` с ответами по фактам спеки; блок автора: «Автор — Артём Писарев», ссылки `authorUrl` и `contactUrl` («Ошибки и вопросы — issues в репозитории релизов»).
- [ ] **Step 5:** `FinalCta.tsx`: текст спеки (раздел 8), кнопки `download`/`final` и `kit`/`final`, подпись. Подвал: Документация, Все версии, Контакт (`contactUrl`).
- [ ] **Step 6:** `App.tsx` — только композиция: Header → Hero → Scenarios → Example → Kit → Setup → Features → Trust → FinalCta → Footer. Удалить неиспользуемые `privacyItems`, `waveBars` (если `FinalCta` их не использует) и осиротевшие CSS-классы старых секций.
- [ ] **Step 7:** `npm test`, `npm run lint`, `npm run build` → PASS; браузер 1280 и 390 px: вся страница сверху вниз, якоря шапки ведут к блокам, `<details>` открываются.
- [ ] **Step 8:** Commit `feat: features as PM value, staged privacy, FAQ and the first-step finale`.

### Task 7: Упаковка набора, README набора и подготовка публикации

**Files:**
- Create: `tools/pack-kit.sh` (сайт), `docs/superpowers/plans/2026-10-28-pm-workflow-landing-publish.md` (чеклист публикации с текстом README репозитория релизов)
- Modify: `README.md` сайта (структура: секции, `tools/pack-kit.sh`, набор), `/Users/artem/projects/product-ai/lite/README.md` (отдельный коммит в product-ai)

- [ ] **Step 1:** `tools/pack-kit.sh LITE_DIR [CHECK_KIT]`: `set -euo pipefail`; `CHECK_KIT` по умолчанию `LITE_DIR/../tools/check-kit.sh`, нет файла → `FAIL: нет check-kit.sh`, exit 1; запускает `bash CHECK_KIT LITE_DIR` (не OK → exit 1); копирует `LITE_DIR` во временную папку как `Смена-исследование`, удаляет `.DS_Store`, `zip -X -r` в `./mactranscribe-starter-kit.zip` (в текущей папке, путь печатает), выводит `unzip -l` и размер. Проверка вручную: запустить на `/Users/artem/projects/product-ai/lite` после Step 3; `unzip -l` содержит `Смена-исследование/AGENTS.md`, `CLAUDE.md`, три `_prompts/*.md`, четыре `Встречи/*.md`, нет `.DS_Store`; второй запуск — тот же список файлов; размер ≈ 72 КБ. Архив класть в scratchpad, не в репозиторий (`.gitignore`: `*.zip`).
- [ ] **Step 2:** `README.md` сайта: структура `src/sections/`, `src/demo-content.mjs` (источник — набор, коммит), `tools/pack-kit.sh` и как обновить ассет `starter-kit` (`gh release upload starter-kit mactranscribe-starter-kit.zip --clobber -R art-ps/mac-transcribe-releases`).
- [ ] **Step 3:** `product-ai/lite/README.md` — четыре правки по спеке («Набор», абзац про README): шаг 1 с архивом и репозиторием; оговорка про копию только для репозитория; «или с копией в репозитории» убрать; «Выросли из папки» без ссылки на инсталлятор. `bash /Users/artem/projects/product-ai/tools/check-kit.sh` → OK. Коммит в `product-ai` на `master`: `docs: lite README works for the zip download too`. Без пуша.
- [ ] **Step 4:** чеклист публикации `…-publish.md`: (1) `tools/pack-kit.sh /Users/artem/projects/product-ai/lite` → архив; (2) `gh release create starter-kit <архив> -R art-ps/mac-transcribe-releases --title "Стартовый набор продакта для работы со встречами" --notes "<две строки: что внутри, ссылка на сайт>"`; (3) README `mac-transcribe-releases` — полный новый текст: «26.0+», без «суммаризация», что умеет приложение в одном абзаце, ссылки на сайт, документацию и набор (`gh api -X PUT repos/art-ps/mac-transcribe-releases/contents/README.md` с `sha` текущего файла); (4) `git push origin master` сайта → Pages; (5) проверка живого сайта `curl -s <url> | grep -c "Ваши встречи"` и `curl -sI <kitUrl> | head -1` → 302. Каждый пункт — только по «да» владельца.
- [ ] **Step 5:** финальные проверки сайта: `npm test`, `npm run lint`, `npm run build`; браузер: скриншоты 1280/390 в scratchpad `site/final-1280.png`, `site/final-390.png`; клавиатура по вкладкам сценариев и примера (Tab → стрелки → Enter не нужен, панель меняется по стрелкам).
- [ ] **Step 6:** Commit сайта `chore: kit packer, publish checklist, README`.

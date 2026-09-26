# Раздел документации MacTranscribe — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить на сайт MacTranscribe раздел документации из семи страниц на VitePress, который собирается и деплоится вместе с лендингом.

**Architecture:** VitePress живёт в `docs/` репозитория сайта и собирается после лендинга в `dist/docs`. Сайдбар вынесен в `docs/sidebar.mjs`, чтобы node-тесты сверяли его с файлами страниц. Каждое утверждение на страницах сверяется с кодом приложения в `~/projects/mac-transcribe`.

**Tech Stack:** VitePress ^1.6.4, Vite 8, React 19 (лендинг), node:test, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-26-docs-section-design.md` — прочитать целиком до начала любой задачи.

## Global Constraints

- Репозиторий сайта: `~/projects/mac-transcribe-site`, ветка `master`. Код приложения (только чтение!): `~/projects/mac-transcribe`, сверяться с коммитом `93296fd`.
- `base: "/mac-transcribe-site/docs/"`, `outDir: "../dist/docs"`, `lang: "ru-RU"`, `cleanUrls: true`, `lastUpdated: true`, `srcExclude: ["superpowers/**"]`.
- Ссылки из документации на лендинг — только полным URL `https://art-ps.github.io/mac-transcribe-site/`.
- Аналитика: `<script async src="https://stats.pisarev.me/script.js" data-website-id="8dab4e02-8bda-4cb5-a41a-a9ac3ff01ca4">`. Только `async`, никогда `defer`.
- Итоговый сайдбар (пути и заголовки ровно такие):
  - «Начало»: `/` «Обзор», `/install` «Установка»
  - «Как это работает»: `/transcription` «Запись и транскрипция», `/recordings` «Работа с записями»
  - «Справочник»: `/settings` «Настройки», `/privacy` «Приватность», `/troubleshooting` «Решение проблем»
- На страницах **нельзя**: «суммаризация» в любой форме, «Claude», «нотаризация» в любой форме, скриншоты и картинки интерфейса.
- **Opus** — только как «аудиокодек Opus» (слово «кодек» в пределах 40 символов от «Opus»).
- Язык страниц — русский. Пункты интерфейса — как в русской локализации приложения, в «ёлочках» (строки берутся из `settings.text("<ru>", "<en>")` в коде — первый аргумент).
- Каждый факт на странице подтверждён кодом. В отчёте о задаче — таблица «утверждение → `файл:строка`». Не нашёл в коде — не пиши.
- Не выдумывать поведение. Нельзя обещать того, что не проверяется: у MacTranscribe нет CI-гейта приватности.
- Коммиты без строк соавторства (`Co-Authored-By`) — правило владельца репозитория.

## Review Focus

1. **Устаревший или выдуманный факт** — например «транскрипция начинается сразу после записи» или «проверка обновлений выключена по умолчанию». Человек поверит странице и не найдёт в приложении описанного. Ловит ревьюер по таблице `файл:строка` в каждой задаче со страницей; контрольные факты перечислены в spec.
2. **Запрещённые слова и голый «Opus»** — возвращают то, что владелец убрал с сайта. Ловит тест `docs never mention what the site dropped` (Task 1).
3. **Страница есть, а в сайдбаре нет (или наоборот)** — страница недостижима или сайдбар ведёт на 404. Ловят тесты сайдбара (Task 1); каждая задача со страницей добавляет пункт сайдбара в том же коммите.
4. **Ссылки ломаются под подпутём github.io** — ссылка на лендинг вида `/` уводит на `art-ps.github.io/`. Внутренние ссылки ловит сборка VitePress (dead links валят `vitepress build`), ссылки на лендинг — тест `links to the landing page use its full URL` (Task 1).
5. **Аналитика снова блокирует отрисовку**. Ловит тест `analytics in docs does not block rendering` (Task 1) и проверка в браузере (Task 7).

---

### Task 1: Каркас VitePress, тесты, ссылка с лендинга

**Files:**
- Modify: `package.json` (devDependency `vitepress`, скрипты `build`, `docs:dev`)
- Create: `docs/.vitepress/config.mts`
- Create: `docs/sidebar.mjs`
- Create: `docs/index.md` (временный однострочник, настоящий текст — Task 2)
- Create: `docs/public/mac-transcribe-icon.png` (копия `public/mac-transcribe-icon.png`)
- Create: `tests/docs.test.mjs`
- Modify: `src/App.tsx` (ссылка «Документация» в шапке и подвале)
- Modify: `.github/workflows/pages.yml` (`fetch-depth: 0` у checkout)
- Modify: `.gitignore` (`docs/.vitepress/cache`)

**Interfaces:**
- Produces: `docs/sidebar.mjs` экспортирует `export const sidebar = [{ text: string, items: [{ text: string, link: string }] }]`. Каждая следующая задача добавляет в него свои пункты. `link` — `"/"` для `index.md`, иначе `"/<имя файла без .md>"`.
- Produces: `tests/docs.test.mjs` — тесты, которые должны оставаться зелёными после каждой задачи.

- [ ] **Step 1: Установить VitePress**

```bash
cd ~/projects/mac-transcribe-site
npm install -D vitepress@^1.6.4
```

Expected: в `package.json` → `devDependencies` появился `"vitepress": "^1.6.4"`, `package-lock.json` обновлён.

- [ ] **Step 2: Написать падающие тесты**

Create `tests/docs.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { sidebar } from "../docs/sidebar.mjs";

const docsDir = new URL("../docs/", import.meta.url);
// Только верхний уровень docs/: рабочие заметки в docs/superpowers не публикуются.
const pages = readdirSync(docsDir).filter((name) => name.endsWith(".md"));
const links = sidebar.flatMap((group) => group.items.map((item) => item.link));
const linkFor = (page) => (page === "index.md" ? "/" : `/${page.replace(/\.md$/, "")}`);
const pageFor = (link) => (link === "/" ? "index.md" : `${link.slice(1)}.md`);
const read = (page) => readFileSync(new URL(page, docsDir), "utf8");

test("every docs page is in the sidebar", () => {
  for (const page of pages) {
    assert.ok(links.includes(linkFor(page)), `${page} is missing from docs/sidebar.mjs`);
  }
});

test("every sidebar item points at an existing page", () => {
  for (const link of links) {
    assert.ok(existsSync(new URL(pageFor(link), docsDir)), `${link} has no docs/${pageFor(link)}`);
  }
});

// Владелец убрал это с сайта: суммаризация уходит из приложения, нотаризацию не рекламируем,
// а «Opus» без слова «кодек» путают с моделью Claude Opus.
test("docs never mention what the site dropped", () => {
  for (const page of pages) {
    const text = read(page);
    assert.doesNotMatch(text, /суммариз|нотариз|claude/iu, page);
    for (const match of text.matchAll(/Opus/g)) {
      const around = text.slice(Math.max(0, match.index - 40), match.index + 44);
      assert.match(around, /кодек/iu, `${page}: "Opus" without "кодек": …${around}…`);
    }
  }
});

// Документация живёт на подпути github.io: ссылка "/" увела бы на art-ps.github.io.
test("links to the landing page use its full URL", () => {
  for (const page of pages) {
    const text = read(page);
    assert.doesNotMatch(text, /\]\(\/mac-transcribe-site\//, `${page}: use https://art-ps.github.io/mac-transcribe-site/`);
  }
});

// defer-скрипты выполняются по порядку и задерживают всё после себя (см. коммит d38df8f).
test("analytics in docs does not block rendering", () => {
  const config = readFileSync(new URL(".vitepress/config.mts", docsDir), "utf8");
  assert.match(config, /stats\.pisarev\.me\/script\.js/);
  assert.match(config, /async: ""/);
  assert.doesNotMatch(config, /defer: ""/);
});

test("landing links to the docs from the header and the footer", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.equal(app.match(/href="\.\/docs\/"/g)?.length, 2);
});
```

- [ ] **Step 3: Убедиться, что тесты падают**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../docs/sidebar.mjs'`.

- [ ] **Step 4: Сайдбар, конфиг, заглушка главной, иконка**

Create `docs/sidebar.mjs`:

```js
// Сайдбар отдельно от config.mts, чтобы node-тесты могли сверить его со страницами.
export const sidebar = [
  {
    text: "Начало",
    items: [{ text: "Обзор", link: "/" }],
  },
];
```

Create `docs/index.md`:

```md
# MacTranscribe
```

```bash
mkdir -p docs/public docs/.vitepress
cp public/mac-transcribe-icon.png docs/public/mac-transcribe-icon.png
```

Create `docs/.vitepress/config.mts`:

```ts
import { defineConfig } from "vitepress";
import { sidebar } from "../sidebar.mjs";

const landing = "https://art-ps.github.io/mac-transcribe-site/";

// Собирается после лендинга прямо в dist/docs: один деплой GitHub Pages несёт и
// страницу, и документацию. Сайт живёт на подпути github.io, отсюда base.
export default defineConfig({
  title: "MacTranscribe",
  description:
    "Документация MacTranscribe: установка, запись и транскрипция, работа с записями, настройки и приватность.",
  lang: "ru-RU",
  base: "/mac-transcribe-site/docs/",
  outDir: "../dist/docs",
  // Спеки и планы лежат рядом, но это рабочие документы, а не часть сайта.
  srcExclude: ["superpowers/**"],
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/mac-transcribe-site/docs/mac-transcribe-icon.png" }],
    [
      "script",
      {
        // async, не defer: defer-скрипт выполнился бы строго по порядку и задержал бы страницу,
        // пока stats.pisarev.me не ответит.
        async: "",
        src: "https://stats.pisarev.me/script.js",
        "data-website-id": "8dab4e02-8bda-4cb5-a41a-a9ac3ff01ca4",
      },
    ],
  ],
  themeConfig: {
    logo: "/mac-transcribe-icon.png",
    nav: [
      { text: "Документация", link: "/" },
      { text: "Скачать", link: landing },
    ],
    sidebar,
    outline: { label: "На этой странице", level: [2, 3] },
    docFooter: { prev: "Назад", next: "Дальше" },
    darkModeSwitchLabel: "Оформление",
    returnToTopLabel: "Наверх",
    sidebarMenuLabel: "Разделы",
    lastUpdatedText: "Обновлено",
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "Поиск", buttonAriaLabel: "Поиск по документации" },
          modal: {
            noResultsText: "Ничего не найдено",
            resetButtonTitle: "Сбросить",
            footer: { selectText: "выбрать", navigateText: "переход", closeText: "закрыть" },
          },
        },
      },
    },
    footer: {
      message:
        'Локальная транскрипция встреч для macOS. Проект <a href="https://vibecoded.ru" target="_blank" rel="noopener">vibecoded.ru</a>.',
      copyright: '<a href="https://art-ps.github.io/mac-transcribe-site/">MacTranscribe</a>',
    },
  },
});
```

- [ ] **Step 5: Ссылка с лендинга**

In `src/App.tsx`, header nav — после `<a href="#install">Установка</a>` добавить строку:

```tsx
            <a href="./docs/">Документация</a>
```

Footer nav — перед ссылкой «Все версии» добавить:

```tsx
          <a href="./docs/">Документация</a>
```

- [ ] **Step 6: Скрипты сборки, workflow, gitignore**

In `package.json` `scripts`:

```json
    "build": "tsc -b && vite build && vitepress build docs",
    "docs:dev": "vitepress dev docs",
```

In `.github/workflows/pages.yml` шаг checkout:

```yaml
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
        with:
          # Полная история: без неё lastUpdated в документации показывает у всех страниц
          # дату последнего коммита.
          fetch-depth: 0
```

Append to `.gitignore`:

```
docs/.vitepress/cache
```

- [ ] **Step 7: Тесты и сборка зелёные**

Run: `npm test`
Expected: PASS, все тесты (3 старых + 6 новых).

Run: `npm run build`
Expected: успех; есть `dist/index.html` (лендинг) и `dist/docs/index.html`; нет `dist/docs/superpowers`:

```bash
test -f dist/index.html && test -f dist/docs/index.html && ! test -e dist/docs/superpowers && echo OK
grep -o '<script async src="https://stats.pisarev.me/script.js"' dist/docs/index.html
```

Expected: `OK` и найденная строка скрипта.

- [ ] **Step 8: Коммит**

```bash
git add package.json package-lock.json docs/.vitepress/config.mts docs/sidebar.mjs docs/index.md docs/public/mac-transcribe-icon.png tests/docs.test.mjs src/App.tsx .github/workflows/pages.yml .gitignore
git commit -m "feat: VitePress documentation scaffold linked from the landing"
```

---

### Task 2: «Обзор» и «Установка»

**Files:**
- Modify: `docs/index.md` (заменить заглушку)
- Create: `docs/install.md`
- Modify: `docs/sidebar.mjs`

**Interfaces:**
- Consumes: `docs/sidebar.mjs` из Task 1.
- Produces: страницы `/` и `/install`; на них ссылаются следующие страницы как `/install` и `/`.

Источники в `~/projects/mac-transcribe` (читать, не менять): `Info.plist` (`LSMinimumSystemVersion`, `NSMicrophoneUsageDescription`, bundle id), `Sources/AudioCapture.swift` (ScreenCaptureKit — зачем разрешение на запись экрана), `Sources/WhisperModels.swift` (модели, размеры, выбор по умолчанию), `Sources/GigaAMDownload.swift` (размер GigaAM — сумма `files`), `Sources/DependencyManager.swift` (что скачивается при первом запуске), `Sources/ConversationStore.swift`, `Sources/WhisperModels.swift:20-23`, `Sources/OfflinePass.swift:30-50` (где лежат данные — для удаления), лендинг `src/App.tsx` (размер DMG ~60 МБ).

- [ ] **Step 1: Написать `docs/index.md`** по структуре:

  - `# MacTranscribe` + абзац: записывает микрофон и системный звук, превращает записи в текст, всё локально.
  - `## С чего начать` — нумерованный список ссылок: [Установка](/install), [Запись и транскрипция](/transcription), [Работа с записями](/recordings), [Настройки](/settings).
  - `## Требования` — таблица «Что | Значение»: система (macOS 26.4 и новее), процессор (Apple Silicon), место на диске (DMG ~60 МБ; модели — по фактическим размерам из кода), разрешения (микрофон, запись экрана).
  - `## Что MacTranscribe не делает` — список: не отправляет звук и транскрипты в сеть ([подробности](/privacy)); не пишет видео; не требует регистрации и подписки.

  Ссылки `/transcription`, `/recordings`, `/settings`, `/privacy` появятся в следующих задачах — чтобы сборка не упала на мёртвых ссылках до этого, **в этой задаче ставь только ссылки на `/install` и `/`**, а список «С чего начать» и ссылку на приватность оформи обычным текстом без ссылок и отметь в отчёте. Task 6 превратит их в ссылки.

- [ ] **Step 2: Написать `docs/install.md`** по структуре:

  - `# Установка`
  - `## Скачать и перенести` — скачать DMG с лендинга (полный URL), перетащить в «Программы», запустить.
  - `## Разрешения` — **Микрофон** (зачем; текст запроса из `NSMicrophoneUsageDescription`), **Запись экрана** (так macOS отдаёт системный звук через ScreenCaptureKit; видео не записывается); где выдаются: «Системные настройки» → «Конфиденциальность и безопасность».
  - `## Первый запуск` — какие модели скачиваются и когда, сколько места, нужен интернет один раз.
  - `## Удаление` — выйти из приложения, удалить `MacTranscribe.app`, удалить данные: блок `bash` с `defaults delete <bundle id из Info.plist>` и `rm -rf` каждого каталога данных, найденного в коде (записи, модели WhisperKit, sherpa, GigaAM). Каждый путь — только если он есть в коде.

- [ ] **Step 3: Сайдбар** — в группу «Начало» `docs/sidebar.mjs` добавить после «Обзор»:

```js
      { text: "Установка", link: "/install" },
```

- [ ] **Step 4: Проверить**

Run: `npm test && npm run build`
Expected: PASS и успешная сборка; `dist/docs/install.html` существует.

- [ ] **Step 5: Коммит**

```bash
git add docs/index.md docs/install.md docs/sidebar.mjs
git commit -m "docs: overview and install pages"
```

Отчёт: таблица «утверждение → `файл:строка`» по обеим страницам.

---

### Task 3: «Запись и транскрипция»

**Files:**
- Create: `docs/transcription.md`
- Modify: `docs/sidebar.mjs`

**Interfaces:**
- Consumes: `docs/sidebar.mjs`, страницы `/` и `/install` (на них можно ссылаться).
- Produces: страница `/transcription`.

Источники: `Sources/DualChannel.swift` (каналы L/R, «Я» и собеседники), `Sources/AppSettings.swift` (дефолты `autoTranscribe`, `liveTranscription`, язык), `Sources/SettingsTranscriptionTabs.swift` (тексты переключателей и подписей), `Sources/MacTranscribeApp.swift` (кнопка «Транскрибировать» ~`:562`, автозапуск `:185`, очередь, `speakers:`), `Sources/PassQueue.swift` (очередь, пропуск готовых), `Sources/EngineChoice.swift` (когда GigaAM, когда Whisper), `Sources/WhisperModels.swift` (модели и размеры), `Sources/GigaAMDownload.swift`, `Sources/AppSettings.swift:17-40` (языки), `Sources/RetranscribeMenu.swift` (разделение по спикерам).

- [ ] **Step 1: Написать `docs/transcription.md`** по структуре:

  - `# Запись и транскрипция`
  - `## Что записывается` — два канала: микрофон (подписывается «Я») и системный звук (собеседники); почему реплики разделены без настройки.
  - `## Когда появляется текст` — по умолчанию запись сохраняется, транскрипция — кнопкой «Транскрибировать»; опция «Транскрибировать сразу после остановки записи» (по умолчанию выключена), её подпись из приложения; очередь нескольких записей, уже готовые пропускаются.
  - `## Live во время записи` — опция, по умолчанию выключена; что даёт и чем платит (подпись из приложения про память и батарею).
  - `## Движки и модели` — таблица «Движок | Языки | Модели и размеры | Когда выбирать»: Whisper (модели из каталога, размер, какая по умолчанию и от чего зависит), GigaAM v3 (только русский, размер, когда проход всё равно уходит на Whisper).
  - `## Языки` — русский по умолчанию, ещё 12 языков списком, автоопределение.
  - `## Кто что сказал` — по умолчанию «Я» и собеседники по каналам; разделение каждого участника — через «Перетранскрибировать» с галкой разделения по спикерам; диаризация локальная.

- [ ] **Step 2: Сайдбар** — в `docs/sidebar.mjs` после группы «Начало» добавить группу:

```js
  {
    text: "Как это работает",
    items: [{ text: "Запись и транскрипция", link: "/transcription" }],
  },
```

- [ ] **Step 3: Проверить**

Run: `npm test && npm run build`
Expected: PASS, `dist/docs/transcription.html` существует.

- [ ] **Step 4: Коммит**

```bash
git add docs/transcription.md docs/sidebar.mjs
git commit -m "docs: recording and transcription page"
```

Отчёт: таблица «утверждение → `файл:строка`».

---

### Task 4: «Работа с записями»

**Files:**
- Create: `docs/recordings.md`
- Modify: `docs/sidebar.mjs`

**Interfaces:**
- Consumes: `docs/sidebar.mjs`, страницы `/`, `/install`, `/transcription`.
- Produces: страница `/recordings`.

Источники: `Sources/ConversationStore.swift` (где и как хранятся записи), `Sources/OggRecorder.swift` (формат и аудиокодек Opus), `Sources/PlayerView.swift` (плеер, «Скачать» — сохранение `.ogg`), `Sources/MacTranscribeApp.swift` (импорт `:201-209`, `importFile` `:808+`, меню «+», выбор нескольких записей Shift/Cmd и действия над выделением, «Перетранскрибировать» `:394+`, экспорт `:840-870`), `Sources/RetranscribeMenu.swift`, `Sources/Export.swift` (TXT, Markdown, SRT), `Sources/VaultExport.swift` (экспорт в вольт Obsidian, имя файла, куда по умолчанию), `Sources/AppSettings.swift:94-97` (путь вольта по умолчанию).

- [ ] **Step 1: Написать `docs/recordings.md`** по структуре:

  - `# Работа с записями`
  - `## Где хранятся записи` — каталог, формат (аудиокодек Opus в `.ogg`), что лежит рядом (транскрипты).
  - `## Прослушивание` — клик по фразе — перемотка; подсветка текущей реплики; «Скачать» — сохранить аудио файлом.
  - `## Перетранскрибировать` — другой скачанной моделью любого движка; с разделением по спикерам.
  - `## Импорт готовых файлов` — перетащить аудио или видео в окно (по одному файлу) или выбрать через меню «+»; что происходит после импорта (перекодирование, проход без разделения по спикерам).
  - `## Несколько записей сразу` — выделение Shift/Cmd, какие действия работают над выделением.
  - `## Экспорт` — TXT, Markdown, SRT; экспорт в вольт Obsidian: куда пишет по умолчанию, как выбрать папку, формат имени файла.

- [ ] **Step 2: Сайдбар** — в группу «Как это работает» добавить после «Запись и транскрипция»:

```js
      { text: "Работа с записями", link: "/recordings" },
```

- [ ] **Step 3: Проверить**

Run: `npm test && npm run build`
Expected: PASS, `dist/docs/recordings.html` существует.

- [ ] **Step 4: Коммит**

```bash
git add docs/recordings.md docs/sidebar.mjs
git commit -m "docs: working with recordings page"
```

Отчёт: таблица «утверждение → `файл:строка`».

---

### Task 5: «Настройки»

**Files:**
- Create: `docs/settings.md`
- Modify: `docs/sidebar.mjs`

**Interfaces:**
- Consumes: `docs/sidebar.mjs`, страницы из Task 2–4.
- Produces: страница `/settings`.

Источники: `Sources/SettingsView.swift` (вкладки `:15-26`, «Основное», «Диагностика», «About»), `Sources/SettingsTranscriptionTabs.swift` (вкладки «Транскрибация», «Live», «Модели»), `Sources/AppSettings.swift` (ключи и дефолты `:110-139`), `Sources/UpdateCheck.swift` (что делает проверка обновлений), `Sources/Diagnostics.swift` (что сохраняет «Сохранить диагностику»).

- [ ] **Step 1: Написать `docs/settings.md`** — по разделу `##` на каждую вкладку в порядке приложения: «Основное», «Транскрибация», «Live», «Модели», «Диагностика», «About». В каждом — таблица «Пункт | По умолчанию | Что делает» по всем переключателям, пикерам и кнопкам вкладки; название пункта — русская строка из кода в «ёлочках». Отдельно в «About»: проверка обновлений **включена по умолчанию**, раз в сутки спрашивает GitHub о последнем релизе, ничего не ставит сама.

  Суммаризация в настройках, если встретится, **не описывается** (см. Global Constraints).

- [ ] **Step 2: Сайдбар** — после группы «Как это работает» добавить группу:

```js
  {
    text: "Справочник",
    items: [{ text: "Настройки", link: "/settings" }],
  },
```

- [ ] **Step 3: Проверить**

Run: `npm test && npm run build`
Expected: PASS, `dist/docs/settings.html` существует.

- [ ] **Step 4: Коммит**

```bash
git add docs/settings.md docs/sidebar.mjs
git commit -m "docs: settings reference page"
```

Отчёт: таблица «пункт → `файл:строка` + дефолт → `файл:строка`».

---

### Task 6: «Приватность», «Решение проблем» и ссылки с главной

**Files:**
- Create: `docs/privacy.md`
- Create: `docs/troubleshooting.md`
- Modify: `docs/index.md` (превратить текстовые упоминания из Task 2 в ссылки)
- Modify: `docs/sidebar.mjs`

**Interfaces:**
- Consumes: все предыдущие страницы.
- Produces: страницы `/privacy`, `/troubleshooting`; полный сайдбар из Global Constraints.

Источники: все `https://` в `Sources/` (`grep -rhoE "https://[a-zA-Z0-9./_-]+" Sources | sort -u`), `Sources/WhisperEngine.swift` + `Sources/WhisperModels.swift` (откуда WhisperKit качает модели — Hugging Face), `Sources/GigaAMDownload.swift` (GitHub-релиз `models-gigaam-v3-e2e`), `Sources/DependencyManager.swift` (sherpa-модели диаризации с GitHub), `Sources/UpdateCheck.swift`, пути данных как в Task 2, `Sources/Diagnostics.swift`, `Sources/MacTranscribeApp.swift` (текст ошибки захвата системного звука `:196-199`), `Sources/AudioCapture.swift` и `Sources/DualChannel.swift` (как приложение отбрасывает эхо собеседника, попавшее в микрофон: сверка слов mic-реплик с перекрывающимися системными).

- [ ] **Step 1: Написать `docs/privacy.md`** по структуре:

  - `# Приватность`
  - `## Что происходит на Mac` — запись, распознавание, диаризация, хранение — локально.
  - `## Сетевые запросы` — таблица «Что | Куда (хост) | Когда | Можно ли выключить» — **каждый** сетевой вызов из кода: загрузка моделей Whisper, GigaAM, моделей диаризации, проверка обновлений (включена по умолчанию, выключается в About), ссылки vibecoded.ru (только по клику). Больше ничего. Суммаризация не упоминается.
  - `## Что и где хранится` — таблица «Данные | Где»: записи и транскрипты, модели каждого движка, настройки (`UserDefaults`, bundle id).
  - `## Как удалить всё` — тот же блок команд, что на странице установки (сослаться на [Установка → Удаление](/install#удаление) и повторить блок).

- [ ] **Step 2: Написать `docs/troubleshooting.md`** — таблица «Симптом | Что проверить» и разделы `##` под сложные случаи. Обязательные симптомы: нет системного звука / «Звук НЕ пишется» (разрешение на запись экрана, повторная запись — по тексту ошибки из кода); слышно эхо собеседника в микрофоне; модель не скачалась или скачалась частично; кнопка «Транскрибировать» ничего не делает / GigaAM выбран, а работает Whisper (условия из `EngineChoice.swift`); импорт не сработал (формат, во время записи импорт не идёт — `importFile` guard). В конце `## Диагностика` — как сохранить диагностику и что в неё входит (по `Diagnostics.swift`).

- [ ] **Step 3: Ссылки с главной** — в `docs/index.md` превратить текстовые упоминания из Task 2 в ссылки: список «С чего начать» → `/install`, `/transcription`, `/recordings`, `/settings`; «подробности» → `/privacy`.

- [ ] **Step 4: Сайдбар** — группа «Справочник» в итоговом виде:

```js
  {
    text: "Справочник",
    items: [
      { text: "Настройки", link: "/settings" },
      { text: "Приватность", link: "/privacy" },
      { text: "Решение проблем", link: "/troubleshooting" },
    ],
  },
```

Итоговый `docs/sidebar.mjs` должен совпадать с Global Constraints.

- [ ] **Step 5: Проверить**

Run: `npm test && npm run build`
Expected: PASS; в `dist/docs/` семь страниц:

```bash
for p in index install transcription recordings settings privacy troubleshooting; do test -f dist/docs/$p.html || echo "MISSING $p"; done; echo checked
```

Expected: только `checked`.

- [ ] **Step 6: Коммит**

```bash
git add docs/privacy.md docs/troubleshooting.md docs/index.md docs/sidebar.mjs
git commit -m "docs: privacy and troubleshooting pages"
```

Отчёт: таблица «утверждение → `файл:строка`»; для таблицы сетевых запросов — вывод `grep` по `https://` целиком, чтобы было видно, что ни один хост не пропущен.

---

### Task 7: Приёмка и деплой (выполняет контроллер, не субагент)

Нужны браузерные инструменты и пуш в `master` — делает основной агент.

- [ ] **Step 1: Проверки сборки по spec**

```bash
cd ~/projects/mac-transcribe-site
npm test && npm run build
grep -rliE "суммариз|нотариз|claude" dist/docs --include=*.html | grep -v "/assets/" ; echo "forbidden: done"
grep -o '<script async src="https://stats.pisarev.me/script.js"' dist/docs/index.html
test ! -e dist/docs/superpowers && echo "no superpowers"
```

Expected: `forbidden: done` без имён файлов перед ним, строка скрипта найдена, `no superpowers`.

- [ ] **Step 2: Финальное ревью ветки** — `superpowers:requesting-code-review` по всем коммитам задач 1–6.

- [ ] **Step 3: Пуш и деплой**

```bash
git push origin master
gh run watch "$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')" --exit-status
```

- [ ] **Step 4: Живой сайт**

```bash
P=https://art-ps.github.io/mac-transcribe-site
for p in docs/ docs/install docs/transcription docs/recordings docs/settings docs/privacy docs/troubleshooting; do printf "%s  %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -L "$P/$p")" "$p"; done
```

Expected: все `200`.

В браузере: лендинг → «Документация» открывает раздел; поиск находит «GigaAM»; переход «Дальше» между страницами работает; на ширине 390 px нет горизонтальной прокрутки (`document.documentElement.scrollWidth <= innerWidth`); `lastUpdated` у страниц разный.

- [ ] **Step 5:** Обновить память `site-backlog` — пункт 1 выполнен.

# Лендинг: редизайн по Hallmark — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** лендинг перестроен по Picks спеки: бренд сохранён, форма Map / Diagram, Floor Hallmark соблюдён, все ссылки, id и события аналитики на месте.

**Architecture:** scaffold Hallmark пишет `src/tokens.css` и `src/base.css`; `src/styles.css` переписывается под новые композиции; JSX секций меняется внутри своих компонентов. Логика (`Tabs`, `DemoDoc`, `site-content.mjs`) не трогается, кроме одной строки `modelLabel`.

**Tech Stack:** Vite 8, React 19, TypeScript 5.9, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-30-landing-hallmark-redesign-design.md`

## Global Constraints

- Hallmark: `H=/Users/artem/.claude/skills/hallmark`. Прочитать `$H/SKILL.md` (§ The Floor целиком), `$H/references/layout.md` § 4–7, `$H/references/craft.md` § 1–5, `$H/references/genres/modern-minimal.md`, `$H/references/patterns.md`. Floor не waive-ится.
- Бренд: цвета `#101113 #17181b #1c1e22 #2a2d33 #f2f1ec #a4a49c #ff453a #4cc9b0 #a89bf0`, шрифты Unbounded (display), Golos Text (body), JetBrains Mono (только код, пути, таймкоды, демо-документы). Новых цветов нет, кроме производных тех же оттенков в токенах.
- Кнопка primary: тёмный текст `#101113` на `#ff453a` (контраст ≥ 4.5:1), одна стилистика primary на всю страницу.
- Сохранить дословно все `href`, `id`, `data-umami-event`, `data-umami-event-place`, `role`, `aria-*`, `target`, `rel`. Тексты — дословно, кроме правок 1–6 из спеки «Правки текста».
- Тесты: только добавлять в `tests/site-content.test.mjs`; существующие не менять.
- Не трогать `docs/`, `public/`, `vite.config.ts`, `src/Tabs.tsx`, `src/DemoDoc.tsx` (логику), `src/demo-content.mjs`. Новых npm-зависимостей нет; нужна установка чего-либо — стоп, BLOCKED.
- Никогда не запускать MacTranscribe и не читать `~/Library/Application Support/mac-transcribe/`, `~/Obsidian`.
- Запрещено: «суммаризац», «нотариз», `xattr`, «В вольт», ссылки на `art-ps/mac-transcribe` и `art-ps/product-ai`, выдуманные цифры и отзывы.
- Коммиты без трейлеров `Co-Authored-By` и `Claude-Session`. Не пушить.
- Проверки из `/Users/artem/projects/mac-transcribe-site`: `npm test`, `npm run lint`, `npm run build`, и `node $H/scripts/sloplint.mjs src/styles.css src/base.css src/tokens.css --genre modern-minimal`.
- Скриншоты: dev-сервер уже на `http://localhost:5199/mac-transcribe-site/` (если не отвечает — `npx vite --port 5199 --strictPort` в фоне). Снимок: `perl -e 'alarm 40; exec @ARGV' "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --user-data-dir=<scratch>/brave-profile --headless=new --hide-scrollbars --timeout=4000 --window-size=1280,800 --screenshot=<scratch>/<name>.png <url>`; `<scratch>` = `/private/tmp/claude-501/-Users-artem-projects-mac-transcribe/7becc1de-0c99-4cc7-b66a-ccd314b8a711/scratchpad/shots`.

## Review Focus

1. Ссылка, `id` или `data-umami-*` потерялись при переписывании JSX — сверить с `git diff` по каждому `<a`.
2. Карта hero без JS или при `prefers-reduced-motion` остаётся невидимой (opacity 0 до анимации).
3. Горизонтальный скролл на 390px из-за карты или `pre` дерева набора.
4. Моно-шрифт снова в роли подписи (gate 64) или подписи капсом (67).
5. Контраст текста на `--bg-panel` и на красной кнопке ниже 4.5:1.

---

### Task 1: Система, шапка, подвал и hero с картой

**Files:**
- Create: `src/tokens.css`, `src/base.css` (scaffold)
- Modify: `src/styles.css`, `src/main.tsx` (импорты, если стили подключаются там), `src/App.tsx`, `src/sections/Hero.tsx`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Produces: токены (`--color-*`, `--text-*`, `--space-*`, `--container`, `--gutter`, `--gap-columns`, `--section-gap*`) и класс `.container` для Task 2–3; классы карты `.map`, `.map-node` (Task 3 переиспользует их для «Приватности»).

- [ ] **Step 1: Write the failing tests** в `tests/site-content.test.mjs`:

```js
const styles = read("src/styles.css");
const base = read("src/base.css");

test("stylesheet opens with the Hallmark stamp", () => {
  assert.match(styles.trimStart(), /^\/\* Hallmark/);
});

test("no eyebrow or tracked mono labels in the markup", () => {
  assert.doesNotMatch(tsx, /className="eyebrow"|chain-label/);
});

test("no transition: all and no height keyframes", () => {
  for (const css of [styles, base]) {
    assert.doesNotMatch(css, /transition:\s*all/);
    for (const kf of css.match(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g) ?? []) {
      assert.doesNotMatch(kf, /\bheight\s*:/, kf);
    }
  }
});

test("colour literals live only in the token blocks", () => {
  const outside = styles.replace(/:root[^{]*\{[^}]*\}/g, "");
  assert.doesNotMatch(outside, /#[0-9a-f]{3,8}\b|rgba?\(/i);
});
```

- [ ] **Step 2: Run** `npm test` — FAIL на новых тестах.

- [ ] **Step 3: Scaffold:** `node $H/scripts/theme.mjs scaffold --brand --redesign full --dir src`; заполнить `tokens.css` брендом из Global Constraints; подключить импорты так, как печатает scaffold.

- [ ] **Step 4: Переписать chrome и hero** по спеке (Picks: Chrome, Hero, Signature): floating pill nav; hero Settled с картой из `chainCards` (4 узла + линии, легенда из `duties`, второе предложение описания — подпись карты); release-факты списком без «·»; letter-close footer с авторской строкой. Штамп + critique-строка в начале `styles.css` (формат — вывод scaffold и `$H/references/gates.md` § 3); waive: `58` для дословного 8-словного заголовка (закреплён тестом). Старые стили секций, ещё не переделанных, держать рабочими (Task 2–3 их заменят).

- [ ] **Step 5: Run** `npm test && npm run lint && npm run build` — PASS; sloplint по hero без FAIL от hero/nav/footer; скриншот 1280×800 — заголовок, строка и «Скачать для Mac» в первом экране.

- [ ] **Step 6: Commit** `git commit -m "feat: hallmark system, chrome and map hero"`

### Task 2: Сценарии, пример, набор, настройка

**Files:**
- Modify: `src/sections/Scenarios.tsx`, `src/sections/Example.tsx`, `src/sections/Kit.tsx`, `src/sections/Setup.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: токены, `.container`, `.map*` из Task 1.

- [ ] **Step 1: Переписать четыре секции** по спеке (Sections): Scenarios — Switcher, lead-строка «Для продактов: интервью, созвоны с командой, демо» под заголовком, у вкладки путь «вход → результат → промпт»; Example — head-блок со списком шагов справа, просмотрщик на всю ширину, маркеры колонкой; Kit — band другого фона, Split 5/7, дерево как схема папок (без горизонтального скролла на 390); Setup — два маршрута рядом под одним заголовком, ссылка на `./docs/workflow` и строка «кнопкой «В хранилище»» на месте. Соседние секции — разные композиции.

- [ ] **Step 2: Run** `npm test && npm run lint && npm run build` — PASS; sloplint без FAIL; скриншоты 1440 и 390 — без горизонтального скролла.

- [ ] **Step 3: Commit** `git commit -m "feat: redesign scenarios, example, kit and setup"`

### Task 3: Возможности, приватность и FAQ, финал; правки фактов

**Files:**
- Modify: `src/sections/Features.tsx`, `src/sections/Trust.tsx`, `src/sections/FinalCta.tsx`, `src/site-content.mjs` (только `modelLabel`), `src/styles.css`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `.map*` из Task 1 для этапов приватности.

- [ ] **Step 1: Write the failing test:**

```js
test("landing does not claim one model downloads on first launch", () => {
  const mjs = read("src/site-content.mjs");
  for (const stale of ["загружается при первом запуске", "скачать модель (483–947 МБ)"]) {
    assert.ok(!(tsx + mjs).includes(stale), stale);
  }
});
```

- [ ] **Step 2: Run** `npm test` — FAIL.

- [ ] **Step 3: Правки 5–6 спеки** (`modelLabel`, ответ FAQ про интернет) дословно; правку 3 (убрать «Первое действие»).

- [ ] **Step 4: Переписать три секции** по спеке: Features — таблица + «Под капотом»; Privacy — три этапа узлами карты; FAQ — Rows (заголовок 1–4, вопросы 5–12), авторская строка уходит в footer Task 1, если ещё не там (ссылки `authorUrl` и `contactUrl` сохранить); Final — band, скачать рядом с REC-волной, волна анимируется `transform: scaleY`, при reduced-motion стоит.

- [ ] **Step 5: Run** `npm test && npm run lint && npm run build` — PASS; `sloplint` — 0 FAIL, каждый REFLEX исправлен или waive в штампе; скриншоты 1280×800, 1440 полная, 390 полная.

- [ ] **Step 6: Commit** `git commit -m "feat: redesign features, privacy, faq and final band"`

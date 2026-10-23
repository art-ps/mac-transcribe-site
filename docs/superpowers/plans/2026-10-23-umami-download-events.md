# Umami download events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Считать клики «Скачать» в Umami с разбивкой по кнопке — как на langflip.app (коммит `8f41941` в langflip-site).

**Architecture:** Скрипт Umami уже в `index.html` и `docs/.vitepress/config.mts`. Umami сам трекает элементы с `data-umami-event`; `data-umami-event-*` становятся свойствами события. Атрибуты на три ссылки в `src/App.tsx`, без JS.

**Tech Stack:** React/Vite, node:test.

**Spec:** согласовано в чате 2026-10-23 (повтор решения langflip-site `docs/superpowers/plans/2026-10-22-umami-download-events.md`).

## Global Constraints

- Значения: `data-umami-event="download"`, `data-umami-event-place="header" | "hero" | "final"`.
- Ссылки, тексты, стили не трогать; без `umami.track`; «Все версии» (`releasesUrl`) без события.

## Review Focus

1. Четвёртая ссылка на `downloadUrl` без события ушла бы мимо счёта — тест проверяет каждую `href={downloadUrl}`.

---

### Task 1: События на три кнопки

**Files:** Modify `src/App.tsx` (три `<a … href={downloadUrl}>`); Test: `tests/site-content.test.mjs` (дописать).

- [ ] **Step 1:** тест (читает `src/App.tsx` через `readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8")`):
```js
test("every download link reports a umami event with its place", () => {
  const links = app.match(/<a\b[^>]*href=\{downloadUrl\}[^>]*>/g) ?? [];
  assert.equal(links.length, 3);
  for (const link of links) assert.match(link, /data-umami-event="download"/);
  const places = links.map((link) => link.match(/data-umami-event-place="([a-z]+)"/)?.[1]);
  assert.deepEqual(places, ["header", "hero", "final"]);
});
```
- [ ] **Step 2:** `npm test` → новый тест FAIL.
- [ ] **Step 3:** атрибуты в порядке исходника: шапка → `header`, первый экран → `hero`, финальный CTA → `final`.
- [ ] **Step 4:** `npm test` и `npm run lint` → exit 0.
- [ ] **Step 5:** `npm run build` → exit 0; `grep -o 'data-umami-event-place="[a-z]*"' dist/index.html` печатает header, hero, final.
- [ ] **Step 6:** commit `feat: track download clicks in umami by button place`.

import { kitSizeLabel, kitUrl } from "../site-content.mjs";

const treeRoot = "Смена-исследование/";
const treeEntries = [
  "README.md",
  "Контекст продукта.md",
  "AGENTS.md",
  "CLAUDE.md",
  "_prompts/",
  "Встречи/",
  "Исследования/",
  "Решения/",
  "Требования/",
];

export function Kit() {
  return (
    <section className="kit" id="kit" aria-labelledby="kit-title">
      <div className="container kit-body">
        <ul className="kit-tree">
          <li>
            <code className="kit-root">{treeRoot}</code>
            <ul>
              {treeEntries.map((entry) => (
                <li key={entry} className={entry.endsWith("/") ? "kit-dir" : undefined}>
                  <code>{entry}</code>
                </li>
              ))}
            </ul>
        <div className="kit-copy">
          <h2 id="kit-title">Стартовый набор продакта для работы со встречами</h2>
          <ul className="kit-contents">
            <li>
              Структура папок: <code>Контекст продукта.md</code>, <code>Встречи/</code>,{" "}
              <code>Исследования/</code>, <code>Решения/</code>, <code>Требования/</code>
            </li>
            <li><code>_prompts/</code> с тремя промптами и <code>AGENTS.md</code></li>
            <li>Демо-транскрипты «Смены»</li>
            <li>Примеры результатов</li>
          </ul>
          <p>
            В <code>Контекст продукта.md</code> — аудитория, текущая задача, ограничения, вопросы
            исследования. Именно он делает результат полезнее на тех же разговорах.
          </p>
          <p>Работает с любой папкой, Obsidian не обязателен; полезен и с другим способом транскрипции.</p>
          <a className="download-button" href={kitUrl} data-umami-event="kit" data-umami-event-place="kit">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2v9M5 7.5 9 11.5 13 7.5M3 15h12" />
            </svg>
            Скачать набор (zip)
          </a>
          <small className="kit-size">без регистрации, {kitSizeLabel}</small>
        </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

import { kitSizeLabel, kitUrl } from "../site-content.mjs";

const tree = `Смена-исследование/
  README.md
  Контекст продукта.md
  AGENTS.md
  CLAUDE.md
  _prompts/
  Встречи/
  Исследования/
  Решения/
  Требования/`;

export function Kit() {
  return (
    <section className="kit section-shell" id="kit" aria-labelledby="kit-title">
      <h2 id="kit-title">Стартовый набор продакта для работы со встречами</h2>
      <div className="kit-body">
        <pre className="kit-tree">{tree}</pre>
        <div className="kit-copy">
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
            Скачать набор (zip)
            <span aria-hidden="true">↓</span>
          </a>
          <small className="kit-size">без регистрации, {kitSizeLabel}</small>
        </div>
      </div>
    </section>
  );
}

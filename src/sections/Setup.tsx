export function Setup() {
  return (
    <section className="setup section-shell" id="setup" aria-labelledby="setup-title">
      <h2 id="setup-title">Настройка: два маршрута</h2>
      <div className="setup-routes">
        <article className="setup-route" id="install">
          <h3>Начинаю с нуля</h3>
          <ol>
            <li>Скачайте и распакуйте набор.</li>
            <li>
              MacTranscribe → Настройки → Основное → Хранилище → «Выбрать папку…» → <code>…/Встречи</code>.
            </li>
            <li>Запишите разговор → «Транскрибировать» → «В хранилище».</li>
            <li>
              В терминале <code>cd</code> в папку набора, <code>claude</code> или <code>codex</code>,
              вставьте текст промпта из <code>_prompts/</code> и строку <code>Файл: …</code>.
            </li>
          </ol>
        </article>
        <article className="setup-route">
          <h3>Уже есть база знаний</h3>
          <ol>
            <li>
              Укажите в MacTranscribe папку внутри существующего проекта или хранилища Obsidian
              (например, <code>Встречи/</code> или <code>50 Raw/MacTranscribe/</code>).
            </li>
            <li>
              Положите рядом <code>AGENTS.md</code>, <code>CLAUDE.md</code> и <code>_prompts/</code> из набора (Claude Code
              читает <code>CLAUDE.md</code> = <code>@AGENTS.md</code>, Codex — <code>AGENTS.md</code>).
            </li>
            <li>Запускайте агента из корня этой папки — остальное как в первом маршруте.</li>
          </ol>
        </article>
      </div>
      <p className="setup-note">Экспорт — кнопкой «В хранилище» в меню разговора; автоматического экспорта нет.</p>
      <a className="setup-docs" href="./docs/workflow">
        Подробно, с настройкой доступа к файлам для Claude Code и Codex → документация
      </a>
    </section>
  );
}

const rows = [
  {
    feature: "Оба потока звука",
    value:
      "Микрофон и системный звук пишутся раздельно — в расшифровке есть и ваши вопросы, и ответы собеседника из Zoom, Meet или любого другого приложения.",
  },
  {
    feature: "Спикеры и таймкоды",
    value:
      "Реплики подписаны («Я» и собеседники) и привязаны ко времени — цитату из заметки легко найти в записи. Различить каждого участника — «Перетранскрибировать» с разделением по спикерам.",
  },
  {
    feature: "Плеер, связанный с текстом",
    value: "Клик по фразе — перемотка к этому месту: спорную формулировку переслушиваете, а не угадываете.",
  },
  {
    feature: "Импорт записей",
    value: "Перетащите в окно аудио- или видеофайл — в текст превратятся и разговоры, записанные раньше или другим приложением.",
  },
  {
    feature: "Markdown и метаданные",
    value:
      "«В хранилище» кладёт .md с frontmatter: дата, длительность, спикеры, теги. Агент и Obsidian находят встречу по этим полям.",
  },
  {
    feature: "Локальная расшифровка",
    value: "Звук и текст не уходят с Mac — интервью с пользователями и внутренние созвоны не попадают в облачные сервисы транскрипции.",
  },
];

export function Features() {
  return (
    <section className="features section-shell" id="features" aria-labelledby="features-title">
      <h2 id="features-title">Что умеет приложение — и зачем это продакту</h2>
      <figure className="features-shot">
        <img
          src="./app-screenshot.webp"
          alt="Окно MacTranscribe: список записей слева, транскрипт со спикерами и таймкодами, плеер с волной и кнопками «Экспорт» и «Перетранскрибировать»"
          loading="lazy"
        />
      </figure>
      <table className="features-table">
        <thead>
          <tr>
            <th scope="col">Возможность</th>
            <th scope="col">Польза для продакта</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <details className="engine-details">
        <summary>Под капотом: модели и размеры</summary>
        <p>
          Распознавание — <strong>Whisper</strong> (CoreML, WhisperKit), для русского можно
          выбрать <strong>GigaAM v3</strong> — примерно в 5 раз быстрее Whisper и точнее на
          живой речи. Диаризация —{" "}
          <strong>pyannote</strong>. Русский по умолчанию, ещё 12 языков и автоопределение —
          в настройках.
        </p>
        <ul className="engine-stats" aria-label="Ключевые характеристики">
          <li><strong>до 947 МБ</strong><small>модель Whisper, скачивается один раз</small></li>
          <li><strong>326 МБ</strong><small>GigaAM v3 для русского, по желанию</small></li>
          <li><strong>13 языков</strong><small>и автоопределение</small></li>
          <li><strong>Opus</strong><small>аудиокодек для компактного архива</small></li>
        </ul>
      </details>
    </section>
  );
}

const rows = [
  { feature: "Микрофон и системный звук", value: "В записи есть обе стороны разговора" },
  { feature: "Спикеры и таймкоды", value: "Можно проверить, кто и в каком контексте высказался" },
  { feature: "Плеер, связанный с текстом", value: "Легче уточнить спорную формулировку" },
  { feature: "Импорт записей", value: "Можно разобрать уже проведённые интервью" },
  { feature: "Markdown и метаданные", value: "Встречи становятся частью собственного хранилища" },
  { feature: "Локальная расшифровка", value: "Для получения текста не нужно загружать разговор в сервис транскрипции" },
];

export function Features() {
  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title">Что умеет приложение — и зачем это продакту</h2>
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
      </div>
    </section>
  );
}

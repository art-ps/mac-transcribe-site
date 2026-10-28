import { downloadUrl, kitUrl, release } from "../site-content.mjs";

const waveBars = Array.from({ length: 16 }, (_, i) => i);

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="download-title">
      <div className="final-cta-art" aria-hidden="true">
        <span className="final-rec"><i />REC</span>
        <div className="final-wave">
          {waveBars.map((i) => (
            <i key={i} style={{ animationDelay: `${(i % 5) * 0.17}s` }} />
          ))}
        </div>
      </div>
      <div className="final-cta-copy">
        <p className="eyebrow">Первое действие</p>
        <h2 id="download-title">Начните с одного интервью</h2>
        <p>Запишите разговор, сохраните расшифровку и получите первую исследовательскую заметку по готовой инструкции.</p>
        <div className="final-actions">
          <a className="download-button download-button--invert" href={downloadUrl} data-umami-event="download" data-umami-event-place="final">
            Скачать MacTranscribe
            <span aria-hidden="true">↓</span>
          </a>
          <a className="secondary-button" href={kitUrl} data-umami-event="kit" data-umami-event-place="final">
            Скачать набор
          </a>
        </div>
        <small>
          Бесплатно. Без подписки на приложение. Звук и текст никуда не отправляются.
          <br />
          {release.macOS} · DMG {release.sizeLabel}
        </small>
      </div>
    </section>
  );
}

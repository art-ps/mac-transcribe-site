import { downloadUrl, kitUrl, release } from "../site-content.mjs";

const waveBars = Array.from({ length: 16 }, (_, i) => i);

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="download-title">
      <div className="container final-cta-body">
        <div className="final-cta-copy">
          <h2 id="download-title">Начните с одного интервью</h2>
          <p>Запишите разговор, сохраните расшифровку и получите первую исследовательскую заметку по готовой инструкции.</p>
          <div className="final-actions">
            <a className="download-button" href={downloadUrl} data-umami-event="download" data-umami-event-place="final">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2v9M5 7.5 9 11.5 13 7.5M3 15h12" />
              </svg>
              Скачать MacTranscribe
            </a>
            <a className="secondary-button" href={kitUrl} data-umami-event="kit" data-umami-event-place="final">
              Скачать набор
            </a>
          </div>
          <p className="final-note">Бесплатно. Без подписки на приложение. Звук и текст никуда не отправляются.</p>
          <ul className="release-facts">
            <li>{release.macOS}</li>
            <li>DMG {release.sizeLabel}</li>
          </ul>
        </div>
        <div className="final-cta-art" aria-hidden="true">
          <span className="final-rec"><i />REC</span>
          <div className="final-wave">
            {waveBars.map((i) => (
              <i key={i} style={{ animationDelay: `${(i % 5) * 0.17}s` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

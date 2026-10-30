import { chainCards } from "../demo-content.mjs";
import { DemoDoc } from "../DemoDoc";
import { downloadUrl, release } from "../site-content.mjs";

const duties = [
  "MacTranscribe: запись → расшифровка → экспорт",
  "Ваше хранилище: накопление контекста",
  "Claude / Codex: анализ по вашим инструкциям",
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">Ваши встречи — основа для исследований, решений и требований</h1>
          <p className="lead">MacTranscribe записывает и расшифровывает созвоны локально на Mac.</p>
          <div className="hero-actions">
            <a className="download-button" href={downloadUrl} data-umami-event="download" data-umami-event-place="hero">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2v9M5 7.5 9 11.5 13 7.5M3 15h12" />
              </svg>
              Скачать для Mac
            </a>
            <a className="secondary-button" href="#example" data-umami-event="example" data-umami-event-place="hero">
              Посмотреть пример результата
            </a>
          </div>
          <ul className="release-facts">
            <li>{release.macOS}</li>
            <li>DMG {release.sizeLabel}</li>
            <li>{release.modelLabel}</li>
            <li>бесплатно, без регистрации</li>
          </ul>
        </div>

        <figure className="map">
          <ol className="map-nodes" aria-label="От встречи к выводам">
            {chainCards.map((card, i) => (
              <li key={card.label} className="map-node" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="map-node-title">{card.label}</p>
                <DemoDoc blocks={card.blocks} />
              </li>
            ))}
          </ol>
          <ul className="map-legend">
            {duties.map((duty) => (
              <li key={duty}>{duty}</li>
            ))}
          </ul>
          <figcaption>
            Сохраняйте текст в папку проекта, чтобы Claude или Codex помогали находить закономерности,
            собирать договорённости и готовить продуктовые документы.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

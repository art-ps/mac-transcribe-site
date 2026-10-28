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
      <div className="hero-copy">
        <p className="eyebrow">Для продактов: интервью, созвоны с командой, демо</p>
        <h1 id="hero-title">Ваши встречи — основа для исследований, решений и требований</h1>
        <p className="hero-description">
          MacTranscribe записывает и расшифровывает созвоны локально на Mac. Сохраняйте текст
          в папку проекта, чтобы Claude или Codex помогали находить закономерности, собирать
          договорённости и готовить продуктовые документы.
        </p>
        <div className="hero-actions">
          <a className="download-button" href={downloadUrl} data-umami-event="download" data-umami-event-place="hero">
            Скачать для Mac
            <span aria-hidden="true">↓</span>
          </a>
          <a className="secondary-button" href="#example" data-umami-event="example" data-umami-event-place="hero">
            Посмотреть пример результата
          </a>
        </div>
        <p className="release-note">
          {release.macOS} <span aria-hidden="true">·</span> DMG {release.sizeLabel}{" "}
          <span aria-hidden="true">·</span> {release.modelLabel} <span aria-hidden="true">·</span>{" "}
          бесплатно, без регистрации
        </p>
      </div>

      <ol className="chain" aria-label="От встречи к выводам">
        {chainCards.map((card, i) => (
          <li key={card.label} style={{ animationDelay: `${i * 0.25}s` }}>
            <span className="chain-label">{card.label}</span>
            <DemoDoc blocks={card.blocks} />
          </li>
        ))}
      </ol>

      <ul className="duties">
        {duties.map((duty) => (
          <li key={duty}>{duty}</li>
        ))}
      </ul>
    </section>
  );
}

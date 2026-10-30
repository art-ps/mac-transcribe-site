import { Hero } from "./sections/Hero";
import { Scenarios } from "./sections/Scenarios";
import { Example } from "./sections/Example";
import { Kit } from "./sections/Kit";
import { Setup } from "./sections/Setup";
import { Features } from "./sections/Features";
import { Trust } from "./sections/Trust";
import { FinalCta } from "./sections/FinalCta";
import { authorUrl, contactUrl, downloadUrl, releasesUrl } from "./site-content.mjs";

function App() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="nav-pill">
            <a className="brand" href="#top" aria-label="MacTranscribe: к началу страницы">
              <img src="./mac-transcribe-icon.png" alt="Иконка приложения MacTranscribe" width="40" height="40" />
              <span>MacTranscribe</span>
            </a>
            <nav className="header-nav" aria-label="Основная навигация">
              <a href="#scenarios">Сценарии</a>
              <a href="#example">Пример</a>
              <a href="#kit">Набор</a>
              <a href="#setup">Настройка</a>
              <a href="#faq">FAQ</a>
              <a href="./docs/">Документация</a>
            </nav>
            <a className="header-download" href={downloadUrl} data-umami-event="download" data-umami-event-place="header">
              Скачать
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <Hero />
        <Scenarios />
        <Example />
        <Kit />
        <Setup />
        <Features />
        <Trust />
        <FinalCta />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-signoff">
            Автор — Артём Писарев, <a href={authorUrl} target="_blank" rel="noreferrer">vibecoded.ru</a>.
          </p>
          <a className="brand footer-brand" href="#top" aria-label="MacTranscribe: к началу страницы">
            <img src="./mac-transcribe-icon.png" alt="" width="34" height="34" />
            <span>MacTranscribe</span>
          </a>
          <nav aria-label="Ссылки проекта">
            <a href="./docs/">Документация</a>
            <a href={releasesUrl} target="_blank" rel="noreferrer">Все версии</a>
            <a href={contactUrl} target="_blank" rel="noreferrer">Контакт</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

export default App;

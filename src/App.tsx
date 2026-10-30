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
        <section className="app-shot" aria-labelledby="app-shot-title">
          <div className="container app-shot-grid">
            <img src="./app-transcript.jpg" width="1400" height="1181" loading="lazy"
              alt="Окно MacTranscribe: транскрипт созвона, у каждой реплики имя говорящего и таймкод" />
            <div className="app-shot-copy">
              <h2 id="app-shot-title">Транскрипт с говорящими и таймкодами</h2>
              <p>Ваш микрофон подписан «Я», собеседники — «Спикер 1», «Спикер 2». У каждой реплики есть время: по нему легко найти место в записи.</p>
              <ul>
                <li>Экспорт — текст уходит в папку проекта.</li>
                <li>Перетранскрибировать — заново, другой моделью.</li>
                <li>Аудио рядом: послушать или скачать.</li>
              </ul>
            </div>
          </div>
        </section>
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
            Автор — Артём Писарев, <a href={authorUrl} target="_blank" rel="noreferrer">vibecoded.ru</a>. Ошибки и вопросы —{" "}
            <a href={contactUrl} target="_blank" rel="noreferrer">issues в репозитории релизов</a>.
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

import { downloadUrl, release } from "./site-content.mjs";

const privacyItems = [
  "Распознавание и диаризация работают на вашем Mac — через Neural Engine.",
  "Звук и транскрипты не отправляются никуда: без облака, аккаунтов и аналитики.",
  "Записи лежат обычными файлами в Application Support — забирайте и удаляйте когда угодно.",
  "Работает без сети: выключите Wi-Fi и убедитесь сами.",
];

const waveBars = Array.from({ length: 28 }, (_, i) => i);

function App() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="MacTranscribe: к началу страницы">
            <img src="./mac-transcribe-icon.png" alt="Иконка приложения MacTranscribe" width="40" height="40" />
            <span>MacTranscribe</span>
          </a>
          <nav className="header-nav" aria-label="Основная навигация">
            <a href="#features">Возможности</a>
            <a href="#privacy">Приватность</a>
            <a href="#install">Установка</a>
          </nav>
          <a className="header-download" href={downloadUrl}>
            Скачать
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="product-badge">
              <img src="./mac-transcribe-icon.png" alt="" width="46" height="46" />
              <div>
                <strong>MacTranscribe</strong>
                <span>Бесплатно для macOS</span>
              </div>
            </div>
            <p className="eyebrow">Встречи, звонки, интервью</p>
            <h1 id="hero-title">Каждый разговор — в текст. Не покидая ваш Mac.</h1>
            <p className="hero-description">
              MacTranscribe пишет микрофон и системный звук одновременно, показывает текст по
              ходу разговора и раскладывает готовый транскрипт по спикерам. Модель работает
              локально на Neural Engine — интернет нужен один раз, чтобы её скачать.
            </p>
            <a className="download-button" href={downloadUrl}>
              Скачать MacTranscribe
              <span aria-hidden="true">↓</span>
            </a>
            <p className="release-note">
              {release.macOS} <span aria-hidden="true">·</span> DMG {release.sizeLabel}{" "}
              <span aria-hidden="true">·</span> {release.modelLabel}
            </p>
          </div>

          <figure className="hero-shot">
            <img
              src="./app-screenshot.jpg"
              alt="Окно MacTranscribe: список записей слева, транскрипт со спикерами и таймкодами, плеер с волной и кнопками «Экспорт» и «Диаризовать»"
              loading="eager"
            />
          </figure>
        </section>

        <section className="features section-shell" id="features" aria-labelledby="features-title">
          <div className="section-heading">
            <p className="eyebrow">От записи до готового текста</p>
            <h2 id="features-title">Один процесс вместо четырёх инструментов</h2>
            <p>Запись, транскрипция, спикеры и просмотр — в одном окне, без внешних сервисов.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-number" aria-hidden="true">01</span>
              <div className="feature-icon" aria-hidden="true">🎙 + 🔊</div>
              <h3>Оба потока звука</h3>
              <p>
                Микрофон и системный звук пишутся одновременно — слышно и вас, и собеседников
                в Zoom, Meet или любом другом приложении.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-number" aria-hidden="true">02</span>
              <div className="feature-icon" aria-hidden="true">···|||</div>
              <h3>Текст по ходу разговора</h3>
              <p>
                Фразы появляются через секунду после произнесения. Whisper large-v3-turbo
                на Neural Engine — без интернета.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-number" aria-hidden="true">03</span>
              <div className="feature-icon" aria-hidden="true">S1 / S2</div>
              <h3>Кто что сказал</h3>
              <p>
                После записи офлайн-проход уточняет транскрипт и раскладывает реплики
                по спикерам — диаризация тоже локальная.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-number" aria-hidden="true">04</span>
              <div className="feature-icon" aria-hidden="true">▶ ¶</div>
              <h3>Плеер, связанный с текстом</h3>
              <p>
                Клик по фразе — перемотка к этому месту. При воспроизведении текущая реплика
                подсвечивается. Экспорт в текст — в один клик.
              </p>
            </article>
          </div>
        </section>

        <section className="engine section-shell" aria-labelledby="engine-title">
          <div className="engine-copy">
            <p className="eyebrow">Под капотом</p>
            <h2 id="engine-title">Модель уровня облачных сервисов — на вашем железе</h2>
            <p>
              Распознавание — <strong>Whisper large-v3-turbo</strong> (CoreML, WhisperKit),
              диаризация — <strong>pyannote</strong>. Русский по умолчанию, ещё 13 языков и
              автоопределение — в настройках.
            </p>
          </div>
          <ul className="engine-stats" aria-label="Ключевые характеристики">
            <li><strong>626 МБ</strong><small>модель, скачивается один раз</small></li>
            <li><strong>~1 с</strong><small>от фразы до текста на экране</small></li>
            <li><strong>Opus</strong><small>компактный архив записей</small></li>
          </ul>
        </section>

        <section className="privacy" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy-inner">
            <div className="privacy-intro">
              <p className="eyebrow">Приватность по умолчанию</p>
              <h2 id="privacy-title">Разговоры остаются между вами</h2>
              <p>
                Рабочие встречи — не то, что хочется загружать на чужие серверы.
                MacTranscribe и не предлагает.
              </p>
            </div>
            <ul className="privacy-list">
              {privacyItems.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="install section-shell" id="install" aria-labelledby="install-title">
          <div className="section-heading install-heading">
            <p className="eyebrow">Три шага</p>
            <h2 id="install-title">Установите — и жмите «Запись»</h2>
            <p>Сборка подписана developer-сертификатом, но пока не нотарифицирована Apple.</p>
          </div>
          <ol className="install-steps">
            <li>
              <span className="step-number">01</span>
              <div>
                <h3>Перенесите приложение</h3>
                <p>Откройте DMG и перетащите MacTranscribe в папку Applications. При первом запуске — правой кнопкой → Открыть.</p>
              </div>
            </li>
            <li>
              <span className="step-number">02</span>
              <div>
                <h3>Разрешите доступ</h3>
                <p>Микрофон — для вашего голоса, запись экрана — так macOS отдаёт системный звук. Видео не записывается.</p>
              </div>
            </li>
            <li>
              <span className="step-number">03</span>
              <div>
                <h3>Дождитесь модель</h3>
                <p>При первом запуске приложение скачает модель распознавания (626 МБ). Дальше интернет не нужен.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="final-cta" aria-labelledby="download-title">
          <div className="final-cta-art" aria-hidden="true">
            <span className="final-rec"><i />REC</span>
            <div className="final-wave">
              {waveBars.slice(0, 16).map((i) => (
                <i key={i} style={{ animationDelay: `${(i % 5) * 0.17}s` }} />
              ))}
            </div>
          </div>
          <div className="final-cta-copy">
            <p className="eyebrow">Готово к встречам</p>
            <h2 id="download-title">Следующий созвон уже можно не конспектировать</h2>
            <p>Бесплатно. Без подписки. Звук и текст остаются на Mac.</p>
            <a className="download-button download-button--invert" href={downloadUrl}>
              Скачать MacTranscribe
              <span aria-hidden="true">↓</span>
            </a>
            <small>{release.macOS} · DMG {release.sizeLabel}</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top" aria-label="MacTranscribe: к началу страницы">
          <img src="./mac-transcribe-icon.png" alt="" width="34" height="34" />
          <span>MacTranscribe</span>
        </a>
        <p>Сборка {release.version}</p>
        <nav aria-label="Ссылки проекта">
          <a href="https://github.com/art-ps/mac-transcribe/releases" target="_blank" rel="noreferrer">Все версии</a>
        </nav>
      </footer>
    </>
  );
}

export default App;

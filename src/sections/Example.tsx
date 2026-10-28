import { DemoDoc } from "../DemoDoc";
import { Tabs } from "../Tabs";
import { demoDocs } from "../demo-content.mjs";

const steps = [
  "Провёл три интервью.",
  "MacTranscribe сохранил расшифровки со спикерами и таймкодами.",
  "Файлы попали в папку исследования.",
  "Агент сопоставил разговоры.",
  "Продакт проверил выводы по цитатам.",
  "Подготовил следующий шаг или зафиксировал, чего не хватает.",
];

const views = [
  { id: "transcript", title: "Исходный разговор", doc: demoDocs.transcript },
  { id: "analysis", title: "Разбор интервью", doc: demoDocs.analysis },
  { id: "synthesis", title: "Сопоставление", doc: demoDocs.synthesis },
  { id: "requirements", title: "Следующий документ", doc: demoDocs.requirements },
];

const markers = [
  { marker: "Каждый вывод со ссылкой на источник", where: "разбор → «Проблемы»: строка «Источник:» с файлом и таймкодом" },
  { marker: "Цитаты отделены от интерпретаций", where: "сопоставление → «Противоречия»: вывод отдельно, цитаты под ним" },
  { marker: "Противоречия сохранены", where: "сопоставление → «Противоречия»: Марина и Антон" },
  { marker: "Неподтверждённые предположения вынесены в гипотезы", where: "сопоставление → «Гипотезы»: «все на Гугл-таблицах»" },
  { marker: "Для неизвестного — «данных недостаточно»", where: "разбор → «Данных недостаточно», следующий документ → «Чего не хватает»" },
];

export function Example() {
  return (
    <section className="example section-shell" id="example" aria-labelledby="example-title">
      <h2 id="example-title">Одно исследование от начала до конца</h2>
      <ol className="example-steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="example-viewer">
        <Tabs
          label="Файлы примера"
          tabs={views.map((v) => ({
            id: v.id,
            title: v.title,
            content: (
              <>
                <code className="demo-path">{v.doc.path}</code>
                <DemoDoc blocks={v.doc.blocks} />
              </>
            ),
          }))}
        />
        <aside className="example-markers" aria-labelledby="example-markers-title">
          <h3 id="example-markers-title">Что здесь видно</h3>
          <ul>
            {markers.map((m) => (
              <li key={m.marker}>
                <b>{m.marker}</b>
                <span>{m.where}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <p className="example-note">
        Результаты получены Claude Code по промптам из набора, без ручных правок; имена и компания
        вымышлены.
      </p>
    </section>
  );
}

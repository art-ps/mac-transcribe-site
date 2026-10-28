import { Tabs } from "../Tabs";

const scenarios = [
  {
    id: "interview",
    title: "Разобрать интервью",
    input: "разговор с пользователем",
    result: "проблемы, контекст, цитаты, гипотезы и вопросы для проверки",
    prompt: "_prompts/интервью.md",
  },
  {
    id: "synthesis",
    title: "Сопоставить несколько интервью",
    input: "встречи по одному исследованию",
    result: "повторяющиеся темы, различия между сегментами, противоречия",
    prompt: "_prompts/сопоставление.md",
  },
  {
    id: "agreements",
    title: "Зафиксировать договорённости",
    input: "обсуждение с командой",
    result: "решения, открытые вопросы, следующие действия; если обсуждали требования — что известно и чего не хватает",
    prompt: "_prompts/договорённости.md",
  },
];

export function Scenarios() {
  return (
    <section className="scenarios section-shell" id="scenarios" aria-labelledby="scenarios-title">
      <h2 id="scenarios-title">Сценарии</h2>
      <Tabs
        label="Сценарии"
        defaultId="synthesis"
        tabs={scenarios.map((s) => ({
          id: s.id,
          title: s.title,
          content: (
            <>
              <dl className="scenario">
                <dt>Что подаём на вход</dt>
                <dd>{s.input}</dd>
                <dt>Что помогает подготовить агент</dt>
                <dd>{s.result}</dd>
                <dt>Промпт из набора</dt>
                <dd><code>{s.prompt}</code></dd>
              </dl>
              <a className="scenario-example" href="#example">Пример ниже</a>
            </>
          ),
        }))}
      />
      <p className="scenarios-note">
        Иногда самый полезный результат — список того, чего не хватает. Агент не обещает PRD
        после каждого звонка.
      </p>
    </section>
  );
}

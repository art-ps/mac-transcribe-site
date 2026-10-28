import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type Tab = { id: string; title: string; content: ReactNode };

export function Tabs({ label, tabs, defaultId }: { label: string; tabs: Tab[]; defaultId?: string }) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0].id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const prefix = useId();
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeId));
  const active = tabs[activeIndex];

  function select(index: number) {
    setActiveId(tabs[index].id);
    buttons.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${prefix}-tab-${tab.id}`}
            aria-selected={i === activeIndex}
            aria-controls={`${prefix}-panel-${tab.id}`}
            tabIndex={i === activeIndex ? 0 : -1}
            onClick={() => select(i)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${prefix}-panel-${active.id}`}
        aria-labelledby={`${prefix}-tab-${active.id}`}
        tabIndex={0}
      >
        {active.content}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import type { DemoBlock } from "./demo-content.mjs";

// **жирный** из markdown — в <b>, остальное как есть.
function rich(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));
}

function renderBlock(block: DemoBlock, key: number) {
  switch (block.kind) {
    case "h":
      return <h4 key={key}>{block.text}</h4>;
    case "p":
      return <p key={key}>{rich(block.text)}</p>;
    case "li":
      return <span key={key}>{rich(block.text)}</span>;
    case "source":
      return (
        <p key={key} className="demo-source">
          Источник: [[{block.file}]] [{block.time}]
        </p>
      );
    case "quote":
      return <blockquote key={key}>{block.text}</blockquote>;
    case "reply":
      return (
        <p key={key} className="demo-reply">
          <time>{block.time}</time> <b>{block.who}:</b> {block.text}
        </p>
      );
    case "meta":
      return <p key={key} className="demo-meta">{block.text}</p>;
  }
}

// Пункт списка забирает идущие за ним источники и цитаты — как отступ в markdown;
// соседние пункты собираются в один <ul>.
export function DemoDoc({ blocks }: { blocks: DemoBlock[] }) {
  const out: (ReactNode | ReactNode[][])[] = [];
  let items: ReactNode[][] | null = null;
  for (const [i, block] of blocks.entries()) {
    if (block.kind === "li") {
      if (!items) {
        items = [];
        out.push(items);
      }
      items.push([renderBlock(block, i)]);
    } else if (items && (block.kind === "source" || block.kind === "quote")) {
      items[items.length - 1].push(renderBlock(block, i));
    } else {
      items = null;
      out.push(renderBlock(block, i));
    }
  }
  return (
    <article className="demo-doc">
      {out.map((node, i) =>
        Array.isArray(node) ? (
          <ul key={`ul${i}`}>
            {node.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          node
        ),
      )}
    </article>
  );
}

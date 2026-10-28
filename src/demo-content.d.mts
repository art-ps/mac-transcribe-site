export type DemoBlock =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "li"; text: string }
  | { kind: "source"; file: string; time: string }
  | { kind: "quote"; text: string }
  | { kind: "reply"; time: string; who: string; text: string }
  | { kind: "meta"; text: string };

export type DemoDocument = { title: string; path: string; blocks: DemoBlock[] };

export declare const demoFileNames: readonly string[];
export declare const demoDocs: Readonly<
  Record<"transcript" | "analysis" | "synthesis" | "requirements", DemoDocument>
>;
export declare const chainCards: readonly { label: string; blocks: DemoBlock[] }[];

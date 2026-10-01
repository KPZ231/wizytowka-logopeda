import { Info } from "lucide-react";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type { Content } from "@/lib/blog/types";
import { headingId } from "@/lib/blog/utils";

type CalloutBlock = SerializedBlockNode<{ blockType: "callout"; text: string }>;
type Nodes = DefaultNodeTypes | CalloutBlock;

type TextLike = { text?: unknown; children?: unknown };
const nodeText = (node: TextLike): string =>
  typeof node.text === "string"
    ? node.text
    : Array.isArray(node.children)
      ? node.children.map((c: TextLike) => nodeText(c)).join("")
      : "";

const converters: JSXConvertersFunction<Nodes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    if (node.tag !== "h2") {
      const Tag = node.tag;
      return <Tag>{children}</Tag>;
    }
    return (
      <h2
        id={headingId(nodeText(node))}
        className="mt-12 mb-4 scroll-mt-28 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-bold tracking-[-0.01em] text-foreground first:mt-0"
      >
        {children}
      </h2>
    );
  },
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mt-5 text-lg leading-[1.7] text-foreground first:mt-0">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag === "ol" ? "ol" : "ul";
    return (
      <Tag className="mt-5 list-disc space-y-2 pl-6 text-lg leading-[1.7] text-foreground marker:text-accent">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    );
  },
  listitem: ({ node, nodesToJSX }) => <li>{nodesToJSX({ nodes: node.children })}</li>,
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="mt-8 border-l-4 border-accent pl-6 text-xl leading-[1.6] font-semibold text-foreground">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),
  blocks: {
    callout: ({ node }) => (
      <aside className="mt-8 flex gap-4 rounded-md border border-border bg-accent-soft p-5">
        <Info className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
        <p className="text-base leading-[1.7] text-foreground">{node.fields.text}</p>
      </aside>
    ),
  },
});

/** Renderuje Lexical rich text jako React — brak `dangerouslySetInnerHTML`, treść nie wstrzyknie HTML. */
export function PostBody({ content }: { content: Content }) {
  return (
    <div className="max-w-[65ch]">
      <RichText data={content} converters={converters} />
    </div>
  );
}

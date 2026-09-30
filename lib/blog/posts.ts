import "server-only";
import type { Locale } from "@/i18n/config";
import type { Block, Post, PostCardData, PostView } from "./types";

/**
 * Źródło wpisów. Na tym etapie stała w repo; docelowo Payload (Local API, kolekcja `posts`):
 * wystarczy podmienić wnętrza getPosts/getPost/getSlugs — strony korzystają tylko z tych funkcji.
 * Treść wpisu pokazowego pochodzi wyłącznie z danych klienta (CLAUDE.md) — bez porad medycznych.
 */
const POSTS: Post[] = [
  {
    id: "first-visit",
    slug: "pierwsza-wizyta-u-logopedy",
    category: "parents",
    publishedAt: "2026-09-30",
    status: "published",
    title: {
      pl: "Pierwsza wizyta u logopedy: co obejmuje konsultacja",
      en: "The first speech therapy visit: what the consultation includes",
      uk: "Перший візит до логопеда: що входить у консультацію",
    },
    excerpt: {
      pl: "Jak wygląda konsultacja logopedyczna, ile trwa, ile kosztuje i jak umówić się na nią w gabinecie w Czerwionce.",
      en: "What a speech therapy consultation looks like, how long it lasts, how much it costs and how to book it at the practice in Czerwionka.",
      uk: "Як проходить логопедична консультація, скільки триває, скільки коштує і як записатися в кабінеті в Червйонці.",
    },
    seoDescription: {
      pl: "Pierwsza wizyta u logopedy w Czerwionce: co obejmuje konsultacja, plan terapii i zalecenia, czas trwania, cena 150 zł i sposób umówienia.",
      en: "First speech therapy visit in Czerwionka: what the consultation, therapy plan and recommendations include, duration, price (PLN 150) and how to book.",
      uk: "Перший візит до логопеда в Червйонці: що входить у консультацію, план терапії та рекомендації, тривалість, ціна 150 zł і запис.",
    },
    content: {
      pl: [
        {
          type: "paragraph",
          text: "Pierwsza wizyta w gabinecie to konsultacja logopedyczna. Pozwala poznać potrzeby dziecka lub osoby dorosłej i ustalić, jak wygląda dalsza praca.",
        },
        { type: "heading", text: "Co obejmuje pierwsza wizyta" },
        {
          type: "list",
          items: [
            "konsultacja logopedyczna",
            "plan terapii",
            "zalecenia dla rodzica",
          ],
        },
        { type: "heading", text: "Ile trwa i ile kosztuje" },
        {
          type: "paragraph",
          text: "Pierwsza wizyta trwa 60 minut i kosztuje 150 zł. Kolejne spotkania terapeutyczne trwają 30 minut (80 zł) albo 45 minut (120 zł).",
        },
        { type: "heading", text: "Gdzie i kiedy przyjmujemy" },
        {
          type: "paragraph",
          text: "Gabinet mieści się pod adresem Biernota 11, 44-230 Czerwionka-Leszczyny. Przyjmujemy we wtorki i czwartki w godzinach 7:30–19:00.",
        },
        {
          type: "callout",
          text: "[UZUPEŁNIJ] Tu logopeda może dodać praktyczne wskazówki, np. co warto przygotować na wizytę.",
        },
        { type: "heading", text: "Jak umówić wizytę" },
        {
          type: "paragraph",
          text: "Zadzwoń pod numer +48 518 542 193, napisz przez formularz kontaktowy na stronie albo skorzystaj z profilu gabinetu na Medfile.",
        },
      ],
      en: [
        {
          type: "paragraph",
          text: "The first visit to the practice is a speech therapy consultation. It helps us get to know the needs of a child or an adult and decide how the work will continue.",
        },
        { type: "heading", text: "What the first visit includes" },
        {
          type: "list",
          items: [
            "a speech therapy consultation",
            "a therapy plan",
            "recommendations for the parent",
          ],
        },
        { type: "heading", text: "How long it lasts and what it costs" },
        {
          type: "paragraph",
          text: "The first visit lasts 60 minutes and costs PLN 150. Follow-up therapy sessions last 30 minutes (PLN 80) or 45 minutes (PLN 120).",
        },
        { type: "heading", text: "Where and when we see patients" },
        {
          type: "paragraph",
          text: "The practice is located at Biernota 11, 44-230 Czerwionka-Leszczyny, Poland. We see patients on Tuesdays and Thursdays, 7:30 am–7:00 pm.",
        },
        {
          type: "callout",
          text: "[TO BE COMPLETED] The speech therapist can add practical tips here, e.g. what to prepare for the visit.",
        },
        { type: "heading", text: "How to book a visit" },
        {
          type: "paragraph",
          text: "Call +48 518 542 193, write using the contact form on this website, or use the practice's profile on Medfile.",
        },
      ],
      uk: [
        {
          type: "paragraph",
          text: "Перший візит до кабінету — це логопедична консультація. Вона допомагає зрозуміти потреби дитини чи дорослого й визначити, як виглядатиме подальша робота.",
        },
        { type: "heading", text: "Що входить у перший візит" },
        {
          type: "list",
          items: [
            "логопедична консультація",
            "план терапії",
            "рекомендації для батьків",
          ],
        },
        { type: "heading", text: "Скільки триває і скільки коштує" },
        {
          type: "paragraph",
          text: "Перший візит триває 60 хвилин і коштує 150 zł. Наступні заняття терапії тривають 30 хвилин (80 zł) або 45 хвилин (120 zł).",
        },
        { type: "heading", text: "Де і коли ми приймаємо" },
        {
          type: "paragraph",
          text: "Кабінет розташований за адресою Biernota 11, 44-230 Czerwionka-Leszczyny, Польща. Приймаємо у вівторок і четвер, 7:30–19:00.",
        },
        {
          type: "callout",
          text: "[ДОПОВНІТЬ] Тут логопед може додати практичні поради, наприклад, що підготувати до візиту.",
        },
        { type: "heading", text: "Як записатися на візит" },
        {
          type: "paragraph",
          text: "Зателефонуйте за номером +48 518 542 193, напишіть через контактну форму на сайті або скористайтеся профілем кабінету на Medfile.",
        },
      ],
    },
  },
];

const WORDS_PER_MINUTE = 200;

function blockText(b: Block) {
  return b.type === "list" ? b.items.join(" ") : b.text;
}

function readingMinutes(blocks: Block[]) {
  const words = blocks
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function toView(p: Post, lang: Locale): PostView {
  const content = p.content[lang];
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    title: p.title[lang],
    excerpt: p.excerpt[lang],
    seoDescription: p.seoDescription[lang],
    cover: p.cover && { src: p.cover.src, alt: p.cover.alt[lang] },
    content,
    minutes: readingMinutes(content),
  };
}

const published = () =>
  POSTS.filter((p) => p.status === "published").sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

/** Wpisy opublikowane, od najnowszego. */
export async function getPosts(lang: Locale): Promise<PostView[]> {
  return published().map((p) => toView(p, lang));
}

export async function getPost(
  lang: Locale,
  slug: string,
): Promise<PostView | null> {
  const p = published().find((x) => x.slug === slug);
  return p ? toView(p, lang) : null;
}

export async function getSlugs(): Promise<string[]> {
  return published().map((p) => p.slug);
}

/** Powiązane: ta sama kategoria, potem najnowsze. */
export async function getRelated(
  lang: Locale,
  current: PostView,
  limit = 3,
): Promise<PostView[]> {
  const others = (await getPosts(lang)).filter((p) => p.slug !== current.slug);
  return [
    ...others.filter((p) => p.category === current.category),
    ...others.filter((p) => p.category !== current.category),
  ].slice(0, limit);
}

/** Dane karty (bez treści) — to trafia do komponentów klienckich. */
export const toCard = ({
  slug,
  category,
  publishedAt,
  title,
  excerpt,
  minutes,
  cover,
}: PostView): PostCardData => ({
  slug,
  category,
  publishedAt,
  title,
  excerpt,
  minutes,
  cover,
});

import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "@payload-config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_GALLERY = path.join(__dirname, "..", "public", "gallery_images");

/** Minimalny, poprawny dokument Lexical — bez edytora w panelu, do seeda jednego wpisu pokazowego. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- forma Lexical JSON zbudowana ręcznie, bez edytora
function doc(children: Record<string, unknown>[]): any {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children,
    },
  };
}
const text = (t: string) => ({
  type: "text",
  version: 1,
  text: t,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
});
const p = (t: string) => ({
  type: "paragraph",
  version: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  textFormat: 0,
  children: [text(t)],
});
const h2 = (t: string) => ({
  type: "heading",
  version: 1,
  tag: "h2",
  direction: "ltr",
  format: "",
  indent: 0,
  children: [text(t)],
});
const ul = (items: string[]) => ({
  type: "list",
  version: 1,
  tag: "ul",
  listType: "bullet",
  start: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  children: items.map((t) => ({
    type: "listitem",
    version: 1,
    value: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [text(t)],
  })),
});
const callout = (t: string) => ({
  type: "block",
  version: 2,
  format: "",
  fields: { id: crypto.randomUUID(), blockName: "", blockType: "callout", text: t },
});

const SLUG = "pierwsza-wizyta-u-logopedy";

const POST = {
  pl: {
    title: "Pierwsza wizyta u logopedy: co obejmuje konsultacja",
    excerpt:
      "Jak wygląda konsultacja logopedyczna, ile trwa, ile kosztuje i jak umówić się na nią w gabinecie w Czerwionce.",
    seoDescription:
      "Pierwsza wizyta u logopedy w Czerwionce: co obejmuje konsultacja, plan terapii i zalecenia, czas trwania, cena 150 zł i sposób umówienia.",
    content: doc([
      p(
        "Pierwsza wizyta w gabinecie to konsultacja logopedyczna. Pozwala poznać potrzeby dziecka lub osoby dorosłej i ustalić, jak wygląda dalsza praca.",
      ),
      h2("Co obejmuje pierwsza wizyta"),
      ul(["konsultacja logopedyczna", "plan terapii", "zalecenia dla rodzica"]),
      h2("Ile trwa i ile kosztuje"),
      p(
        "Pierwsza wizyta trwa 60 minut i kosztuje 150 zł. Kolejne spotkania terapeutyczne trwają 30 minut (80 zł) albo 45 minut (120 zł).",
      ),
      h2("Gdzie i kiedy przyjmujemy"),
      p(
        "Gabinet mieści się pod adresem Biernota 11, 44-230 Czerwionka-Leszczyny. Przyjmujemy we wtorki i czwartki w godzinach 7:30–19:00.",
      ),
      callout("[UZUPEŁNIJ] Tu logopeda może dodać praktyczne wskazówki, np. co warto przygotować na wizytę."),
      h2("Jak umówić wizytę"),
      p(
        "Zadzwoń pod numer +48 518 542 193, napisz przez formularz kontaktowy na stronie albo skorzystaj z profilu gabinetu na Medfile.",
      ),
    ]),
  },
  en: {
    title: "The first speech therapy visit: what the consultation includes",
    excerpt:
      "What a speech therapy consultation looks like, how long it lasts, how much it costs and how to book it at the practice in Czerwionka.",
    seoDescription:
      "First speech therapy visit in Czerwionka: what the consultation, therapy plan and recommendations include, duration, price (PLN 150) and how to book.",
    content: doc([
      p(
        "The first visit to the practice is a speech therapy consultation. It helps us get to know the needs of a child or an adult and decide how the work will continue.",
      ),
      h2("What the first visit includes"),
      ul(["a speech therapy consultation", "a therapy plan", "recommendations for the parent"]),
      h2("How long it lasts and what it costs"),
      p(
        "The first visit lasts 60 minutes and costs PLN 150. Follow-up therapy sessions last 30 minutes (PLN 80) or 45 minutes (PLN 120).",
      ),
      h2("Where and when we see patients"),
      p(
        "The practice is located at Biernota 11, 44-230 Czerwionka-Leszczyny, Poland. We see patients on Tuesdays and Thursdays, 7:30 am–7:00 pm.",
      ),
      callout("[TO BE COMPLETED] The speech therapist can add practical tips here, e.g. what to prepare for the visit."),
      h2("How to book a visit"),
      p(
        "Call +48 518 542 193, write using the contact form on this website, or use the practice's profile on Medfile.",
      ),
    ]),
  },
  uk: {
    title: "Перший візит до логопеда: що входить у консультацію",
    excerpt:
      "Як проходить логопедична консультація, скільки триває, скільки коштує і як записатися в кабінеті в Червйонці.",
    seoDescription:
      "Перший візит до логопеда в Червйонці: що входить у консультацію, план терапії та рекомендації, тривалість, ціна 150 zł і запис.",
    content: doc([
      p(
        "Перший візит до кабінету — це логопедична консультація. Вона допомагає зрозуміти потреби дитини чи дорослого й визначити, як виглядатиме подальша робота.",
      ),
      h2("Що входить у перший візит"),
      ul(["логопедична консультація", "план терапії", "рекомендації для батьків"]),
      h2("Скільки триває і скільки коштує"),
      p(
        "Перший візит триває 60 хвилин і коштує 150 zł. Наступні заняття терапії тривають 30 хвилин (80 zł) або 45 хвилин (120 zł).",
      ),
      h2("Де і коли ми приймаємо"),
      p(
        "Кабінет розташований за адресою Biernota 11, 44-230 Czerwionka-Leszczyny, Польща. Приймаємо у вівторок і четвер, 7:30–19:00.",
      ),
      callout("[ДОПОВНІТЬ] Тут логопед може додати практичні поради, наприклад, що підготувати до візиту."),
      h2("Як записатися на візит"),
      p(
        "Зателефонуйте за номером +48 518 542 193, напишіть через контактну форму на сайті або скористайтеся профілем кабінету на Medfile.",
      ),
    ]),
  },
};

const GALLERY = [
  {
    file: "619b8200-dc15-4a67-8556-a21ff0d6a802.jpeg",
    order: 0,
    pl: "Gabinet",
    en: "The practice",
    uk: "Кабінет",
  },
  { file: "20261001_114332.jpg", order: 1, pl: "Wnętrze", en: "Interior", uk: "Інтер'єр" },
  {
    file: "20261001_114414.jpg",
    order: 2,
    pl: "Miejsce terapii",
    en: "Therapy space",
    uk: "Місце для терапії",
  },
  { file: "20261001_114445.jpg", order: 3, pl: "Detale", en: "Details", uk: "Деталі" },
  {
    file: "816230139_122258956052265057_3154695948022504229_n.jpg",
    order: 4,
    pl: "Atmosfera",
    en: "Atmosphere",
    uk: "Атмосфера",
  },
];

async function run() {
  const payload = await getPayload({ config });

  const existingPost = await payload.find({
    collection: "posts",
    where: { slug: { equals: SLUG } },
    limit: 1,
  });
  if (existingPost.docs.length === 0) {
    const created = await payload.create({
      collection: "posts",
      locale: "pl",
      data: {
        title: POST.pl.title,
        slug: SLUG,
        category: "parents",
        publishedAt: "2026-09-30",
        excerpt: POST.pl.excerpt,
        seoDescription: POST.pl.seoDescription,
        content: POST.pl.content,
        _status: "published",
      },
    });
    for (const locale of ["en", "uk"] as const) {
      await payload.update({
        collection: "posts",
        id: created.id,
        locale,
        data: {
          title: POST[locale].title,
          excerpt: POST[locale].excerpt,
          seoDescription: POST[locale].seoDescription,
          content: POST[locale].content,
        },
      });
    }
    payload.logger.info(`Wpis "${SLUG}" utworzony.`);
  } else {
    payload.logger.info(`Wpis "${SLUG}" już istnieje — pomijam.`);
  }

  const existingGallery = await payload.count({ collection: "gallery" });
  if (existingGallery.totalDocs === 0) {
    for (const g of GALLERY) {
      const created = await payload.create({
        collection: "gallery",
        locale: "pl",
        filePath: path.join(PUBLIC_GALLERY, g.file),
        data: { alt: g.pl, caption: g.pl, order: g.order },
      });
      for (const locale of ["en", "uk"] as const) {
        await payload.update({
          collection: "gallery",
          id: created.id,
          locale,
          data: { alt: g[locale], caption: g[locale] },
        });
      }
    }
    payload.logger.info(`Galeria: dodano ${GALLERY.length} zdjęć.`);
  } else {
    payload.logger.info("Galeria niepusta — pomijam.");
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

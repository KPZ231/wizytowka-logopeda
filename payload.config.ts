import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import { buildConfig } from "payload";
import { Gallery } from "./collections/Gallery";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Gallery, Posts],
  editor: lexicalEditor(),
  db: postgresAdapter({
    // Bez push: dev nie zmienia schematu bazy. Zostawiał znacznik „dev” w payload_migrations,
    // przez który `payload migrate` w buildzie czekał na interaktywne y/N (~5 min na Vercelu).
    // Zmiany schematu: `npm run payload migrate:create`, migrację commitujemy.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
  }),
  // pl = źródło prawdy (CLAUDE.md), fallback na pl gdy en/uk nieprzetłumaczone.
  localization: {
    locales: ["pl", "en", "uk"],
    defaultLocale: "pl",
    fallback: true,
  },
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: { media: true, gallery: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
  typescript: {
    outputFile: "payload-types.ts",
  },
});

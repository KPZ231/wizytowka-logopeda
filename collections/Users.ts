import type { CollectionConfig } from "payload";

/**
 * Konta panelu admina. Brak wbudowanego 2FA w Payload — ryzyko logowania brute-force
 * ograniczone blokadą po nieudanych próbach (ponytail: jeden użytkownik na start,
 * 2FA/OAuth dodać pluginem, gdy pojawi się więcej osób w panelu).
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [],
};

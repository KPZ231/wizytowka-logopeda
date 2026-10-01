"use client";

import { ErrorScreen } from "@/components/error-screen";

// Nie pokazujemy error.message (szczegóły techniczne); digest to krótki kod do podania telefonicznie.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorScreen code="500" reset={reset} digest={error.digest} />;
}

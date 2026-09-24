"use client";

import "@/app/globals.css";
import { useEffect } from "react";
import {
  ErrorScreen,
  GENERIC_ERROR_MESSAGE,
} from "@/components/shared/error-screen";

// Replaces the root layout when it throws, so it must render <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-neutral-100 font-sans">
        <ErrorScreen
          title="Something went wrong"
          message={GENERIC_ERROR_MESSAGE}
          onRetry={reset}
        />
      </body>
    </html>
  );
}

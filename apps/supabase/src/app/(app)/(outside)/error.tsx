"use client";

import { useEffect } from "react";
import {
  ErrorScreen,
  GENERIC_ERROR_MESSAGE,
} from "@/components/shared/error-screen";

export default function Error({
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
    <ErrorScreen
      title="Something went wrong"
      message={GENERIC_ERROR_MESSAGE}
      onRetry={reset}
    />
  );
}

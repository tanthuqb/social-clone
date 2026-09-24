import Link from "next/link";
import { BaseIconBTN } from "@/components/master-layout";

type ErrorScreenProps = {
  title: string;
  message: string;
  /** Optional retry handler (error boundaries pass `reset`). */
  onRetry?: () => void;
};

/** Full-page error / not-found message with a link back to the home page. */
export function ErrorScreen({ title, message, onRetry }: ErrorScreenProps) {
  return (
    <main className="mx-auto flex h-dvh max-w-xl flex-col justify-center">
      <div className="rounded-3xl bg-neutral-50 shadow-[0px_1px_2px_0px_#1018280F,0px_1px_3px_0px_#1018281A]">
        <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/error.png" alt="" />
          <div className="flex flex-col">
            <h1 className="text-[23px] font-semibold">{title}</h1>
            <p className="whitespace-pre-line text-neutral-500">{message}</p>
          </div>
          <div className="flex gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn inline-block h-10 w-full border border-neutral-300 py-0"
              >
                Try again
              </button>
            )}
            <Link
              href="/"
              className="btn btn-default inline-flex h-10 w-full items-center justify-center gap-2 py-0 pr-0"
            >
              <span>Back to home</span>
              <BaseIconBTN
                src="/assets/icons-24/arrow_white.png"
                className="rounded-full p-2"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const GENERIC_ERROR_MESSAGE =
  "Sorry, our server ran into a problem and could not process your request.\nWe are working to fix this issue.";

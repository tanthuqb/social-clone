"use client";

import {
  CommonButton,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@suzu/ui";
import { toast } from "@suzu/ui";
import { useEffect, useState } from "react";

const LANGUAGE_COOKIE = "suzu-lang";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED = ["en", "vn"] as const;
type LanguageCode = (typeof SUPPORTED)[number];

function readLanguageCookie(): LanguageCode {
  if (typeof document === "undefined") return DEFAULT_LANGUAGE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANGUAGE_COOKIE}=([^;]*)`));
  const value = match?.[1] as LanguageCode | undefined;
  return value && SUPPORTED.includes(value) ? value : DEFAULT_LANGUAGE;
}

/**
 * Language preference. English is the default; the choice is stored in the
 * `suzu-lang` cookie (1 year) so a future i18n layer can read it on the server.
 * The UI itself is currently English-only.
 */
function Language() {
  const [activeButton, setActiveButton] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setLanguage(readLanguageCookie());
  }, []);

  const handleSave = () => {
    document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
    setActiveButton(false);
    toast.success(
      language === "en"
        ? "Language saved"
        : "Language saved. Vietnamese translations are not available yet; the app stays in English.",
    );
  };
  return (
    <div className="h-full max-h-full overflow-y-auto">
      <div className="flex h-full max-w-xl flex-col gap-4">
        <div className="flex w-full flex-col items-start gap-5 rounded-[20px] px-4">
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="flex items-start justify-between text-[15px] font-semibold text-slate-700">
              Which language do you use?
            </div>
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value as LanguageCode);
                setActiveButton(true);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language please!" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vn">Vietnamese (Tiếng Việt)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
        <div
          className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${activeButton ? "cursor-pointer" : ""}`}
        >
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-default block w-full md:inline-block md:w-auto"
            disabled={!activeButton}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Language;

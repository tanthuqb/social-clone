import { cn } from "@suzu/ui";
import { BaseBadges } from "./base-badges";

interface BgdCommonBadgesProps {
  text: number;
  plus: boolean;
}
export function BgdCommonBadges({ text, plus }: BgdCommonBadgesProps) {
  return (
    <div
      className={`flex ${plus ? "h-4 w-[23px]" : "h-4 w-4"} items-center justify-center rounded-full bg-[#F43F5E]`}
    >
      <BaseBadges text={text} plus={plus} />
    </div>
  );
}

import { cn } from "@suzu/ui";
import { BaseText } from "../base-text";


interface BaseBadgesProps {
  text: number;
  plus: boolean;
}

export function BaseBadges({ text, plus }: BaseBadgesProps) {
  return (
    <BaseText text={text} className="items-center sz-label-xs-semi" plus={plus} />
  );
}

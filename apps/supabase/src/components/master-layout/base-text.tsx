import { cn, timeAgo } from "@suzu/ui";

interface BasicTextUseProps {
  className: string;
  text: string | number;
  textColor?: string;
  plus?: boolean;
  created_at?: Date;
}

const BaseText = ({
  className,
  text,
  textColor,
  plus,
  created_at,
}: BasicTextUseProps) => (
  <div className={cn(`text-${textColor ? textColor : "white"}`, className)}>
    {created_at ? timeAgo(created_at, { withAgo: true }) : text}
    {plus && "+"}
  </div>
);

export { BaseText };

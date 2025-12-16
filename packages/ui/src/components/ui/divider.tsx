import { cn } from "../../lib/utils";

const Divider = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-start rounded-[999px] px-4", className)}>
      <div className="flex h-[1px] flex-1 bg-slate-100"></div>
    </div>
  );
};

export { Divider };

import { cn } from "../../lib/utils";

function LoadingDots({
  animated = true,
  className,
}: {
  animated?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${0.2 * i}s`,
            backgroundColor: "black",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            display: "inline-block",
            margin: "0 1px",
          }}
          className={animated ? "animate-blink" : ""}
        />
      ))}
    </span>
  );
}

export { LoadingDots };

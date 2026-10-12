import { TrainFront } from "lucide-react";
import { cn } from "../../utils/cn";

export default function BrandMark({
  inverted = false,
}: {
  inverted?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md",
          inverted ? "bg-white text-brand-800" : "bg-brand-700 text-white",
        )}
      >
        <TrainFront aria-hidden="true" className="size-5" />
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          inverted ? "text-white" : "text-slate-900",
        )}
      >
        RailBook
      </span>
    </span>
  );
}

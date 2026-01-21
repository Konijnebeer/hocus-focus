import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

function HexButton({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        // Hexagon shape styles
        "z-0 relative mx-auto my-4 [--hex-w:2em] w-[var(--hex-w)] h-[calc(var(--hex-w)*1.732)] rounded-[calc(var(--hex-w)*0.1)/calc(var(--hex-w)*0.05)] bg-primary hover:bg-sidebar-ring transition-all duration-200",
        // Pseudo-elements for hexagon
        "before:pointer-events-none before:-z-10 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[inherit] before:bg-inherit before:content-[''] before:rotate-60 before:transition-all before:duration-200",
        "after:pointer-events-none after:-z-10 after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-[inherit] after:bg-inherit after:content-[''] after:-rotate-60 after:transition-all after:duration-200",
        // Original button styles (preserved for compatibility)
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { HexButton };

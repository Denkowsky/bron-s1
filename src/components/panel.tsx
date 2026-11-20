import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-md border border-zinc-800 bg-zinc-900/70", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            {title}
          </h2>
          {aside}
        </header>
      ) : null}
      {children}
    </section>
  );
}

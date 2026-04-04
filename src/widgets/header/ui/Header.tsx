import { SingBoxStatusControl } from "@/features/sing-box/status";
import { SingBoxLogo } from "@/shared/assets/icons";

export function Header() {
  return (
    <header className="bg-sidebar sticky top-0 z-30 flex h-[52px] items-center justify-between px-3 shadow-sm">
      <div className="bg-card dark:bg-input/30 dark:border-input flex items-center gap-2 rounded-md border px-3 py-1 shadow-xs select-none">
        <SingBoxLogo className="h-6 shrink-0" />
        <span className="text-sm font-semibold tracking-tight">sing-box</span>
      </div>

      <SingBoxStatusControl />
    </header>
  );
}

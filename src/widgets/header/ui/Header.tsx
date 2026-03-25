import { SingBoxStatusControl } from "@/features/sing-box/status";

export function Header() {
  return (
    <header className="bg-sidebar sticky top-0 z-30 flex h-[52px] items-center justify-end px-2 shadow-sm">
      <SingBoxStatusControl />
    </header>
  );
}

import Image from "next/image";

import { SingBoxStatusControl } from "@/features/sing-box/status";
import { logoPic } from "@/shared/assets/icons";

export function Header() {
  return (
    <header className="bg-sidebar sticky top-0 z-30 flex h-[52px] items-center justify-between px-3 shadow-sm">
      <div className="bg-card dark:bg-input/30 flex items-center gap-2 rounded-md px-1 py-1 shadow-xs select-none">
        <Image alt="logo" className="h-8 w-8" src={logoPic} />
      </div>

      <SingBoxStatusControl />
    </header>
  );
}

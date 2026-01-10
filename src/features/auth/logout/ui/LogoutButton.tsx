import { DoorOpen } from "lucide-react";

import { cn } from "@/shared/lib";

import { useLogoutMutation } from "../model/useLogoutMutation";

type LogoutButtonProps = React.ComponentProps<"button">;

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  const logoutMutation = useLogoutMutation();

  const onLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <button
      onClick={onLogout}
      disabled={logoutMutation.isPending}
      className={cn(className, "cursor-pointer")}
      {...props}
    >
      <DoorOpen />
      <span>Выход</span>
    </button>
  );
}

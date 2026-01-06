import { useLogoutMutation } from "../model/useLogoutMutation";

export function LogoutButton() {
  const logoutMutation = useLogoutMutation();

  const onLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <button onClick={onLogout} disabled={logoutMutation.isPending}>
      Logout
    </button>
  );
}

import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSelectors";
import { useLogout } from "../../hooks/useLogout";
import Navbar from "../organisms/Navbar";

export default function CustomerLayout() {
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();

  // The route guard guarantees a user here; this only satisfies TypeScript.
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} onLogout={logout} />
      <main className="mx-auto mt-10 w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="no-print border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          RailBook demo
        </p>
      </footer>
    </div>
  );
}

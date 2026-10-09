import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { PublicUser } from "../../features/auth/authTypes";
import { cn } from "../../utils/cn";
import Avatar from "../atoms/Avatar";
import BrandMark from "../molecules/BrandMark";

const links = [
  { to: "/customer/search", label: "Book ticket" },
  { to: "/customer/bookings", label: "My bookings" },
  { to: "/customer/passengers", label: "Passengers" },
  { to: "/customer/payment-methods", label: "Payment methods" },
];

interface NavbarProps {
  user: PublicUser;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-brand-50 text-brand-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    );

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link to="/customer/search" aria-label="RailBook home">
          <BrandMark />
        </Link>

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center gap-1 md:flex"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            to="/customer/profile"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Avatar name={user.name} />
            <span className="max-w-32 truncate">{user.name}</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </div>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-slate-200 px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {[...links, { to: "/customer/profile", label: "Profile" }].map(
              (link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ),
            )}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut aria-hidden="true" className="size-4" /> Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

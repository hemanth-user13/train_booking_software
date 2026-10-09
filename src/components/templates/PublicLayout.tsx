import { Outlet } from "react-router-dom";
import BrandMark from "../molecules/BrandMark";

const highlights = [
  [
    "Live seat status",
    "See available, waitlisted and sold-out classes before you pick a train.",
  ],
  [
    "Saved passengers",
    "Keep family details on file and add them to a ticket in one tap.",
  ],
  [
    "Easy cancellation",
    "Cancel eligible tickets from your bookings and see the refund straight away.",
  ],
];

export default function PublicLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col justify-between bg-brand-900 p-10 text-brand-100 lg:flex">
        <BrandMark inverted />
        <div>
          <h2 className="max-w-sm text-2xl font-semibold leading-snug text-white">
            Reserved train tickets, without the queue at the counter.
          </h2>
          <ul className="mt-8 space-y-5">
            {highlights.map(([title, text]) => (
              <li key={title} className="border-l-2 border-brand-500 pl-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-sm text-brand-200">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-col bg-white px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <BrandMark />
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

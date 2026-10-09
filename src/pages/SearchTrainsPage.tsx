import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import Card from "../components/atoms/Card";
import BookingStatusBadge from "../components/molecules/BookingStatusBadge";
import TrainSearchForm from "../components/organisms/TrainSearchForm";
import { stationName } from "../data/seedStations";
import { selectCurrentUser } from "../features/auth/authSelectors";
import { selectMyBookings } from "../features/bookings/bookingSelectors";
import { selectLastSearch } from "../features/trains/trainSelectors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTrainSearch } from "../hooks/useTrainSearch";
import {
  addDays,
  formatJourneyDate,
  isPastDate,
  todayISO,
} from "../utils/dateUtils";

const POPULAR_ROUTES = [
  { from: "MMCT", to: "NDLS" },
  { from: "MAS", to: "SBC" },
  { from: "NDLS", to: "HWH" },
  { from: "CSMT", to: "PUNE" },
  { from: "MMCT", to: "ADI" },
  { from: "NDLS", to: "JP" },
];

export default function SearchTrainsPage() {
  useDocumentTitle("Book a ticket");
  const user = useAppSelector(selectCurrentUser);
  const lastSearch = useAppSelector(selectLastSearch);
  const bookings = useAppSelector(selectMyBookings);
  const search = useTrainSearch();

  const nextTrip = bookings
    .filter(
      (booking) =>
        booking.status !== "CANCELLED" && !isPastDate(booking.journeyDate),
    )
    .sort((a, b) => a.journeyDate.localeCompare(b.journeyDate))[0];

  // A remembered search from the past would fail validation, so only reuse its stations.
  const defaults = lastSearch
    ? {
        from: lastSearch.from,
        to: lastSearch.to,
        date: isPastDate(lastSearch.date) ? todayISO() : lastSearch.date,
      }
    : undefined;

  return (
    <div className="space-y-8">
      <section className="-mx-4 mt-10 bg-brand-800 px-4 pt-8 pb-20 sm:-mt-8 sm:rounded-b-xl sm:pt-10">
        <p className="text-sm text-brand-200">
          Hello, {user?.name.split(" ")[0]}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
          Where are you travelling?
        </h1>
      </section>

      <Card className="-mt-20 p-5 shadow-sm sm:p-6">
        <TrainSearchForm defaultValues={defaults} onSearch={search} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="popular-heading">
          <h2
            id="popular-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500"
          >
            Popular routes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                type="button"
                onClick={() =>
                  search({ ...route, date: addDays(todayISO(), 1) })
                }
                className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left hover:border-brand-300"
              >
                <span>
                  <span className="block text-sm font-medium text-slate-900">
                    {stationName(route.from)} → {stationName(route.to)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {route.from} – {route.to} · Tomorrow
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-slate-400 group-hover:text-brand-700"
                />
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="trip-heading">
          <h2
            id="trip-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500"
          >
            Your next trip
          </h2>
          {nextTrip ? (
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {nextTrip.train.number} {nextTrip.train.name}
                  </p>
                  <p className="text-xs text-slate-500">PNR {nextTrip.pnr}</p>
                </div>
                <BookingStatusBadge status={nextTrip.status} />
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {stationName(nextTrip.train.from)} →{" "}
                {stationName(nextTrip.train.to)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <CalendarDays aria-hidden="true" className="size-4" />
                {formatJourneyDate(nextTrip.journeyDate)} ·{" "}
                {nextTrip.train.departure}
              </p>
              <Link
                to={`/customer/booking-confirmation/${nextTrip.id}`}
                className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
              >
                View ticket
              </Link>
            </Card>
          ) : (
            <Card className="p-4 text-sm text-slate-600">
              No upcoming journeys. Search for a train above to plan your next
              trip.
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Avatar from "../components/atoms/Avatar";
import Button from "../components/atoms/Button";
import Card from "../components/atoms/Card";
import Input from "../components/atoms/Input";
import FormField from "../components/molecules/FormField";
import PageHeader from "../components/molecules/PageHeader";
import PaymentMethodCard from "../components/molecules/PaymentMethodCard";
import { selectCurrentUser } from "../features/auth/authSelectors";
import { profileUpdated } from "../features/auth/authSlice";
import { selectMyBookings } from "../features/bookings/bookingSelectors";
import { selectMyPassengers } from "../features/passengers/passengersSlice";
import { selectMyPaymentMethods } from "../features/payments/paymentsSlice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useToast } from "../hooks/useToast";
import { formatDateTime } from "../utils/dateUtils";
import { profileSchema, type ProfileValues } from "../validation/schemas";

export default function ProfilePage() {
  // useDocumentTitle("Profile");
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const methods = useAppSelector(selectMyPaymentMethods);
  const passengers = useAppSelector(selectMyPassengers);
  const bookings = useAppSelector(selectMyBookings);
  const { showToast } = useToast();

  console.log("user", user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  if (!user) return null;

  const onSubmit = (values: ProfileValues) => {
    dispatch(profileUpdated({ id: user.id, ...values }));
    reset(values);
    showToast("Profile updated.");
  };

  const stats = [
    ["Bookings", bookings.length],
    ["Saved passengers", passengers.length],
    ["Payment methods", methods.length],
  ] as const;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your contact details and saved payment references."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Personal details
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <FormField
              label="Full name"
              htmlFor="profile-name"
              error={errors.name?.message}
              required
            >
              <Input
                id="profile-name"
                invalid={!!errors.name}
                aria-describedby="profile-name-msg"
                {...register("name")}
              />
            </FormField>
            <FormField
              label="Email"
              htmlFor="profile-email"
              hint="Your email is your login and cannot be changed."
            >
              <Input
                id="profile-email"
                value={user.email}
                disabled
                readOnly
                aria-describedby="profile-email-msg"
              />
            </FormField>
            <FormField
              label="Mobile number"
              htmlFor="profile-phone"
              error={errors.phone?.message}
              hint="Used for journey alerts on a real system."
            >
              <Input
                id="profile-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                invalid={!!errors.phone}
                aria-describedby="profile-phone-msg"
                {...register("phone")}
              />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                disabled={!isDirty}
                onClick={() => reset()}
              >
                Discard
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">
                  Member since {formatDateTime(user.createdAt).split(",")[0]}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Payment methods
              </h2>
              <Link
                to="/customer/payment-methods"
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                Manage
              </Link>
            </div>
            {methods.length === 0 ? (
              <p className="text-sm text-slate-600">
                No saved payment methods.
              </p>
            ) : (
              <div className="space-y-3">
                {methods.slice(0, 3).map((method) => (
                  <PaymentMethodCard key={method.id} method={method} />
                ))}
                {methods.length > 3 && (
                  <p className="text-xs text-slate-500">
                    +{methods.length - 3} more
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

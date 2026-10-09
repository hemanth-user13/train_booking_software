import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Alert from "../components/molecules/Alert";
import FormField from "../components/molecules/FormField";
import { seedUsers } from "../data/seedUsers";
import { selectUsers } from "../features/auth/authSelectors";
import { loggedIn } from "../features/auth/authSlice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useToast } from "../hooks/useToast";
import { findUserByCredentials } from "../services/authService";
import { loginSchema, type LoginValues } from "../validation/schemas";

export default function LoginPage() {
  useDocumentTitle("Log in");
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    const user = findUserByCredentials(users, values.email, values.password);
    if (!user) {
      setError(
        "That email and password combination does not match any account.",
      );
      return;
    }
    // PublicRoute notices the new session and redirects to the right home page.
    dispatch(loggedIn(user.id));
    showToast(`Welcome back, ${user.name.split(" ")[0]}.`);
  };

  const fillDemo = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setError(null);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      {/* <p className="mt-1 text-sm text-slate-600">
        New to RailBook?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-700 hover:underline"
        >
          Create an account
        </Link>
      </p> */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-4"
      >
        {error && <Alert tone="error">{error}</Alert>}

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            aria-describedby="email-msg"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            invalid={!!errors.password}
            aria-describedby="password-msg"
            {...register("password")}
          />
        </FormField>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <div className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Demo accounts
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {seedUsers.map((demo) => (
            <Button
              key={demo.id}
              size="sm"
              variant="secondary"
              onClick={() => fillDemo(demo.email, demo.password)}
            >
              Use {demo.role === "ADMIN" ? "admin" : "customer"}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

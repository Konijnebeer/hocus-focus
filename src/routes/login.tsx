import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { getUserByEmail } from "@/database/userDb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setGeneralError("");

      try {
        const user = await getUserByEmail(value.email);

        if (!user) {
          setGeneralError("User not found");
          return;
        }

        if (user.password !== value.password) {
          setGeneralError("Incorrect password");
          return;
        }

        // Store logged in user ID in localStorage
        localStorage.setItem("loggedInUserId", user.id);

        // Navigate to home page
        navigate({ to: "/" });
      } catch (err) {
        console.error("Login error:", err);
        setGeneralError("An error occurred during login");
      }
    },
  });

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-secondary">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Email is required";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "Invalid email address";
                  return undefined;
                },
              }}
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  <FieldError>{field.state.meta.errors[0]}</FieldError>
                </Field>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Password is required" : undefined,
              }}
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <FieldError>{field.state.meta.errors[0]}</FieldError>
                </Field>
              )}
            />

            {generalError && (
              <p className="text-sm text-destructive">{generalError}</p>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-secondary">
            <p>Test accounts:</p>
            <p>emma.virtanen@email.com / password123</p>
            <p className="mt-2">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-white hover:underline underline-offset-4"
              >
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

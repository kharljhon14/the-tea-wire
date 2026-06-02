'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import Image from 'next/image';
import { z } from 'zod/v4';
import { useForm } from '@tanstack/react-form-nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const registerSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword']
  });

export default function RegisterForm() {
  // Password type toggles
  const [passwordOpen, setPasswordOpen] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: registerSchema
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.email,
          password: value.password,
          callbackURL: '/'
        },
        {
          onSuccess: () => {
            router.push('/');
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          }
        }
      );
    }
  });

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col gap-4 items-center">
          <Image
            src="./logo.svg"
            width={48}
            height={48}
            alt="the tea wire logo"
          />
          <CardTitle className="text-lg">Sign up</CardTitle>
          <CardDescription>Enter your email and password below to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="register-form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="relative"
                    >
                      <FieldLabel htmlFor="email">
                        Email <span className="text-red-700">*</span>
                      </FieldLabel>
                      <Input
                        disabled={form.state.isSubmitting}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="mail@domain.com"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="password">
                        Password <span className="text-red-700">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          disabled={form.state.isSubmitting}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter password"
                          className="pr-10"
                          type={passwordOpen ? 'text' : 'password'}
                        />
                        <Button
                          className="absolute right-1"
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setPasswordOpen(!passwordOpen)}
                        >
                          {passwordOpen ? (
                            <EyeIcon className="text-gray-500" />
                          ) : (
                            <EyeClosedIcon className="text-gray-500" />
                          )}
                        </Button>
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="confirmPassword"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-700">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          disabled={form.state.isSubmitting}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pr-10"
                          placeholder="Confirm password"
                          type={passwordOpen ? 'text' : 'password'}
                        />
                        <Button
                          className="absolute right-1"
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setPasswordOpen(!passwordOpen)}
                        >
                          {passwordOpen ? (
                            <EyeIcon className="text-gray-500" />
                          ) : (
                            <EyeClosedIcon className="text-gray-500" />
                          )}
                        </Button>
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-4">
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting
              })}
            >
              {(state) => (
                <Button
                  disabled={state.isSubmitting}
                  size="lg"
                  type="submit"
                  form="register-form"
                >
                  {state.isSubmitting ? 'Submitting...' : 'Sign up'}
                </Button>
              )}
            </form.Subscribe>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="underline underline-offset-4 text-black"
                href="/signin"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

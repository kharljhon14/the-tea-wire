'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form-nextjs';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import z from 'zod/v4';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: '/home'
        },
        {
          onSuccess: () => {
            router.push('/home');
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          }
        }
      );
    }
  });

  const [passwordOpen, setPasswordOpen] = useState(false);

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
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription>Welcome back! Please enter your details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <>
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
                            disabled={isSubmitting}
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
                              disabled={isSubmitting}
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
                </>
              )}
            />
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-4">
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button
                  disabled={isSubmitting}
                  size="lg"
                  type="submit"
                  form="login-form"
                >
                  {isSubmitting ? 'Logging in...' : 'Sign in'}
                </Button>
              )}
            ></form.Subscribe>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                className="underline underline-offset-4 text-black"
                href="/signup"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

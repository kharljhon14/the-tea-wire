'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form-nextjs';
import { PlusIcon } from 'lucide-react';

import Link from 'next/link';
import z from 'zod';

const createPostSchema = z.object({
  post: z.string().min(1, 'Post is required').max(200, 'Maximum of 200 characters')
});

export default function PostForm() {
  const form = useForm({
    defaultValues: {
      post: ''
    },
    validators: {
      onSubmit: createPostSchema
    }
  });

  return (
    <div className="flex-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Create Post
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Create Post</DialogTitle>
          </DialogHeader>
          <Separator />
          <form
            id="post-form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <form.Field
                  name="post"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="relative"
                      >
                        <Textarea
                          className="min-h-50 resize-y field-sizing-fixed"
                          disabled={isSubmitting}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="What's Happening?"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              )}
            />
          </form>
          <DialogFooter>
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                isValid: state.isValid,
                isTouched: state.isTouched,
                values: state.values
              })}
              children={({ isSubmitting, isValid, isTouched, values }) => (
                <Button
                  disabled={isSubmitting || !isValid || !isTouched || !values.post.trim()}
                  size="lg"
                  type="submit"
                  className="w-full"
                  form="post-form"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              )}
            ></form.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

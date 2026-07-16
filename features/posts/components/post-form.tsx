'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Field, FieldError } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form-nextjs';
import { PlusIcon } from 'lucide-react';

import Link from 'next/link';
import z from 'zod';
import { useCreatePost, useGetPost, useUpdatePost } from '../hooks/use-posts';

import { dialogPostAtom, setDialogOpenAtom } from '@/store/atoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const createPostSchema = z.object({
  post: z.string().min(1, 'Post is required').max(200, 'Maximum of 200 characters')
});

export default function PostForm() {
  const [dialog] = useAtom(dialogPostAtom);
  const [_, setDialogOpen] = useAtom(setDialogOpenAtom);

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const { data } = useGetPost(dialog.id);

  const form = useForm({
    defaultValues: {
      post: data ? data?.text : ''
    },
    validators: {
      onSubmit: createPostSchema
    },
    onSubmit: async ({ value }) => {
      if (!!dialog.id) {
        updatePost.mutate(
          { id: dialog.id, text: value.post },
          {
            onSuccess: () => {
              setDialogOpen(false);
              form.reset();
            }
          }
        );
      } else {
        createPost.mutate(
          { text: value.post },
          {
            onSuccess: () => {
              setDialogOpen(false);
              form.reset();
            }
          }
        );
      }
    }
  });

  useEffect(() => {
    if (dialog.id && data) {
      form.reset({ post: data.text ?? '' });
    }

    if (!dialog.id) {
      form.reset({
        post: ''
      });
    }
  }, [dialog.id, data, form]);

  return (
    <div className="flex-auto">
      <Dialog
        open={dialog.isOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogTrigger asChild>
          <Button>
            <span className="lg:block hidden">Create Post</span>
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl text-center">
                {dialog.id ? 'Edit Post' : 'Create Post'}
              </DialogTitle>
              <Separator className="my-4" />
              <Link
                href="/"
                className="flex w-fit"
              >
                <div className="flex gap-x-2 items-center">
                  {/* <Avatar>
                    <AvatarImage src="https://github.com/kharljhon14.png" />
                    <AvatarFallback>KE</AvatarFallback>
                  </Avatar> */}
                  {/* <CardTitle className="hover:underline"></CardTitle> */}
                </div>
              </Link>
            </div>
          </DialogHeader>
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
                  {isSubmitting
                    ? dialog.id
                      ? 'Saving...'
                      : 'Posting...'
                    : dialog.id
                      ? 'Save Changes'
                      : 'Post'}
                </Button>
              )}
            ></form.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

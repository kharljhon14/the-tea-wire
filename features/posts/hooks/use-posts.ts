import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreatePost = () => {
  //   const querClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.posts.create.mutationOptions({
      onSuccess: () => {
        toast.success(`Post created`);
        // TODO! Invalidate posts
      },
      onError: (error) => {
        toast.error(`Failed to create post: ${error.message}`);
      }
    })
  );
};

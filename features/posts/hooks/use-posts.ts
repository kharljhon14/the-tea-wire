import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usePostsParams } from './use-posts-params';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.posts.create.mutationOptions({
      onSuccess: () => {
        toast.success(`Post created`);
        queryClient.invalidateQueries(trpc.posts.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create post: ${error.message}`);
      }
    })
  );
};

export const useSuspensePosts = () => {
  const trpc = useTRPC();
  const [params] = usePostsParams();

  return useSuspenseQuery(trpc.posts.getMany.queryOptions(params));
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.posts.delete.mutationOptions({
      onSuccess: () => {
        toast.success('Post deleted');
        queryClient.invalidateQueries(trpc.posts.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to delete post: ${error.message}`);
      }
    })
  );
};

import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
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

export const useGetPost = (id?: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.posts.getOne.queryOptions({ id: id ?? '' }, { enabled: !!id }));
};

export const useSuspensePosts = () => {
  const trpc = useTRPC();
  const [params] = usePostsParams();

  return useSuspenseQuery(trpc.posts.getMany.queryOptions(params));
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.posts.update.mutationOptions({
      onSuccess: (data) => {
        toast.success('updated');
        queryClient.invalidateQueries(trpc.posts.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.posts.getOne.queryOptions({ id: data.id }));
      }
    })
  );
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

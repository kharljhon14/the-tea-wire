import { useQueryStates } from 'nuqs';
import { postsParams } from '../params';

export const usePostsParams = () => {
  return useQueryStates(postsParams);
};

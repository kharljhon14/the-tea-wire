import { PAGINATION } from '@/config/constant';
import { parseAsInteger, parseAsString } from 'nuqs/server';

export const postsParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  size: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  userID: parseAsString.withDefault('').withOptions({ clearOnDefault: true })
};

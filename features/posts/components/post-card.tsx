'use client';

import Link from 'next/link';

import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  SquarePenIcon,
  TrashIcon
} from 'lucide-react';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { PopoverTrigger, PopoverContent, Popover } from '@/components/ui/popover';

import { formatDistanceToNow } from 'date-fns';
import { PostWithUser } from '../types';
import { useDeletePost } from '../hooks/use-posts';
import { useAtom } from 'jotai';
import { setDialogOpenAtom } from '@/store/atoms';

interface Props {
  post: PostWithUser;
}

export default function PostCard({ post }: Props) {
  const [_, setDialogOpen] = useAtom(setDialogOpenAtom);

  const handleUpdatePost = () => {
    setDialogOpen(true, post.id);
  };

  const deletePost = useDeletePost();
  const handleDeletePost = () => {
    deletePost.mutate({ id: post.id });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-fit"
          >
            <div className="flex gap-x-2 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/kharljhon14.png" />
                <AvatarFallback>KE</AvatarFallback>
              </Avatar>
              <CardTitle className="hover:underline">{post.user.name}</CardTitle>
            </div>
          </Link>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                >
                  <MoreHorizontalIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-30">
                <div className="mx-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleUpdatePost}
                  >
                    <SquarePenIcon className="size-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={handleDeletePost}
                  >
                    <TrashIcon className="size-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CardDescription>
          {/* <div className="flex gap-x-2 text-xs">
            <Link href="/">{post.user.email}</Link>
            <Separator orientation="vertical" />
            <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
          </div> */}
          <span className="ml-10 text-xs">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.text}</p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-x-2">
          <Button
            size="icon"
            variant="outline"
          >
            <HeartIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
          >
            <MessageCircleIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
          >
            <BookmarkIcon />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

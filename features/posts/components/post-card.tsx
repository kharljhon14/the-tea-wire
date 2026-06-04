'use client';

import Link from 'next/link';

import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
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
import { Separator } from '@/components/ui/separator';
import { useCreatePost } from '../hooks/use-posts';

interface Props {}

export default function PostCard() {
  const createPost = useCreatePost();

  const handleCreatePost = () => {
    createPost.mutate({
      text: 'Spurs in 5'
    });
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
              <CardTitle className="hover:underline">Kharl Enriquez</CardTitle>
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
                    className="text-destructive"
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
          <div className="flex gap-x-2 text-xs">
            <Link href="/">enriquezkharl14@gmail.com</Link>
            <Separator orientation="vertical" />
            <span>11h</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis, voluptatibus?</p>
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
          <Button onClick={handleCreatePost}>Create Post</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

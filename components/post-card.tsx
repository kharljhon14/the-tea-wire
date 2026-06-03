'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  TrashIcon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Props {}

export default function PostCard() {
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
        </div>
      </CardFooter>
    </Card>
  );
}

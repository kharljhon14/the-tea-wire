'use client';

import { useSuspensePosts } from '../hooks/use-posts';
import PostCard from './post-card';

export default function PostList() {
  const posts = useSuspensePosts();

  return (
    <div className="flex flex-col gap-y-4">
      {posts.data.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}

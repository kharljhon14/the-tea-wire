'use client';

import { useSuspensePosts } from '../hooks/use-posts';
import PostCard from './post-card';

export default function PostList() {
  const posts = useSuspensePosts();

  return (
    <div>
      {posts.data.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}

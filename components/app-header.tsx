import PostForm from '@/features/posts/components/post-form';
import { SidebarTrigger } from './ui/sidebar';

export default function AppHeader() {
  return (
    <header className="flex justify-between h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div>
        <PostForm />
      </div>
    </header>
  );
}

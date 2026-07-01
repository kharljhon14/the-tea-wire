import PostForm from '@/features/posts/components/post-form';
import { SidebarTrigger } from './ui/sidebar';
import { Search } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupAddon } from './ui/input-group';

export default function AppHeader() {
  return (
    <header className="flex justify-between h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div>
        <InputGroup className="max-w-lg">
          <InputGroupInput
            className="lg:w-150 w-auto"
            placeholder="Search..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <PostForm />
      </div>
    </header>
  );
}

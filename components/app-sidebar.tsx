'use client';

import Link from 'next/link';
import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar';
import {
  BellIcon,
  BookmarkIcon,
  HouseIcon,
  LogOutIcon,
  MessageCircleIcon,
  UserIcon
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const menuItems = [
  {
    title: 'Home',
    items: [
      {
        title: 'Home',
        icon: HouseIcon,
        url: '/'
      },
      {
        title: 'Notifications',
        icon: BellIcon,
        url: '/notifications'
      },
      {
        title: 'Bookmark',
        icon: BookmarkIcon,
        url: '/bookmarks'
      },
      {
        title: 'Chat',
        icon: MessageCircleIcon,
        url: '/chat'
      },
      {
        title: 'Profile',
        icon: UserIcon,
        url: '/profile'
      }
    ]
  }
];

export default function AppSidebar() {
  const router = useRouter();

  const pathName = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="gap-x-4 h-10 px-4"
          >
            <Link
              prefetch
              href="/"
            >
              <Image
                src="./logo.svg"
                width={48}
                height={48}
                alt="the tea wire logo"
              />
              <span className="font-semibold text-uper">The Tea Wire</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.url === '/' ? pathName === '/' : pathName.startsWith(item.url)}
                      asChild
                      className="gap-x-4 h-12 px-4"
                    >
                      <Link
                        href={item.url}
                        prefetch
                      >
                        <item.icon className="size-6" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="gap-x-4 h-10 px-4 hover:cursor-pointer"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/signin');
                    }
                  }
                });
              }}
            >
              <LogOutIcon size="6" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

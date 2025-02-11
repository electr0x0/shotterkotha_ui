"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconBell,
  IconHeart,
  IconMessage2,
  IconUserPlus,
  IconThumbUp,
  IconPhoto,
  IconDots,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "like",
    user: "Sarah Chen",
    content: "liked your post",
    time: "2m ago",
    read: false,
    icon: IconHeart,
    iconColor: "text-red-500",
  },
  {
    id: 2,
    type: "comment",
    user: "John Doe",
    content: "commented on your post: 'This is amazing!'",
    time: "1h ago",
    read: false,
    icon: IconMessage2,
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    type: "follow",
    user: "Maria Garcia",
    content: "started following you",
    time: "2h ago",
    read: true,
    icon: IconUserPlus,
    iconColor: "text-green-500",
  },
  {
    id: 4,
    type: "like",
    user: "Alex Kim",
    content: "liked your comment",
    time: "5h ago",
    read: true,
    icon: IconThumbUp,
    iconColor: "text-red-500",
  },
  {
    id: 5,
    type: "post",
    user: "Emma Wilson",
    content: "shared a new post",
    time: "1d ago",
    read: true,
    icon: IconPhoto,
    iconColor: "text-purple-500",
  },
];

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative">
        <div className="p-2 hover:bg-accent rounded-full transition-colors">
          <IconBell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 max-h-[32rem] overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer",
                  !notification.read && "bg-accent/50"
                )}
              >
                <div className={cn("p-2 rounded-full bg-accent", notification.iconColor)}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.user}</span>{" "}
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>

                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconDots className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuItem>
            </div>
          );
        })}
        
        {notifications.length === 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center text-sm text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notification;
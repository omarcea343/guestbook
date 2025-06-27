'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, EyeOff } from 'lucide-react';

interface GuestbookEntryProps {
  id: string;
  message: string;
  username: string | null;
  createdAt: Date;
  onUsernameAction?: (username: string, action: 'ignore' | 'view-only') => void;
  isUserIgnored?: boolean;
}

export function GuestbookEntry({ message, username, createdAt, onUsernameAction, isUserIgnored }: GuestbookEntryProps) {
  return (
    <div className="space-y-3">
      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
        {message}
      </p>
      <div className="flex items-center gap-2 text-sm">
        {username ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-medium text-primary hover:text-primary/80 transition-colors">
                {username}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => window.location.href = `/user/${username}`}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View {username}'s profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUsernameAction?.(username, 'ignore')}
                className="flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                {isUserIgnored ? 'Unignore' : 'Ignore'} {username}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="font-medium text-primary">Anonymous</span>
        )}
        <span className="text-muted-foreground">•</span>
        <time dateTime={createdAt.toISOString()} className="text-muted-foreground">
          {createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </div>
  );
}
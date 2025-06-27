'use client';

interface GuestbookEntryProps {
  id: string;
  message: string;
  username: string | null;
  createdAt: Date;
}

export function GuestbookEntry({ message, username, createdAt }: GuestbookEntryProps) {
  return (
    <div className="space-y-3">
      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
        {message}
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-primary">
          {username || 'Anonymous'}
        </span>
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
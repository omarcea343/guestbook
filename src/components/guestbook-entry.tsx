'use client';

interface GuestbookEntryProps {
  id: string;
  message: string;
  username: string | null;
  createdAt: Date;
}

export function GuestbookEntry({ message, username, createdAt }: GuestbookEntryProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-900 mb-2">{message}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">{username || 'Anonymous'}</span>
            <span className="mx-2">•</span>
            <time dateTime={createdAt.toISOString()}>
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
      </div>
    </div>
  );
}
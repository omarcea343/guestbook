'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { GuestbookEntry } from '@/components/guestbook-entry';
import { NewMessageForm } from '@/components/new-message-form';
import { AuthForm } from '@/components/auth-form';
import { getGuestbookEntries, createGuestbookEntry } from '@/actions/guestbook';

interface GuestbookEntryType {
  id: string;
  message: string;
  createdAt: Date;
  username: string | null;
  displayUsername: string | null;
}

export default function Home() {
  const { data: session, isPending } = useSession();
  const [entries, setEntries] = useState<GuestbookEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getGuestbookEntries();
      setEntries(data.map(entry => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = async (message: string) => {
    await createGuestbookEntry(message);
    await loadEntries();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zenful Guestbook
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts and connect with others
          </p>
        </header>

        <div className="mb-8">
          {session ? (
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <p className="font-medium text-gray-900">
                    {session.user.username || session.user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mb-6">
              <button
                onClick={() => setShowAuth(!showAuth)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {showAuth ? 'Hide Sign In' : 'Sign In / Sign Up'}
              </button>
            </div>
          )}

          {showAuth && !session && (
            <div className="mb-8">
              <AuthForm onSuccess={() => setShowAuth(false)} />
            </div>
          )}

          {session && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
              <NewMessageForm onSubmit={handleNewMessage} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                Loading messages...
              </div>
            ) : entries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No messages yet. Be the first to leave one!
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-6">
                  <GuestbookEntry
                    id={entry.id}
                    message={entry.message}
                    username={entry.displayUsername || entry.username}
                    createdAt={entry.createdAt}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
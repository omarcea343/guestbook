'use server';

import { db } from '@/db';
import { guestbook, user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getGuestbookEntries() {
  const entries = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      username: user.username,
      displayUsername: user.displayUsername,
      name: user.name,
    })
    .from(guestbook)
    .leftJoin(user, eq(guestbook.userId, user.id))
    .orderBy(desc(guestbook.createdAt));

  return entries;
}

export async function createGuestbookEntry(message: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('You must be signed in to post a message');
  }

  await db.insert(guestbook).values({
    message,
    userId: session.user.id,
  });

  revalidatePath('/');
}
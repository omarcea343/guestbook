'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { getUserPreferences, updateIgnoredUsers } from '@/actions/preferences';
import { changePassword } from '@/actions/auth';
import { ArrowLeft, Settings, Eye, X, Lock, User, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: getUserPreferences,
    enabled: !!session?.user?.emailVerified,
  });

  // Mutation for updating ignored users
  const updateIgnoredUsersMutation = useMutation({
    mutationFn: updateIgnoredUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });

  const handleUnignoreUser = async (username: string) => {
    const currentIgnored = preferences?.ignoredUsers || [];
    const newIgnored = currentIgnored.filter(u => u !== username);
    await updateIgnoredUsersMutation.mutateAsync(newIgnored);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Could add success toast here
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-950 to-teal-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse">
            <div className="h-2 w-2 bg-primary rounded-full mx-1 inline-block animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full mx-1 inline-block animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full mx-1 inline-block animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.emailVerified) {
    router.push('/');
    return null;
  }

  const ignoredUsers = preferences?.ignoredUsers || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-950 to-teal-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2314b8a6%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <Navigation />
      
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-foreground font-medium">
                  {session.user.username || session.user.name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{session.user.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-500 text-sm">Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-input rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground mt-1"
                  required
                  disabled={isChangingPassword}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-input rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground mt-1"
                  required
                  disabled={isChangingPassword}
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-input rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground mt-1"
                  required
                  disabled={isChangingPassword}
                />
              </div>
              
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isChangingPassword ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Ignored Users */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Ignored Users</h2>
            {ignoredUsers.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({ignoredUsers.length} user{ignoredUsers.length === 1 ? '' : 's'})
              </span>
            )}
          </div>
          
          {ignoredUsers.length > 0 ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ignoredUsers.map((username) => (
                  <div
                    key={username}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center text-white text-sm font-semibold">
                        {username[0].toUpperCase()}
                      </div>
                      <span className="text-foreground font-medium">{username}</span>
                    </div>
                    <Button
                      onClick={() => handleUnignoreUser(username)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive"
                      disabled={updateIgnoredUsersMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Messages from ignored users won&apos;t appear in your main feed. You can still visit their profiles directly.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No ignored users</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                You haven&apos;t ignored any users yet. When you ignore someone, they&apos;ll appear here and their messages will be hidden from your main feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
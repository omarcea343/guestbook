'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AuthForm } from '@/components/auth-form';
import { LogOut, User, Sparkles, Settings, ChevronDown } from 'lucide-react';

export function Navigation() {
  const { data: session, isPending } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);


  // Show auth modal if no session OR if session exists but email not verified
  const shouldShowAuthModal = showAuthModal && (!session || !session.user.emailVerified);

  const handleSignOut = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">Zenbook</span>
            </div>
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Zenbook</span>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a
              href="https://dreamsofcode.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>by Dreams of Code</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            {session && session.user.emailVerified ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                      {(session.user.username || session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground hidden sm:block">
                        {session.user.username || session.user.name || session.user.email}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.username || session.user.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={shouldShowAuthModal} onOpenChange={(open) => {
                // Only allow closing if email is verified or user explicitly closes
                if (!open && session && !session.user.emailVerified) {
                  return;
                }
                setShowAuthModal(open);
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                      Join the Community
                    </DialogTitle>
                  </DialogHeader>
                  <AuthForm onSuccess={() => {
                    setShowAuthModal(false);
                  }} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

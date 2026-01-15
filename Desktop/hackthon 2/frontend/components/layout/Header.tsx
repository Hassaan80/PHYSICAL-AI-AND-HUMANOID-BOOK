'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export function Header() {
  const { user, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <Container className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading}
              aria-label="Sign out"
            >
              Sign Out
            </Button>
          </div>
        )}
      </Container>
    </header>
  );
}

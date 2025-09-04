import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Menu, CalendarCheck, Users } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { Link } from '@tanstack/react-router';

export function Header() {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const { toggleMobileMenu } = useLayout();

  return (
    <header className="border-b p-4 flex items-center justify-between">
      {/* Left-aligned items */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/" activeProps={{ className: 'font-bold' }}>
            <Button variant="ghost">
              <CalendarCheck className="h-5 w-5 mr-2" />
              Mes présences
            </Button>
          </Link>
          <Link to="/who-is-here" activeProps={{ className: 'font-bold' }}>
            <Button variant="ghost">
              <Users className="h-5 w-5 mr-2" />
              Qui est là ?
            </Button>
          </Link>
        </div>
      </div>


      {/* Right-aligned items */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : isAuthenticated && user ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback name={user.name} />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <p className="text-sm text-gray-600">Utilisateur non connecté</p>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

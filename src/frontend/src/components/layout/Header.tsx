import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../LoginButton';
import { Building2 } from 'lucide-react';

export default function Header() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Construction Tracker</h1>
            <p className="text-xs text-muted-foreground">Project Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userProfile && (
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground">{userProfile.appRole}</p>
            </div>
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}

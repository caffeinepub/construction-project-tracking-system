import { Link, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { AppRole } from '../../backend';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  FolderOpen, 
  Send, 
  List, 
  ShoppingCart, 
  DollarSign, 
  Receipt, 
  Calculator, 
  TrendingUp, 
  Activity, 
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: AppRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-4 w-4" />, roles: [AppRole.Admin, AppRole.Foreman, AppRole.Buyer, AppRole.Finance] },
  { label: 'Master Data', path: '/master-data', icon: <Database className="h-4 w-4" />, roles: [AppRole.Admin] },
  { label: 'RAP Builder', path: '/rap-builder', icon: <FileText className="h-4 w-4" />, roles: [AppRole.Admin] },
  { label: 'RAP Templates', path: '/rap-templates', icon: <FolderOpen className="h-4 w-4" />, roles: [AppRole.Admin] },
  { label: 'Create Request', path: '/create-request', icon: <Send className="h-4 w-4" />, roles: [AppRole.Foreman] },
  { label: 'My Requests', path: '/my-requests', icon: <List className="h-4 w-4" />, roles: [AppRole.Foreman] },
  { label: 'Buyer Review', path: '/buyer-review', icon: <ShoppingCart className="h-4 w-4" />, roles: [AppRole.Buyer] },
  { label: 'Finance Review', path: '/finance-review', icon: <DollarSign className="h-4 w-4" />, roles: [AppRole.Finance] },
  { label: 'Realization Report', path: '/realization-report', icon: <Receipt className="h-4 w-4" />, roles: [AppRole.Buyer] },
  { label: 'Accounting', path: '/accounting', icon: <Calculator className="h-4 w-4" />, roles: [AppRole.Finance] },
  { label: 'Progress Tracking', path: '/progress-tracking', icon: <Activity className="h-4 w-4" />, roles: [AppRole.Foreman] },
  { label: 'S-Curve', path: '/s-curve', icon: <TrendingUp className="h-4 w-4" />, roles: [AppRole.Admin, AppRole.Foreman, AppRole.Buyer, AppRole.Finance] },
  { label: 'Material Usage', path: '/material-usage', icon: <Package className="h-4 w-4" />, roles: [AppRole.Buyer] },
];

export default function Sidebar() {
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const filteredNavItems = navItems.filter(item => 
    userProfile && item.roles.includes(userProfile.appRole)
  );

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'construction-tracker');

  return (
    <footer className="border-t border-border bg-card py-4 px-6">
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <span>© {currentYear} Construction Tracker. Built with</span>
        <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" />
        <span>using</span>
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 font-medium text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Mail, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
    const location = useLocation();
    const path = location.pathname;

    // Don't show on login/signup
    if (path === '/login' || path === '/signup') return null;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/search' },
        // { icon: Mail, label: 'Inbox', path: '/inbox' }, // Merged into Profile or separate? Spec says Profile has Inbox internal tab, but Nav bar has Inbox tab?
        // User spec: Tabs: Home, Search, Inbox, Public, Favorite, Profile.
        // Let's stick to Home, Search, Profile for MVP to verify structure first.
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50">
            {navItems.map((item) => {
                const isActive = path === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                            isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    );
}

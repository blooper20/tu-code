import { auth } from "@/lib/auth";
import {
    LayoutDashboard,
    FolderGit2,
    Settings,
    LogOut,
    Home as HomeIcon,
    ChevronRight,
    Users
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/");
    }

    const navItems = [
        { label: "대시보드", href: "/admin", icon: LayoutDashboard },
        { label: "프로젝트 관리", href: "/admin/projects", icon: FolderGit2 },
        { label: "팀원 관리", href: "/admin/team", icon: Users },
        { label: "설정", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-surface-3 bg-surface-1/50 backdrop-blur-xl flex flex-col">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative h-16 w-16 flex items-center justify-center shrink-0 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-110">
                            <img
                                src="/tucode-pamoja-logo.png"
                                alt="Logo"
                                className="h-full w-full object-contain mix-blend-screen"
                            />
                        </div>
                        <span className="font-display font-black text-2xl tracking-tighter brand-gradient-text uppercase leading-none">
                            Tucode<br />Pamoja
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between group px-4 py-3 rounded-xl hover:bg-surface-2 transition-all text-text-secondary hover:text-text-primary"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 group-hover:text-primary-400 transition-colors" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-surface-3">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-surface-3 overflow-hidden">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="User avatar" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center font-bold">
                                    {session.user?.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{session.user?.name}</p>
                            <p className="text-xs text-text-muted truncate">{session.user?.email}</p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-2 transition-all text-text-secondary w-full"
                    >
                        <HomeIcon className="h-5 w-5" />
                        <span className="font-medium">사이트 홈</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">{children}</main>
        </div>
    );
}

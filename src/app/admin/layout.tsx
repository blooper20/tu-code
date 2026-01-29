import { auth } from "@/lib/auth";
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

    return (
        <div className="flex min-h-screen bg-background">
            {/* Admin Sidebar or Navigation could go here */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}

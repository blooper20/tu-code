import { auth } from "@/lib/auth";

export default async function AdminPage() {
    const session = await auth();

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
            <div className="card max-w-md">
                <h2 className="text-xl font-semibold mb-4">환영합니다, {session?.user?.name}님!</h2>
                <p className="text-text-secondary">
                    여기서 프로젝트를 추가하고 관리할 수 있습니다. <br />
                    현재 Phase 2(인증) 단계가 완료되었으며, 다음은 Phase 3(데이터베이스) 연동입니다.
                </p>
            </div>
        </div>
    );
}

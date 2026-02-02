"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function sendMessage(formData: FormData) {
    const project_id = formData.get("project_id") as string;
    const team_member_id = formData.get("team_member_id") as string;
    const sender_email = formData.get("sender_email") as string;
    const content = formData.get("content") as string;

    if (!sender_email || !content) {
        return { error: "이메일과 내용을 모두 입력해주세요." };
    }

    const insertData: any = {
        sender_email,
        content,
        status: 'unread'
    };

    if (project_id) insertData.project_id = project_id;
    if (team_member_id) insertData.team_member_id = team_member_id;

    const { error } = await supabaseAdmin
        .from("messages")
        .insert([insertData]);

    if (error) {
        console.error("Error sending message:", error);
        return { error: "메시지 전송에 실패했습니다." };
    }

    return { success: true };
}

export async function getProjectMessages(projectId: string) {
    const { data, error } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    return data;
}

export async function getAllMessages() {
    const { data, error } = await supabaseAdmin
        .from("messages")
        .select(`
            *,
            projects (title),
            team_members (name)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all messages:", error);
        return [];
    }
    return data;
}

export async function getUnreadMessageCount() {
    const { count, error } = await supabaseAdmin
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq('status', 'unread');

    if (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
    return count || 0;
}

export async function getUnreadProjectMessageCount() {
    const { count, error } = await supabaseAdmin
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq('status', 'unread')
        .not('project_id', 'is', null);

    if (error) {
        console.error("Error fetching unread project msg count:", error);
        return 0;
    }
    return count || 0;
}

export async function getUnreadPersonalMessageCount() {
    const { count, error } = await supabaseAdmin
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq('status', 'unread')
        .not('team_member_id', 'is', null);

    if (error) {
        console.error("Error fetching unread personal msg count:", error);
        return 0;
    }
    return count || 0;
}

export async function getMessageById(id: string) {
    const { data, error } = await supabaseAdmin
        .from("messages")
        .select(`
            *,
            projects (title),
            team_members (name)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching message:", error);
        return null;
    }
    return data;
}

export async function updateMessageStatus(id: string, status: 'read' | 'unread' | 'replied') {
    const { error } = await supabaseAdmin
        .from("messages")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Error updating message status:", error);
        return { error: "상태 업데이트 실패" };
    }
    return { success: true };
}

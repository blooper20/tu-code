"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { parseGitHubUrl, fetchGitHubReadme, fetchGitHubRepoInfo, parseGitHubProfileUrl, fetchGitHubUserInfo } from "@/lib/github/api";

// ... (existing code)

export async function createTeamMember(formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    let name = formData.get("name") as string;
    let role = formData.get("role") as string;
    let bio = formData.get("bio") as string;
    const github_url = formData.get("github_url") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
    const thumbnailFile = formData.get("thumbnail") as File;
    const custom_content = formData.get("custom_content") as string;

    // New Fields
    const one_line_intro = formData.get("one_line_intro") as string;
    const short_message = formData.get("short_message") as string;
    const background_color = formData.get("background_color") as string;
    const representative_project = formData.get("representative_project") as string;
    const use_github_data = formData.get("use_github_data") === "true";
    const backgroundImageFile = formData.get("background_image") as File;

    let readme_content = "";
    let thumbnail_url = "";
    let background_image_url = "";

    // 1. 이미지 업로드 (Thumbnail)
    if (thumbnailFile && thumbnailFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(thumbnailFile);
            if (uploadedUrl) thumbnail_url = uploadedUrl;
        } catch (e) {
            console.error("Thumbnail upload failed", e);
        }
    }

    // 2. 이미지 업로드 (Background)
    if (backgroundImageFile && backgroundImageFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(backgroundImageFile);
            if (uploadedUrl) background_image_url = uploadedUrl;
        } catch (e) {
            console.error("Background upload failed", e);
        }
    }

    // 3. GitHub 정보 가져오기 (use_github_data가 true일 때만)
    if (use_github_data && github_url) {
        const username = parseGitHubProfileUrl(github_url);
        if (username) {
            const [userInfo, readmeData] = await Promise.all([
                fetchGitHubUserInfo(username),
                fetchGitHubReadme(username, username),
            ]);

            if (userInfo) {
                if (!name) name = userInfo.name || username;
                // GitHub bio를 short_message나 bio 중 어디에 쓸지? 
                // 보통 GitHub bio는 짧으므로 short_message에 넣고, 상세는 readme로?
                // 아니면 기존 로직대로 bio에 넣음. User가 bio를 빈칸으로 두었을 때만 채우자.
                if (!bio) bio = userInfo.bio;
                if (!thumbnail_url) thumbnail_url = userInfo.avatar_url;
            }
            if (readmeData) {
                readme_content = readmeData;
            }
        }
    }

    const { error } = await supabaseAdmin
        .from("team_members")
        .insert([
            {
                name,
                role,
                bio,
                github_url,
                thumbnail_url,
                tags,
                custom_content,
                readme_content,
                // New Fields Insertion
                one_line_intro,
                short_message,
                background_color,
                background_image_url,
                representative_project,
                use_github_data
            },
        ]);

    if (error) {
        console.error("Error creating team member:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/team");
    revalidatePath("/");
    return { success: true };
}

export async function deleteTeamMember(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const { error } = await supabaseAdmin
        .from("team_members")
        .delete()
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/team");
    revalidatePath("/");
}

export async function getTeamMember(id: string) {
    const { data, error } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching team member:", error);
        return null;
    }
    return data;
}

export async function updateTeamMember(id: string, formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    let name = formData.get("name") as string;
    let role = formData.get("role") as string;
    let bio = formData.get("bio") as string;
    const github_url = formData.get("github_url") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
    const thumbnailFile = formData.get("thumbnail") as File;
    const custom_content = formData.get("custom_content") as string;

    const one_line_intro = formData.get("one_line_intro") as string;
    const short_message = formData.get("short_message") as string;
    const background_color = formData.get("background_color") as string;
    const representative_project = formData.get("representative_project") as string;
    const use_github_data = formData.get("use_github_data") === "true";
    const backgroundImageFile = formData.get("background_image") as File;
    const use_glassmorphism = formData.get("use_glassmorphism") === "true";

    let readme_content: string | undefined;
    let thumbnail_url: string | undefined;
    let background_image_url: string | undefined;

    // 1. 이미지 업로드
    if (thumbnailFile && thumbnailFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(thumbnailFile);
            if (uploadedUrl) thumbnail_url = uploadedUrl;
        } catch (e) {
            console.error("Thumbnail upload failed", e);
        }
    }

    if (backgroundImageFile && backgroundImageFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(backgroundImageFile);
            if (uploadedUrl) background_image_url = uploadedUrl;
        } catch (e) {
            console.error("Background upload failed", e);
        }
    }

    // 2. GitHub 정보 가져오기
    if (use_github_data && github_url) {
        const username = parseGitHubProfileUrl(github_url);
        if (username) {
            const [userInfo, readmeData] = await Promise.all([
                fetchGitHubUserInfo(username),
                fetchGitHubReadme(username, username),
            ]);

            if (userInfo) {
                if (!name) name = userInfo.name || username;
                if (!bio) bio = userInfo.bio;
                // Use GitHub avatar if no new file uploaded
                if (!thumbnailFile || thumbnailFile.size === 0) {
                    thumbnail_url = userInfo.avatar_url;
                }
            }
            if (readmeData) {
                readme_content = readmeData;
            }
        }
    }

    const updateData: any = {
        name,
        role,
        bio,
        github_url,
        tags,
        custom_content,
        one_line_intro,
        short_message,
        background_color,
        representative_project,
        use_github_data,
        use_glassmorphism,
        updated_at: new Date().toISOString(),
    };

    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url;
    if (background_image_url) updateData.background_image_url = background_image_url;
    if (readme_content !== undefined) updateData.readme_content = readme_content;

    const { error } = await supabaseAdmin
        .from("team_members")
        .update(updateData)
        .eq("id", id);

    if (error) {
        console.error("Error updating team member:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/team");
    revalidatePath("/");
    return { success: true };
}

const BUCKET_NAME = "project-thumbnails";

async function uploadThumbnail(file: File) {
    if (!file || file.size === 0) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // 버킷이 존재하는지 확인하고 없으면 생성 (Admin 권한 필요)
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.find(b => b.name === BUCKET_NAME)) {
        await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
    }

    const { error: uploadError } = await supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            contentType: file.type,
            upsert: true
        });

    if (uploadError) {
        console.error("Error uploading thumbnail:", uploadError);
        throw new Error("이미지 업로드에 실패했습니다.");
    }

    const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    let title = formData.get("title") as string;
    let description = formData.get("description") as string;
    const github_url = formData.get("github_url") as string;
    const website_url = formData.get("website_url") as string;
    const category = formData.get("category") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
    const thumbnailFile = formData.get("thumbnail") as File;
    const custom_content = formData.get("custom_content") as string;

    let readme_content = "";
    let thumbnail_url = "";

    // 1. 직접 업로드한 이미지가 있으면 우선 사용
    if (thumbnailFile && thumbnailFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(thumbnailFile);
            if (uploadedUrl) thumbnail_url = uploadedUrl;
        } catch (e) {
            console.error("Thumbnail upload failed, falling back to GitHub.", e);
        }
    }

    // 2. GitHub 정보 자동 가져오기 (이미지가 아직 없으면 GitHub 아바타 사용)
    if (github_url) {
        const gitInfo = parseGitHubUrl(github_url);
        if (gitInfo) {
            const [repoData, readmeData] = await Promise.all([
                fetchGitHubRepoInfo(gitInfo.owner, gitInfo.repo),
                fetchGitHubReadme(gitInfo.owner, gitInfo.repo),
            ]);

            if (repoData) {
                if (!title) title = repoData.name;
                if (!description) description = repoData.description;
                // 직접 업로드한 이미지가 없을 때만 GitHub 아바타 사용
                if (!thumbnail_url) {
                    thumbnail_url = repoData.owner?.avatar_url || "";
                }
            }
            if (readmeData) {
                readme_content = readmeData;
            }
        }
    }

    const { data, error } = await supabaseAdmin
        .from("projects")
        .insert([
            {
                title,
                description,
                github_url,
                website_url,
                category, // Add category here
                readme_content,
                thumbnail_url,
                custom_content,
                tags,
                created_by: session.user?.email || session.user?.name,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating project:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
}

export async function deleteProject(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const { error } = await supabaseAdmin
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const github_url = formData.get("github_url") as string;
    const website_url = formData.get("website_url") as string;
    const category = formData.get("category") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
    const is_featured = formData.get("is_featured") === "true";
    const thumbnailFile = formData.get("thumbnail") as File;
    const custom_content = formData.get("custom_content") as string;

    // GitHub URL이 변경되었으면 README 다시 가져오기
    let readme_content: string | undefined;
    if (github_url) {
        const gitInfo = parseGitHubUrl(github_url);
        if (gitInfo) {
            const readmeData = await fetchGitHubReadme(gitInfo.owner, gitInfo.repo);
            if (readmeData) {
                readme_content = readmeData;
            }
        }
    }

    const updateData: any = {
        title,
        description,
        github_url,
        website_url,
        category, // Add category here
        tags,
        is_featured,
        custom_content,
        updated_at: new Date().toISOString(),
    };

    if (readme_content !== undefined) {
        updateData.readme_content = readme_content;
    }

    // 썸네일 파일이 있으면 업로드 및 업데이트
    if (thumbnailFile && thumbnailFile.size > 0) {
        try {
            const uploadedUrl = await uploadThumbnail(thumbnailFile);
            if (uploadedUrl) {
                updateData.thumbnail_url = uploadedUrl;
            }
        } catch (e) {
            console.error("Thumbnail upload failed:", e);
            // 썸네일 실패해도 나머지 업데이트는 진행? 아니면 에러 반환?
            // 여기서는 경고만 하고 진행
        }
    }

    const { data, error } = await supabaseAdmin
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating project:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/");
    return { success: true, data };
}

export async function refreshProjectReadme(id: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // 현재 프로젝트의 GitHub URL 가져오기
    const { data: project } = await supabaseAdmin
        .from("projects")
        .select("github_url")
        .eq("id", id)
        .single();

    if (!project?.github_url) {
        return { error: "GitHub URL이 없습니다." };
    }

    const gitInfo = parseGitHubUrl(project.github_url);
    if (!gitInfo) {
        return { error: "유효하지 않은 GitHub URL입니다." };
    }

    const readme_content = await fetchGitHubReadme(gitInfo.owner, gitInfo.repo);

    const { error } = await supabaseAdmin
        .from("projects")
        .update({
            readme_content,
            updated_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/projects/${id}`);
    return { success: true };
}

export async function updateProjectOrder(projectIds: string[]) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // 각 프로젝트의 order_index 업데이트
    const updates = projectIds.map((id, index) =>
        supabaseAdmin
            .from("projects")
            .update({ order_index: index })
            .eq("id", id)
    );

    await Promise.all(updates);

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
}

export async function getTeamMembers() {
    const { data, error } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching team members:", error);
        return [];
    }
    return data;
}

export async function getProjects() {
    const { data, error } = await supabaseAdmin
        .from("projects")
        .select("id, title, thumbnail_url, description")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    return data;
}

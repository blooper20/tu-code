/**
 * GitHub URL을 파싱하여 owner와 repo 이름을 추출합니다.
 */
export function parseGitHubUrl(url: string) {
    try {
        const path = new URL(url).pathname;
        const parts = path.split("/").filter(Boolean);
        if (parts.length >= 2) {
            return { owner: parts[0], repo: parts[1] };
        }
    } catch (e) {
        return null;
    }
    return null;
}

/**
 * GitHub API를 통해 리포지토리의 README 콘텐츠를 가져옵니다.
 */
export async function fetchGitHubReadme(owner: string, repo: string) {
    const headers = {
        ...(process.env.GITHUB_ACCESS_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        }),
    };

    try {
        // 1. 먼저 Raw 텍스트로 시도 (가장 효율적)
        const rawResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            {
                headers: {
                    ...headers,
                    Accept: "application/vnd.github.v3.raw",
                },
            }
        );

        if (rawResponse.ok) {
            return await rawResponse.text();
        }

        // 2. Raw 실패 시 JSON으로 시도하여 Base64 디코딩 (백업 로직)
        const jsonResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            {
                headers: {
                    ...headers,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (jsonResponse.ok) {
            const data = await jsonResponse.json();
            if (data.content) {
                // Buffer는 Node.js 환경(Server Action)에서 사용 가능합니다.
                return Buffer.from(data.content, "base64").toString("utf-8");
            }
        }

        console.error(`GitHub API Error: ${jsonResponse.status} ${jsonResponse.statusText} for ${owner}/${repo}`);
        if (jsonResponse.status === 403) {
            console.warn("Hint: GitHub API Rate limit exceeded or invalid token. Please check GITHUB_ACCESS_TOKEN in .env.local");
        }

        return null;
    } catch (error) {
        console.error("Error fetching README:", error);
        return null;
    }
}

/**
 * GitHub API를 통해 리포지토리의 메타데이터(설명, 별점 등)를 가져옵니다.
 */
export async function fetchGitHubRepoInfo(owner: string, repo: string) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                ...(process.env.GITHUB_ACCESS_TOKEN && {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                }),
            },
        });

        if (!response.ok) {
            console.error(`GitHub API Info Error: ${response.status} ${response.statusText} for ${owner}/${repo}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching repo info:", error);
        return null;
    }
}

/**
 * GitHub 프로필 URL을 파싱하여 username을 추출합니다.
 */
export function parseGitHubProfileUrl(url: string) {
    try {
        const path = new URL(url).pathname;
        const parts = path.split("/").filter(Boolean);
        if (parts.length >= 1) {
            return parts[0];
        }
    } catch (e) {
        return null;
    }
    return null;
}

/**
 * GitHub API를 통해 사용자 정보를 가져옵니다.
 */
export async function fetchGitHubUserInfo(username: string) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                ...(process.env.GITHUB_ACCESS_TOKEN && {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                }),
            },
        });

        if (!response.ok) {
            console.error(`GitHub API User Info Error: ${response.status} ${response.statusText} for ${username}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

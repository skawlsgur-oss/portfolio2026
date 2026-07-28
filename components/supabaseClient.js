/**
 * ==========================================================================
 * [데이터 액세스 레이어] supabaseClient.js - Supabase 연동 & 폴백 클라이언트
 * ==========================================================================
 * 역할: Supabase DB (URL: https://brvakuminzqaozxmtjtu.supabase.co) 와 데이터 통신을 담당하며,
 * 네트워크 오류 시 LocalStorage로 자동 폴백(Fallback)되어 안전하게 데이터 지속성을 유지합니다.
 */

// Supabase 접속 설정 정보
const SUPABASE_URL = 'https://brvakuminzqaozxmtjtu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9Hnfp-ghadXI8mhMj1ASrA_2ffE7csQ';

let supabaseClient = null;

// Supabase 클라이언트 초기화 함수
export function getSupabase() {
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// 1. 강사 프로필 불러오기 (Supabase -> LocalStorage -> Default)
export async function fetchProfile(defaultProfile) {
    const client = getSupabase();
    if (client) {
        try {
            const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('id', 'main')
                .single();

            if (!error && data) {
                const profileData = {
                    name: data.name,
                    title: data.title,
                    bio: data.bio,
                    skills: typeof data.skills === 'string' ? JSON.parse(data.skills) : (data.skills || [])
                };
                localStorage.setItem('portfolio_profile', JSON.stringify(profileData));
                return profileData;
            }
        } catch (e) {
            console.warn('Supabase 프로필 조회 실패, 로컬 스토리지로 연동합니다.', e);
        }
    }

    // 폴백: LocalStorage 또는 기본 시드 데이터
    const saved = localStorage.getItem('portfolio_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
}

// 2. 강사 프로필 저장하기 (Supabase & LocalStorage 동시 업데이트)
export async function saveProfile(newProfile) {
    // 1) LocalStorage 동기화
    localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));

    // 2) Supabase 업서트
    const client = getSupabase();
    if (client) {
        try {
            await client.from('profiles').upsert({
                id: 'main',
                name: newProfile.name,
                title: newProfile.title,
                bio: newProfile.bio,
                skills: newProfile.skills,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.error('Supabase 프로필 저장 중 오류 발생:', e);
        }
    }
}

// 3. 작업물 목록 불러오기 (Supabase -> LocalStorage -> Default)
export async function fetchProjects(defaultProjects) {
    const client = getSupabase();
    if (client) {
        try {
            const { data, error } = await client
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                const projectsData = data.map(p => ({
                    id: p.id,
                    title: p.title,
                    category: p.category,
                    desc: p.desc,
                    icon: p.icon || '🚀',
                    tools: typeof p.tools === 'string' ? JSON.parse(p.tools) : (p.tools || []),
                    demoUrl: p.demo_url || '',
                    githubUrl: p.github_url || '',
                    prompt: p.prompt,
                    tips: p.tips || ''
                }));
                localStorage.setItem('portfolio_projects', JSON.stringify(projectsData));
                return projectsData;
            }
        } catch (e) {
            console.warn('Supabase 작업물 조회 실패, 로컬 스토리지로 연동합니다.', e);
        }
    }

    // 폴백: LocalStorage 또는 기본 시드 데이터
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
}

// 4. 작업물 저장/수정하기 (Supabase & LocalStorage 동시 업데이트)
export async function saveProject(projectData) {
    // 1) LocalStorage 동기화
    const saved = localStorage.getItem('portfolio_projects');
    let projects = saved ? JSON.parse(saved) : [];
    const index = projects.findIndex(p => p.id === projectData.id);
    if (index >= 0) projects[index] = projectData;
    else projects.unshift(projectData);
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));

    // 2) Supabase 업서트
    const client = getSupabase();
    if (client) {
        try {
            await client.from('projects').upsert({
                id: projectData.id,
                title: projectData.title,
                category: projectData.category,
                desc: projectData.desc,
                icon: projectData.icon || '🚀',
                tools: projectData.tools,
                demo_url: projectData.demoUrl || '',
                github_url: projectData.githubUrl || '',
                prompt: projectData.prompt,
                tips: projectData.tips || ''
            });
        } catch (e) {
            console.error('Supabase 작업물 저장 중 오류 발생:', e);
        }
    }
}

// 5. 작업물 삭제하기 (Supabase & LocalStorage 동시 동기화)
export async function deleteProject(projectId) {
    // 1) LocalStorage 동기화
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
        const projects = JSON.parse(saved).filter(p => p.id !== projectId);
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    }

    // 2) Supabase 삭제
    const client = getSupabase();
    if (client) {
        try {
            await client.from('projects').delete().eq('id', projectId);
        } catch (e) {
            console.error('Supabase 작업물 삭제 중 오류 발생:', e);
        }
    }
}

// 6. 데이터 리셋 (Supabase & LocalStorage 초기화)
export async function resetDatabase(defaultProfile, defaultProjects) {
    await saveProfile(defaultProfile);
    for (const proj of defaultProjects) {
        await saveProject(proj);
    }
}

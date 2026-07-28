/**
 * ==========================================================================
 * [관리자 컨트롤러] admin.js - file:// 프로토콜 및 웹 서버 겸용 스크립트
 * ==========================================================================
 * 역할: CORS 제약이 발생하는 file:// 환경에서도 100% 호환되도록 구성된 전용 관리자 대시보드 로직.
 * Supabase DB & LocalStorage 연동 프로필 편집, 작업물 CRUD 조작.
 */

(function() {
    // ----------------------------------------------------------------------
    // 1. Supabase 데이터 통신 클라이언트
    // ----------------------------------------------------------------------
    const SUPABASE_URL = 'https://brvakuminzqaozxmtjtu.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_9Hnfp-ghadXI8mhMj1ASrA_2ffE7csQ';
    let supabaseClient = null;

    function getSupabase() {
        if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        return supabaseClient;
    }

    async function fetchProfile(defaultProfile) {
        const client = getSupabase();
        if (client) {
            try {
                const { data, error } = await client.from('profiles').select('*').eq('id', 'main').single();
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
                console.warn('Supabase 프로필 연동 실패, 로컬 스토리지 사용:', e);
            }
        }
        const saved = localStorage.getItem('portfolio_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    }

    async function saveProfile(newProfile) {
        localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
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
                console.error('Supabase 프로필 저장 오류:', e);
            }
        }
    }

    async function fetchProjects(defaultProjects) {
        const client = getSupabase();
        if (client) {
            try {
                const { data, error } = await client.from('projects').select('*').order('created_at', { ascending: false });
                if (!error && data && data.length > 0) {
                    let projectsData = data.map(p => ({
                        id: p.id,
                        title: p.id === 'proj-1' ? '🎨 AI 그림해석기' : p.title,
                        category: p.category,
                        desc: p.id === 'proj-1' ? '업로드한 그림을 AI가 다각도로 분석하여 그림의 구도, 색감, 심리적 의미와 따뜻한 해석 피드백을 제공해주는 웹 서비스입니다.' : p.desc,
                        icon: p.id === 'proj-1' ? '🎨' : (p.icon || '🚀'),
                        tools: typeof p.tools === 'string' ? JSON.parse(p.tools) : (p.tools || []),
                        demoUrl: p.id === 'proj-1' ? 'https://ai.studio/apps/76713af6-cd79-4e71-a89a-368b6e751a0e?fullscreenApplet=true' : (p.demo_url || ''),
                        githubUrl: p.github_url || '',
                        prompt: p.prompt,
                        tips: p.tips || ''
                    }));

                    const existingIds = projectsData.map(p => p.id);
                    defaultProjects.forEach(defProj => {
                        if (!existingIds.includes(defProj.id)) {
                            projectsData.push(defProj);
                        }
                    });

                    localStorage.setItem('portfolio_projects', JSON.stringify(projectsData));
                    return projectsData;
                }
            } catch (e) {
                console.warn('Supabase 작업물 연동 실패, 로컬 스토리지 사용:', e);
            }
        }
        const saved = localStorage.getItem('portfolio_projects');
        let projects = saved ? JSON.parse(saved) : defaultProjects;
        projects = projects.map(p => {
            if (p.id === 'proj-1') {
                return {
                    ...p,
                    title: '🎨 AI 그림해석기',
                    icon: '🎨',
                    desc: '업로드한 그림을 AI가 다각도로 분석하여 그림의 구도, 색감, 심리적 의미와 따뜻한 해석 피드백을 제공해주는 웹 서비스입니다.',
                    demoUrl: 'https://ai.studio/apps/76713af6-cd79-4e71-a89a-368b6e751a0e?fullscreenApplet=true'
                };
            }
            return p;
        });

        const existingIds = projects.map(p => p.id);
        defaultProjects.forEach(defProj => {
            if (!existingIds.includes(defProj.id)) {
                projects.push(defProj);
            }
        });

        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        return projects;
    }

    async function saveProject(projectData) {
        const saved = localStorage.getItem('portfolio_projects');
        let projects = saved ? JSON.parse(saved) : [];
        const index = projects.findIndex(p => p.id === projectData.id);
        if (index >= 0) projects[index] = projectData;
        else projects.unshift(projectData);
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));

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
                console.error('Supabase 작업물 저장 오류:', e);
            }
        }
    }

    async function deleteProject(projectId) {
        const saved = localStorage.getItem('portfolio_projects');
        if (saved) {
            const projects = JSON.parse(saved).filter(p => p.id !== projectId);
            localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        }

        const client = getSupabase();
        if (client) {
            try {
                await client.from('projects').delete().eq('id', projectId);
            } catch (e) {
                console.error('Supabase 작업물 삭제 오류:', e);
            }
        }
    }

    // ----------------------------------------------------------------------
    // 2. 기본 시드 데이터
    // ----------------------------------------------------------------------
    const DEFAULT_PROFILE = {
        name: '남진혁',
        title: 'AI 코딩 도구를 활용해 아이디어를 동작하는 시각적 결과물로 구현하고, 수강생들에게 실전 프롬프트와 개발 노하우를 전수합니다.',
        bio: '성인 수강생을 대상으로 AI 기반 웹/앱 개발 교육을 진행하고 있습니다. 복잡한 코딩의 장벽을 넘어, ChatGPT·Claude·Cursor 등 최신 AI 도구를 통해 창의적인 앱을 빠르게 빌드하는 과정을 함께 만들어갑니다.',
        skills: ['ChatGPT-4o', 'Claude 3.5 Sonnet', 'Cursor IDE', 'Midjourney', 'HTML5/CSS3/JS']
    };

    const DEFAULT_PROJECTS = [
        {
            id: 'proj-1',
            title: '🎨 AI 그림해석기',
            category: 'webapp',
            desc: '업로드한 그림을 AI가 다각도로 분석하여 그림의 구도, 색감, 심리적 의미와 따뜻한 해석 피드백을 제공해주는 웹 서비스입니다.',
            icon: '🎨',
            tools: ['Gemini API', 'HTML5', 'Vanilla JS', 'Vision AI'],
            demoUrl: 'https://ai.studio/apps/76713af6-cd79-4e71-a89a-368b6e751a0e?fullscreenApplet=true',
            githubUrl: '',
            prompt: `너는 미술 심리 분석 및 그림 해석 전문가야. 사용자가 업로드한 그림 이미지를 분석하여 그림에 담긴 심리적 신호와 사물의 의미, 따뜻한 피드백 메시지를 작성해줘.`,
            tips: `1. Vision API를 활용하여 이미지 내 요소들을 분석하도록 프롬프트를 구성했습니다.`
        },
        {
            id: 'proj-4',
            title: '✍️ 멋진사인 생성기',
            category: 'tool',
            desc: '이름이나 영문 서명을 입력하면 AI가 멋진 스타일의 캘리그라피 및 개인 서명을 자동으로 추천해주는 디자인 생성 도구입니다.',
            icon: '✍️',
            tools: ['ChatGPT', 'SVG Calligraphy', 'Vanilla JS', 'Canvas'],
            demoUrl: 'https://ai.studio/apps/a7c10ccf-effc-4182-b70e-4c5ffd93c7a6?fullscreenApplet=true',
            githubUrl: '',
            prompt: `너는 서명 및 캘리그라피 디자인 전문가야. 사용자가 입력한 이름이나 닉네임을 바탕으로 품격 있고 인상적인 서명 디자인 스타일 3가지를 추천해줘.`,
            tips: `1. SVG 렌더링 기법을 활용하여 선명한 캘리그라피 스타일 벡터 서명을 생성합니다.`
        },
        {
            id: 'proj-5',
            title: '🎙️ 음성 마음시그널',
            category: 'agent',
            desc: '목소리와 음성 톤을 분석하여 말 속에 담긴 감정 상태와 진심의 시그널을 섬세하게 판별해주는 AI 음성 감정 분석 웹 서비스입니다.',
            icon: '🎙️',
            tools: ['Speech AI', 'Gemini Audio', 'HTML5', 'Web Audio API'],
            demoUrl: 'https://ai.studio/apps/c54323ea-5f95-4e4a-b7e8-1b1dc2124c75?fullscreenApplet=true',
            githubUrl: '',
            prompt: `너는 음성 감정 분석 전문가야. 사용자의 음성 억양과 대화 내용을 바탕으로 감정 상태(기쁨, 불안, 설렘 등)를 분석하고 맞춤형 멘토링 메시지를 전해줘.`,
            tips: `1. Web Audio API로 음성 주파수 데이터를 수집하고 AI 감정 분류 모델과 연동했습니다.`
        },
        {
            id: 'proj-2',
            title: '🤖 스마트 AI 챗봇 & 대시보드',
            category: 'agent',
            desc: '다양한 페르소나의 AI 조력자와 실시간 대화를 나누고 대화 이력을 관리하는 반응형 챗봇 인터페이스입니다.',
            icon: '🤖',
            tools: ['Claude 3.5', 'Cursor IDE', 'LocalStorage'],
            demoUrl: 'https://example.com/ai-chatbot',
            githubUrl: '',
            prompt: `Claude 3.5를 활용해 다크 모드 기반의 AI 챗봇 UI를 작성해줘.`,
            tips: `1. 'content-visibility: auto' 옵션을 사용해 긴 대화 내역도 스크롤이 매끄럽게 동작하도록 최적화했습니다.`
        },
        {
            id: 'proj-3',
            title: '⚡ 프롬프트 제네레이터 & 자동화 툴',
            category: 'tool',
            desc: '원하는 서비스 아이디어만 입력하면 AI가 읽기 좋은 구조화된 PRD와 개발용 시스템 프롬프트를 자동으로 생성해 주는 도구입니다.',
            icon: '⚡',
            tools: ['ChatGPT-4o', 'Tailwind/Vanilla CSS', 'Async/Await JS'],
            demoUrl: 'https://example.com/prompt-gen',
            githubUrl: '',
            prompt: `사용자가 입력한 프로젝트 아이디어를 바탕으로 개발에 필요한 4가지 필수 요소를 자동으로 구조화해주는 프롬프트를 작성해줘.`,
            tips: `1. 토스트 알림을 결합하여 복사 완료 시 시각적 피드백을 제공합니다.`
        }
    ];

    // ----------------------------------------------------------------------
    // 3. UI 컴포넌트 렌더러
    // ----------------------------------------------------------------------
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderAdminHeader() {
        return `
            <div class="container nav-container">
                <a href="index.html" class="nav-logo">
                    <span class="logo-icon"><i class="fa-solid fa-user-shield"></i></span>
                    <span class="logo-text">남진혁<span class="highlight">.AI</span> 관리자 대시보드</span>
                </a>
                <div class="nav-actions">
                    <a href="index.html" class="btn btn-outline" title="포트폴리오 메인으로 이동">
                        <i class="fa-solid fa-globe"></i> 포트폴리오 메인 보기
                    </a>
                    <button id="admin-logout-btn" class="btn btn-danger" title="관리자 세션 종료">
                        <i class="fa-solid fa-right-from-bracket"></i> 로그아웃
                    </button>
                </div>
            </div>
        `;
    }

    function renderAdminStats(projects = []) {
        const totalCount = projects.length;
        const webappCount = projects.filter(p => p.category === 'webapp').length;
        const toolsCount = projects.filter(p => p.category === 'tool' || p.category === 'agent').length;

        return `
            <div class="dashboard-card glass-panel">
                <div class="dashboard-icon"><i class="fa-solid fa-cubes"></i></div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">총 작업물 수</span>
                    <h3 id="stat-total-projects" style="font-size: 1.6rem; color: var(--text-primary);">${totalCount}개</h3>
                </div>
            </div>

            <div class="dashboard-card glass-panel">
                <div class="dashboard-icon" style="background: rgba(139, 92, 246, 0.15); color: var(--accent-purple);"><i class="fa-solid fa-laptop-code"></i></div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">웹 애플리케이션</span>
                    <h3 id="stat-webapp-count" style="font-size: 1.6rem; color: var(--text-primary);">${webappCount}개</h3>
                </div>
            </div>

            <div class="dashboard-card glass-panel">
                <div class="dashboard-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);"><i class="fa-solid fa-robot"></i></div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">자동화 툴 & AI 챗봇</span>
                    <h3 id="stat-tools-count" style="font-size: 1.6rem; color: var(--text-primary);">${toolsCount}개</h3>
                </div>
            </div>

            <div class="dashboard-card glass-panel">
                <div class="dashboard-icon" style="background: rgba(6, 182, 212, 0.15); color: var(--primary-cyan);"><i class="fa-solid fa-database"></i></div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">데이터 저장소</span>
                    <h3 style="font-size: 1.2rem; color: var(--accent-emerald);"><i class="fa-solid fa-cloud"></i> Supabase DB</h3>
                </div>
            </div>
        `;
    }

    function renderAdminProfileForm(profile = {}) {
        const { name = '', title = '', bio = '', skills = [] } = profile;
        const skillsString = (skills || []).join(', ');

        return `
            <div class="glass-panel" style="padding: 2rem;">
                <div class="section-header" style="margin-bottom: 1.5rem;">
                    <div>
                        <span class="section-subtitle">PROFILE SETTINGS</span>
                        <h2 class="section-title"><i class="fa-solid fa-user-gear"></i> 강사 자기소개 및 프로필 편집</h2>
                    </div>
                </div>

                <form id="admin-bio-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="admin-name-input">강사 이름 *</label>
                            <input type="text" id="admin-name-input" value="${escapeHTML(name)}" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-title-input">한 줄 타이트 & 직함 *</label>
                            <input type="text" id="admin-title-input" value="${escapeHTML(title)}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="admin-bio-input">자기소개 상세 본문 (수강생 공개용) *</label>
                        <textarea id="admin-bio-input" rows="4" required>${escapeHTML(bio)}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="admin-skills-input">주요 활용 AI 도구 태그 (쉼표로 구분)</label>
                        <input type="text" id="admin-skills-input" value="${escapeHTML(skillsString)}" placeholder="ChatGPT-4o, Claude 3.5, Cursor, Midjourney, HTML5/CSS3">
                    </div>

                    <div style="text-align: right; margin-top: 1rem;">
                        <button type="submit" class="btn btn-primary glow-btn">
                            <i class="fa-solid fa-floppy-disk"></i> 자기소개 저장하기 (Supabase 연동)
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    function renderAdminProjectsTable(projects = []) {
        const categoryNames = {
            webapp: '웹 애플리케이션',
            tool: '자동화 & 툴',
            agent: 'AI 챗봇/에이전트'
        };

        let rowsHtml = '';
        if (projects.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        등록된 작업물이 없습니다. [+ 새 작업물 등록] 버튼을 눌러 등록해주세요.
                    </td>
                </tr>
            `;
        } else {
            rowsHtml = projects.map(proj => `
                <tr>
                    <td style="font-size: 1.5rem; text-align: center;">${proj.icon || '🚀'}</td>
                    <td style="font-weight: 600; color: var(--text-primary);">${escapeHTML(proj.title)}</td>
                    <td><span class="badge glow-badge">${categoryNames[proj.category] || proj.category}</span></td>
                    <td>${(proj.tools || []).map(t => `<span class="skill-tag" style="margin-right: 0.3rem;">#${escapeHTML(t)}</span>`).join('')}</td>
                    <td>
                        ${proj.demoUrl ? `<a href="${escapeHTML(proj.demoUrl)}" target="_blank" class="btn btn-sm btn-ghost" style="color: var(--primary-cyan);"><i class="fa-solid fa-arrow-up-right-from-square"></i> 보기</a>` : '-'}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline edit-admin-proj-btn" data-id="${proj.id}"><i class="fa-solid fa-pen"></i> 수정</button>
                        <button class="btn btn-sm btn-danger delete-admin-proj-btn" data-id="${proj.id}"><i class="fa-solid fa-trash"></i> 삭제</button>
                    </td>
                </tr>
            `).join('');
        }

        return `
            <div class="glass-panel" style="padding: 2rem;">
                <div class="section-header" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <span class="section-subtitle">PROJECTS MANAGER</span>
                        <h2 class="section-title"><i class="fa-solid fa-folder-open"></i> AI 작업물 목록 & CRUD 관리</h2>
                    </div>

                    <div style="display: flex; gap: 0.8rem;">
                        <button id="admin-reset-data-btn" class="btn btn-outline" style="border-color: #f59e0b; color: #fcd34d;">
                            <i class="fa-solid fa-rotate-left"></i> 기초 데이터로 리셋
                        </button>
                        <button id="admin-add-proj-btn" class="btn btn-primary glow-btn">
                            <i class="fa-solid fa-plus"></i> 새 작업물 등록
                        </button>
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>아이콘</th>
                                <th>프로젝트 제목</th>
                                <th>카테고리</th>
                                <th>사용 기술/도구 태그</th>
                                <th>라이브 데모</th>
                                <th>관리 액션</th>
                            </tr>
                        </thead>
                        <tbody id="admin-projects-tbody">
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderModals() {
        return `
            <dialog id="project-modal" class="custom-modal">
                <div class="modal-content glass-panel modal-lg">
                    <div class="modal-header">
                        <h3 id="project-modal-title"><i class="fa-solid fa-folder-plus"></i> 작업물 추가</h3>
                        <button class="close-modal-btn" data-close="project-modal"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="project-form">
                            <input type="hidden" id="project-id-input">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="proj-title-input">프로젝트 제목 *</label>
                                    <input type="text" id="proj-title-input" required placeholder="예: ✍️ 멋진사인 생성기">
                                </div>
                                <div class="form-group">
                                    <label for="proj-category-select">카테고리 *</label>
                                    <select id="proj-category-select" required>
                                        <option value="webapp">웹 애플리케이션</option>
                                        <option value="tool">자동화 & 툴</option>
                                        <option value="agent">AI 챗봇/에이전트</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="proj-desc-input">프로젝트 한 줄 요약 *</label>
                                <input type="text" id="proj-desc-input" required placeholder="예: 이름이나 영문 서명을 입력하면 AI가 멋진 스타일의 서명을 자동 생성해줍니다.">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="proj-icon-input">아이콘/이모지</label>
                                    <input type="text" id="proj-icon-input" placeholder="✍️ 또는 🎙️">
                                </div>
                                <div class="form-group">
                                    <label for="proj-tools-input">사용 AI/기술 태그 (쉼표 구분)</label>
                                    <input type="text" id="proj-tools-input" placeholder="ChatGPT, SVG, Canvas, Speech AI">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="proj-demo-input">라이브 데모 URL</label>
                                    <input type="url" id="proj-demo-input" placeholder="https://ai.studio/apps/...">
                                </div>
                                <div class="form-group">
                                    <label for="proj-github-input">GitHub 코드 URL</label>
                                    <input type="url" id="proj-github-input" placeholder="https://github.com/...">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="proj-prompt-input">핵심 AI 프롬프트 원문 (수강생 공유용) *</label>
                                <textarea id="proj-prompt-input" rows="4" required placeholder="AI에게 전달한 실제 프롬프트 명령어를 작성해주세요."></textarea>
                            </div>

                            <div class="form-group">
                                <label for="proj-tips-input">제작 노하우 및 구현 팁</label>
                                <textarea id="proj-tips-input" rows="3" placeholder="수강생들에게 도움되는 실전 개발 노하우나 주의사항을 적어주세요."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal-btn" data-close="project-modal">취소</button>
                        <button id="save-project-btn" class="btn btn-primary">저장하기</button>
                    </div>
                </div>
            </dialog>
        `;
    }

    function showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} glass-panel`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ----------------------------------------------------------------------
    // 4. 관리자 메인 상태 및 컨트롤러
    // ----------------------------------------------------------------------
    class AdminApp {
        constructor() {
            this.checkAuth();
            this.profile = { ...DEFAULT_PROFILE };
            this.projects = [ ...DEFAULT_PROJECTS ];
        }

        checkAuth() {
            const isAdmin = localStorage.getItem('portfolio_is_admin') === 'true';
            if (!isAdmin) {
                alert('🔒 관리자 권한이 필요합니다. 먼저 메인 페이지에서 관리자 로그인을 해주세요.');
                window.location.href = 'index.html';
            }
        }

        async init() {
            this.profile = await fetchProfile(DEFAULT_PROFILE);
            this.projects = await fetchProjects(DEFAULT_PROJECTS);
            this.mountAll();
            this.bindEvents();
        }

        logout() {
            localStorage.setItem('portfolio_is_admin', 'false');
            window.location.href = 'index.html';
        }

        mountAll() {
            const headerEl = document.getElementById('admin-header');
            if (headerEl) headerEl.innerHTML = renderAdminHeader();

            const statsEl = document.getElementById('admin-stats');
            if (statsEl) statsEl.innerHTML = renderAdminStats(this.projects);

            const profileEl = document.getElementById('admin-profile-section');
            if (profileEl) profileEl.innerHTML = renderAdminProfileForm(this.profile);

            const projectsEl = document.getElementById('admin-projects-section');
            if (projectsEl) projectsEl.innerHTML = renderAdminProjectsTable(this.projects);

            let modalHolder = document.getElementById('modal-container');
            if (!modalHolder) {
                modalHolder = document.createElement('div');
                modalHolder.id = 'modal-container';
                document.body.appendChild(modalHolder);
            }
            modalHolder.innerHTML = renderModals();
        }

        bindEvents() {
            document.body.addEventListener('click', (e) => {
                if (e.target.closest('#admin-logout-btn')) {
                    if (confirm('관리자 대시보드에서 로그아웃 하시겠습니까?')) {
                        this.logout();
                    }
                }
            });

            document.body.addEventListener('submit', async (e) => {
                if (e.target.id === 'admin-bio-form') {
                    e.preventDefault();
                    const name = document.getElementById('admin-name-input').value.trim();
                    const title = document.getElementById('admin-title-input').value.trim();
                    const bio = document.getElementById('admin-bio-input').value.trim();
                    const skillsRaw = document.getElementById('admin-skills-input').value;
                    const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

                    const newProfile = { name, title, bio, skills };
                    this.profile = newProfile;
                    await saveProfile(newProfile);
                    this.mountAll();
                    showToast('☁️ Supabase DB & 로컬스토리지에 자기소개가 저장되었습니다!', 'success');
                }
            });

            document.body.addEventListener('click', (e) => {
                if (e.target.closest('#admin-add-proj-btn')) {
                    openProjectForm();
                }
            });

            document.body.addEventListener('click', async (e) => {
                if (e.target.closest('#admin-reset-data-btn')) {
                    if (confirm('정말로 모든 데이터를 기초 시드 데이터로 복원하시겠습니까?')) {
                        await saveProfile(DEFAULT_PROFILE);
                        for (const p of DEFAULT_PROJECTS) await saveProject(p);
                        this.profile = DEFAULT_PROFILE;
                        this.projects = DEFAULT_PROJECTS;
                        this.mountAll();
                        showToast('🔄 데이터가 기초 시드 상태로 복원되었습니다.', 'success');
                    }
                }
            });

            document.body.addEventListener('click', async (e) => {
                const editBtn = e.target.closest('.edit-admin-proj-btn');
                const deleteBtn = e.target.closest('.delete-admin-proj-btn');

                if (editBtn) {
                    const id = editBtn.getAttribute('data-id');
                    const proj = this.projects.find(p => p.id === id);
                    if (proj) openProjectForm(proj);
                } else if (deleteBtn) {
                    const id = deleteBtn.getAttribute('data-id');
                    if (confirm('정말로 이 작업물을 삭제하시겠습니까?')) {
                        await deleteProject(id);
                        this.projects = this.projects.filter(p => p.id !== id);
                        this.mountAll();
                        showToast('☁️ Supabase DB에서 작업물이 삭제되었습니다.', 'success');
                    }
                }
            });

            document.body.addEventListener('click', async (e) => {
                if (e.target.id === 'save-project-btn') {
                    const id = document.getElementById('project-id-input').value || `proj-${Date.now()}`;
                    const title = document.getElementById('proj-title-input').value.trim();
                    const category = document.getElementById('proj-category-select').value;
                    const desc = document.getElementById('proj-desc-input').value.trim();
                    const icon = document.getElementById('proj-icon-input').value.trim() || '🚀';
                    const toolsRaw = document.getElementById('proj-tools-input').value;
                    const tools = toolsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
                    const demoUrl = document.getElementById('proj-demo-input').value.trim();
                    const githubUrl = document.getElementById('proj-github-input').value.trim();
                    const prompt = document.getElementById('proj-prompt-input').value.trim();
                    const tips = document.getElementById('proj-tips-input').value.trim();

                    if (!title || !desc || !prompt) {
                        alert('제목, 요약 설명, AI 프롬프트는 필수 입력 항목입니다.');
                        return;
                    }

                    const projectData = { id, title, category, desc, icon, tools, demoUrl, githubUrl, prompt, tips };
                    await saveProject(projectData);

                    const existingIndex = this.projects.findIndex(p => p.id === id);
                    if (existingIndex >= 0) this.projects[existingIndex] = projectData;
                    else this.projects.unshift(projectData);

                    closeModal('project-modal');
                    this.mountAll();
                    showToast('☁️ Supabase DB & 로컬스토리지에 작업물이 저장되었습니다!', 'success');
                }
            });

            document.body.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('.close-modal-btn');
                if (closeBtn) {
                    const modalId = closeBtn.getAttribute('data-close');
                    if (modalId) closeModal(modalId);
                }
            });
        }
    }

    function openProjectForm(proj = null) {
        const isEdit = !!proj;
        document.getElementById('project-modal-title').innerHTML = isEdit 
            ? '<i class="fa-solid fa-pen-to-square"></i> 작업물 수정' 
            : '<i class="fa-solid fa-folder-plus"></i> 새 작업물 추가';

        document.getElementById('project-id-input').value = isEdit ? proj.id : '';
        document.getElementById('proj-title-input').value = isEdit ? proj.title : '';
        document.getElementById('proj-category-select').value = isEdit ? proj.category : 'webapp';
        document.getElementById('proj-desc-input').value = isEdit ? proj.desc : '';
        document.getElementById('proj-icon-input').value = isEdit ? proj.icon : '';
        document.getElementById('proj-tools-input').value = isEdit ? (proj.tools || []).join(', ') : '';
        document.getElementById('proj-demo-input').value = isEdit ? proj.demoUrl || '' : '';
        document.getElementById('proj-github-input').value = isEdit ? proj.githubUrl || '' : '';
        document.getElementById('proj-prompt-input').value = isEdit ? proj.prompt : '';
        document.getElementById('proj-tips-input').value = isEdit ? proj.tips || '' : '';

        showModal('project-modal');
    }

    function showModal(id) {
        const modal = document.getElementById(id);
        if (modal && typeof modal.showModal === 'function') modal.showModal();
        else if (modal) modal.setAttribute('open', 'true');
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal && typeof modal.close === 'function') modal.close();
        else if (modal) modal.removeAttribute('open');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const adminApp = new AdminApp();
        adminApp.init();
    });
})();

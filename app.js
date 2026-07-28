/**
 * ==========================================================================
 * [메인 통합 컨트롤러] app.js - file:// 프로토콜 및 웹 서버 겸용 스크립트
 * ==========================================================================
 * 역할: CORS 제약이 발생하는 file:// 환경에서도 100% 호환되도록 구성된 독립형 메인 로직.
 * Supabase DB & LocalStorage 동기화, UI 컴포넌트 마운트 및 관리자 인증 관리.
 */

(function() {
    // ----------------------------------------------------------------------
    // 1. Supabase 접속 설정 & 데이터 클라이언트
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

    // 프로필 데이터 수신
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
                console.warn('Supabase 프로필 연동 실패, 로컬 스토리지 데이터 사용:', e);
            }
        }
        const saved = localStorage.getItem('portfolio_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    }

    // 작업물 데이터 수신 및 업데이트
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

                    // 신규 항목(proj-4, proj-5)이 없을 경우 병합
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
                console.warn('Supabase 작업물 연동 실패, 로컬 스토리지 데이터 사용:', e);
            }
        }
        const saved = localStorage.getItem('portfolio_projects');
        let projects = saved ? JSON.parse(saved) : defaultProjects;
        
        // proj-1 최신화 조치
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

        // proj-4, proj-5 병합 체크
        const existingIds = projects.map(p => p.id);
        defaultProjects.forEach(defProj => {
            if (!existingIds.includes(defProj.id)) {
                projects.push(defProj);
            }
        });

        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        return projects;
    }

    // ----------------------------------------------------------------------
    // 2. 초기 시드 데이터 (신규 proj-4, proj-5 포함)
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
    // 3. UI 렌더링 컴포넌트 함수들
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

    function renderNavbar(isAdmin) {
        return `
            <div class="container nav-container">
                <a href="#" class="nav-logo">
                    <span class="logo-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
                    <span class="logo-text">남진혁<span class="highlight">.AI</span></span>
                </a>
                
                <nav class="nav-links">
                    <a href="#about" class="nav-link active">강사 소개</a>
                    <a href="#projects" class="nav-link">AI 작업물</a>
                    <a href="#guide" class="nav-link">수강생 가이드</a>
                    <a href="#contact" class="nav-link">문의하기</a>
                </nav>

                <div class="nav-actions">
                    ${isAdmin ? `
                        <a href="admin.html" class="btn btn-primary glow-btn" title="전용 관리자 대시보드로 이동">
                            <i class="fa-solid fa-user-shield"></i> 관리자 대시보드
                        </a>
                        <button id="admin-toggle-btn" class="btn btn-outline admin-btn unlocked" title="관리자 로그아웃">
                            <i class="fa-solid fa-lock-open"></i> 로그아웃
                        </button>
                    ` : `
                        <button id="admin-toggle-btn" class="btn btn-outline admin-btn" title="관리자 로그인">
                            <i class="fa-solid fa-lock" id="admin-lock-icon"></i>
                            <span id="admin-btn-text">관리자 로그인</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    function renderHero(profile, isAdmin, projectCount) {
        const { name, title, bio, skills = [] } = profile;
        const skillsHtml = skills.map(skill => `
            <span class="skill-tag"><i class="fa-solid fa-sparkles"></i> ${escapeHTML(skill)}</span>
        `).join('');

        return `
            <div class="container">
                <div class="hero-card glass-panel">
                    <!-- 좌측 메인 텍스트 정보 -->
                    <div class="hero-content">
                        <div class="badge-container">
                            <span class="badge glow-badge">
                                <i class="fa-solid fa-sparkles"></i> AI로 만드는 미래 웹 & 앱
                            </span>
                            ${isAdmin ? `
                                <span id="admin-status-tag" class="badge admin-status-badge">
                                    <i class="fa-solid fa-user-shield"></i> 관리자 로그인 중
                                </span>
                            ` : ''}
                        </div>
                        
                        <h1 class="hero-title">
                            안녕하세요, <br>AI 크리에이터 <span class="gradient-text" id="display-name">${escapeHTML(name)}</span>입니다.
                        </h1>

                        <p class="hero-subtitle" id="display-title">
                            ${escapeHTML(title)}
                        </p>

                        <!-- 자기소개 박스 -->
                        <div class="bio-box">
                            <div class="bio-header">
                                <h3><i class="fa-solid fa-user-gear"></i> 자기소개</h3>
                            </div>
                            <p class="bio-text" id="display-bio">${escapeHTML(bio)}</p>
                        </div>

                        <!-- 기술 및 AI 도구 태그 칩 -->
                        <div class="skills-wrapper">
                            <span class="skills-label">주요 활용 AI 도구:</span>
                            <div class="skills-tags" id="display-skills">
                                ${skillsHtml}
                            </div>
                        </div>

                        <!-- 행동 유도 (CTA) 버튼 -->
                        <div class="hero-actions">
                            <a href="#projects" class="btn btn-primary glow-btn">
                                <i class="fa-solid fa-cubes"></i> 작업물 둘러보기 (${projectCount}개)
                            </a>
                            <a href="#guide" class="btn btn-secondary">
                                <i class="fa-solid fa-graduation-cap"></i> 수강생 학습 팁
                            </a>
                        </div>
                    </div>

                    <!-- 우측 비주얼 프로필 & 통계 카드 -->
                    <div class="hero-visual">
                        <div class="avatar-frame">
                            <div class="avatar-glow"></div>
                            <div class="avatar-inner">
                                <i class="fa-solid fa-laptop-code avatar-icon"></i>
                            </div>
                        </div>
                        <div class="stat-grid">
                            <div class="stat-card">
                                <span class="stat-num" id="stat-count">${projectCount}+</span>
                                <span class="stat-label">AI 프로젝트</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-num">100%</span>
                                <span class="stat-label">실전 프롬프트 공개</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderProjectCard(project) {
        const { id, title, category, desc, icon, tools = [], demoUrl } = project;
        const toolTagsHtml = tools.map(tool => `<span class="skill-tag">#${escapeHTML(tool)}</span>`).join('');

        return `
            <div class="project-card glass-panel" data-id="${id}" data-category="${category}">
                <div class="card-header">
                    <div class="card-icon">${icon || '🚀'}</div>
                    <span class="badge category-badge">${category}</span>
                </div>
                
                <h3 class="card-title">${escapeHTML(title)}</h3>
                <p class="card-desc">${escapeHTML(desc)}</p>

                <div class="card-tools">
                    ${toolTagsHtml}
                </div>

                <div class="card-actions">
                    ${demoUrl ? `
                        <a href="${escapeHTML(demoUrl)}" target="_blank" class="btn btn-sm btn-outline">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> 라이브 데모
                        </a>
                    ` : ''}
                    <button class="btn btn-sm btn-primary view-prompt-btn" data-id="${id}">
                        <i class="fa-solid fa-lightbulb"></i> AI 프롬프트 & 팁
                    </button>
                </div>
            </div>
        `;
    }

    function renderProjectGrid(projects, currentFilter = 'all') {
        const filteredProjects = currentFilter === 'all' 
            ? projects 
            : projects.filter(p => p.category === currentFilter);

        const cardsHtml = filteredProjects.length > 0 
            ? filteredProjects.map(proj => renderProjectCard(proj)).join('')
            : `<div class="empty-state">해당 카테고리의 작업물이 없습니다.</div>`;

        return `
            <div class="container">
                <div class="section-header">
                    <div>
                        <span class="section-subtitle">AI SHOWCASE</span>
                        <h2 class="section-title"><i class="fa-solid fa-laptop-code"></i> AI로 제작한 웹 & 앱 작업물</h2>
                    </div>
                </div>

                <div class="filter-tabs">
                    <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-category="all">전체보기 (${projects.length})</button>
                    <button class="filter-btn ${currentFilter === 'webapp' ? 'active' : ''}" data-category="webapp">웹 애플리케이션</button>
                    <button class="filter-btn ${currentFilter === 'tool' ? 'active' : ''}" data-category="tool">자동화 & 툴</button>
                    <button class="filter-btn ${currentFilter === 'agent' ? 'active' : ''}" data-category="agent">AI 챗봇/에이전트</button>
                </div>

                <div class="projects-grid">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    function renderGuideSection() {
        return `
            <div class="container">
                <div class="section-header">
                    <div>
                        <span class="section-subtitle">FOR STUDENTS</span>
                        <h2 class="section-title"><i class="fa-solid fa-graduation-cap"></i> 수강생을 위한 AI 학습 가이드</h2>
                    </div>
                </div>

                <div class="guide-grid">
                    <div class="guide-card glass-panel">
                        <div class="guide-icon guide-icon-cyan">
                            <i class="fa-solid fa-copy"></i>
                        </div>
                        <h3>1. 프롬프트 복사 & 활용</h3>
                        <p>각 작업물 카드의 [AI 프롬프트 & 팁] 버튼을 누르면 제가 AI에게 직접 입력했던 시스템 프롬프트 원문을 복사할 수 있습니다.</p>
                    </div>

                    <div class="guide-card glass-panel">
                        <div class="guide-icon guide-icon-purple">
                            <i class="fa-solid fa-lightbulb"></i>
                        </div>
                        <h3>2. 제작 노하우 습득</h3>
                        <p>애니메이션, 상태 관리, 챗봇 대화 기록 저장 등 구현 과정에서 마주친 트러블슈팅과 꿀팁을 함께 제공합니다.</p>
                    </div>

                    <div class="guide-card glass-panel">
                        <div class="guide-icon guide-icon-emerald">
                            <i class="fa-solid fa-rocket"></i>
                        </div>
                        <h3>3. 실전 아이디어 구현</h3>
                        <p>강의에서 배운 AI 코딩 기법을 바탕으로 나만의 독창적인 웹사이트와 포트폴리오를 빠르게 구축해 보세요.</p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderContactSection() {
        return `
            <div class="container">
                <div class="section-header">
                    <div>
                        <span class="section-subtitle">GET IN TOUCH</span>
                        <h2 class="section-title"><i class="fa-solid fa-paper-plane"></i> 강사에게 문의 및 메시지 남기기</h2>
                    </div>
                </div>

                <div class="contact-grid">
                    <div class="contact-info-card glass-panel">
                        <div class="contact-info-header">
                            <div class="contact-avatar-icon">
                                <i class="fa-solid fa-envelope-open-text"></i>
                            </div>
                            <h3>궁금한 점이 있거나<br>협업을 제안하고 싶으신가요?</h3>
                        </div>
                        <p class="contact-info-desc">
                            AI 코딩 강의 문의, 프로젝트 협업, 피드백 등 어떤 내용이든 자유롭게 메시지를 남겨주세요. 
                            확인 후 빠른 시일 내에 답변드리겠습니다.
                        </p>

                        <div class="contact-details">
                            <div class="contact-detail-item">
                                <div class="detail-icon"><i class="fa-solid fa-at"></i></div>
                                <div>
                                    <span class="detail-label">이메일 주소</span>
                                    <span class="detail-value">skawlsgur@gmail.com</span>
                                </div>
                            </div>
                            <div class="contact-detail-item">
                                <div class="detail-icon"><i class="fa-solid fa-clock"></i></div>
                                <div>
                                    <span class="detail-label">답변 예상 시간</span>
                                    <span class="detail-value">평일 기준 24시간 이내</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="contact-form-card glass-panel">
                        <form id="contact-form" class="contact-form">
                            <div class="form-group">
                                <label for="contact-name"><i class="fa-solid fa-user"></i> 성함 / 닉네임 <span class="required">*</span></label>
                                <input type="text" id="contact-name" name="name" class="form-input" placeholder="성함이나 닉네임을 입력해 주세요" required>
                            </div>

                            <div class="form-group">
                                <label for="contact-email"><i class="fa-solid fa-envelope"></i> 회신받으실 이메일 주소 <span class="required">*</span></label>
                                <input type="email" id="contact-email" name="email" class="form-input" placeholder="example@email.com" required>
                            </div>

                            <div class="form-group">
                                <label for="contact-message"><i class="fa-solid fa-comment-dots"></i> 문의 및 메시지 내용 <span class="required">*</span></label>
                                <textarea id="contact-message" name="message" class="form-textarea" rows="5" placeholder="궁금하신 내용이나 피드백을 자유롭게 작성해 주세요." required></textarea>
                            </div>

                            <button type="submit" id="submit-contact-btn" class="btn btn-primary glow-btn btn-lg btn-full">
                                <i class="fa-solid fa-paper-plane" id="contact-btn-icon"></i>
                                <span id="contact-btn-text">이메일 보내기</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    function renderModals() {
        return `
            <!-- 1. 관리자 인증 모달 -->
            <dialog id="auth-modal" class="custom-modal">
                <div class="modal-content glass-panel">
                    <div class="modal-header">
                        <h3><i class="fa-solid fa-shield-halved"></i> 관리자 로그인 인증</h3>
                        <button class="close-modal-btn" data-close="auth-modal"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-desc">자기소개 및 작업물 관리를 위해 비밀번호를 입력해주세요. (기본 PIN: 1234)</p>
                        <div class="form-group">
                            <label for="admin-pass-input">비밀번호 입력</label>
                            <input type="password" id="admin-pass-input" placeholder="비밀번호 4자리" autofocus>
                        </div>
                        <p id="auth-error-msg" class="error-msg"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal-btn" data-close="auth-modal">취소</button>
                        <button id="submit-auth-btn" class="btn btn-primary">확인</button>
                    </div>
                </div>
            </dialog>

            <!-- 2. AI 프롬프트 & 팁 모달 -->
            <dialog id="prompt-modal" class="custom-modal">
                <div class="modal-content glass-panel modal-lg">
                    <div class="modal-header">
                        <h3 id="view-project-title"><i class="fa-solid fa-lightbulb"></i> AI 프롬프트 & 제작 팁</h3>
                        <button class="close-modal-btn" data-close="prompt-modal"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="prompt-box-section">
                            <h4 class="box-title"><i class="fa-solid fa-terminal"></i> 사용된 AI 프롬프트 원문:</h4>
                            <pre id="view-project-prompt" class="code-block"></pre>
                            <button id="copy-prompt-btn" class="btn btn-sm btn-outline"><i class="fa-solid fa-copy"></i> 프롬프트 원클릭 복사</button>
                        </div>
                        <div class="tips-box-section">
                            <h4 class="box-title"><i class="fa-solid fa-circle-info"></i> 강사 제작 노하우 & 팁:</h4>
                            <p id="view-project-tips" class="tips-text"></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary close-modal-btn" data-close="prompt-modal">닫기</button>
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
    // 4. 메인 상태 관리 클래스
    // ----------------------------------------------------------------------
    class PortfolioApp {
        constructor() {
            this.profile = { ...DEFAULT_PROFILE };
            this.projects = [ ...DEFAULT_PROJECTS ];
            this.isAdmin = localStorage.getItem('portfolio_is_admin') === 'true';
            this.currentFilter = 'all';
            this.adminPassword = '1234';
        }

        async init() {
            this.profile = await fetchProfile(DEFAULT_PROFILE);
            this.projects = await fetchProjects(DEFAULT_PROJECTS);
            this.mountAll();
            this.bindEvents();
        }

        setAdminState(isAdmin) {
            this.isAdmin = isAdmin;
            localStorage.setItem('portfolio_is_admin', isAdmin ? 'true' : 'false');
        }

        mountAll() {
            const navbarEl = document.getElementById('navbar');
            if (navbarEl) navbarEl.innerHTML = renderNavbar(this.isAdmin);

            const heroEl = document.getElementById('about');
            if (heroEl) heroEl.innerHTML = renderHero(this.profile, this.isAdmin, this.projects.length);

            const projectsEl = document.getElementById('projects');
            if (projectsEl) projectsEl.innerHTML = renderProjectGrid(this.projects, this.currentFilter);

            const guideEl = document.getElementById('guide');
            if (guideEl) guideEl.innerHTML = renderGuideSection();

            const contactEl = document.getElementById('contact');
            if (contactEl) contactEl.innerHTML = renderContactSection();

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
                const adminBtn = e.target.closest('#admin-toggle-btn');
                if (adminBtn) {
                    e.preventDefault();
                    if (this.isAdmin) {
                        this.setAdminState(false);
                        this.mountAll();
                        showToast('관리자 세션이 종료되었습니다.', 'success');
                    } else {
                        document.getElementById('admin-pass-input').value = '';
                        document.getElementById('auth-error-msg').textContent = '';
                        showModal('auth-modal');
                    }
                }
            });

            document.body.addEventListener('click', (e) => {
                if (e.target.id === 'submit-auth-btn') {
                    const inputPass = document.getElementById('admin-pass-input').value;
                    if (inputPass === this.adminPassword) {
                        this.setAdminState(true);
                        closeModal('auth-modal');
                        showToast('🔑 인증 성공! 전용 관리자 대시보드로 이동합니다...', 'success');
                        setTimeout(() => {
                            window.location.href = 'admin.html';
                        }, 800);
                    } else {
                        document.getElementById('auth-error-msg').textContent = '비밀번호가 올바르지 않습니다. (기본: 1234)';
                    }
                }
            });

            document.body.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('.close-modal-btn');
                if (closeBtn) {
                    const modalId = closeBtn.getAttribute('data-close');
                    if (modalId) closeModal(modalId);
                }
            });

            document.body.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.currentFilter = e.target.getAttribute('data-category');
                    this.mountAll();
                }
            });

            document.body.addEventListener('click', (e) => {
                const promptBtn = e.target.closest('.view-prompt-btn');
                if (promptBtn) {
                    const id = promptBtn.getAttribute('data-id');
                    const proj = this.projects.find(p => p.id === id);
                    if (proj) {
                        document.getElementById('view-project-title').innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${escapeHTML(proj.title)}`;
                        document.getElementById('view-project-prompt').textContent = proj.prompt || '프롬프트 정보가 없습니다.';
                        document.getElementById('view-project-tips').textContent = proj.tips || '제작 노하우 팁이 작성되지 않았습니다.';
                        showModal('prompt-modal');
                    }
                }
            });

            document.body.addEventListener('click', (e) => {
                if (e.target.closest('#copy-prompt-btn')) {
                    const promptText = document.getElementById('view-project-prompt').textContent;
                    navigator.clipboard.writeText(promptText).then(() => {
                        showToast('📋 AI 프롬프트가 클립보드에 복사되었습니다!', 'success');
                    }).catch(() => {
                        showToast('복사에 실패했습니다.', 'error');
                    });
                }
            });

            // Contact Form EmailJS 제출 이벤트
            document.body.addEventListener('submit', async (e) => {
                if (e.target && e.target.id === 'contact-form') {
                    e.preventDefault();
                    const submitBtn = document.getElementById('submit-contact-btn');
                    const btnIcon = document.getElementById('contact-btn-icon');
                    const btnText = document.getElementById('contact-btn-text');

                    const nameInput = document.getElementById('contact-name');
                    const emailInput = document.getElementById('contact-email');
                    const messageInput = document.getElementById('contact-message');

                    const name = nameInput.value.trim();
                    const email = emailInput.value.trim();
                    const message = messageInput.value.trim();

                    if (!name || !email || !message) {
                        showToast('모든 필수 항목을 입력해주세요.', 'error');
                        return;
                    }

                    // 로딩 상태 시작
                    submitBtn.disabled = true;
                    if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';
                    if (btnText) btnText.textContent = '메시지 전송 중...';

                    try {
                        // EmailJS 전송 (ServiceID: service_dndsyym, TemplateID: template_qdrhf3u)
                        if (window.emailjs && typeof window.emailjs.send === 'function') {
                            await window.emailjs.send('service_dndsyym', 'template_qdrhf3u', {
                                name: name,
                                email: email,
                                message: message
                            }, 'template_qdrhf3u');
                        } else {
                            throw new Error('EmailJS SDK가 로드되지 않았습니다.');
                        }

                        showToast('📧 메시지가 성공적으로 전송되었습니다!', 'success');
                        e.target.reset();
                    } catch (err) {
                        console.error('EmailJS 전송 실패:', err);
                        showToast('메시지 전송 실패: ' + (err.text || err.message || '다시 시도해 주세요.'), 'error');
                    } finally {
                        submitBtn.disabled = false;
                        if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
                        if (btnText) btnText.textContent = '이메일 보내기';
                    }
                }
            });
        }
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
        const app = new PortfolioApp();
        app.init();
    });
})();

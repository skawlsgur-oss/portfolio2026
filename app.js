/**
 * ==========================================================================
 * [메인 컨트롤러] app.js - 모듈화된 컴포넌트 통합 및 상태 관리
 * ==========================================================================
 * 역할: 데이터 바인딩, 컴포넌트 렌더링 동기화, 사용자 모달 및 이벤트 핸들러 바인딩
 */

import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderProjectGrid } from './components/ProjectGrid.js';
import { renderGuideSection } from './components/GuideSection.js';
import { renderModals } from './components/Modals.js';
import { showToast } from './components/Toast.js';

// 기본 시드 데이터 (초기 상태일 때 LocalStorage에 자동 저장됨)
const DEFAULT_PROFILE = {
    name: '남진혁',
    title: 'AI 코딩 도구를 활용해 아이디어를 동작하는 시각적 결과물로 구현하고, 수강생들에게 실전 프롬프트와 개발 노하우를 전수합니다.',
    bio: '성인 수강생을 대상으로 AI 기반 웹/앱 개발 교육을 진행하고 있습니다. 복잡한 코딩의 장벽을 넘어, ChatGPT·Claude·Cursor 등 최신 AI 도구를 통해 창의적인 앱을 빠르게 빌드하는 프롬프트 엔지니어링 및 프론트엔드 실습 과정을 함께 만들어갑니다.',
    skills: ['ChatGPT-4o', 'Claude 3.5 Sonnet', 'Cursor IDE', 'Midjourney', 'HTML5/CSS3/JS', 'Glassmorphism UI']
};

const DEFAULT_PROJECTS = [
    {
        id: 'proj-1',
        title: '🥠 AI 포춘쿠키 & 오늘의 운세 웹앱',
        category: 'webapp',
        desc: '클릭하면 쿠키가 깨지는 입체 애니메이션과 함께 AI가 생성한 오늘의 힐링 메시지와 맞춤 운세를 전해주는 웹 애플리케이션입니다.',
        icon: '🥠',
        tools: ['ChatGPT', 'HTML5', 'Vanilla JS', 'CSS3 Animations'],
        demoUrl: 'https://example.com/fortune-cookie',
        githubUrl: 'https://github.com/...',
        prompt: `너는 운세 및 힐링 메시지 전문가야. 
[요구사항]
- 사용자가 포춘쿠키를 클릭하면 부드럽게 쿠키가 두 조각으로 갈라지는 애니메이션을 보여줘.
- 클릭 후 오늘의 맞춤 힐링 문구(2~3문장)와 행운의 아이템, 행운의 색상을 임의로 생성해서 카드 형태로 띄워줘.
- 디자인은 글래스모피즘 스타일과 따뜻한 밤하늘 분위기(Dark Theme)로 만들어줘.`,
        tips: `1. CSS Keyframes 애니메이션을 활용하여 쿠키가 중앙에서 좌우로 각각 -30px, 30px 이동하며 opacity가 줄어드는 효과를 구현했습니다.
2. Math.random()을 사용하여 사전 정의된 힐링 문구 중 하나를 추출하는 로직을 사용해 빠른 반응성을 확보했습니다.`
    },
    {
        id: 'proj-2',
        title: '🤖 스마트 AI 챗봇 & 대시보드',
        category: 'agent',
        desc: '다양한 페르소나의 AI 조력자와 실시간 대화를 나누고 대화 이력을 카테고리별로 관리하는 반응형 챗봇 인터페이스입니다.',
        icon: '🤖',
        tools: ['Claude 3.5', 'Cursor IDE', 'Web Speech API', 'LocalStorage'],
        demoUrl: 'https://example.com/ai-chatbot',
        githubUrl: 'https://github.com/...',
        prompt: `Claude 3.5를 활용해 다크 모드 기반의 AI 챗봇 UI를 작성해줘.
[기능 요구사항]
- 좌측 사이드바: 대화목록 및 페르소나 선택 (기획 전문가, 코딩 조교, 번역기)
- 우측 메인: 채팅 메시지 창 및 입력 폼
- 마크다운 파싱 및 코드 블록 복사 기능 포함`,
        tips: `1. UI 구현 시 'content-visibility: auto' 옵션을 활용하여 긴 채팅 기록도 가볍게 스크롤되도록 최적화했습니다.
2. 수강생들이 생성된 코드를 즉시 복사할 수 있도록 원클릭 복사 버튼을 내장했습니다.`
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
        prompt: `사용자가 입력한 프로젝트 아이디어를 바탕으로 개발에 필요한 4가지 필수 요소를 자동으로 구조화해주는 프롬프트를 작성해줘:
1. 서비스 명칭 및 한 줄 요약
2. 핵심 기능 목록 (Priority 1, 2, 3)
3. 추천 기술 스택 및 데이터 흐름
4. Cursor/ChatGPT 입력용 System Prompt`,
        tips: `1. 토스트 알림을 결합하여 복사 완료 시 시각적 피드백을 제공하는 것이 사용자 경험 개선에 매우 효과적입니다.`
    }
];

// 전역 애플리케이션 상태 관리 클래스
class PortfolioState {
    constructor() {
        this.profile = this.loadProfile();
        this.projects = this.loadProjects();
        this.isAdmin = this.loadAdminState();
        this.currentFilter = 'all';
        this.adminPassword = '1234'; // 관리자 기본 PIN
    }

    loadProfile() {
        const saved = localStorage.getItem('portfolio_profile');
        return saved ? JSON.parse(saved) : { ...DEFAULT_PROFILE };
    }

    saveProfile(newProfile) {
        this.profile = newProfile;
        localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
    }

    loadProjects() {
        const saved = localStorage.getItem('portfolio_projects');
        return saved ? JSON.parse(saved) : [ ...DEFAULT_PROJECTS ];
    }

    saveProjects(newProjects) {
        this.projects = newProjects;
        localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
    }

    loadAdminState() {
        return localStorage.getItem('portfolio_is_admin') === 'true';
    }

    setAdminState(isAdmin) {
        this.isAdmin = isAdmin;
        localStorage.setItem('portfolio_is_admin', isAdmin ? 'true' : 'false');
    }
}

const state = new PortfolioState();

// 앱 초기화 구동
document.addEventListener('DOMContentLoaded', () => {
    mountComponents();
    setupEventListeners();
});

// 전체 컴포넌트 마운트 & DOM 바인딩
function mountComponents() {
    // 1. 헤더 내비게이션 바
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) navbarEl.innerHTML = renderNavbar(state.isAdmin);

    // 2. 히어로 및 강사 소개 섹션
    const heroEl = document.getElementById('about');
    if (heroEl) heroEl.innerHTML = renderHero(state.profile, state.isAdmin, state.projects.length);

    // 3. 작업물 갤러리 섹션
    const projectsEl = document.getElementById('projects');
    if (projectsEl) projectsEl.innerHTML = renderProjectGrid(state.projects, state.currentFilter, state.isAdmin);

    // 4. 수강생 가이드 섹션
    const guideEl = document.getElementById('guide');
    if (guideEl) guideEl.innerHTML = renderGuideSection();

    // 5. 모달 세트 주입
    let modalHolder = document.getElementById('modal-container');
    if (!modalHolder) {
        modalHolder = document.createElement('div');
        modalHolder.id = 'modal-container';
        document.body.appendChild(modalHolder);
    }
    modalHolder.innerHTML = renderModals();
}

// 이벤트 핸들러 바인딩
function setupEventListeners() {
    // 관리자 토글 버튼
    document.body.addEventListener('click', (e) => {
        const adminBtn = e.target.closest('#admin-toggle-btn') || e.target.closest('#footer-admin-btn');
        if (adminBtn) {
            e.preventDefault();
            if (state.isAdmin) {
                state.setAdminState(false);
                mountComponents();
                showToast('관리자 모드가 해제되었습니다.', 'success');
            } else {
                document.getElementById('admin-pass-input').value = '';
                document.getElementById('auth-error-msg').textContent = '';
                showModal('auth-modal');
            }
        }
    });

    // 관리자 인증 제출
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'submit-auth-btn') {
            const inputPass = document.getElementById('admin-pass-input').value;
            if (inputPass === state.adminPassword) {
                state.setAdminState(true);
                closeModal('auth-modal');
                mountComponents();
                showToast('🔑 관리자 모드가 활성화되었습니다!', 'success');
            } else {
                document.getElementById('auth-error-msg').textContent = '비밀번호가 올바르지 않습니다. (기본: 1234)';
            }
        }
    });

    // 모달 닫기 버튼
    document.body.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-modal-btn');
        if (closeBtn) {
            const modalId = closeBtn.getAttribute('data-close');
            if (modalId) closeModal(modalId);
        }
    });

    // 카테고리 필터 클릭
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            state.currentFilter = e.target.getAttribute('data-category');
            mountComponents();
        }
    });

    // 자기소개 수정 버튼 클릭
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#edit-bio-btn')) {
            document.getElementById('edit-name-input').value = state.profile.name;
            document.getElementById('edit-title-input').value = state.profile.title;
            document.getElementById('edit-bio-input').value = state.profile.bio;
            document.getElementById('edit-skills-input').value = (state.profile.skills || []).join(', ');
            showModal('bio-modal');
        }
    });

    // 자기소개 저장 제출
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'save-bio-btn') {
            const name = document.getElementById('edit-name-input').value.trim();
            const title = document.getElementById('edit-title-input').value.trim();
            const bio = document.getElementById('edit-bio-input').value.trim();
            const skillsRaw = document.getElementById('edit-skills-input').value;
            const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

            if (!name || !title || !bio) {
                alert('필수 입력 항목을 모두 입력해주세요.');
                return;
            }

            state.saveProfile({ name, title, bio, skills });
            closeModal('bio-modal');
            mountComponents();
            showToast('자기소개가 저장되었습니다!', 'success');
        }
    });

    // 작업물 추가 버튼
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#add-project-btn')) {
            openProjectForm();
        }
    });

    // 작업물 편집 및 삭제 버튼
    document.body.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-proj-btn');
        const deleteBtn = e.target.closest('.delete-proj-btn');
        const promptBtn = e.target.closest('.view-prompt-btn');

        if (editBtn) {
            const id = editBtn.getAttribute('data-id');
            const proj = state.projects.find(p => p.id === id);
            if (proj) openProjectForm(proj);
        } else if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-id');
            if (confirm('정말로 이 작업물을 삭제하시겠습니까?')) {
                const updated = state.projects.filter(p => p.id !== id);
                state.saveProjects(updated);
                mountComponents();
                showToast('작업물이 삭제되었습니다.', 'success');
            }
        } else if (promptBtn) {
            const id = promptBtn.getAttribute('data-id');
            const proj = state.projects.find(p => p.id === id);
            if (proj) openPromptModal(proj);
        }
    });

    // 작업물 저장 제출
    document.body.addEventListener('click', (e) => {
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
                alert('제목, 설명, AI 프롬프트는 필수 입력 항목입니다.');
                return;
            }

            const projectData = { id, title, category, desc, icon, tools, demoUrl, githubUrl, prompt, tips };
            const existingIndex = state.projects.findIndex(p => p.id === id);

            let updatedProjects;
            if (existingIndex >= 0) {
                updatedProjects = [...state.projects];
                updatedProjects[existingIndex] = projectData;
            } else {
                updatedProjects = [projectData, ...state.projects];
            }

            state.saveProjects(updatedProjects);
            closeModal('project-modal');
            mountComponents();
            showToast('작업물이 성공적으로 저장되었습니다!', 'success');
        }
    });

    // 프롬프트 복사 버튼
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
}

// 작업물 폼 팝업 열기
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

// 수강생용 프롬프트 모달 열기
function openPromptModal(proj) {
    document.getElementById('view-project-title').textContent = proj.title;
    document.getElementById('view-project-prompt').textContent = proj.prompt;
    
    const tagsContainer = document.getElementById('view-project-tags');
    tagsContainer.innerHTML = (proj.tools || []).map(t => `<span class="skill-tag">#${t}</span>`).join('');

    const tipsContainer = document.getElementById('view-project-tips');
    tipsContainer.textContent = proj.tips || '등록된 노하우 및 팁이 없습니다.';

    showModal('prompt-modal');
}

// 모달 제어 헬퍼
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
    } else if (modal) {
        modal.setAttribute('open', 'true');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.close === 'function') {
        modal.close();
    } else if (modal) {
        modal.removeAttribute('open');
    }
}

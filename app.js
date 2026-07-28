/**
 * ==========================================================================
 * [메인 컨트롤러] app.js - 모듈화된 컴포넌트 통합 & Supabase 데이터 동기화
 * ==========================================================================
 * 역할: Supabase DB (방문자 화면 자동 로드) & LocalStorage 동기화, 컴포넌트 렌더링, 관리자 인증 이동 처리
 */

import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderProjectGrid } from './components/ProjectGrid.js';
import { renderGuideSection } from './components/GuideSection.js';
import { renderModals } from './components/Modals.js';
import { showToast } from './components/Toast.js';
import { fetchProfile, fetchProjects, saveProfile, saveProject, deleteProject } from './components/supabaseClient.js';

// 기본 시드 데이터 (초기 상태일 때 사용)
const DEFAULT_PROFILE = {
    name: '남진혁',
    title: 'AI 코딩 도구를 활용해 아이디어를 동작하는 시각적 결과물로 구현하고, 수강생들에게 실전 프롬프트와 개발 노하우를 전수합니다.',
    bio: '성인 수강생을 대상으로 AI 기반 웹/앱 개발 교육을 진행하고 있습니다. 복잡한 코딩의 장벽을 넘어, ChatGPT·Claude·Cursor 등 최신 AI 도구를 통해 창의적인 앱을 빠르게 빌드하는 과정을 함께 만들어갑니다.',
    skills: ['ChatGPT-4o', 'Claude 3.5 Sonnet', 'Cursor IDE', 'Midjourney', 'HTML5/CSS3/JS']
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
        prompt: `너는 운세 및 힐링 메시지 전문가야. 사용자가 포춘쿠키를 클릭하면 부드럽게 쿠키가 두 조각으로 갈라지는 애니메이션과 함께 오늘의 힐링 문구를 카드 형태로 띄워줘.`,
        tips: `1. CSS Keyframes 애니메이션을 활용하여 쿠키가 좌우로 갈라지는 효과를 구현했습니다.`
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

class PortfolioState {
    constructor() {
        this.profile = { ...DEFAULT_PROFILE };
        this.projects = [ ...DEFAULT_PROJECTS ];
        this.isAdmin = localStorage.getItem('portfolio_is_admin') === 'true';
        this.currentFilter = 'all';
        this.adminPassword = '1234';
    }

    async initData() {
        this.profile = await fetchProfile(DEFAULT_PROFILE);
        this.projects = await fetchProjects(DEFAULT_PROJECTS);
    }

    setAdminState(isAdmin) {
        this.isAdmin = isAdmin;
        localStorage.setItem('portfolio_is_admin', isAdmin ? 'true' : 'false');
    }
}

const state = new PortfolioState();

document.addEventListener('DOMContentLoaded', async () => {
    await state.initData();
    mountComponents();
    setupEventListeners();
});

// 전체 컴포넌트 마운트
function mountComponents() {
    // 1. 헤더 내비게이션 바
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) navbarEl.innerHTML = renderNavbar(state.isAdmin);

    // 2. 히어로 및 강사 소개 섹션
    const heroEl = document.getElementById('about');
    if (heroEl) heroEl.innerHTML = renderHero(state.profile, state.isAdmin, state.projects.length);

    // 3. 작업물 갤러리 섹션 (Supabase에서 가져온 작업물 바인딩)
    const projectsEl = document.getElementById('projects');
    if (projectsEl) projectsEl.innerHTML = renderProjectGrid(state.projects, state.currentFilter, state.isAdmin);

    // 4. 수강생 가이드 섹션
    const guideEl = document.getElementById('guide');
    if (guideEl) guideEl.innerHTML = renderGuideSection();

    // 5. 모달 주입
    let modalHolder = document.getElementById('modal-container');
    if (!modalHolder) {
        modalHolder = document.createElement('div');
        modalHolder.id = 'modal-container';
        document.body.appendChild(modalHolder);
    }
    modalHolder.innerHTML = renderModals();
}

function setupEventListeners() {
    // 관리자 토글 버튼
    document.body.addEventListener('click', (e) => {
        const adminBtn = e.target.closest('#admin-toggle-btn') || e.target.closest('#footer-admin-btn');
        if (adminBtn) {
            e.preventDefault();
            if (state.isAdmin) {
                state.setAdminState(false);
                mountComponents();
                showToast('관리자 세션이 종료되었습니다.', 'success');
            } else {
                document.getElementById('admin-pass-input').value = '';
                document.getElementById('auth-error-msg').textContent = '';
                showModal('auth-modal');
            }
        }
    });

    // 관리자 인증 제출 ➔ 성공 시 admin.html로 이동
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'submit-auth-btn') {
            const inputPass = document.getElementById('admin-pass-input').value;
            if (inputPass === state.adminPassword) {
                state.setAdminState(true);
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

    // 자기소개 수정 버튼 (관리자용)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#edit-bio-btn')) {
            document.getElementById('edit-name-input').value = state.profile.name;
            document.getElementById('edit-title-input').value = state.profile.title;
            document.getElementById('edit-bio-input').value = state.profile.bio;
            document.getElementById('edit-skills-input').value = (state.profile.skills || []).join(', ');
            showModal('bio-modal');
        }
    });

    // 자기소개 저장 제출 (Supabase & LocalStorage)
    document.body.addEventListener('click', async (e) => {
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

            const updatedProfile = { name, title, bio, skills };
            state.profile = updatedProfile;
            await saveProfile(updatedProfile);
            closeModal('bio-modal');
            mountComponents();
            showToast('☁️ Supabase DB & 로컬스토리지에 프로필이 저장되었습니다!', 'success');
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

/**
 * ==========================================================================
 * [관리자 컨트롤러] admin.js - Supabase DB & LocalStorage 동기화 대시보드
 * ==========================================================================
 * 역할: admin.html에 AdminHeader, AdminStats, AdminProfileForm, AdminProjectsTable 마운트 
 * 및 Supabase 데이터베이스와 실시간 CRUD 동기화 수행
 */

import { renderAdminHeader } from './components/AdminHeader.js';
import { renderAdminStats } from './components/AdminStats.js';
import { renderAdminProfileForm } from './components/AdminProfileForm.js';
import { renderAdminProjectsTable } from './components/AdminProjectsTable.js';
import { renderModals } from './components/Modals.js';
import { showToast } from './components/Toast.js';
import { fetchProfile, fetchProjects, saveProfile, saveProject, deleteProject, resetDatabase } from './components/supabaseClient.js';

// 기본 시드 데이터
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

class AdminState {
    constructor() {
        this.checkAdminAuth();
        this.profile = { ...DEFAULT_PROFILE };
        this.projects = [ ...DEFAULT_PROJECTS ];
    }

    checkAdminAuth() {
        const isAdmin = localStorage.getItem('portfolio_is_admin') === 'true';
        if (!isAdmin) {
            alert('🔒 관리자 권한이 필요합니다. 먼저 메인 페이지에서 관리자 로그인을 해주세요.');
            window.location.href = 'index.html';
        }
    }

    async initData() {
        this.profile = await fetchProfile(DEFAULT_PROFILE);
        this.projects = await fetchProjects(DEFAULT_PROJECTS);
    }

    logout() {
        localStorage.setItem('portfolio_is_admin', 'false');
        window.location.href = 'index.html';
    }
}

const state = new AdminState();

document.addEventListener('DOMContentLoaded', async () => {
    await state.initData();
    mountAdminComponents();
    setupAdminEventListeners();
});

function mountAdminComponents() {
    const headerEl = document.getElementById('admin-header');
    if (headerEl) headerEl.innerHTML = renderAdminHeader();

    const statsEl = document.getElementById('admin-stats');
    if (statsEl) statsEl.innerHTML = renderAdminStats(state.projects);

    const profileEl = document.getElementById('admin-profile-section');
    if (profileEl) profileEl.innerHTML = renderAdminProfileForm(state.profile);

    const projectsEl = document.getElementById('admin-projects-section');
    if (projectsEl) projectsEl.innerHTML = renderAdminProjectsTable(state.projects);

    let modalHolder = document.getElementById('modal-container');
    if (!modalHolder) {
        modalHolder = document.createElement('div');
        modalHolder.id = 'modal-container';
        document.body.appendChild(modalHolder);
    }
    modalHolder.innerHTML = renderModals();
}

function setupAdminEventListeners() {
    // 로그아웃 버튼
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#admin-logout-btn')) {
            if (confirm('관리자 대시보드에서 로그아웃 하시겠습니까?')) {
                state.logout();
            }
        }
    });

    // 프로필 폼 저장 (Supabase & LocalStorage)
    document.body.addEventListener('submit', async (e) => {
        if (e.target.id === 'admin-bio-form') {
            e.preventDefault();
            const name = document.getElementById('admin-name-input').value.trim();
            const title = document.getElementById('admin-title-input').value.trim();
            const bio = document.getElementById('admin-bio-input').value.trim();
            const skillsRaw = document.getElementById('admin-skills-input').value;
            const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

            const newProfile = { name, title, bio, skills };
            state.profile = newProfile;
            await saveProfile(newProfile);
            mountAdminComponents();
            showToast('☁️ Supabase DB & 로컬스토리지에 자기소개가 저장되었습니다!', 'success');
        }
    });

    // 신규 작업물 등록 버튼
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#admin-add-proj-btn')) {
            openProjectForm();
        }
    });

    // 데이터 리셋 버튼
    document.body.addEventListener('click', async (e) => {
        if (e.target.closest('#admin-reset-data-btn')) {
            if (confirm('정말로 모든 데이터를 기초 시드 데이터로 복원하시겠습니까?')) {
                await resetDatabase(DEFAULT_PROFILE, DEFAULT_PROJECTS);
                state.profile = DEFAULT_PROFILE;
                state.projects = DEFAULT_PROJECTS;
                mountAdminComponents();
                showToast('🔄 데이터가 기초 시드 상태로 복원되었습니다.', 'success');
            }
        }
    });

    // 작업물 수정/삭제 버튼
    document.body.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-admin-proj-btn');
        const deleteBtn = e.target.closest('.delete-admin-proj-btn');

        if (editBtn) {
            const id = editBtn.getAttribute('data-id');
            const proj = state.projects.find(p => p.id === id);
            if (proj) openProjectForm(proj);
        } else if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-id');
            if (confirm('정말로 이 작업물을 삭제하시겠습니까?')) {
                await deleteProject(id);
                state.projects = state.projects.filter(p => p.id !== id);
                mountAdminComponents();
                showToast('☁️ Supabase DB에서 작업물이 삭제되었습니다.', 'success');
            }
        }
    });

    // 작업물 모달 저장 버튼 (Supabase & LocalStorage)
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

            const existingIndex = state.projects.findIndex(p => p.id === id);
            if (existingIndex >= 0) state.projects[existingIndex] = projectData;
            else state.projects.unshift(projectData);

            closeModal('project-modal');
            mountAdminComponents();
            showToast('☁️ Supabase DB & 로컬스토리지에 작업물이 저장되었습니다!', 'success');
        }
    });

    // 모달 닫기 버튼들
    document.body.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-modal-btn');
        if (closeBtn) {
            const modalId = closeBtn.getAttribute('data-close');
            if (modalId) closeModal(modalId);
        }
    });
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

/**
 * ==========================================================================
 * [데모 컨트롤러] demo.js - 컴포넌트 쇼케이스 인터랙션 & 개별 컴포넌트 마운트
 * ==========================================================================
 * 역할: Navbar, Hero, ProjectCard, ProjectGrid, GuideSection, Modals, Toast를 
 * demo.html의 각 영역에 마운트하고 테스트 버튼 인터랙션 제공
 */

import { renderNavbar } from '../components/Navbar.js';
import { renderHero } from '../components/Hero.js';
import { renderProjectCard } from '../components/ProjectCard.js';
import { renderProjectGrid } from '../components/ProjectGrid.js';
import { renderGuideSection } from '../components/GuideSection.js';
import { renderModals } from '../components/Modals.js';
import { showToast } from '../components/Toast.js';

// 샘플 프로필 데이터
const SAMPLE_PROFILE = {
    name: '남진혁',
    title: 'AI 코딩 도구를 활용해 아이디어를 동작하는 시각적 결과물로 구현하고, 수강생들에게 실전 프롬프트와 개발 노하우를 전수합니다.',
    bio: '성인 수강생을 대상으로 AI 기반 웹/앱 개발 교육을 진행하고 있습니다. 복잡한 코딩의 장벽을 넘어, ChatGPT·Claude·Cursor 등 최신 AI 도구를 통해 창의적인 앱을 빠르게 빌드하는 과정을 만들어갑니다.',
    skills: ['ChatGPT-4o', 'Claude 3.5 Sonnet', 'Cursor IDE', 'Midjourney', 'HTML5/CSS3/JS']
};

// 샘플 프로젝트 데이터
const SAMPLE_PROJECTS = [
    {
        id: 'proj-demo-1',
        title: '🥠 AI 포춘쿠키 & 오늘의 운세 웹앱',
        category: 'webapp',
        desc: '클릭하면 쿠키가 깨지는 입체 애니메이션과 함께 AI가 생성한 오늘의 힐링 메시지를 전해주는 웹 애플리케이션입니다.',
        icon: '🥠',
        tools: ['ChatGPT', 'HTML5', 'Vanilla JS', 'CSS3'],
        demoUrl: 'https://example.com/fortune-cookie',
        githubUrl: 'https://github.com/...',
        prompt: `너는 운세 및 힐링 메시지 전문가야. 클릭하면 부드럽게 쿠키가 두 조각으로 갈라지는 애니메이션과 함께 오늘의 맞춤 힐링 문구를 카드 형태로 띄워줘.`,
        tips: `1. CSS Keyframes 애니메이션을 활용하여 쿠키가 좌우로 갈라지는 효과를 구현했습니다.`
    },
    {
        id: 'proj-demo-2',
        title: '🤖 스마트 AI 챗봇 & 대시보드',
        category: 'agent',
        desc: '다양한 페르소나의 AI 조력자와 실시간 대화를 나누고 대화 이력을 관리하는 반응형 챗봇 인터페이스입니다.',
        icon: '🤖',
        tools: ['Claude 3.5', 'Cursor IDE', 'LocalStorage'],
        demoUrl: 'https://example.com/ai-chatbot',
        githubUrl: '',
        prompt: `Claude 3.5를 활용해 다크 모드 기반의 AI 챗봇 UI를 작성해줘.`,
        tips: `1. 'content-visibility: auto' 옵션을 사용해 긴 대화 내역도 스크롤이 매끄럽게 동작하도록 처리했습니다.`
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar 마운트
    const navbarContainer = document.getElementById('demo-navbar-mount');
    if (navbarContainer) {
        navbarContainer.className = 'navbar';
        navbarContainer.style.position = 'relative';
        navbarContainer.innerHTML = renderNavbar(true); // Admin active preview
    }

    // 2. Hero 마운트
    const heroContainer = document.getElementById('demo-hero-mount');
    if (heroContainer) {
        heroContainer.innerHTML = renderHero(SAMPLE_PROFILE, true, SAMPLE_PROJECTS.length);
    }

    // 3. Single ProjectCard 마운트
    const cardContainer = document.getElementById('demo-card-mount');
    if (cardContainer) {
        cardContainer.innerHTML = renderProjectCard(SAMPLE_PROJECTS[0], true);
    }

    // 4. ProjectGrid 마운트
    const gridContainer = document.getElementById('demo-grid-mount');
    if (gridContainer) {
        gridContainer.innerHTML = renderProjectGrid(SAMPLE_PROJECTS, 'all', true);
    }

    // 5. GuideSection 마운트
    const guideContainer = document.getElementById('demo-guide-mount');
    if (guideContainer) {
        guideContainer.innerHTML = renderGuideSection();
    }

    // 6. Modals 마운트
    let modalHolder = document.getElementById('modal-container');
    if (!modalHolder) {
        modalHolder = document.createElement('div');
        modalHolder.id = 'modal-container';
        document.body.appendChild(modalHolder);
    }
    modalHolder.innerHTML = renderModals();

    // 7. 데모 테스트 버튼 인터랙션 바인딩
    bindDemoInteractions();
});

function bindDemoInteractions() {
    // 모달 테스트 버튼
    document.getElementById('test-auth-modal-btn')?.addEventListener('click', () => showModal('auth-modal'));
    document.getElementById('test-bio-modal-btn')?.addEventListener('click', () => {
        document.getElementById('edit-name-input').value = SAMPLE_PROFILE.name;
        document.getElementById('edit-title-input').value = SAMPLE_PROFILE.title;
        document.getElementById('edit-bio-input').value = SAMPLE_PROFILE.bio;
        document.getElementById('edit-skills-input').value = SAMPLE_PROFILE.skills.join(', ');
        showModal('bio-modal');
    });
    document.getElementById('test-project-modal-btn')?.addEventListener('click', () => showModal('project-modal'));
    document.getElementById('test-prompt-modal-btn')?.addEventListener('click', () => {
        document.getElementById('view-project-title').textContent = SAMPLE_PROJECTS[0].title;
        document.getElementById('view-project-prompt').textContent = SAMPLE_PROJECTS[0].prompt;
        document.getElementById('view-project-tips').textContent = SAMPLE_PROJECTS[0].tips;
        showModal('prompt-modal');
    });

    // 토스트 테스트 버튼
    document.getElementById('test-toast-success-btn')?.addEventListener('click', () => {
        showToast('🟢 성공 토스트 테스트: 작업이 성공적으로 처리되었습니다!', 'success');
    });
    document.getElementById('test-toast-error-btn')?.addEventListener('click', () => {
        showToast('🔴 에러 토스트 테스트: 비밀번호가 올바르지 않습니다.', 'error');
    });

    // 모달 닫기 이벤트 핸들러
    document.body.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-modal-btn');
        if (closeBtn) {
            const modalId = closeBtn.getAttribute('data-close');
            if (modalId) closeModal(modalId);
        }
    });

    // 프롬프트 복사 버튼 이벤트
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#copy-prompt-btn')) {
            showToast('📋 AI 프롬프트가 클립보드에 복사되었습니다!', 'success');
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

/**
 * ==========================================================================
 * [컴포넌트] ProjectGrid.js - 작업물 쇼케이스 그리드 & 카테고리 필터
 * ==========================================================================
 * 역할: AI 프로젝트 갤러리 섹션 헤더, 카테고리 탭, 그리드 영역 관리 및 카드 바인딩
 */

import { renderProjectCard } from './ProjectCard.js';

export function renderProjectGrid(projects, currentFilter = 'all', isAdmin = false) {
    // 선택된 카테고리에 맞는 프로젝트 필터링
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);

    // 카테고리 탭 목록 정의
    const categories = [
        { key: 'all', label: '전체 보기' },
        { key: 'webapp', label: '웹 애플리케이션' },
        { key: 'tool', label: '자동화 & 툴' },
        { key: 'agent', label: 'AI 챗봇/에이전트' }
    ];

    // 탭 버튼 HTML 생성
    const tabsHtml = categories.map(cat => `
        <button class="filter-btn ${currentFilter === cat.key ? 'active' : ''}" data-category="${cat.key}">
            ${cat.label}
        </button>
    `).join('');

    // 카드 그리드 HTML 생성
    let cardsHtml = '';
    if (filteredProjects.length === 0) {
        cardsHtml = `
            <div class="glass-panel" style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary-blue);"></i>
                <p>등록된 작업물이 없습니다.</p>
            </div>
        `;
    } else {
        cardsHtml = filteredProjects.map(proj => renderProjectCard(proj, isAdmin)).join('');
    }

    return `
        <div class="container">
            <!-- 섹션 헤더 & 관리자 전용 작업물 추가 버튼 -->
            <div class="section-header">
                <div>
                    <span class="section-subtitle">AI 프로젝트 갤러리</span>
                    <h2 class="section-title">AI로 제작한 웹 & 앱 결과물</h2>
                </div>
                
                <button id="add-project-btn" class="btn btn-primary admin-only ${isAdmin ? '' : 'hidden'}">
                    <i class="fa-solid fa-plus"></i> 새 작업물 추가
                </button>
            </div>

            <!-- 카테고리 필터 탭 -->
            <div class="filter-tabs" id="filter-tabs">
                ${tabsHtml}
            </div>

            <!-- 작업물 카드가 동적으로 주입되는 그리드 -->
            <div class="projects-grid" id="projects-grid">
                ${cardsHtml}
            </div>
        </div>
    `;
}

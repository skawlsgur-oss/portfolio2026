/**
 * ==========================================================================
 * [컴포넌트] ProjectCard.js - 작업물 개별 카드 렌더링
 * ==========================================================================
 * 역할: 개별 AI 웹/앱 작업물 카드 UI(아이콘, 설명, 태그, 라이브 데모, 프롬프트 모달 버튼) 렌더링
 */

export function renderProjectCard(project, isAdmin = false) {
    const { id, title, desc, icon, tools, demoUrl, githubUrl } = project;

    // AI 활용 도구 태그 칩 생성
    const toolsTags = (tools || []).map(tool => `
        <span class="skill-tag">#${escapeHTML(tool)}</span>
    `).join('');

    return `
        <div class="project-card glass-panel" data-id="${id}">
            <!-- 카드 상단: 아이콘 & 관리자 전용 편집/삭제 버튼 -->
            <div class="project-card-header">
                <div class="project-icon-box">${icon || '🚀'}</div>
                <div class="project-card-actions">
                    ${isAdmin ? `
                        <button class="btn btn-sm btn-ghost edit-proj-btn" data-id="${id}" title="수정"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-ghost btn-danger delete-proj-btn" data-id="${id}" title="삭제"><i class="fa-solid fa-trash"></i></button>
                    ` : ''}
                </div>
            </div>

            <!-- 카드 본문: 프로젝트 제목 & 요약 설명 -->
            <h3 class="project-title">${escapeHTML(title)}</h3>
            <p class="project-desc">${escapeHTML(desc)}</p>

            <!-- 사용된 AI 도구 태그 그룹 -->
            <div class="project-tags skills-tags">
                ${toolsTags}
            </div>

            <!-- 카드 하단 버튼 세트 -->
            <div class="project-footer-btns">
                ${demoUrl ? `
                    <a href="${escapeHTML(demoUrl)}" target="_blank" class="btn btn-sm btn-primary">
                        <i class="fa-solid fa-globe"></i> 데모
                    </a>
                ` : ''}
                <button class="btn btn-sm btn-accent view-prompt-btn" data-id="${id}">
                    <i class="fa-solid fa-lightbulb"></i> AI 프롬프트 & 팁
                </button>
                ${githubUrl ? `
                    <a href="${escapeHTML(githubUrl)}" target="_blank" class="btn btn-sm btn-outline" title="GitHub 소스 코드">
                        <i class="fa-brands fa-github"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// XSS 방지용 이스케이프 함수
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

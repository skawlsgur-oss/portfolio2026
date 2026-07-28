/**
 * ==========================================================================
 * [컴포넌트] AdminProjectsTable.js - 관리자 AI 작업물 CRUD 테이블
 * ==========================================================================
 * 역할: 등록된 작업물 목록을 데이터 테이블 형태로 표시하고, 추가/수정/삭제/리셋 액션 바인딩
 */

export function renderAdminProjectsTable(projects = []) {
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
            <!-- 작업물 헤더 및 액션 버튼 세트 -->
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

            <!-- 작업물 데이터 테이블 -->
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

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

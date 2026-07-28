/**
 * ==========================================================================
 * [컴포넌트] AdminStats.js - 관리자 대시보드 요약 통계 카드 세트
 * ==========================================================================
 * 역할: 총 작업물 수, 웹앱 개수, 자동화 툴/챗봇 개수 및 LocalStorage 저장소 상태 요약 렌더링
 */

export function renderAdminStats(projects = []) {
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
                <h3 style="font-size: 1.2rem; color: var(--accent-emerald);"><i class="fa-solid fa-circle-check"></i> LocalStorage</h3>
            </div>
        </div>
    `;
}

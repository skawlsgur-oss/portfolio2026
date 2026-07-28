/**
 * ==========================================================================
 * [컴포넌트] AdminHeader.js - 관리자 대시보드 상단 내비게이션 바
 * ==========================================================================
 * 역할: 관리자 대시보드 로고, 메인 페이지 이동 링크, 로그아웃 버튼 렌더링
 */

export function renderAdminHeader() {
    return `
        <div class="container nav-container">
            <!-- 관리자 대시보드 로고 -->
            <a href="index.html" class="nav-logo">
                <span class="logo-icon"><i class="fa-solid fa-user-shield"></i></span>
                <span class="logo-text">남진혁<span class="highlight">.AI</span> 관리자 대시보드</span>
            </a>
            
            <!-- 우측 작업 버튼 세트 -->
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

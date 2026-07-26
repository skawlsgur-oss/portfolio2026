/**
 * ==========================================================================
 * [컴포넌트] Navbar.js - 상단 내비게이션 바 & 관리자 모드 토글
 * ==========================================================================
 * 역할: 브랜드 로고, 주요 메뉴 이동 링크, 관리자 인증 모달 호출 버튼 관리
 */

export function renderNavbar(isAdmin = false) {
    return `
        <div class="container nav-container">
            <!-- 브랜드 로고 -->
            <a href="#" class="nav-logo">
                <span class="logo-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
                <span class="logo-text">남진혁<span class="highlight">.AI</span></span>
            </a>
            
            <!-- 내비게이션 메뉴 링크 -->
            <nav class="nav-links">
                <a href="#about" class="nav-link active">강사 소개</a>
                <a href="#projects" class="nav-link">AI 작업물</a>
                <a href="#guide" class="nav-link">수강생 가이드</a>
            </nav>

            <!-- 우측 관리자 모드 상태 & 토글 버튼 -->
            <div class="nav-actions">
                <button id="admin-toggle-btn" class="btn btn-outline admin-btn ${isAdmin ? 'unlocked' : ''}" title="관리자 모드 토글">
                    <i class="fa-solid ${isAdmin ? 'fa-lock-open' : 'fa-lock'}" id="admin-lock-icon"></i>
                    <span id="admin-btn-text">${isAdmin ? '관리자 로그아웃' : '관리자 로그인'}</span>
                </button>
            </div>
        </div>
    `;
}

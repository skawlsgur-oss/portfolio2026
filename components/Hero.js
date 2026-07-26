/**
 * ==========================================================================
 * [컴포넌트] Hero.js - 히어로 & 강사 소개 섹션
 * ==========================================================================
 * 역할: 프로필 타이틀, 자기소개 글, AI 도구 태그 칩 그룹, 관리자 편집 버튼 렌더링
 */

export function renderHero(profileData, isAdmin = false, projectCount = 0) {
    const { name, title, bio, skills } = profileData;

    // AI 도구 태그 칩 HTML 생성
    const skillsHtml = (skills || []).map(skill => `
        <span class="skill-tag"><i class="fa-solid fa-sparkles"></i> ${escapeHTML(skill)}</span>
    `).join('');

    return `
        <div class="container">
            <div class="hero-card glass-panel">
                <!-- 좌측 메인 텍스트 정보 -->
                <div class="hero-content">
                    <div class="badge-container">
                        <span class="badge glow-badge">
                            <i class="fa-solid fa-sparkles"></i> AI로 만드는 미래 웹 & 앱
                        </span>
                        <span id="admin-status-tag" class="badge admin-status-badge ${isAdmin ? '' : 'hidden'}">
                            <i class="fa-solid fa-user-shield"></i> 관리자 편집 모드 중
                        </span>
                    </div>
                    
                    <h1 class="hero-title">
                        안녕하세요, <br>AI 크리에이터 <span class="gradient-text" id="display-name">${escapeHTML(name)}</span>입니다.
                    </h1>

                    <p class="hero-subtitle" id="display-title">
                        ${escapeHTML(title)}
                    </p>

                    <!-- 자기소개 박스 (관리자 전용 수정 버튼 포함) -->
                    <div class="bio-box">
                        <div class="bio-header">
                            <h3><i class="fa-solid fa-user-gear"></i> 자기소개</h3>
                            <button id="edit-bio-btn" class="btn btn-sm btn-ghost admin-only ${isAdmin ? '' : 'hidden'}">
                                <i class="fa-solid fa-pen-to-square"></i> 수정하기
                            </button>
                        </div>
                        <p class="bio-text" id="display-bio">${escapeHTML(bio)}</p>
                    </div>

                    <!-- 기술 및 AI 도구 태그 칩 -->
                    <div class="skills-wrapper">
                        <span class="skills-label">주요 활용 AI 도구:</span>
                        <div class="skills-tags" id="display-skills">
                            ${skillsHtml}
                        </div>
                    </div>

                    <!-- 행동 유도 (CTA) 버튼 -->
                    <div class="hero-actions">
                        <a href="#projects" class="btn btn-primary glow-btn">
                            <i class="fa-solid fa-cubes"></i> 작업물 둘러보기
                        </a>
                        <a href="#guide" class="btn btn-secondary">
                            <i class="fa-solid fa-graduation-cap"></i> 수강생 학습 팁
                        </a>
                    </div>
                </div>

                <!-- 우측 비주얼 프로필 & 통계 카드 -->
                <div class="hero-visual">
                    <div class="avatar-frame">
                        <div class="avatar-glow"></div>
                        <div class="avatar-inner">
                            <i class="fa-solid fa-laptop-code avatar-icon"></i>
                        </div>
                    </div>
                    <div class="stat-grid">
                        <div class="stat-card">
                            <span class="stat-num" id="stat-count">${projectCount}+</span>
                            <span class="stat-label">AI 프로젝트</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-num">100%</span>
                            <span class="stat-label">실전 프롬프트 공개</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// XSS 보안 방지를 위한 텍스트 치환 함수
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

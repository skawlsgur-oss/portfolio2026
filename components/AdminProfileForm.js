/**
 * ==========================================================================
 * [컴포넌트] AdminProfileForm.js - 관리자 강사 자기소개 편집 폼
 * ==========================================================================
 * 역할: 강사 이름, 한 줄 비전, 상세 본문, AI 기술 태그 칩을 수정하는 입력 폼 렌더링
 */

export function renderAdminProfileForm(profile = {}) {
    const { name = '', title = '', bio = '', skills = [] } = profile;
    const skillsString = (skills || []).join(', ');

    return `
        <div class="glass-panel" style="padding: 2rem;">
            <div class="section-header" style="margin-bottom: 1.5rem;">
                <div>
                    <span class="section-subtitle">PROFILE SETTINGS</span>
                    <h2 class="section-title"><i class="fa-solid fa-user-gear"></i> 강사 자기소개 및 프로필 편집</h2>
                </div>
            </div>

            <form id="admin-bio-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="admin-name-input">강사 이름 *</label>
                        <input type="text" id="admin-name-input" value="${escapeHTML(name)}" required>
                    </div>
                    <div class="form-group">
                        <label for="admin-title-input">한 줄 타이트 & 직함 *</label>
                        <input type="text" id="admin-title-input" value="${escapeHTML(title)}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="admin-bio-input">자기소개 상세 본문 (수강생 공개용) *</label>
                    <textarea id="admin-bio-input" rows="4" required>${escapeHTML(bio)}</textarea>
                </div>

                <div class="form-group">
                    <label for="admin-skills-input">주요 활용 AI 도구 태그 (쉼표로 구분)</label>
                    <input type="text" id="admin-skills-input" value="${escapeHTML(skillsString)}" placeholder="ChatGPT-4o, Claude 3.5, Cursor, Midjourney, HTML5/CSS3">
                </div>

                <div style="text-align: right; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary glow-btn">
                        <i class="fa-solid fa-floppy-disk"></i> 자기소개 저장하기
                    </button>
                </div>
            </form>
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

/**
 * ==========================================================================
 * [컴포넌트] Modals.js - 모달 팝업 세트 (관리자 인증, 자기소개 수정, 작업물 추가, 프롬프트 보기)
 * ==========================================================================
 * 역할: 사이트 내 모든 dialog 모달 구조 및 내부 양식 렌더링
 */

export function renderModals() {
    return `
        <!-- 1. 관리자 인증 비밀번호 모달 -->
        <dialog id="auth-modal" class="custom-modal">
            <div class="modal-content glass-panel">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-user-shield"></i> 관리자 인증</h3>
                    <button class="close-modal-btn" data-close="auth-modal"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <p class="modal-desc">자기소개 및 작업물을 수정/추가하려면 관리자 비밀번호를 입력해주세요.</p>
                    <div class="form-group">
                        <label for="admin-pass-input">비밀번호 (기본: 1234)</label>
                        <input type="password" id="admin-pass-input" placeholder="비밀번호를 입력하세요" autocomplete="current-password">
                        <span class="error-msg" id="auth-error-msg"></span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal-btn" data-close="auth-modal">취소</button>
                    <button id="submit-auth-btn" class="btn btn-primary">확인 및 해제</button>
                </div>
            </div>
        </dialog>

        <!-- 2. 자기소개 편집 모달 -->
        <dialog id="bio-modal" class="custom-modal">
            <div class="modal-content glass-panel">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-pen-to-square"></i> 자기소개 편집</h3>
                    <button class="close-modal-btn" data-close="bio-modal"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <form id="bio-form">
                        <div class="form-group">
                            <label for="edit-name-input">강사 이름 *</label>
                            <input type="text" id="edit-name-input" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-title-input">한 줄 비전 & 직함 *</label>
                            <input type="text" id="edit-title-input" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-bio-input">자기소개 상세 본문 *</label>
                            <textarea id="edit-bio-input" rows="5" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-skills-input">주요 활용 AI 도구 태그 (쉼표 구분)</label>
                            <input type="text" id="edit-skills-input" placeholder="ChatGPT-4o, Claude 3.5, Cursor, HTML5/CSS3">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal-btn" data-close="bio-modal">취소</button>
                    <button id="save-bio-btn" class="btn btn-primary">저장하기</button>
                </div>
            </div>
        </dialog>

        <!-- 3. 작업물 추가 / 수정 모달 -->
        <dialog id="project-modal" class="custom-modal">
            <div class="modal-content glass-panel modal-lg">
                <div class="modal-header">
                    <h3 id="project-modal-title"><i class="fa-solid fa-folder-plus"></i> 작업물 추가</h3>
                    <button class="close-modal-btn" data-close="project-modal"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <form id="project-form">
                        <input type="hidden" id="project-id-input">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="proj-title-input">프로젝트 제목 *</label>
                                <input type="text" id="proj-title-input" required placeholder="예: AI 포춘쿠키 & 오늘의 운세">
                            </div>
                            <div class="form-group">
                                <label for="proj-category-select">카테고리 *</label>
                                <select id="proj-category-select" required>
                                    <option value="webapp">웹 애플리케이션</option>
                                    <option value="tool">자동화 & 툴</option>
                                    <option value="agent">AI 챗봇/에이전트</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="proj-desc-input">프로젝트 한 줄 요약 *</label>
                            <input type="text" id="proj-desc-input" required placeholder="예: 버튼을 누르면 쿠키가 깨지며 AI가 추천하는 운세를 보여줍니다.">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="proj-icon-input">아이콘/이모지</label>
                                <input type="text" id="proj-icon-input" placeholder="🥠 또는 🤖">
                            </div>
                            <div class="form-group">
                                <label for="proj-tools-input">사용 AI/기술 태그 (쉼표 구분)</label>
                                <input type="text" id="proj-tools-input" placeholder="ChatGPT, HTML5, Vanilla JS, CSS3">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="proj-demo-input">라이브 데모 URL</label>
                                <input type="url" id="proj-demo-input" placeholder="https://demo.example.com">
                            </div>
                            <div class="form-group">
                                <label for="proj-github-input">GitHub 코드 URL</label>
                                <input type="url" id="proj-github-input" placeholder="https://github.com/...">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="proj-prompt-input">핵심 AI 프롬프트 원문 (수강생 공유용) *</label>
                            <textarea id="proj-prompt-input" rows="4" required placeholder="AI에게 전달한 실제 프롬프트 명령어를 적어주세요."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="proj-tips-input">제작 노하우 및 구현 팁</label>
                            <textarea id="proj-tips-input" rows="3" placeholder="수강생들에게 도움이 될 만한 개발 노하우나 팁을 입력해주세요."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal-btn" data-close="project-modal">취소</button>
                    <button id="save-project-btn" class="btn btn-primary">저장하기</button>
                </div>
            </div>
        </dialog>

        <!-- 4. 수강생용 AI 프롬프트 & 팁 보기 모달 -->
        <dialog id="prompt-modal" class="custom-modal">
            <div class="modal-content glass-panel modal-lg">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-code"></i> AI 프롬프트 & 제작 노하우</h3>
                    <button class="close-modal-btn" data-close="prompt-modal"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <div class="prompt-viewer-meta">
                        <h4 id="view-project-title">프로젝트 이름</h4>
                        <div id="view-project-tags" class="skills-tags"></div>
                    </div>

                    <div class="prompt-code-section">
                        <div class="code-header">
                            <span><i class="fa-solid fa-terminal"></i> 사용된 AI 프롬프트</span>
                            <button id="copy-prompt-btn" class="btn btn-sm btn-accent">
                                <i class="fa-regular fa-copy"></i> 프롬프트 복사
                            </button>
                        </div>
                        <pre class="code-block"><code id="view-project-prompt"></code></pre>
                    </div>

                    <div class="tips-section">
                        <h4><i class="fa-solid fa-graduation-cap"></i> 제작 노하우 & 개발 팁</h4>
                        <div class="tips-card" id="view-project-tips"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary close-modal-btn" data-close="prompt-modal">닫기</button>
                </div>
            </div>
        </dialog>
    `;
}

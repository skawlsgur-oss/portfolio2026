/**
 * ==========================================================================
 * [컴포넌트] ContactSection.js - EmailJS 연동 메시지 보내기 연락폼 섹션
 * ==========================================================================
 * 역할: 방문자가 성함, 이메일, 메시지를 작성하여 강사(skawlsgur@gmail.com)에게 이메일을 발송하는 컴포넌트
 */

export function renderContactSection() {
    return `
        <div class="container">
            <div class="section-header">
                <div>
                    <span class="section-subtitle">GET IN TOUCH</span>
                    <h2 class="section-title"><i class="fa-solid fa-paper-plane"></i> 강사에게 문의 및 메시지 남기기</h2>
                </div>
            </div>

            <div class="contact-grid">
                <!-- 좌측: 안내 및 정보 카드 -->
                <div class="contact-info-card glass-panel">
                    <div class="contact-info-header">
                        <div class="contact-avatar-icon">
                            <i class="fa-solid fa-envelope-open-text"></i>
                        </div>
                        <h3>궁금한 점이 있거나<br>협업을 제안하고 싶으신가요?</h3>
                    </div>
                    <p class="contact-info-desc">
                        AI 코딩 강의 문의, 프로젝트 협업, 피드백 등 어떤 내용이든 자유롭게 메시지를 남겨주세요. 
                        확인 후 빠른 시일 내에 답변드리겠습니다.
                    </p>

                    <div class="contact-details">
                        <div class="contact-detail-item">
                            <div class="detail-icon"><i class="fa-solid fa-at"></i></div>
                            <div>
                                <span class="detail-label">이메일 주소</span>
                                <span class="detail-value">skawlsgur@gmail.com</span>
                            </div>
                        </div>
                        <div class="contact-detail-item">
                            <div class="detail-icon"><i class="fa-solid fa-clock"></i></div>
                            <div>
                                <span class="detail-label">답변 예상 시간</span>
                                <span class="detail-value">평일 기준 24시간 이내</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 우측: EmailJS 연동 연락폼 카드 -->
                <div class="contact-form-card glass-panel">
                    <form id="contact-form" class="contact-form">
                        <div class="form-group">
                            <label for="contact-name"><i class="fa-solid fa-user"></i> 성함 / 닉네임 <span class="required">*</span></label>
                            <input type="text" id="contact-name" name="name" class="form-input" placeholder="성함이나 닉네임을 입력해 주세요" required>
                        </div>

                        <div class="form-group">
                            <label for="contact-email"><i class="fa-solid fa-envelope"></i> 회신받으실 이메일 주소 <span class="required">*</span></label>
                            <input type="email" id="contact-email" name="email" class="form-input" placeholder="example@email.com" required>
                        </div>

                        <div class="form-group">
                            <label for="contact-message"><i class="fa-solid fa-comment-dots"></i> 문의 및 메시지 내용 <span class="required">*</span></label>
                            <textarea id="contact-message" name="message" class="form-textarea" rows="5" placeholder="궁금하신 내용이나 피드백을 자유롭게 작성해 주세요." required></textarea>
                        </div>

                        <button type="submit" id="submit-contact-btn" class="btn btn-primary glow-btn btn-lg btn-full">
                            <i class="fa-solid fa-paper-plane" id="contact-btn-icon"></i>
                            <span id="contact-btn-text">이메일 보내기</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

/**
 * ==========================================================================
 * [컴포넌트] GuideSection.js - 수강생 학습 가이드 섹션
 * ==========================================================================
 * 역할: 수강생들이 포트폴리오를 활용하여 AI 프롬프트를 배우고 실전 프로젝트에 응용하는 방법을 안내하는 카드 세트
 */

export function renderGuideSection() {
    return `
        <div class="container">
            <div class="section-header">
                <div>
                    <span class="section-subtitle">FOR STUDENTS</span>
                    <h2 class="section-title"><i class="fa-solid fa-graduation-cap"></i> 수강생을 위한 AI 학습 가이드</h2>
                </div>
            </div>

            <div class="guide-grid">
                <div class="guide-card glass-panel">
                    <div class="guide-icon guide-icon-cyan">
                        <i class="fa-solid fa-copy"></i>
                    </div>
                    <h3>1. 프롬프트 복사 & 활용</h3>
                    <p>각 작업물 카드의 [AI 프롬프트 & 팁] 버튼을 누르면 제가 AI에게 직접 입력했던 시스템 프롬프트 원문을 복사할 수 있습니다.</p>
                </div>

                <div class="guide-card glass-panel">
                    <div class="guide-icon guide-icon-purple">
                        <i class="fa-solid fa-lightbulb"></i>
                    </div>
                    <h3>2. 제작 노하우 습득</h3>
                    <p>애니메이션, 상태 관리, 챗봇 대화 기록 저장 등 구현 과정에서 마주친 트러블슈팅과 꿀팁을 함께 제공합니다.</p>
                </div>

                <div class="guide-card glass-panel">
                    <div class="guide-icon guide-icon-emerald">
                        <i class="fa-solid fa-rocket"></i>
                    </div>
                    <h3>3. 실전 아이디어 구현</h3>
                    <p>강의에서 배운 AI 코딩 기법을 바탕으로 나만의 독창적인 웹사이트와 포트폴리오를 빠르게 구축해 보세요.</p>
                </div>
            </div>
        </div>
    `;
}

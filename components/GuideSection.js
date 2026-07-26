/**
 * ==========================================================================
 * [컴포넌트] GuideSection.js - 수강생 학습 가이드 섹션
 * ==========================================================================
 * 역할: 수강생들이 포트폴리오를 활용하여 AI 프롬프트를 배우고 실전 프로젝트에 응용하는 방법을 안내하는 카드 세트
 */

export function renderGuideSection() {
    return `
        <div class="container">
            <div class="guide-card glass-panel">
                <div class="guide-header">
                    <span class="badge glow-badge"><i class="fa-solid fa-lightbulb"></i> 수강생을 위한 안내</span>
                    <h2>AI 작업물 포트폴리오 활용법</h2>
                    <p>수강생 여러분은 이 공간을 통해 다음과 같은 학습 효과를 얻으실 수 있습니다.</p>
                </div>

                <div class="guide-grid">
                    <div class="guide-item">
                        <div class="guide-icon"><i class="fa-solid fa-code-compare"></i></div>
                        <h3>1. 프롬프트 복사 & 실습</h3>
                        <p>각 작업물의 <strong>[AI 프롬프트 & 노하우]</strong> 버튼을 누르면 완성된 앱을 만들 때 사용한 최적의 프롬프트를 확인하고 원클릭 복사할 수 있습니다.</p>
                    </div>
                    <div class="guide-item">
                        <div class="guide-icon"><i class="fa-solid fa-eye"></i></div>
                        <h3>2. 라이브 데모 직접 체험</h3>
                        <p><strong>[라이브 데모]</strong> 버튼으로 완성된 웹앱을 직접 조작해 보며 사용자 경험과 애니메이션 인터랙션을 직접 체험해 보세요.</p>
                    </div>
                    <div class="guide-item">
                        <div class="guide-icon"><i class="fa-solid fa-layer-group"></i></div>
                        <h3>3. 구현 노하우 학습</h3>
                        <p>AI 코딩 시 흔히 발생하는 오류 해결법과 디자인 스타일링 팁을 읽으며 본인만의 사이드 프로젝트에 적용할 수 있습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

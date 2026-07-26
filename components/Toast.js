/**
 * ==========================================================================
 * [컴포넌트] Toast.js - 토스트 알림 메시지 시스템
 * ==========================================================================
 * 역할: 저장 완료, 프롬프트 복사, 관리자 인증 상태 변경 시 화면 우측 하단 토스트 메시지 렌더링 및 자동 소멸
 */

export function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    // 일정 시간 후 부드럽게 페이드아웃하며 삭제
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// XSS 보안 처리 함수
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

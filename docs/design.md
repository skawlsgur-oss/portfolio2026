# [Design System] 남진혁 강사의 AI 포트폴리오 디자인 가이드 (design.md)

---

## 1. 문서 개요 및 디자인 기조

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | AI 웹/앱 포트폴리오 웹사이트 UI/UX 디자인 가이드 |
| **대상 PRD** | `portfolio/prd.md` |
| **디자인 콘셉트** | **미래지향적 테크니컬 다크 모드 (Futuristic Technical Dark System)** |
| **핵심 감성** | #혁신적 #글래스모피즘 #네온엑센트 #전문성 #트렌디 #수강생동기부여 |
| **저장 경로** | `portfolio/design.md` |

---

## 2. 컬러 시스템 (Color System & Palette)

다크 톤의 배경과 대비되는 고명도 네온 포인트를 매칭하여 시각적 화려함(Visual WOW)과 뛰어난 가독성을 동시에 확보합니다.

### 2.1 메인 & 포인트 컬러 Palette

```
[ Primary Background ]       [ Surface / Glass ]         [ Main Accent (Neon Cyan) ]
  #0A0E17 (Dark Navy)          #111827 (Deep Gray 60%)     #00F2FE -> #4FACFE (Gradient)

[ Sub Accent (Neon Violet) ] [ Text Main ]               [ Text Muted ]
  #7F00FF -> #A855F7           #F9FAFB (Off White)         #9CA3AF (Cool Gray)
```

| 구분 | 컬러 이름 | Hex / RGBA 코드 | CSS 변수명 | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Background** | Dark Navy Black | `#0A0E17` | `--bg-main` | 전체 메인 배경색 |
| **Surface Card** | Deep Charcoal Glass | `rgba(17, 24, 39, 0.65)` | `--bg-surface` | 자기소개, 작업물 카드 배경 |
| **Surface Border** | Glass Border Gradient | `rgba(255, 255, 255, 0.1)` | `--border-glass` | 카드 및 인터랙티브 요소 테두리 |
| **Main Accent** | Neon Cyan Gradient | `linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)` | `--accent-cyan` | 주요 CTA 버튼, 돋보이는 핵심 포인트 |
| **Sub Accent** | Neon Violet Gradient | `linear-gradient(135deg, #7F00FF 0%, #A855F7 100%)` | `--accent-violet` | AI 도구 태그, 강조 배지 |
| **Text Primary** | Crisp Off-White | `#F9FAFB` | `--text-primary` | 메인 헤드라인, 카탈로그 제목 |
| **Text Secondary** | Cool Slate Gray | `#9CA3AF` | `--text-secondary` | 본문 설명, 메타 정보 |
| **Admin Success** | Neon Green | `#22C55E` | `--color-success` | 관리자 모드 활성화 상태 표시 |
| **Danger / Delete** | Coral Red | `#EF4444` | `--color-danger` | 작업물 삭제 버튼 및 경고 |

---

## 3. 타이포그래피 (Typography System)

글꼴은 가독성이 검증된 **Pretendard**와 코드/태그에 적합한 **Fira Code** 모노스페이스 폰트를 혼용합니다.

* **Primary Font**: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Code / Tag Font**: `'Fira Code', 'JetBrains Mono', monospace`

### 3.1 Type Scale

| 단계 | 크기 (px / rem) | Font Weight | Line Height | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1** | `40px / 2.5rem` | 800 (ExtraBold) | 1.2 | Hero 타이틀 ("남진혁 AI Portfolio") |
| **Heading H2** | `28px / 1.75rem` | 700 (Bold) | 1.3 | 섹션 제목 ("자기소개", "작업물 갤러리") |
| **Heading H3** | `20px / 1.25rem` | 600 (SemiBold) | 1.4 | 작업물 카드 제목, 모달 타이틀 |
| **Body Large** | `16px / 1rem` | 400 (Regular) | 1.6 | 자기소개 본문 텍스트 |
| **Body Regular**| `14px / 0.875rem`| 400 (Regular) | 1.5 | 작업물 카드 간략 설명 |
| **Caption / Tag**| `12px / 0.75rem` | 500 (Medium) | 1.4 | AI 도구 태그, 날짜, 관리자 상태 |

---

## 4. 버튼 시스템 (Button Architecture & Specs)

버튼은 직관적인 터치 및 클릭 경험을 위해 **3가지 표준 크기(Large, Medium, Small)**와 **4가지 상태(Default, Hover, Active, Disabled)**로 규격화합니다.

```
[ Large Button (52px) ] -> Hero CTA, 로그인 모달 제출
[ Medium Button (44px) ] -> 바로가기(Live Demo), 카테고리 필터 탭
[ Small Button (34px) ] -> ✏️ 수정, 🗑️ 삭제, AI 태그 칩
```

### 4.1 버튼 크기 상세 명세

| 구분 | 높이 (Height) | 패딩 (Padding) | 테두리 반경 (Radius) | 폰트 스펙 | 최소 터치 영역 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Large Button** | `52px` | `14px 28px` | `12px` | `16px / 600 SemiBold` | 48px × 48px 이상 |
| **Medium Button**| `44px` | `10px 20px` | `10px` | `14px / 500 Medium` | 44px × 44px 이상 |
| **Small Button** | `34px` | `6px 14px` | `8px` | `12px / 500 Medium` | 34px × 34px 이상 |

### 4.2 버튼 유형별 가이드

#### 1) Primary Accent Button (주요 바로가기 / 제출)
* **Default**: `background: linear-gradient(135deg, #00F2FE, #4FACFE)`, Color: `#0A0E17` (Bold Text)
* **Hover Effect**: `transform: translateY(-2px)`, `box-shadow: 0 0 20px rgba(0, 242, 254, 0.4)`
* **Active**: `transform: translateY(0)`, `filter: brightness(0.9)`

#### 2) Glass Outline Button (보조 버튼 / 카테고리 탭)
* **Default**: `background: rgba(255, 255, 255, 0.05)`, `border: 1px solid rgba(255, 255, 255, 0.15)`, Color: `#F9FAFB`
* **Hover**: `background: rgba(255, 255, 255, 0.12)`, `border-color: #00F2FE`

#### 3) Admin Action Button (관리자 전용 기능)
* **Edit Button (수정)**: `background: rgba(245, 158, 11, 0.15)`, `border: 1px solid #F59E0B`, Color: `#FCD34D`
* **Delete Button (삭제)**: `background: rgba(239, 68, 68, 0.15)`, `border: 1px solid #EF4444`, Color: `#FCA5A5`

---

## 5. 글래스모피즘 & 카드 표면 가이드 (Glassmorphism & Elevation)

사이트 전체 카드 레이아웃은 반투명 유리 느낌의 **글래스모피즘(Glassmorphism)** 효과를 적용하여 고급스러운 레이어감을 선사합니다.

### 5.1 Glass Card CSS 스펙

```css
.glass-card {
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 카드 호버 시 다이내믹 3D 및 글로우 효과 */
.glass-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 242, 254, 0.3);
  box-shadow: 0 12px 40px 0 rgba(0, 242, 254, 0.15);
}
```

---

## 6. 주요 컴포넌트 UI Layout 명세

### 6.1 상단 헤더 & 관리자 토글 (Header & Admin Bar)
* **Header Height**: `72px` (Sticky fixed top, `backdrop-filter: blur(12px)`)
* **로고 디자인**: `남진혁 AI` (Neon Cyan Text) + `Portfolio` (White Text)
* **관리자 버튼**: `🔒 관리자 로그인` (Small Glass Button)
  * 로그인 성공 시: `🟢 Admin Mode Active` (Neon Green Glow Badge + 로그아웃 버튼)

### 6.2 자기소개 히어로 섹션 (Hero & Bio Section)
* **배경**: 중앙 네온 바이올렛 앰비언트 글로우 (`radial-gradient`)
* **프로필 레이아웃**:
  * 왼쪽: `120px × 120px` 원형 프로필 이미지 (Neon Cyan Border Circle)
  * 오른쪽: 이름(남진혁), 역량 태그 칩 그룹, 편집 가능한 본문 Textarea
* **Admin 편집 모드 시**: 자기소개 텍스트 주변에 점선 경계선(`border: 1.5px dashed #00F2FE`) 표시 및 `💾 저장` 버튼 팝업.

### 6.3 작업물 카드 (Project Card)
* **썸네일 비율**: `16 : 9` (Aspect Ratio), `border-top-left-radius: 16px`, `border-top-right-radius: 16px`
* **카드 내부 Padding**: `20px`
* **AI 도구 태그 칩 (Tool Tag Chips)**:
  * `ChatGPT-4o` -> Greenish Glass Tag (`rgba(16, 185, 129, 0.2)`)
  * `Claude 3.5` -> Orangeish Glass Tag (`rgba(249, 115, 22, 0.2)`)
  * `Midjourney` -> Purple Glass Tag (`rgba(168, 85, 247, 0.2)`)
* **하단 CTA**: `🚀 바로가기 (Live Demo)` -> Medium Primary Accent Button

---

## 7. 반응형 그리드 & 스페이싱 시스템 (Responsive Grid)

8pt 기반 Grid Spacing 단위를 사용하여 디자인 통합성을 유지합니다.

* **Spacing Units**: `4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`

```
  Desktop (1200px +)     Tablet (768px ~ 1199px)     Mobile (~ 767px)
+--------------------+    +--------------------+    +--------------------+
|  Card | Card | Card|    |   Card  |   Card   |    |       Card         |
|  (3 Columns Grid)  |    |  (2 Columns Grid)  |    |  (1 Column Full)   |
+--------------------+    +--------------------+    +--------------------+
  Gap: 28px                 Gap: 20px                 Gap: 16px
  Container: 1200px         Container: 100% (Padding) Container: 100% (Padding)
```

---

## 8. 프론트엔드 개발자용 CSS 변수 코드 템플릿

개발 시 `style.css` 상단에 바로 복사하여 사용할 수 있는 통합 CSS 코드입니다.

```css
:root {
  /* Color Tokens */
  --bg-main: #0a0e17;
  --bg-surface: rgba(17, 24, 39, 0.65);
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-hover: rgba(0, 242, 254, 0.3);
  
  --accent-cyan-start: #00f2fe;
  --accent-cyan-end: #4facfe;
  --accent-cyan: linear-gradient(135deg, var(--accent-cyan-start), var(--accent-cyan-end));
  
  --accent-violet-start: #7f00ff;
  --accent-violet-end: #a855f7;
  --accent-violet: linear-gradient(135deg, var(--accent-violet-start), var(--accent-violet-end));
  
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  /* Typography */
  --font-main: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-code: 'Fira Code', monospace;

  /* Elevation & Shadow */
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --shadow-neon: 0 0 20px rgba(0, 242, 254, 0.25);

  /* Transitions */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

> **UI/UX 디자이너 노트**: 본 디자인 가이드는 `portfolio/prd.md`에 명시된 다크모드/글래스모피즘 콘셉트를 충실히 구현하기 위해 작성되었습니다. 이 문서를 참조하여 `index.html` 및 `style.css`를 구현하면 최상의 완성도를 얻을 수 있습니다.

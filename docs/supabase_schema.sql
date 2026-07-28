-- ==========================================================================
-- [Supabase Database Schema] 남진혁 AI 포트폴리오 SQL 스크립트
-- 프로젝트 URL: https://brvakuminzqaozxmtjtu.supabase.co
-- 사용법: Supabase 대시보드 -> SQL Editor -> New Query 탭에 복사 후 Run 실행
-- ==========================================================================

-- 1. 강사 프로필 테이블 (profiles) 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI 작업물 테이블 (projects) 생성
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    icon TEXT DEFAULT '🚀',
    tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    demo_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    prompt TEXT NOT NULL,
    tips TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) 정책 설정 (방문자 읽기 허용 & 관리자 쓰기 허용)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 모든 사용자(방문자 포함) 읽기 정책 생성
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on projects" ON public.projects FOR ALL USING (true);

-- 4. 기초 시드 데이터 삽입 (Initial Seed Data)

-- 4.1 프로필 기본 데이터
INSERT INTO public.profiles (id, name, title, bio, skills)
VALUES (
    'main',
    '남진혁',
    'AI 코딩 도구를 활용해 아이디어를 동작하는 시각적 결과물로 구현하고, 수강생들에게 실전 프롬프트와 개발 노하우를 전수합니다.',
    '성인 수강생을 대상으로 AI 기반 웹/앱 개발 교육을 진행하고 있습니다. 복잡한 코딩의 장벽을 넘어, ChatGPT·Claude·Cursor 등 최신 AI 도구를 통해 창의적인 앱을 빠르게 빌드하는 과정을 함께 만들어갑니다.',
    '["ChatGPT-4o", "Claude 3.5 Sonnet", "Cursor IDE", "Midjourney", "HTML5/CSS3/JS"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio,
    skills = EXCLUDED.skills;

-- 4.2 기본 작업물 데이터
INSERT INTO public.projects (id, title, category, "desc", icon, tools, demo_url, github_url, prompt, tips)
VALUES
(
    'proj-1',
    '🥠 AI 포춘쿠키 & 오늘의 운세 웹앱',
    'webapp',
    '클릭하면 쿠키가 깨지는 입체 애니메이션과 함께 AI가 생성한 오늘의 힐링 메시지와 맞춤 운세를 전해주는 웹 애플리케이션입니다.',
    '🥠',
    '["ChatGPT", "HTML5", "Vanilla JS", "CSS3 Animations"]'::jsonb,
    'https://example.com/fortune-cookie',
    'https://github.com/...',
    '너는 운세 및 힐링 메시지 전문가야. 사용자가 포춘쿠키를 클릭하면 부드럽게 쿠키가 두 조각으로 갈라지는 애니메이션과 함께 오늘의 힐링 문구를 카드 형태로 띄워줘.',
    '1. CSS Keyframes 애니메이션을 활용하여 쿠키가 좌우로 갈라지는 효과를 구현했습니다.'
),
(
    'proj-2',
    '🤖 스마트 AI 챗봇 & 대시보드',
    'agent',
    '다양한 페르소나의 AI 조력자와 실시간 대화를 나누고 대화 이력을 관리하는 반응형 챗봇 인터페이스입니다.',
    '🤖',
    '["Claude 3.5", "Cursor IDE", "LocalStorage"]'::jsonb,
    'https://example.com/ai-chatbot',
    '',
    'Claude 3.5를 활용해 다크 모드 기반의 AI 챗봇 UI를 작성해줘.',
    '1. content-visibility: auto 옵션을 사용해 긴 대화 내역도 스크롤이 매끄럽게 동작하도록 최적화했습니다.'
),
(
    'proj-3',
    '⚡ 프롬프트 제네레이터 & 자동화 툴',
    'tool',
    '원하는 서비스 아이디어만 입력하면 AI가 읽기 좋은 구조화된 PRD와 개발용 시스템 프롬프트를 자동으로 생성해 주는 도구입니다.',
    '⚡',
    '["ChatGPT-4o", "Tailwind/Vanilla CSS", "Async/Await JS"]'::jsonb,
    'https://example.com/prompt-gen',
    '',
    '사용자가 입력한 프로젝트 아이디어를 바탕으로 개발에 필요한 4가지 필수 요소를 자동으로 구조화해주는 프롬프트를 작성해줘.',
    '1. 토스트 알림을 결합하여 복사 완료 시 시각적 피드백을 제공합니다.'
)
ON CONFLICT (id) DO NOTHING;

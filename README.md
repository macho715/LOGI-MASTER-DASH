# LOGI MASTER DASH — HVDC + Logistics Integrated Dashboard

> **Monorepo 통합 프로젝트**: HVDC Dashboard와 Logistics Dashboard를 단일 웹 애플리케이션으로 통합

**SSOT 문서**:
- 📊 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 🆕 한눈에 보는 개발 현황 및 다음 단계
- [STATUS.md](./STATUS.md) - 통합 상태 SSOT
- [AGENTS.md](./AGENTS.md) - 코딩 규칙 SSOT
- [docs/INTEGRATION_ROADMAP.md](./docs/INTEGRATION_ROADMAP.md) - 통합 로드맵

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20+
- pnpm 9+
- Supabase 계정 및 프로젝트

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (모든 앱)
pnpm dev

# 특정 앱만 실행
pnpm --filter hvdc-dashboard dev      # 포트 3001
pnpm --filter logistics-dashboard dev # 포트 3000
```

### 환경 변수 설정

루트 `.env.local` 파일을 생성하고 Supabase 키를 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📁 프로젝트 구조

```
/
├── apps/
│   ├── hvdc-dashboard/          # HVDC Dashboard (포트 3001)
│   └── logistics-dashboard/     # Logistics Dashboard (포트 3000)
├── packages/
│   ├── ui-components/           # 공용 UI 컴포넌트
│   └── shared/                 # 공유 타입/유틸리티
├── scripts/                     # ETL/온톨로지 파이프라인
├── configs/                     # 컬럼 SSOT 등 설정 파일
├── supabase/
│   └── migrations/              # Supabase 마이그레이션
└── docs/                        # 프로젝트 문서
```

---

## 🛠️ 개발 가이드

### Monorepo 이관

기존 프로젝트를 Monorepo로 이관하려면:

```bash
# Windows (PowerShell)
.\scripts\migrate-to-monorepo.ps1

# Linux/Mac (Bash)
bash scripts/migrate-to-monorepo.sh
```

### 빌드

```bash
# 모든 앱 빌드
pnpm build

# 특정 앱만 빌드
pnpm --filter hvdc-dashboard build
```

### 테스트

```bash
pnpm test
```

---

## ✨ 주요 기능

### 실시간 KPI 대시보드
- ✅ **Supabase Realtime** 기반 실시간 KPI 업데이트 (2026-01-24 완료)
- ✅ 클라이언트 측 KPI 재계산 (Option A+ 전략)
- ✅ 배치 업데이트 및 성능 모니터링
- ✅ 폴백 폴링 메커니즘 (Realtime 실패 시 자동 전환)
- ✅ 연결 상태 UI 표시

### 통합 레이아웃
- ✅ MapView (좌측) + RightPanel (우측) + HVDC Panel (하단)
- ✅ 모바일 드래그 제스처 지원
- ✅ 접근성 개선 (WCAG 2.2 AA 준수)

### 데이터 통합
- ✅ Supabase 단일 DB (SSOT)
- ✅ Flow Code v3.5 계산 및 검증
- ✅ RLS (Row Level Security) 정책 적용
- ✅ JSON → RDF(Turtle) 파이프라인

---

## 📚 주요 문서

- 📊 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 🆕 한눈에 보는 개발 현황 및 다음 단계
- [SETUP.md](./SETUP.md) - 로컬/CI 설정 가이드
- [CHANGELOG.md](./CHANGELOG.md) - 변경 이력
- [STATUS (통합 상태 SSOT)](./STATUS.md)
- [INTEGRATION_STATUS (상세 통합 상태)](./docs/INTEGRATION_STATUS.md)
- [NEXT_STEPS_PRIORITY (우선순위/실행 계획)](./docs/NEXT_STEPS_PRIORITY.md)
- [MIGRATION_CHECKLIST](./docs/MIGRATION_CHECKLIST.md)
- [MIGRATION_COMPLETION_REPORT](./docs/MIGRATION_COMPLETION_REPORT.md)
- [시스템 아키텍처](./docs/architecture.md)
- [통합 로드맵](./docs/INTEGRATION_ROADMAP.md)
- [Realtime 구현 가이드](./docs/REALTIME_IMPLEMENTATION.md)
- [대시보드 레이아웃 사양](./docs/DASHBOARD_LAYOUT.md) - 🆕 통합 대시보드 레이아웃 상세 사양
- [ETL 스크립트 가이드](./docs/ETL_GUIDE.md) - 🆕 Supabase 데이터 적재 ETL 가이드
- [데이터 적재 작업 계획](./docs/DATA_LOADING_PLAN.md) - 🆕 Supabase 데이터 적재 단계별 실행 계획
- [프로젝트 구조 가이드](./docs/PROJECT_STRUCTURE.md) - 🆕 프로젝트 구조 온보딩 가이드
- [데이터 로딩 실행 가이드](./REPO_EXECUTION_GUIDE_HVDC_DATA_LOADING.md) - 실제 레포 구조 기반 실행 가이드
- [데이터 로딩 Runbook](./docs/DATA_LOADING_RUNBOOK.md) - 🆕 Phase 1~7 상세 실행 가이드
- [데이터 로딩 리포트 템플릿](./docs/DATA_LOADING_REPORT_TEMPLATE.md) - 🆕 실행 결과 기록 템플릿
- [Realtime KPI 개발 계획](./docs/DEVELOPMENT_PLAN_REALTIME_KPI_DASHBOARD.md) - 🆕 Realtime KPI 개발 계획

---

## 🔧 기술 스택

- **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript 5.9.3
- **상태 관리**: Zustand 5.0.9
- **스타일링**: Tailwind CSS 4
- **지도**: MapLibre GL 5.15.0, deck.gl 9.2.5
- **Backend**: Supabase (PostgreSQL + RLS + Realtime)
- **패키지 관리**: pnpm 9 (workspace)
- **빌드 도구**: Turbo

---

## 📝 라이선스

Private

---

**최종 업데이트**: 2026-01-24

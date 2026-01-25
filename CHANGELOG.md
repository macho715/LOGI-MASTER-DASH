# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (2026-01-25)
- Phase 2~6 완료: DDL 적용, CSV 적재 (871 shipments + 928 events), Gate 1 QA, Realtime 활성화
- `public.shipments` 뷰 생성 (`supabase/migrations/20260125_public_shipments_view.sql`), Worklist API `public.shipments` 조회 전환
- 로컬 대시보드 테스트 완료: `apps/logistics-dashboard/.env.local` Supabase 설정 후 `/api/worklist` 871 rows·KPI 정상 반환
- `scripts/hvdc/check_dashboard_data.py`, `verify_realtime_publication.py`, `check_status_tables.py` (Phase 4 검증) 추가·확장
- `gate1_qa.py` `--json` / `-j` 출력 모드 추가
- `load_csv.py` events_status UPSERT + FK 필터 지원 (duplicate key 방지)

### Fixed
- ✅ Vercel 배포 성공: monorepo 구조에서 Next.js 감지 및 빌드 정상 동작 확인
  - 배포 URL: https://logimasterdash-rkz2dqsc8-chas-projects-08028e73.vercel.app/
  - 해결된 문제: Next.js 감지 실패, pnpm 워크스페이스 해결, monorepo 빌드 설정

### Added
- 핸드오프 문서 번들 추가 (`SETUP.md`, `.env.example`, `CHANGELOG.md`)
- plan.md 요약/상세 불일치 탐지 PoC 추가 (`packages/doc-intelligence`)
- Realtime KPI Dashboard 구현 (Supabase Realtime 기반 실시간 KPI 업데이트)
  - `useSupabaseRealtime` 제네릭 Realtime 훅
  - `useKpiRealtime` KPI 전용 Realtime 훅
  - `useInitialDataLoad` 초기 데이터 로드 훅
  - `useBatchUpdates` 배치 업데이트 훅
  - `ConnectionStatusBadge` 연결 상태 UI 컴포넌트
  - Realtime 마이그레이션 스크립트 (`supabase/migrations/20260124_enable_realtime.sql`)
- Gate 1 QA Python runner 추가 (`scripts/hvdc/gate1_qa.py`)

### Changed
- docs: consolidate logi-cockpit-docs docs into root docs/* and mark originals as templates
- hvdc scripts/docs: add `--connect-timeout` support, default timeout, redacted DB URL logging, and Session pooler troubleshooting standard

### Deprecated

### Removed

### Fixed
- 루트 `package.json`에 `packageManager: "pnpm@10.28.0"` 필드 추가 (pnpm 워크스페이스 해결을 위해 필요)
- Vercel 배포 시 서브모듈 페치 경고를 유발하던 레거시 서브모듈 엔트리 제거
- Vercel Next.js 감지를 위해 루트 `package.json`에 `next` 의존성 추가

### Security

---

## [0.1.0] - YYYY-MM-DD

### Added
- 초기 릴리즈

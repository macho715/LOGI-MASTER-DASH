# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Changed
- docs: consolidate logi-cockpit-docs docs into root docs/* and mark originals as templates

### Deprecated

### Removed

### Fixed
- 루트 `package.json`의 `packageManager` 필드 제거 (Turborepo 호환성 문제 해결)
- Vercel 배포 시 서브모듈 페치 경고를 유발하던 레거시 서브모듈 엔트리 제거
- Vercel이 Next.js 앱을 감지하도록 `apps/logistics-dashboard` 빌드 지정 추가

### Security

---

## [0.1.0] - YYYY-MM-DD

### Added
- 초기 릴리즈

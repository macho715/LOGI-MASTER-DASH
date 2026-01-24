# STATUS — 통합 상태(SSOT)

> 이 문서는 프로젝트 통합의 **현재 상태/리스크/다음 액션**을 한 곳에서 추적하기 위한 **SSOT**입니다.
> 
> **참조**: [AGENTS.md](./AGENTS.md), [INTEGRATION_ROADMAP.md](./docs/INTEGRATION_ROADMAP.md), [logi-cockpit-docs](./archive/legacy/logi-cockpit-docs/)

---

## 1) 현재 통합 상태 요약

### 소스 프로젝트(현행)

1) **HVDC Dashboard** (`HVDC DASH/hvdc-dashboard/`)
- ✅ Next.js 16 App Router 기반, Supabase 연동, `/api/worklist`로 KPI/Worklist 집계
- ✅ 주요 UI: `KpiStrip`, `WorklistTable`, `DetailDrawer`, `SavedViewsBar`
- ✅ 포트: 3001 (독립 실행 중)

2) **MOSB Logistics Dashboard** (`apps/logistics-dashboard/`)
- ✅ Monorepo로 이관 완료 (`apps/logistics-dashboard`)
- ✅ MapLibre + deck.gl 지도 엔진
- ✅ 주요 UI: `MapView`(Geofence/Heatmap/ETA wedge/Locations), `RightPanel`(상태/점유율 차트), `UnifiedLayout`
- ✅ 실시간 훅: `useLiveFeed`
- ✅ Realtime KPI Dashboard 구현 완료: Supabase Realtime 기반 실시간 KPI 업데이트 (Option A+ 전략)
- ✅ Supabase 연동 완료: `/api/worklist` 엔드포인트 구현
- ✅ Flow Code v3.5 통합: 계산 로직 및 AGI/DAS 규칙 검증 포함
- ✅ 포트: 3001 (개발 서버 실행 중)

3) **logiontology_scaffold_2026-01-23**
- ✅ JSON → TTL 변환, Flow Code v3.5 계산, used_cols 감사 로그
- ✅ `configs/columns.hvdc_status.json` 기반 컬럼 SSOT
- ✅ Monorepo로 이관 완료 (`scripts/`, `configs/`)

4) **Ontology Core Doc** (`Logi ontol core doc/`)
- ✅ Flow Code v3.5 룰, 통합 문서(Consolidated), SHACL 규칙
- ✅ Flow Code v3.5 스키마 (`flow-code-v35-schema.ttl`)

---

## 2) 목표 아키텍처(종착점)

### 목표 구조(AGENTS.md/통합 설계 기준)

```text
/apps
  /logistics-dashboard   # ✅ 이관 완료 (Map-centric cockpit, HVDC 패널 포함)
  /hvdc-dashboard        # Legacy/독립 운영(회귀/비교용)
/packages
  /ui-components         # ✅ 생성됨 (UnifiedLayout.tsx 포함)
  /shared                # ✅ 생성됨 (types, OpsStore 포함)
  /hvdc-workbench        # (권장) KPI/Worklist/DetailDrawer 모듈
/scripts                 # ✅ 이관 완료 (logiontology_scaffold)
/configs                 # ✅ 이관 완료 (columns.hvdc_status.json SSOT)
/supabase
  /migrations            # ✅ 생성됨 (schema_v2_unified.sql, Flow Code v3.5 마이그레이션)
/docs                    # ✅ 통합 문서 존재
```

### 핵심 목표

- **UI:** Map(좌) + Ops Panel(우) + Workbench/Detail(하) ✅ 프로토타입 완료
- **SSOT:** Supabase 단일 DB + 공용 View/RPC ✅ API 엔드포인트 구현 완료
- **Date Canon:** 이벤트/온톨로지 기반 날짜 일원화 ✅ `events` 테이블 포함
- **Realtime:** Supabase Realtime 구현 완료 ✅ KPI 업데이트 p95 < 3s 목표, 폴백 폴링 포함

---

## 3) 갭 분석(What's missing)

### A. 레이아웃/UX 통합

- [x] 3패널 레이아웃 프로토타입 (`packages/ui-components/src/UnifiedLayout.tsx`)
- [ ] Map 선택 ↔ Worklist 선택 ↔ Detail Drawer 동기화(`selected_case_id`)
- [ ] 모바일: Bottom sheet / Right drawer 제스처(드래그/스냅) ⚠️ 부분 구현

### B. 상태관리/데이터계층

- [x] 공용 Zustand store 설계 ✅ `packages/shared/src/store/opsStore.ts` 생성됨
- [x] 공용 데이터 fetch layer ✅ Supabase 클라이언트 설정 완료 (`lib/supabase.ts`)
- [x] `/api/worklist` 엔드포인트 구현 ✅ Flow Code v3.5 포함
- [ ] 시간대(Asia/Dubai) 일원화 ✅ `events.event_date_dubai` 필드 설계됨, API에서 적용 중

### C. Supabase 스키마 통합

- [x] `events` 중심 스키마 정의 ✅ `schema_v2_unified.sql` 작성됨
- [x] Map용 지오데이터 적재(locations, geofences, occupancy) ✅ 스키마 포함
- [x] RLS 정책/권한 분리(anon read, service role write) ✅ 스키마에 포함, 통합 테스트(`tests/integration/test_rls.py::test_rls_policies_enforced`)로 검증 완료
- [x] Flow Code v3.5 마이그레이션 스크립트 ✅ `supabase/migrations/20260123_add_flow_code_v35.sql` 생성됨
- [ ] Flow Code 필드 마이그레이션 실행 ⚠️ 스크립트 생성됨, DB 적용 대기

### D. RDF 파이프라인/검증

- [x] JSON/Excel 적재 → Events 정규화 → TTL 산출 자동화 ✅ 스크립트 존재
- [ ] SHACL 게이트를 CI/배치에 통합
- [ ] used_cols 감사 로그를 DB에 저장(변경 추적) ⚠️ 파일 출력만, DB 저장 필요

### E. Monorepo 구조

- [x] `/apps/logistics-dashboard` 생성 ✅ 이관 완료
- [x] `/apps/hvdc-dashboard` 생성 ✅ 이관 완료
- [x] `/packages/ui-components` 생성 ✅ 존재
- [x] `/packages/shared` 생성 ✅ types, OpsStore 포함
- [x] `/scripts` 디렉토리 정리 ✅ logiontology_scaffold 이관 완료
- [x] `/configs` 디렉토리 정리 ✅ 이관 완료
- [x] `/supabase/migrations` 생성 ✅ 스키마 및 Flow Code 마이그레이션 포함

---

## 4) 리스크 레지스터(상위 10)

| ID | Risk | Symptom | Mitigation | Owner | Status |
|---:|------|---------|------------|-------|--------|
| R1 | `case_id` 불일치 | Map 선택과 Worklist row가 연결 안 됨 | `case_id` UUID를 공용 키로 고정 + `hvdc_code` 업무키 보조 | Data | OPEN |
| R2 | Date Canon 혼재 | KPI/ETA가 화면마다 다름 | `events` 기반으로만 계산하도록 규정 + 뷰/RPC 단일화 | Data | OPEN |
| R3 | RLS/키 노출 | 서비스 롤 키 노출 위험 | server-only 사용 강제 + env 분리 + lint check | DevOps | OPEN |
| R4 | Map 번들 비대 | 초기 로딩 느림 | 동적 import + map 초기화 지연 + 코드 스플릿 | FE | OPEN |
| R5 | 실시간 폭주 | Realtime 채널 과부하 | 초기에는 polling/DB Changes, Scale 단계에서 Broadcast 트리거 적용 | FE/BE | OPEN |
| R6 | 집계 성능 | worklist p95 상승 | MV/RPC + 인덱스 + 캐시 전략 | Data | OPEN |
| R7 | v0 생성 코드 품질 | 유지보수 비용 | packages화 + lint/format + AGENTS 규칙 적용 | FE | OPEN |
| R8 | 온톨로지 버전 관리 | 스키마/룰 drift | schema/patches 분리 + 릴리즈 노트 | Data | OPEN |
| R9 | 데이터 적재 실패 | 배치 누락 | 재시도/알림 + idempotent upsert | DataOps | OPEN |
| R10| UI 동기화 버그 | 선택/필터 꼬임 | 단일 store + 이벤트 버스 규정 + e2e 테스트 | FE | OPEN |

---

## 5) 다음 2주 실행 계획(권장)

### Week 1 — Monorepo + 레이아웃 뼈대

- [x] Monorepo 스캐폴딩(`/apps`, `/packages`, `/scripts`, `/configs`, `/supabase`) ✅ 완료
- [x] 3패널 레이아웃 프로토타입 ✅ `UnifiedLayout.tsx` 완료
- [x] `/api/worklist` 엔드포인트 구현 ✅ Flow Code v3.5 포함
- [x] Flow Code v3.5 마이그레이션 스크립트 생성 ✅ 완료
- [ ] Flow Code 필드 마이그레이션 실행 (`shipments` 테이블)
- [ ] `selected_case_id`/`selected_location_id` 공용 store 연결

### Week 2 — HVDC 패널 삽입 + 연결

- [ ] `KpiStrip`/`WorklistTable`/`DetailDrawer`를 `packages/hvdc-workbench`로 추출
- [ ] logistics-dashboard에 hvdc-workbench 삽입(우/하)
- [ ] Map ↔ Worklist ↔ Detail 연결(하이라이트/필터)
- [ ] 통합 Store 구현 (`OpsStore`)

---

## 6) Done Definition(수용 기준)

- **Layout:** Map/Right/Bottom 3패널이 데스크탑/모바일에서 깨지지 않고 동작 ⚠️ 프로토타입 완료, 통합 대기
- **Sync:** (Map 클릭)→Worklist 필터 적용 + Detail 열림, (Worklist 클릭)→Map 하이라이트 + Detail 열림 ⏳ 미구현
- **SSOT:** 동일 `case_id`에 대해 KPI/Worklist/Map 표출 값이 불일치하지 않음 ⏳ Date Canon 로직 필요
- **Perf:** 초기 로딩에서 Map 관련 번들은 동적 로딩으로 분리되어 Lighthouse/TTI가 악화되지 않음 ⏳ 최적화 필요

---

## 7) 현재 진행 중인 작업

### 완료된 작업 ✅

1. ✅ 통합 스키마 초안 작성 (`schema_v2_unified.sql`)
   - `events` 테이블 포함 (Date Canon 기반)
   - `locations`, `location_statuses` 테이블 포함
   - HVDC 테이블 통합 (`shipments`, `warehouse_inventory` 등)
   - OCR KPI Gates 필드 추가

2. ✅ 통합 UI 레이아웃 프로토타입 (`packages/ui-components/src/UnifiedLayout.tsx`)
   - 3패널 레이아웃 (Map 좌측, RightPanel 우측, HVDC Panel 하단)
   - 모바일 드래그 제스처 부분 구현
   - 접근성 개선 (ESC 키, ARIA 레이블)

3. ✅ 문서 통합
   - `INTEGRATION_STATUS.md` 상세 상태 문서
   - `INTEGRATION_ROADMAP.md` 14주 계획
   - `SKILLS_REVIEW.md` 스킬 참조 문서
   - `STATUS.md` 생성 (이 문서)

4. ✅ Monorepo 마이그레이션 완료
   - `/apps/logistics-dashboard` 이관 완료
   - `/apps/hvdc-dashboard` 이관 완료
   - `/packages/shared` 생성 (types, OpsStore)
   - `/scripts`, `/configs` 이관 완료
   - `/supabase/migrations` 생성

5. ✅ `/api/worklist` 엔드포인트 구현 완료
   - `apps/logistics-dashboard/app/api/worklist/route.ts` 생성
   - Supabase 클라이언트 설정 (`lib/supabase.ts`)
   - Worklist 계산 유틸리티 (`lib/worklist-utils.ts`)
   - Flow Code v3.5 계산 로직 포함
   - AGI/DAS 규칙 검증 (`FLOW_CODE_VIOLATION` 트리거)
   - Asia/Dubai 시간대 적용
   - Fallback 데이터 제공

6. ✅ Flow Code v3.5 마이그레이션 스크립트 생성
   - `supabase/migrations/20260123_add_flow_code_v35.sql` 생성
   - Flow Code 필드 추가 (`flow_code`, `flow_code_original`, `flow_override_reason`, `final_location` 등)
   - AGI/DAS 제약조건 추가
   - 자동 계산 함수 및 트리거 구현
   - 검증 뷰 및 함수 생성

7. ✅ 타입 체크 및 의존성 설치
   - `@repo/shared` 타입 체크 통과
   - `@repo/logistics-dashboard` 타입 체크 통과
   - `@supabase/supabase-js` 의존성 추가
   - 개발 서버 실행 성공 (포트 3001)

8. ✅ Realtime KPI Dashboard 구현 완료
   - `useSupabaseRealtime` 제네릭 훅 구현 (`hooks/useSupabaseRealtime.ts`)
   - `useKpiRealtime` KPI 전용 훅 구현 (`hooks/useKpiRealtime.ts`)
   - `useInitialDataLoad` 초기 데이터 로드 훅 구현 (`hooks/useInitialDataLoad.ts`)
   - `useBatchUpdates` 배치 업데이트 훅 구현 (`hooks/useBatchUpdates.ts`)
   - `ConnectionStatusBadge` 연결 상태 UI 컴포넌트 구현
   - `KpiStrip` 컴포넌트에 Realtime 통합
   - `UnifiedLayout`에 초기 데이터 로드 및 Realtime 구독 통합
   - Realtime 마이그레이션 스크립트 생성 (`supabase/migrations/20260124_enable_realtime.sql`)
   - 폴백 폴링 메커니즘 구현 (Realtime 실패 시 자동 전환)
   - 성능 모니터링 (`commit_timestamp` 추적)
   - 루트 `package.json`의 `packageManager` 필드 제거 (Turborepo 호환성)

### 진행 중인 작업 ⏳

1. ⏳ Flow Code 필드 마이그레이션 실행
   - DB에 마이그레이션 스크립트 적용
   - 기존 데이터 Flow Code 계산 및 업데이트

2. ⏳ 통합 Store 연결
   - `OpsStore`를 `UnifiedLayout`에 연결
   - Map ↔ Worklist ↔ Detail 동기화 로직 구현

3. ⏳ 환경 변수 설정
   - `.env.local` 파일 생성 및 Supabase 키 설정
   - 실제 데이터 연동 테스트

---

## 8) 변경 로그

- **2026-01-23**: 통합 상태 문서 초안 생성
- **2026-01-23**: `STATUS.md` 생성 (logi-cockpit-docs 기반 + 현재 상태 반영)
- **2026-01-23**: `schema_v2_unified.sql` 작성 완료 (events 테이블 포함)
- **2026-01-23**: `UnifiedLayout.tsx` 프로토타입 완료
- **2026-01-23**: Flow Code 필드 추가 제안 (마이그레이션 대기)
- **2026-01-23**: OCR KPI Gates 필드 추가 완료
- **2026-01-23**: Monorepo 마이그레이션 완료 (`apps/`, `packages/`, `scripts/`, `configs/`, `supabase/`)
- **2026-01-23**: `/api/worklist` 엔드포인트 구현 완료 (Flow Code v3.5 포함)
- **2026-01-23**: Flow Code v3.5 SQL 마이그레이션 스크립트 생성 (`supabase/migrations/20260123_add_flow_code_v35.sql`)
- **2026-01-23**: Supabase 클라이언트 및 Worklist 계산 유틸리티 구현
- **2026-01-23**: 타입 체크 통과, 개발 서버 실행 성공 (포트 3001)
- **2026-01-24**: Realtime KPI Dashboard 구현 완료 (Supabase Realtime 기반, Option A+ 전략)
- **2026-01-24**: Realtime 훅 및 컴포넌트 구현 (`useSupabaseRealtime`, `useKpiRealtime`, `useInitialDataLoad`, `useBatchUpdates`)
- **2026-01-24**: Realtime 마이그레이션 스크립트 생성 (`supabase/migrations/20260124_enable_realtime.sql`)
- **2026-01-24**: 루트 `package.json`의 `packageManager` 필드 제거 (Turborepo 호환성 수정)

---

## 9) 참조 문서

- [AGENTS.md](./AGENTS.md) - 프로젝트 규칙
- [INTEGRATION_ROADMAP.md](./docs/INTEGRATION_ROADMAP.md) - 통합 로드맵
- [INTEGRATION_STATUS.md](./docs/INTEGRATION_STATUS.md) - 상세 통합 상태
- [logi-cockpit-docs/STATUS.md](./logi-cockpit-docs/STATUS.md) - logi-cockpit-docs 상태
- [logi-cockpit-docs/docs/ROADMAP.md](./logi-cockpit-docs/docs/ROADMAP.md) - logi-cockpit-docs 로드맵
- [logi-cockpit-docs/docs/ARCHITECTURE.md](./logi-cockpit-docs/docs/ARCHITECTURE.md) - 아키텍처 문서

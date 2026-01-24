# Roadmap & System Documentation

**Last Updated**: 2026-01-23  
**Reference**: [AGENTS.md](../AGENTS.md), [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md), [SSOT.md](../.cursor/skills/hvdc-logistics-ssot/references/SSOT.md)

---

## Executive Summary

이 문서는 HVDC + Logistics 통합 대시보드 프로젝트의 **단계별 로드맵**과 **시스템 통합 전략**을 정의합니다.

**목표**: 4개의 독립 컴포넌트를 단일 웹 애플리케이션으로 통합
- HVDC DASH (KPI + 워크리스트)
- v0-logistics-dashboard (지도 기반 물류)
- logiontology_scaffold (RDF 파이프라인)
- Logi ontol core doc (Flow Code v3.5)

---

## 1. 통합 전략 개요

### 1.1 통합 원칙

1. **점진적 통합**: 각 컴포넌트의 독립성 유지하면서 통합
2. **Supabase SSOT**: 모든 운영 데이터의 단일 저장소
3. **레이아웃 불변**: MapView (left) + RightPanel (right) + HVDC Panel (bottom)
4. **모바일 우선**: PWA 지원, 터치 제스처, 드래그 가능한 패널
5. **접근성**: WCAG 2.2 AA 준수

### 1.2 통합 단계

```
Phase 1: Monorepo 구조 생성 (1-2주)
  ↓
Phase 2: 레이아웃 통합 (2-3주)
  ↓
Phase 3: 데이터 통합 (2-3주)
  ↓
Phase 4: Flow Code 통합 (1-2주)
  ↓
Phase 5: 최적화 및 검증 (1-2주)
```

---

## 2. Phase 1: Monorepo 구조 생성

### 2.1 목표

프로젝트를 표준 Monorepo 구조로 재구성하여 통합 기반 마련

### 2.2 작업 항목

**Monorepo 구조 생성**:
- [ ] `/apps/hvdc-dashboard` 생성
  - `HVDC DASH/hvdc-dashboard/` → `/apps/hvdc-dashboard/` 이동
  - 의존성 확인 및 업데이트
- [ ] `/apps/logistics-dashboard` 생성
  - `v0-logistics-dashboard-build-main/` → `/apps/logistics-dashboard/` 이동
  - 의존성 확인 및 업데이트
- [ ] `/packages/ui-components` 생성
  - 공유 컴포넌트 추출 (Button, Card, Badge 등)
  - TypeScript 설정
- [ ] `/scripts` 생성
  - `logiontology_scaffold_2026-01-23/scripts/` → `/scripts/` 이동
  - `logiontology_scaffold_2026-01-23/configs/` → `/configs/` 이동
  - `logiontology_scaffold_2026-01-23/models/` → `/models/` 이동
  - `logiontology_scaffold_2026-01-23/rules/` → `/rules/` 이동
- [ ] `/supabase` 또는 `/migrations` 생성
  - `HVDC DASH/database/` → `/supabase/migrations/` 이동
- [ ] 루트 `package.json` 설정 (Turborepo 또는 pnpm workspace)
- [ ] 루트 `tsconfig.json` 설정

**검증**:
- [ ] 각 앱 독립 실행 가능
- [ ] 공유 패키지 import 정상 작동
- [ ] 스크립트 실행 경로 확인

### 2.3 예상 기간

**1-2주**

---

## 3. Phase 2: 레이아웃 통합

### 3.1 목표

MapView + RightPanel + HVDC Panel 통합 레이아웃 구현

### 3.2 작업 항목

**통합 레이아웃 컴포넌트**:
- [ ] `packages/ui-components/UnifiedLayout.tsx` 생성
  - Grid 레이아웃 (MapView 60% + RightPanel 20% + HVDC Panel 20%)
  - 반응형 레이아웃 (데스크톱/모바일)

**MapView 통합**:
- [ ] `apps/logistics-dashboard/components/map/MapView.tsx` → 공유 컴포넌트
- [ ] 의존성 확인 (deck.gl, maplibre-gl)
- [ ] 레이어 통합 (Location, Heatmap, Geofence, ETA Wedge)

**RightPanel 통합**:
- [ ] `apps/logistics-dashboard/components/dashboard/RightPanel.tsx` → 공유 컴포넌트
- [ ] 상태 정보 표시 (위치 상태, 이벤트 목록, 점유율)

**HVDC Panel 통합**:
- [ ] `apps/hvdc-dashboard/components/dashboard/` → 통합 레이아웃에 통합
- [ ] KpiStrip + WorklistTable + DetailDrawer
- [ ] Gate 로직 (RED/AMBER/GREEN/ZERO) 유지

**모바일 인터랙션**:
- [ ] 하단 패널 드래그 (react-resizable-panels 또는 커스텀)
- [ ] 우측 패널 슬라이드 드로어
- [ ] 터치 제스처 지원

**공유 상태 관리**:
- [ ] 통합 Zustand store 생성
- [ ] 위치 선택 → HVDC 워크리스트 필터링 로직
- [ ] 상태 동기화 (MapView ↔ HVDC Panel)

**검증**:
- [ ] 데스크톱 레이아웃 정상 작동
- [ ] 모바일 인터랙션 정상 작동
- [ ] 상태 동기화 정상 작동
- [ ] WCAG 2.2 AA 준수

### 3.3 예상 기간

**2-3주**

---

## 4. Phase 3: 데이터 통합

### 4.1 목표

Supabase 스키마 통합 및 데이터 일관성 확보

### 4.2 작업 항목

**Supabase 스키마 통합**:
- [ ] `locations` 테이블 생성
  - 물류 위치 (포트, 창고, 현장)
  - location_id, name, lat, lon, siteType
- [ ] `location_statuses` 테이블 생성
  - 위치별 실시간 상태
  - location_id, occupancy_rate, status_code, last_updated
- [ ] `events` 테이블 생성
  - 이벤트 로그
  - event_id, ts, shpt_no, status, location_id, lat, lon
- [ ] `shipments` ↔ `locations` 관계 정의
- [ ] Site Arrival Date 필드 확인
  - HVDC: `warehouse_inventory.project_shu2` (DATE)
  - RDF: `hvdc:hasSHUArrivalDate` (xsd:date)
  - 매핑 일관성 유지

**RLS 정책 정의**:
- [ ] 모든 테이블에 RLS 활성화
- [ ] 정책 정의 및 테스트
- [ ] 읽기/쓰기 권한 분리

**RDF 파이프라인 통합**:
- [ ] JSON → TTL 변환 자동화 (스케줄러 또는 Edge Function)
- [ ] used_cols 감사 로그 Supabase 저장 (`logs` 테이블)
- [ ] 컬럼 매핑 SSOT 유지 (`configs/columns.hvdc_status.json`)

**API 통합**:
- [ ] `/api/locations` 엔드포인트 생성
- [ ] `/api/location-statuses` 엔드포인트 생성
- [ ] `/api/events` 엔드포인트 생성
- [ ] 실시간 피드 통합 (Supabase Realtime)
  - Filtered channels
  - Minimal payload
  - Merge/debounce

**데이터 마이그레이션**:
- [ ] 기존 데이터 보존
- [ ] 점진적 마이그레이션
- [ ] 롤백 계획 수립

**검증**:
- [ ] 모든 테이블 접근 가능
- [ ] RLS 정책 정상 작동
- [ ] 실시간 업데이트 정상 작동
- [ ] 데이터 일관성 확인

### 4.3 예상 기간

**2-3주**

---

## 5. Phase 4: Flow Code 통합

### 5.1 목표

Flow Code v3.5 로직 통합 및 검증

### 5.2 작업 항목

**Flow Code v3.5 로직 통합**:
- [ ] `logiontology_scaffold/scripts/core/flow_code_calc.py` → 공유 로직
- [ ] TypeScript/JavaScript 포팅 또는 Python API 호출
- [ ] Flow Code 계산 정확성 검증

**AGI/DAS 자동 업그레이드**:
- [ ] Flow 0/1/2 → Flow 3 자동 업그레이드
- [ ] 원본 보존 (`hasFlowCodeOriginal`)
- [ ] 이유 기록 (`hasFlowOverrideReason`)

**SHACL 검증 통합**:
- [ ] SHACL 검증 엔드포인트 생성
- [ ] 검증 결과 저장
- [ ] 검증 규칙:
  - Flow Code ∈ [0..5] + domain routing rules
  - Invoice math integrity
  - Site Arrival Date datatype
  - Boolean-date consistency
  - AGI/DAS Flow ≥ 3 constraint
  - Chronology (ETD ≤ ATD ≤ ATA)

**대시보드에 Flow Code 표시**:
- [ ] WorklistTable에 Flow Code 컬럼 추가
- [ ] 지도에 Flow Code 시각화
- [ ] 필터링 기능 추가

**검증**:
- [ ] Flow Code 계산 정확성
- [ ] AGI/DAS 자동 업그레이드 정상 작동
- [ ] SHACL 검증 정상 작동

### 5.3 예상 기간

**1-2주**

---

## 6. Phase 5: 최적화 및 검증

### 6.1 목표

성능 최적화 및 Gate 1/2/3 검증 완료

### 6.2 작업 항목

**성능 최적화**:
- [ ] Frontend 최적화
  - Skeleton loading
  - Virtualization (대용량 리스트)
  - Realtime merge/debounce
- [ ] Backend 최적화
  - Cursor-based pagination
  - Indexes on cursor fields
  - Realtime filtered channels
- [ ] Integration 최적화
  - Sync lag p95 ≤ 300s
  - Validation latency p95 < 5s

**Gate 1: 데이터 모델 검증**:
- [ ] Supabase 스키마 통합 완료
- [ ] RLS 정책 정의 및 테스트
- [ ] 마이그레이션 계획 수립
- [ ] 정규화 유지 확인

**Gate 2: UI·UX 통합 검증**:
- [ ] 레이아웃 불변 준수 (Map + Panel + HVDC)
- [ ] 모바일 인터랙션 구현
- [ ] WCAG 2.2 AA 검증 완료
- [ ] 핵심 사용자 플로우 회귀 없음
- [ ] ≥80% positive user test feedback

**Gate 3: 성능 검증**:
- [ ] 평균 응답 시간 < 1s
- [ ] p95 < 3s (워크리스트 로드, 상태 패널 새로고침)
- [ ] Realtime 구독 성능 검증
- [ ] 부하 테스트 통과

**OCR 게이트 검증**:
- [ ] MeanConf ≥ 0.92
- [ ] TableAcc ≥ 0.98
- [ ] NumericIntegrity = 1.00
- [ ] Fail-safe: 게이트 실패 시 ZERO 모드

**문서화**:
- [ ] API 문서 업데이트
- [ ] 사용자 가이드 작성
- [ ] 개발자 가이드 작성
- [ ] CHANGELOG.md 업데이트

### 6.3 예상 기간

**1-2주**

---

## 7. 통합 일정 요약

| Phase | 기간 | 주요 작업 | 검증 기준 |
|-------|------|----------|----------|
| Phase 1 | 1-2주 | Monorepo 구조 생성 | 각 앱 독립 실행 가능 |
| Phase 2 | 2-3주 | 레이아웃 통합 | 데스크톱/모바일 레이아웃 정상 작동 |
| Phase 3 | 2-3주 | 데이터 통합 | RLS 정책 정상 작동, 데이터 일관성 |
| Phase 4 | 1-2주 | Flow Code 통합 | Flow Code 계산 정확성 |
| Phase 5 | 1-2주 | 최적화 및 검증 | Gate 1/2/3 통과 |
| **총계** | **7-12주** | | |

---

## 8. 리스크 관리

### 8.1 주요 리스크

| 리스크 | 영향도 | 완화 방안 |
|--------|--------|----------|
| 데이터 불일치 | High | Site Arrival Date 필드 일관성 확인, 마이그레이션 계획 수립 |
| 상태 관리 복잡도 | Medium | 통합 Store 설계 단계에서 충분한 검토 |
| 성능 저하 | Medium | 레이어 최적화, 가상화, Realtime 최적화 |
| 모바일 UX 회귀 | High | 모바일 테스트 강화, 사용자 피드백 수집 |
| RLS 정책 복잡도 | Medium | 정책 정의 단계에서 충분한 검토 및 테스트 |

### 8.2 완화 전략

- **데이터 불일치**: 마이그레이션 전 데이터 검증, 롤백 계획 수립
- **상태 관리 복잡도**: 통합 Store 설계 단계에서 프로토타입 검증
- **성능 저하**: 성능 테스트 자동화, 지속적 모니터링
- **모바일 UX 회귀**: 모바일 테스트 자동화, 사용자 피드백 수집
- **RLS 정책 복잡도**: 정책 정의 단계에서 충분한 검토 및 테스트

---

## 9. 다음 단계

### 즉시 실행 가능

1. ✅ 통합 상태 문서 생성 (INTEGRATION_STATUS.md)
2. ✅ 아키텍처 문서 확장 (architecture.md)
3. ✅ 로드맵 문서 확장 (roadmap_system_doc.md)
4. [ ] Monorepo 마이그레이션 가이드 작성
5. [ ] 통합 테스트 계획 수립 (`plan.md` 업데이트)
6. [ ] 스킬 업데이트 (통합 구조 반영)

### Phase 1 시작 전 준비

- [ ] Monorepo 도구 선택 (Turborepo vs pnpm workspace)
- [ ] 마이그레이션 계획 수립
- [ ] 백업 및 롤백 계획
- [ ] 팀 리뷰 및 승인

---

## 10. 참조 문서

- [AGENTS.md](../AGENTS.md) - 프로젝트 규칙
- [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) - 통합 상태
- [architecture.md](./architecture.md) - 시스템 아키텍처
- [constitution.md](./constitution.md) - 프로젝트 헌법
- [SSOT.md](../.cursor/skills/hvdc-logistics-ssot/references/SSOT.md) - 단일 진실원

---

**문서 버전**: 1.0  
**최종 업데이트**: 2026-01-23

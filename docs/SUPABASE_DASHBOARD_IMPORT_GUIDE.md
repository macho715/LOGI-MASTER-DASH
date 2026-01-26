# Supabase Dashboard CSV Import 가이드 (가장 쉬운 방법)

> 네트워크 연결 문제나 psql/Python 스크립트 실행이 어려울 때 사용하는 **가장 간단한 방법**

---

## ✅ 준비사항

- Supabase Dashboard 접속 가능
- 업로드할 CSV 파일 위치 확인

**Status 레이어 CSV 파일:**
- `c:\LOGI MASTER DASH\hvdc_output\supabase\shipments_status.csv`
- `c:\LOGI MASTER DASH\hvdc_output\supabase\events_status.csv`

---

## 📋 단계별 실행

### 1단계: shipments_status 테이블에 데이터 적재

1. **[Supabase Dashboard](https://supabase.com/dashboard)** 접속
2. 프로젝트 선택 (rkfffveonaskewwzghex)
3. 왼쪽 메뉴에서 **"Table Editor"** 클릭
4. 상단에서 **스키마 선택**: `status` 선택
5. 테이블 목록에서 **`shipments_status`** 클릭
6. 상단 메뉴에서 **"Import data"** 버튼 클릭
7. **"Upload CSV file"** 선택
8. 파일 선택: `c:\LOGI MASTER DASH\hvdc_output\supabase\shipments_status.csv`
9. 컬럼 매핑 확인 (자동으로 매핑됨)
10. **"Import"** 버튼 클릭
11. 성공 메시지 확인 (예: "X rows imported successfully")

### 2단계: events_status 테이블에 데이터 적재

1. Table Editor에서 **`status.events_status`** 테이블 선택
2. **"Import data"** 버튼 클릭
3. 파일 선택: `c:\LOGI MASTER DASH\hvdc_output\supabase\events_status.csv`
4. 컬럼 매핑 확인
5. **"Import"** 버튼 클릭
6. 성공 메시지 확인

---

## ✅ 완료 확인

Table Editor에서 다음을 확인:

1. **`status.shipments_status`** 테이블
   - 행 수 확인 (예: 8,804 rows)
   - 데이터 미리보기 확인

2. **`status.events_status`** 테이블
   - 행 수 확인
   - 데이터 미리보기 확인

---

## ⚠️ 주의사항

- **기존 데이터가 있는 경우**: Import 시 기존 데이터와 충돌할 수 있습니다. 필요시 Table Editor에서 기존 데이터를 삭제한 후 Import하세요.
- **컬럼 매핑**: CSV 헤더와 테이블 컬럼명이 일치해야 합니다. 자동 매핑이 안 되면 수동으로 매핑하세요.
- **파일 크기**: 매우 큰 파일(수백 MB 이상)은 Dashboard Import가 느릴 수 있습니다. 이 경우 Python 스크립트 사용을 고려하세요.

---

## 🎯 다음 단계

Status 레이어 적재가 완료되면:

1. **Gate 1 QA 검증** (선택사항)
   - Dashboard → SQL Editor에서 `scripts/hvdc/gate1_qa.sql` 실행

2. **대시보드에서 데이터 확인**
   - `http://localhost:3001` 접속
   - 맵 레이어에서 실제 데이터가 표시되는지 확인

---

## 📚 참고 문서

- [PHASE4_CSV_LOADING_PLAN.md](./PHASE4_CSV_LOADING_PLAN.md) - 전체 적재 계획
- [SUPABASE_LOADING_HYBRID_STRATEGY.md](./SUPABASE_LOADING_HYBRID_STRATEGY.md) - 하이브리드 전략

---

**Last updated**: 2026-01-25

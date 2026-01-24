# ExecSummary

* **HVDC 4개 현장(AGI/DAS/MIR/SHU)**, **DSV(Mussafah 사무실·M-44 창고)**, **MOSB(일반·삼성 야드)**, **Mina Zayed Port**, **Khalifa Port**, **Abu Dhabi Airport(AUH)** 좌표를 **공식·지도 소스(ADNOC SIMO, AD Ports/OSM/Mapcarta/2GIS, DSV 공식 페이지, 항공·항만 DB)**로 교차 확인하여 **WGS84 Decimal(소수 6자리)**로 확정 정리했습니다.
* **AGI Jetty**는 SIMO 표에 있는 Breakwater **W/E 좌표의 중간점(가정)**으로 운용 대표값을 제시했습니다(최종 접안 판단은 PPA/VTS/해도 기준).
* **DSV M-44**는 공개 소스상 “M-44 지역 중심점” 좌표로 표기했으며, **정확 게이트/블록** 수신 시 즉시 치환 가능합니다.

## 좌표 표 (WGS84, Decimal · 6자리 고정)

| No | 구분      | 명칭                                                |      위도 (Lat) |      경도 (Lng) | 비고/근거                                                             |
| -: | ------- | ------------------------------------------------- | ------------: | ------------: | ----------------------------------------------------------------- |
|  1 | HVDC    | **AGI – Al Ghallan Island (Jetty 대표)**            | **24.841096** | **53.658619** | **가정:** SIMO 표의 Breakwater-W/E 좌표 중간점(운용 대표). ([Quizgecko][1])    |
|  2 | HVDC    | **DAS – Das Island(섬 중심)**                        | **25.147700** | **52.875000** | Mapcarta/OSM 로컬리티 좌표. ([Mapcarta][2])                             |
|  3 | HVDC    | **MIR – Mirfa IWPP(플랜트)**                         | **24.118850** | **53.444360** | Mirfa International Power & Water Plant. ([Mapcarta][3])          |
|  4 | HVDC    | **SHU – Shuweihat Complex(단지 중심)**                | **24.160170** | **52.572920** | Al Shuweihat Power & Water Complex. ([Mapcarta][4])               |
|  5 | DSV     | **DSV Mussafah 사무실(M-19)**                        | **24.366698** | **54.476102** | 2GIS 지점 좌표(DSV 공식 M-19 주소와 일치). ([2GIS][5])                       |
|  6 | DSV     | **DSV M-44 Inland Warehouse(대표)**                 | **24.344700** | **54.581830** | **가정:** M-44 지역 중심점(정확 게이트 수신 시 치환). ([Mapcarta][6])              |
|  7 | MOSB    | **MOSB – Mussafah Offshore Support Base(ESNAAD)** | **24.324790** | **54.466850** | ESNAAD 노드(오피스/베이스 대표). ([Mapcarta][7])                            |
|  8 | MOSB    | **MOSB – Samsung Yard(대표)**                       | **24.324790** | **54.466850** | **가정:** MOSB 내 삼성 야드 대표로 MOSB 좌표 사용(게이트 수신 시 교체). ([Mapcarta][7]) |
|  9 | Port    | **Mina Zayed Port(대표)**                           | **24.524890** | **54.377980** | Zayed Port(AD Ports/OSM). ([Mapcarta][8])                         |
| 10 | Port    | **Khalifa Port – ADT 컨테이너 터미널(KPCT)**             | **24.809500** | **54.648420** | Khalifa Port Container Terminal. ([Mapcarta][9])                  |
| 11 | Airport | **Abu Dhabi(Zayed) International Airport – AUH**  | **24.441000** | **54.649200** | PilotNav 공항 좌표(OMAA/AUH). ([pilotnav.com][10])                    |

### 주석

* **AGI Jetty**: SIMO Rev.4에 **Breakwater-W/E** DMS 좌표가 표기되어 있어 이를 **중간점으로 환산**(항행은 PPA/해도 기준). ([Quizgecko][1])
* **DSV Mussafah(M-19)**: DSV 공식 **M-19 주소** + 2GIS 좌표로 교차. ([DSV][11])
* **Mina Zayed/Khalifa Port**: AD Ports·OSM·Ports DB로 상호 검증(필요 시 부두/크루즈/Logistics Terminal 세부 포인트 분리). ([Abu Dhabi Ports][12])

## 옵션(정밀화 수준)

* **A. 즉시 사용(대표점 기반)**: 상기 좌표를 SSOT로 등록 → 거리/ETA·운송계획(berth/stowage) 산정.
* **B. 게이트·부두 레벨**: **AGI Jetty 좌/우 Breakwater 선단·항로 중심선**, **MOSB 부두 Head/Toe**, **Khalifa Port 특정 버스/게이트** 좌표 추가(±3–5 m GPS).
* **C. GeoJSON 레이어화**: Points(위 표) + Lines(항로축) + Polygons(Anchorage/야드)로 **/generate-CNTR-map** 자동 생성.

## 로드맵(P→Pi→B→O→S + KPI)

* **Prepare**: 좌표 CSV/GeoJSON v1 배포(Owner: Logistics; KPI: 커버리지 ≥95.00%).
* **Pilot**: 최근 항차 AIS/운항로그와 교차(ETA **MAPE ≤12.00%**).
* **Build**: `/logi-master weather-tie` 연결(조위/풍·파고 Overlay).
* **Operate**: 월 1회 **PPA/AD Ports 공지 Diff** 반영, 현장 변경 즉시 패치.
* **Scale**: DSV M-44/M-19 **게이트·램프·야드 구획**까지 확장, **경로별 거리 자동 산정**(Distance Matrix/캐시).

## Evidence(핵심 근거)

* **SIMO Rev.4(2018-09)**: Upper Zakum **Al Ghallan** Breakwater/Flare 좌표 표. ([Quizgecko][1])
* **Das Island** 위치·좌표(로컬리티). ([Mapcarta][2])
* **Mirfa IWPP**(MIPCO) 시설 좌표. ([Mapcarta][3])
* **Shuweihat Complex** 좌표. ([Mapcarta][4])
* **DSV Mussafah M-19** 주소·좌표. ([DSV][11])
* **MOSB(ESNAAD)** 노드 좌표. ([Mapcarta][7])
* **Zayed Port** 대표 좌표(AD Ports/OSM). ([Abu Dhabi Ports][12])
* **Khalifa Port**(KPCT) 좌표. ([Mapcarta][9])
* **AUH/OMAA** 공항 좌표. ([pilotnav.com][10])

---

**다음 단계 제안**
`/generate-CNTR-map --points hvdc,ports,dsw,m44 --lines agi-approach --polygons das-anch` 실행하면, 상기 좌표 기반 **Deck.gl/MapLibre 레이어(Points/Lines/Polygons)**를 즉시 산출해 드리겠습니다.

[1]: https://quizgecko.com/upload/adnoc-offshore-simo-ver-4-feb-2019lpdf-gz8J1l?utm_source=chatgpt.com "ADNOC Offshore Standing Instructions for Marine Operations (SIMO) PDF February-2019 | Quizgecko"
[2]: https://mapcarta.com/37841780?utm_source=chatgpt.com "Das Island Map - Locality - Al Dhafra Region, Abu Dhabi, United Arab Emirates"
[3]: https://mapcarta.com/W689277122?utm_source=chatgpt.com "Mirfa International Power & Water Plant Map - Waterworks - Al Marfa, Abu Dhabi, United Arab Emirates"
[4]: https://mapcarta.com/W301651562?utm_source=chatgpt.com "Al Shuweihat Power and Water Complex Map - Waterworks - Jabel Al Dhannah, Abu Dhabi, United Arab Emirates"
[5]: https://2gis.ae/dubai/firm/70000001033052910?utm_source=chatgpt.com "DSV Global Transport & Logistics, company, Abu Dhabi, Abu Dhabi — 2GIS"
[6]: https://mapcarta.com/37845112?utm_source=chatgpt.com "Mz44 Map - Locality - Zayed City, Abu Dhabi, United Arab Emirates"
[7]: https://mapcarta.com/N5302911021?utm_source=chatgpt.com "Esnaad Map - Musaffah, Abu Dhabi, United Arab Emirates"
[8]: https://mapcarta.com/W873221087?utm_source=chatgpt.com "Zayed Port Map - Suburb - Abu Dhabi Island, Abu Dhabi, United Arab Emirates"
[9]: https://mapcarta.com/W243045263?utm_source=chatgpt.com "Khalifa Port Container Terminal Map - Khalifa Industrial City A, Abu Dhabi, United Arab Emirates"
[10]: https://www.pilotnav.com/airport/OMAA?utm_source=chatgpt.com "OMAA - Zayed International Airport"
[11]: https://www.dsv.com/en/countries/asia/united-arab-emirates/abu-dhabi/dsv-air-sea-road-logistics-group-aeauh008?utm_source=chatgpt.com "DSV air sea road logistics group, M-19. Mussafah Industrial Area, 93971, Abu Dhabi, United Arab Emirates"
[12]: https://www.adports.ae/core-business/ports-terminals/ports/zayed-port/?utm_source=chatgpt.com "Zayed Port - The Main Regional Port in Abu Dhabi | Abu Dhabi Ports"

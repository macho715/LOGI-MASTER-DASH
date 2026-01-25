/**
 * POI locations SSOT (reakmapping §1·§3). WGS84 decimal degrees, 6dp.
 */

import type { PoiLocation } from "./poiTypes"

export const POI_LOCATIONS: ReadonlyArray<PoiLocation> = [
  {
    id: "agi-jetty",
    code: "AGI",
    name: "AGI – Al Ghallan Island (Jetty 대표)",
    category: "HVDC_SITE",
    latitude: 24.841096,
    longitude: 53.658619,
    summary: "HVDC Site - Jetty (rep.)",
    priority: 900,
    tags: ["HVDC", "site"],
  },
  {
    id: "das-island",
    code: "DAS",
    name: "DAS – Das Island(섬 중심)",
    category: "HVDC_SITE",
    latitude: 25.1477,
    longitude: 52.875,
    summary: "HVDC Site - Island",
    priority: 890,
    tags: ["HVDC", "site"],
  },
  {
    id: "mirfa-iwpp",
    code: "MIR",
    name: "MIR – Mirfa IWPP(플랜트)",
    category: "HVDC_SITE",
    latitude: 24.11885,
    longitude: 53.44436,
    summary: "HVDC Site - IWPP",
    priority: 880,
    tags: ["HVDC", "site"],
  },
  {
    id: "shuweihat-complex",
    code: "SHU",
    name: "SHU – Shuweihat Complex(단지 중심)",
    category: "HVDC_SITE",
    latitude: 24.16017,
    longitude: 52.57292,
    summary: "HVDC Site - Complex",
    priority: 870,
    tags: ["HVDC", "site"],
  },
  {
    id: "dsv-mussafah-office-m19",
    code: "DSV-M19",
    name: "DSV Mussafah 사무실(M-19)",
    category: "OFFICE",
    latitude: 24.366698,
    longitude: 54.476102,
    summary: "Office - DSV (M-19)",
    priority: 800,
    tags: ["DSV", "office"],
  },
  {
    id: "dsv-mussafah-warehouse-m44",
    code: "DSV-M44",
    name: "DSV M-44 Inland Warehouse(대표)",
    category: "WAREHOUSE",
    latitude: 24.3447,
    longitude: 54.58183,
    summary: "Warehouse - DSV (M-44)",
    priority: 790,
    tags: ["DSV", "warehouse"],
  },
  {
    id: "mosb-esnaad",
    code: "MOSB",
    name: "MOSB – Mussafah Offshore Support Base(ESNAAD)",
    category: "YARD",
    latitude: 24.32479,
    longitude: 54.46685,
    summary: "Yard - MOSB (ESNAAD)",
    priority: 780,
    tags: ["MOSB", "yard"],
  },
  {
    id: "mosb-samsung-yard",
    code: "MOSB-SAM",
    name: "MOSB – Samsung Yard(대표)",
    category: "YARD",
    latitude: 24.32479,
    longitude: 54.46685,
    displayJitter: [0.00035, 0.00015],
    labelOffsetPx: [0, -16],
    summary: "Yard - Samsung (rep.)",
    priority: 770,
    tags: ["MOSB", "yard", "samsung"],
  },
  {
    id: "zayed-port",
    code: "MZP",
    name: "Mina Zayed Port(대표)",
    category: "PORT",
    latitude: 24.52489,
    longitude: 54.37798,
    summary: "Port - Zayed",
    priority: 860,
    tags: ["port"],
  },
  {
    id: "khalifa-port-kpct",
    code: "KPP",
    name: "Khalifa Port – KPCT",
    category: "PORT",
    latitude: 24.8095,
    longitude: 54.64842,
    summary: "Port - Khalifa (KPCT)",
    priority: 850,
    tags: ["port", "KPCT"],
  },
  {
    id: "auh-airport",
    code: "AUH",
    name: "Abu Dhabi(Zayed) International Airport – AUH",
    category: "AIRPORT",
    latitude: 24.441,
    longitude: 54.6492,
    summary: "Airport - AUH",
    priority: 840,
    tags: ["airport"],
  },
]

export function getPoiById(id: string): PoiLocation | undefined {
  return POI_LOCATIONS.find((p) => p.id === id)
}

export function getPoiByCode(code: string): PoiLocation | undefined {
  const key = code.trim().toLowerCase()
  return POI_LOCATIONS.find((p) => p.code.toLowerCase() === key)
}

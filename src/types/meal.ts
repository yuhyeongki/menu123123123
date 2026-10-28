export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드 (e.g. B10)
  ATPT_OFCDC_SC_NM: string;   // 교육청명 (e.g. 서울특별시교육청)
  SD_SCHUL_CODE: string;        // 표준학교코드 (e.g. 7010059)
  SCHUL_NM: string;             // 학교명 (e.g. 경기고등학교)
  ENG_SCHUL_NM?: string;
  SCHUL_KND_SC_NM: string;      // 초등학교, 중학교, 고등학교, 특수학교
  LCTN_SC_NM: string;           // 소재지 (e.g. 서울특별시)
  JU_ORG_NM?: string;
  FOND_SC_NM?: string;          // 공립, 사립, 국립
  ORG_RDNMA?: string;           // 도로명주소
  HMPG_ADRES?: string;
  COEDU_SC_NM?: string;         // 남, 여, 남여공학
}

export interface DishItem {
  raw: string;
  name: string;
  allergenCodes: number[];
  category?: 'rice' | 'soup' | 'main' | 'side' | 'kimchi' | 'dessert';
}

export interface NutritionItem {
  name: string;
  value: number;
  unit: string;
  percentDaily?: number;
}

export interface MealDietInfo {
  ATPT_OFCDC_SC_CODE: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string;        // 1: 조식, 2: 중식, 3: 석식
  MMEAL_SC_NM: string;          // 조식, 중식, 석식
  MLSV_YMD: string;             // YYYYMMDD
  MLSV_FGR?: number;            // 급식인원수
  DDISH_NM: string;             // 요리명 (HTML <br/> 구분)
  ORPLC_INFO?: string;          // 원산지 정보
  CAL_INFO: string;             // 칼로리 정보
  NTR_INFO: string;             // 영양 정보
  dishes?: DishItem[];
  parsedNutrition?: NutritionItem[];
  originList?: { item: string; origin: string }[];
}

export interface Allergen {
  code: number;
  name: string;
  shortName: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface MealRatingReview {
  rating: number; // 1 to 5
  sticker: string;
  memo: string;
  updatedAt: string;
}

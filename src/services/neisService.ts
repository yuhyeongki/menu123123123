import { SchoolInfo, MealDietInfo, DishItem, NutritionItem } from '../types/meal';

const NEIS_KEY_STORAGE = 'neis_api_key_v1';
const SELECTED_SCHOOL_STORAGE = 'selected_school_v1';
const FAVORITE_SCHOOLS_STORAGE = 'favorite_schools_v1';
const USER_ALLERGENS_STORAGE = 'user_allergens_v1';
const MEAL_REVIEWS_STORAGE = 'meal_reviews_v1';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(NEIS_KEY_STORAGE) || '';
}

export function saveStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(NEIS_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(NEIS_KEY_STORAGE);
  }
}

export function getStoredSchool(): SchoolInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SELECTED_SCHOOL_STORAGE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredSchool(school: SchoolInfo): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_SCHOOL_STORAGE, JSON.stringify(school));
}

export function getStoredFavorites(): SchoolInfo[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(FAVORITE_SCHOOLS_STORAGE);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredFavorites(schools: SchoolInfo[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITE_SCHOOLS_STORAGE, JSON.stringify(schools));
}

export function getStoredAllergens(): number[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(USER_ALLERGENS_STORAGE);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAllergens(allergens: number[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ALLERGENS_STORAGE, JSON.stringify(allergens));
}

export function getStoredReviews(): Record<string, { rating: number; sticker: string; memo: string; updatedAt: string }> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(MEAL_REVIEWS_STORAGE);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveStoredReview(key: string, review: { rating: number; sticker: string; memo: string; updatedAt: string }): void {
  if (typeof window === 'undefined') return;
  const current = getStoredReviews();
  current[key] = review;
  localStorage.setItem(MEAL_REVIEWS_STORAGE, JSON.stringify(current));
}

/**
 * Parses raw DDISH_NM string from NEIS
 * e.g. "*가츠동 (1.5.6.7.10.13.18)<br/>*매운콩나물국 (5.6)<br/>*쫄면 (5.6.13)<br/>*배추김치 (9)"
 */
export function parseDishes(rawDishText?: string): DishItem[] {
  if (!rawDishText) return [];

  // Replace <br/>, <br>, \n with a unified separator
  const cleanTokens = rawDishText
    .split(/<br\s*\/?>|\n/gi)
    .map((s) => s.trim())
    .filter(Boolean);

  return cleanTokens.map((token) => {
    // Extract allergen numbers inside parentheses, e.g. (1.5.6.13)
    const allergenMatch = token.match(/\(([0-9.]+)\)/);
    let allergenCodes: number[] = [];
    if (allergenMatch && allergenMatch[1]) {
      allergenCodes = allergenMatch[1]
        .split('.')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n));
    }

    // Clean name: remove * prefix, allergen parentheses, and extra whitespace
    const name = token
      .replace(/^\*+/, '')
      .replace(/\([0-9.]+\)/g, '')
      .trim();

    // Categorization heuristic for school cafeteria tray
    let category: DishItem['category'] = 'side';
    if (/밥|라이스|덮밥|볶음밥|비빔밥|죽/i.test(name)) {
      category = 'rice';
    } else if (/국|탕|찌개|스프|수프|전골|짬뽕/i.test(name)) {
      category = 'soup';
    } else if (/김치|깍두기|석박지|겉절이|동치미|총각김치/i.test(name)) {
      category = 'kimchi';
    } else if (/우유|주스|음료|요거트|에이드|라떼|과일|사과|포도|바나나|젤리|푸딩|와플|케이크|도넛/i.test(name)) {
      category = 'dessert';
    } else if (/불고기|돈가스|가츠|구이|조림|치킨|닭|스테이크|볶음|강정|까스|미트볼|떡갈비|탕수육|함박/i.test(name)) {
      category = 'main';
    }

    return {
      raw: token,
      name,
      allergenCodes,
      category,
    };
  });
}

/**
 * Parses NTR_INFO string
 * e.g. "탄수화물(g) : 167.1<br/>단백질(g) : 33.7<br/>지방(g) : 15.8..."
 */
export function parseNutrition(rawNutritionText?: string): NutritionItem[] {
  if (!rawNutritionText) return [];

  const lines = rawNutritionText.split(/<br\s*\/?>|\n/gi).map((s) => s.trim()).filter(Boolean);
  const items: NutritionItem[] = [];

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const label = parts[0].trim();
      const valText = parts[1].trim();
      const numMatch = valText.match(/([0-9.]+)/);
      const val = numMatch ? parseFloat(numMatch[1]) : 0;

      // Extract unit from label or valText
      let unit = '';
      const unitMatch = label.match(/\((.*?)\)/);
      if (unitMatch && unitMatch[1]) {
        unit = unitMatch[1];
      }

      const cleanName = label.replace(/\(.*?\)/g, '').trim();
      items.push({
        name: cleanName,
        value: val,
        unit,
      });
    }
  }

  return items;
}

/**
 * Parses ORPLC_INFO string
 * e.g. "쇠고기(종류) : 국내산(육우)<br/>돼지고기 : 국내산..."
 */
export function parseOrigin(rawOriginText?: string): { item: string; origin: string }[] {
  if (!rawOriginText) return [];

  const lines = rawOriginText.split(/<br\s*\/?>|\n/gi).map((s) => s.trim()).filter(Boolean);
  const result: { item: string; origin: string }[] = [];

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      result.push({
        item: parts[0].trim(),
        origin: parts.slice(1).join(':').trim(),
      });
    }
  }

  return result;
}

/**
 * Search Schools via NEIS Open API
 */
export async function searchSchools(keyword: string, regionCode?: string): Promise<{ schools: SchoolInfo[]; error?: string }> {
  if (!keyword || keyword.trim().length < 2) {
    return { schools: [] };
  }

  const apiKey = getStoredApiKey();
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '30',
    SCHUL_NM: keyword.trim(),
  });

  if (apiKey) {
    params.set('KEY', apiKey);
  }
  if (regionCode) {
    params.set('ATPT_OFCDC_SC_CODE', regionCode);
  }

  try {
    const response = await fetch(`https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    if (data.RESULT) {
      // Direct result code like INFO-200 or ERROR-300
      if (data.RESULT.CODE === 'INFO-200') {
        return { schools: [] };
      }
      return { schools: [], error: data.RESULT.MESSAGE || '검색 결과를 가져오지 못했습니다.' };
    }

    if (data.schoolInfo && data.schoolInfo[1] && data.schoolInfo[1].row) {
      const rows: SchoolInfo[] = data.schoolInfo[1].row;
      return { schools: rows };
    }

    return { schools: [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '학교 정보를 검색할 수 없습니다.';
    return { schools: [], error: message };
  }
}

/**
 * Fetch Meal Schedule from NEIS
 */
export async function fetchMeals(
  officeCode: string,
  schoolCode: string,
  fromYmd: string,
  toYmd: string,
  mealCode?: string
): Promise<{ meals: MealDietInfo[]; error?: string }> {
  const apiKey = getStoredApiKey();
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: officeCode,
    SD_SCHUL_CODE: schoolCode,
    MLSV_FROM_YMD: fromYmd,
    MLSV_TO_YMD: toYmd,
  });

  if (apiKey) {
    params.set('KEY', apiKey);
  }
  if (mealCode) {
    params.set('MMEAL_SC_CODE', mealCode);
  }

  try {
    const response = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    if (data.RESULT) {
      if (data.RESULT.CODE === 'INFO-200') {
        return { meals: [] }; // No meal on those days (e.g. weekend/vacation)
      }
      return { meals: [], error: data.RESULT.MESSAGE };
    }

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && data.mealServiceDietInfo[1].row) {
      const rows: MealDietInfo[] = data.mealServiceDietInfo[1].row.map((row: MealDietInfo) => {
        return {
          ...row,
          dishes: parseDishes(row.DDISH_NM),
          parsedNutrition: parseNutrition(row.NTR_INFO),
          originList: parseOrigin(row.ORPLC_INFO),
        };
      });
      return { meals: rows };
    }

    return { meals: [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '급식 데이터를 가져오지 못했습니다.';
    return { meals: [], error: message };
  }
}

/**
 * Test a NEIS API Key
 */
export async function testApiKey(key: string): Promise<{ valid: boolean; message: string }> {
  if (!key || !key.trim()) {
    return { valid: false, message: 'API 키를 입력해주세요.' };
  }

  try {
    const params = new URLSearchParams({
      KEY: key.trim(),
      Type: 'json',
      pIndex: '1',
      pSize: '1',
      SCHUL_NM: '경기고',
    });

    const res = await fetch(`https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`);
    if (!res.ok) {
      return { valid: false, message: `서버 응답 오류 (HTTP ${res.status})` };
    }
    const data = await res.json();

    if (data.RESULT) {
      if (data.RESULT.CODE === 'ERROR-290') {
        return { valid: false, message: '인증키가 유효하지 않습니다. 키를 다시 확인해주세요.' };
      }
      if (data.RESULT.CODE === 'ERROR-337') {
        return { valid: false, message: '일일 트래픽 한도를 초과했습니다.' };
      }
      if (data.RESULT.CODE.startsWith('ERROR')) {
        return { valid: false, message: `오류: ${data.RESULT.MESSAGE}` };
      }
    }

    if (data.schoolInfo) {
      return { valid: true, message: '나이스 API 키 인증에 성공했습니다! (정상 작동)' };
    }

    return { valid: true, message: 'API 응답이 확인되었습니다.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '네트워크 연결 오류';
    return { valid: false, message: `검증 실패: ${msg}` };
  }
}

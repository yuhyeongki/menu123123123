/**
 * Date utility for Korean School Meals
 */

export function getTodayKST(): Date {
  const now = new Date();
  // Target UTC + 9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 3600000);
}

export function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatKoreanDate(ymd: string): string {
  if (ymd.length !== 8) return ymd;
  const y = ymd.substring(0, 4);
  const m = ymd.substring(4, 6);
  const d = ymd.substring(6, 8);
  const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = dayNames[dateObj.getDay()];
  return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일 ${dayName}`;
}

/**
 * Get Monday and Friday of the week containing the given date
 */
export function getWeekRange(date: Date): { fromYmd: string; toYmd: string; monday: Date; friday: Date } {
  const current = new Date(date);
  const day = current.getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
  
  // Calculate distance to Monday
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    fromYmd: formatDateToYMD(monday),
    toYmd: formatDateToYMD(friday),
    monday,
    friday,
  };
}

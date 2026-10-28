import React from 'react';
import { MealDietInfo, DishItem } from '../types/meal';
import { ALLERGEN_MAP } from '../constants/allergens';
import { Calendar, Flame, ShieldAlert, Sparkles, Star, ChevronRight, Check } from 'lucide-react';

interface WeeklyScheduleProps {
  meals: MealDietInfo[];
  selectedDate: string; // YYYYMMDD
  onSelectDate: (date: string) => void;
  userAllergens: number[];
  onOpenReview: (meal: MealDietInfo) => void;
  todayStr: string;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  meals,
  selectedDate,
  onSelectDate,
  userAllergens,
  onOpenReview,
  todayStr,
}) => {
  // Sort meals by date ascending
  const sortedMeals = [...meals].sort((a, b) => a.MLSV_YMD.localeCompare(b.MLSV_YMD));

  const formatDayLabel = (ymd: string): { monthDay: string; dayName: string; isToday: boolean } => {
    if (ymd.length !== 8) {
      return { monthDay: ymd, dayName: '', isToday: false };
    }
    const year = parseInt(ymd.substring(0, 4), 10);
    const month = parseInt(ymd.substring(4, 6), 10);
    const day = parseInt(ymd.substring(6, 8), 10);
    const dateObj = new Date(year, month - 1, day);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[dateObj.getDay()] || '';
    return {
      monthDay: `${month}.${day}`,
      dayName,
      isToday: ymd === todayStr,
    };
  };

  const getMatchedAllergenCount = (dishes?: DishItem[]) => {
    if (!dishes || userAllergens.length === 0) return 0;
    const matched = new Set<number>();
    dishes.forEach((d) => {
      d.allergenCodes.forEach((code) => {
        if (userAllergens.includes(code)) {
          matched.add(code);
        }
      });
    });
    return matched.size;
  };

  return (
    <div className="space-y-4">
      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {sortedMeals.map((meal) => {
          const { monthDay, dayName, isToday } = formatDayLabel(meal.MLSV_YMD);
          const isSelected = meal.MLSV_YMD === selectedDate;
          const allergyCount = getMatchedAllergenCount(meal.dishes);

          return (
            <button
              key={meal.MLSV_YMD + meal.MMEAL_SC_CODE}
              onClick={() => onSelectDate(meal.MLSV_YMD)}
              className={`flex-1 min-w-[76px] p-2.5 rounded-2xl text-center border transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-500/20 scale-102'
                  : 'bg-white hover:bg-sky-50/70 border-slate-200 text-slate-700'
              }`}
            >
              {isToday && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap ${
                  isSelected ? 'bg-amber-300 text-amber-950' : 'bg-sky-500 text-white'
                }`}>
                  오늘
                </span>
              )}

              <div className={`text-[11px] font-bold ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                {dayName}요일
              </div>
              <div className="text-sm font-extrabold mt-0.5">
                {monthDay}
              </div>

              {allergyCount > 0 && (
                <div className="mt-1 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMeals.map((meal) => {
          const { monthDay, dayName, isToday } = formatDayLabel(meal.MLSV_YMD);
          const isSelected = meal.MLSV_YMD === selectedDate;
          const allergyCount = getMatchedAllergenCount(meal.dishes);

          return (
            <div
              key={meal.MLSV_YMD + meal.MMEAL_SC_CODE}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-sky-400 ring-2 ring-sky-200 shadow-lg'
                  : 'bg-white/90 border-slate-200/80 hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {monthDay} ({dayName})
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        오늘의 식단
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                    {meal.MMEAL_SC_NM}
                  </span>
                </div>

                {/* Calorie & Allergy Badge */}
                <div className="flex items-center justify-between gap-2 mt-2.5 text-xs">
                  <div className="flex items-center gap-1 text-orange-600 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{meal.CAL_INFO}</span>
                  </div>

                  {allergyCount > 0 && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>주의 {allergyCount}건</span>
                    </span>
                  )}
                </div>

                {/* Dish List */}
                <ul className="mt-3.5 space-y-1.5 text-sm">
                  {meal.dishes?.map((dish, idx) => {
                    const hasAllergy = userAllergens.some((c) => dish.allergenCodes.includes(c));
                    return (
                      <li
                        key={idx}
                        className={`p-1.5 rounded-xl flex items-start justify-between gap-2 transition-colors ${
                          hasAllergy ? 'bg-amber-50/80 font-bold text-amber-950' : 'text-slate-700'
                        }`}
                      >
                        <span className="leading-snug">{dish.name}</span>
                        {dish.allergenCodes.length > 0 && (
                          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                            {dish.allergenCodes.join('.')}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDate(meal.MLSV_YMD)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sky-500 text-white'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-800'
                  }`}
                >
                  <span>식판으로 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenReview(meal)}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="급식 평가하기"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>한줄평</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

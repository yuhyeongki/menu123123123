import React, { useState } from 'react';
import { DishItem } from '../types/meal';
import { ALLERGEN_MAP } from '../constants/allergens';
import { ShieldAlert, Info, Flame, Sparkles } from 'lucide-react';

interface MealTrayProps {
  dishes: DishItem[];
  calorieText?: string;
  userAllergens: number[];
  mealType: string;
  dateStr: string;
}

export const MealTray: React.FC<MealTrayProps> = ({
  dishes,
  calorieText,
  userAllergens,
  mealType,
  dateStr,
}) => {
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);

  // Separate dishes into tray compartments
  // Categories: rice, soup, main, side, kimchi, dessert
  const riceDish = dishes.find((d) => d.category === 'rice') || dishes[0];
  const soupDish = dishes.find((d) => d.category === 'soup') || dishes[1];
  const kimchiDish = dishes.find((d) => d.category === 'kimchi') || dishes.find((d) => /김치|깍두기|석박지/i.test(d.name));
  
  // Remaining dishes
  const used = new Set([riceDish, soupDish, kimchiDish].filter(Boolean));
  const remaining = dishes.filter((d) => !used.has(d));
  
  const mainDish = remaining.find((d) => d.category === 'main') || remaining[0];
  if (mainDish) used.add(mainDish);
  
  const sideRemaining = dishes.filter((d) => !used.has(d));
  const sideDish1 = sideRemaining.find((d) => d.category === 'side') || sideRemaining[0];
  if (sideDish1) used.add(sideDish1);

  const dessertRemaining = dishes.filter((d) => !used.has(d));
  const dessertDish = dessertRemaining[0];

  // Helper to check user allergy match
  const hasUserAllergy = (dish?: DishItem) => {
    if (!dish || userAllergens.length === 0) return false;
    return dish.allergenCodes.some((code) => userAllergens.includes(code));
  };

  const renderCompartment = (
    label: string,
    dish: DishItem | undefined,
    emoji: string,
    extraClasses: string,
    isLarge: boolean = false
  ) => {
    const isAllergic = hasUserAllergy(dish);

    return (
      <div
        onClick={() => dish && setSelectedDish(dish)}
        className={`group relative rounded-2xl md:rounded-3xl p-3 md:p-4 transition-all flex flex-col justify-between cursor-pointer select-none
          ${extraClasses}
          ${dish ? 'hover:scale-[1.01] hover:shadow-md' : 'opacity-70'}
          ${isAllergic ? 'ring-2 ring-amber-400 bg-amber-50/70' : 'bg-white/80'}
          border border-slate-200/80 shadow-inner
        `}
      >
        {/* Compartment Header */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base md:text-lg">{emoji}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {label}
            </span>
          </div>

          {isAllergic && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 animate-bounce">
              <ShieldAlert className="w-3 h-3" />
              <span>주의</span>
            </span>
          )}
        </div>

        {/* Dish Name */}
        <div className="my-auto py-1">
          {dish ? (
            <div>
              <p className={`font-bold text-slate-800 tracking-tight leading-snug group-hover:text-sky-600 transition-colors ${
                isLarge ? 'text-sm md:text-base' : 'text-xs md:text-sm'
              }`}>
                {dish.name}
              </p>

              {/* Allergen Micro Indicators */}
              {dish.allergenCodes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {dish.allergenCodes.slice(0, 5).map((code) => {
                    const allergen = ALLERGEN_MAP.get(code);
                    const isMatched = userAllergens.includes(code);
                    return (
                      <span
                        key={code}
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold transition-colors ${
                          isMatched
                            ? 'bg-amber-400 text-amber-950 font-extrabold ring-1 ring-amber-500'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                        title={allergen?.name || `알레르기 ${code}번`}
                      >
                        {allergen?.icon || '•'} {allergen?.shortName || code}
                      </span>
                    );
                  })}
                  {dish.allergenCodes.length > 5 && (
                    <span className="text-[10px] text-slate-400">
                      +{dish.allergenCodes.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">준비된 메뉴가 없습니다</p>
          )}
        </div>

        {/* Bottom Hint */}
        {dish && (
          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="w-2.5 h-2.5" />
            <span>상세보기</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Outer Metallic Cafeteria Tray Container */}
      <div className="p-3 md:p-6 rounded-[2.5rem] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 shadow-xl border-4 border-slate-300/80">
        
        {/* Tray Inner Rim */}
        <div className="p-3 md:p-5 rounded-[2rem] bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 shadow-inner border border-white">
          
          {/* Top Bar on Tray: Meal Type & Calories */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-sky-500 text-white font-extrabold text-xs shadow-xs">
                {mealType}
              </span>
              <span className="text-slate-500 font-medium">{dateStr}</span>
            </div>

            {calorieText && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-100 text-orange-800 font-bold text-xs">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>{calorieText}</span>
              </div>
            )}
          </div>

          {/* 5-Tray Compartment Grid */}
          <div className="space-y-3">
            {/* Top Row: 3 Smaller Side Compartments (Kimchi, Side 1, Main) */}
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              {renderCompartment('김치류', kimchiDish, '🥢', 'min-h-[110px] md:min-h-[130px]')}
              {renderCompartment('부반찬 / 채소', sideDish1, '🥗', 'min-h-[110px] md:min-h-[130px]')}
              {renderCompartment('주요리 / 단백질', mainDish, '🍗', 'min-h-[110px] md:min-h-[130px]')}
            </div>

            {/* Bottom Row: 2 Large Compartments (Rice, Soup) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              {renderCompartment('밥 (주식)', riceDish, '🍚', 'min-h-[130px] md:min-h-[160px]', true)}
              {renderCompartment('국 / 찌개', soupDish, '🍲', 'min-h-[130px] md:min-h-[160px]', true)}
            </div>

            {/* Optional Dessert / Extra Side Bar */}
            {dessertDish && (
              <div className="mt-3">
                {renderCompartment('디저트 / 후식', dessertDish, '🧃', 'min-h-[70px] bg-sky-50/60')}
              </div>
            )}
          </div>

          {/* Tray Cutlery Accent */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>🥄 숟가락과 젓가락이 가지런히 놓여 있어요</span>
            </span>
            <span>각 반찬을 누르면 알레르기 상세정보가 열립니다</span>
          </div>
        </div>
      </div>

      {/* Dish Detail Dialog */}
      {selectedDish && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedDish(null)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-sky-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full">
                메뉴 상세 정보
              </span>
              <button
                onClick={() => setSelectedDish(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h4 className="text-lg font-extrabold text-slate-900 mb-2">
              {selectedDish.name}
            </h4>

            {hasUserAllergy(selectedDish) && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>회원님이 설정하신 주의 알레르기 식품이 포함되어 있습니다.</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-600 mb-1.5">함유된 알레르기 유발 물질:</p>
                {selectedDish.allergenCodes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDish.allergenCodes.map((code) => {
                      const al = ALLERGEN_MAP.get(code);
                      const isMatched = userAllergens.includes(code);
                      return (
                        <div
                          key={code}
                          className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 font-medium border ${
                            isMatched
                              ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{al?.icon || '⚠️'}</span>
                          <span>{al?.name || `${code}번`}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">표기된 알레르기 유발 정보가 없습니다.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedDish(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

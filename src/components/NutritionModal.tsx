import React from 'react';
import { X, Activity, Flame, PieChart, ShieldCheck } from 'lucide-react';
import { NutritionItem } from '../types/meal';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutritionList: NutritionItem[];
  calorieText: string;
  mealDate: string;
  schoolName: string;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({
  isOpen,
  onClose,
  nutritionList,
  calorieText,
  mealDate,
  schoolName,
}) => {
  if (!isOpen) return null;

  // Find carbs, protein, fat for macro calculation
  const carbs = nutritionList.find((n) => /탄수화물/i.test(n.name))?.value || 0;
  const protein = nutritionList.find((n) => /단백질/i.test(n.name))?.value || 0;
  const fat = nutritionList.find((n) => /지방/i.test(n.name))?.value || 0;

  // Approximate calorie contributions (4, 4, 9 kcal/g)
  const carbCal = carbs * 4;
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const totalMacroCal = carbCal + proteinCal + fatCal || 1;

  const carbPercent = Math.round((carbCal / totalMacroCal) * 100);
  const proteinPercent = Math.round((proteinCal / totalMacroCal) * 100);
  const fatPercent = Math.round((fatCal / totalMacroCal) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">급식 영양 성분표</h3>
                <p className="text-xs text-emerald-100">{schoolName} · {mealDate}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-between">
            <span className="text-xs font-medium">총 열량 (에너지)</span>
            <span className="text-lg font-extrabold flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-300" />
              {calorieText || '정보 없음'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* 3대 영양소 밸런스 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <span>3대 영양소 비율 (탄·단·지)</span>
              </span>
              <span className="text-slate-400 font-normal">칼로리 기준 비율</span>
            </div>

            {/* Visual Balance Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
              <div
                style={{ width: `${carbPercent}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`탄수화물 ${carbPercent}%`}
              />
              <div
                style={{ width: `${proteinPercent}%` }}
                className="bg-sky-500 transition-all duration-500"
                title={`단백질 ${proteinPercent}%`}
              />
              <div
                style={{ width: `${fatPercent}%` }}
                className="bg-rose-400 transition-all duration-500"
                title={`지방 ${fatPercent}%`}
              />
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-amber-800 font-bold">탄수화물</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{carbs}g ({carbPercent}%)</p>
              </div>
              <div className="p-2 rounded-xl bg-sky-50 border border-sky-200">
                <span className="text-sky-800 font-bold">단백질</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{protein}g ({proteinPercent}%)</p>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-rose-800 font-bold">지방</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{fat}g ({fatPercent}%)</p>
              </div>
            </div>
          </div>

          {/* 전체 상세 영양 정보 리스트 */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">
              상세 비타민 및 무기질 함량
            </h4>
            {nutritionList.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {nutritionList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-bold text-slate-900">
                      {item.value} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">등록된 상세 영양 정보가 없습니다.</p>
            )}
          </div>

          {/* Nutrition tip */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              학교 급식은 학교급식법 제11조 및 동법 시행규칙 제5조에 의거하여 성장기 청소년의 영양 기준량에 맞추어 영양교사 및 영양사에 의해 균형 있게 설계됩니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

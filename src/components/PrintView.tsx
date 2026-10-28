import React from 'react';
import { X, Printer, Calendar, Utensils } from 'lucide-react';
import { MealDietInfo, SchoolInfo } from '../types/meal';

interface PrintViewProps {
  isOpen: boolean;
  onClose: () => void;
  meals: MealDietInfo[];
  school: SchoolInfo | null;
}

export const PrintView: React.FC<PrintViewProps> = ({
  isOpen,
  onClose,
  meals,
  school,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const sortedMeals = [...meals].sort((a, b) => a.MLSV_YMD.localeCompare(b.MLSV_YMD));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (hidden in print) */}
        <div className="print:hidden bg-gradient-to-r from-sky-500 to-blue-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5" />
            <h3 className="text-base font-bold">식단표 인쇄 및 보관용 미리보기</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white text-sky-800 text-xs font-bold hover:bg-sky-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>지금 인쇄하기</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible flex-1 bg-white font-sans text-slate-900">
          {/* Header on Paper */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                {school?.SCHUL_NM || '학교'} 주간 급식 식단표
              </div>
              <p className="text-xs text-slate-500 mt-1">
                교육부 나이스(NEIS) 교육정보 개방포털 공공데이터 기반
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>출력일: {new Date().toLocaleDateString('ko-KR')}</div>
              <div className="font-semibold text-sky-700">모두의 급식</div>
            </div>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-5 gap-3">
            {sortedMeals.map((meal) => {
              const ymd = meal.MLSV_YMD;
              const m = ymd.substring(4, 6);
              const d = ymd.substring(6, 8);
              return (
                <div
                  key={meal.MLSV_YMD}
                  className="border border-slate-300 rounded-xl p-3 flex flex-col justify-between min-h-[300px]"
                >
                  <div>
                    <div className="border-b border-slate-200 pb-2 mb-2 text-center">
                      <span className="font-extrabold text-sm block">
                        {parseInt(m, 10)}월 {parseInt(d, 10)}일
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {meal.MMEAL_SC_NM}
                      </span>
                    </div>

                    <ul className="space-y-1 text-xs text-slate-800">
                      {meal.dishes?.map((dish, i) => (
                        <li key={i} className="leading-snug">
                          • {dish.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[11px] text-slate-600 font-bold">
                    {meal.CAL_INFO}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allergy Legend */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <strong>* 알레르기 유발 식품 표시 번호:</strong> 1.난류 2.우유 3.메밀 4.땅콩 5.대두 6.밀 7.고등어 8.게 9.새우 10.돼지고기 11.복숭아 12.토마토 13.아황산류 14.호두 15.닭고기 16.쇠고기 17.오징어 18.조개류 19.잣
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, ShieldAlert, Check, RotateCcw, Sparkles } from 'lucide-react';
import { ALLERGEN_CATALOG } from '../constants/allergens';
import { saveStoredAllergens } from '../services/neisService';

interface AllergyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergens: number[];
  onChangeAllergens: (allergens: number[]) => void;
}

export const AllergyFilterModal: React.FC<AllergyFilterModalProps> = ({
  isOpen,
  onClose,
  selectedAllergens,
  onChangeAllergens,
}) => {
  if (!isOpen) return null;

  const toggleAllergen = (code: number) => {
    let updated: number[];
    if (selectedAllergens.includes(code)) {
      updated = selectedAllergens.filter((c) => c !== code);
    } else {
      updated = [...selectedAllergens, code];
    }
    onChangeAllergens(updated);
    saveStoredAllergens(updated);
  };

  const handleClear = () => {
    onChangeAllergens([]);
    saveStoredAllergens([]);
  };

  const handleSelectCommon = () => {
    // 1: 난류, 2: 우유, 4: 땅콩, 6: 밀
    const common = [1, 2, 4, 6];
    onChangeAllergens(common);
    saveStoredAllergens(common);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">내 알레르기 안전 지킴이</h3>
                <p className="text-xs text-amber-100">교육부 지정 19대 급식 알레르기 유발물질 필터</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span>
              현재 <strong>{selectedAllergens.length}개</strong> 항목이 선택되어 있습니다.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectCommon}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
              >
                주요 4대 식품
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
              >
                전체 해제
              </button>
            </div>
          </div>
        </div>

        {/* Allergen 19 Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            학생 본인 또는 자녀가 알레르기 반응이 있는 식품을 체크해 두시면 식단표와 식판에서 즉시 주의 표시 및 경고 배지를 띄워드립니다.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ALLERGEN_CATALOG.map((item) => {
              const isSelected = selectedAllergens.includes(item.code);
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => toggleAllergen(item.code)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-2xl">{item.icon}</span>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-amber-500 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      <span>{item.code}. {item.shortName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5" title={item.description}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">설정하신 알레르기 정보는 기기에 안전하게 저장됩니다</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

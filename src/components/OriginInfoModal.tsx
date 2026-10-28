import React from 'react';
import { X, MapPin, CheckCircle2, Shield } from 'lucide-react';

interface OriginInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  originList: { item: string; origin: string }[];
  schoolName: string;
}

export const OriginInfoModal: React.FC<OriginInfoModalProps> = ({
  isOpen,
  onClose,
  originList,
  schoolName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">식재료 원산지 정보</h3>
                <p className="text-xs text-sky-100">{schoolName} 식자재 원산지 표기</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Origin Table */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-500">
            농수산물의 원산지 표시에 관한 법률에 따라 학교 급식 식단에 사용되는 주요 식재료의 원산지를 투명하게 공개합니다.
          </p>

          {originList.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {originList.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800">{row.item}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-semibold border border-sky-100">
                    {row.origin}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              원산지 세부 정보가 등록되지 않았습니다.
            </div>
          )}
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

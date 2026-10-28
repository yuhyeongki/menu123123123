import React from 'react';
import { KeyRound, School, Utensils, CalendarDays, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { SchoolInfo } from '../types/meal';

interface NavbarProps {
  currentSchool: SchoolInfo | null;
  onOpenSchoolSearch: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAllergyModal: () => void;
  hasApiKey: boolean;
  activeAllergenCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSchool,
  onOpenSchoolSearch,
  onOpenApiKeyModal,
  onOpenAllergyModal,
  hasApiKey,
  activeAllergenCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                모두의 급식
              </span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded-full">
                NEIS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">전국 초·중·고 우리 학교 식단표</p>
          </div>
        </div>

        {/* Zone 2: School Switcher & Quick Navigation */}
        <nav className="flex items-center gap-2 md:gap-4 shrink min-w-0">
          <button
            onClick={onOpenSchoolSearch}
            className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition-all text-xs md:text-sm font-semibold max-w-[200px] md:max-w-[280px] truncate"
            title="학교 변경하기"
          >
            <School className="w-4 h-4 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">
              {currentSchool ? currentSchool.SCHUL_NM : '학교를 선택하세요'}
            </span>
            <span className="text-[11px] text-sky-500 hidden lg:inline shrink-0 font-normal">
              (변경)
            </span>
          </button>

          <button
            onClick={onOpenAllergyModal}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              activeAllergenCount > 0
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="내 알레르기 관리"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${activeAllergenCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>알레르기 필터</span>
            {activeAllergenCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeAllergenCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action - NEIS API Key Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-xs ${
              hasApiKey
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-500/20'
                : 'bg-white border-2 border-sky-400 text-sky-700 hover:bg-sky-50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="whitespace-nowrap">
              {hasApiKey ? '나이스 키 등록됨' : '나이스 API 키 설정'}
            </span>
            {hasApiKey ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-200" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

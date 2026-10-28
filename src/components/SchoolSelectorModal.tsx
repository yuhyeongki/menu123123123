import React, { useState, useEffect } from 'react';
import { Search, X, School, MapPin, Star, Building2, Check, Sparkles, Loader2 } from 'lucide-react';
import { SchoolInfo } from '../types/meal';
import { searchSchools, getStoredFavorites, saveStoredFavorites } from '../services/neisService';
import { DEFAULT_SCHOOLS, REGIONS } from '../constants/defaultSchools';

interface SchoolSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: SchoolInfo | null;
  onSelectSchool: (school: SchoolInfo) => void;
}

export const SchoolSelectorModal: React.FC<SchoolSelectorModalProps> = ({
  isOpen,
  onClose,
  currentSchool,
  onSelectSchool,
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<SchoolInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFavorites(getStoredFavorites());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim() || keyword.trim().length < 2) {
      setErrorMsg('학교 이름을 2글자 이상 입력해주세요 (예: 경기고, 서울초, 중앙중).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await searchSchools(keyword.trim(), selectedRegion || undefined);
      if (res.error) {
        setErrorMsg(res.error);
        setResults([]);
      } else {
        setResults(res.schools);
        if (res.schools.length === 0) {
          setErrorMsg('검색된 학교가 없습니다. 학교명을 다시 확인해주세요.');
        }
      }
    } catch {
      setErrorMsg('학교 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (e: React.MouseEvent, school: SchoolInfo) => {
    e.stopPropagation();
    const exists = favorites.some((f) => f.SD_SCHUL_CODE === school.SD_SCHUL_CODE);
    let updated: SchoolInfo[];
    if (exists) {
      updated = favorites.filter((f) => f.SD_SCHUL_CODE !== school.SD_SCHUL_CODE);
    } else {
      updated = [...favorites, school];
    }
    setFavorites(updated);
    saveStoredFavorites(updated);
  };

  const isFav = (school: SchoolInfo) => {
    return favorites.some((f) => f.SD_SCHUL_CODE === school.SD_SCHUL_CODE);
  };

  const handleSelect = (school: SchoolInfo) => {
    onSelectSchool(school);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 p-5 md:p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">학교 검색 및 선택</h3>
                <p className="text-xs text-sky-100">전국 1만 2천여 초·중·고교 나이스 공식 등록 학교</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="학교명을 입력하세요 (예: 경기고, 서울중, 대원초)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>검색</span>
            </button>
          </form>

          {/* Region Tabs */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {REGIONS.slice(0, 8).map((reg) => (
              <button
                key={reg.code}
                type="button"
                onClick={() => setSelectedRegion(reg.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === reg.code
                    ? 'bg-white text-sky-900 font-bold shadow-xs'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              >
                {reg.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Favorites Section if any */}
          {favorites.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>즐겨찾는 학교 ({favorites.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.SD_SCHUL_CODE}
                    onClick={() => handleSelect(fav)}
                    className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/70 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <span>{fav.SCHUL_NM}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200/60 text-amber-900 font-normal">
                          {fav.SCHUL_KND_SC_NM}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{fav.ORG_RDNMA}</div>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, fav)}
                      className="p-1 text-amber-500 hover:text-amber-600"
                      title="즐겨찾기 해제"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
                <span>검색 결과 ({results.length}개)</span>
                <span className="text-[11px] text-slate-400 font-normal">원하는 학교를 클릭하세요</span>
              </div>
              <div className="space-y-2">
                {results.map((sch) => {
                  const isSelected = currentSchool?.SD_SCHUL_CODE === sch.SD_SCHUL_CODE;
                  return (
                    <div
                      key={sch.SD_SCHUL_CODE}
                      onClick={() => handleSelect(sch)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 shadow-xs'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {sch.SCHUL_NM}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                            {sch.SCHUL_KND_SC_NM}
                          </span>
                          {sch.FOND_SC_NM && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0 hidden sm:inline">
                              {sch.FOND_SC_NM}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sch.ORG_RDNMA || sch.LCTN_SC_NM}</span>
                          {sch.COEDU_SC_NM && (
                            <>
                              <span>·</span>
                              <span>{sch.COEDU_SC_NM}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => toggleFavorite(e, sch)}
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                          title="즐겨찾기"
                        >
                          <Star className={`w-4 h-4 ${isFav(sch) ? 'text-amber-500 fill-amber-400' : ''}`} />
                        </button>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center text-xs text-sky-800">
              {errorMsg}
            </div>
          )}

          {/* Preset Quick Selection */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>추천 대표 학교 둘러보기</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {DEFAULT_SCHOOLS.map((sch) => (
                <button
                  key={sch.SD_SCHUL_CODE}
                  onClick={() => handleSelect(sch)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-all group"
                >
                  <div className="font-bold text-xs text-slate-800 group-hover:text-sky-600 truncate">
                    {sch.SCHUL_NM}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {sch.LCTN_SC_NM} · {sch.SCHUL_KND_SC_NM}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>데이터 제공: 교육부 나이스(NEIS) 교육정보 개방포털</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

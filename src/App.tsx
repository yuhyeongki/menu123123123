import React, { useState, useEffect, useTransition } from 'react';
import { 
  Utensils, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  KeyRound, 
  ShieldAlert, 
  Activity, 
  Shield, 
  Printer, 
  Star, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Info,
  SlidersHorizontal,
  ChevronDown,
  School as SchoolIcon
} from 'lucide-react';
import { SchoolInfo, MealDietInfo } from './types/meal';
import { DEFAULT_SCHOOLS } from './constants/defaultSchools';
import { 
  getStoredApiKey, 
  getStoredSchool, 
  saveStoredSchool, 
  getStoredAllergens, 
  fetchMeals,
  getStoredReviews
} from './services/neisService';
import { getTodayKST, formatDateToYMD, formatKoreanDate, getWeekRange } from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { MealTray } from './components/MealTray';
import { WeeklySchedule } from './components/WeeklySchedule';
import { SchoolSelectorModal } from './components/SchoolSelectorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AllergyFilterModal } from './components/AllergyFilterModal';
import { NutritionModal } from './components/NutritionModal';
import { OriginInfoModal } from './components/OriginInfoModal';
import { MealReviewModal } from './components/MealReviewModal';
import { PrintView } from './components/PrintView';

export default function App() {
  // Primary App States
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    return getStoredSchool() || DEFAULT_SCHOOLS[0];
  });
  
  const todayKST = getTodayKST();
  const [currentWeekDate, setCurrentWeekDate] = useState<Date>(todayKST);
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateToYMD(todayKST));
  const [selectedMealCode, setSelectedMealCode] = useState<string>('2'); // 2: 중식
  const [userAllergens, setUserAllergens] = useState<number[]>(() => getStoredAllergens());
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => !!getStoredApiKey());

  // Meal Data States
  const [meals, setMeals] = useState<MealDietInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active View Tab: 'tray' | 'weekly'
  const [activeTab, setActiveTab] = useState<'tray' | 'weekly'>('tray');

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [reviewMealTarget, setReviewMealTarget] = useState<MealDietInfo | null>(null);

  // Load Meals when school or week changes
  const weekRange = getWeekRange(currentWeekDate);

  const loadMealData = async () => {
    if (!currentSchool) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetchMeals(
        currentSchool.ATPT_OFCDC_SC_CODE,
        currentSchool.SD_SCHUL_CODE,
        weekRange.fromYmd,
        weekRange.toYmd,
        selectedMealCode || undefined
      );

      if (res.error) {
        setErrorMsg(res.error);
        setMeals([]);
      } else {
        setMeals(res.meals || []);
      }
    } catch {
      setErrorMsg('급식 정보를 불러오는데 실패했습니다.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMealData();
  }, [currentSchool, weekRange.fromYmd, selectedMealCode]);

  // Update stored school
  const handleSelectSchool = (school: SchoolInfo) => {
    setCurrentSchool(school);
    saveStoredSchool(school);
  };

  // Week Navigation
  const handlePrevWeek = () => {
    const nextDate = new Date(currentWeekDate);
    nextDate.setDate(nextDate.getDate() - 7);
    setCurrentWeekDate(nextDate);
  };

  const handleNextWeek = () => {
    const nextDate = new Date(currentWeekDate);
    nextDate.setDate(nextDate.getDate() + 7);
    setCurrentWeekDate(nextDate);
  };

  const handleToday = () => {
    const today = getTodayKST();
    setCurrentWeekDate(today);
    setSelectedDate(formatDateToYMD(today));
  };

  // Selected Day's meal
  const currentDayMeal = meals.find(
    (m) => m.MLSV_YMD === selectedDate && (m.MMEAL_SC_CODE === selectedMealCode || !selectedMealCode)
  ) || meals.find((m) => m.MLSV_YMD === selectedDate);

  // Review helper for current day meal
  const currentMealReviews = getStoredReviews();
  const currentReviewKey = currentDayMeal
    ? `${currentDayMeal.SD_SCHUL_CODE}_${currentDayMeal.MLSV_YMD}_${currentDayMeal.MMEAL_SC_CODE}`
    : '';
  const currentReview = currentReviewKey ? currentMealReviews[currentReviewKey] : null;

  // Active allergy warning for selected meal
  const allergicDishes = currentDayMeal?.dishes?.filter((d) =>
    d.allergenCodes.some((code) => userAllergens.includes(code))
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-blue-50 text-slate-800 flex flex-col font-sans selection:bg-sky-200">
      
      {/* Top Navbar */}
      <Navbar
        currentSchool={currentSchool}
        onOpenSchoolSearch={() => setIsSchoolModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAllergyModal={() => setIsAllergyModalOpen(true)}
        hasApiKey={hasApiKey}
        activeAllergenCount={userAllergens.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        
        {/* Cute Blue Hero Header Banner */}
        <section className="relative rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 p-6 md:p-8 text-white shadow-xl shadow-sky-600/15 overflow-hidden">
          
          {/* Decorative Cloud & Bubble Shapes */}
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-72 h-72 rounded-full bg-sky-300/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left Column: Mascot & School Title */}
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="relative shrink-0">
                <img
                  src="/src/assets/images/mascot_meal_friends_1793169410242.jpg"
                  alt="밥공기와 우유 캐릭터"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-lg border-2 border-white/60 hover:rotate-3 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 text-lg">🍱</span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-sky-100 text-xs font-bold">
                    {currentSchool.ATPT_OFCDC_SC_NM || '전국 교육청'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 text-xs font-black">
                    {currentSchool.SCHUL_KND_SC_NM}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs truncate">
                  {currentSchool.SCHUL_NM}
                </h1>

                <p className="text-xs md:text-sm text-sky-100 mt-1 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-sky-200" />
                  <span>{formatKoreanDate(selectedDate)}</span>
                  <span className="hidden sm:inline">· 오늘 하루도 맛있고 건강하게!</span>
                </p>
              </div>
            </div>

            {/* Right Column: Quick Action Hub */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsSchoolModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-sky-600" />
                <span>학교 변경</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAllergyModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm border border-white/30 backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>알레르기 필터 ({userAllergens.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm border border-white/30 backdrop-blur-md transition-all flex items-center gap-1.5"
                title="주간 식단표 인쇄"
              >
                <Printer className="w-4 h-4" />
                <span>식단표 인쇄</span>
              </button>
            </div>
          </div>
        </section>

        {/* API Key Reminder Callout (if no user key is set yet) */}
        {!hasApiKey && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">
                  나이스(NEIS) 개인 API 키를 등록하고 일 10만 회 무제한 조회를 이용해 보세요!
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  키를 등록하면 공용 트래픽 제한 없이 즉시 안정적으로 조회됩니다. (나이스 포털에서 1분 무료 발급)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
            >
              내 API 키 등록하기
            </button>
          </div>
        )}

        {/* Week & Date Navigation Toolbar */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-5 shadow-sm border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Week Pager */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
              title="이전 주"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center px-3">
              <span className="text-xs font-semibold text-slate-400 block">주간 식단 범위</span>
              <span className="text-sm font-extrabold text-slate-800">
                {parseInt(weekRange.fromYmd.substring(4, 6), 10)}월 {parseInt(weekRange.fromYmd.substring(6, 8), 10)}일 ~ {parseInt(weekRange.toYmd.substring(4, 6), 10)}월 {parseInt(weekRange.toYmd.substring(6, 8), 10)}일
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
              title="다음 주"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="ml-2 px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition-colors"
            >
              오늘로 이동
            </button>
          </div>

          {/* Meal Type Switcher (조식, 중식, 석식) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedMealCode('1')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedMealCode === '1'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              아침 (조식)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMealCode('2')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedMealCode === '2'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              점심 (중식) 🍱
            </button>
            <button
              type="button"
              onClick={() => setSelectedMealCode('3')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedMealCode === '3'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              저녁 (석식)
            </button>
          </div>

          {/* View Mode Toggle: Tray vs Weekly */}
          <div className="flex items-center gap-1.5 p-1 bg-sky-50 rounded-2xl border border-sky-100">
            <button
              type="button"
              onClick={() => setActiveTab('tray')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'tray'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-sky-700 hover:text-sky-900'
              }`}
            >
              <span>🍽️ 식판 뷰</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('weekly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'weekly'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-sky-700 hover:text-sky-900'
              }`}
            >
              <span>📅 주간 표</span>
            </button>
          </div>

        </section>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center bg-white/80 backdrop-blur-sm rounded-3xl border border-sky-100 shadow-sm space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-base">나이스 교육정보 포털에서 식단표를 불러오는 중입니다...</p>
            <p className="text-xs text-slate-400">잠시만 기다려주세요 🍚</p>
          </div>
        )}

        {/* Content Area when not loading */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Main Tray or Weekly Grid */}
            <div className="lg:col-span-8 space-y-6">
              
              {activeTab === 'tray' ? (
                <div>
                  {currentDayMeal && currentDayMeal.dishes && currentDayMeal.dishes.length > 0 ? (
                    <div className="space-y-4">
                      {/* Allergy Notification Banner if any match */}
                      {allergicDishes.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-3 animate-in fade-in">
                          <div className="flex items-center gap-2.5">
                            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                            <div className="text-xs">
                              <span className="font-bold">알레르기 주의 반찬이 {allergicDishes.length}개 있습니다:</span>{' '}
                              <span className="font-medium">
                                {allergicDishes.map((d) => d.name).join(', ')}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsAllergyModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 text-xs font-bold shrink-0 transition-colors"
                          >
                            필터 관리
                          </button>
                        </div>
                      )}

                      {/* Cute Tray View */}
                      <MealTray
                        dishes={currentDayMeal.dishes}
                        calorieText={currentDayMeal.CAL_INFO}
                        userAllergens={userAllergens}
                        mealType={currentDayMeal.MMEAL_SC_NM}
                        dateStr={formatKoreanDate(selectedDate)}
                      />
                    </div>
                  ) : (
                    /* Empty Meal Notice */
                    <div className="rounded-[2.5rem] bg-white/90 border border-sky-100 p-12 text-center shadow-md space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-sky-50 text-sky-500 flex items-center justify-center text-4xl shadow-inner">
                        🎈
                      </div>
                      <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-bold text-slate-800">
                          선택하신 날짜({formatKoreanDate(selectedDate)})에는 등록된 급식 정보가 없습니다.
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          주말, 공휴일, 재량휴업일, 방학 기간이거나 학교에서 아직 식단표를 등록하지 않은 상태일 수 있습니다. 다른 날짜나 주간 식단표를 확인해 보세요!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleToday}
                        className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all inline-flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>오늘 식단으로 돌아가기</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Weekly Schedule View */
                <WeeklySchedule
                  meals={meals}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setActiveTab('tray');
                  }}
                  userAllergens={userAllergens}
                  onOpenReview={(meal) => {
                    setReviewMealTarget(meal);
                    setIsReviewModalOpen(true);
                  }}
                  todayStr={formatDateToYMD(todayKST)}
                />
              )}
            </div>

            {/* Right 4 Cols: Side Info Deck */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Daily Meal Visual Banner Card */}
              <div className="rounded-3xl bg-white p-5 border border-sky-100 shadow-sm overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden mb-3 aspect-video bg-sky-100">
                  <img
                    src="/src/assets/images/cafeteria_tray_art_1793169411883.jpg"
                    alt="급식 시간 풍경"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3 text-white">
                    <span className="text-xs font-bold">✨ 맛있는 학교 급식</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">칼로리 정보</span>
                    <span className="font-extrabold text-orange-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {currentDayMeal?.CAL_INFO || '정보 없음'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">급식 인원</span>
                    <span className="font-bold text-slate-800">
                      {currentDayMeal?.MLSV_FGR ? `${currentDayMeal.MLSV_FGR}명` : '학교 전체'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrition & Origin Quick Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsNutritionModalOpen(true)}
                  className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-300 text-left transition-all group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">영양 성분 분석</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">탄·단·지 & 비타민</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOriginModalOpen(true)}
                  className="p-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 text-left transition-all group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">식재료 원산지</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">쌀·김치·육류 표기</div>
                </button>
              </div>

              {/* Daily Meal Rating & Diary Card */}
              <div className="rounded-3xl bg-white p-5 border border-pink-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>오늘의 급식 평가</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentDayMeal) {
                        setReviewMealTarget(currentDayMeal);
                        setIsReviewModalOpen(true);
                      }
                    }}
                    className="text-[11px] font-bold text-pink-600 hover:underline"
                  >
                    {currentReview ? '수정하기' : '평가 남기기'}
                  </button>
                </div>

                {currentReview ? (
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: currentReview.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xl">{currentReview.sticker}</span>
                    </div>
                    {currentReview.memo && (
                      <p className="text-xs text-slate-700 font-medium italic">
                        "{currentReview.memo}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      if (currentDayMeal) {
                        setReviewMealTarget(currentDayMeal);
                        setIsReviewModalOpen(true);
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center cursor-pointer hover:bg-pink-50/50 transition-colors"
                  >
                    <p className="text-xs text-slate-500">오늘 급식은 어떠셨나요?</p>
                    <p className="text-[11px] text-pink-600 font-bold mt-1">별점과 귀여운 스티커 남기기 ✨</p>
                  </div>
                )}
              </div>

              {/* School Info Mini Spec Card */}
              <div className="rounded-3xl bg-white p-5 border border-sky-100 shadow-sm text-xs space-y-2.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <SchoolIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>학교 기본 정보</span>
                </div>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">관할 교육청:</span>
                    <span className="font-medium text-slate-800">{currentSchool.ATPT_OFCDC_SC_NM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">학교 분류:</span>
                    <span className="font-medium text-slate-800">{currentSchool.FOND_SC_NM} · {currentSchool.SCHUL_KND_SC_NM}</span>
                  </div>
                  {currentSchool.ORG_RDNMA && (
                    <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
                      📍 {currentSchool.ORG_RDNMA}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white/80 backdrop-blur-md border-t border-sky-100 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">모두의 급식 · 전국 초·중·고 학교 급식 정보 플랫폼</p>
          <p className="text-[11px] text-slate-400">
            데이터 출처: 교육부 및 한국교육학술정보원(KERIS) 나이스(NEIS) 교육정보 개방포털 Open API
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SchoolSelectorModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        currentSchool={currentSchool}
        onSelectSchool={handleSelectSchool}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(key) => {
          setHasApiKey(!!key);
          loadMealData();
        }}
      />

      <AllergyFilterModal
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        selectedAllergens={userAllergens}
        onChangeAllergens={setUserAllergens}
      />

      <NutritionModal
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
        nutritionList={currentDayMeal?.parsedNutrition || []}
        calorieText={currentDayMeal?.CAL_INFO || ''}
        mealDate={formatKoreanDate(selectedDate)}
        schoolName={currentSchool.SCHUL_NM}
      />

      <OriginInfoModal
        isOpen={isOriginModalOpen}
        onClose={() => setIsOriginModalOpen(false)}
        originList={currentDayMeal?.originList || []}
        schoolName={currentSchool.SCHUL_NM}
      />

      <MealReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        meal={reviewMealTarget || currentDayMeal || null}
      />

      <PrintView
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        meals={meals}
        school={currentSchool}
      />

    </div>
  );
}

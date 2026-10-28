import React, { useState, useEffect } from 'react';
import { X, Star, Heart, MessageSquare, Check, Sparkles } from 'lucide-react';
import { MealDietInfo } from '../types/meal';
import { getStoredReviews, saveStoredReview } from '../services/neisService';

interface MealReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealDietInfo | null;
}

const STICKERS = [
  { emoji: '😋', label: '꿀맛탱' },
  { emoji: '🤤', label: '밥도둑' },
  { emoji: '🙂', label: '무난해요' },
  { emoji: '🌶️', label: '매콤해요' },
  { emoji: '🥺', label: '아쉬워요' },
];

export const MealReviewModal: React.FC<MealReviewModalProps> = ({
  isOpen,
  onClose,
  meal,
}) => {
  const [rating, setRating] = useState(5);
  const [sticker, setSticker] = useState('😋');
  const [memo, setMemo] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && meal) {
      const key = `${meal.SD_SCHUL_CODE}_${meal.MLSV_YMD}_${meal.MMEAL_SC_CODE}`;
      const reviews = getStoredReviews();
      const existing = reviews[key];
      if (existing) {
        setRating(existing.rating || 5);
        setSticker(existing.sticker || '😋');
        setMemo(existing.memo || '');
      } else {
        setRating(5);
        setSticker('😋');
        setMemo('');
      }
      setSavedSuccess(false);
    }
  }, [isOpen, meal]);

  if (!isOpen || !meal) return null;

  const handleSave = () => {
    const key = `${meal.SD_SCHUL_CODE}_${meal.MLSV_YMD}_${meal.MMEAL_SC_CODE}`;
    saveStoredReview(key, {
      rating,
      sticker,
      memo: memo.trim(),
      updatedAt: new Date().toISOString(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">오늘의 급식 한줄평</h3>
                <p className="text-xs text-rose-100">{meal.SCHUL_NM} · {meal.MMEAL_SC_NM}</p>
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Star Rating */}
          <div className="text-center">
            <label className="text-xs font-bold text-slate-600 block mb-2">
              오늘 급식 만족도
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      starVal <= rating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Cute Sticker Selector */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2 text-center">
              스티커 반응 고르기
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STICKERS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setSticker(item.emoji)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    sticker === item.emoji
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 scale-105 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl block">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 block">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Short Memo Input */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              나만의 급식 메모 (선택)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 치즈돈까스 바삭하고 소스도 짱 맛있었음!"
              maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 placeholder:text-slate-400"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>평가가 성공적으로 저장되었습니다!</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>기록 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

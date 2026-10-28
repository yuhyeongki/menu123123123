import React, { useState, useEffect } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, ExternalLink, Sparkles, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, testApiKey } from '../services/neisService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredApiKey();
      setKeyInput(current);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ valid: false, message: '테스트할 API 키를 먼저 입력해주세요.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testApiKey(keyInput.trim());
      setTestResult(res);
    } catch {
      setTestResult({ valid: false, message: '검증 중 네트워크 오류가 발생했습니다.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredApiKey(keyInput.trim());
    onKeySaved(keyInput.trim());
    onClose();
  };

  const handleClearKey = () => {
    saveStoredApiKey('');
    setKeyInput('');
    setTestResult(null);
    onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">나이스(NEIS) API 키 설정</h3>
                <p className="text-xs text-sky-100">교육정보 개방포털 Open API 인증키 등록</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Info Notice */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-900">사용자 본인 인증키 적용:</span> 나이스 교육정보 개방포털에서 발급받은 인증키를 입력하면 일일 100,000건까지 속도 제한 없이 급식 정보를 조회할 수 있습니다.
            </div>
          </div>

          {/* Key Input Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              인증키 (API Key)
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="예: 2b5c7e8a912d4a5e8f..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-mono transition-all pr-24"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing || !keyInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              >
                {testing ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                )}
                <span>검증</span>
              </button>
            </div>
          </div>

          {/* Verification Feedback Result */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 transition-all ${
                testResult.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
          )}

          {/* Guide Accordion */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                나이스 무료 인증키는 어떻게 발급받나요?
              </span>
              <span className="text-slate-400 text-xs font-normal">
                {showGuide ? '접기 ▲' : '보기 ▼'}
              </span>
            </button>

            {showGuide && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>
                    <a
                      href="https://open.neis.go.kr"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 font-semibold underline inline-flex items-center gap-0.5 hover:text-sky-700"
                    >
                      나이스 교육정보 개방포털 (open.neis.go.kr) <ExternalLink className="w-3 h-3" />
                    </a>
                    에 접속하여 회원가입합니다.
                  </li>
                  <li>상단 메뉴의 <strong>[인증키 발급 및 관리]</strong>를 클릭합니다.</li>
                  <li>기본 정보 입력 후 신청하면 <strong>즉시 무료로 발급</strong>됩니다.</li>
                  <li>발급된 인증키를 위 입력창에 복사/붙여넣기하고 [저장하기]를 누르면 완료!</li>
                </ol>
                <p className="text-[11px] text-slate-400 mt-2">
                  * 키가 없어도 공용 기본 호출로 테스트 가능합니다.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {keyInput && (
              <button
                type="button"
                onClick={handleClearKey}
                className="px-3.5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>키 삭제</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all"
              >
                저장 및 적용하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

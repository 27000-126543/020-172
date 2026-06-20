import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, MessageSquareText, ChevronDown, ChevronUp, ShieldAlert, Shield, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store';
import type { PatientSummary as PatientSummaryType } from '../types';
import { TREATMENT_SUGGESTION_LABELS, RISK_FACTOR_LABELS } from '../types';
import { cn } from '../lib/utils';

interface PatientSummaryProps {
  summary: PatientSummaryType;
}

export default function PatientSummary({ summary }: PatientSummaryProps) {
  const { toggleSummary, floatingWindow } = useAppStore();
  const { showSummary } = floatingWindow;
  const { riskPoints, keySpeeches, xrayRecommendation, xrayText, overallSuggestion, overallSuggestionText, combinedRiskAlert } = summary;

  const xrayConfig = {
    required: { label: '建议拍片', color: 'text-blue-600 bg-blue-100', icon: Radio },
    optional: { label: '可选拍片', color: 'text-slate-600 bg-slate-100', icon: Radio },
    'not-recommended': { label: '不建议拍片', color: 'text-rose-600 bg-rose-100', icon: Radio }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-3"
    >
      <button
        onClick={toggleSummary}
        className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-blue-100 transition-colors"
      >
        <MessageSquareText className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-indigo-700 flex-1 text-left">
          接诊摘要 · 开口就说
        </span>
        {showSummary ? (
          <ChevronUp className="w-4 h-4 text-indigo-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-indigo-500" />
        )}
      </button>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {combinedRiskAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'p-3 rounded-xl border',
                    overallSuggestion === 'defer'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      overallSuggestion === 'defer' ? 'text-red-500' : 'text-amber-500'
                    )} />
                    <p className={cn(
                      'text-sm leading-relaxed',
                      overallSuggestion === 'defer' ? 'text-red-700' : 'text-amber-700'
                    )}>
                      {combinedRiskAlert}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">综合评估</span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  TREATMENT_SUGGESTION_LABELS[overallSuggestion].color
                )}>
                  {TREATMENT_SUGGESTION_LABELS[overallSuggestion].label}
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-5">{overallSuggestionText}</p>

              {riskPoints.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-medium text-slate-600">风险因素</span>
                  </div>
                  <div className="pl-5 space-y-1.5">
                    {riskPoints.map((risk) => (
                      <div
                        key={risk.type}
                        className={cn(
                          'p-2 rounded-lg border',
                          risk.suggestion === 'defer'
                            ? 'bg-red-50/50 border-red-100'
                            : risk.suggestion === 'caution'
                            ? 'bg-amber-50/50 border-amber-100'
                            : 'bg-green-50/50 border-green-100'
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-medium text-slate-700">
                            {risk.label}
                          </span>
                          <span className={cn(
                            'px-1.5 py-px rounded text-[10px] font-medium',
                            TREATMENT_SUGGESTION_LABELS[risk.suggestion].color
                          )}>
                            {TREATMENT_SUGGESTION_LABELS[risk.suggestion].label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {risk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">拍片建议</span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-medium',
                    xrayConfig[xrayRecommendation].color
                  )}>
                    {xrayConfig[xrayRecommendation].label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                  {xrayText}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MessageSquareText className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">开口三句话</span>
                </div>
                <div className="pl-5 space-y-1.5">
                  {keySpeeches.map((speech, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 text-sm text-slate-700 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed text-[13px]">{speech}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

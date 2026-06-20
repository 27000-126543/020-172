import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, MessageCircle, Shield, AlertOctagon } from 'lucide-react';
import type { RiskSpeech } from '../types';
import { TREATMENT_SUGGESTION_LABELS } from '../types';
import { cn } from '../lib/utils';

interface RiskAlertProps {
  riskSpeeches: RiskSpeech[];
  combinedAlert?: string;
  overallSuggestion?: 'normal' | 'caution' | 'defer';
}

export default function RiskAlert({ riskSpeeches, combinedAlert, overallSuggestion }: RiskAlertProps) {
  const [expandedRisks, setExpandedRisks] = useState<string[]>([]);

  const toggleRisk = (riskType: string) => {
    setExpandedRisks(prev =>
      prev.includes(riskType)
        ? prev.filter(r => r !== riskType)
        : [...prev, riskType]
    );
  };

  if (riskSpeeches.length === 0) return null;

  const bgClass = overallSuggestion === 'defer'
    ? 'from-red-50 to-rose-50 border-red-200'
    : overallSuggestion === 'caution'
    ? 'from-amber-50 to-orange-50 border-amber-200'
    : 'from-green-50 to-emerald-50 border-green-200';

  const headerBgClass = overallSuggestion === 'defer'
    ? 'bg-red-100/50'
    : overallSuggestion === 'caution'
    ? 'bg-amber-100/50'
    : 'bg-green-100/50';

  const badgeClass = overallSuggestion === 'defer'
    ? 'bg-red-200 text-red-700'
    : overallSuggestion === 'caution'
    ? 'bg-amber-200 text-amber-700'
    : 'bg-green-200 text-green-700';

  const iconClass = overallSuggestion === 'defer'
    ? 'text-red-600'
    : overallSuggestion === 'caution'
    ? 'text-amber-600'
    : 'text-green-600';

  const pingClass = overallSuggestion === 'defer'
    ? 'bg-red-400'
    : overallSuggestion === 'caution'
    ? 'bg-amber-400'
    : 'bg-green-400';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-3"
    >
      <div className={cn('bg-gradient-to-r border rounded-xl overflow-hidden', bgClass)}>
        <div className={cn('flex items-center gap-2 px-3 py-2', headerBgClass)}>
          <div className="relative">
            <AlertTriangle className={cn('w-4 h-4', iconClass)} />
            <span className={cn('absolute inset-0 rounded-full animate-ping opacity-30', pingClass)} />
          </div>
          <span className={cn('text-sm font-semibold', iconClass)}>
            风险提示 · 请先确认以下事项
          </span>
          <span className={cn('ml-auto px-2 py-0.5 text-xs rounded-full font-medium', badgeClass)}>
            {riskSpeeches.length}项
          </span>
        </div>

        {combinedAlert && (
          <div className="px-3 py-2 border-t border-white/50 bg-white/30">
            <div className="flex items-start gap-2">
              <AlertOctagon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', iconClass)} />
              <p className={cn('text-xs leading-relaxed font-medium', iconClass)}>
                {combinedAlert}
              </p>
            </div>
          </div>
        )}

        <div className="divide-y divide-white/50">
          {riskSpeeches.map((risk) => (
            <div key={risk.riskType}>
              <button
                onClick={() => toggleRisk(risk.riskType)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/30 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 flex-1 text-left">
                  {risk.riskName}
                </span>
                <span className={cn(
                  'px-1.5 py-px rounded text-[10px] font-medium',
                  TREATMENT_SUGGESTION_LABELS[risk.treatmentSuggestion].color
                )}>
                  {TREATMENT_SUGGESTION_LABELS[risk.treatmentSuggestion].label}
                </span>
                {expandedRisks.includes(risk.riskType) ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              <AnimatePresence>
                {expandedRisks.includes(risk.riskType) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-3">
                      <div className="p-2 bg-white/60 rounded-lg border border-white/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <AlertOctagon className="w-3 h-3 text-slate-500" />
                          <span className="text-xs font-medium text-slate-600">治疗建议</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{risk.suggestionText}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <MessageCircle className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-medium text-blue-600">询问话术</span>
                        </div>
                        <div className="space-y-1.5">
                          {risk.questions.map((q, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.01 }}
                              className="bg-white rounded-lg px-2.5 py-2 border border-blue-100 text-sm text-slate-700 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                            >
                              {q}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Shield className="w-3 h-3 text-rose-500" />
                          <span className="text-xs font-medium text-rose-600">告知话术</span>
                        </div>
                        <div className="space-y-1.5">
                          {risk.disclaimers.map((d, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.01 }}
                              className="bg-white rounded-lg px-2.5 py-2 border border-rose-100 text-sm text-slate-700 cursor-pointer hover:border-rose-300 hover:shadow-sm transition-all"
                            >
                              {d}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

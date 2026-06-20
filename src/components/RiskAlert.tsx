import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, MessageCircle, Shield } from 'lucide-react';
import type { RiskSpeech } from '../types';
import { cn } from '../lib/utils';

interface RiskAlertProps {
  riskSpeeches: RiskSpeech[];
}

export default function RiskAlert({ riskSpeeches }: RiskAlertProps) {
  const [expandedRisks, setExpandedRisks] = useState<string[]>(
    riskSpeeches.map(r => r.riskType)
  );

  const toggleRisk = (riskType: string) => {
    setExpandedRisks(prev =>
      prev.includes(riskType)
        ? prev.filter(r => r !== riskType)
        : [...prev, riskType]
    );
  };

  if (riskSpeeches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-3"
    >
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/50">
          <div className="relative">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-30" />
          </div>
          <span className="text-sm font-semibold text-amber-700">
            风险提示 · 请先确认以下事项
          </span>
          <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-700 text-xs rounded-full font-medium">
            {riskSpeeches.length}项
          </span>
        </div>

        <div className="divide-y divide-amber-100">
          {riskSpeeches.map((risk) => (
            <div key={risk.riskType}>
              <button
                onClick={() => toggleRisk(risk.riskType)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-amber-100/30 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-medium text-amber-800 flex-1 text-left">
                  {risk.riskName}
                </span>
                {expandedRisks.includes(risk.riskType) ? (
                  <ChevronUp className="w-4 h-4 text-amber-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-500" />
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

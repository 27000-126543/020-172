import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, User, Stethoscope, History, ChevronRight, ChevronDown, Printer, Save } from 'lucide-react';
import type { Appointment } from '../types';
import { RISK_FACTOR_LABELS, APPOINTMENT_STATUS_LABELS, CONSULTATION_STAGE_LABELS } from '../types';
import { useAppStore } from '../store';
import StageProgress from './StageProgress';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface PatientCardProps {
  appointment: Appointment;
}

export default function PatientCard({ appointment }: PatientCardProps) {
  const { openFloatingWindow, setConsultationStage, getPatientReviewHistory } = useAppStore();
  const { patient, time, treatmentType, status, stage, patientId } = appointment;
  const [showHistory, setShowHistory] = useState(false);

  const statusColors = {
    pending: 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600'
  };

  const riskColors = {
    hypertension: 'bg-red-100 text-red-600',
    diabetes: 'bg-orange-100 text-orange-600',
    pregnancy: 'bg-pink-100 text-pink-600',
    longTermMedication: 'bg-purple-100 text-purple-600'
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-card-click')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    openFloatingWindow(appointment, {
      x: Math.min(rect.right + 20, window.innerWidth - 440),
      y: Math.max(rect.top, 100)
    });
  };

  const historyList = getPatientReviewHistory(patientId).slice(0, 5);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border border-slate-200',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:border-blue-300',
        status === 'in-progress' && 'ring-2 ring-blue-400 ring-offset-2'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            patient.gender === '男' ? 'bg-blue-50' : 'bg-pink-50'
          )}>
            <User className={cn(
              'w-6 h-6',
              patient.gender === '男' ? 'text-blue-500' : 'text-pink-500'
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">{patient.name}</h3>
            <p className="text-sm text-slate-500">{patient.gender} · {patient.age}岁</p>
          </div>
        </div>
        <span className={cn(
          'px-2.5 py-1 rounded-full text-xs font-medium',
          statusColors[status]
        )}>
          {APPOINTMENT_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Stethoscope className="w-4 h-4 text-slate-400" />
          <span>{treatmentType}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 no-card-click">
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <StageProgress
            currentStage={stage}
            onStageChange={(s) => {
              setConsultationStage(appointment.id, s);
            }}
            compact
          />
        </div>
      </div>

      {patient.riskFactors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">风险提示</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.riskFactors.map(risk => (
              <span
                key={risk}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium',
                  riskColors[risk]
                )}
              >
                {RISK_FACTOR_LABELS[risk]}
              </span>
            ))}
          </div>
        </div>
      )}

      {historyList.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 no-card-click">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHistory(!showHistory);
            }}
            className="w-full flex items-center gap-1.5 mb-2 hover:bg-slate-50 rounded px-1 py-0.5 -mx-1 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 flex-1 text-left">
              复诊交代历史（{historyList.length}条）
            </span>
            {showHistory ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-2"
              >
                {historyList.map((h) => (
                  <div
                    key={h.id}
                    className="p-2 bg-slate-50/80 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-500">
                        {h.printedAt}
                      </span>
                      <span className={cn(
                        'flex items-center gap-0.5 px-1.5 py-px rounded text-[10px] font-medium',
                        h.isPrinted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      )}>
                        {h.isPrinted ? (
                          <><Printer className="w-2.5 h-2.5" /> 已打印</>
                        ) : (
                          <><Save className="w-2.5 h-2.5" /> 仅保存</>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {h.treatments.slice(0, 3).map(t => (
                        <span key={t} className="px-1 py-px bg-white text-blue-700 text-[10px] rounded border border-blue-100">
                          {t}
                        </span>
                      ))}
                      {h.treatments.length > 3 && (
                        <span className="px-1 py-px text-slate-400 text-[10px]">
                          +{h.treatments.length - 3}
                        </span>
                      )}
                    </div>
                    {h.nextVisit && (
                      <p className="text-[10px] text-green-600 mb-0.5">{h.nextVisit}</p>
                    )}
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {h.verbalText.split('\n')[0]}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

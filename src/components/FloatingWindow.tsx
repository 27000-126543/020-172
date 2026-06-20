import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, GripVertical, User, Stethoscope, MessageSquareText, ClipboardList } from 'lucide-react';
import { useAppStore, getRiskSpeeches } from '../store';
import { RISK_FACTOR_LABELS } from '../types';
import RiskAlert from './RiskAlert';
import SpeechTabs from './SpeechTabs';
import ReviewPanel from './ReviewPanel';
import PatientSummary from './PatientSummary';
import StageProgress from './StageProgress';
import { cn } from '../lib/utils';

export default function FloatingWindow() {
  const {
    floatingWindow,
    closeFloatingWindow,
    toggleMinimize,
    setWindowPosition,
    toggleReviewPanel,
    getRiskSpeeches,
    getPatientSummary,
    setConsultationStage
  } = useAppStore();

  const { isOpen, appointment, position, isMinimized, showReviewPanel } = floatingWindow;
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const patient = appointment?.patient;
  const riskSpeeches = patient ? getRiskSpeeches(patient.riskFactors) : [];
  const hasRisks = patient && patient.riskFactors.length > 0;
  const patientSummary = appointment ? getPatientSummary(appointment) : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 420, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      setWindowPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, setWindowPosition]);

  if (!isOpen || !appointment) return null;

  const riskColors = {
    hypertension: 'bg-red-100 text-red-600',
    diabetes: 'bg-orange-100 text-orange-600',
    pregnancy: 'bg-pink-100 text-pink-600',
    longTermMedication: 'bg-purple-100 text-purple-600'
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: 1,
          scale: isMinimized ? 0.95 : 1,
          y: isMinimized ? 0 : 0,
          height: isMinimized ? 'auto' : 'auto'
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: 440,
          maxHeight: isMinimized ? 'none' : 'calc(100vh - 80px)',
          zIndex: 9999
        }}
        className={cn(
          'bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50',
          'flex flex-col overflow-hidden',
          isDragging && 'cursor-grabbing'
        )}
      >
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'flex items-center gap-2 px-4 py-3 border-b border-slate-200/50 cursor-grab',
            'bg-gradient-to-r from-slate-50 to-slate-100/50 select-none'
          )}
        >
          <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              patient?.gender === '男' ? 'bg-blue-100' : 'bg-pink-100'
            )}>
              <User className={cn(
                'w-4 h-4',
                patient?.gender === '男' ? 'text-blue-500' : 'text-pink-500'
              )} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 truncate">{patient?.name}</span>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {patient?.gender} · {patient?.age}岁
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 truncate">{appointment.treatmentType}</span>
              </div>
            </div>
          </div>

          {hasRisks && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {patient?.riskFactors.slice(0, 2).map(risk => (
                <span
                  key={risk}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium',
                    riskColors[risk]
                  )}
                >
                  {RISK_FACTOR_LABELS[risk]}
                </span>
              ))}
              {patient?.riskFactors && patient.riskFactors.length > 2 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                  +{patient.riskFactors.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="window-controls flex items-center gap-1 flex-shrink-0">
            <button
              onClick={toggleReviewPanel}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                showReviewPanel
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-slate-200 text-slate-500'
              )}
              title={showReviewPanel ? '切换到话术' : '切换到复诊'}
            >
              {showReviewPanel ? <MessageSquareText className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMinimize}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
              title="最小化"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={closeFloatingWindow}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 no-drag overflow-x-auto">
                <StageProgress
                  currentStage={appointment.stage}
                  onStageChange={(s) => setConsultationStage(appointment.id, s)}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-3 no-drag">
                {!showReviewPanel && patientSummary && (
                  <PatientSummary summary={patientSummary} />
                )}

                {hasRisks && !showReviewPanel && patientSummary && (
                  <RiskAlert
                    riskSpeeches={riskSpeeches}
                    combinedAlert={patientSummary.combinedRiskAlert}
                    overallSuggestion={patientSummary.overallSuggestion}
                  />
                )}

                {hasRisks && !showReviewPanel && !patientSummary && (
                  <RiskAlert riskSpeeches={riskSpeeches} />
                )}

                {showReviewPanel ? (
                  <div className="h-[440px]">
                    <ReviewPanel />
                  </div>
                ) : (
                  <div className="h-[440px]">
                    <SpeechTabs treatmentType={appointment.treatmentType} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isMinimized && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 text-center">
              已最小化 · 点击标题栏展开
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

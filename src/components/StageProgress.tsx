import { motion } from 'framer-motion';
import { UserCheck, Stethoscope, Radio, Scissors, ClipboardList, CheckCircle2 } from 'lucide-react';
import type { ConsultationStage } from '../types';
import { CONSULTATION_STAGE_LABELS } from '../types';
import { cn } from '../lib/utils';

interface StageProgressProps {
  currentStage: ConsultationStage;
  onStageChange: (stage: ConsultationStage) => void;
  compact?: boolean;
}

const stages: { id: ConsultationStage; icon: typeof UserCheck; color: string }[] = [
  { id: 'waiting', icon: UserCheck, color: 'from-slate-400 to-slate-500' },
  { id: 'exam', icon: Stethoscope, color: 'from-blue-400 to-blue-500' },
  { id: 'xray', icon: Radio, color: 'from-purple-400 to-purple-500' },
  { id: 'treatment', icon: Scissors, color: 'from-rose-400 to-rose-500' },
  { id: 'review', icon: ClipboardList, color: 'from-amber-400 to-amber-500' },
  { id: 'done', icon: CheckCircle2, color: 'from-green-400 to-green-500' }
];

export default function StageProgress({ currentStage, onStageChange, compact = false }: StageProgressProps) {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className={cn('flex items-center', compact ? 'gap-1' : 'gap-2')}>
      {stages.map((stage, idx) => {
        const Icon = stage.icon;
        const isActive = idx === currentIndex;
        const isPast = idx < currentIndex;
        const isClickable = idx <= currentIndex + 1;

        return (
          <div key={stage.id} className="flex items-center">
            <motion.button
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              onClick={(e) => {
                e.stopPropagation();
                if (isClickable) onStageChange(stage.id);
              }}
              className={cn(
                'flex flex-col items-center gap-0.5',
                compact ? 'px-1.5 py-1' : 'px-2 py-1.5',
                'rounded-lg transition-all',
                isActive
                  ? cn('bg-gradient-to-br', stage.color, 'text-white shadow-lg')
                  : isPast
                  ? 'text-green-600 bg-green-50'
                  : isClickable
                  ? 'text-slate-500 hover:bg-slate-100 cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
              )}
              disabled={!isClickable}
              title={CONSULTATION_STAGE_LABELS[stage.id]}
            >
              <Icon className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              {!compact && (
                <span className="text-[10px] font-medium">
                  {CONSULTATION_STAGE_LABELS[stage.id]}
                </span>
              )}
            </motion.button>
            {idx < stages.length - 1 && (
              <div className={cn(
                'h-0.5 w-3 rounded-full transition-colors',
                isPast ? 'bg-green-400' : 'bg-slate-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

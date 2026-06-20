import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Radio, Scissors, ClipboardList, MessageSquare } from 'lucide-react';
import type { SpeechCategory, SpeechTemplate } from '../types';
import { SPEECH_CATEGORY_LABELS } from '../types';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

interface SpeechTabsProps {
  treatmentType: string;
}

const tabIcons = {
  'before-exam': Stethoscope,
  'before-xray': Radio,
  'during-treatment': Scissors,
  'post-treatment': ClipboardList
};

const tabColors = {
  'before-exam': 'from-blue-500 to-blue-600',
  'before-xray': 'from-purple-500 to-purple-600',
  'during-treatment': 'from-rose-500 to-rose-600',
  'post-treatment': 'from-green-500 to-green-600'
};

const tabBgColors = {
  'before-exam': 'bg-blue-50 text-blue-700',
  'before-xray': 'bg-purple-50 text-purple-700',
  'during-treatment': 'bg-rose-50 text-rose-700',
  'post-treatment': 'bg-green-50 text-green-700'
};

export default function SpeechTabs({ treatmentType }: SpeechTabsProps) {
  const { floatingWindow, setActiveTab, getSpeechTemplates } = useAppStore();
  const { activeTab } = floatingWindow;
  const [enlargedCard, setEnlargedCard] = useState<number | null>(null);

  const tabs: SpeechCategory[] = ['before-exam', 'before-xray', 'during-treatment', 'post-treatment'];

  const templates = getSpeechTemplates(treatmentType);
  const activeTemplates = templates.filter(t => t.category === activeTab);

  const allContents = activeTemplates.flatMap(t => t.contents);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-4 gap-1 mb-3">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200',
                isActive
                  ? cn('bg-gradient-to-br', tabColors[tab], 'text-white shadow-lg')
                  : cn(tabBgColors[tab], 'hover:opacity-80')
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{SPEECH_CATEGORY_LABELS[tab]}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/80"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {allContents.length > 0 ? (
              allContents.map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: enlargedCard === index ? 1.02 : 1.01 }}
                  onClick={() => setEnlargedCard(enlargedCard === index ? null : index)}
                  className={cn(
                    'relative bg-white rounded-xl p-3 border cursor-pointer transition-all duration-200',
                    'hover:shadow-md',
                    enlargedCard === index
                      ? 'border-blue-400 shadow-lg ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                      'bg-gradient-to-br', tabColors[activeTab]
                    )}>
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <p className={cn(
                      'text-slate-700 leading-relaxed',
                      enlargedCard === index ? 'text-base' : 'text-sm'
                    )}>
                      {content}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无该分类话术</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

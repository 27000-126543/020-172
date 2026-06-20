import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Printer, Copy, MessageSquare, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore, nextVisitOptions } from '../store';
import { treatmentItems } from '../data/mockData';
import { cn } from '../lib/utils';

export default function ReviewPanel() {
  const {
    selectedReviewItems,
    setSelectedReviewItems,
    generateReview,
    generatedReview,
    floatingWindow
  } = useAppStore();

  const [activeSection, setActiveSection] = useState<'select' | 'verbal' | 'printed'>('select');
  const [copied, setCopied] = useState(false);

  const { treatments, nextVisit, customNotes } = selectedReviewItems;
  const patient = floatingWindow.appointment?.patient;

  const toggleTreatment = (item: string) => {
    const newTreatments = treatments.includes(item)
      ? treatments.filter(t => t !== item)
      : [...treatments, item];
    setSelectedReviewItems({ treatments: newTreatments });
  };

  const handleGenerate = () => {
    generateReview();
    if (generatedReview) {
      setActiveSection('verbal');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (!generatedReview) return;

    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>复诊单</title>
        <style>
          body {
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            margin: 0;
            padding: 10px;
            width: 280px;
          }
          .receipt {
            text-align: left;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #333;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 4px 0;
          }
          .info-row {
            margin: 2px 0;
          }
          .section {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #333;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 4px;
          }
          .notes {
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            border-top: 1px dashed #333;
            padding-top: 8px;
            margin-top: 8px;
            font-size: 11px;
          }
          .signature {
            margin-top: 20px;
            text-align: right;
          }
          @media print {
            body { width: 280px; }
            @page { margin: 0; size: 58mm auto; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <pre style="font-family: inherit; margin: 0; white-space: pre-wrap;">
${generatedReview.printedText}
          </pre>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const sections = [
    { id: 'select', label: '选择项目', icon: Check },
    { id: 'verbal', label: '口头交代', icon: MessageSquare },
    { id: 'printed', label: '打印小票', icon: FileText }
  ] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 mb-3 bg-slate-100 rounded-lg p-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                isActive
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  本次治疗项目
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {treatmentItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleTreatment(item)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all',
                        treatments.includes(item)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                        treatments.includes(item)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-300'
                      )}>
                        {treatments.includes(item) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  下次复诊安排
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {nextVisitOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedReviewItems({ nextVisit: nextVisit === option ? '' : option })}
                      className={cn(
                        'px-3 py-2 rounded-lg border text-sm transition-all',
                        nextVisit === option
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  补充医嘱（可选）
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setSelectedReviewItems({ customNotes: e.target.value })}
                  placeholder="输入需要特别嘱咐的内容..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleGenerate}
                disabled={treatments.length === 0}
                className={cn(
                  'w-full py-3 rounded-xl font-medium text-white transition-all',
                  treatments.length > 0
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 cursor-not-allowed'
                )}
              >
                生成复诊交代
              </motion.button>
            </motion.div>
          )}

          {activeSection === 'verbal' && (
            <motion.div
              key="verbal"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              {generatedReview ? (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">口头交代内容</span>
                      </div>
                      <button
                        onClick={() => handleCopy(generatedReview.verbalText)}
                        className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-slate-600 hover:bg-blue-50 transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? '已复制' : '复制'}
                      </button>
                    </div>
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {generatedReview.verbalText}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveSection('select')}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-all"
                    >
                      修改内容
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveSection('printed')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-sm font-medium text-white shadow-lg transition-all"
                    >
                      查看打印版
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">请先选择治疗项目并生成</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'printed' && (
            <motion.div
              key="printed"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              {generatedReview ? (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">打印小票预览</span>
                        </div>
                        <span className="text-xs text-slate-400">58mm 热敏纸</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50/50">
                      <div className="max-w-[240px] mx-auto bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {generatedReview.printedText}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleCopy(generatedReview.printedText)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制内容'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-sm font-medium text-white shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      打印小票
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Printer className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">请先选择治疗项目并生成</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

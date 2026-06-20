import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Printer, Copy, MessageSquare, FileText, Save, History, RotateCcw, Filter, X, Plus, Minus, Edit3, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useAppStore, nextVisitOptions } from '../store';
import { treatmentItems } from '../data/mockData';
import { cn } from '../lib/utils';

export default function ReviewPanel() {
  const {
    selectedReviewItems,
    originalReviewItems,
    appliedHistoryId,
    setSelectedReviewItems,
    generateReview,
    generatedReview,
    floatingWindow,
    saveReviewHistory,
    getPatientReviewHistory,
    applyReviewHistory,
    clearAppliedHistory,
    getReviewItemChanges
  } = useAppStore();

  const [activeSection, setActiveSection] = useState<'select' | 'verbal' | 'printed' | 'history'>('select');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [historyFilterStatus, setHistoryFilterStatus] = useState<'all' | 'printed' | 'draft'>('all');
  const [historyFilterTreatment, setHistoryFilterTreatment] = useState<string>('');
  const [showChangesConfirm, setShowChangesConfirm] = useState(false);

  const { treatments, nextVisit, customNotes } = selectedReviewItems;
  const patient = floatingWindow.appointment?.patient;
  const patientId = floatingWindow.appointment?.patientId;
  const appointment = floatingWindow.appointment;
  const fullHistoryList = patientId ? getPatientReviewHistory(patientId, appointment || undefined) : [];

  const allHistoryTreatments = useMemo(() => {
    const set = new Set<string>();
    fullHistoryList.forEach(h => h.treatments.forEach(t => set.add(t)));
    return Array.from(set);
  }, [fullHistoryList]);

  const historyList = useMemo(() => {
    let result = fullHistoryList;
    if (historyFilterStatus === 'printed') {
      result = result.filter(h => h.isPrinted);
    } else if (historyFilterStatus === 'draft') {
      result = result.filter(h => !h.isPrinted);
    }
    if (historyFilterTreatment) {
      result = result.filter(h => h.treatments.includes(historyFilterTreatment));
    }
    return result.slice(0, 8);
  }, [fullHistoryList, historyFilterStatus, historyFilterTreatment]);

  const changes = getReviewItemChanges();
  const hasChanges = changes && (
    changes.addedTreatments.length > 0 ||
    changes.removedTreatments.length > 0 ||
    changes.changedNextVisit ||
    changes.changedCustomNotes
  );

  useEffect(() => {
    if (treatments.length > 0 && !generatedReview) {
      generateReview(false);
    }
    if (treatments.length > 0 && generatedReview && activeSection === 'select') {
      setActiveSection('verbal');
    }
  }, [treatments, generatedReview, activeSection, generateReview]);

  const toggleTreatment = (item: string) => {
    const newTreatments = treatments.includes(item)
      ? treatments.filter(t => t !== item)
      : [...treatments, item];
    setSelectedReviewItems({ treatments: newTreatments });
    if (newTreatments.length > 0 && activeSection === 'select') {
      setActiveSection('verbal');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWithCheck = () => {
    if (hasChanges) {
      setShowChangesConfirm(true);
    } else {
      doSave(false);
    }
  };

  const handlePrintWithCheck = () => {
    if (hasChanges) {
      setShowChangesConfirm(true);
    } else {
      doPrint();
    }
  };

  const doSave = (isPrinted: boolean) => {
    saveReviewHistory(isPrinted);
    if (!isPrinted) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setShowChangesConfirm(false);
  };

  const doPrint = () => {
    if (!generatedReview) return;
    saveReviewHistory(true);
    setShowChangesConfirm(false);

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
          pre {
            font-family: inherit;
            margin: 0;
            white-space: pre-wrap;
          }
          @media print {
            body { width: 280px; }
            @page { margin: 0; size: 58mm auto; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <pre>${generatedReview.printedText}</pre>
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

  const handleApplyHistory = (history: any) => {
    applyReviewHistory(history);
    setActiveSection('select');
  };

  const getDisplayTime = (h: any) => {
    return h.isPrinted ? h.printedAt : h.createdAt;
  };

  const isTreatmentAdded = (t: string) => changes?.addedTreatments.includes(t);
  const isTreatmentRemoved = (t: string) => changes?.removedTreatments.includes(t);
  const isTreatmentOriginal = (t: string) => originalReviewItems?.treatments.includes(t) && !isTreatmentRemoved(t);

  const sections = [
    { id: 'select', label: '选择项目', icon: Check },
    { id: 'verbal', label: '口头交代', icon: MessageSquare },
    { id: 'printed', label: '打印小票', icon: FileText },
    { id: 'history', label: '历史记录', icon: History }
  ] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 mb-3 bg-slate-100 rounded-lg p-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isHistory = section.id === 'history';
          const hasBadge = isHistory && (historyFilterStatus !== 'all' || historyFilterTreatment !== '');
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'relative flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all',
                isActive
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{section.label}</span>
              {hasBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-slate-100" />
              )}
            </button>
          );
        })}
      </div>

      {appliedHistoryId && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs font-medium text-blue-700">内容从历史记录带入</p>
                <button
                  onClick={() => { clearAppliedHistory(); }}
                  className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                >
                  <X className="w-2.5 h-2.5" /> 取消标记
                </button>
              </div>
              <p className="text-[11px] text-blue-600">
                {hasChanges ? '已检测到改动，保存/打印前可查看核对' : '请核对内容是否合适，或直接修改'}
              </p>
            </div>
          </div>
          {hasChanges && (
            <div className="mt-2 pt-2 border-t border-blue-100 space-y-1.5">
              {changes?.addedTreatments && changes.addedTreatments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Plus className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] text-slate-500">新增项目：</span>
                  {changes.addedTreatments.map(t => (
                    <span key={t} className="px-1.5 py-px bg-green-100 text-green-700 text-[10px] rounded">
                      +{t}
                    </span>
                  ))}
                </div>
              )}
              {changes?.removedTreatments && changes.removedTreatments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Minus className="w-3 h-3 text-red-600" />
                  <span className="text-[10px] text-slate-500">移除项目：</span>
                  {changes.removedTreatments.map(t => (
                    <span key={t} className="px-1.5 py-px bg-red-100 text-red-700 text-[10px] rounded line-through">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {changes?.changedNextVisit && (
                <div className="flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3 text-purple-600" />
                  <span className="text-[10px] text-slate-500">复诊安排已修改</span>
                </div>
              )}
              {changes?.changedCustomNotes && (
                <div className="flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3 text-purple-600" />
                  <span className="text-[10px] text-slate-500">补充医嘱已修改</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

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
                  {treatmentItems.map((item) => {
                    const isAdded = isTreatmentAdded(item);
                    const isOriginal = isTreatmentOriginal(item);
                    const isChecked = treatments.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleTreatment(item)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all relative',
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
                          isAdded && 'ring-2 ring-green-300 ring-offset-0',
                          isOriginal && !isAdded && 'ring-1 ring-blue-200'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                          isChecked
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300'
                        )}>
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="truncate flex-1 text-left">{item}</span>
                        {isAdded && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-green-500 rounded-full">
                            <Plus className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                        {isOriginal && !isAdded && isChecked && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full text-[8px] text-white font-bold">
                            原
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    下次复诊安排
                  </label>
                  {changes?.changedNextVisit && (
                    <span className="text-[10px] text-purple-600 flex items-center gap-0.5 bg-purple-50 px-1.5 py-0.5 rounded">
                      <Edit3 className="w-2.5 h-2.5" /> 已修改
                    </span>
                  )}
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    补充医嘱（可选）
                  </label>
                  {changes?.changedCustomNotes && (
                    <span className="text-[10px] text-purple-600 flex items-center gap-0.5 bg-purple-50 px-1.5 py-0.5 rounded">
                      <Edit3 className="w-2.5 h-2.5" /> 已修改
                    </span>
                  )}
                </div>
                <textarea
                  value={customNotes}
                  onChange={(e) => setSelectedReviewItems({ customNotes: e.target.value })}
                  placeholder="输入需要特别嘱咐的内容..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              {treatments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  请选择至少一个治疗项目，将自动生成交代内容
                </p>
              )}
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
                  <p className="text-sm">请先选择治疗项目</p>
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
                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-amber-800 mb-1">已检测到带入内容有改动</p>
                          <p className="text-[11px] text-amber-700 mb-2">
                            保存/打印前请确认修改内容是否正确，避免旧医嘱错误给患者
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {changes?.addedTreatments.map(t => (
                              <span key={`a-${t}`} className="px-1.5 py-px bg-green-100 text-green-700 text-[10px] rounded">+{t}</span>
                            ))}
                            {changes?.removedTreatments.map(t => (
                              <span key={`r-${t}`} className="px-1.5 py-px bg-red-100 text-red-700 text-[10px] rounded line-through">-{t}</span>
                            ))}
                            {changes?.changedNextVisit && (
                              <span className="px-1.5 py-px bg-purple-100 text-purple-700 text-[10px] rounded">复诊改</span>
                            )}
                            {changes?.changedCustomNotes && (
                              <span className="px-1.5 py-px bg-purple-100 text-purple-700 text-[10px] rounded">医嘱改</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

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
                      onClick={handleSaveWithCheck}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl text-sm font-medium text-white shadow-lg transition-all"
                    >
                      {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saved ? '已保存' : '保存记录'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handlePrintWithCheck}
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
                  <p className="text-sm">请先选择治疗项目</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">复诊交代历史</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {historyFilterStatus !== 'all' || historyFilterTreatment
                      ? `筛选 ${historyList.length} / ${fullHistoryList.length} 条`
                      : `共 ${fullHistoryList.length} 条`}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-medium text-slate-600">筛选条件</span>
                    {(historyFilterStatus !== 'all' || historyFilterTreatment) && (
                      <button
                        onClick={() => { setHistoryFilterStatus('all'); setHistoryFilterTreatment(''); }}
                        className="ml-auto text-[10px] text-slate-500 hover:text-slate-700 flex items-center gap-0.5"
                      >
                        <X className="w-2.5 h-2.5" /> 重置
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { key: 'all', label: '全部', activeClass: 'bg-blue-500' },
                      { key: 'printed', label: '已打印', activeClass: 'bg-green-500' },
                      { key: 'draft', label: '仅草稿', activeClass: 'bg-amber-500' }
                    ] as const).map(opt => {
                      const isActive = historyFilterStatus === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setHistoryFilterStatus(opt.key as any)}
                          className={cn(
                            'px-2 py-0.5 rounded-md text-[11px] font-medium transition-all',
                            isActive
                              ? `${opt.activeClass} text-white shadow-sm`
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {allHistoryTreatments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">按项目：</span>
                      <div className="flex flex-wrap gap-1">
                        {allHistoryTreatments.map(t => {
                          const isActive = historyFilterTreatment === t;
                          return (
                            <button
                              key={t}
                              onClick={() => setHistoryFilterTreatment(isActive ? '' : t)}
                              className={cn(
                                'px-1.5 py-0.5 rounded text-[10px] transition-all',
                                isActive
                                  ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200'
                                  : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-200 hover:text-blue-600'
                              )}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {historyList.length > 0 ? (
                  <div className="space-y-2">
                    {historyList.map((h) => (
                      <div
                        key={h.id}
                        className={cn(
                          'p-3 rounded-xl border transition-colors',
                          h.isPrinted
                            ? 'bg-green-50/30 border-green-100 hover:border-green-200'
                            : 'bg-amber-50/30 border-amber-100 hover:border-amber-200',
                          appliedHistoryId === h.id && 'ring-2 ring-blue-400 ring-offset-1'
                        )}
                      >
                        {appliedHistoryId === h.id && (
                          <div className="mb-2 -mx-1 -mt-1 p-1.5 bg-blue-100 rounded-md flex items-center gap-1.5">
                            <Info className="w-3 h-3 text-blue-600" />
                            <span className="text-[10px] font-medium text-blue-700">当前已带入此条记录</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            {h.isPrinted ? (
                              <><Printer className="w-2.5 h-2.5 text-green-600" /> 打印时间：{getDisplayTime(h)}</>
                            ) : (
                              <><Save className="w-2.5 h-2.5 text-amber-600" /> 保存时间：{getDisplayTime(h)}</>
                            )}
                          </span>
                          <span className={cn(
                            'flex items-center gap-0.5 px-1.5 py-px rounded text-[10px] font-medium',
                            h.isPrinted
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          )}>
                            {h.isPrinted ? '已打印' : '草稿'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-500">治疗项目：</span>
                          <div className="flex flex-wrap gap-1">
                            {h.treatments.map(t => (
                              <span key={t} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {h.nextVisit && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-slate-500">复诊安排：</span>
                            <span className="text-xs text-green-600 font-medium">{h.nextVisit}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-500 mb-1">口头交代摘要：</p>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {h.verbalText}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleCopy(h.verbalText)}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1 border border-slate-200"
                          >
                            <Copy className="w-3 h-3" />
                            复制口头
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleCopy(h.printedText)}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-center gap-1 border border-slate-200"
                          >
                            <Copy className="w-3 h-3" />
                            复制小票
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleApplyHistory(h)}
                            className={cn(
                              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 text-white',
                              appliedHistoryId === h.id
                                ? 'bg-gradient-to-r from-slate-500 to-slate-600'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                            )}
                          >
                            <RotateCcw className="w-3 h-3" />
                            {appliedHistoryId === h.id ? '重新带入' : '一键带入'}
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    {historyFilterStatus !== 'all' || historyFilterTreatment ? (
                      <>
                        <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">没有匹配的历史记录</p>
                        <button
                          onClick={() => { setHistoryFilterStatus('all'); setHistoryFilterTreatment(''); }}
                          className="mt-2 text-xs text-blue-500 hover:underline"
                        >
                          清除筛选条件
                        </button>
                      </>
                    ) : (
                      <>
                        <History className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">暂无历史记录</p>
                        <p className="text-xs mt-1">打印或保存后将在此处显示</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showChangesConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
            onClick={() => setShowChangesConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">确认保存/打印内容</h3>
                    <p className="text-xs text-slate-600 mt-0.5">内容由历史带入后已做修改，请核对以下改动</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 space-y-2">
                {changes?.addedTreatments && changes.addedTreatments.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Plus className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-slate-500">新增项目：</span>
                    <div className="flex flex-wrap gap-1">
                      {changes.addedTreatments.map(t => (
                        <span key={t} className="px-1.5 py-px bg-green-100 text-green-700 text-[10px] rounded font-medium">
                          +{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {changes?.removedTreatments && changes.removedTreatments.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <Minus className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-xs text-slate-500">移除项目：</span>
                    <div className="flex flex-wrap gap-1">
                      {changes.removedTreatments.map(t => (
                        <span key={t} className="px-1.5 py-px bg-red-100 text-red-700 text-[10px] rounded font-medium line-through">
                          -{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(changes?.changedNextVisit || changes?.changedCustomNotes) && (
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Edit3 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-xs text-slate-600">
                      {[
                        changes?.changedNextVisit && '复诊安排',
                        changes?.changedCustomNotes && '补充医嘱'
                      ].filter(Boolean).join('、')}已修改
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 pt-1">
                  请确认改动无误后继续操作，避免将旧医嘱错误给到患者
                </p>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setShowChangesConfirm(false)}
                  className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  再看看
                </button>
                <button
                  onClick={() => doSave(false)}
                  className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-sm font-medium text-white hover:from-amber-600 hover:to-amber-700 transition-colors"
                >
                  仅保存
                </button>
                <button
                  onClick={() => { doSave(true); doPrint(); }}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-sm font-medium text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  保存并打印
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, User, CalendarDays, ChevronLeft, ChevronRight, Filter, X, ClipboardList, AlertCircle } from 'lucide-react';
import PatientCard from '../components/PatientCard';
import FloatingWindow from '../components/FloatingWindow';
import { useAppStore, HANDOFF_CATEGORIES } from '../store';
import { cn } from '../lib/utils';

export default function Home() {
  const { selectedDate, setSelectedDate, searchQuery, setSearchQuery, handoffFilter, setHandoffFilter, getFilteredAppointments, floatingWindow, appointments, openFloatingWindow } = useAppStore();
  const appointmentsList = getFilteredAppointments();

  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      full: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
      short: `${date.getMonth() + 1}月${date.getDate()}日`,
      weekDay: weekDays[date.getDay()]
    };
  };

  const changeDate = (offset: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const dateInfo = formatDate(selectedDate);

  const statusCounts = {
    pending: appointmentsList.filter(a => a.status === 'pending').length,
    'in-progress': appointmentsList.filter(a => a.status === 'in-progress').length,
    completed: appointmentsList.filter(a => a.status === 'completed').length
  };

  const todayAppointments = appointments.filter(a => a.date === selectedDate);
  const handoffStats = useMemo(() => {
    const stats: Record<string, typeof appointments> = {};
    HANDOFF_CATEGORIES.forEach(cat => {
      stats[cat.key] = todayAppointments.filter(a => 
        a.handoffNote && a.handoffNote.includes(cat.key)
      );
    });
    return stats;
  }, [todayAppointments]);

  const totalHandoffPatients = todayAppointments.filter(a => a.handoffNote).length;

  const dateInfo2 = formatDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">椅旁话术系统</h1>
                <p className="text-sm text-slate-500">口腔医生接诊助手</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索患者姓名或治疗项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">李医生</p>
                  <p className="text-xs text-slate-500">主治医师</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeDate(-1)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {dateInfo.short} {dateInfo.weekDay}
                  </span>
                  {isToday && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                      今天
                    </span>
                  )}
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-slate-800">{dateInfo.full}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-600">待诊 {statusCounts.pending}</span>
            </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-600">就诊中 {statusCounts['in-progress']}</span>
            </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">已完成 {statusCounts.completed}</span>
            </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            共 {appointmentsList.length} 位预约 · 点击患者卡片打开话术浮窗
          </p>
        </div>

        {totalHandoffPatients > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800">护士交接汇总</span>
                  <span className="text-xs text-slate-500 ml-2">共 {totalHandoffPatients} 位患者需特别处理</span>
                </div>
              </div>
              {handoffFilter && (
                <button
                  onClick={() => setHandoffFilter('')}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <X className="w-3 h-3" /> 清除筛选
                </button>
              )}
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {HANDOFF_CATEGORIES.map(cat => {
                const count = handoffStats[cat.key]?.length || 0;
                const isActive = handoffFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setHandoffFilter(isActive ? '' : cat.key)}
                    className={cn(
                      'group relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                      count === 0 && 'opacity-40 cursor-not-allowed',
                      isActive
                        ? 'ring-2 ring-offset-1 ring-blue-500 shadow-md scale-[1.02]'
                        : count > 0 && 'hover:scale-[1.02] hover:shadow-sm',
                      cat.color
                    )}
                    disabled={count === 0}
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className={cn('w-3.5 h-3.5', isActive ? '' : 'opacity-70')} />
                      {cat.label}
                    </span>
                    <span className={cn(
                      'ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold',
                      isActive ? 'bg-white/60' : 'bg-white/40'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400">
                <Filter className="w-3 h-3" />
                <span>点击标签筛选对应患者</span>
              </div>
            </div>

            {handoffFilter && handoffStats[handoffFilter]?.length > 0 && (
              <div className="px-4 pb-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-2">
                    以下{handoffStats[handoffFilter].length}位患者需
                    <span className="font-semibold text-slate-700 mx-1">
                      {HANDOFF_CATEGORIES.find(c => c.key === handoffFilter)?.label}
                    </span>
                    ，点击直接打开：
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {handoffStats[handoffFilter].map(apt => (
                      <button
                        key={apt.id}
                        onClick={() => openFloatingWindow(apt)}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="font-medium">{apt.time}</span>
                        <span>{apt.patient.name}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{apt.treatmentType}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {appointmentsList.length > 0 ? (
              appointmentsList.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PatientCard appointment={appointment} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">
                    {handoffFilter
                      ? '当前筛选条件下暂无匹配患者'
                      : '当日暂无预约'}
                  </p>
                  {handoffFilter && (
                    <button
                      onClick={() => setHandoffFilter('')}
                      className="mt-3 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      清除筛选，查看全部
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {floatingWindow.isOpen && <FloatingWindow />}
    </div>
  );
}

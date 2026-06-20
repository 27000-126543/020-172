import { create } from 'zustand';
import type { Appointment, SpeechCategory, GeneratedReview, SelectedReviewItems, ConsultationStage, PatientSummary, RiskFactor, ReviewHistory, TreatmentSuggestion } from '../types';
import { STAGE_TO_TAB, RISK_FACTOR_LABELS, TREATMENT_SUGGESTION_LABELS } from '../types';
import { mockAppointments, mockSpeechTemplates, mockRiskSpeeches, mockReviewTemplates, nextVisitOptions, XRAY_RECOMMENDATIONS } from '../data/mockData';

interface AppState {
  appointments: Appointment[];
  selectedDate: string;
  searchQuery: string;
  handoffFilter: string;
  floatingWindow: {
    isOpen: boolean;
    appointment: Appointment | null;
    position: { x: number; y: number };
    isMinimized: boolean;
    activeTab: SpeechCategory;
    showReviewPanel: boolean;
    showSummary: boolean;
  };
  selectedReviewItems: SelectedReviewItems;
  originalReviewItems: SelectedReviewItems | null;
  appliedHistoryId: string | null;
  generatedReview: GeneratedReview | null;
  reviewHistory: ReviewHistory[];
  setSelectedDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
  setHandoffFilter: (filter: string) => void;
  openFloatingWindow: (appointment: Appointment, position?: { x: number; y: number }) => void;
  closeFloatingWindow: () => void;
  toggleMinimize: () => void;
  setActiveTab: (tab: SpeechCategory) => void;
  setWindowPosition: (position: { x: number; y: number }) => void;
  toggleReviewPanel: () => void;
  toggleSummary: () => void;
  setSelectedReviewItems: (items: Partial<SelectedReviewItems>) => void;
  generateReview: (autoSwitch?: boolean) => void;
  saveReviewHistory: (isPrinted?: boolean) => void;
  applyReviewHistory: (history: ReviewHistory) => void;
  clearAppliedHistory: () => void;
  setConsultationStage: (appointmentId: string, stage: ConsultationStage) => void;
  setHandoffNote: (appointmentId: string, note: string) => void;
  getSpeechTemplates: (treatmentType: string) => typeof mockSpeechTemplates;
  getRiskSpeeches: (riskFactors: string[]) => typeof mockRiskSpeeches;
  getPatientSummary: (appointment: Appointment) => PatientSummary;
  getFilteredAppointments: () => Appointment[];
  getPatientReviewHistory: (patientId: string, appointment?: Appointment) => ReviewHistory[];
  getReviewItemChanges: () => {
    addedTreatments: string[];
    removedTreatments: string[];
    changedNextVisit: boolean;
    changedCustomNotes: boolean;
  } | null;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const loadReviewHistory = (): ReviewHistory[] => {
  try {
    const saved = localStorage.getItem('reviewHistory');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadHandoffNotes = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem('handoffNotes');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const initializeAppointments = (): Appointment[] => {
  const savedNotes = loadHandoffNotes();
  return mockAppointments.map(apt => {
    if (savedNotes[apt.id] !== undefined) {
      return { ...apt, handoffNote: savedNotes[apt.id] };
    }
    return apt;
  });
};

const saveHandoffNotes = (appointments: Appointment[]) => {
  const notes: Record<string, string> = {};
  appointments.forEach(apt => {
    if (apt.handoffNote) {
      notes[apt.id] = apt.handoffNote;
    }
  });
  localStorage.setItem('handoffNotes', JSON.stringify(notes));
};

export const HANDOFF_CATEGORIES = [
  { key: '血压', label: '先量血压', color: 'bg-red-100 text-red-700' },
  { key: '拍片', label: '先拍片', color: 'bg-purple-100 text-purple-700' },
  { key: '暂缓', label: '暂缓治疗', color: 'bg-amber-100 text-amber-700' },
  { key: '签字', label: '需术前签字', color: 'bg-orange-100 text-orange-700' },
  { key: '会诊', label: '请内科会诊', color: 'bg-blue-100 text-blue-700' }
];

export const useAppStore = create<AppState>((set, get) => ({
  appointments: initializeAppointments(),
  selectedDate: getTodayDate(),
  searchQuery: '',
  handoffFilter: '',
  floatingWindow: {
    isOpen: false,
    appointment: null,
    position: { x: 200, y: 100 },
    isMinimized: false,
    activeTab: 'before-exam',
    showReviewPanel: false,
    showSummary: true
  },
  selectedReviewItems: {
    treatments: [],
    nextVisit: '',
    customNotes: ''
  },
  originalReviewItems: null,
  appliedHistoryId: null,
  generatedReview: null,
  reviewHistory: loadReviewHistory(),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setHandoffFilter: (filter) => set({ handoffFilter: filter }),

  openFloatingWindow: (appointment, position) => {
    const stageTab = STAGE_TO_TAB[appointment.stage];
    const isReview = stageTab === 'review';
    const activeTab: SpeechCategory = isReview ? 'post-treatment' : (stageTab as SpeechCategory);
    const initialTreatments = appointment.treatmentType ? [appointment.treatmentType] : [];

    set({
      floatingWindow: {
        isOpen: true,
        appointment,
        position: position || { x: 200, y: 100 },
        isMinimized: false,
        activeTab,
        showReviewPanel: isReview,
        showSummary: true
      },
      selectedReviewItems: {
        treatments: initialTreatments,
        nextVisit: '',
        customNotes: ''
      },
      originalReviewItems: null,
      appliedHistoryId: null,
      generatedReview: null
    });

    if (initialTreatments.length > 0) {
      setTimeout(() => {
        get().generateReview(false);
      }, 0);
    }
  },

  closeFloatingWindow: () => set({
    floatingWindow: {
      ...get().floatingWindow,
      isOpen: false,
      appointment: null
    }
  }),

  toggleMinimize: () => set({
    floatingWindow: {
      ...get().floatingWindow,
      isMinimized: !get().floatingWindow.isMinimized
    }
  }),

  setActiveTab: (tab) => set({
    floatingWindow: {
      ...get().floatingWindow,
      activeTab: tab,
      showReviewPanel: false
    }
  }),

  setWindowPosition: (position) => set({
    floatingWindow: {
      ...get().floatingWindow,
      position
    }
  }),

  toggleReviewPanel: () => {
    const willShowReview = !get().floatingWindow.showReviewPanel;
    set({
      floatingWindow: {
        ...get().floatingWindow,
        showReviewPanel: willShowReview,
        activeTab: willShowReview ? 'post-treatment' : get().floatingWindow.activeTab
      }
    });
    if (willShowReview) {
      const { selectedReviewItems, generatedReview } = get();
      if (selectedReviewItems.treatments.length > 0 && !generatedReview) {
        get().generateReview(false);
      }
    }
  },

  toggleSummary: () => set({
    floatingWindow: {
      ...get().floatingWindow,
      showSummary: !get().floatingWindow.showSummary
    }
  }),

  setSelectedReviewItems: (items) => {
    const newItems = {
      ...get().selectedReviewItems,
      ...items
    };
    set({ selectedReviewItems: newItems });
    if (newItems.treatments.length > 0) {
      setTimeout(() => {
        get().generateReview(false);
      }, 0);
    } else {
      set({ generatedReview: null });
    }
  },

  generateReview: (autoSwitch = true) => {
    const { selectedReviewItems, floatingWindow } = get();
    const { treatments, nextVisit, customNotes } = selectedReviewItems;
    const patient = floatingWindow.appointment?.patient;

    let verbalText = '';
    let printedText = '';

    if (treatments.length > 0) {
      verbalText += `${patient?.name}您好，今天给您做的是${treatments.join('、')}。\n\n`;
      printedText += `================================\n`;
      printedText += `      口腔治疗复诊单\n`;
      printedText += `================================\n\n`;
      printedText += `患者姓名：${patient?.name}\n`;
      printedText += `性    别：${patient?.gender}\n`;
      printedText += `年    龄：${patient?.age}岁\n`;
      printedText += `治疗项目：${treatments.join('、')}\n`;
      printedText += `治疗日期：${new Date().toLocaleDateString('zh-CN')}\n\n`;
    }

    const verbalInstructions: string[] = [];
    const printedNotes: string[] = [];

    treatments.forEach(treatment => {
      const template = mockReviewTemplates.find(t => t.treatmentItem === treatment);
      if (template) {
        verbalInstructions.push(...template.verbalInstructions);
        printedNotes.push(...template.printedNotes);
        printedNotes.push('');
      }
    });

    if (verbalInstructions.length > 0) {
      verbalText += verbalInstructions.map((item, index) => `${index + 1}. ${item}`).join('\n\n');
      verbalText += '\n\n';
    }

    if (printedNotes.length > 0) {
      printedText += '【注意事项】\n';
      printedText += printedNotes.join('\n');
      printedText += '\n';
    }

    if (nextVisit) {
      verbalText += `下次请${nextVisit}。`;
      printedText += `【复诊安排】\n${nextVisit}\n\n`;
    }

    if (customNotes) {
      verbalText += `\n\n另外，${customNotes}`;
      printedText += `【医嘱】\n${customNotes}\n\n`;
    }

    printedText += `医生签名：__________\n`;
    printedText += `联系电话：400-888-8888\n`;
    printedText += `================================\n`;

    const stateUpdate: Partial<AppState> = {
      generatedReview: {
        verbalText,
        printedText
      }
    };

    if (autoSwitch) {
      stateUpdate.floatingWindow = {
        ...get().floatingWindow,
        showReviewPanel: true,
        activeTab: 'post-treatment'
      };
    }

    set(stateUpdate as AppState);
  },

  saveReviewHistory: (isPrinted = false) => {
    const { generatedReview, selectedReviewItems, floatingWindow, reviewHistory } = get();
    if (!generatedReview || !floatingWindow.appointment) return;

    const now = new Date();
    const formatTime = (d: Date) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const nowStr = formatTime(now);
    const historyItem: ReviewHistory = {
      id: `rh-${Date.now()}`,
      patientId: floatingWindow.appointment.patientId,
      appointmentId: floatingWindow.appointment.id,
      treatments: selectedReviewItems.treatments,
      nextVisit: selectedReviewItems.nextVisit,
      customNotes: selectedReviewItems.customNotes,
      verbalText: generatedReview.verbalText,
      printedText: generatedReview.printedText,
      printedAt: nowStr,
      createdAt: nowStr,
      isPrinted
    };

    const newHistory = [historyItem, ...reviewHistory].slice(0, 100);
    localStorage.setItem('reviewHistory', JSON.stringify(newHistory));

    const updatedAppointments = get().appointments.map(apt => {
      if (apt.id === floatingWindow.appointment?.id) {
        return { ...apt, lastReview: historyItem };
      }
      return apt;
    });

    set({
      reviewHistory: newHistory,
      appointments: updatedAppointments,
      originalReviewItems: null,
      appliedHistoryId: null,
      floatingWindow: {
        ...get().floatingWindow,
        appointment: {
          ...floatingWindow.appointment,
          lastReview: historyItem
        }
      }
    });
  },

  getPatientReviewHistory: (patientId, appointment) => {
    const savedHistory = get().reviewHistory.filter(h => h.patientId === patientId);
    const allHistory = [...savedHistory];
    if (appointment?.lastReview && !allHistory.find(h => h.id === appointment.lastReview?.id)) {
      allHistory.push(appointment.lastReview);
    }
    return allHistory.sort((a, b) => {
      const timeA = a.isPrinted ? a.printedAt : a.createdAt;
      const timeB = b.isPrinted ? b.printedAt : b.createdAt;
      return timeB.localeCompare(timeA);
    });
  },

  applyReviewHistory: (history) => {
    const newItems = {
      treatments: [...history.treatments],
      nextVisit: history.nextVisit || '',
      customNotes: history.customNotes || ''
    };
    set({
      selectedReviewItems: newItems,
      originalReviewItems: { ...newItems },
      appliedHistoryId: history.id
    });
    setTimeout(() => {
      get().generateReview(false);
    }, 0);
  },

  clearAppliedHistory: () => {
    set({
      originalReviewItems: null,
      appliedHistoryId: null
    });
  },

  getReviewItemChanges: () => {
    const { selectedReviewItems, originalReviewItems, appliedHistoryId } = get();
    if (!appliedHistoryId || !originalReviewItems) return null;

    const addedTreatments = selectedReviewItems.treatments.filter(
      t => !originalReviewItems.treatments.includes(t)
    );
    const removedTreatments = originalReviewItems.treatments.filter(
      t => !selectedReviewItems.treatments.includes(t)
    );
    const changedNextVisit = selectedReviewItems.nextVisit !== originalReviewItems.nextVisit;
    const changedCustomNotes = selectedReviewItems.customNotes !== originalReviewItems.customNotes;

    return { addedTreatments, removedTreatments, changedNextVisit, changedCustomNotes };
  },

  setHandoffNote: (appointmentId, note) => {
    const updatedAppointments = get().appointments.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, handoffNote: note };
      }
      return apt;
    });

    saveHandoffNotes(updatedAppointments);

    const currentAppointment = get().floatingWindow.appointment;
    const windowUpdate = get().floatingWindow.appointment?.id === appointmentId
      ? {
          appointment: currentAppointment ? { ...currentAppointment, handoffNote: note } : null
        }
      : null;

    set({
      appointments: updatedAppointments,
      ...(windowUpdate && {
        floatingWindow: {
          ...get().floatingWindow,
          ...windowUpdate
        }
      })
    });
  },

  setConsultationStage: (appointmentId, stage) => {
    const stageTab = STAGE_TO_TAB[stage];
    const isReview = stageTab === 'review';
    const newActiveTab: SpeechCategory = isReview ? 'post-treatment' : (stageTab as SpeechCategory);

    const updatedAppointments = get().appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          stage,
          status: stage === 'done' ? 'completed' as const : (stage === 'waiting' ? 'pending' as const : 'in-progress' as const)
        };
      }
      return apt;
    });

    const currentAppointment = get().floatingWindow.appointment;
    const windowUpdate = get().floatingWindow.appointment?.id === appointmentId
      ? {
          activeTab: newActiveTab,
          showReviewPanel: isReview,
          appointment: currentAppointment ? { ...currentAppointment, stage } : null
        }
      : null;

    set({
      appointments: updatedAppointments,
      ...(windowUpdate && {
        floatingWindow: {
          ...get().floatingWindow,
          ...windowUpdate
        }
      })
    });
  },

  getSpeechTemplates: (treatmentType) => {
    const specific = mockSpeechTemplates.filter(t => t.treatmentType === treatmentType);
    const general = mockSpeechTemplates.filter(t => t.treatmentType === '通用');
    return [...specific, ...general];
  },

  getRiskSpeeches: (riskFactors) => {
    return mockRiskSpeeches.filter(r => riskFactors.includes(r.riskType));
  },

  getPatientSummary: (appointment) => {
    const { patient, treatmentType } = appointment;
    const riskSpeeches = mockRiskSpeeches.filter(r => patient.riskFactors.includes(r.riskType));

    const riskPoints = riskSpeeches.map(r => ({
      label: r.riskName,
      type: r.riskType,
      suggestion: r.treatmentSuggestion,
      text: r.suggestionText
    }));

    let overallSuggestion: TreatmentSuggestion = 'normal';
    if (riskPoints.some(r => r.suggestion === 'defer')) {
      overallSuggestion = 'defer';
    } else if (riskPoints.some(r => r.suggestion === 'caution')) {
      overallSuggestion = 'caution';
    }

    let overallSuggestionText = '';
    if (overallSuggestion === 'defer') {
      overallSuggestionText = '综合考虑患者风险因素，建议今日暂缓择期治疗，仅处理急症，控制基础疾病后再安排治疗。';
    } else if (overallSuggestion === 'caution') {
      overallSuggestionText = '患者存在风险因素，可谨慎进行简单治疗，术中注意监测，避免复杂有创操作。';
    } else {
      overallSuggestionText = '患者无明显禁忌，可按计划正常进行治疗。';
    }

    let combinedRiskAlert: string | undefined;
    if (riskPoints.length > 0) {
      const riskLabels = riskPoints.map(r => RISK_FACTOR_LABELS[r.type]).join('、');
      if (overallSuggestion === 'defer') {
        combinedRiskAlert = `⚠️ 患者有${riskLabels}，综合评估建议今日暂缓择期治疗，先控制基础疾病。请向患者说明延期原因。`;
      } else if (overallSuggestion === 'caution') {
        combinedRiskAlert = `⚠️ 患者有${riskLabels}，请谨慎操作，术前确认相关指标，术中注意监测，必要时咨询内科医生。`;
      }
    }

    const templates = get().getSpeechTemplates(treatmentType);
    const keySpeeches: string[] = [];
    const priorityCategories: SpeechCategory[] = ['before-exam', 'during-treatment', 'post-treatment'];
    for (const cat of priorityCategories) {
      const catTemplates = templates.filter(t => t.category === cat);
      for (const tpl of catTemplates) {
        for (const content of tpl.contents) {
          if (keySpeeches.length < 3) {
            keySpeeches.push(content);
          }
        }
      }
      if (keySpeeches.length >= 3) break;
    }

    const xrayRec = XRAY_RECOMMENDATIONS[treatmentType] || { type: 'optional' as const, text: '根据临床情况决定是否需要拍片检查' };

    let xrayRecommendation: PatientSummary['xrayRecommendation'] = xrayRec.type;
    let xrayText = xrayRec.text;

    if (patient.riskFactors.includes('pregnancy')) {
      xrayRecommendation = 'not-recommended';
      xrayText = '患者处于孕期，除非急症必要，建议避免X光检查，可考虑保守治疗。';
    }

    return {
      riskPoints,
      keySpeeches: keySpeeches.slice(0, 3),
      xrayRecommendation,
      xrayText,
      overallSuggestion,
      overallSuggestionText,
      combinedRiskAlert
    };
  },

  getFilteredAppointments: () => {
    const { appointments, selectedDate, searchQuery, reviewHistory, handoffFilter } = get();
    return appointments.filter(apt => {
      const dateMatch = apt.date === selectedDate;
      const searchMatch = !searchQuery || 
        apt.patient.name.includes(searchQuery) ||
        apt.treatmentType.includes(searchQuery);
      const handoffMatch = !handoffFilter || 
        (apt.handoffNote && apt.handoffNote.includes(handoffFilter));
      return dateMatch && searchMatch && handoffMatch;
    }).map(apt => {
      const patientHistory = reviewHistory.find(h => h.patientId === apt.patientId);
      if (patientHistory && !apt.lastReview) {
        return { ...apt, lastReview: patientHistory };
      }
      return apt;
    }).sort((a, b) => a.time.localeCompare(b.time));
  }
}));

export { nextVisitOptions };

export const getRiskSpeeches = (riskFactors: string[]) => {
  return mockRiskSpeeches.filter(r => riskFactors.includes(r.riskType));
};

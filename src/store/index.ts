import { create } from 'zustand';
import type { Appointment, SpeechCategory, GeneratedReview, SelectedReviewItems } from '../types';
import { mockAppointments, mockSpeechTemplates, mockRiskSpeeches, mockReviewTemplates, nextVisitOptions } from '../data/mockData';

interface AppState {
  appointments: Appointment[];
  selectedDate: string;
  searchQuery: string;
  floatingWindow: {
    isOpen: boolean;
    appointment: Appointment | null;
    position: { x: number; y: number };
    isMinimized: boolean;
    activeTab: SpeechCategory;
    showReviewPanel: boolean;
  };
  selectedReviewItems: SelectedReviewItems;
  generatedReview: GeneratedReview | null;
  setSelectedDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
  openFloatingWindow: (appointment: Appointment, position?: { x: number; y: number }) => void;
  closeFloatingWindow: () => void;
  toggleMinimize: () => void;
  setActiveTab: (tab: SpeechCategory) => void;
  setWindowPosition: (position: { x: number; y: number }) => void;
  toggleReviewPanel: () => void;
  setSelectedReviewItems: (items: Partial<SelectedReviewItems>) => void;
  generateReview: () => void;
  getSpeechTemplates: (treatmentType: string) => typeof mockSpeechTemplates;
  getRiskSpeeches: (riskFactors: string[]) => typeof mockRiskSpeeches;
  getFilteredAppointments: () => Appointment[];
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useAppStore = create<AppState>((set, get) => ({
  appointments: mockAppointments,
  selectedDate: getTodayDate(),
  searchQuery: '',
  floatingWindow: {
    isOpen: false,
    appointment: null,
    position: { x: 200, y: 100 },
    isMinimized: false,
    activeTab: 'before-exam',
    showReviewPanel: false
  },
  selectedReviewItems: {
    treatments: [],
    nextVisit: '',
    customNotes: ''
  },
  generatedReview: null,

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  openFloatingWindow: (appointment, position) => set({
    floatingWindow: {
      isOpen: true,
      appointment,
      position: position || { x: 200, y: 100 },
      isMinimized: false,
      activeTab: 'before-exam',
      showReviewPanel: false
    },
    selectedReviewItems: {
      treatments: appointment.treatmentType ? [appointment.treatmentType] : [],
      nextVisit: '',
      customNotes: ''
    },
    generatedReview: null
  }),

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
      activeTab: tab
    }
  }),

  setWindowPosition: (position) => set({
    floatingWindow: {
      ...get().floatingWindow,
      position
    }
  }),

  toggleReviewPanel: () => set({
    floatingWindow: {
      ...get().floatingWindow,
      showReviewPanel: !get().floatingWindow.showReviewPanel
    }
  }),

  setSelectedReviewItems: (items) => set({
    selectedReviewItems: {
      ...get().selectedReviewItems,
      ...items
    }
  }),

  generateReview: () => {
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

    set({
      generatedReview: {
        verbalText,
        printedText
      }
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

  getFilteredAppointments: () => {
    const { appointments, selectedDate, searchQuery } = get();
    return appointments.filter(apt => {
      const dateMatch = apt.date === selectedDate;
      const searchMatch = !searchQuery || 
        apt.patient.name.includes(searchQuery) ||
        apt.treatmentType.includes(searchQuery);
      return dateMatch && searchMatch;
    }).sort((a, b) => a.time.localeCompare(b.time));
  }
}));

export { nextVisitOptions };

export const getRiskSpeeches = (riskFactors: string[]) => {
  return mockRiskSpeeches.filter(r => riskFactors.includes(r.riskType));
};

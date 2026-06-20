export type RiskFactor = 'hypertension' | 'diabetes' | 'pregnancy' | 'longTermMedication';

export type SpeechCategory = 'before-exam' | 'before-xray' | 'during-treatment' | 'post-treatment';

export type AppointmentStatus = 'pending' | 'in-progress' | 'completed';

export interface Patient {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  phone: string;
  riskFactors: RiskFactor[];
  medications?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  date: string;
  time: string;
  treatmentType: string;
  status: AppointmentStatus;
  doctorId: string;
  doctorName: string;
}

export interface SpeechTemplate {
  id: string;
  category: SpeechCategory;
  treatmentType: string;
  contents: string[];
  order: number;
}

export interface RiskSpeech {
  id: string;
  riskType: RiskFactor;
  riskName: string;
  questions: string[];
  disclaimers: string[];
}

export interface ReviewTemplate {
  id: string;
  treatmentItem: string;
  verbalInstructions: string[];
  printedNotes: string[];
}

export interface SelectedReviewItems {
  treatments: string[];
  nextVisit: string;
  customNotes?: string;
}

export interface GeneratedReview {
  verbalText: string;
  printedText: string;
}

export interface FloatingWindowState {
  isOpen: boolean;
  appointment: Appointment | null;
  position: { x: number; y: number };
  isMinimized: boolean;
  activeTab: SpeechCategory;
}

export const RISK_FACTOR_LABELS: Record<RiskFactor, string> = {
  hypertension: '高血压',
  diabetes: '糖尿病',
  pregnancy: '孕期',
  longTermMedication: '长期服药'
};

export const SPEECH_CATEGORY_LABELS: Record<SpeechCategory, string> = {
  'before-exam': '检查前',
  'before-xray': '拍片前',
  'during-treatment': '治疗中',
  'post-treatment': '结束交代'
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: '待诊',
  'in-progress': '就诊中',
  completed: '已完成'
};

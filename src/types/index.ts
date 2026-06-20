export type RiskFactor = 'hypertension' | 'diabetes' | 'pregnancy' | 'longTermMedication';

export type SpeechCategory = 'before-exam' | 'before-xray' | 'during-treatment' | 'post-treatment';

export type AppointmentStatus = 'pending' | 'in-progress' | 'completed';

export type ConsultationStage = 'waiting' | 'exam' | 'xray' | 'treatment' | 'review' | 'done';

export type TreatmentSuggestion = 'normal' | 'caution' | 'defer';

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
  stage: ConsultationStage;
  lastReview?: ReviewHistory;
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
  treatmentSuggestion: TreatmentSuggestion;
  suggestionText: string;
}

export interface ReviewTemplate {
  id: string;
  treatmentItem: string;
  verbalInstructions: string[];
  printedNotes: string[];
}

export interface ReviewHistory {
  id: string;
  patientId: string;
  appointmentId: string;
  treatments: string[];
  nextVisit: string;
  customNotes?: string;
  verbalText: string;
  printedText: string;
  printedAt: string;
  createdAt: string;
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
  showReviewPanel: boolean;
  showSummary: boolean;
}

export interface PatientSummary {
  riskPoints: { label: string; type: RiskFactor; suggestion: TreatmentSuggestion; text: string }[];
  keySpeeches: string[];
  xrayRecommendation: 'required' | 'optional' | 'not-recommended';
  xrayText: string;
  overallSuggestion: TreatmentSuggestion;
  overallSuggestionText: string;
  combinedRiskAlert?: string;
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

export const CONSULTATION_STAGE_LABELS: Record<ConsultationStage, string> = {
  waiting: '待诊',
  exam: '检查中',
  xray: '拍片中',
  treatment: '治疗中',
  review: '交代中',
  done: '已完成'
};

export const STAGE_TO_TAB: Record<ConsultationStage, SpeechCategory | 'review'> = {
  waiting: 'before-exam',
  exam: 'before-exam',
  xray: 'before-xray',
  treatment: 'during-treatment',
  review: 'review',
  done: 'post-treatment'
};

export const TREATMENT_SUGGESTION_LABELS: Record<TreatmentSuggestion, { label: string; color: string }> = {
  normal: { label: '可正常治疗', color: 'text-green-600 bg-green-100' },
  caution: { label: '谨慎治疗', color: 'text-amber-600 bg-amber-100' },
  defer: { label: '建议延期', color: 'text-red-600 bg-red-100' }
};

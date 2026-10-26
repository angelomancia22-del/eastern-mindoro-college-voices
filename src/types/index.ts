export type ComplaintCategory =
  | 'academic'
  | 'facilities'
  | 'student_services'
  | 'administrative'
  | 'discipline_conduct'
  | 'other';

export type ComplaintSubcategory =
  | 'Grading & Evaluation'
  | 'Faculty Attendance & Conduct'
  | 'Curriculum & Subject Scheduling'
  | 'Classroom Ventilation & Air Conditioning'
  | 'Comfort Rooms & Sanitation'
  | 'Laboratory Equipment & Computers'
  | 'Campus Wi-Fi & Internet'
  | 'Library Services & Resources'
  | 'Registrar Transactions & Records'
  | 'Cashier & Tuition Inquiries'
  | 'Guidance & Counseling Support'
  | 'Student Affairs & Organizations'
  | 'Security & Campus Safety'
  | 'Cafeteria & Food Services'
  | 'General Inquiry / Others';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'pending_student_info'
  | 'resolved'
  | 'closed';

export type SubmissionType = 'identified' | 'confidential' | 'anonymous';

export interface StudentInfo {
  name: string;
  studentId: string;
  department: string;
  yearLevel: string;
  email: string;
  contactNumber: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  previewUrl?: string;
}

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  title: string;
  note: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  isPublic: boolean;
}

export interface MessageEntry {
  id: string;
  sender: 'student' | 'officer' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface ResolutionSummary {
  actionTaken: string;
  resolvedBy: string;
  resolvedByRole: string;
  preventiveMeasure: string;
  date: string;
}

export interface StudentFeedback {
  overallRating: number; // 1-5
  timelinessRating: number; // 1-5
  staffCourteseyRating: number; // 1-5
  satisfactionComment: string;
  submittedAt: string;
}

export interface Complaint {
  id: string;
  trackingCode: string; // e.g., EMC-2026-8491
  pinCode: string; // 4-digit security PIN for tracking
  title: string;
  category: ComplaintCategory;
  subcategory: ComplaintSubcategory;
  departmentTarget: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  submissionType: SubmissionType;
  studentInfo?: StudentInfo;
  description: string;
  incidentLocation: string;
  incidentDate: string;
  desiredResolution: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  assignedPersonnel?: {
    name: string;
    role: string;
    department: string;
    assignedAt: string;
  };
  timeline: TimelineEntry[];
  messages: MessageEntry[];
  resolutionSummary?: ResolutionSummary;
  feedback?: StudentFeedback;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  trackingCode: string;
  createdAt: string;
  read: boolean;
  type: 'status_change' | 'new_message' | 'resolved' | 'assigned' | 'system';
}

export interface EvaluationCriterionScore {
  id: string;
  evaluatorName: string;
  evaluatorRole: 'Student' | 'Faculty' | 'Staff/Personnel' | 'IT Expert / Administrator';
  functionality: number; // 1-5
  usability: number; // 1-5
  reliability: number; // 1-5
  security: number; // 1-5
  comments: string;
  evaluatedAt: string;
}

export type UserRole = 'student' | 'officer' | 'admin';

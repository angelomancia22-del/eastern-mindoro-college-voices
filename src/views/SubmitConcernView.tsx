import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ComplaintCategory,
  ComplaintSubcategory,
  PriorityLevel,
  SubmissionType,
  Attachment,
} from '../types';
import { EMC_ACADEMIC_PROGRAMS, EMC_DEPARTMENTS } from '../data/seedData';
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  UserCheck,
  EyeOff,
  FileText,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Wrench,
  Users,
  Building2,
  ShieldAlert,
} from 'lucide-react';

const CATEGORY_OPTIONS: {
  category: ComplaintCategory;
  title: string;
  desc: string;
  icon: any;
  subcategories: ComplaintSubcategory[];
  defaultDept: string;
}[] = [
  {
    category: 'academic',
    title: 'Academic Affairs',
    desc: 'Grading accuracy, faculty attendance/conduct, class scheduling, curriculum & consultations.',
    icon: GraduationCap,
    subcategories: [
      'Grading & Evaluation',
      'Faculty Attendance & Conduct',
      'Curriculum & Subject Scheduling',
      'General Inquiry / Others',
    ],
    defaultDept: 'Office of Academic Affairs',
  },
  {
    category: 'facilities',
    title: 'Facilities & Maintenance',
    desc: 'Air conditioning, classroom lighting, projectors, restrooms, Wi-Fi & computer labs.',
    icon: Wrench,
    subcategories: [
      'Classroom Ventilation & Air Conditioning',
      'Comfort Rooms & Sanitation',
      'Laboratory Equipment & Computers',
      'Campus Wi-Fi & Internet',
      'General Inquiry / Others',
    ],
    defaultDept: 'General Services & Physical Plant',
  },
  {
    category: 'student_services',
    title: 'Student Services',
    desc: 'Registrar records, Cashier/tuition inquiries, Guidance & Counseling, OSA and clinic services.',
    icon: Users,
    subcategories: [
      'Registrar Transactions & Records',
      'Cashier & Tuition Inquiries',
      'Guidance & Counseling Support',
      'Student Affairs & Organizations',
      'Library Services & Resources',
    ],
    defaultDept: 'Office of Student Affairs (OSA)',
  },
  {
    category: 'administrative',
    title: 'Administrative Matters',
    desc: 'Campus security, gate access, canteen sanitation, lost & found, and general college policies.',
    icon: Building2,
    subcategories: [
      'Security & Campus Safety',
      'Cafeteria & Food Services',
      'General Inquiry / Others',
    ],
    defaultDept: 'Campus Security & Safety Unit',
  },
  {
    category: 'discipline_conduct',
    title: 'Student Discipline & Conduct',
    desc: 'Campus harmony, anti-bullying, student harassment concerns, and mediation.',
    icon: ShieldAlert,
    subcategories: [
      'Faculty Attendance & Conduct',
      'Student Affairs & Organizations',
      'General Inquiry / Others',
    ],
    defaultDept: 'Office of Student Affairs (OSA)',
  },
];

export const SubmitConcernView: React.FC = () => {
  const { createComplaint, setActiveView, setSelectedTrackingCode } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submittedComplaint, setSubmittedComplaint] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('academic');
  const [subcategory, setSubcategory] = useState<ComplaintSubcategory>('Grading & Evaluation');
  const [departmentTarget, setDepartmentTarget] = useState<string>('Office of Academic Affairs');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('identified');

  // Concern Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [desiredResolution, setDesiredResolution] = useState('');

  // Student Info (if not anonymous)
  const [studentName, setStudentName] = useState('Angelo Mancia');
  const [studentId, setStudentId] = useState('2023-EMC-0914');
  const [department, setDepartment] = useState(EMC_ACADEMIC_PROGRAMS[0]);
  const [yearLevel, setYearLevel] = useState('3rd Year');
  const [email, setEmail] = useState('a.mancia@student.emc.edu.ph');
  const [contactNumber, setContactNumber] = useState('0917-554-8921');

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [formError, setFormError] = useState('');

  // Handle category change
  const handleSelectCategory = (cat: ComplaintCategory) => {
    setCategory(cat);
    const catConfig = CATEGORY_OPTIONS.find((c) => c.category === cat);
    if (catConfig) {
      setSubcategory(catConfig.subcategories[0]);
      setDepartmentTarget(catConfig.defaultDept);
    }
  };

  // Add sample preset attachment
  const handleAddSampleAttachment = (type: 'photo' | 'receipt' | 'doc') => {
    let newAtt: Attachment;
    if (type === 'photo') {
      newAtt = {
        id: `att-${Date.now()}`,
        name: `incident_photo_${Date.now().toString().slice(-4)}.jpg`,
        size: '1.4 MB',
        type: 'image/jpeg',
        previewUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      };
    } else if (type === 'receipt') {
      newAtt = {
        id: `att-${Date.now()}`,
        name: `clearance_receipt_slip.pdf`,
        size: '420 KB',
        type: 'application/pdf',
      };
    } else {
      newAtt = {
        id: `att-${Date.now()}`,
        name: `official_communication_proof.pdf`,
        size: '680 KB',
        type: 'application/pdf',
      };
    }
    setAttachments((prev) => [...prev, newAtt]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setFormError('');
    if (currentStep === 1) {
      if (!category || !subcategory || !departmentTarget) {
        setFormError('Please select a category, subcategory, and responsible office.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!title.trim()) {
        setFormError('Please enter a brief title for your concern.');
        return false;
      }
      if (!description.trim() || description.trim().length < 15) {
        setFormError('Please provide a detailed description (at least 15 characters).');
        return false;
      }
      if (!incidentLocation.trim()) {
        setFormError('Please specify the location of the incident or affected room.');
        return false;
      }
    } else if (currentStep === 3) {
      if (submissionType !== 'anonymous') {
        if (!studentName.trim() || !studentId.trim() || !email.trim()) {
          setFormError('Please provide your name, student ID number, and college email.');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setFormError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Final submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setFormError('You must agree to the data truthfulness and privacy terms.');
      return;
    }

    const newTicket = createComplaint({
      title: title.trim(),
      category,
      subcategory,
      departmentTarget,
      priority,
      submissionType,
      studentInfo:
        submissionType !== 'anonymous'
          ? {
              name: studentName.trim(),
              studentId: studentId.trim(),
              department,
              yearLevel,
              email: email.trim(),
              contactNumber: contactNumber.trim(),
            }
          : undefined,
      description: description.trim(),
      incidentLocation: incidentLocation.trim(),
      incidentDate,
      desiredResolution: desiredResolution.trim() || 'Prompt investigation and appropriate resolution.',
      attachments,
    });

    setSubmittedComplaint(newTicket);
  };

  const handleCopyCode = () => {
    if (!submittedComplaint) return;
    navigator.clipboard.writeText(submittedComplaint.trackingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // If complaint was just submitted, show success certificate
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Concern Successfully Registered
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thank You for Speaking Up!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your concern has been electronically routed to{' '}
              <strong className="text-slate-900">{submittedComplaint.departmentTarget}</strong>. Please
              safeguard your Tracking Code and Security PIN.
            </p>
          </div>

          {/* Official Tracking Credentials Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-left space-y-4 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-mono">
                  Official Tracking Code
                </span>
                <p className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                  {submittedComplaint.trackingCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Security PIN</span>
                <p className="font-mono text-base font-bold text-amber-300">
                  {submittedComplaint.pinCode}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Category</span>
                <p className="font-semibold text-slate-200 capitalize">
                  {submittedComplaint.category.replace('_', ' ')}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Date Logged</span>
                <p className="font-semibold text-slate-200">
                  {new Date(submittedComplaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Use this code anytime to monitor progress, chat with the officer, or view resolutions.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedTrackingCode(submittedComplaint.trackingCode);
                setActiveView('track');
              }}
              className="flex-1 px-5 py-3.5 bg-[#7A1315] hover:bg-red-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Track This Concern Now</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgment Slip</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Title & Research Objective Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Submit a Student Concern or Complaint
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Eastern Mindoro College Central Online Grievance & Student Assistance Portal (Research Obj. 2)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono bg-red-50 text-[#7A1315] border border-red-200 px-2.5 py-1 rounded-full font-semibold">
            Step {step} of 4
          </span>
        </div>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: 'Category & Office' },
          { num: 2, label: 'Concern Details' },
          { num: 3, label: 'Privacy & Identity' },
          { num: 4, label: 'Review & Submit' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition-all text-center ${
              step === s.num
                ? 'bg-[#7A1315] text-white border-[#7A1315] font-bold shadow-xs'
                : step > s.num
                ? 'bg-red-50 text-[#7A1315] border-red-200 font-semibold'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center border font-mono">
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* STEP 1: CATEGORY & OFFICE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                1. Select School Domain
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Choose the domain that best describes the issue you are experiencing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATEGORY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.category;
                  return (
                    <div
                      key={opt.category}
                      onClick={() => handleSelectCategory(opt.category)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-[#7A1315] bg-red-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-[#7A1315] text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#7A1315]" />
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{opt.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-snug">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Specific Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value as ComplaintSubcategory)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7A1315] transition"
                >
                  {CATEGORY_OPTIONS.find((c) => c.category === category)?.subcategories.map(
                    (sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Designated EMC Office
                </label>
                <select
                  value={departmentTarget}
                  onChange={(e) => setDepartmentTarget(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7A1315] transition"
                >
                  {EMC_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONCERN DETAILS */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Subject / Title of Concern *
              </label>
              <input
                type="text"
                placeholder="e.g., Unstable Wi-Fi during exam in Computer Lab 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Specific Location / Classroom / Office *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g., College Building Room 304, Registrar Window 2"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Date of Incident *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Detailed Narrative / What Happened? *
              </label>
              <textarea
                rows={4}
                placeholder="Please state clearly what happened, who was involved, what class or transaction was affected, and any previous attempts made to resolve it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Desired Resolution / Requested Remedy (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Repair AC filter, recheck midterm computed scores, or open extra window"
                value={desiredResolution}
                onChange={(e) => setDesiredResolution(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Urgency / Priority Assessment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { level: 'low', label: 'Low', desc: 'Minor suggestion' },
                  { level: 'medium', label: 'Medium', desc: 'Standard turnaround' },
                  { level: 'high', label: 'High', desc: 'Disrupts instruction' },
                  { level: 'urgent', label: 'Urgent', desc: 'Immediate safety or exam emergency' },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.level}
                    onClick={() => setPriority(p.level as PriorityLevel)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      priority === p.level
                        ? 'bg-red-50 border-[#7A1315] text-[#7A1315] font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{p.label}</p>
                    <p className="text-[10px] text-slate-500">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & IDENTITY */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                How would you like to submit this concern?
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Eastern Mindoro College respects your privacy in accordance with Republic Act 10173.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    type: 'identified',
                    label: 'Identified Submission',
                    icon: UserCheck,
                    badge: 'Recommended',
                    desc: 'Your name & student number are shared with handling officers for direct resolution.',
                  },
                  {
                    type: 'confidential',
                    label: 'Confidential Mode',
                    icon: Lock,
                    badge: 'Privacy Protected',
                    desc: 'Identity kept strictly confidential by OSA / Dean and masked from regular personnel.',
                  },
                  {
                    type: 'anonymous',
                    label: 'Completely Anonymous',
                    icon: EyeOff,
                    badge: 'No Identity Logged',
                    desc: 'No personal details stored. You must keep your tracking code & PIN to check progress.',
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = submissionType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setSubmissionType(opt.type as SubmissionType)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-[#7A1315] bg-red-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-[#7A1315] text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {opt.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{opt.label}</h4>
                      <p className="text-[11px] text-slate-600 leading-snug">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {submissionType !== 'anonymous' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Student Verification Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID Number (EMC) *
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315] font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College Program / Academic Dept *
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315]"
                    >
                      {EMC_ACADEMIC_PROGRAMS.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Year Level *
                    </label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315]"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Grade 11 (Senior High)</option>
                      <option>Grade 12 (Senior High)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#7A1315]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: REVIEW & ATTACHMENTS & SUBMIT */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Attachments Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Supporting Evidence & Documents
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddSampleAttachment('photo')}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <span>+ Attach Sample Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSampleAttachment('receipt')}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <span>+ Attach Sample PDF</span>
                  </button>
                </div>
              </div>

              {attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate font-medium text-slate-800">{att.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-slate-400" />
                  <p>No files attached yet. You can click the sample buttons above to simulate photo or document uploads.</p>
                </div>
              )}
            </div>

            {/* Submission Summary Preview */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 text-xs">
              <h4 className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>Submission Summary Verification</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-500 block">Category & Department:</span>
                  <strong className="text-slate-900 capitalize">
                    {category.replace('_', ' ')} - {departmentTarget}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Subcategory:</span>
                  <strong className="text-slate-900">{subcategory}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Location & Date:</span>
                  <span className="text-slate-900 font-medium">
                    {incidentLocation} ({incidentDate})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Submission Privacy:</span>
                  <span className="text-slate-900 font-semibold uppercase">{submissionType}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200">
                <span className="text-slate-500 block mb-0.5">Subject:</span>
                <p className="font-semibold text-slate-900">{title}</p>
              </div>
            </div>

            {/* Legal / Data Privacy Agreement */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#7A1315] focus:ring-[#7A1315]"
              />
              <span>
                I certify that the information provided is truthful and submitted in good faith. I understand that Eastern Mindoro College will process this information in accordance with campus grievance protocols and the Philippine Data Privacy Act of 2012.
              </span>
            </label>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#7A1315] hover:bg-red-900 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-7 py-3 bg-[#7A1315] hover:bg-red-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Submit Concern Now</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

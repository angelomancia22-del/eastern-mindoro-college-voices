import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryIcon } from '../components/Badges';
import { ComplaintStatus, StudentFeedback } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  MessageSquare,
  Shield,
  Printer,
  Star,
  FileText,
  User,
  Calendar,
  MapPin,
  Building2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const TrackConcernView: React.FC = () => {
  const {
    complaints,
    selectedTrackingCode,
    setSelectedTrackingCode,
    sendMessage,
    submitFeedback,
    setActiveView,
  } = useApp();

  const [inputCode, setInputCode] = useState(selectedTrackingCode || '');
  const [activeComplaint, setActiveComplaint] = useState(
    complaints.find((c) => c.trackingCode === selectedTrackingCode) || complaints[0]
  );
  const [chatMessage, setChatMessage] = useState('');
  const [searchError, setSearchError] = useState('');

  // Feedback form state
  const [overallRating, setOverallRating] = useState(5);
  const [timelinessRating, setTimelinessRating] = useState(5);
  const [staffCourteseyRating, setStaffCourteseyRating] = useState(5);
  const [satisfactionComment, setSatisfactionComment] = useState('');
  const [feedbackSubmittedSuccess, setFeedbackSubmittedSuccess] = useState(false);

  // Sync selectedTrackingCode if set externally
  useEffect(() => {
    if (selectedTrackingCode) {
      setInputCode(selectedTrackingCode);
      const match = complaints.find(
        (c) => c.trackingCode.toLowerCase() === selectedTrackingCode.toLowerCase()
      );
      if (match) {
        setActiveComplaint(match);
        setSearchError('');
      }
    }
  }, [selectedTrackingCode, complaints]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) return;

    const found = complaints.find(
      (c) =>
        c.trackingCode.toUpperCase() === cleanCode ||
        c.trackingCode.toUpperCase().includes(cleanCode)
    );

    if (found) {
      setActiveComplaint(found);
      setSelectedTrackingCode(found.trackingCode);
    } else {
      setSearchError(`No concern found matching "${cleanCode}". Please verify your tracking code.`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeComplaint) return;

    sendMessage(
      activeComplaint.id,
      chatMessage.trim(),
      'student',
      activeComplaint.studentInfo?.name || 'Student'
    );
    setChatMessage('');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    const feedbackData: StudentFeedback = {
      overallRating,
      timelinessRating,
      staffCourteseyRating,
      satisfactionComment: satisfactionComment.trim() || 'Satisfied with the prompt resolution.',
      submittedAt: new Date().toISOString(),
    };

    submitFeedback(activeComplaint.id, feedbackData);
    setFeedbackSubmittedSuccess(true);
    setTimeout(() => setFeedbackSubmittedSuccess(false), 4000);
  };

  // Status Stepper stages
  const statusSteps: { key: ComplaintStatus; label: string }[] = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const getStepIndex = (status: ComplaintStatus) => {
    if (status === 'closed') return 3;
    if (status === 'resolved') return 3;
    if (status === 'in_progress' || status === 'pending_student_info') return 2;
    if (status === 'under_review') return 1;
    return 0;
  };

  const currentStepIdx = activeComplaint ? getStepIndex(activeComplaint.status) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Track Student Concern Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check real-time administrative action, handling officer responses, and verified resolutions.
            </p>
          </div>
          <button
            onClick={() => setActiveView('submit')}
            className="text-xs font-semibold text-[#7A1315] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Need to file another concern?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter EMC Tracking Code (e.g., EMC-2026-1042)..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full text-sm font-mono pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315] focus:outline-hidden transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#7A1315] hover:bg-red-900 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Record</span>
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            {searchError}
          </p>
        )}

        {/* Quick Test Links */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Sample Records:</span>
          {complaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setInputCode(c.trackingCode);
                setActiveComplaint(c);
                setSelectedTrackingCode(c.trackingCode);
                setSearchError('');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition cursor-pointer border ${
                activeComplaint?.id === c.id
                  ? 'bg-[#7A1315] text-white border-[#7A1315] font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {c.trackingCode} ({c.status.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Active Complaint Display */}
      {activeComplaint && (
        <div className="space-y-6">
          {/* Header Card with Tracking Code & Status */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
                    {activeComplaint.trackingCode}
                  </span>
                  <StatusBadge status={activeComplaint.status} size="md" />
                  <PriorityBadge priority={activeComplaint.priority} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {activeComplaint.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Filed on {new Date(activeComplaint.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeComplaint.incidentLocation}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium capitalize text-slate-700">
                    <Building2 className="w-3.5 h-3.5" />
                    {activeComplaint.departmentTarget}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Visual Status Stepper */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Ticket Resolution Progress
              </p>
              <div className="grid grid-cols-4 gap-2 relative">
                {statusSteps.map((st, idx) => {
                  const isPassed = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div key={st.key} className="space-y-1.5 text-center">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isPassed ? 'bg-[#7A1315]' : 'bg-slate-200'
                        }`}
                      />
                      <div className="flex items-center justify-center gap-1">
                        {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#7A1315]" />}
                        <span
                          className={`text-xs ${
                            isCurrent
                              ? 'font-bold text-[#7A1315]'
                              : isPassed
                              ? 'font-medium text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incident & Handling Personnel Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Category & Subcategory
                </span>
                <p className="text-xs font-semibold text-slate-900 capitalize">
                  {activeComplaint.category.replace('_', ' ')}
                </p>
                <p className="text-xs text-slate-600">{activeComplaint.subcategory}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Handling Officer
                </span>
                {activeComplaint.assignedPersonnel ? (
                  <>
                    <p className="text-xs font-semibold text-slate-900">
                      {activeComplaint.assignedPersonnel.name}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {activeComplaint.assignedPersonnel.role}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-amber-700 italic">
                    Queued for department assignment
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Privacy & Student Info
                </span>
                <p className="text-xs font-semibold text-slate-900 capitalize">
                  {activeComplaint.submissionType} Mode
                </p>
                <p className="text-[11px] text-slate-600 truncate">
                  {activeComplaint.submissionType === 'anonymous'
                    ? 'Identity protected'
                    : activeComplaint.studentInfo?.name}
                </p>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Incident Statement
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-line">
                {activeComplaint.description}
              </div>
            </div>

            {/* Desired Resolution */}
            {activeComplaint.desiredResolution && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Desired Student Remedy: </strong>
                  <span>{activeComplaint.desiredResolution}</span>
                </div>
              </div>
            )}

            {/* Attachments preview */}
            {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Submitted Attachments ({activeComplaint.attachments.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeComplaint.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2 text-xs"
                    >
                      <FileText className="w-4 h-4 text-[#7A1315]" />
                      <span className="font-medium text-slate-800">{att.name}</span>
                      <span className="text-[10px] text-slate-400">({att.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Resolution Certificate (When Resolved) */}
          {(activeComplaint.status === 'resolved' || activeComplaint.status === 'closed') && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Official College Resolution Certificate
                  </span>
                  <h3 className="text-lg font-extrabold text-emerald-950">
                    Concern Officially Resolved
                  </h3>
                </div>
              </div>

              {activeComplaint.resolutionSummary && (
                <div className="space-y-3 bg-white p-5 rounded-2xl border border-emerald-200 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block font-bold uppercase">
                      Action Taken by Personnel:
                    </span>
                    <p className="text-slate-900 font-medium mt-0.5 leading-relaxed">
                      {activeComplaint.resolutionSummary.actionTaken}
                    </p>
                  </div>

                  {activeComplaint.resolutionSummary.preventiveMeasure && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-500 text-xs block font-bold uppercase">
                        Preventive & Maintenance Measure:
                      </span>
                      <p className="text-slate-800 mt-0.5">
                        {activeComplaint.resolutionSummary.preventiveMeasure}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                    <span>
                      Certified by: <strong>{activeComplaint.resolutionSummary.resolvedBy}</strong> (
                      {activeComplaint.resolutionSummary.resolvedByRole})
                    </span>
                    <span>Date: {activeComplaint.resolutionSummary.date}</span>
                  </div>
                </div>
              )}

              {/* Student Feedback & Satisfaction Survey */}
              <div className="pt-2">
                {activeComplaint.feedback ? (
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Your Submitted Feedback
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: activeComplaint.feedback.overallRating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      "{activeComplaint.feedback.satisfactionComment}"
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Recorded on {new Date(activeComplaint.feedback.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmitFeedback}
                    className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        How satisfied are you with this resolution?
                      </h4>
                      <p className="text-xs text-slate-500">
                        Your evaluation helps Eastern Mindoro College improve service responsiveness.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Overall Satisfaction
                        </label>
                        <select
                          value={overallRating}
                          onChange={(e) => setOverallRating(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        >
                          <option value={5}>5 - Highly Satisfied</option>
                          <option value={4}>4 - Satisfied</option>
                          <option value={3}>3 - Neutral</option>
                          <option value={2}>2 - Dissatisfied</option>
                          <option value={1}>1 - Very Dissatisfied</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Turnaround Timeliness
                        </label>
                        <select
                          value={timelinessRating}
                          onChange={(e) => setTimelinessRating(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        >
                          <option value={5}>5 - Fast (&lt;24 hrs)</option>
                          <option value={4}>4 - Reasonable (&lt;48 hrs)</option>
                          <option value={3}>3 - Acceptable</option>
                          <option value={2}>2 - Delayed</option>
                          <option value={1}>1 - Unacceptable Delay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Staff Courtesy & Care
                        </label>
                        <select
                          value={staffCourteseyRating}
                          onChange={(e) => setStaffCourteseyRating(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300"
                        >
                          <option value={5}>5 - Very Professional</option>
                          <option value={4}>4 - Polite & Helpful</option>
                          <option value={3}>3 - Adequate</option>
                          <option value={2}>2 - Could Improve</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Comments or Suggestions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Share any comments about the personnel response..."
                        value={satisfactionComment}
                        onChange={(e) => setSatisfactionComment(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {feedbackSubmittedSuccess && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Feedback saved! Thank you.
                        </span>
                      )}
                      <button
                        type="submit"
                        className="ml-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Submit Satisfaction Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Audit Timeline and 2-Way Chat Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action History / Audit Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#7A1315]" />
                  <span>Administrative Action Timeline</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeComplaint.timeline.length} updates logged
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeComplaint.timeline.map((entry) => (
                  <div key={entry.id} className="relative space-y-1 text-xs">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#7A1315] ring-4 ring-red-50" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{entry.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{entry.note}</p>
                    <div className="text-[10px] text-slate-500 font-medium">
                      By {entry.actor} ({entry.actorRole})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Way Message Thread (Objective 6) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-[460px]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">2-Way Officer & Student Chat</h3>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                  Direct Line to Office
                </span>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {activeComplaint.messages.map((m) => {
                  const isStudent = m.sender === 'student';
                  const isSystem = m.sender === 'system';

                  if (isSystem) {
                    return (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-600 text-center text-[11px] leading-relaxed font-mono"
                      >
                        {m.message}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-500 mb-0.5 px-1 font-medium">
                        {m.senderName} ({isStudent ? 'Student' : 'Office Staff'})
                      </div>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                          isStudent
                            ? 'bg-[#7A1315] text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                        }`}
                      >
                        {m.message}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message or answer office question..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 bg-[#7A1315] hover:bg-red-900 text-white rounded-xl transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

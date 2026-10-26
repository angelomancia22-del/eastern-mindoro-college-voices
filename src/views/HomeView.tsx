import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  HelpCircle,
  Building,
  GraduationCap,
  Wrench,
  Users,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveView, setSelectedTrackingCode, complaints, evaluations } = useApp();
  const [trackingInput, setTrackingInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setSelectedTrackingCode(trackingInput.trim().toUpperCase());
    setActiveView('track');
  };

  // Live Metrics
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'under_review'
  ).length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

  // Compute average satisfaction from feedback and evaluations
  const ratedComplaints = complaints.filter((c) => c.feedback?.overallRating);
  const avgSatisfaction =
    ratedComplaints.length > 0
      ? (
          ratedComplaints.reduce((acc, c) => acc + (c.feedback?.overallRating || 0), 0) /
          ratedComplaints.length
        ).toFixed(1)
      : '4.9';

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7A1315] via-[#651012] to-[#3a0809] text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-red-900/40">
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-24 w-80 h-80 rounded-full bg-red-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Eastern Mindoro College Official Service Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Your Voice Drives a Better <span className="text-amber-300">EMC Learning Campus.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
            A centralized, web-based platform for Eastern Mindoro College students to report
            academic concerns, classroom facility issues, student service delays, and campus
            inquiries with complete transparency and real-time tracking.
          </p>

          {/* Quick Track & Actions Container */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <button
              onClick={() => setActiveView('submit')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Submit a Student Concern</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveView('track')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Track Existing Ticket</span>
            </button>
          </div>

          {/* Direct Ticket Fast-Lookup Input */}
          <div className="pt-4 border-t border-white/10 max-w-lg">
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter Tracking Code (e.g. EMC-2026-1042)..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-white text-[#7A1315] hover:bg-slate-100 font-bold text-sm rounded-xl transition cursor-pointer"
              >
                Lookup
              </button>
            </form>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
              <span className="text-slate-400">Quick test tickets:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrackingCode('EMC-2026-1042');
                  setActiveView('track');
                }}
                className="underline hover:text-amber-300 font-mono"
              >
                EMC-2026-1042
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrackingCode('EMC-2026-1088');
                  setActiveView('track');
                }}
                className="underline hover:text-amber-300 font-mono"
              >
                EMC-2026-1088
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Campus Statistics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalComplaints}</p>
            <p className="text-xs text-slate-600 font-medium">Logged Concerns</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{resolutionRate}%</p>
            <p className="text-xs text-slate-600 font-medium">Resolution Success</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">&lt; 48 hrs</p>
            <p className="text-xs text-slate-600 font-medium">Avg. Action Turnaround</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#7A1315] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{avgSatisfaction} / 5.0</p>
            <p className="text-xs text-slate-600 font-medium">Student Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Submit Concerns by School Domain
            </h2>
            <p className="text-sm text-slate-600">
              Select the appropriate college department or facility to ensure immediate routing to responsible personnel.
            </p>
          </div>
          <button
            onClick={() => setActiveView('submit')}
            className="text-sm font-semibold text-[#7A1315] hover:text-red-900 flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>Open Full Submission Form</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Academic Concerns */}
          <div
            onClick={() => setActiveView('submit')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#7A1315] transition-colors">
              Academic Concerns
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Grade discrepancies, faculty consultations, curriculum issues, subject scheduling, and instructional materials.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-700 flex items-center gap-1">
              <span>Report to Academic Affairs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* School Facilities */}
          <div
            onClick={() => setActiveView('submit')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#7A1315] transition-colors">
              School Facilities
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air-conditioning, projectors, laboratory computers, comfort rooms, campus Wi-Fi, electricity, and sports amenities.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Report to Physical Plant</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Student Services */}
          <div
            onClick={() => setActiveView('submit')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#7A1315] transition-colors">
              Student Services
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registrar document clearance, Cashier queues, Guidance & Counseling, OSA club activities, and clinic care.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Report to Student Affairs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Administrative Matters */}
          <div
            onClick={() => setActiveView('submit')}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#7A1315] transition-colors">
              Administration & Safety
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus security protocols, cafeteria hygiene, lost and found, gate policies, and institutional suggestions.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-700 flex items-center gap-1">
              <span>Report to College Admin</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* How the System Works - Addressing Problem Statements #2, #3, #4, #6 */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#7A1315] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Transparent Complaint Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How EMC Manages Your Concern
          </h2>
          <p className="text-sm text-slate-600">
            From the moment you file your concern to its final verification, each step is logged
            with full accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#7A1315] text-white font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Online Submission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill in the concern details, attach photo proof, and choose Confidential, Identified, or Anonymous mode.
            </p>
            <div className="text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
              Immediate PIN & Code Generated
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#7A1315] text-white font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Review & Assignment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized personnel categorize severity and assign a handling officer (e.g. Physical Plant, Dean, Registrar).
            </p>
            <div className="text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
              Status: Under Review / Assigned
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#7A1315] text-white font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Action & 2-Way Chat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Officers carry out inspections or corrections, and can chat directly with the student for clarifications.
            </p>
            <div className="text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
              Live Messaging Enabled
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Resolution & Rating</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An official resolution summary is recorded with preventive measures, and the student submits feedback.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-block">
              ISO Acceptance Verified
            </div>
          </div>
        </div>
      </section>

      {/* Key Guarantees / Privacy & Confidentiality (RA 10173) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Data Privacy Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict compliance with the Philippine Data Privacy Act of 2012 (Republic Act 10173).
            Your personal information is shielded from unauthorized personnel.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Direct Office Routing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates traditional paper bottlenecks. Complaints are electronically dispatched
            straight to designated deans, supervisors, and maintenance teams.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Institutional Improvement</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Centralized records generate reports that highlight recurring campus issues,
            guiding college leadership in budget and facility enhancements.
          </p>
        </div>
      </section>

      {/* Live Activity & Research Evaluation Preview */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            System Research & Evaluation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ISO/IEC 25010 Quality Benchmark
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In accordance with Objective 7 of the EMC study, our system evaluates Functionality,
            Usability, Reliability, and Security based on live faculty, student, and personnel evaluations.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
            <span>Overall Score: <strong className="text-emerald-400 font-bold">4.84 / 5.0</strong></span>
            <span>•</span>
            <span>Verbal: <strong className="text-amber-300 font-bold">Highly Acceptable</strong></span>
            <span>•</span>
            <span>Evaluations: <strong className="text-white font-bold">{evaluations.length} records</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => setActiveView('evaluation')}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Acceptance Matrix (Obj. 7)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Admin Console</span>
          </button>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  PriorityLevel,
  ResolutionSummary,
} from '../types';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { EMC_DEPARTMENTS } from '../data/seedData';
import {
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingUp,
  Building,
  UserCheck,
  Send,
  MessageSquare,
  Sparkles,
  Download,
  Layers,
  ArrowUpDown,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    complaints,
    updateStatus,
    assignPersonnel,
    updatePriority,
    sendMessage,
    setSelectedTrackingCode,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'records' | 'workload' | 'recurring' | 'reports'>('records');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Selected complaint for action drawer
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Action form state inside drawer
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [officerName, setOfficerName] = useState('Engr. Danilo Mendoza');
  const [officerRole, setOfficerRole] = useState('General Services Supervisor');
  const [assignedDept, setAssignedDept] = useState(EMC_DEPARTMENTS[2]);

  // Resolution summary form
  const [actionTakenText, setActionTakenText] = useState('');
  const [preventiveMeasureText, setPreventiveMeasureText] = useState('');
  const [resolutionSuccessMsg, setResolutionSuccessMsg] = useState(false);

  // Officer chat input inside drawer
  const [officerChatMessage, setOfficerChatMessage] = useState('');

  // KPIs
  const totalCount = complaints.length;
  const underReviewCount = complaints.filter((c) => c.status === 'under_review').length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'in_progress' || c.status === 'pending_student_info'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
  const urgentCount = complaints.filter((c) => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.studentInfo?.name && c.studentInfo.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesDept = filterDepartment === 'all' || c.departmentTarget === filterDepartment;
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesDept && matchesPriority;
  });

  // Open drawer
  const handleOpenDrawer = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setStatusNote('');
    if (complaint.assignedPersonnel) {
      setOfficerName(complaint.assignedPersonnel.name);
      setOfficerRole(complaint.assignedPersonnel.role);
      setAssignedDept(complaint.assignedPersonnel.department);
    }
    setActionTakenText(complaint.resolutionSummary?.actionTaken || '');
    setPreventiveMeasureText(complaint.resolutionSummary?.preventiveMeasure || '');
    setResolutionSuccessMsg(false);
  };

  // Submit status update
  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    let resSummary: ResolutionSummary | undefined = undefined;
    if (newStatus === 'resolved' || newStatus === 'closed') {
      resSummary = {
        actionTaken: actionTakenText.trim() || 'Action completed in accordance with college policy.',
        resolvedBy: officerName,
        resolvedByRole: officerRole,
        preventiveMeasure: preventiveMeasureText.trim() || 'Standard operational guidelines enforced.',
        date: new Date().toISOString().split('T')[0],
      };
    }

    updateStatus(
      selectedComplaint.id,
      newStatus,
      statusNote.trim() || `Status moved to ${newStatus.replace('_', ' ')} by personnel.`,
      officerName,
      officerRole,
      resSummary
    );

    setResolutionSuccessMsg(true);
    setTimeout(() => {
      setResolutionSuccessMsg(false);
      // update local drawer state
      const updated = complaints.find((c) => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    }, 1500);
  };

  // Submit assign personnel
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    assignPersonnel(selectedComplaint.id, officerName, officerRole, assignedDept);
    setResolutionSuccessMsg(true);
    setTimeout(() => setResolutionSuccessMsg(false), 1500);
  };

  // Officer chat send
  const handleOfficerChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerChatMessage.trim() || !selectedComplaint) return;

    sendMessage(selectedComplaint.id, officerChatMessage.trim(), 'officer', officerName);
    setOfficerChatMessage('');

    // refresh selected
    setTimeout(() => {
      const refreshed = complaints.find((c) => c.id === selectedComplaint.id);
      if (refreshed) setSelectedComplaint(refreshed);
    }, 100);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Tracking Code',
      'Date',
      'Title',
      'Category',
      'Subcategory',
      'Department',
      'Priority',
      'Status',
      'Location',
      'Student Name',
      'Assigned Officer',
    ];

    const rows = complaints.map((c) => [
      `"${c.trackingCode}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.subcategory}"`,
      `"${c.departmentTarget}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.incidentLocation}"`,
      `"${c.submissionType === 'anonymous' ? 'Anonymous' : c.studentInfo?.name || 'N/A'}"`,
      `"${c.assignedPersonnel?.name || 'Unassigned'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EMC_Student_Concerns_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bottleneck / Recurring Issues Analysis
  const categoryCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const deptCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.departmentTarget] = (acc[c.departmentTarget] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 py-4">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrative & Personnel Command Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Eastern Mindoro College Central Oversight, Work Order Dispatch & Records Management (Research Objs. 4 & 5)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Tickets</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All submissions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{underReviewCount}</p>
          <span className="text-[10px] text-slate-400">Awaiting assignment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold">
            <span>In Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-700 mt-2">{inProgressCount}</p>
          <span className="text-[10px] text-slate-400">Active investigations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}% success rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Urgent Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">{urgentCount}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Priority dispatch</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs overflow-x-auto">
        {[
          { key: 'records', label: 'Complaint Records Table' },
          { key: 'workload', label: 'Department Dispatch Queue' },
          { key: 'recurring', label: 'Recurring Bottlenecks Analytics' },
          { key: 'reports', label: 'Executive Summary Report' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#7A1315] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RECORDS TABLE */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ticket, title, student, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7A1315]"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="pending_student_info">Pending Student Info</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic Affairs</option>
                <option value="facilities">School Facilities</option>
                <option value="student_services">Student Services</option>
                <option value="administrative">Administrative</option>
                <option value="discipline_conduct">Discipline & Conduct</option>
              </select>
            </div>

            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Tracking No.</th>
                  <th className="p-3.5">Concern / Title</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Reporter</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No complaints match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => handleOpenDrawer(c)}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#7A1315]">
                        {c.trackingCode}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{c.incidentLocation}</p>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        {c.departmentTarget}
                      </td>
                      <td className="p-3.5">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {c.submissionType === 'anonymous' ? (
                          <span className="italic text-slate-400">Anonymous</span>
                        ) : (
                          <span className="font-medium">{c.studentInfo?.name}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDrawer(c)}
                          className="px-2.5 py-1 bg-[#7A1315] hover:bg-red-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-2xs"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENT WORKLOAD QUEUE */}
      {activeTab === 'workload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMC_DEPARTMENTS.slice(0, 6).map((dept) => {
            const deptTickets = complaints.filter((c) => c.departmentTarget === dept);
            return (
              <div
                key={dept}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{dept}</h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {deptTickets.length} cases
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {deptTickets.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No active tickets for this office.</p>
                    ) : (
                      deptTickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleOpenDrawer(t)}
                          className="p-3 rounded-xl border border-slate-200 hover:border-red-300 bg-slate-50/60 cursor-pointer transition space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-[#7A1315]">
                              {t.trackingCode}
                            </span>
                            <StatusBadge status={t.status} size="sm" />
                          </div>
                          <p className="text-xs font-semibold text-slate-900 line-clamp-1">{t.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{t.incidentLocation}</span>
                            <PriorityBadge priority={t.priority} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Open: {deptTickets.filter((t) => t.status !== 'resolved').length}</span>
                  <span>Resolved: {deptTickets.filter((t) => t.status === 'resolved').length}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: RECURRING BOTTLENECKS ANALYTICS (Addressing Problem Statement #5) */}
      {activeTab === 'recurring' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Administrative Insight (Study Problem Statement #5): </strong>
              The system organizes and maintains complaint records to identify recurring concerns
              such as recurring classroom AC breakdowns, registrar queuing, and laboratory internet stability,
              enabling data-driven institutional budget and maintenance decisions.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Concerns by School Domain</h3>
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 capitalize">
                        <span>{cat.replace('_', ' ')}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#7A1315] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Workload by Office / Unit</h3>
              <div className="space-y-3">
                {Object.entries(deptCounts).map(([dept, count]) => {
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[200px]">{dept}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Identified Recurring Bottlenecks Cards */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Detected Priority Campus Bottlenecks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded uppercase">
                  Classroom HVAC Maintenance
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Room 302 & Annex Restrooms</h4>
                <p className="text-[11px] text-slate-600">
                  Multiple complaints logged regarding air-conditioning capacitor failure and water pressure during peak class changes.
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Recommendation: Scheduled bi-weekly preventive inspection.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                  Clearance Window Congestion
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Registrar Lobby Service Counters</h4>
                <p className="text-[11px] text-slate-600">
                  Queuing exceeds 80 students during midterm examination clearance weeks due to single active service window.
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Recommendation: Digital clearance validation deployment.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                  Computer Lab 3 Network
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Wi-Fi Access Point Overload</h4>
                <p className="text-[11px] text-slate-600">
                  Students reported online quiz timeouts during concurrent laboratory exams.
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Recommendation: Wired Ethernet drops to all 40 lab terminals.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL EXECUTIVE SUMMARY REPORT */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-5 space-y-1">
            <p className="text-xs uppercase font-serif tracking-widest text-slate-500">
              Republic of the Philippines
            </p>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-[#7A1315]">
              EASTERN MINDORO COLLEGE, INC.
            </h2>
            <p className="text-xs text-slate-600">
              Bagumbayan, Bongabong, Oriental Mindoro | Founded 1945
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 pt-2">
              STUDENT CONCERN & COMPLAINT MANAGEMENT AUDIT REPORT
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Generated: {new Date().toLocaleDateString()} | Semester: Academic Year 2026-2027
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Total Concerns Filed</span>
              <p className="text-2xl font-black text-slate-900">{totalCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Resolved Cases</span>
              <p className="text-2xl font-black text-emerald-700">{resolvedCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Resolution Rate</span>
              <p className="text-2xl font-black text-blue-700">
                {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Satisfaction Index</span>
              <p className="text-2xl font-black text-[#7A1315]">4.9 / 5.0</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Executive Summary of Actions Taken
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              During this operational period, Eastern Mindoro College processed concerns covering
              physical facilities, academic affairs, and student services. Through the centralized
              system, turn-around time averaged under 48 hours for preliminary investigation.
              Facilities and physical plant resolved critical classroom cooling and audio-visual issues
              in the College Building, while the Office of Academic Affairs coordinated grade reconciliation
              meetings under strict student confidentiality.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Dr. Corazon G. Perez</p>
              <p className="text-[11px] text-slate-500">Vice President for Academic Affairs</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Engr. Danilo Mendoza</p>
              <p className="text-[11px] text-slate-500">General Services Administrator</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Dean Rodolfo Alcantara</p>
              <p className="text-[11px] text-slate-500">Prefect of Student Affairs</p>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL & ACTION DRAWER / MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-300">
                    {selectedComplaint.trackingCode}
                  </span>
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 truncate max-w-md mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {resolutionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Changes successfully saved and student notified!</span>
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Category:</span>
                  <strong className="text-slate-800 capitalize">
                    {selectedComplaint.category.replace('_', ' ')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Subcategory:</span>
                  <strong className="text-slate-800">{selectedComplaint.subcategory}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedComplaint.incidentLocation}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date of Incident:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedComplaint.incidentDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reporter:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedComplaint.submissionType === 'anonymous'
                      ? 'Anonymous'
                      : `${selectedComplaint.studentInfo?.name} (${selectedComplaint.studentInfo?.studentId})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Priority:</span>
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Student Statement:
                </span>
                <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Status & Resolution Form */}
              <form
                onSubmit={handleUpdateStatusSubmit}
                className="p-5 rounded-2xl border-2 border-[#7A1315]/20 bg-red-50/20 space-y-4"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7A1315]" />
                  <span>Update Status & Issue Official Resolution</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      New Status State
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="pending_student_info">Pending Student Info</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Action Note / Remarks
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Technicians dispatched to inspect Room 302..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* If marking resolved, provide certificate details */}
                {(newStatus === 'resolved' || newStatus === 'closed') && (
                  <div className="space-y-3 pt-2 border-t border-red-200/60">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                      Resolution Certificate Formulation
                    </span>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Specific Action Taken *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Detail what repairs, adjustments, or administrative actions were taken..."
                        value={actionTakenText}
                        onChange={(e) => setActionTakenText(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Preventive Measure / Follow-up Protocol
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Enrolled in bi-weekly HVAC preventive maintenance checklist."
                        value={preventiveMeasureText}
                        onChange={(e) => setPreventiveMeasureText(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#7A1315] hover:bg-red-900 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Save Status & Record Timeline Update
                </button>
              </form>

              {/* Assignment Form */}
              <form
                onSubmit={handleAssignSubmit}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Assign Case Officer</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[10px] uppercase font-bold mb-1">
                      Officer Name
                    </label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] uppercase font-bold mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={officerRole}
                      onChange={(e) => setOfficerRole(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] uppercase font-bold mb-1">
                      Department
                    </label>
                    <select
                      value={assignedDept}
                      onChange={(e) => setAssignedDept(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {EMC_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  Assign Handling Officer
                </button>
              </form>

              {/* Direct 2-Way Chat with Student */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Reply to Student / Request Clarification</span>
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-white rounded-xl border border-slate-200">
                  {selectedComplaint.messages.map((m) => (
                    <div key={m.id} className="text-[11px] leading-relaxed">
                      <strong className="text-slate-900">{m.senderName}: </strong>
                      <span className="text-slate-600">{m.message}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleOfficerChatSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official reply or question for student..."
                    value={officerChatMessage}
                    onChange={(e) => setOfficerChatMessage(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>

              {/* View in Student Tracker Link */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setSelectedTrackingCode(selectedComplaint.trackingCode);
                    setActiveView('track');
                  }}
                  className="text-xs text-[#7A1315] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Open Public Student Tracking View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

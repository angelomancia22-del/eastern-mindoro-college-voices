import React from 'react';
import { ComplaintCategory, ComplaintStatus, PriorityLevel } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Hourglass,
  Layers,
  GraduationCap,
  Wrench,
  Users,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' | 'lg' }> = ({
  status,
  size = 'md',
}) => {
  const configs: Record<ComplaintStatus, { label: string; bg: string; text: string; icon: any }> = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-blue-50 border-blue-200 text-blue-700',
      text: 'text-blue-700',
      icon: Clock,
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      text: 'text-amber-700',
      icon: Hourglass,
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      text: 'text-indigo-700',
      icon: Layers,
    },
    pending_student_info: {
      label: 'Pending Student Info',
      bg: 'bg-purple-50 border-purple-200 text-purple-700',
      text: 'text-purple-700',
      icon: HelpCircle,
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      text: 'text-emerald-700',
      icon: CheckCircle2,
    },
    closed: {
      label: 'Closed',
      bg: 'bg-slate-100 border-slate-200 text-slate-700',
      text: 'text-slate-700',
      icon: CheckCircle2,
    },
  };

  const config = configs[status] || configs.submitted;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const configs: Record<PriorityLevel, { label: string; bg: string }> = {
    low: { label: 'Low', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
    medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: 'High', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    urgent: { label: 'Urgent', bg: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold' },
  };

  const config = configs[priority] || configs.low;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${config.bg}`}
    >
      {priority === 'urgent' && <AlertCircle className="w-3 h-3 animate-pulse text-rose-600" />}
      {config.label}
    </span>
  );
};

export const CategoryIcon: React.FC<{ category: ComplaintCategory; className?: string }> = ({
  category,
  className = 'w-5 h-5',
}) => {
  switch (category) {
    case 'academic':
      return <GraduationCap className={className} />;
    case 'facilities':
      return <Wrench className={className} />;
    case 'student_services':
      return <Users className={className} />;
    case 'administrative':
      return <Building2 className={className} />;
    case 'discipline_conduct':
      return <ShieldAlert className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export const formatCategoryName = (category: ComplaintCategory): string => {
  switch (category) {
    case 'academic':
      return 'Academic Affairs';
    case 'facilities':
      return 'Campus Facilities & Physical Plant';
    case 'student_services':
      return 'Student Services & Support';
    case 'administrative':
      return 'Administrative Matters';
    case 'discipline_conduct':
      return 'Discipline & Conduct';
    default:
      return 'Other Inquiries';
  }
};

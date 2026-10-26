import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bell,
  Menu,
  X,
  Shield,
  User,
  Briefcase,
  SlidersHorizontal,
  CheckCheck,
  Search,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedTrackingCode,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) return;
    setSelectedTrackingCode(quickSearchInput.trim().toUpperCase());
    setActiveView('track');
    setQuickSearchInput('');
    setMobileMenuOpen(false);
  };

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
    student: {
      label: 'Student View',
      icon: User,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      desc: 'Submit concerns, monitor progress, chat with officers',
    },
    officer: {
      label: 'Handling Officer (Staff)',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-700 border-blue-300',
      desc: 'Process assigned tickets, post updates, respond to students',
    },
    admin: {
      label: 'College Executive / Admin',
      icon: SlidersHorizontal,
      color: 'bg-purple-50 text-purple-700 border-purple-300',
      desc: 'Comprehensive oversight, reports, audit logs & bottleneck metrics',
    },
  };

  const CurrentRoleIcon = roleLabels[currentRole].icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Academic Ribbon */}
      <div className="bg-[#7A1315] text-white text-xs px-4 py-1.5 font-medium flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">EASTERN MINDORO COLLEGE, INC.</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-200">Bongabong, Oriental Mindoro, Philippines</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden md:inline text-amber-200/90 font-mono">EMC Helpdesk Portal v2.6</span>
          <span className="bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30">
            Active Semester 2026-2027
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7A1315] to-[#500c0d] flex items-center justify-center text-amber-300 shadow-md border-2 border-amber-400/40 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 fill-amber-400/20 stroke-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#7A1315] transition-colors">
                  EMC ConcernHub
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                Student Concern & Complaint Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'home'
                  ? 'bg-slate-100 text-[#7A1315] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveView('submit')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
                activeView === 'submit'
                  ? 'bg-[#7A1315] text-white shadow-red-950/20'
                  : 'bg-red-50 text-[#7A1315] hover:bg-red-100 border border-red-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              File Concern
            </button>
            <button
              onClick={() => setActiveView('track')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'track'
                  ? 'bg-slate-100 text-[#7A1315] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Track Status
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'admin'
                  ? 'bg-slate-100 text-[#7A1315] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Personnel & Admin
            </button>
            <button
              onClick={() => setActiveView('evaluation')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'evaluation'
                  ? 'bg-slate-100 text-[#7A1315] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              System Evaluation <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono">Obj. 7</span>
            </button>
          </nav>

          {/* Quick Track Input + Role Switcher + Notification Bell */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Track Search on Desktop */}
            <form onSubmit={handleQuickTrack} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="Track code (e.g. 1042)..."
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="w-44 text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#7A1315] focus:border-transparent transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition shadow-2xs ${roleLabels[currentRole].color}`}
                title="Switch active user perspective"
              >
                <CurrentRoleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-40 p-2 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-800 flex items-center justify-between">
                      <span>Simulate User Role</span>
                      <span className="text-[10px] text-slate-600 uppercase">Interactive Demo</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {(['student', 'officer', 'admin'] as UserRole[]).map((role) => {
                        const ItemIcon = roleLabels[role].icon;
                        const isCurrent = currentRole === role;
                        return (
                          <button
                            key={role}
                            onClick={() => {
                              setCurrentRole(role);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition ${
                              isCurrent
                                ? 'bg-slate-100 text-slate-900 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="p-1 rounded bg-slate-200/60 mt-0.5">
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span>{roleLabels[role].label}</span>
                                {isCurrent && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-normal mt-0.5">
                                {roleLabels[role].desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#7A1315] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden text-xs">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-100 text-[#7A1315] font-semibold px-2 py-0.5 rounded-full text-[11px]">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-[#7A1315] hover:underline flex items-center gap-1 font-medium"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-600">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              if (notif.trackingCode) {
                                setSelectedTrackingCode(notif.trackingCode);
                                setActiveView('track');
                                setNotifDropdownOpen(false);
                              }
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                              !notif.read ? 'bg-amber-50/40' : ''
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#7A1315]" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 leading-snug">
                                {notif.title}
                              </p>
                              <p className="text-slate-600 mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-600">
                                <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {notif.trackingCode && (
                                  <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                                    {notif.trackingCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Quick Track Input */}
          <form onSubmit={handleQuickTrack} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter EMC tracking code..."
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#7A1315]"
            />
            <button
              type="submit"
              className="bg-[#7A1315] text-white px-3.5 py-2 rounded-lg text-sm font-medium"
            >
              Track
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm text-left font-medium ${
                activeView === 'home' ? 'bg-[#7A1315] text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('submit');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm text-left font-medium ${
                activeView === 'submit' ? 'bg-[#7A1315] text-white' : 'bg-red-50 text-[#7A1315]'
              }`}
            >
              File Concern
            </button>
            <button
              onClick={() => {
                setActiveView('track');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm text-left font-medium ${
                activeView === 'track' ? 'bg-[#7A1315] text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              Track Status
            </button>
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm text-left font-medium ${
                activeView === 'admin' ? 'bg-[#7A1315] text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              Admin & Staff
            </button>
            <button
              onClick={() => {
                setActiveView('evaluation');
                setMobileMenuOpen(false);
              }}
              className={`col-span-2 p-2.5 rounded-lg text-sm text-left font-medium flex items-center justify-between ${
                activeView === 'evaluation' ? 'bg-[#7A1315] text-white' : 'bg-amber-50 text-amber-900'
              }`}
            >
              <span>Acceptance Evaluation Matrix (Obj. 7)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-200/80">ISO 25010</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

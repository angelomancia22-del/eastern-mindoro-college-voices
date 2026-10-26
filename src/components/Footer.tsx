import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, MapPin, Mail, Phone, Award, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, resetDemoData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Institutional Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-[#7A1315] flex items-center justify-center text-amber-300 font-bold border border-amber-400/40">
                <Shield className="w-5 h-5 fill-amber-400/20 stroke-amber-300" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  EASTERN MINDORO COLLEGE, INC.
                </span>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  Student Concern & Complaint Management System
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Committed to providing an organized, transparent, and responsive platform that
              empowers students, supports administrative accountability, and fosters a positive
              learning environment at Eastern Mindoro College, Inc.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Bagumbayan, Bongabong, Oriental Mindoro 5211, Philippines</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>student.affairs@emc.edu.ph | helpdesk@emc.edu.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>(043) 283-5012 / 0917-889-EMCI</span>
              </div>
            </div>
          </div>

          {/* Quick Portal Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('submit')}
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  File a Student Concern
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('track')}
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  Track Concern Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  Personnel & Admin Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('evaluation')}
                  className="hover:text-amber-300 transition cursor-pointer"
                >
                  ISO 25010 Acceptance Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Academic Compliance
            </h4>
            <div className="space-y-2 text-[11px] leading-relaxed text-slate-400">
              <p>
                Strictly adheres to the <strong>Data Privacy Act of 2012 (RA 10173)</strong> and
                EMC Student Handbook Grievance Procedures.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Reset demo data to initial Eastern Mindoro College records?')) {
                      resetDemoData();
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Eastern Mindoro College, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Research & Development Thesis Project</span>
            <span>•</span>
            <span>Virtus, Scientia, Patria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

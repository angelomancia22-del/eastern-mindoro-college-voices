/**
 * Eastern Mindoro College, Inc. - Student Concern & Complaint Management System
 * Built for academic excellence, service responsiveness, and data-driven improvements.
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { SubmitConcernView } from './views/SubmitConcernView';
import { TrackConcernView } from './views/TrackConcernView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { EvaluationView } from './views/EvaluationView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeView === 'home' && <HomeView />}
          {activeView === 'submit' && <SubmitConcernView />}
          {activeView === 'track' && <TrackConcernView />}
          {activeView === 'admin' && <AdminDashboardView />}
          {activeView === 'evaluation' && <EvaluationView />}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintStatus,
  EvaluationCriterionScore,
  PriorityLevel,
  ResolutionSummary,
  StudentFeedback,
  SystemNotification,
  UserRole,
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_EVALUATIONS, INITIAL_NOTIFICATIONS } from '../data/seedData';

interface AppContextType {
  complaints: Complaint[];
  notifications: SystemNotification[];
  evaluations: EvaluationCriterionScore[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedTrackingCode: string | null;
  setSelectedTrackingCode: (code: string | null) => void;
  activeView: 'home' | 'submit' | 'track' | 'admin' | 'evaluation' | 'about';
  setActiveView: (view: 'home' | 'submit' | 'track' | 'admin' | 'evaluation' | 'about') => void;
  createComplaint: (complaintData: Omit<Complaint, 'id' | 'trackingCode' | 'pinCode' | 'status' | 'createdAt' | 'updatedAt' | 'timeline' | 'messages'>) => Complaint;
  updateStatus: (
    id: string,
    newStatus: ComplaintStatus,
    note: string,
    actorName: string,
    actorRole: string,
    resolution?: ResolutionSummary
  ) => void;
  assignPersonnel: (id: string, name: string, role: string, department: string) => void;
  updatePriority: (id: string, newPriority: PriorityLevel) => void;
  sendMessage: (complaintId: string, messageText: string, sender: 'student' | 'officer', senderName: string) => void;
  submitFeedback: (complaintId: string, feedback: StudentFeedback) => void;
  addEvaluation: (evalData: Omit<EvaluationCriterionScore, 'id' | 'evaluatedAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'emc_complaints_v1',
  NOTIFICATIONS: 'emc_notifications_v1',
  EVALUATIONS: 'emc_evaluations_v1',
  ROLE: 'emc_current_role_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [evaluations, setEvaluations] = useState<EvaluationCriterionScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'student';
    } catch {
      return 'student';
    }
  });

  const [activeView, setActiveView] = useState<'home' | 'submit' | 'track' | 'admin' | 'evaluation' | 'about'>('home');
  const [selectedTrackingCode, setSelectedTrackingCode] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [evaluations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [currentRole]);

  // Create new complaint
  const createComplaint = (
    complaintData: Omit<Complaint, 'id' | 'trackingCode' | 'pinCode' | 'status' | 'createdAt' | 'updatedAt' | 'timeline' | 'messages'>
  ): Complaint => {
    const timestamp = new Date().toISOString();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `EMC-2026-${randomDigits}`;
    const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
    const id = `emc-comp-${Date.now()}`;

    const newComplaint: Complaint = {
      ...complaintData,
      id,
      trackingCode,
      pinCode,
      status: 'submitted',
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'submitted',
          title: 'Concern Filed via Student Web Portal',
          note: `Student submitted concern under category: ${complaintData.category.toUpperCase().replace('_', ' ')} (${complaintData.subcategory}).`,
          actor: complaintData.submissionType === 'anonymous' ? 'Anonymous Student' : complaintData.studentInfo?.name || 'Student',
          actorRole: 'Student',
          timestamp,
          isPublic: true,
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          senderName: 'EMC Automated Dispatch',
          message: `Greetings! Your concern has been received by Eastern Mindoro College Central Helpdesk under Tracking No. ${trackingCode}. Target Office: ${complaintData.departmentTarget}. You will receive real-time updates as personnel review your submission.`,
          timestamp,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Push notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: `Concern Logged: ${trackingCode}`,
      message: `Your complaint "${complaintData.title.slice(0, 45)}..." was successfully registered. Save PIN: ${pinCode}`,
      trackingCode,
      createdAt: timestamp,
      read: false,
      type: 'status_change',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newComplaint;
  };

  // Update status
  const updateStatus = (
    id: string,
    newStatus: ComplaintStatus,
    note: string,
    actorName: string,
    actorRole: string,
    resolution?: ResolutionSummary
  ) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const timelineEntry = {
          id: `tl-${Date.now()}`,
          status: newStatus,
          title: `Status changed to: ${newStatus.replace('_', ' ').toUpperCase()}`,
          note: note || `Official status updated by ${actorName} (${actorRole}).`,
          actor: actorName,
          actorRole,
          timestamp,
          isPublic: true,
        };

        const updated: Complaint = {
          ...c,
          status: newStatus,
          updatedAt: timestamp,
          timeline: [...c.timeline, timelineEntry],
          ...(resolution ? { resolutionSummary: resolution } : {}),
        };

        // Notify
        const notif: SystemNotification = {
          id: `notif-${Date.now()}`,
          title: `Update on ${c.trackingCode}`,
          message: `Status is now ${newStatus.replace('_', ' ').toUpperCase()}. Note: ${note.slice(0, 50)}...`,
          trackingCode: c.trackingCode,
          createdAt: timestamp,
          read: false,
          type: newStatus === 'resolved' ? 'resolved' : 'status_change',
        };
        setNotifications((n) => [notif, ...n]);

        return updated;
      })
    );
  };

  // Assign Personnel
  const assignPersonnel = (id: string, name: string, role: string, department: string) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const updated: Complaint = {
          ...c,
          assignedPersonnel: {
            name,
            role,
            department,
            assignedAt: timestamp,
          },
          updatedAt: timestamp,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              status: c.status,
              title: `Assigned to ${name}`,
              note: `Designated ${role} (${department}) as case investigator / handling officer.`,
              actor: 'Administration',
              actorRole: 'System Dispatch',
              timestamp,
              isPublic: true,
            },
          ],
        };

        // Notification
        const notif: SystemNotification = {
          id: `notif-${Date.now()}`,
          title: `Assigned: ${c.trackingCode}`,
          message: `Your concern has been assigned to ${name} (${role}).`,
          trackingCode: c.trackingCode,
          createdAt: timestamp,
          read: false,
          type: 'assigned',
        };
        setNotifications((n) => [notif, ...n]);

        return updated;
      })
    );
  };

  // Update Priority
  const updatePriority = (id: string, newPriority: PriorityLevel) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          priority: newPriority,
          updatedAt: timestamp,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              status: c.status,
              title: `Priority Adjusted to ${newPriority.toUpperCase()}`,
              note: `Priority level revised based on severity and instructional assessment.`,
              actor: 'Staff Reviewer',
              actorRole: 'Administrative Staff',
              timestamp,
              isPublic: true,
            },
          ],
        };
      })
    );
  };

  // Send message in 2-way thread
  const sendMessage = (complaintId: string, messageText: string, sender: 'student' | 'officer', senderName: string) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          message: messageText,
          timestamp,
        };

        const updated = {
          ...c,
          updatedAt: timestamp,
          messages: [...c.messages, newMsg],
        };

        // If officer sent, create notification for student
        if (sender === 'officer') {
          const notif: SystemNotification = {
            id: `notif-${Date.now()}`,
            title: `New Message: ${c.trackingCode}`,
            message: `${senderName}: "${messageText.slice(0, 45)}..."`,
            trackingCode: c.trackingCode,
            createdAt: timestamp,
            read: false,
            type: 'new_message',
          };
          setNotifications((n) => [notif, ...n]);
        }

        return updated;
      })
    );
  };

  // Submit Feedback
  const submitFeedback = (complaintId: string, feedback: StudentFeedback) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          feedback,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Add Evaluation Criterion
  const addEvaluation = (evalData: Omit<EvaluationCriterionScore, 'id' | 'evaluatedAt'>) => {
    const newEval: EvaluationCriterionScore = {
      ...evalData,
      id: `eval-${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
    };
    setEvaluations((prev) => [newEval, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEvaluations(INITIAL_EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        complaints,
        notifications,
        evaluations,
        currentRole,
        setCurrentRole,
        selectedTrackingCode,
        setSelectedTrackingCode,
        activeView,
        setActiveView,
        createComplaint,
        updateStatus,
        assignPersonnel,
        updatePriority,
        sendMessage,
        submitFeedback,
        addEvaluation,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

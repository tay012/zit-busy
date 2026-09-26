import { createContext, useContext, useCallback, useRef, type ReactNode } from 'react';
import type { BusyBand, Report } from '../types';
import { TTL } from '../data/constants';

interface ReportsContextValue {
  reports: Record<string, Report>;
  submitReport: (name: string, level: BusyBand) => Report;
  getReport: (name: string) => Report | undefined;
}

const ReportsContext = createContext<ReportsContextValue>(null!);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const reportsRef = useRef<Record<string, Report>>({});

  const submitReport = useCallback((name: string, level: BusyBand): Report => {
    const p = reportsRef.current[name];
    const fresh = p && Date.now() - p.at < TTL;
    const report: Report = {
      level,
      at: Date.now(),
      count: fresh && p.level === level ? p.count + 1 : 1,
    };
    reportsRef.current[name] = report;
    return report;
  }, []);

  const getReport = useCallback((name: string): Report | undefined => {
    return reportsRef.current[name];
  }, []);

  return (
    <ReportsContext.Provider value={{ reports: reportsRef.current, submitReport, getReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}

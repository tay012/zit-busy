import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import type { BusyBand, Report } from '../types';
import { TTL } from '../data/constants';

interface ReportsContextValue {
  reports: Record<string, Report>;
  submitReport: (name: string, level: BusyBand) => Report;
  getReport: (name: string) => Report | undefined;
}

const ReportsContext = createContext<ReportsContextValue>(null!);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Record<string, Report>>({});

  const submitReport = useCallback((name: string, level: BusyBand): Report => {
    let result!: Report;
    setReports((prev) => {
      const p = prev[name];
      const fresh = p && Date.now() - p.at < TTL;
      result = {
        level,
        at: Date.now(),
        count: fresh && p.level === level ? p.count + 1 : 1,
      };
      return { ...prev, [name]: result };
    });
    return result;
  }, []);

  const getReport = useCallback((name: string): Report | undefined => {
    return reports[name];
  }, [reports]);

  return (
    <ReportsContext.Provider value={{ reports, submitReport, getReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}

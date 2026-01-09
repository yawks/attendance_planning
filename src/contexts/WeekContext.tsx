import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getWeekId } from '@/lib/date-utils';

interface WeekContextType {
  weekId: string;
  setWeekId: (weekId: string) => void;
}

const WeekContext = createContext<WeekContextType | undefined>(undefined);

export function WeekProvider({ children }: { children: ReactNode }) {
  const [weekId, setWeekId] = useState<string>(() => {
    const savedWeekId = sessionStorage.getItem('weekId');
    return savedWeekId || getWeekId();
  });

  useEffect(() => {
    sessionStorage.setItem('weekId', weekId);
  }, [weekId]);

  const value = {
    weekId,
    setWeekId,
  };

  return <WeekContext.Provider value={value}>{children}</WeekContext.Provider>;
}

export function useWeek() {
  const context = useContext(WeekContext);
  if (context === undefined) {
    throw new Error('useWeek must be used within a WeekProvider');
  }
  return context;
}

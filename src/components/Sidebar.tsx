import { useState, useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { useWeek } from '@/contexts/WeekContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { getDaysInWeek, weekIdToDate, getWeekId } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { fr } from 'date-fns/locale';
import { DayClickEventHandler } from 'react-day-picker';

export function Sidebar() {
  const { isDesktopCollapsed, toggleDesktopSidebar, isMobileOpen, setMobileOpen } = useLayout();
  const { weekId, setWeekId } = useWeek();
  const { user } = useAuth();
  const { getPresences, setContractHolderStatus, loading } = useGoogleSheets();
  const [isContractHolder, setIsContractHolder] = useState(false);

  // Local state to manage the month displayed in the sidebar calendar
  const [month, setMonth] = useState(weekIdToDate(weekId));

  // This effect ensures that if the weekId changes elsewhere (e.g., via WeekSelector),
  // the sidebar calendar jumps to the correct month.
  useEffect(() => {
    setMonth(weekIdToDate(weekId));
  }, [weekId]);

  useEffect(() => {
    if (user?.email) {
      getPresences(weekId).then(data => {
        const userPresences = data.filter(p => p.userEmail === user.email);
        const isHolder = userPresences.some(p => p.isContractHolder);
        setIsContractHolder(isHolder);
      });
    }
  }, [weekId, user, getPresences]);

  const handleContractHolderToggle = async (checked: boolean) => {
    setIsContractHolder(checked);
    await setContractHolderStatus(weekId, checked);
  };

  const days = getDaysInWeek(weekId);

  const handleDayClick: DayClickEventHandler = (day) => {
    setWeekId(getWeekId(day));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="bg-black/60 fixed inset-0 z-10 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "bg-background border-r flex flex-col fixed inset-y-0 left-0 z-20 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 pb-4 border-b mb-4 p-4 h-[65px]",
          isDesktopCollapsed && "justify-center"
        )}>
          <img src="/icons/logo.png" alt="Presence Tracker Logo" className="h-8 w-8 flex-shrink-0" />
          <h2 className={cn(
            "text-xl font-bold transition-opacity duration-200 whitespace-nowrap",
            isDesktopCollapsed && "lg:opacity-0 lg:w-0"
          )}>
            Presence Tracker
          </h2>
        </div>

        <div className={cn("flex-1 px-4", isDesktopCollapsed && "lg:hidden")}>
          <Calendar
            key={weekId}
            mode="range"
            selected={{ from: days[0], to: days[4] }}
            month={month}
            onMonthChange={setMonth}
            onDayClick={handleDayClick}
            locale={fr}
            className="rounded-md border"
            showOutsideDays={false}
          />

          <div className="mt-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label htmlFor="contract-holder" className="font-medium">
              Titulaire d'un contrat
            </Label>
            <Switch
              id="contract-holder"
              checked={isContractHolder}
              onCheckedChange={handleContractHolderToggle}
              disabled={loading}
            />
          </div>
        </div>

        <div className="p-2 border-t mt-auto hidden lg:block">
          <Button variant="ghost" onClick={toggleDesktopSidebar} className="w-full justify-center">
            <ChevronsLeft className={cn("h-5 w-5 transition-transform", isDesktopCollapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>
    </>
  );
}

import { useLayout } from '@/contexts/LayoutContext';
import { useWeek } from '@/contexts/WeekContext';
import { getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { fr } from 'date-fns/locale';

export function Sidebar() {
  const { isDesktopCollapsed, toggleDesktopSidebar, isMobileOpen, setMobileOpen } = useLayout();
  const { weekId } = useWeek();

  const days = getDaysInWeek(weekId);

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
          // Mobile drawer logic
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop collapse logic
          "lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 pb-4 border-b mb-4 p-4 h-[65px]", // Fixed height to match header
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
            month={days[0]}
            locale={fr}
            className="rounded-md border"
            hideNav
            showOutsideDays={false}
            disabled={(date) =>
              !days.find((d) => toISODateString(d) === toISODateString(date))
            }
          />
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

import { Button } from "./ui/button";
import { getNextWeekId, getPreviousWeekId } from "@/lib/date-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekSelectorProps {
  weekId: string;
  setWeekId: (weekId: string) => void;
}

export function WeekSelector({ weekId, setWeekId }: WeekSelectorProps) {
  const handlePreviousWeek = () => {
    setWeekId(getPreviousWeekId(weekId));
  };

  const handleNextWeek = () => {
    setWeekId(getNextWeekId(weekId));
  };

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold w-32 text-center">{weekId}</span>
      <Button variant="outline" size="icon" onClick={handleNextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

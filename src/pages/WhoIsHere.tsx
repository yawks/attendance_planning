import { useWeek } from '@/contexts/WeekContext';
import { WeekSelector } from '@/components/WeekSelector';
import { WhoIsHereDisplay } from '@/components/WhoIsHereDisplay';
import { Card, CardContent } from '@/components/ui/card';

export function WhoIsHerePage() {
  const { weekId, setWeekId } = useWeek();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <WeekSelector weekId={weekId} setWeekId={setWeekId} />
        </CardContent>
      </Card>
      <WhoIsHereDisplay weekId={weekId} />
    </div>
  );
}

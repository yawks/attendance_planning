import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleSheets, PresenceValue } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Home } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

const DayCardSkeleton = () => (
  <div className="p-3 bg-muted/40 rounded-md flex flex-col gap-2">
    <div className="text-center">
      <Skeleton className="h-5 w-12 mx-auto" />
      <Skeleton className="h-4 w-10 mx-auto mt-1" />
    </div>
    <div className="flex flex-col gap-2 mt-2 flex-grow">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export function MyPresencesPage() {
  const { user } = useAuth();
  const { getPresences, setPresence, loading } = useGoogleSheets();
  const [weekId, setWeekId] = useState(getWeekId());
  const [presences, setPresences] = useState<Map<string, PresenceValue>>(new Map());

  useEffect(() => {
    if (user?.email) {
      getPresences(weekId).then(data => {
        const userPresences = data.filter(p => p.userEmail === user.email);
        const presenceMap = new Map<string, PresenceValue>();
        userPresences.forEach(p => {
          if (p.presence === 'Bureau' || p.presence === 'Maison') {
            presenceMap.set(p.date, p.presence);
          }
        });
        setPresences(presenceMap);
      });
    }
  }, [weekId, user, getPresences]);

  const handlePresenceChange = (date: string, value: PresenceValue) => {
    if (!user?.email) return;

    const newPresences = new Map(presences);
    newPresences.set(date, value);
    setPresences(newPresences);

    setPresence(date, weekId, value);
  };

  const days = getDaysInWeek(weekId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes présences</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <WeekSelector weekId={weekId} setWeekId={setWeekId} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <DayCardSkeleton key={i} />)
            ) : (
              days.map(day => {
                const dateString = toISODateString(day);
                const currentPresence = presences.get(dateString);
                return (
                  <div key={dateString} className="p-3 bg-muted/40 rounded-md flex flex-col gap-2">
                    <div className="text-center">
                      <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                      <p className="text-sm text-muted-foreground">{format(day, 'd/MM', { locale: fr })}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 flex-grow">
                      <Button
                        variant={currentPresence === 'Bureau' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handlePresenceChange(dateString, 'Bureau')}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Bureau
                      </Button>
                      <Button
                        variant={currentPresence === 'Maison' ? 'secondary' : 'outline'}
                        className="w-full"
                        onClick={() => handlePresenceChange(dateString, 'Maison')}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Maison
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <Calendar
            mode="multiple"
            selected={days}
            month={days[0]}
            ISOWeek
            locale={fr}
            className="rounded-md border"
          />
        </div>
      </CardContent>
    </Card>
  );
}

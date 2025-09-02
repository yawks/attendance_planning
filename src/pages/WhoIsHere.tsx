import { useState, useEffect } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface PresentUser {
  name: string;
  imageUrl: string;
}

type PresencesByDay = Map<string, PresentUser[]>;

const DayColumnSkeleton = () => (
  <div className="p-3 bg-muted/40 rounded-md flex flex-col gap-2">
    <div className="text-center border-b pb-2 mb-2">
      <Skeleton className="h-5 w-20 mx-auto" />
      <Skeleton className="h-4 w-12 mx-auto mt-1" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-1.5">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center gap-2 p-1.5">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

export function WhoIsHerePage() {
  const { getPresences, loading } = useGoogleSheets();
  const [weekId, setWeekId] = useState(getWeekId());
  const [presencesByDay, setPresencesByDay] = useState<PresencesByDay>(new Map());

  useEffect(() => {
    getPresences(weekId).then(data => {
      const byDay: PresencesByDay = new Map();
      data.forEach(p => {
        if (p.presence === 'Bureau') {
          const users = byDay.get(p.date) || [];
          users.push({
            name: p.userName || p.userEmail,
            imageUrl: p.userImageURL,
          });
          byDay.set(p.date, users);
        }
      });
      setPresencesByDay(byDay);
    });
  }, [weekId, getPresences]);

  const days = getDaysInWeek(weekId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qui est au bureau cette semaine ?</CardTitle>
        <CardDescription>Récapitulatif des personnes présentes au bureau.</CardDescription>
      </CardHeader>
      <CardContent>
        <WeekSelector weekId={weekId} setWeekId={setWeekId} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <DayColumnSkeleton key={i} />)
          ) : (
            days.map(day => {
              const dateString = toISODateString(day);
              const presentUsers = presencesByDay.get(dateString) || [];
              return (
                <div key={dateString} className="p-3 bg-muted/40 rounded-md flex flex-col gap-2">
                  <div className="text-center border-b pb-2 mb-2">
                    <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                    <p className="text-sm text-muted-foreground">{format(day, 'd/MM', { locale: fr })}</p>
                  </div>
                  <div className="space-y-2">
                    {presentUsers.length > 0 ? (
                      presentUsers.map(person => (
                        <div key={person.name} className="flex items-center gap-2 p-1.5 text-xs">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={person.imageUrl} alt={person.name} />
                          <AvatarFallback name={person.name} />
                          </Avatar>
                          <span className="font-medium truncate">{person.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center mt-2">Personne.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

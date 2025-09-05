import { useState, useEffect } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresentUser {
  name: string;
  isContractHolder: boolean;
}

type PresencesByDay = Map<string, PresentUser[]>;

const DayColumnSkeleton = () => (
  <div className="p-3 bg-muted/40 rounded-md flex flex-col gap-2">
    <div className="text-center border-b pb-2 mb-2">
      <Skeleton className="h-5 w-20 mx-auto" />
      <Skeleton className="h-4 w-12 mx-auto mt-1" />
      <div className="border-t border-dashed mt-1 pt-1">
        <Skeleton className="h-4 w-16 mx-auto" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-1.5">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

interface WhoIsHereDisplayProps {
  weekId: string;
}

export function WhoIsHereDisplay({ weekId }: WhoIsHereDisplayProps) {
  const { getPresences, loading } = useGoogleSheets();
  const [presencesByDay, setPresencesByDay] = useState<PresencesByDay>(new Map());

  useEffect(() => {
    getPresences(weekId).then(data => {
      const byDay: PresencesByDay = new Map();
      data.forEach(p => {
        if (p.presence === 'Bureau') {
          const users = byDay.get(p.date) || [];
          users.push({
            name: p.userName || p.userEmail,
            isContractHolder: p.isContractHolder,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <DayColumnSkeleton key={i} />)
          ) : (
            days.map(day => {
              const dateString = toISODateString(day);
              const presentUsers = presencesByDay.get(dateString) || [];
              presentUsers.sort((a, b) => Number(b.isContractHolder) - Number(a.isContractHolder));

              const hasContractHolder = presentUsers.some(p => p.isContractHolder);

              return (
                <div
                  key={dateString}
                  className={cn(
                    'p-3 bg-muted/40 rounded-md flex flex-col gap-2',
                    presentUsers.length > 0 &&
                      (hasContractHolder
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30')
                  )}
                >
                  <div className="text-center border-b pb-2 mb-2">
                    <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                    <p className="text-sm text-muted-foreground">{format(day, 'd/MM', { locale: fr })}</p>
                    {presentUsers.length > 0 && (
                      <p className="text-xs text-muted-foreground pt-1 mt-1 border-t border-dashed">
                        {`${presentUsers.length} ${presentUsers.length === 1 ? 'personne' : 'personnes'}`}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {presentUsers.length > 0 ? (
                      presentUsers.map(person => (
                        <div key={person.name} className="flex items-center gap-2 p-1.5 text-xs">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback name={person.name} />
                          </Avatar>
                          <span className="font-medium truncate">{person.name}</span>
                          {person.isContractHolder && <Star className="h-4 w-4 text-yellow-400 ml-auto" />}
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

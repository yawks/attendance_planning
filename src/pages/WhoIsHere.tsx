import { useState, useEffect } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { getWeekId, getDaysInWeek, toISODateString } from '@/lib/date-utils';
import { WeekSelector } from '@/components/WeekSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';

type PresencesByDay = Map<string, string[]>;

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
          users.push(p.userName || p.userEmail);
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
        {loading && <div className="text-center p-4">Chargement...</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mt-4">
          {days.map(day => {
            const dateString = toISODateString(day);
            const presentUsers = presencesByDay.get(dateString) || [];
            return (
              <div key={dateString} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex flex-col gap-2">
                <div className="text-center border-b pb-2 mb-2">
                  <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{format(day, 'd/MM', { locale: fr })}</p>
                </div>
                <div className="space-y-2">
                  {presentUsers.length > 0 ? (
                    presentUsers.map(name => (
                      <div key={name} className="flex items-center gap-2 p-1.5 text-xs border rounded-md bg-background">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium truncate">{name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic text-center mt-2">Personne.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

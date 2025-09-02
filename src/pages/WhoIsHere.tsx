import { useState, useEffect } from 'react';
import { useGoogleSheets, PresenceData } from '@/hooks/useGoogleSheets';
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
        // Only show users who are at the 'Bureau'
        if (p.presence === 'Bureau') {
          const users = byDay.get(p.date) || [];
          // Use userName, fallback to userEmail if userName is not available
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
        <div className="space-y-6 mt-4">
          {days.map(day => {
            const dateString = toISODateString(day);
            const presentUsers = presencesByDay.get(dateString) || [];
            return (
              <div key={dateString}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="font-semibold text-lg capitalize">
                    {format(day, 'eeee d MMMM', { locale: fr })}
                  </h3>
                </div>
                {presentUsers.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {presentUsers.map(name => (
                      <div key={name} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        <span className="text-sm font-medium truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic px-2">Personne au bureau.</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
